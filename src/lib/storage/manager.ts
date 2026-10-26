import { randomUUID } from "node:crypto";
import { z } from "zod";
import { config } from "@/config";
import { withBlobLock } from "@/lib/blob-lock";
import { prisma } from "@/lib/prisma";
import type { StorageBackend } from "./backend";
import {
  type BrowseEntry,
  type BrowsePage,
  browsePath,
  storageAction,
  storageItem,
} from "./browse";
import { resolveBrowseLocation, StorageLocationError } from "./locations";

type User = { id: string; role?: string | null };
const trashRoot = ".serve-trash/";
const maxTreeItems = 1000;
const trashRecord = z.object({
  key: storageItem,
  deletedAt: z.number(),
  kind: z.enum(["file", "folder"]),
  sizeBytes: z.number(),
});
function fail(message: string, status = 400): never {
  throw new StorageLocationError(message, status);
}
export function protectedStoragePath(key: string, scope: "disk" | "namespace") {
  const parts = key.split("/");
  return (
    parts.some((part) => ["_blobs", "_cache", ".serve-trash"].includes(part)) ||
    (scope === "disk" &&
      [
        "owners",
        "connections",
        config.backup.basePrefix.split("/")[0],
      ].includes(parts[0]))
  );
}
function writable(key: string, scope: "disk" | "namespace") {
  storageItem.parse(key);
  if (protectedStoragePath(key, scope))
    fail(
      "This path is managed by Serve. Manage linked files on the Files page.",
      403,
    );
}
export function checkStorageOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const allowed = new Set([
    new URL(request.url).origin,
    new URL(config.app.url).origin,
  ]);
  if (
    !origin ||
    !allowed.has(origin) ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    fail("Request origin is not allowed.", 403);
}
export async function boundedJSON(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    fail("Expected JSON.", 415);
  const reader = request.body?.getReader();
  if (!reader) fail("Missing request body.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 65536) fail("Request is too large.", 413);
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
async function occupied(storage: StorageBackend, key: string) {
  const plain = key.replace(/\/$/, "");
  return Boolean(
    (await storage.stat(plain)) ||
      (await storage.stat(`${plain}/`)) ||
      (await storage.browse(`${plain}/`)).entries.length,
  );
}
async function available(storage: StorageBackend, key: string) {
  if (await occupied(storage, key))
    fail("An item with this name already exists. Choose another name.", 409);
}
async function tree(
  storage: StorageBackend,
  key: string,
  budget = { items: 0, pages: 0 },
): Promise<BrowseEntry[]> {
  if (++budget.items > maxTreeItems)
    fail("Select fewer items (up to 1,000 per operation).", 413);
  if (!key.endsWith("/")) {
    const info = await storage.stat(key);
    if (!info) fail("File no longer exists.", 404);
    return [
      {
        key,
        kind: "file",
        sizeBytes: info.sizeBytes,
        modifiedAt: info.mtimeMs,
      },
    ];
  }
  const entries: BrowseEntry[] = [{ key, kind: "folder" }];
  const queue = [key];
  for (let index = 0; index < queue.length; index++) {
    let cursor: string | undefined;
    do {
      if (++budget.pages > maxTreeItems)
        fail("This selection requires too many listing requests.", 413);
      const page = await storage.browse(queue[index], cursor);
      if (page.nextCursor && page.nextCursor === cursor)
        fail("Storage returned an invalid page cursor.");
      if (page.hasUnsupportedEntries)
        fail(
          "This folder contains symbolic links or special files and cannot be modified.",
          403,
        );
      for (const entry of page.entries) {
        storageItem.parse(entry.key);
        if (!entry.key.startsWith(queue[index]) || entry.key === queue[index])
          fail("Storage returned an invalid path.");
        entries.push(entry);
        if (++budget.items > maxTreeItems)
          fail(
            "Select a smaller folder (up to 1,000 items per operation).",
            413,
          );
        if (entry.kind === "folder") queue.push(entry.key);
      }
      cursor = page.nextCursor;
    } while (cursor);
  }
  if (entries.length === 1 && !(await storage.stat(key)))
    fail("Folder no longer exists.", 404);
  return entries;
}
async function protectTree(
  entries: BrowseEntry[],
  scope: "disk" | "namespace",
) {
  for (const entry of entries) writable(entry.key, scope);
  if (scope === "disk") {
    const names = entries
      .filter((entry) => entry.kind === "file")
      .map((entry) => entry.key.split("/").at(-1) ?? "");
    if (
      names.length &&
      ((await prisma.image.findFirst({
        where: { filename: { in: names } },
        select: { id: true },
      })) ||
        (await prisma.imageVariant.findFirst({
          where: { filename: { in: names } },
          select: { id: true },
        })) ||
        (await prisma.backupRecord.findFirst({
          where: {
            storageKey: {
              in: entries
                .filter((entry) => entry.kind === "file")
                .map((entry) => entry.key),
            },
          },
          select: { id: true },
        })))
    )
      fail(
        "This selection includes application files or backups managed by Serve. Use the Files or Data Backup page to manage them.",
        403,
      );
  }
}
async function copyTree(
  source: StorageBackend,
  target: StorageBackend,
  entries: BrowseEntry[],
  sourceKey: string,
  targetKey: string,
) {
  await available(target, targetKey);
  const written: BrowseEntry[] = [];
  try {
    for (const entry of entries) {
      const key = targetKey + entry.key.slice(sourceKey.length);
      if (entry.kind === "folder") await target.createDirectory(key);
      else {
        if ((entry.sizeBytes ?? 0) > (target.maxWriteBytes ?? Infinity))
          fail(
            "This file exceeds the destination's single-operation size limit. Use your storage provider for multipart transfers.",
            413,
          );
        if (source === target) {
          await source.copyFile(entry.key, key);
        } else {
          const opened = await source.open(entry.key);
          if (!opened) fail("Source file no longer exists.", 404);
          try {
            await target.createFile(
              key,
              opened.body,
              opened.contentLength,
              opened.contentType,
            );
          } catch (error) {
            await opened.body.cancel().catch(() => {});
            throw error;
          }
        }
      }
      written.push({ ...entry, key });
    }
  } catch (error) {
    // No source is removed until every destination item has been written.
    await removeTree(target, written).catch(() => {});
    throw error;
  }
}
async function removeTree(storage: StorageBackend, entries: BrowseEntry[]) {
  for (const entry of [...entries].reverse()) {
    if (entry.kind === "file") await storage.delete(entry.key);
    else await storage.removeDirectory(entry.key);
  }
}
function uniqueKeys(keys: string[]) {
  const unique = [...new Set(keys)];
  return unique.filter(
    (key) =>
      !unique.some(
        (parent) =>
          parent !== key && parent.endsWith("/") && key.startsWith(parent),
      ),
  );
}
export async function readTrash(
  storage: StorageBackend,
  userId: string,
  id: string,
) {
  z.string().uuid().parse(id);
  const key = `${trashRoot}${userId}/${id}/record.json`;
  const file = await storage.open(key);
  if (!file) fail("Trash item no longer exists.", 404);
  if (file.contentLength > 8192) {
    await file.body.cancel();
    fail("Invalid trash record.");
  }
  return trashRecord.parse(JSON.parse(await new Response(file.body).text()));
}
export async function browseTrash(
  storage: StorageBackend,
  userId: string,
  cursor?: string,
): Promise<BrowsePage> {
  const page = await storage.browse(`${trashRoot}${userId}/`, cursor);
  const entries: BrowseEntry[] = [];
  const folders = page.entries.filter((entry) => entry.kind === "folder");
  for (let index = 0; index < folders.length; index += 10) {
    const batch = await Promise.all(
      folders.slice(index, index + 10).map(async (entry) => {
        const id = entry.key.split("/").at(-2) ?? "";
        try {
          return { ...(await readTrash(storage, userId, id)), trashId: id };
        } catch (error) {
          if (error instanceof StorageLocationError && error.status === 404)
            return undefined;
          throw error;
        }
      }),
    );
    entries.push(
      ...batch.filter(
        (entry): entry is NonNullable<typeof entry> => entry !== undefined,
      ),
    );
  }
  return { entries, nextCursor: page.nextCursor };
}
function withStorageManagerLock<T>(
  identities: string[],
  work: () => Promise<T>,
) {
  const keys = [...new Set(identities)]
    .sort()
    .map((key) => `storage-browser:${key}`);
  // Consistent lock order prevents deadlocks in transfers between drives.
  return withBlobLock(
    keys[0],
    async (tx) => {
      for (const key of keys.slice(1))
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${key}, 0))`;
      return work();
    },
    900_000,
  );
}
export async function storageOperation(
  user: User,
  location: string,
  input: unknown,
) {
  const action = storageAction.parse(input);
  const budget = { items: 0, pages: 0 };
  const { storage, scope, identity, enabled } = await resolveBrowseLocation(
    user,
    location,
  );
  const targetId =
    action.action === "copy" || action.action === "move"
      ? (action.destinationId ?? location)
      : location;
  const target =
    targetId === location
      ? { storage, scope, identity, enabled }
      : await resolveBrowseLocation(user, targetId);
  if (!enabled || !target.enabled)
    fail("Enable the storage connection before making changes.", 403);
  return withStorageManagerLock([identity, target.identity], async () => {
    if (action.action === "new-folder") {
      const key = `${action.prefix}${action.name}/`;
      writable(key, scope);
      await available(storage, key);
      await storage.createDirectory(key);
      return;
    }
    if ("ids" in action) {
      for (const id of [...new Set(action.ids)]) {
        const record = await readTrash(storage, user.id, id);
        writable(record.key, scope);
        const base = `${trashRoot}${user.id}/${id}/`;
        const data = `${base}data${record.kind === "folder" ? "/" : ""}`;
        const entries = await tree(storage, data, budget);
        if (action.action === "restore")
          await copyTree(storage, storage, entries, data, record.key);
        await removeTree(storage, entries);
        await storage.delete(`${base}record.json`);
        await storage.removeDirectory(base);
      }
      return;
    }
    const keys = uniqueKeys(
      action.action === "rename" ? [action.key] : action.keys,
    );
    for (const key of keys) {
      writable(key, scope);
      const entries = await tree(storage, key, budget);
      await protectTree(entries, scope);
      if (action.action === "trash") {
        const base = `${trashRoot}${user.id}/${randomUUID()}/`;
        const data = `${base}data${key.endsWith("/") ? "/" : ""}`;
        await copyTree(storage, storage, entries, key, data);
        const record = JSON.stringify({
          key,
          deletedAt: Date.now(),
          kind: key.endsWith("/") ? "folder" : "file",
          sizeBytes: entries.reduce(
            (sum, entry) => sum + (entry.sizeBytes ?? 0),
            0,
          ),
        });
        try {
          await storage.createFile(
            `${base}record.json`,
            new Blob([record]).stream(),
            Buffer.byteLength(record),
            "application/json",
          );
        } catch (error) {
          await removeTree(
            storage,
            entries.map((entry) => ({
              ...entry,
              key: data + entry.key.slice(key.length),
            })),
          ).catch(() => {});
          await storage.removeDirectory(base).catch(() => {});
          throw error;
        }
        await removeTree(storage, entries);
      } else {
        const plain = key.replace(/\/$/, "");
        let targetKey =
          action.action === "rename"
            ? `${plain.slice(0, plain.lastIndexOf("/") + 1)}${action.name}${key.endsWith("/") ? "/" : ""}`
            : `${action.destination}${plain.split("/").at(-1)}${key.endsWith("/") ? "/" : ""}`;
        if (target.identity === identity && targetKey === key) {
          if (action.action !== "copy") continue;
          const name = plain.split("/").at(-1) ?? "item";
          const dot = key.endsWith("/") ? -1 : name.lastIndexOf(".");
          const extension = dot > 0 ? name.slice(dot) : "";
          const stem = dot > 0 ? name.slice(0, dot) : name;
          const parent = plain.slice(0, plain.lastIndexOf("/") + 1);
          for (let index = 1; index <= 100; index++) {
            targetKey = `${parent}${stem} (copy${index > 1 ? ` ${index}` : ""})${extension}${key.endsWith("/") ? "/" : ""}`;
            if (!(await occupied(target.storage, targetKey))) break;
            if (index === 100)
              fail("Choose a different copy destination.", 409);
          }
        }
        writable(targetKey, target.scope);
        if (
          target.identity === identity &&
          (targetKey === key ||
            (key.endsWith("/") && targetKey.startsWith(key)))
        )
          fail("Choose a destination outside the selected folder.");
        await copyTree(storage, target.storage, entries, key, targetKey);
        if (action.action !== "copy") await removeTree(storage, entries);
      }
    }
  });
}
export async function storageUpload(
  user: User,
  location: string,
  key: string,
  body: ReadableStream<Uint8Array>,
  size: number,
  contentType?: string,
) {
  browsePath.parse(key);
  const { storage, scope, identity, enabled } = await resolveBrowseLocation(
    user,
    location,
  );
  if (!enabled) fail("Enable the storage connection before uploading.", 403);
  if (size > (storage.maxWriteBytes ?? Infinity))
    fail("File exceeds the storage provider size limit.", 413);
  writable(key, scope);
  return withStorageManagerLock([identity], async () => {
    await available(storage, key);
    await storage.createFile(key, body, size, contentType);
  });
}
