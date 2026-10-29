import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, mkdtemp, rm, truncate, writeFile } from "node:fs/promises";
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
    const { importStorageItems } = await import("../src/lib/storage/import");
    const { maxFileSizeBytes } = await import("../src/config");
    const sharp = (await import("sharp")).default;
    const incoming = path.join(directory, `owners/${ownerId}/local/incoming`);
    await mkdir(path.join(incoming, "kit/nested"), { recursive: true });
    await writeFile(
      path.join(incoming, "clip.webm"),
      Buffer.from("webm streaming test"),
    );
    await writeFile(
      path.join(incoming, "manual.pdf"),
      Buffer.from("%PDF-1.4 import test"),
    );
    await writeFile(
      path.join(incoming, "kit/nested/note.txt"),
      "imported from storage",
    );
    const picture = await sharp({
      create: { width: 64, height: 48, channels: 3, background: "#4488ff" },
    })
      .png()
      .toBuffer();
    const webp = await sharp(picture).webp().toBuffer();
    for (const suffix of [
      ".png",
      ".webp",
      "-placeholder.png",
      "-placeholder.webp",
    ])
      await writeFile(
        path.join(incoming, `kit/000000000000aaaa${suffix}`),
        suffix.endsWith("webp") ? webp : picture,
      );
    const user = { id: ownerId, role: "user" };
    const imported = await importStorageItems(user, "local", {
      applicationId: app.id,
      keys: ["incoming/clip.webm", "incoming/manual.pdf", "incoming/kit/"],
    });
    assert.equal(imported.failed, 0, JSON.stringify(imported));
    assert.equal(
      imported.imported,
      4,
      "An image family imports as one image, and folders retain nested files",
    );
    const importedLinks = await prisma.imageApplication.findMany({
      where: {
        id: { in: imported.results.map((result) => result.entryId ?? "") },
      },
      include: { image: { include: { variants: true } }, folder: true },
    });
    assert.equal(importedLinks.length, 4);
    assert.equal(
      importedLinks.find((link) => link.originalName === "note.txt")?.folder
        ?.name,
      "nested",
    );
    assert.equal(
      importedLinks.find((link) => link.originalName.endsWith("aaaa.png"))
        ?.image.variants.length,
      3,
    );
    for (const link of importedLinks.filter((link) =>
      ["clip.webm", "manual.pdf"].includes(link.originalName),
    )) {
      const backend = await getStorageForImage(link.image);
      assert.deepEqual(
        await backend.get(blobKey(link.image.filename)),
        await (await import("node:fs/promises")).readFile(
          path.join(incoming, link.originalName),
        ),
      );
    }
    const beforeRetry = await prisma.imageApplication.count({
      where: { applicationId: app.id },
    });
    const retry = await importStorageItems(user, "local", {
      applicationId: app.id,
      keys: ["incoming/clip.webm", "incoming/manual.pdf", "incoming/kit/"],
    });
    assert.equal(retry.failed, 0);
    assert.equal(
      await prisma.imageApplication.count({ where: { applicationId: app.id } }),
      beforeRetry,
      "Retry reuses application entries instead of duplicating files",
    );
    const foreign = await prisma.application.create({
      data: {
        ownerId: "other-owner",
        name: "Foreign application",
        slug: `foreign-${randomUUID()}`,
        storageDir: "unused",
        defaultStorageLocationId: "local",
      },
    });
    await assert.rejects(
      () =>
        importStorageItems(user, "local", {
          applicationId: foreign.id,
          keys: ["incoming/clip.webm"],
        }),
      /Application not found/,
    );
    await assert.rejects(
      () =>
        importStorageItems(user, "foreign-connection", {
          applicationId: app.id,
          keys: ["incoming/clip.webm"],
        }),
      /does not belong/,
    );
    await assert.rejects(
      () =>
        importStorageItems(user, "local", {
          applicationId: app.id,
          keys: ["owners/other-owner/local/secret.txt"],
        }),
      /no longer exists/,
    );
    await assert.rejects(
      () =>
        importStorageItems(user, "local", {
          applicationId: app.id,
          keys: [".serve-trash/secret"],
        }),
      /Restore deleted/,
    );
    await assert.rejects(() =>
      importStorageItems(user, "local", {
        applicationId: app.id,
        keys: ["../secret"],
      }),
    );
    await assert.rejects(
      () =>
        importStorageItems(user, "local", {
          applicationId: app.id,
          keys: ["missing-folder/"],
        }),
      /no longer exists/,
    );
    await writeFile(path.join(incoming, "too-large.bin"), "");
    await truncate(
      path.join(incoming, "too-large.bin"),
      maxFileSizeBytes() + 1,
    );
    await assert.rejects(
      () =>
        importStorageItems(user, "local", {
          applicationId: app.id,
          keys: ["incoming/too-large.bin"],
        }),
      /upload limit/,
    );
    await writeFile(path.join(incoming, "invalid.png"), "not an image");
    const partial = await importStorageItems(user, "local", {
      applicationId: app.id,
      keys: ["incoming/clip.webm", "incoming/invalid.png"],
    });
    assert.equal(partial.imported, 1);
    assert.equal(partial.failed, 1);
    console.log(
      "Storage integration passed: migrations, deduplication, verified moves, stable URLs, aliases, folder cycles, copy, Trash/restore, ownership, purge, storage imports, streamed media copies, grouped image imports, retry deduplication, and import access limits.",
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
