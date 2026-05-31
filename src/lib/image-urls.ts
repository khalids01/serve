import path from "path";

const PLACEHOLDER_SUFFIX = "-placeholder";

export interface ImageVariantRef {
  label: string;
  filename: string;
}

export function isPlaceholderLabel(label: string): boolean {
  return label === "placeholder" || label === "placeholder-webp";
}

export function isPlaceholderStorageFilename(filename: string): boolean {
  const base = path.parse(filename).name;
  return base.endsWith(PLACEHOLDER_SUFFIX);
}

function normalizeExt(ext: string): string {
  const normalized = ext.replace(/^\./, "").toLowerCase();
  return normalized === "jpeg" ? "jpg" : normalized;
}

function hashFromFilename(filename: string): string {
  return path.parse(filename).name.replace(new RegExp(`${PLACEHOLDER_SUFFIX}$`), "");
}

function storageFilenameToPublicPath(filename: string): string {
  const parsed = path.parse(filename);
  const ext = normalizeExt(parsed.ext);
  const hash = parsed.name.replace(new RegExp(`${PLACEHOLDER_SUFFIX}$`), "");
  if (parsed.name.endsWith(PLACEHOLDER_SUFFIX)) {
    return `/api/img/${hash}.${ext}${PLACEHOLDER_SUFFIX}`;
  }
  return `/api/img/${hash}.${ext}`;
}

export function toImageServeUrl(
  filename: string,
  opts?: { width?: number; height?: number },
): string {
  const basePath = storageFilenameToPublicPath(filename);
  if (isPlaceholderStorageFilename(filename)) {
    return basePath;
  }

  const params = new URLSearchParams();
  if (opts?.width) params.set("w", String(opts.width));
  if (opts?.height) params.set("h", String(opts.height));
  const query = params.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function toPlaceholderUrl(
  filename: string,
  opts?: { variants?: ImageVariantRef[] },
): string | null {
  const variants = opts?.variants ?? [];
  const hasPlaceholderWebp = variants.some((v) => v.label === "placeholder-webp");
  const hasPlaceholder = variants.some((v) => v.label === "placeholder");

  if (!hasPlaceholder && !hasPlaceholderWebp) {
    return null;
  }

  const hash = hashFromFilename(filename);
  const origExt = normalizeExt(path.extname(filename));

  if (hasPlaceholderWebp) {
    return `/api/img/${hash}.webp${PLACEHOLDER_SUFFIX}`;
  }

  return `/api/img/${hash}.${origExt}${PLACEHOLDER_SUFFIX}`;
}

export function variantToServeUrl(
  variant: ImageVariantRef,
  imageFilename: string,
): string {
  const hash = hashFromFilename(imageFilename);
  const origExt = normalizeExt(path.extname(imageFilename));

  switch (variant.label) {
    case "webp":
      return `/api/img/${hash}.webp`;
    case "placeholder":
      return `/api/img/${hash}.${origExt}${PLACEHOLDER_SUFFIX}`;
    case "placeholder-webp":
      return `/api/img/${hash}.webp${PLACEHOLDER_SUFFIX}`;
    default:
      return storageFilenameToPublicPath(variant.filename);
  }
}

export function imagePublicUrl(
  imageFilename: string,
  imageId?: string,
): string {
  const ext = path.extname(imageFilename);
  const hash = hashFromFilename(imageFilename);
  return `/api/img/${imageId ?? hash}${ext}`;
}

export function withImageUrls<T extends { filename: string; variants: ImageVariantRef[] }>(
  image: T,
  imageId?: string,
): T & { url: string; variants: Array<T["variants"][number] & { url: string }> } {
  return {
    ...image,
    url: imagePublicUrl(image.filename, imageId),
    variants: image.variants.map((variant) => ({
      ...variant,
      url: variantToServeUrl(variant, image.filename),
    })),
  };
}
