import path from "path";
import { config } from "@/config";
import { contentHash16 } from "@/lib/storage/hash";
import { objectKey } from "@/lib/storage/keys";
import { getStorage } from "@/lib/storage/factory";
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
  private storage = getStorage();

  async saveFile(
    buffer: Buffer,
    originalName: string,
    tenantKey: string,
    contentType: string,
  ): Promise<FileUploadResult> {
    const fileId = contentHash16(buffer);
    const ext = path.extname(originalName);
    const filename = `${fileId}${ext}`;

    await this.storage.put(objectKey(tenantKey, filename), buffer, {
      contentType,
    });

    const result: FileUploadResult = {
      id: fileId,
      filename,
      originalName,
      contentType,
      sizeBytes: buffer.length,
      variants: [],
    };

    const OPTIMIZABLE_MIME_TYPES = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (OPTIMIZABLE_MIME_TYPES.includes(contentType)) {
      try {
        const metadata = await readMetadata(buffer);
        result.width = metadata.width;
        result.height = metadata.height;

        const downscaled = await downscaleIfTooLarge(
          buffer,
          config.image.originalMaxDim,
        );
        let processedBuffer = downscaled.buffer;
        result.width = downscaled.width ?? result.width;
        result.height = downscaled.height ?? result.height;

        try {
          const format = (metadata.format || "").toLowerCase();
          const optimizedBuffer = await optimizeOriginal(
            processedBuffer,
            format,
          );
          await this.storage.put(objectKey(tenantKey, filename), optimizedBuffer, {
            contentType,
          });
          result.sizeBytes = optimizedBuffer.length;

          if (format !== "webp") {
            const webpBuffer = await toWebp(processedBuffer, 80);
            const webpFilename = `${fileId}.webp`;
            await this.storage.put(
              objectKey(tenantKey, webpFilename),
              webpBuffer,
              { contentType: "image/webp" },
            );

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

        try {
          const normalizedOrigExt = normalizeRasterFormat(metadata.format);
          if (normalizedOrigExt) {
            const placeholderBuf = await placeholder(
              processedBuffer,
              normalizedOrigExt,
              config.image.placeholderWidth,
              config.image.placeholderQuality,
            );

            const placeholderFilename = `${fileId}-placeholder.${normalizedOrigExt}`;
            await this.storage.put(
              objectKey(tenantKey, placeholderFilename),
              placeholderBuf,
              { contentType: `image/${normalizedOrigExt === "jpg" ? "jpeg" : normalizedOrigExt}` },
            );

            const phMeta = await readMetadata(placeholderBuf);
            result.variants.push({
              label: "placeholder",
              filename: placeholderFilename,
              width: phMeta.width,
              height: phMeta.height,
              sizeBytes: placeholderBuf.length,
            });

            if (normalizedOrigExt !== "webp") {
              const placeholderWebpBuf = await placeholderWebp(
                processedBuffer,
                config.image.placeholderWidth,
                60,
              );
              const placeholderWebpFilename = `${fileId}-placeholder.webp`;
              await this.storage.put(
                objectKey(tenantKey, placeholderWebpFilename),
                placeholderWebpBuf,
                { contentType: "image/webp" },
              );

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
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }

    return result;
  }

  async deleteFile(filename: string, tenantKey: string): Promise<void> {
    await this.storage.delete(objectKey(tenantKey, filename));
  }

  async putRaw(
    tenantKey: string,
    filename: string,
    buffer: Buffer,
    contentType?: string,
  ): Promise<void> {
    await this.storage.put(objectKey(tenantKey, filename), buffer, {
      contentType,
    });
  }

  getFileUrl(filename: string, _tenantKey: string): string {
    return `/api/img/${filename}`;
  }
}
