import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

async function main() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (
    process.env.SERVE_INTEGRATION_TEST !== "1" ||
    !["127.0.0.1", "localhost"].includes(url.hostname) ||
    !url.pathname.endsWith("_test")
  )
    throw new Error(
      "Use an isolated localhost database ending in _test and set SERVE_INTEGRATION_TEST=1. This test writes data.",
    );
  const directory = await mkdtemp(path.join(tmpdir(), "serve-storage-test-"));
  process.env.STORAGE_PROVIDER = "local";
  process.env.UPLOAD_DIR = directory;
  process.env.BACKUP_ENABLED = "false";
  const { prisma } = await import("../src/lib/prisma");
  try {
    const { processImageUpload } = await import("../src/lib/image-upload");
    const { managerOperation, managerListing } = await import(
      "../src/lib/file-manager"
    );
    const { linkedFile, serializeFile } = await import("../src/lib/v1-files");
    const { purgeFileEntry } = await import("../src/lib/file-deletion");
    const { getStorageForImage } = await import("../src/lib/storage/locations");
    const { blobKey } = await import("../src/lib/storage/keys");
    const ownerId = `test-${randomUUID()}`;
    const app = await prisma.application.create({
      data: {
        name: "Integration A",
        slug: `test-${randomUUID()}`,
        ownerId,
        storageDir: "unused",
        defaultStorageLocationId: "local",
      },
    });
    const other = await prisma.application.create({
      data: {
        name: "Integration B",
        slug: `test-${randomUUID()}`,
        ownerId,
        storageDir: "unused",
        defaultStorageLocationId: "local",
      },
    });
    const payload = Buffer.from("Verified storage integration content");
    const a = await processImageUpload(payload, "a.txt", "text/plain", app.id);
    const b = await processImageUpload(
      payload,
      "b.txt",
      "text/plain",
      other.id,
    );
    assert.equal(
      a.id,
      b.id,
      "Same-location uploads deduplicate physical blobs",
    );
    assert.notEqual(
      a.entryId,
      b.entryId,
      "Each logical entry has its own public identity",
    );
    const before = await linkedFile(a.entryId, app.id);
    assert(before);
    const beforeUrls = serializeFile(before).urls;
    const sourceBackend = await getStorageForImage(before.image);
    await managerOperation(app.id, ownerId, {
      action: "move",
      fileIds: [a.entryId],
      storageLocationId: "default",
    });
    const moved = await linkedFile(a.entryId, app.id);
    assert(moved);
    assert.notEqual(moved.imageId, before.imageId);
    assert.deepEqual(
      serializeFile(moved).urls,
      beforeUrls,
      "Moves preserve file URLs",
    );
    assert.deepEqual(
      await sourceBackend.get(blobKey(before.image.filename)),
      payload,
      "Other aliases retain source bytes",
    );
    assert.equal(
      (await purgeFileEntry(b.entryId, other.id)).storageDeleted,
      true,
    );
    assert.equal(await sourceBackend.get(blobKey(before.image.filename)), null);
    assert.deepEqual(
      await (await getStorageForImage(moved.image)).get(
        blobKey(moved.image.filename),
      ),
      payload,
      "Moved file remains readable after source collection",
    );
    const parentResult = await managerOperation(app.id, ownerId, {
      action: "new-folder",
      name: "Projects",
    });
    assert("folder" in parentResult);
    const parent = parentResult.folder;
    const childResult = await managerOperation(app.id, ownerId, {
      action: "new-folder",
      name: "Child",
      parentId: parent.id,
    });
    assert("folder" in childResult);
    const child = childResult.folder;
    const nested = await processImageUpload(
      Buffer.from("nested"),
      "nested.txt",
      "text/plain",
      app.id,
      [],
      { folderId: child.id },
    );
    await assert.rejects(
      () =>
        managerOperation(app.id, ownerId, {
          action: "move",
          folderIds: [parent.id],
          folderId: child.id,
        }),
      /descendants/,
    );
    await managerOperation(app.id, ownerId, {
      action: "trash",
      folderIds: [child.id],
    });
    await managerOperation(app.id, ownerId, {
      action: "trash",
      folderIds: [parent.id],
    });
    await managerOperation(app.id, ownerId, {
      action: "restore",
      folderIds: [parent.id],
    });
    assert(
      (await prisma.folder.findUniqueOrThrow({ where: { id: child.id } }))
        .deletedAt,
      "Restoring a parent does not restore independently trashed children",
    );
    await managerOperation(app.id, ownerId, {
      action: "restore",
      folderIds: [child.id],
    });
    assert(
      await linkedFile(nested.entryId, app.id),
      "Folder restore restores its own files",
    );
    await managerOperation(app.id, ownerId, {
      action: "copy",
      folderIds: [parent.id],
    });
    const roots = await managerListing(app.id, new URLSearchParams());
    assert(roots.folders.some((folder) => folder.name === "Projects (copy)"));
    await managerOperation(app.id, ownerId, {
      action: "rename",
      kind: "file",
      id: a.entryId,
      name: "renamed.txt",
    });
    assert.equal(
      (await linkedFile(a.entryId, app.id))?.originalName,
      "renamed.txt",
    );
    await assert.rejects(
      () =>
        managerOperation(other.id, ownerId, {
          action: "trash",
          folderIds: [parent.id],
        }),
      /not found/,
    );
    await managerOperation(app.id, ownerId, {
      action: "trash",
      fileIds: [a.entryId],
    });
    assert.equal(
      await linkedFile(a.entryId, app.id),
      null,
      "Trashed files leave SDK lists and management reads",
    );
    await managerOperation(app.id, ownerId, {
      action: "purge",
      fileIds: [a.entryId],
    });
    assert.equal(
      await prisma.imageApplication.findUnique({ where: { id: a.entryId } }),
      null,
    );
    console.log(
      "Storage integration passed: migrations, deduplication, verified moves, stable URLs, aliases, folder cycles, copy, Trash/restore, ownership, and purge.",
    );
  } finally {
    await prisma.$disconnect();
    await rm(directory, { recursive: true, force: true });
  }
}
main().catch((cause) => {
  console.error(cause);
  process.exitCode = 1;
});
