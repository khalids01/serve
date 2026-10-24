import path from "node:path";
import { withBlobLock } from "@/lib/blob-lock";
import { FileStorageService } from "@/lib/file-storage";
import { getLegacyTenantKeys, imageInclude } from "@/lib/image-response";
import { prisma } from "@/lib/prisma";
import { objectKey } from "@/lib/storage/keys";
import {
  getStorageForImage,
  StorageLocationError,
} from "@/lib/storage/locations";
import { deleteBlobAndLegacyCacheByBase } from "@/lib/storage/read";
export async function purgeFileEntry(id: string, applicationId: string) {
  const initial = await prisma.imageApplication.findFirst({
    where: { OR: [{ id }, { imageId: id }], applicationId },
    include: { image: true },
  });
  if (!initial) throw new StorageLocationError("File not found.", 404);
  return withBlobLock(
    `${initial.image.storageLocationId}:${initial.image.hash}`,
    async (tx) => {
      const entry = await tx.imageApplication.findUnique({
        where: { id: initial.id },
        include: { image: { include: imageInclude } },
      });
      if (!entry || entry.applicationId !== applicationId)
        throw new StorageLocationError("File not found.", 404);
      if (entry.imageId !== initial.imageId)
        throw new StorageLocationError(
          "The file changed. Refresh and retry.",
          409,
        );
      await tx.imageApplication.delete({ where: { id: entry.id } });
      const remaining = await tx.imageApplication.count({
        where: { imageId: entry.imageId },
      });
      if (remaining)
        return { id: entry.id, unlinked: true as const, storageDeleted: false };
      const image = entry.image,
        storage = await getStorageForImage(image),
        files = new FileStorageService(storage),
        legacy = getLegacyTenantKeys(image);
      for (const filename of [
        image.filename,
        ...image.variants.map((value) => value.filename),
      ]) {
        await files.deleteBlobFile(filename);
        for (const tenant of legacy)
          await storage.delete(objectKey(tenant, filename));
      }
      await deleteBlobAndLegacyCacheByBase(
        storage,
        path.parse(image.filename).name,
        legacy,
      );
      await tx.image.delete({ where: { id: image.id } });
      return { id: entry.id, unlinked: true as const, storageDeleted: true };
    },
  );
}

// Retryable collection of blobs left without logical entries by a storage move.
export async function collectUnusedImages(ownerId: string) {
  const images = await prisma.image.findMany({
    where: { ownerId, applications: { none: {} } },
    include: imageInclude,
  });
  for (const image of images)
    await withBlobLock(
      `${image.storageLocationId}:${image.hash}`,
      async (tx) => {
        if (await tx.imageApplication.count({ where: { imageId: image.id } }))
          return;
        const storage = await getStorageForImage(image),
          files = new FileStorageService(storage);
        for (const filename of [
          image.filename,
          ...image.variants.map((value) => value.filename),
        ])
          await files.deleteBlobFile(filename);
        await deleteBlobAndLegacyCacheByBase(
          storage,
          path.parse(image.filename).name,
          [],
        );
        await tx.image.deleteMany({
          where: { id: image.id, applications: { none: {} } },
        });
      },
    );
}
