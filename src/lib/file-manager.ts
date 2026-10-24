import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { z } from "zod";
import { withBlobLock } from "@/lib/blob-lock";
import { collectUnusedImages, purgeFileEntry } from "@/lib/file-deletion";
import { imageInclude } from "@/lib/image-response";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/prisma-types";
import { blobKey } from "@/lib/storage/keys";
import {
  assertLocationAccess,
  getStorageForImage,
  resolveUploadLocation,
  StorageLocationError,
  withOwnerStorageLock,
} from "@/lib/storage/locations";
import { serializeFile, v1ImageInclude } from "@/lib/v1-files";
export const safeName = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .refine(
    (value) =>
      value !== "." &&
      value !== ".." &&
      // biome-ignore lint/suspicious/noControlCharactersInRegex: Reject control characters in user-provided names.
      !/[/\\\u0000-\u001f\u007f]/.test(value),
    "Names cannot contain slashes or control characters.",
  );
export const managerAction = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("new-folder"),
    name: safeName,
    parentId: z.string().nullable().default(null),
  }),
  z.object({
    action: z.literal("rename"),
    id: z.string(),
    kind: z.enum(["file", "folder"]),
    name: safeName,
  }),
  z.object({
    action: z.enum(["trash", "restore", "purge", "star"]),
    fileIds: z.array(z.string()).max(200).default([]),
    folderIds: z.array(z.string()).max(200).default([]),
    starred: z.boolean().optional(),
  }),
  z.object({
    action: z.enum(["move", "copy"]),
    fileIds: z.array(z.string()).max(200).default([]),
    folderIds: z.array(z.string()).max(200).default([]),
    folderId: z.string().nullable().default(null),
    storageLocationId: z.string().optional(),
  }),
  z.object({ action: z.literal("empty-trash") }),
  z.object({ action: z.literal("set-storage"), storageLocationId: z.string() }),
]);
async function folderExists(applicationId: string, id: string | null) {
  if (!id) return;
  const folder = await prisma.folder.findFirst({
    where: { id, applicationId, deletedAt: null },
  });
  if (!folder)
    throw new StorageLocationError("Destination folder not found.", 404);
}
function choice(id: string) {
  return id.startsWith("default:")
    ? "default"
    : id.startsWith("local:")
      ? "local"
      : id;
}
export async function managerListing(
  applicationId: string,
  params: URLSearchParams,
) {
  const page = Math.max(
      1,
      Math.min(100000, Math.floor(Number(params.get("page")) || 1)),
    ),
    limit = 50,
    view = params.get("view") ?? "files",
    folderId = params.get("folderId") || null,
    search = (params.get("search") ?? "").slice(0, 255),
    kind = params.get("kind") ?? "all";
  await folderExists(applicationId, view === "files" ? folderId : null);
  const where: Prisma.ImageApplicationWhereInput = {
    applicationId,
    deletedAt: view === "trash" ? { not: null } : null,
    ...(view === "starred" ? { starred: true } : {}),
    ...(view === "files" && !search ? { folderId } : {}),
    ...(search
      ? { originalName: { contains: search, mode: "insensitive" } }
      : {}),
    ...(["image", "video", "audio"].includes(kind)
      ? { image: { contentType: { startsWith: `${kind}/` } } }
      : {}),
  };
  const sort = params.get("sort") ?? "name",
    direction = params.get("order") === "desc" ? "desc" : "asc";
  const orders: Record<
    string,
    Prisma.ImageApplicationOrderByWithRelationInput
  > = {
    name: { originalName: direction },
    date: { updatedAt: direction },
    size: { image: { sizeBytes: direction } },
    type: { image: { contentType: direction } },
  };
  const [entries, total, allFolders, app] = await Promise.all([
    prisma.imageApplication.findMany({
      where,
      include: { image: { include: v1ImageInclude } },
      orderBy: [
        view === "recent"
          ? { updatedAt: "desc" }
          : (orders[sort] ?? orders.name),
        { id: "asc" },
      ],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.imageApplication.count({ where }),
    prisma.folder.findMany({
      where: { applicationId },
      orderBy: { name: "asc" },
      take: 2000,
    }),
    prisma.application.findUniqueOrThrow({
      where: { id: applicationId },
      select: { defaultStorageLocationId: true },
    }),
  ]);
  const folders = allFolders.filter((folder) =>
    view === "trash"
      ? folder.deletedAt !== null
      : !folder.deletedAt &&
        view === "files" &&
        (search
          ? folder.name.toLowerCase().includes(search.toLowerCase())
          : folder.parentId === folderId),
  );
  const connectionIds = [
    ...new Set(entries.map((entry) => choice(entry.image.storageLocationId))),
  ].filter((id) => !["default", "local"].includes(id));
  const connectionNames = new Map(
    connectionIds.length
      ? (
          await prisma.storageConnection.findMany({
            where: { id: { in: connectionIds } },
            select: { id: true, name: true },
          })
        ).map((row) => [row.id, row.name])
      : [],
  );
  return {
    files: entries.map((entry) => ({
      ...serializeFile(entry),
      folderId: entry.folderId,
      starred: entry.starred,
      deletedAt: entry.deletedAt,
      storageLocationId: choice(entry.image.storageLocationId),
      storageLocationName: entry.image.storageLocationId.startsWith("default:")
        ? "Default"
        : entry.image.storageLocationId.startsWith("local:")
          ? "Local"
          : (connectionNames.get(entry.image.storageLocationId) ??
            "Saved storage"),
    })),
    folders,
    tree: allFolders.filter((folder) => !folder.deletedAt),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    defaultStorageLocationId: app.defaultStorageLocationId,
  };
}
async function selected(
  applicationId: string,
  fileIds: string[],
  folderIds: string[],
) {
  const [files, folders] = await Promise.all([
    prisma.imageApplication.findMany({
      where: { applicationId, id: { in: [...new Set(fileIds)] } },
      include: { image: { include: imageInclude } },
    }),
    prisma.folder.findMany({
      where: { applicationId, id: { in: [...new Set(folderIds)] } },
    }),
  ]);
  if (
    files.length !== new Set(fileIds).size ||
    folders.length !== new Set(folderIds).size
  )
    throw new StorageLocationError(
      "A selected item was not found in this application.",
      404,
    );
  return { files, folders };
}
export function descendants(
  tree: Array<{ id: string; parentId: string | null }>,
  roots: string[],
) {
  const result = new Set(roots);
  let changed = true;
  while (changed) {
    changed = false;
    for (const folder of tree)
      if (
        folder.parentId &&
        result.has(folder.parentId) &&
        !result.has(folder.id)
      ) {
        result.add(folder.id);
        changed = true;
      }
  }
  return [...result];
}
async function copyBlob(
  entry: Awaited<ReturnType<typeof selected>>["files"][number],
  applicationId: string,
  locationChoice: string,
) {
  const target = await resolveUploadLocation(applicationId, locationChoice);
  if (target.id === entry.image.storageLocationId) return entry.imageId;
  const source = await getStorageForImage(entry.image);
  return withBlobLock(`${target.id}:${entry.image.hash}`, async (tx) => {
    const existing = await tx.image.findUnique({
      where: {
        storageLocationId_hash: {
          storageLocationId: target.id,
          hash: entry.image.hash,
        },
      },
    });

    for (const item of [
      { filename: entry.image.filename, contentType: entry.image.contentType },
      ...entry.image.variants.map((value) => ({
        filename: value.filename,
        contentType: value.filename.endsWith(".webp")
          ? "image/webp"
          : entry.image.contentType,
      })),
    ]) {
      const data = await source.get(blobKey(item.filename));
      if (!data)
        throw new StorageLocationError(
          "Source file is missing from storage.",
          409,
        );
      if (!existing)
        await target.storage.put(blobKey(item.filename), data, {
          contentType: item.contentType,
        });
      const verified = await target.storage.get(blobKey(item.filename));
      if (
        !verified ||
        createHash("sha256").update(data).digest("hex") !==
          createHash("sha256").update(verified).digest("hex")
      )
        throw new StorageLocationError(
          "Copy verification failed. The original file has been retained.",
          502,
        );
    }
    if (existing) return existing.id;
    const image = await tx.image.create({
      data: {
        hash: entry.image.hash,
        ownerId: target.ownerId,
        storageLocationId: target.id,
        storageConfig: target.snapshot,
        filename: entry.image.filename,
        contentType: entry.image.contentType,
        sizeBytes: entry.image.sizeBytes,
        width: entry.image.width,
        height: entry.image.height,
        variants: {
          create: entry.image.variants.map(
            ({ label, filename, width, height, sizeBytes }) => ({
              label,
              filename,
              width,
              height,
              sizeBytes,
            }),
          ),
        },
      },
    });
    return image.id;
  });
}
export function managerOperation(
  applicationId: string,
  ownerId: string,
  body: unknown,
) {
  return withOwnerStorageLock(ownerId, () =>
    performOperation(applicationId, ownerId, body),
  );
}
async function performOperation(
  applicationId: string,
  ownerId: string,
  body: unknown,
) {
  const input = managerAction.parse(body);
  if (input.action === "set-storage") {
    await assertLocationAccess(ownerId, input.storageLocationId);
    await prisma.application.update({
      where: { id: applicationId },
      data: { defaultStorageLocationId: input.storageLocationId },
    });
    return { success: true };
  }
  if (input.action === "new-folder") {
    await folderExists(applicationId, input.parentId);
    return prisma.$transaction(async (tx) => {
      await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtextextended(${`folders:${applicationId}`},0))`;
      if ((await tx.folder.count({ where: { applicationId } })) >= 2000)
        throw new StorageLocationError("Folder limit reached.");
      if (
        await tx.folder.findFirst({
          where: {
            applicationId,
            parentId: input.parentId,
            name: { equals: input.name, mode: "insensitive" },
            deletedAt: null,
          },
        })
      )
        throw new StorageLocationError(
          "A folder with this name already exists.",
          409,
        );
      return {
        folder: await tx.folder.create({
          data: { applicationId, parentId: input.parentId, name: input.name },
        }),
      };
    });
  }
  if (input.action === "rename") {
    if (input.kind === "file") {
      const entry = await prisma.imageApplication.findFirst({
        where: { id: input.id, applicationId, deletedAt: null },
      });
      if (!entry) throw new StorageLocationError("File not found.", 404);
      await prisma.imageApplication.update({
        where: { id: entry.id },
        data: { originalName: input.name },
      });
    } else {
      const folder = await prisma.folder.findFirst({
        where: { id: input.id, applicationId, deletedAt: null },
      });
      if (!folder) throw new StorageLocationError("Folder not found.", 404);
      if (
        await prisma.folder.findFirst({
          where: {
            applicationId,
            parentId: folder.parentId,
            name: { equals: input.name, mode: "insensitive" },
            deletedAt: null,
            id: { not: folder.id },
          },
        })
      )
        throw new StorageLocationError("A folder with that name exists.", 409);
      await prisma.folder.update({
        where: { id: folder.id },
        data: { name: input.name },
      });
    }
    return { success: true };
  }
  const fileIds =
    input.action === "empty-trash"
      ? (
          await prisma.imageApplication.findMany({
            where: { applicationId, deletedAt: { not: null } },
            select: { id: true },
          })
        ).map((value) => value.id)
      : input.fileIds;
  const folderIds =
    input.action === "empty-trash"
      ? (
          await prisma.folder.findMany({
            where: { applicationId, deletedAt: { not: null } },
            select: { id: true },
          })
        ).map((value) => value.id)
      : input.folderIds;
  const items = await selected(applicationId, fileIds, folderIds);
  const tree = await prisma.folder.findMany({
    where: { applicationId },
    select: { id: true, parentId: true, deletedAt: true, trashBatchId: true },
  });
  const subtree = descendants(tree, folderIds);
  if (input.action === "trash") {
    const batch = randomUUID(),
      deletedAt = new Date();
    await prisma.$transaction([
      prisma.imageApplication.updateMany({
        where: {
          applicationId,
          deletedAt: null,
          OR: [{ id: { in: fileIds } }, { folderId: { in: subtree } }],
        },
        data: { deletedAt, trashBatchId: batch },
      }),
      prisma.folder.updateMany({
        where: { applicationId, id: { in: subtree }, deletedAt: null },
        data: { deletedAt, trashBatchId: batch },
      }),
    ]);
    return { success: true };
  }
  if (input.action === "restore") {
    const batches = items.folders
      .map((value) => value.trashBatchId)
      .filter((value): value is string => !!value);
    const foldersToRestore = tree.filter(
      (value) =>
        subtree.includes(value.id) &&
        value.trashBatchId &&
        batches.includes(value.trashBatchId),
    );
    const restoredIds = new Set(foldersToRestore.map((value) => value.id));
    await prisma.$transaction(async (tx) => {
      for (const folder of foldersToRestore)
        await tx.folder.update({
          where: { id: folder.id },
          data: {
            deletedAt: null,
            trashBatchId: null,
            parentId:
              folder.parentId &&
              tree.some(
                (value) =>
                  value.id === folder.parentId &&
                  (!value.deletedAt || restoredIds.has(value.id)),
              )
                ? folder.parentId
                : null,
          },
        });
      const entries = await tx.imageApplication.findMany({
        where: {
          applicationId,
          deletedAt: { not: null },
          OR: [
            { id: { in: fileIds } },
            { folderId: { in: subtree }, trashBatchId: { in: batches } },
          ],
        },
      });
      for (const entry of entries)
        await tx.imageApplication.update({
          where: { id: entry.id },
          data: {
            deletedAt: null,
            trashBatchId: null,
            folderId:
              entry.folderId &&
              tree.some(
                (value) =>
                  value.id === entry.folderId &&
                  (!value.deletedAt || restoredIds.has(value.id)),
              )
                ? entry.folderId
                : null,
          },
        });
    });
    return { success: true };
  }
  if (input.action === "purge" || input.action === "empty-trash") {
    if (
      items.files.some((value) => !value.deletedAt) ||
      items.folders.some((value) => !value.deletedAt)
    )
      throw new StorageLocationError(
        "Move items to Trash before permanently deleting them.",
        409,
      );
    const entries = await prisma.imageApplication.findMany({
      where: {
        applicationId,
        deletedAt: { not: null },
        OR: [{ id: { in: fileIds } }, { folderId: { in: subtree } }],
      },
      select: { id: true },
    });
    let failed = 0;
    for (const entry of entries)
      try {
        await purgeFileEntry(entry.id, applicationId);
      } catch {
        failed++;
      }
    if (!failed)
      await prisma.folder.deleteMany({
        where: { applicationId, id: { in: subtree }, deletedAt: { not: null } },
      });
    return { success: failed === 0, removed: entries.length - failed, failed };
  }
  if (input.action === "star") {
    await prisma.imageApplication.updateMany({
      where: { applicationId, id: { in: fileIds }, deletedAt: null },
      data: { starred: input.starred ?? true },
    });
    return { success: true };
  }
  if (input.action === "copy" || input.action === "move") {
    await folderExists(applicationId, input.folderId);
    if (
      items.files.some((value) => value.deletedAt) ||
      items.folders.some((value) => value.deletedAt)
    )
      throw new StorageLocationError(
        "Restore trashed items before moving or copying them.",
        409,
      );
    if (input.folderId && subtree.includes(input.folderId))
      throw new StorageLocationError(
        "A folder cannot be placed inside itself or its descendants.",
        409,
      );
    if (input.action === "copy" && tree.length + subtree.length > 2000)
      throw new StorageLocationError("Folder limit reached.");
    const copyTree = async (
      sourceId: string,
      parentId: string | null,
      isRoot = true,
    ): Promise<void> => {
      const source = await prisma.folder.findUniqueOrThrow({
          where: { id: sourceId },
        }),
        created = await prisma.folder.create({
          data: {
            applicationId,
            parentId,
            name: isRoot ? `${source.name} (copy)`.slice(0, 255) : source.name,
          },
        });
      const entries = await prisma.imageApplication.findMany({
        where: { applicationId, folderId: sourceId, deletedAt: null },
        include: { image: { include: imageInclude } },
      });
      for (const entry of entries) {
        const imageId = input.storageLocationId
          ? await copyBlob(entry, applicationId, input.storageLocationId)
          : entry.imageId;
        await prisma.imageApplication.create({
          data: {
            applicationId,
            imageId,
            folderId: created.id,
            originalName: entry.originalName,
            tags: entry.tags ?? undefined,
          },
        });
      }
      for (const child of tree.filter(
        (value) => value.parentId === sourceId && !value.deletedAt,
      ))
        await copyTree(child.id, created.id, false);
    };
    const rootFolders = items.folders.filter(
      (folder) => !folder.parentId || !subtree.includes(folder.parentId),
    );
    if (input.action === "copy")
      for (const folder of rootFolders)
        await copyTree(folder.id, input.folderId);
    else {
      if (input.storageLocationId)
        for (const entry of await prisma.imageApplication.findMany({
          where: { applicationId, folderId: { in: subtree }, deletedAt: null },
          include: { image: { include: imageInclude } },
        })) {
          const imageId = await copyBlob(
            entry,
            applicationId,
            input.storageLocationId,
          );
          const result = await prisma.imageApplication.updateMany({
            where: {
              id: entry.id,
              imageId: entry.imageId,
              updatedAt: entry.updatedAt,
            },
            data: { imageId },
          });
          if (!result.count)
            throw new StorageLocationError(
              "A file changed during the move. Refresh before retrying.",
              409,
            );
        }
      for (const folder of rootFolders)
        await prisma.folder.update({
          where: { id: folder.id },
          data: { parentId: input.folderId },
        });
    }
    for (const entry of items.files.filter(
      (entry) => !entry.folderId || !subtree.includes(entry.folderId),
    )) {
      const imageId = input.storageLocationId
        ? await copyBlob(entry, applicationId, input.storageLocationId)
        : entry.imageId;
      if (input.action === "copy") {
        const ext = path.extname(entry.originalName),
          name = `${path.basename(entry.originalName, ext)} (copy)${ext}`.slice(
            0,
            255,
          );
        await prisma.imageApplication.create({
          data: {
            applicationId,
            imageId,
            folderId: input.folderId,
            originalName: name,
            tags: entry.tags ?? undefined,
          },
        });
      } else {
        const result = await prisma.imageApplication.updateMany({
          where: {
            id: entry.id,
            imageId: entry.imageId,
            updatedAt: entry.updatedAt,
          },
          data: { imageId, folderId: input.folderId },
        });
        if (!result.count)
          throw new StorageLocationError(
            "A file changed during the move. Refresh before retrying.",
            409,
          );
      }
    }
    if (input.action === "move" && input.storageLocationId)
      await collectUnusedImages(ownerId);
    return { success: true };
  }
  throw new StorageLocationError("Unsupported operation.");
}
