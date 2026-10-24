import { z } from "zod";

export const fileKinds = [
  "image",
  "video",
  "audio",
  "document",
  "archive",
  "other",
] as const;

export const fileKindSchema = z.enum(fileKinds);
export type FileKind = z.infer<typeof fileKindSchema>;

export const fileVariantSchema = z.object({
  id: z.string(),
  label: z.string(),
  contentType: z.string(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  sizeBytes: z.number().int().nonnegative(),
  url: z.url(),
});

export const fileAssetSchema = z.object({
  id: z.string(),
  filename: z.string(),
  originalName: z.string(),
  contentType: z.string(),
  kind: fileKindSchema,
  sizeBytes: z.number().int().nonnegative(),
  width: z.number().int().positive().nullable(),
  height: z.number().int().positive().nullable(),
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  urls: z.object({
    content: z.url(),
    image: z.url().nullable(),
    placeholder: z.url().nullable(),
  }),
  variants: z.array(fileVariantSchema),
});

export const paginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  total: z.number().int().nonnegative(),
  pages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export const listFilesResponseSchema = z.object({
  data: z.array(fileAssetSchema),
  pagination: paginationSchema,
});

export const fileResponseSchema = z.object({ data: fileAssetSchema });

export const deleteFileResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    unlinked: z.literal(true),
    storageDeleted: z.boolean(),
  }),
});

export const browserTokenResponseSchema = z.object({
  data: z.object({
    token: z.string().min(1),
    expiresAt: z.string().datetime(),
  }),
});

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
    requestId: z.string().optional(),
  }),
});

export type FileVariant = z.infer<typeof fileVariantSchema>;
export type FileAsset = z.infer<typeof fileAssetSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type ListFilesResponse = z.infer<typeof listFilesResponseSchema>;
export type ApiErrorBody = z.infer<typeof apiErrorSchema>;

export type ImageTransform = {
  width?: number;
  height?: number;
  quality?: number;
  format?: "original" | "jpg" | "png" | "webp" | "avif";
};

export function getFileKind(contentType: string): FileKind {
  const mime = contentType.toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (
    /(pdf|text\/|json|xml|word|document|sheet|excel|presentation|powerpoint)/.test(
      mime,
    )
  )
    return "document";
  if (/(zip|rar|7z|tar|gzip|bzip|compressed)/.test(mime)) return "archive";
  return "other";
}

export function joinUrl(baseUrl: string, pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return new URL(pathOrUrl, `${baseUrl.replace(/\/$/, "")}/`).toString();
}

export function imageUrl(
  asset: Pick<FileAsset, "urls">,
  transform: ImageTransform = {},
): string {
  if (!asset.urls.image) return asset.urls.content;
  const url = new URL(asset.urls.image);
  if (transform.width) url.searchParams.set("w", String(transform.width));
  if (transform.height) url.searchParams.set("h", String(transform.height));
  if (transform.quality) url.searchParams.set("q", String(transform.quality));
  if (transform.format && transform.format !== "original")
    url.searchParams.set("f", transform.format);
  return url.toString();
}

export const fileScopeSchema = z.enum([
  "files:read",
  "files:write",
  "files:delete",
]);
export const browserTokenInputSchema = z
  .object({
    scopes: z.array(fileScopeSchema).min(1).max(3),
    allowedOrigins: z
      .array(
        z.string().refine((value) => {
          try {
            const url = new URL(value);
            return (
              ["http:", "https:"].includes(url.protocol) && url.origin === value
            );
          } catch {
            return false;
          }
        }, "Expected an HTTP(S) origin without a path or trailing slash"),
      )
      .min(1)
      .max(20),
    expiresInSeconds: z.number().int().min(1).max(900).default(300),
  })
  .strict();
export const listFilesInputSchema = z
  .object({
    page: z.coerce.number().int().min(1).max(1_000_000).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().max(255).optional(),
    kind: z.enum([...fileKinds, "all"]).default("all"),
    contentType: z.string().max(255).optional(),
    tags: z.array(z.string().min(1).max(64)).max(20).default([]),
    sortBy: z
      .enum(["createdAt", "updatedAt", "name", "size", "type"])
      .default("updatedAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict();
export const uploadTagsSchema = z.array(z.string().min(1).max(64)).max(20);
