import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";

// Hard cap to avoid extreme CPU usage
const MAX_DIMENSION = 4096;

function clamp(n: number | null): number | null {
  if (n == null) return null;
  if (Number.isNaN(n)) return null;
  return Math.max(1, Math.min(MAX_DIMENSION, Math.floor(n)));
}

function clampQuality(n: number | null): number | null {
  if (n == null) return null;
  if (Number.isNaN(n)) return null;
  return Math.max(1, Math.min(100, Math.floor(n)));
}

function getTargetExt(format?: string | null): "jpg" | "png" | "webp" | "avif" {
  const f = (format || "").toLowerCase();
  if (f === "webp") return "webp";
  if (f === "png") return "png";
  if (f === "avif") return "avif";
  return "jpg";
}

function getContentTypeByExt(ext: string): string {
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string }> }
) {
  try {
    const { name: rawName } = await context.params;
    const url = new URL(request.url);

    const wParam = url.searchParams.get("width") || url.searchParams.get("w");
    const hParam = url.searchParams.get("height") || url.searchParams.get("h");
    const fmtParam = url.searchParams.get("format") || url.searchParams.get("f");
    const qParam = url.searchParams.get("quality") || url.searchParams.get("q");

    const width = clamp(wParam ? parseInt(wParam, 10) : null);
    const height = clamp(hParam ? parseInt(hParam, 10) : null);
    const quality = clampQuality(qParam ? parseInt(qParam, 10) : null);

    // Parse name: either `id.ext` or just `id`
    let requestedExt: string | null = null;
    let baseName = rawName;
    if (rawName.includes(".")) {
      const dot = rawName.lastIndexOf(".");
      baseName = rawName.slice(0, dot);
      requestedExt = rawName.slice(dot + 1).toLowerCase();
    }
    // Fetch image by base id (supports switching extension)
    const image = await prisma.image.findUnique({
      where: { id: baseName },
      select: {
        id: true,
        filename: true,
        applicationId: true,
        contentType: true,
        application: { select: { slug: true } },
      },
    });

    // console.debug('Public image request:', rawName, { width, height, format: fmtParam || null })

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const baseUploads = process.env.UPLOAD_DIR || "uploads";
    const uploadsRoot = path.isAbsolute(baseUploads)
      ? baseUploads
      : path.join(process.cwd(), baseUploads);
    const dirKey = image.application?.slug || image.applicationId;
    const uploadsDir = path.join(uploadsRoot, dirKey);
    const legacyUploadsDir = path.join(uploadsRoot, image.applicationId);

    const originalPathPrimary = path.join(uploadsDir, image.filename);
    const originalPathLegacy = path.join(legacyUploadsDir, image.filename);

    const origExt = path.extname(image.filename).replace(".", "").toLowerCase();
    const targetExt = getTargetExt(fmtParam || requestedExt || origExt);

    // If no resize and requested format matches original (or no ext provided), stream the original
    if (!width && !height && targetExt === origExt) {
      try {
        let buf: Buffer;
        try {
          buf = await fs.readFile(originalPathPrimary);
        } catch {
          buf = await fs.readFile(originalPathLegacy);
        }
        const body = buf.buffer.slice(
          buf.byteOffset,
          buf.byteOffset + buf.byteLength
        );
        return new NextResponse(body as ArrayBuffer, {
          status: 200,
          headers: {
            "Content-Type": image.contentType || "application/octet-stream",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch (e) {
        return NextResponse.json(
          { error: "Original file not found" },
          { status: 404 }
        );
      }
    }

    // If no resize and requested format differs from original, try prebuilt same-dimension file (e.g., webp) first
    if (!width && !height && targetExt !== origExt) {
      const prebuiltPrimary = path.join(uploadsDir, `${baseName}.${targetExt}`);
      const prebuiltLegacy = path.join(legacyUploadsDir, `${baseName}.${targetExt}`);
      try {
        let buf: Buffer;
        try {
          buf = await fs.readFile(prebuiltPrimary);
        } catch {
          buf = await fs.readFile(prebuiltLegacy);
        }
        const body = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return new NextResponse(body as ArrayBuffer, {
          status: 200,
          headers: {
            "Content-Type": getContentTypeByExt(targetExt),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } catch {}
    }

    // Prepare cache
    const base = baseName;
    const cacheDir = path.join(uploadsDir, "_cache");
    await fs.mkdir(cacheDir, { recursive: true });

    const cacheName = `${base}${width ? `_w${width}` : ""}${
      height ? `_h${height}` : ""
    }${quality ? `_q${quality}` : ""}.${targetExt}`;
    const cachePath = path.join(cacheDir, cacheName);

    // Serve from cache when available
    try {
      const cached = await fs.readFile(cachePath);
      const body = cached.buffer.slice(
        cached.byteOffset,
        cached.byteOffset + cached.byteLength
      );
      return new NextResponse(body as ArrayBuffer, {
        status: 200,
        headers: {
          "Content-Type": getContentTypeByExt(targetExt),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {}

    // Generate on demand
    let original: Buffer;
    try {
      original = await fs.readFile(originalPathPrimary);
    } catch {
      original = await fs.readFile(originalPathLegacy);
    }

    let pipeline = sharp(original);
    if (width || height) {
      pipeline = pipeline.resize(width || undefined, height || undefined, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    if (targetExt === "webp") pipeline = pipeline.webp({ quality: quality ?? 80 });
    else if (targetExt === "png")
      pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: quality ?? 80 });
    else if (targetExt === "avif") pipeline = pipeline.avif({ quality: quality ?? 50 });
    else pipeline = pipeline.jpeg({ quality: quality ?? 85, mozjpeg: true });

    const out = await pipeline.toBuffer();
    await fs.writeFile(cachePath, out);

    const body = out.buffer.slice(
      out.byteOffset,
      out.byteOffset + out.byteLength
    );
    return new NextResponse(body as ArrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": getContentTypeByExt(targetExt),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Public image serve error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
