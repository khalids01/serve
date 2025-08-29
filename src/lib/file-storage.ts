import fs from "fs/promises";
import path from "path";
import { env } from "@/env";
import { contentHash16 } from "@/lib/storage/hash";
import {
  resolveBaseUploadDir,
  ensureDirectoryExists,
  getAppDir,
} from "@/lib/storage/paths";
import {
  readMetadata,
  downscaleIfTooLarge,
  optimizeOriginal,
  toWebp,
  normalizeRasterFormat,
  placeholder,
  placeholderWebp,
} from "@/lib/storage/image";
import type { FileUploadResult } from "@/lib/storage/types";


export class FileStorageService {
  private baseUploadDir: string;

  constructor(baseUploadDir = env.UPLOAD_DIR || "uploads") {
    this.baseUploadDir = resolveBaseUploadDir(baseUploadDir);
  }

  async ensureDirectoryExists(dirPath: string): Promise<void> {
    await ensureDirectoryExists(dirPath);
  }

  async saveFile(
    buffer: Buffer,
    originalName: string,
    applicationId: string,
    contentType: string
  ): Promise<FileUploadResult> {
    const fileId = contentHash16(buffer);
    const ext = path.extname(originalName);
    const filename = `${fileId}${ext}`;

    const appDir = getAppDir(this.baseUploadDir, applicationId);
    await this.ensureDirectoryExists(appDir);

    const filePath = path.join(appDir, filename);
    await fs.writeFile(filePath, buffer);

    const result: FileUploadResult = {
      id: fileId,
      filename,
      originalName,
      contentType,
      sizeBytes: buffer.length,
      variants: [],
    };

    // Process image files
    if (contentType.startsWith("image/")) {
      try {
        const metadata = await readMetadata(buffer);
        result.width = metadata.width;
        result.height = metadata.height;

        // Optionally downscale very large images to reduce file size
        const downscaled = await downscaleIfTooLarge(buffer, env.ORIGINAL_MAX_DIM);
        let processedBuffer = downscaled.buffer;
        result.width = downscaled.width ?? result.width;
        result.height = downscaled.height ?? result.height;

        // 1) Optimize the original in its native format (mobile-friendly)
        try {
          const format = (metadata.format || "").toLowerCase();
          const optimizedBuffer = await optimizeOriginal(processedBuffer, format);
          await fs.writeFile(filePath, optimizedBuffer);
          result.sizeBytes = optimizedBuffer.length;

          // 2) Generate a same-dimensions WebP copy for the web (if not already WebP)
          if (format !== "webp") {
            const webpBuffer = await toWebp(processedBuffer, 80);
            const webpFilename = `${fileId}.webp`;
            const webpPath = path.join(appDir, webpFilename);
            await fs.writeFile(webpPath, webpBuffer);

            const webpMeta = await readMetadata(webpBuffer);
            result.variants.push({
              label: "webp",
              filename: webpFilename,
              width: webpMeta.width,
              height: webpMeta.height,
              sizeBytes: webpBuffer.length,
            });
          }
        } catch (e) {
          console.error("Error optimizing original or generating WebP:", e);
        }

        // 3) Generate blurred placeholders (very small, blurred) for fast preview
        try {
          const normalizedOrigExt = normalizeRasterFormat(metadata.format);
          // Only generate for supported raster formats
          if (normalizedOrigExt) {
            // Placeholder (original format)
            const placeholderBuf = await placeholder(
              processedBuffer,
              normalizedOrigExt,
              env.PLACEHOLDER_WIDTH,
              env.PLACEHOLDER_QUALITY,
            );

            const placeholderFilename = `${fileId}-placeholder.${normalizedOrigExt}`;
            const placeholderPath = path.join(appDir, placeholderFilename);
            await fs.writeFile(placeholderPath, placeholderBuf);

            const phMeta = await readMetadata(placeholderBuf);
            result.variants.push({
              label: "placeholder",
              filename: placeholderFilename,
              width: phMeta.width,
              height: phMeta.height,
              sizeBytes: placeholderBuf.length,
            });

            // Placeholder WebP (skip duplicate if original is already webp)
            if (normalizedOrigExt !== "webp") {
              const placeholderWebpBuf = await placeholderWebp(
                processedBuffer,
                env.PLACEHOLDER_WIDTH,
                60,
              );
              const placeholderWebpFilename = `${fileId}-placeholder.webp`;
              const placeholderWebpPath = path.join(
                appDir,
                placeholderWebpFilename
              );
              await fs.writeFile(placeholderWebpPath, placeholderWebpBuf);

              const phWebpMeta = await readMetadata(placeholderWebpBuf);
              result.variants.push({
                label: "placeholder-webp",
                filename: placeholderWebpFilename,
                width: phWebpMeta.width,
                height: phWebpMeta.height,
                sizeBytes: placeholderWebpBuf.length,
              });
            }
          }
        } catch (e) {
          console.error("Error generating placeholders:", e);
        }

        // Skip generating preset size variants to reduce storage.
        // On-demand resizing is supported via `/api/img/:name?w=...&h=...`.
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    return result;
  }

  async deleteFile(filename: string, applicationId: string): Promise<void> {
    const appDir = path.join(this.baseUploadDir, applicationId);
    const filePath = path.join(appDir, filename);

    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  getFileUrl(filename: string, applicationId: string): string {
    // Public serving is handled by the image route; application scoping is internal
    return `/api/img/${filename}`;
  }
}
