import { createHash, randomUUID } from "node:crypto";
import { createReadStream, createWriteStream } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { z } from "zod";
import { maxFileSizeBytes } from "@/config";
import { withBlobLock } from "@/lib/blob-lock";
import { safeName } from "@/lib/file-manager";
import { importContentType } from "@/lib/file-preview";
import { processImageUpload } from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import { validateUploadImage } from "@/lib/v1-upload";
import { queueImageBackup } from "./backup-queue";
import { type BrowseEntry, storageItem } from "./browse";
import { browseImageGroups } from "./grouped-browse";
import { blobKey } from "./keys";
import {
  resolveBrowseLocation,
  resolveUploadLocation,
  StorageLocationError,
  withOwnerStorageLock,
} from "./locations";

export const storageImport = z
  .object({
    applicationId: z.string().min(1).max(255),
    keys: z.array(storageItem).min(1).max(100),
  })
  .strict();
type User = { id: string; role?: string | null };
export async function importStorageItems(
  user: User,
  id: string,
  body: unknown,
) {
  const input = storageImport.parse(body);
  const app = await prisma.application.findFirst({
    where: { id: input.applicationId, ownerId: user.id },
    select: { id: true },
  });
  if (!app) throw new StorageLocationError("Application not found.", 404);
  await resolveUploadLocation(app.id);
  const source = await resolveBrowseLocation(user, id);
  const keys = [...new Set(input.keys)].filter(
    (key, _, all) =>
      !all.some(
        (parent) =>
          parent !== key && parent.endsWith("/") && key.startsWith(parent),
      ),
  );
  if (keys.some((key) => key.split("/").includes(".serve-trash")))
    throw new StorageLocationError(
      "Restore deleted items before adding them to an application.",
      403,
    );
  const entries = new Map<string, BrowseEntry>();
  const parents = new Map<string, string>();
  const folders: string[] = [];
  const limit = Math.min(maxFileSizeBytes(), 500 * 1024 * 1024, 2_147_483_647);
  let bytes = 0,
    files = 0,
    pages = 0;
  function remember(entry: BrowseEntry, parent: string) {
    storageItem.parse(entry.key);
    if (entries.has(entry.key)) return;
    safeName.parse(entry.key.replace(/\/$/, "").split("/").at(-1));
    if (entry.kind === "file") {
      if (
        !Number.isSafeInteger(entry.sizeBytes) ||
        (entry.sizeBytes ?? 0) < 0 ||
        (entry.sizeBytes ?? 0) > limit
      )
        throw new StorageLocationError(
          "A selected file exceeds the application's upload limit (up to 500 MiB).",
          413,
        );
      bytes += entry.sizeBytes ?? 0;
      if (++files > 100 || bytes > 500 * 1024 * 1024)
        throw new StorageLocationError(
          "Import up to 100 files and 500 MiB per operation. Select fewer items.",
          413,
        );
    } else folders.push(entry.key);
    if (entries.size >= 1000)
      throw new StorageLocationError(
        "Select fewer folders (up to 1,000 items per operation).",
        413,
      );
    entries.set(entry.key, entry);
    parents.set(entry.key, parent);
  }
  for (const key of keys) {
    if (key.endsWith("/")) remember({ key, kind: "folder" }, "");
    else {
      const info = await source.storage.stat(key);
      if (!info)
        throw new StorageLocationError(
          "A selected file no longer exists.",
          404,
        );
      remember({ key, kind: "file", sizeBytes: info.sizeBytes }, "");
    }
  }
  for (let index = 0; index < folders.length; index++) {
    let cursor: string | undefined;
    do {
      if (++pages > 1000)
        throw new StorageLocationError(
          "This folder requires too many listing requests.",
          413,
        );
      const page = await browseImageGroups(
        source.storage,
        folders[index],
        cursor,
        {
          namespacePrefix: source.namespacePrefix,
          ownerId: source.scope === "namespace" ? user.id : undefined,
        },
      );
      if (
        !page.entries.length &&
        !page.nextCursor &&
        !(await source.storage.stat(folders[index]))
      )
        throw new StorageLocationError(
          "A selected folder no longer exists.",
          404,
        );
      if (page.hasUnsupportedEntries)
        throw new StorageLocationError(
          "This folder contains symbolic links or special files and cannot be imported.",
          403,
        );
      for (const entry of page.entries) {
        if (
          !entry.key.startsWith(folders[index]) ||
          entry.key === folders[index]
        )
          throw new StorageLocationError("Storage returned an invalid path.");
        remember(entry, folders[index]);
      }
      if (cursor && page.nextCursor === cursor)
        throw new StorageLocationError(
          "Storage returned an invalid page cursor.",
        );
      cursor = page.nextCursor;
    } while (cursor);
  }
  const folderIds = new Map<string, string>();
  const directory = await mkdtemp(path.join(tmpdir(), "serve-import-"));
  const results: { key: string; entryId?: string; error?: string }[] = [];
  try {
    for (const folder of folders) {
      const parentId = folderIds.get(parents.get(folder) ?? "") ?? null;
      const name = folder.replace(/\/$/, "").split("/").at(-1) ?? "Folder";
      const saved = await withOwnerStorageLock(user.id, () =>
        prisma.$transaction(async (tx) => {
          await tx.$queryRaw`SELECT 1 FROM pg_advisory_xact_lock(hashtextextended(${`folders:${app.id}`},0))`;
          const existing = await tx.folder.findFirst({
            where: {
              applicationId: app.id,
              parentId,
              name: { equals: name, mode: "insensitive" },
              deletedAt: null,
            },
          });
          if (existing) return existing;
          if (
            (await tx.folder.count({ where: { applicationId: app.id } })) >=
            2000
          )
            throw new StorageLocationError(
              "Application folder limit reached.",
              413,
            );
          return tx.folder.create({
            data: { applicationId: app.id, parentId, name },
          });
        }),
      );
      folderIds.set(folder, saved.id);
    }
    for (const entry of entries.values()) {
      if (entry.kind !== "file") continue;
      const staged = path.join(directory, randomUUID());
      try {
        const opened = await source.storage.open(entry.key);
        if (!opened)
          throw new StorageLocationError("Source file no longer exists.", 404);
        let received = 0;
        const hash = createHash("sha256");
        await pipeline(
          Readable.fromWeb(
            opened.body as Parameters<typeof Readable.fromWeb>[0],
          ),
          new Transform({
            transform(chunk: Buffer, _encoding, callback) {
              received += chunk.length;
              if (received > limit || received > (entry.sizeBytes ?? 0)) {
                callback(
                  new StorageLocationError(
                    "Source size changed or exceeds the upload limit.",
                    413,
                  ),
                );
                return;
              }
              hash.update(chunk);
              callback(null, chunk);
            },
          }),
          createWriteStream(staged, { flags: "wx", mode: 0o600 }),
        );
        if (received !== entry.sizeBytes)
          throw new StorageLocationError(
            "The source file changed during import. Try again.",
            409,
          );
        const name = entry.key.split("/").at(-1) ?? "file";
        const contentType = importContentType(name);
        const folderId = folderIds.get(parents.get(entry.key) ?? "") ?? null;
        let entryId: string;
        if (contentType.startsWith("image/")) {
          if (received > 64 * 1024 * 1024)
            throw new StorageLocationError(
              "Images must be 64 MiB or smaller to import.",
              413,
            );
          const buffer = await readFile(staged);
          await validateUploadImage(buffer, name, contentType);
          const result = await processImageUpload(
            buffer,
            name,
            contentType,
            app.id,
            [],
            { folderId, reuseEntry: true },
          );
          entryId = result.entryId;
        } else {
          const digest = hash.digest("hex").slice(0, 16);
          entryId = await withOwnerStorageLock(user.id, async () => {
            const target = await resolveUploadLocation(app.id);
            return withBlobLock(`${target.id}:${digest}`, async (tx) => {
              let image = await tx.image.findUnique({
                where: {
                  storageLocationId_hash: {
                    storageLocationId: target.id,
                    hash: digest,
                  },
                },
              });
              if (!image) {
                const extension = path.extname(name).toLowerCase();
                const filename =
                  digest +
                  (/^\.[a-z0-9]{1,12}$/.test(extension) ? extension : "");
                const targetKey = blobKey(filename);
                if (await target.storage.stat(targetKey))
                  throw new StorageLocationError(
                    "A stored file conflicts with this import. Contact your administrator.",
                    409,
                  );
                await target.storage.createFile(
                  targetKey,
                  Readable.toWeb(
                    createReadStream(staged),
                  ) as ReadableStream<Uint8Array>,
                  received,
                  contentType,
                );
                image = await tx.image.create({
                  data: {
                    hash: digest,
                    ownerId: user.id,
                    storageLocationId: target.id,
                    storageConfig: target.snapshot,
                    filename,
                    contentType,
                    sizeBytes: received,
                  },
                });
              }
              const existing = await tx.imageApplication.findFirst({
                where: {
                  imageId: image.id,
                  applicationId: app.id,
                  originalName: name,
                  folderId,
                  deletedAt: null,
                },
              });
              const entry =
                existing ??
                (await tx.imageApplication.create({
                  data: {
                    imageId: image.id,
                    applicationId: app.id,
                    originalName: name,
                    folderId,
                  },
                }));
              await queueImageBackup(tx, image.id, target);
              return entry.id;
            });
          });
        }
        results.push({ key: entry.key, entryId });
      } catch (cause) {
        results.push({
          key: entry.key,
          error:
            cause instanceof StorageLocationError
              ? cause.message
              : "This file could not be imported. Check the source and application storage, then retry.",
        });
      } finally {
        await rm(staged, { force: true });
      }
    }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
  return {
    results,
    imported: results.filter((result) => result.entryId).length,
    failed: results.filter((result) => result.error).length,
    folders: folderIds.size,
  };
}
