import { withBlobLock } from "@/lib/blob-lock";
import { FileStorageService } from "@/lib/file-storage";
import { formatImageResponse, imageInclude } from "@/lib/image-response";
import type { Prisma } from "@/lib/prisma-types";
import { contentHash16 } from "@/lib/storage/hash";

type ImageWithRelations = Prisma.ImageGetPayload<{
  include: typeof imageInclude;
}>;

async function linkImageToApplication(
  db: Prisma.TransactionClient,
  imageId: string,
  applicationId: string,
  originalName: string,
  tags?: string[] | null,
): Promise<ImageWithRelations> {
  await db.imageApplication.upsert({
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

  return db.image.findUniqueOrThrow({
    where: { id: imageId },
    include: imageInclude,
  });
}

async function createImageWithStorage(
  db: Prisma.TransactionClient,
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

  return db.image.create({
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
  return withBlobLock(hash, async (db) => {
    const existing = await db.image.findUnique({
      where: { hash },
      include: imageInclude,
    });

    if (existing) {
      const image = await linkImageToApplication(
        db,
        existing.id,
        applicationId,
        originalName,
        tags,
      );
      return formatImageResponse(image, applicationId);
    }

    const image = await createImageWithStorage(
      db,
      buffer,
      originalName,
      contentType,
      applicationId,
      tags,
    );
    return formatImageResponse(image, applicationId);
  });
}
