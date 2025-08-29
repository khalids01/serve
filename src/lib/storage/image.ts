import sharp, { Metadata } from "sharp";
import { env } from "@/env";

export type NormalizedRasterExt = "jpg" | "png" | "webp" | null;

export async function readMetadata(buffer: Buffer): Promise<Metadata> {
  return sharp(buffer).metadata();
}

export function normalizeRasterFormat(format?: string | null): NormalizedRasterExt {
  const f = (format || "").toLowerCase();
  if (f === "jpeg" || f === "jpg") return "jpg";
  if (f === "png") return "png";
  if (f === "webp") return "webp";
  return null;
}

export async function downscaleIfTooLarge(
  buffer: Buffer,
  maxDim = Number(env.ORIGINAL_MAX_DIM || 2560)
): Promise<{ buffer: Buffer; width?: number; height?: number }>
{
  const image = sharp(buffer);
  const meta = await image.metadata();
  const MAX_DIM = Number.isFinite(maxDim) && maxDim > 0 ? Math.floor(maxDim) : 2560;

  if ((meta.width && meta.width > MAX_DIM) || (meta.height && meta.height > MAX_DIM)) {
    const processedBuffer = await sharp(buffer)
      .resize(MAX_DIM, MAX_DIM, { fit: "inside", withoutEnlargement: true })
      .toBuffer();
    const resizedMeta = await sharp(processedBuffer).metadata();
    return { buffer: processedBuffer, width: resizedMeta.width, height: resizedMeta.height };
  }
  return { buffer, width: meta.width, height: meta.height };
}

export async function optimizeOriginal(
  buffer: Buffer,
  format: string | undefined | null
): Promise<Buffer> {
  const f = (format || "").toLowerCase();
  if (f === "jpeg" || f === "jpg") {
    return sharp(buffer).jpeg({ quality: 80, mozjpeg: true, chromaSubsampling: "4:2:0", progressive: true }).toBuffer();
  }
  if (f === "png") {
    return sharp(buffer).png({ compressionLevel: 9, palette: true, quality: 80, colors: 128 }).toBuffer();
  }
  if (f === "webp") {
    return sharp(buffer).webp({ quality: 80 }).toBuffer();
  }
  return sharp(buffer).toBuffer();
}

export async function toWebp(buffer: Buffer, quality = 80): Promise<Buffer> {
  return sharp(buffer).webp({ quality }).toBuffer();
}

export async function placeholder(
  buffer: Buffer,
  target: Exclude<NormalizedRasterExt, null>,
  width = Number(env.PLACEHOLDER_WIDTH || 24),
  quality = Number(env.PLACEHOLDER_QUALITY || 60)
): Promise<Buffer> {
  const base = sharp(buffer)
    .resize(width, width, { fit: "inside", withoutEnlargement: true })
    .blur(8);

  if (target === "jpg") return base.jpeg({ quality, mozjpeg: true }).toBuffer();
  if (target === "png") return base.png({ palette: true, colors: 64 }).toBuffer();
  return base.webp({ quality }).toBuffer();
}

export async function placeholderWebp(
  buffer: Buffer,
  width = Number(env.PLACEHOLDER_WIDTH || 24),
  quality = 60
): Promise<Buffer> {
  return sharp(buffer)
    .resize(width, width, { fit: "inside", withoutEnlargement: true })
    .blur(8)
    .webp({ quality })
    .toBuffer();
}
