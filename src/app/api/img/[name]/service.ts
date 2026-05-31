import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";
import { prisma } from "@/lib/prisma";
import {
  readTenantFile,
  readTenantCache,
  writeTenantCache,
} from "@/lib/storage/read";
import { uniqueTenantKeys } from "@/lib/storage/keys";
import { getStorage } from "@/lib/storage/factory";

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

const VALID_TARGETS = ["jpg", "png", "webp", "avif"];

function getTargetExt(format?: string | null): string {
  const f = (format || "").toLowerCase();
  if (VALID_TARGETS.includes(f)) return f;
  if (f === "svg") return "svg";
  return "";
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
    case "svg":
      return "image/svg+xml";
    case "mp4":
      return "video/mp4";
    case "pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}

function bufferResponse(buf: Buffer, contentType: string): NextResponse {
  const body = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return new NextResponse(body as ArrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function serveImage(request: NextRequest, rawName: string) {
  try {
    const url = new URL(request.url);
    const storage = getStorage();

    const wParam = url.searchParams.get("width") || url.searchParams.get("w");
    const hParam = url.searchParams.get("height") || url.searchParams.get("h");
    const fmtParam = url.searchParams.get("format") || url.searchParams.get("f");
    const qParam = url.searchParams.get("quality") || url.searchParams.get("q");

    const width = clamp(wParam ? parseInt(wParam, 10) : null);
    const height = clamp(hParam ? parseInt(hParam, 10) : null);
    const quality = clampQuality(qParam ? parseInt(qParam, 10) : null);

    const PLACEHOLDER_SUFFIX = "-placeholder";
    let isPlaceholder = rawName.endsWith(PLACEHOLDER_SUFFIX);
    let imagePathName = isPlaceholder
      ? rawName.slice(0, -PLACEHOLDER_SUFFIX.length)
      : rawName;

    let requestedExt: string | null = null;
    let baseName = imagePathName;
    if (imagePathName.includes(".")) {
      const dot = imagePathName.lastIndexOf(".");
      baseName = imagePathName.slice(0, dot);
      requestedExt = imagePathName.slice(dot + 1).toLowerCase();
    }

    // Legacy pattern: {hash}-placeholder.{ext}
    if (!isPlaceholder && baseName.endsWith(PLACEHOLDER_SUFFIX)) {
      isPlaceholder = true;
    }

    const lookupId = isPlaceholder
      ? baseName.endsWith(PLACEHOLDER_SUFFIX)
        ? baseName.slice(0, -PLACEHOLDER_SUFFIX.length)
        : baseName
      : baseName;

    let image = await prisma.image.findUnique({
      where: { id: lookupId },
      select: {
        id: true,
        filename: true,
        applicationId: true,
        contentType: true,
        application: { select: { slug: true } },
      },
    });

    if (!image) {
      image = await prisma.image.findFirst({
        where: { hash: lookupId },
        select: {
          id: true,
          filename: true,
          applicationId: true,
          contentType: true,
          application: { select: { slug: true } },
        },
      });
    }

    if (!image) {
      image = await prisma.image.findFirst({
        where: { filename: rawName },
        select: {
          id: true,
          filename: true,
          applicationId: true,
          contentType: true,
          application: { select: { slug: true } },
        },
      });
    }

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const tenantKeys = uniqueTenantKeys(
      image.application?.slug,
      image.applicationId,
    );
    const primaryTenantKey = tenantKeys[0] ?? image.applicationId;

    const origExt = path.extname(image.filename).replace(".", "").toLowerCase();

    let targetExt = getTargetExt(fmtParam);
    if (!targetExt && requestedExt) {
      targetExt = getTargetExt(requestedExt);
      if (!targetExt) targetExt = requestedExt;
    }
    if (!targetExt) targetExt = origExt;

    const normalizedOrigExt = origExt === "jpeg" ? "jpg" : origExt;

    const isTransformableTarget = VALID_TARGETS.includes(targetExt);
    const isTransformableSource = [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "avif",
      "tiff",
      "gif",
      "svg",
    ].includes(normalizedOrigExt);

    if (
      !isTransformableSource &&
      targetExt !== normalizedOrigExt &&
      !isPlaceholder
    ) {
      return NextResponse.json(
        { error: "Unsupported output format" },
        { status: 404 },
      );
    }

    const base = path.parse(image.filename).name;

    if (isPlaceholder) {
      if (width || height) {
        return NextResponse.json(
          { error: "Resize not supported for placeholder" },
          { status: 404 },
        );
      }
      const placeholderFilename = `${base}-placeholder.${targetExt}`;
      const buf = await readTenantFile(storage, tenantKeys, placeholderFilename);
      if (!buf) {
        return NextResponse.json({ error: "Variant not found" }, { status: 404 });
      }
      return bufferResponse(buf, getContentTypeByExt(targetExt));
    }

    if (!width && !height && targetExt === normalizedOrigExt) {
      const buf = await readTenantFile(storage, tenantKeys, image.filename);
      if (!buf) {
        return NextResponse.json(
          { error: "Original file not found" },
          { status: 404 },
        );
      }
      return bufferResponse(buf, image.contentType || "application/octet-stream");
    }

    if (!width && !height && targetExt !== normalizedOrigExt) {
      const variantFilename = `${base}.${targetExt}`;
      const buf = await readTenantFile(storage, tenantKeys, variantFilename);
      if (!buf) {
        return NextResponse.json({ error: "Variant not found" }, { status: 404 });
      }
      return bufferResponse(buf, getContentTypeByExt(targetExt));
    }

    const cacheName = `${base}${width ? `_w${width}` : ""}${height ? `_h${height}` : ""}${quality ? `_q${quality}` : ""}.${targetExt}`;

    const cached = await readTenantCache(storage, tenantKeys, cacheName);
    if (cached) {
      return bufferResponse(cached, getContentTypeByExt(targetExt));
    }

    const original = await readTenantFile(storage, tenantKeys, image.filename);
    if (!original) {
      return NextResponse.json(
        { error: "Original file not found" },
        { status: 404 },
      );
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
      pipeline = pipeline.png({
        compressionLevel: 9,
        palette: true,
        quality: quality ?? 80,
      });
    else if (targetExt === "avif")
      pipeline = pipeline.avif({ quality: quality ?? 50 });
    else pipeline = pipeline.jpeg({ quality: quality ?? 85, mozjpeg: true });

    const out = await pipeline.toBuffer();
    await writeTenantCache(
      storage,
      primaryTenantKey,
      cacheName,
      out,
      getContentTypeByExt(targetExt),
    );

    return bufferResponse(out, getContentTypeByExt(targetExt));
  } catch (error) {
    console.error("Public image serve error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 },
    );
  }
}
