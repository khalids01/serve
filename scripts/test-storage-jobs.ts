import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

async function main() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (
    process.env.SERVE_INTEGRATION_TEST !== "1" ||
    !["localhost", "127.0.0.1"].includes(url.hostname) ||
    !url.pathname.endsWith("_test")
  )
    throw new Error(
      "Use an isolated localhost _test database with SERVE_INTEGRATION_TEST=1.",
    );
  const dir = await mkdtemp(path.join(tmpdir(), "serve-jobs-"));
  process.env.STORAGE_PROVIDER = "local";
  process.env.UPLOAD_DIR = path.join(dir, "uploads");
  process.env.STORAGE_ENCRYPTION_KEY = Buffer.alloc(32, 3).toString("base64");
  const { prisma } = await import("../src/lib/prisma");
  const { LocalStorageBackend } = await import("../src/lib/storage/local");
  const { S3StorageBackend } = await import("../src/lib/storage/s3");
  const { encryptStorageCredentials } = await import(
    "../src/lib/storage/secrets"
  );
  const { resolveBrowseLocation, getStorageForImage } = await import(
    "../src/lib/storage/locations"
  );
  const { processImageUpload } = await import("../src/lib/image-upload");
  const { runStorageJobs, assertBackupFinished } = await import(
    "../src/lib/storage/jobs"
  );
  const { storageUpload, storageOperation } = await import(
    "../src/lib/storage/manager"
  );
  const { createTransfer } = await import("../src/lib/storage/transfers");
  const { blobKey } = await import("../src/lib/storage/keys");
  // Exercise actual queue/leases/SQL with local substitutes for S3 operations. No remote requests.
  const methods = [
    "put",
    "get",
    "delete",
    "deletePrefix",
    "list",
    "stat",
    "open",
    "browse",
    "createFile",
    "createDirectory",
    "copyFile",
    "removeDirectory",
  ] as const;
  const originals = new Map<string, unknown>();
  for (const method of methods) {
    originals.set(method, S3StorageBackend.prototype[method]);
    Object.defineProperty(S3StorageBackend.prototype, method, {
      configurable: true,
      writable: true,
      value: function (this: { bucket: string }, ...args: unknown[]) {
        const backend = new LocalStorageBackend(
          path.join(dir, "buckets", this.bucket),
        );
        return (backend[method] as (...args: unknown[]) => unknown).apply(
          backend,
          args,
        );
      },
    });
  }
  const owner = `jobs-${randomUUID()}`,
    user = { id: owner, role: "user" };
  let appId = "";
  const finish = async (id: string) => {
    for (let i = 0; i < 120; i++) {
      const row = await prisma.storageJob.findUniqueOrThrow({ where: { id } });
      if (row.status === "completed") return row;
      if (row.error) throw new Error(`${row.kind}: ${row.error}`);
      await runStorageJobs();
    }
    throw new Error("Job did not finish");
  };
  try {
    const app = await prisma.application.create({
      data: {
        name: "Jobs",
        slug: owner,
        ownerId: owner,
        storageDir: "unused",
        defaultStorageLocationId: "local",
      },
    });
    appId = app.id;
    for (const id of ["remote-a", "remote-b"].map((x) => `${owner}-${x}`))
      await prisma.storageConnection.create({
        data: {
          id,
          ownerId: owner,
          name: id,
          endpoint: "https://storage.example",
          bucket: id,
          region: "auto",
          encryptedCredentials: encryptStorageCredentials(
            { accessKeyId: "fake", secretAccessKey: "fake" },
            owner,
            id,
          ),
        },
      });
    const [a, b] = [`${owner}-remote-a`, `${owner}-remote-b`];
    const before = await processImageUpload(
      Buffer.from("before"),
      "before.txt",
      "text/plain",
      app.id,
    );
    assert.equal(
      await prisma.storageJob.count({ where: { ownerId: owner } }),
      0,
      "No backfill",
    );
    await prisma.storagePreference.create({
      data: { ownerId: owner, localBackupConnectionId: a },
    });
    const sharp = (await import("sharp")).default;
    const png = await sharp({
      create: { width: 20, height: 20, channels: 3, background: "red" },
    })
      .png()
      .toBuffer();
    const uploaded = await processImageUpload(
      png,
      "image.png",
      "image/png",
      app.id,
    );
    const backup = await prisma.storageJob.findFirstOrThrow({
      where: { ownerId: owner, kind: "backup" },
    });
    await assert.rejects(assertBackupFinished(owner, uploaded.id), /backup/);
    await finish(backup.id);
    const items = await prisma.storageJobItem.findMany({
      where: { jobId: backup.id },
    });
    assert.ok(items.length >= 2, "Variants backed up");
    assert.ok(items.every((x) => x.checksum?.length === 64));
    assert.equal(
      await prisma.storageJob.count({
        where: { ownerId: owner, kind: "backup" },
      }),
      1,
      "Old file not queued",
    );
    const image = await prisma.image.findUniqueOrThrow({
      where: { id: uploaded.id },
      include: { variants: true },
    });
    const local = await getStorageForImage(image);
    for (const name of [
      image.filename,
      ...image.variants.map((x) => x.filename),
    ])
      await local.delete(blobKey(name));
    await prisma.imageApplication.deleteMany({ where: { imageId: image.id } });
    await prisma.image.delete({ where: { id: image.id } });
    const restore = await prisma.storageJob.create({
      data: {
        ownerId: owner,
        kind: "restore",
        payload: { backupJobId: backup.id },
      },
    });
    await finish(restore.id);
    const restored = await prisma.image.findUniqueOrThrow({
      where: { id: image.id },
      include: { variants: true, applications: true },
    });
    assert.equal(restored.variants.length, image.variants.length);
    assert.equal(restored.applications[0]?.applicationId, app.id);
    assert.ok(await local.stat(blobKey(image.filename)));
    await storageUpload(
      user,
      "local",
      "new.txt",
      new Blob(["raw"]).stream(),
      3,
      "text/plain",
    );
    await assert.rejects(
      storageOperation(user, "local", {
        action: "rename",
        key: "new.txt",
        name: "renamed.txt",
      }),
      /backup/,
    );
    const raw = await prisma.storageJob.findFirstOrThrow({
      where: { ownerId: owner, kind: "backup", status: "queued" },
    });
    await finish(raw.id);
    await prisma.storagePreference.update({
      where: { ownerId: owner },
      data: { localBackupConnectionId: null },
    });
    const src = (await resolveBrowseLocation(user, "local")).storage;
    for (let i = 0; i < 115; i++)
      await src.put(`batch/${i}.txt`, Buffer.from(String(i)));
    await src.createDirectory("batch/empty/");
    const transfer = await createTransfer(user, {
      source: "local",
      target: a,
      operation: "move",
      prefix: "batch/",
    });
    await finish(transfer.id);
    assert.equal(
      (await src.browse("batch/")).entries.length,
      0,
      "All pages moved without skipped files",
    );
    const remote = (await resolveBrowseLocation(user, a)).storage;
    assert.equal((await remote.get("114.txt"))?.toString(), "114");
    const onward = await createTransfer(user, {
      source: a,
      target: b,
      operation: "copy",
    });
    await finish(onward.id);
    assert.equal(
      (
        await (await resolveBrowseLocation(user, b)).storage.get("114.txt")
      )?.toString(),
      "114",
    );
    // Destination conflict must preserve source and existing target.
    await src.put("conflict.txt", Buffer.from("source"));
    await remote.put("conflict.txt", Buffer.from("other"));
    const conflict = await createTransfer(user, {
      source: "local",
      target: a,
      operation: "move",
      prefix: "",
    });
    for (let i = 0; i < 80; i++) {
      await runStorageJobs();
      const j = await prisma.storageJob.findUniqueOrThrow({
        where: { id: conflict.id },
      });
      if (j.error) {
        assert.match(j.error, /different file/);
        break;
      }
    }
    assert.equal((await src.get("conflict.txt"))?.toString(), "source");
    assert.equal((await remote.get("conflict.txt"))?.toString(), "other");
    await prisma.storageJob.update({
      where: { id: conflict.id },
      data: { status: "cancelled" },
    });
    const managedMove = await createTransfer(user, {
      source: "local",
      target: a,
      operation: "move",
      prefix: "_blobs/",
    });
    await finish(managedMove.id);
    const moved = await prisma.image.findUniqueOrThrow({
      where: { id: uploaded.id },
      include: { applications: true },
    });
    assert.equal(moved.storageLocationId, a);
    assert.equal(moved.applications[0]?.imageId, uploaded.id);
    assert.equal(await local.stat(blobKey(image.filename)), null);
    // A killed worker's expired lease is reclaimed. Provider errors are persisted and retryable.
    const recover = await prisma.storageJob.create({
      data: {
        ownerId: owner,
        kind: "restore",
        status: "running",
        leaseToken: "dead-worker",
        leaseUntil: new Date(0),
        payload: { backupJobId: raw.id },
      },
    });
    await finish(recover.id);
    await remote.put("114.txt", Buffer.from("tampered"));
    const badRestore = await prisma.storageJob.create({
      data: {
        ownerId: owner,
        kind: "restore",
        payload: { backupJobId: backup.id },
      },
    });
    await runStorageJobs();
    const rejected = await prisma.storageJob.findUniqueOrThrow({
      where: { id: badRestore.id },
    });
    assert.equal(rejected.attempts, 1);
    assert.match(rejected.error ?? "", /moved/);
    assert.ok(await prisma.image.findUnique({ where: { id: before.id } }));
    console.log(
      "Storage jobs passed: no backfill, queued variants/checksums, backup pins, missing files + association restore, 115-file paginated move, S3-to-S3 copy, conflict preservation.",
    );
  } finally {
    await prisma.storageJob.deleteMany({ where: { ownerId: owner } });
    await prisma.storagePreference.deleteMany({ where: { ownerId: owner } });
    if (appId) await prisma.application.delete({ where: { id: appId } });
    await prisma.image.deleteMany({ where: { ownerId: owner } });
    await prisma.storageConnection.deleteMany({ where: { ownerId: owner } });
    for (const method of methods)
      Object.defineProperty(S3StorageBackend.prototype, method, {
        value: originals.get(method),
        configurable: true,
        writable: true,
      });
    await prisma.$disconnect();
    await rm(dir, { recursive: true, force: true });
  }
}
main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
