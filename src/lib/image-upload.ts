import { withBlobLock } from "@/lib/blob-lock";
import { FileStorageService } from "@/lib/file-storage";
import { formatImageResponse, imageInclude } from "@/lib/image-response";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/prisma-types";
import { contentHash16 } from "@/lib/storage/hash";
import {
  resolveUploadLocation,
  StorageLocationError,
  withOwnerStorageLock,
} from "@/lib/storage/locations";

type ImageWithRelations = Prisma.ImageGetPayload<{
  include: typeof imageInclude;
}>;

async function createImageWithStorage(
  db: Prisma.TransactionClient,
  buffer: Buffer,
  originalName: string,
  contentType: string,
  applicationId: string,
  tags: string[] | null | undefined,
  location: Awaited<ReturnType<typeof resolveUploadLocation>>,
): Promise<ImageWithRelations> {
  const fileStorage = new FileStorageService(location.storage);
  const uploadResult = await fileStorage.saveFile(
    buffer,
    originalName,
    contentType,
  );

  return db.image.create({
    data: {
      hash: uploadResult.id,
      ownerId: location.ownerId,
      storageLocationId: location.id,
      storageConfig: location.snapshot,
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
  options: { folderId?: string | null; storageLocationId?: string } = {},
) {
  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
    select: { ownerId: true },
  });
  return withOwnerStorageLock(application.ownerId, async () => {
    const location = await resolveUploadLocation(
      applicationId,
      options.storageLocationId,
    );
    if (options.folderId) {
      const folder = await prisma.folder.findFirst({
        where: { id: options.folderId, applicationId, deletedAt: null },
      });
      if (!folder) throw new StorageLocationError("Folder not found.", 404);
    }
    const hash = contentHash16(buffer);
    return withBlobLock(`${location.id}:${hash}`, async (db) => {
      let image = await db.image.findUnique({
        where: {
          storageLocationId_hash: { storageLocationId: location.id, hash },
        },
        include: imageInclude,
      });
      let entryId: string;
      if (image) {
        const entry = await db.imageApplication.create({
          data: {
            imageId: image.id,
            applicationId,
            originalName,
            tags: tags ?? undefined,
            folderId: options.folderId ?? null,
          },
        });
        entryId = entry.id;
        image = await db.image.findUniqueOrThrow({
          where: { id: image.id },
          include: imageInclude,
        });
      } else {
        image = await createImageWithStorage(
          db,
          buffer,
          originalName,
          contentType,
          applicationId,
          tags,
          location,
        );
        const entry = image.applications.find(
          (value) => value.applicationId === applicationId,
        );
        if (!entry) throw new Error("Upload entry missing");
        entryId = entry.id;
        if (options.folderId)
          await db.imageApplication.update({
            where: { id: entryId },
            data: { folderId: options.folderId },
          });
      }
      return { ...formatImageResponse(image, applicationId, entryId), entryId };
    });
  });
}
