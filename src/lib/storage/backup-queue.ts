import { config } from "@/config";
import type { Prisma } from "@/lib/prisma-types";
import { resolveOwnerUploadLocation } from "./locations";
import { getStoragePreference } from "./settings";

export function isLocalLocation(location: { id: string; snapshot?: unknown }) {
  return (
    location.id.startsWith("local:") ||
    (location.snapshot as { kind?: string } | undefined)?.kind === "local"
  );
}
export async function queueImageBackup(
  db: Prisma.TransactionClient,
  imageId: string,
  location: { id: string; ownerId: string; snapshot?: unknown },
) {
  if (!isLocalLocation(location)) return;
  const preference = await getStoragePreference(location.ownerId);
  if (!preference?.localBackupConnectionId) return;
  const target = await resolveOwnerUploadLocation(
    location.ownerId,
    preference.localBackupConnectionId,
  );
  const image = await db.image.findUniqueOrThrow({
    where: { id: imageId },
    include: {
      variants: true,
      applications: {
        include: {
          application: {
            select: { id: true, name: true, slug: true, ownerId: true },
          },
          folder: true,
        },
      },
    },
  });
  const allFolders: Prisma.FolderGetPayload<object>[] = [];
  let ids = [
    ...new Set(
      image.applications.flatMap((entry) =>
        entry.folderId ? [entry.folderId] : [],
      ),
    ),
  ];
  const fetched = new Set<string>();
  while (ids.length) {
    const batch = await db.folder.findMany({ where: { id: { in: ids } } });
    for (const folder of batch) fetched.add(folder.id);
    allFolders.push(...batch);
    ids = [
      ...new Set(
        batch.flatMap((folder) =>
          folder.parentId && !fetched.has(folder.parentId)
            ? [folder.parentId]
            : [],
        ),
      ),
    ];
  }
  const byId = new Map(allFolders.map((folder) => [folder.id, folder]));
  const folders: typeof allFolders = [],
    seen = new Set<string>();
  const add = (id: string | null) => {
    if (!id || seen.has(id)) return;
    seen.add(id);
    const folder = byId.get(id);
    if (!folder) return;
    add(folder.parentId);
    folders.push(folder);
  };
  for (const entry of image.applications) add(entry.folderId);
  await db.storageJob.create({
    data: {
      ownerId: location.ownerId,
      kind: "backup",
      payload: JSON.parse(
        JSON.stringify({
          target: preference.localBackupConnectionId,
          targetLocation: {
            storageLocationId: target.id,
            storageConfig: target.snapshot,
            ownerId: location.ownerId,
          },
          image,
          folders,
        }),
      ),
    },
  });
}
export async function queueRawBackup(
  db: Prisma.TransactionClient,
  ownerId: string,
  source: string,
  key: string,
  role?: string | null,
  namespacePrefix = "",
) {
  const local =
    source === "local" ||
    (source === "default" && config.storage.provider === "local");
  if (!local) return;
  const preference = await getStoragePreference(ownerId);
  if (!preference?.localBackupConnectionId) return;
  const target = await resolveOwnerUploadLocation(
    ownerId,
    preference.localBackupConnectionId,
  );
  await db.storageJob.create({
    data: {
      ownerId,
      kind: "backup",
      payload: JSON.parse(
        JSON.stringify({
          target: preference.localBackupConnectionId,
          targetLocation: {
            storageLocationId: target.id,
            storageConfig: target.snapshot,
            ownerId,
          },
          raw: {
            source,
            key,
            fullKey: namespacePrefix + key,
            namespacePrefix,
            disk: role === "admin",
          },
        }),
      ),
    },
  });
}

export type BackupImage = Prisma.ImageGetPayload<{
  include: {
    variants: true;
    applications: {
      include: {
        application: {
          select: { id: true; name: true; slug: true; ownerId: true };
        };
        folder: true;
      };
    };
  };
}>;
export type BackupPayload = {
  target: string;
  targetLocation?: {
    storageLocationId: string;
    storageConfig?: unknown;
    ownerId: string;
  };
  image?: BackupImage;
  folders?: Prisma.FolderGetPayload<object>[];
  raw?: {
    source: string;
    key: string;
    namespacePrefix: string;
    fullKey?: string;
    disk: boolean;
  };
};
