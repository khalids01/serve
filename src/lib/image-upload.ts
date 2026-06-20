import { prisma } from "@/lib/prisma";
import { FileStorageService } from "@/lib/file-storage";
import { contentHash16 } from "@/lib/storage/hash";
import { formatImageResponse, imageInclude } from "@/lib/image-response";
import type { Prisma } from "@/lib/prisma-types";

type ImageWithRelations = Prisma.ImageGetPayload<{ include: typeof imageInclude }>;

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "P2002"
  );
}

async function linkImageToApplication(
  imageId: string,
  applicationId: string,
  originalName: string,
  tags?: string[] | null,
): Promise<ImageWithRelations> {
  await prisma.imageApplication.upsert({
    where: {
      imageId_applicationId: { imageId, applicationId },
    },
    create: {
      imageId,
      applicationId,
      originalName,
      tags: tags ?? undefined,
    },
    update: {
      originalName,
      tags: tags ?? undefined,
      updatedAt: new Date(),
    },
  });

  return prisma.image.findUniqueOrThrow({
    where: { id: imageId },
    include: imageInclude,
  });
}

async function createImageWithStorage(
  buffer: Buffer,
  originalName: string,
  contentType: string,
  applicationId: string,
  tags?: string[] | null,
): Promise<ImageWithRelations> {
  const fileStorage = new FileStorageService();
  const uploadResult = await fileStorage.saveFile(
    buffer,
    originalName,
    contentType,
  );

  return prisma.image.create({
    data: {
      hash: uploadResult.id,
      filename: uploadResult.filename,
      contentType: uploadResult.contentType,
      sizeBytes: uploadResult.sizeBytes,
      width: uploadResult.width,
      height: uploadResult.height,
      variants: {
        create: uploadResult.variants.map((variant) => ({
          label: variant.label,
          filename: variant.filename,
          width: variant.width,
          height: variant.height,
          sizeBytes: variant.sizeBytes,
        })),
      },
      applications: {
        create: {
          applicationId,
          originalName: uploadResult.originalName,
          tags: tags ?? undefined,
        },
      },
    },
    include: imageInclude,
  });
}

export async function processImageUpload(
  buffer: Buffer,
  originalName: string,
  contentType: string,
  applicationId: string,
  tags?: string[] | null,
) {
  const hash = contentHash16(buffer);
  const existing = await prisma.image.findUnique({
    where: { hash },
    include: imageInclude,
  });

  if (existing) {
    const image = await linkImageToApplication(
      existing.id,
      applicationId,
      originalName,
      tags,
    );
    return formatImageResponse(image, applicationId);
  }

  try {
    const image = await createImageWithStorage(
      buffer,
      originalName,
      contentType,
      applicationId,
      tags,
    );
    return formatImageResponse(image, applicationId);
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }

    const raced = await prisma.image.findUnique({
      where: { hash },
      include: imageInclude,
    });
    if (!raced) {
      throw error;
    }

    const image = await linkImageToApplication(
      raced.id,
      applicationId,
      originalName,
      tags,
    );
    return formatImageResponse(image, applicationId);
  }
}
