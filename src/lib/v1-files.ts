import path from "node:path";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/prisma-types";
import { absolute } from "@/lib/v1-api";
import {
  fileAssetSchema,
  getFileKind,
  listFilesInputSchema,
} from "@/lib/v1-contracts";
export const v1ImageInclude = { variants: true } as const;
type Link = Prisma.ImageApplicationGetPayload<{
  include: { image: { include: typeof v1ImageInclude } };
}>;
const mimeByExtension: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
};
export function serializeFile(link: Link) {
  const image = link.image;
  const variants = image.variants.map((variant) => {
    const extension = path.extname(variant.filename).slice(1);
    const placeholder = variant.filename.includes("-placeholder.");
    return {
      id: variant.id,
      label: variant.label,
      contentType: mimeByExtension[extension] ?? image.contentType,
      width: variant.width,
      height: variant.height,
      sizeBytes: variant.sizeBytes,
      url: absolute(
        `/api/img/${encodeURIComponent(image.id)}${placeholder ? "-placeholder" : ""}.${extension}`,
      ),
    };
  });
  return fileAssetSchema.parse({
    id: image.id,
    filename: image.filename,
    originalName: link.originalName,
    contentType: image.contentType,
    kind: getFileKind(image.contentType),
    sizeBytes: image.sizeBytes,
    width: image.width,
    height: image.height,
    tags: Array.isArray(link.tags)
      ? link.tags.filter((tag): tag is string => typeof tag === "string")
      : [],
    createdAt: image.createdAt.toISOString(),
    updatedAt: image.updatedAt.toISOString(),
    urls: {
      content: absolute(`/api/v1/files/${image.id}/content`),
      image: image.contentType.startsWith("image/")
        ? absolute(`/api/img/${image.id}`)
        : null,
      placeholder:
        variants.find(
          (variant) =>
            variant.label.includes("placeholder") &&
            variant.contentType === "image/webp",
        )?.url ??
        variants.find((variant) => variant.label.includes("placeholder"))
          ?.url ??
        null,
    },
    variants,
  });
}
export function linkedFile(id: string, applicationId: string) {
  return prisma.imageApplication.findUnique({
    where: { imageId_applicationId: { imageId: id, applicationId } },
    include: { image: { include: v1ImageInclude } },
  });
}
export function listQuery(params: URLSearchParams, applicationId: string) {
  const raw: Record<string, unknown> = Object.fromEntries(params);
  raw.tags = params.getAll("tags");
  const input = listFilesInputSchema.parse(raw);
  const conditions: Prisma.ImageApplicationWhereInput[] = [{ applicationId }];
  if (input.search)
    conditions.push({
      originalName: { contains: input.search, mode: "insensitive" },
    });
  if (input.contentType)
    conditions.push({ image: { contentType: input.contentType } });
  // Keep kind classification identical to the shared helper, including exclusions.
  if (input.kind !== "all") {
    const simple = ["image", "video", "audio"];
    const documents = [
      "pdf",
      "text/",
      "json",
      "xml",
      "word",
      "document",
      "sheet",
      "excel",
      "presentation",
      "powerpoint",
    ];
    const archives = ["zip", "rar", "7z", "tar", "gzip", "bzip", "compressed"];
    const contains = (parts: string[]): Prisma.ImageWhereInput => ({
      OR: parts.map((part) => ({
        contentType: { contains: part, mode: "insensitive" },
      })),
    });
    const media: Prisma.ImageWhereInput = {
      OR: simple.map((kind) => ({
        contentType: { startsWith: `${kind}/`, mode: "insensitive" },
      })),
    };
    const image: Prisma.ImageWhereInput = simple.includes(input.kind)
      ? { contentType: { startsWith: `${input.kind}/`, mode: "insensitive" } }
      : input.kind === "document"
        ? { AND: [contains(documents), { NOT: media }] }
        : input.kind === "archive"
          ? {
              AND: [
                contains(archives),
                { NOT: media },
                { NOT: contains(documents) },
              ],
            }
          : {
              AND: [
                { NOT: media },
                { NOT: contains(documents) },
                { NOT: contains(archives) },
              ],
            };
    conditions.push({ image });
  }
  for (const tag of input.tags)
    conditions.push({ tags: { array_contains: [tag] } });
  const direction = input.sortOrder;
  const sorts: Record<string, Prisma.ImageApplicationOrderByWithRelationInput> =
    {
      createdAt: { image: { createdAt: direction } },
      updatedAt: { updatedAt: direction },
      name: { originalName: direction },
      size: { image: { sizeBytes: direction } },
      type: { image: { contentType: direction } },
    };
  return {
    input,
    where: { AND: conditions },
    orderBy: [sorts[input.sortBy], { id: direction }],
  };
}
