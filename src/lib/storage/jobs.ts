import { randomUUID } from "node:crypto";
import { config } from "@/config";
import { withBlobLock } from "@/lib/blob-lock";
import { importContentType } from "@/lib/file-preview";
import { prisma } from "@/lib/prisma";
import type {
  StorageJob,
  StorageJobItem,
} from "../../../prisma/generated/prisma";
import type { StorageBackend } from "./backend";
import type { BackupPayload } from "./backup-queue";
import { checksum, copyVerified } from "./copy-verified";
import { blobKey } from "./keys";
import { LocalStorageBackend } from "./local";
import {
  assertLocationAccess,
  getStorageForImage,
  resolveOwnerUploadLocation,
  StorageLocationError,
  withOwnerStorageLock,
} from "./locations";
import { PrefixedStorage } from "./prefix";
import {
  type JobCursor,
  json,
  type ManagedImage,
  rebindTransferredImage,
  scanTransfer,
  transferLocations,
} from "./transfers";

const live = ["queued", "running", "failed"];
export async function assertBackupFinished(
  ownerId: string,
  imageId?: string,
  raw?: { source: string; key: string; namespacePrefix?: string },
) {
  const filters = imageId
    ? [{ payload: { path: ["image", "id"], equals: imageId } }]
    : raw
      ? [
          {
            payload: {
              path: ["raw", "fullKey"],
              ...(raw.key.endsWith("/")
                ? { string_starts_with: (raw.namespacePrefix ?? "") + raw.key }
                : { equals: (raw.namespacePrefix ?? "") + raw.key }),
            },
          },
        ]
      : [];
  if (
    filters.length &&
    (await prisma.storageJob.count({
      where: { ownerId, kind: "backup", status: { in: live }, AND: filters },
    }))
  )
    throw new StorageLocationError(
      "A local file backup is pending or failed. Complete or cancel it before moving or permanently deleting the source.",
      409,
    );
}
function backupRoot(job: StorageJob) {
  return `.serve-backups/${job.ownerId}/${job.id}/`;
}
function rawLocal(payload: BackupPayload) {
  const local = new LocalStorageBackend(config.storage.local.uploadDir);
  return payload.raw?.namespacePrefix
    ? new PrefixedStorage(local, payload.raw.namespacePrefix)
    : local;
}
async function initializeBackup(job: StorageJob) {
  const payload = job.payload as unknown as BackupPayload;
  const source = payload.image
    ? await getStorageForImage(payload.image)
    : rawLocal(payload);
  const keys = payload.image
    ? [
        payload.image.filename,
        ...payload.image.variants.map((variant) => variant.filename),
      ].map(blobKey)
    : [payload.raw?.key];
  for (const key of keys) {
    if (!key)
      throw new StorageLocationError("Invalid backup source metadata.", 409);
    if (!(await source.stat(key)))
      throw new StorageLocationError(
        "The local source is missing. Restore the VPS volume before retrying.",
        409,
      );
    await prisma.storageJobItem.upsert({
      where: { jobId_key: { jobId: job.id, key } },
      create: {
        jobId: job.id,
        key,
        destinationKey: `${backupRoot(job)}files/${key}`,
      },
      update: {},
    });
  }
  await prisma.storageJob.update({
    where: { id: job.id },
    data: { scanned: true, cursor: { phase: "copy" } },
  });
}
async function writeManifest(
  storage: StorageBackend,
  key: string,
  value: unknown,
) {
  const bytes = Buffer.from(JSON.stringify(value, null, 2));
  await storage.put(key, bytes, { contentType: "application/json" });
  const verified = await storage.get(key);
  if (!verified?.equals(bytes))
    throw new StorageLocationError(
      "Metadata verification failed. Retry the job.",
      502,
    );
}
async function copyItem(
  source: StorageBackend,
  target: StorageBackend,
  item: StorageJobItem,
) {
  if (item.kind === "folder") {
    if (item.destinationKey) {
      try {
        await target.createDirectory(item.destinationKey);
      } catch (error) {
        try {
          await target.browse(item.destinationKey);
        } catch {
          throw error;
        }
      }
    }
    await prisma.storageJobItem.update({
      where: { id: item.id },
      data: { status: "verified" },
    });
    return;
  }
  const verified = await copyVerified(
    source,
    target,
    item.key,
    item.destinationKey,
    importContentType(item.key),
  );
  await prisma.storageJobItem.update({
    where: { id: item.id },
    data: {
      status: "verified",
      checksum: verified.hash,
      sizeBytes: verified.size,
    },
  });
}
async function runBackupStep(job: StorageJob) {
  if (!job.scanned) {
    await initializeBackup(job);
    return false;
  }
  const payload = job.payload as unknown as BackupPayload;
  await assertLocationAccess(job.ownerId, payload.target);
  const targetDescriptor = payload.targetLocation;
  const target = targetDescriptor
    ? {
        storage: await getStorageForImage(targetDescriptor),
        snapshot: targetDescriptor.storageConfig,
      }
    : await resolveOwnerUploadLocation(job.ownerId, payload.target);
  if (
    target.snapshot &&
    (target.snapshot as { kind?: string }).kind === "local"
  )
    throw new StorageLocationError(
      "Backup destination must be an S3 connection.",
      409,
    );
  const item = await prisma.storageJobItem.findFirst({
    where: { jobId: job.id, status: "pending" },
    orderBy: { id: "asc" },
  });
  if (item) {
    const source = payload.image
      ? await getStorageForImage(payload.image)
      : rawLocal(payload);
    await copyItem(source, target.storage, item);
    return false;
  }
  const items = await prisma.storageJobItem.findMany({
    where: { jobId: job.id },
  });
  await writeManifest(target.storage, `${backupRoot(job)}manifest.json`, {
    schemaVersion: 1,
    kind: "local-file-backup",
    ownerId: job.ownerId,
    backedUpAt: new Date().toISOString(),
    image: payload.image ?? null,
    folders: payload.folders ?? [],
    raw: payload.raw ?? null,
    files: items.map((item) => ({
      key: item.key,
      backupKey: item.destinationKey,
      sha256: item.checksum,
      sizeBytes: item.sizeBytes,
    })),
  });
  return true;
}
async function runTransferStep(job: StorageJob) {
  const cursor = (job.cursor ?? { phase: "images" }) as unknown as JobCursor;
  if (cursor.phase === "images" || cursor.phase === "scan") {
    const next = await scanTransfer(job, cursor);
    await prisma.storageJob.update({
      where: { id: job.id },
      data: { cursor: json(next), scanned: next.phase === "copy" },
    });
    return false;
  }
  const { source, target, payload } = await transferLocations(job);
  if (cursor.phase === "copy") {
    const item =
      (await prisma.storageJobItem.findFirst({
        where: { jobId: job.id, status: "pending", kind: "file" },
        orderBy: { id: "asc" },
      })) ??
      (await prisma.storageJobItem.findFirst({
        where: { jobId: job.id, status: "pending", kind: "folder" },
        orderBy: { id: "asc" },
      }));
    if (item) {
      await copyItem(source.storage, target.storage, item);
      return false;
    }
    await prisma.storageJob.update({
      where: { id: job.id },
      data: { cursor: { phase: "metadata" } },
    });
    return false;
  }
  if (cursor.phase === "metadata") {
    const item = await prisma.storageJobItem.findFirst({
      where: { jobId: job.id, status: "pending", kind: "metadata" },
      orderBy: { id: "asc" },
    });
    if (item) {
      const image = item.metadata as unknown as ManagedImage;
      await withBlobLock(
        `${image.storageLocationId}:${image.hash}`,
        async () => {
          if (payload.operation === "move")
            await assertBackupFinished(job.ownerId, image.id);
          await rebindTransferredImage(job, image);
          await writeManifest(
            target.storage,
            `.serve-transfers/${job.id}/${image.id}.json`,
            {
              schemaVersion: 1,
              image,
              operation: payload.operation,
              target: payload.target,
            },
          );
          await prisma.storageJobItem.update({
            where: { id: item.id },
            data: { status: "verified" },
          });
        },
      );
      return false;
    }
    if (payload.operation === "copy") return true;
    await prisma.storageJob.update({
      where: { id: job.id },
      data: { cursor: { phase: "cleanup" } },
    });
    return false;
  }
  // Sources stay intact until all destination files and managed references are verified.
  const item = await prisma.storageJobItem.findFirst({
    where: { jobId: job.id, status: "verified", kind: "file" },
    orderBy: { id: "asc" },
  });
  if (item) {
    await assertBackupFinished(
      job.ownerId,
      item.imageId ?? undefined,
      item.imageId
        ? undefined
        : {
            source: payload.source,
            key: item.key,
            namespacePrefix: source.namespacePrefix,
          },
    );
    const destination = await checksum(target.storage, item.destinationKey);
    if (destination.hash !== item.checksum)
      throw new StorageLocationError(
        "Destination changed after copying. The source has been retained.",
        409,
      );
    if (await source.storage.stat(item.key)) {
      const original = await checksum(source.storage, item.key);
      if (original.hash !== item.checksum)
        throw new StorageLocationError(
          "Source changed after copying. Nothing was deleted.",
          409,
        );
      await source.storage.delete(item.key);
    }
    await prisma.storageJobItem.update({
      where: { id: item.id },
      data: { status: "cleaned" },
    });
    return false;
  }
  const directory = await prisma.storageJobItem.findFirst({
    where: { jobId: job.id, status: "verified", kind: "folder" },
    orderBy: { key: "desc" },
  });
  if (directory) {
    // A new upload may make the folder non-empty after inventory. Never delete it recursively.
    try {
      await source.storage.removeDirectory(directory.key);
    } catch {
      /* Keep non-empty directories. */
    }
    await prisma.storageJobItem.update({
      where: { id: directory.id },
      data: { status: "cleaned" },
    });
    return false;
  }
  return true;
}

async function runRestoreStep(job: StorageJob) {
  const payload = job.payload as { backupJobId: string };
  const backup = await prisma.storageJob.findFirst({
    where: {
      id: payload.backupJobId,
      ownerId: job.ownerId,
      kind: "backup",
      status: "completed",
    },
  });
  if (!backup)
    throw new StorageLocationError("Completed backup not found.", 404);
  const original = backup.payload as unknown as BackupPayload;
  if (
    original.raw?.disk &&
    (
      await prisma.user.findUnique({
        where: { id: job.ownerId },
        select: { role: true },
      })
    )?.role !== "admin"
  )
    throw new StorageLocationError(
      "Administrator access is required to restore a disk upload.",
      403,
    );
  if (original.image) {
    const current = await prisma.image.findUnique({
      where: { id: original.image.id },
    });
    if (
      current &&
      current.storageLocationId !== original.image.storageLocationId
    )
      throw new StorageLocationError(
        "This file has moved since its backup.",
        409,
      );
  }
  const remote = original.targetLocation
    ? await getStorageForImage(original.targetLocation)
    : (await resolveOwnerUploadLocation(job.ownerId, original.target)).storage;
  const local = original.image
    ? await getStorageForImage(original.image)
    : rawLocal(original);
  if (
    original.image &&
    !original.image.storageLocationId.startsWith("local:") &&
    (original.image.storageConfig as { kind?: string } | null)?.kind !== "local"
  )
    throw new StorageLocationError(
      "This backup is not a local file backup.",
      409,
    );
  const sourceItems = await prisma.storageJobItem.findMany({
    where: { jobId: backup.id, kind: "file" },
  });
  if (!job.scanned) {
    await prisma.storageJobItem.createMany({
      data: sourceItems.map((item) => ({
        jobId: job.id,
        key: item.destinationKey,
        destinationKey: item.key,
        checksum: item.checksum,
      })),
      skipDuplicates: true,
    });
    await prisma.storageJob.update({
      where: { id: job.id },
      data: { scanned: true },
    });
    return false;
  }
  const item = await prisma.storageJobItem.findFirst({
    where: { jobId: job.id, status: "pending" },
    orderBy: { id: "asc" },
  });
  if (item) {
    const verified = await checksum(remote, item.key);
    if (verified.hash !== item.checksum)
      throw new StorageLocationError(
        "Backup checksum does not match. Nothing was restored.",
        409,
      );
    await copyItem(remote, local, item);
    return false;
  }
  if (original.image) {
    const image = original.image;
    if (image.ownerId !== job.ownerId)
      throw new StorageLocationError("Backup owner mismatch.", 403);
    const existing = await prisma.image.findUnique({ where: { id: image.id } });
    if (existing && existing.storageLocationId !== image.storageLocationId)
      throw new StorageLocationError(
        "This file has moved since the backup. Restore into an empty local location instead.",
        409,
      );
    await prisma.$transaction(async (tx) => {
      if (!existing) {
        const { applications: _links, variants, ...fields } = image;
        await tx.image.create({
          data: {
            ...fields,
            storageConfig: fields.storageConfig ?? undefined,
            createdAt: new Date(String(fields.createdAt)),
            updatedAt: new Date(String(fields.updatedAt)),
            variants: {
              create: variants.map(
                ({ createdAt, imageId: _imageId, ...variant }) => ({
                  ...variant,
                  createdAt: new Date(String(createdAt)),
                }),
              ),
            },
          },
        });
      }
      for (const folder of original.folders ?? []) {
        const app = await tx.application.findFirst({
          where: { id: folder.applicationId, ownerId: job.ownerId },
        });
        if (app)
          await tx.folder.upsert({
            where: { id: folder.id },
            create: {
              ...folder,
              createdAt: new Date(String(folder.createdAt)),
              updatedAt: new Date(String(folder.updatedAt)),
              deletedAt: folder.deletedAt
                ? new Date(String(folder.deletedAt))
                : null,
            },
            update: {},
          });
      }
      for (const entry of image.applications) {
        const app = await tx.application.findFirst({
          where: { id: entry.applicationId, ownerId: job.ownerId },
        });
        if (!app) continue;
        const { application: _app, folder: _folder, ...fields } = entry;
        await tx.imageApplication.upsert({
          where: { id: entry.id },
          create: {
            ...fields,
            tags: fields.tags ?? undefined,
            linkedAt: new Date(String(fields.linkedAt)),
            updatedAt: new Date(String(fields.updatedAt)),
            deletedAt: fields.deletedAt
              ? new Date(String(fields.deletedAt))
              : null,
          },
          update: {},
        });
      }
    });
  }
  return true;
}

export async function runStorageJobs() {
  const token = randomUUID();
  const [claimed] = await prisma.$queryRaw<
    StorageJob[]
  >`UPDATE "StorageJob" SET status = 'running', "leaseToken" = ${token}, "leaseUntil" = NOW() + INTERVAL '2 minutes'
    WHERE id = (SELECT id FROM "StorageJob" WHERE (status = 'queued' AND "runAt" <= NOW()) OR (status = 'running' AND "leaseUntil" < NOW()) ORDER BY "runAt", "createdAt" FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING *`;
  if (!claimed) return false;
  const heartbeat = setInterval(() => {
    void prisma.storageJob
      .updateMany({
        where: { id: claimed.id, leaseToken: token, status: "running" },
        data: { leaseUntil: new Date(Date.now() + 120000) },
      })
      .catch(() => {});
  }, 15000);
  heartbeat.unref();
  try {
    await withOwnerStorageLock(claimed.ownerId, async () => {
      const until = Date.now() + 10000;
      for (let step = 0; step < 20; step++) {
        const job = await prisma.storageJob.findUniqueOrThrow({
          where: { id: claimed.id },
        });
        if (job.status !== "running" || job.leaseToken !== token) return;
        const complete =
          job.kind === "backup"
            ? await runBackupStep(job)
            : job.kind === "restore"
              ? await runRestoreStep(job)
              : await runTransferStep(job);
        if (complete) {
          await prisma.storageJob.updateMany({
            where: { id: job.id, leaseToken: token, status: "running" },
            data: {
              status: "completed",
              completedAt: new Date(),
              leaseUntil: null,
              leaseToken: null,
              error: null,
            },
          });
          return;
        }
        if (Date.now() >= until) break;
      }
      await prisma.storageJob.updateMany({
        where: { id: claimed.id, leaseToken: token, status: "running" },
        data: {
          status: "queued",
          leaseUntil: null,
          leaseToken: null,
          runAt: new Date(),
        },
      });
    });
  } catch (error) {
    const attempts = claimed.attempts + 1;
    await prisma.storageJob.updateMany({
      where: { id: claimed.id, leaseToken: token, status: "running" },
      data: {
        status: attempts >= 5 ? "failed" : "queued",
        attempts,
        leaseUntil: null,
        leaseToken: null,
        runAt: new Date(Date.now() + Math.min(900000, 5000 * 2 ** attempts)),
        error:
          error instanceof StorageLocationError
            ? error.message
            : "Storage operation failed. Check the source and destination connections, then retry. Source files are retained until verified.",
      },
    });
  } finally {
    clearInterval(heartbeat);
  }
  return true;
}
const worker = globalThis as typeof globalThis & {
  storageWorker?: NodeJS.Timeout;
  storageWorkerBusy?: boolean;
};
export function startStorageWorker() {
  if (worker.storageWorker) return;
  const tick = async () => {
    if (worker.storageWorkerBusy) return;
    worker.storageWorkerBusy = true;
    try {
      for (let i = 0; i < 4; i++) {
        if (!(await runStorageJobs())) break;
      }
    } catch {
      console.error(
        "Storage worker could not claim a job. Check database connectivity.",
      );
    } finally {
      worker.storageWorkerBusy = false;
    }
  };
  worker.storageWorker = setInterval(() => void tick(), 5000);
  worker.storageWorker.unref();
  void tick();
}
