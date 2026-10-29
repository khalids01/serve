import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSession, sessionApi } from "@/lib/session-api";
import type { BackupPayload } from "@/lib/storage/backup-queue";
import {
  getStorageForImage,
  resolveOwnerUploadLocation,
  StorageLocationError,
  withOwnerStorageLock,
} from "@/lib/storage/locations";
import { boundedJSON, checkStorageOrigin } from "@/lib/storage/manager";

type Context = { params: Promise<{ id: string }> };
async function owned(request: Request, context: Context) {
  const user = await requireSession(request),
    { id } = await context.params;
  const job = await prisma.storageJob.findFirst({
    where: { id, ownerId: user.id },
  });
  if (!job) throw new StorageLocationError("Job not found.", 404);
  return { user, job };
}
export function GET(request: Request, context: Context) {
  return sessionApi(async () => {
    const { job } = await owned(request, context);
    return Response.json(
      {
        schemaVersion: 1,
        kind: job.kind,
        createdAt: job.createdAt,
        metadata: job.payload,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
          "Content-Disposition": `attachment; filename="${job.id}-metadata.json"`,
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  });
}
export function PATCH(request: Request, context: Context) {
  return sessionApi(async () => {
    const { user, job } = await owned(request, context);
    checkStorageOrigin(request);
    const { action } = z
      .object({ action: z.enum(["retry", "cancel", "restore"]) })
      .strict()
      .parse(await boundedJSON(request));
    return withOwnerStorageLock(user.id, async () => {
      const current = await prisma.storageJob.findUnique({
        where: { id: job.id },
      });
      if (!current) throw new StorageLocationError("Job not found.", 404);
      if (action === "restore") {
        if (job.kind !== "backup" || job.status !== "completed")
          throw new StorageLocationError(
            "Choose a completed local-file backup.",
            409,
          );
        if (
          await prisma.storageJob.count({
            where: {
              ownerId: user.id,
              kind: "restore",
              status: { in: ["queued", "running"] },
              payload: { path: ["backupJobId"], equals: job.id },
            },
          })
        )
          throw new StorageLocationError(
            "A restore for this backup is already queued.",
            409,
          );
        const restore = await prisma.storageJob.create({
          data: {
            ownerId: user.id,
            kind: "restore",
            payload: { backupJobId: job.id },
          },
        });
        return Response.json({ id: restore.id }, { status: 202 });
      }
      const changed = await prisma.storageJob.updateMany({
        where: {
          id: job.id,
          ownerId: user.id,
          status: {
            in: action === "retry" ? ["failed"] : ["queued", "failed"],
          },
        },
        data:
          action === "retry"
            ? {
                status: "queued",
                attempts: 0,
                error: null,
                runAt: new Date(),
                leaseUntil: null,
                leaseToken: null,
              }
            : { status: "cancelled", leaseUntil: null, leaseToken: null },
      });
      if (!changed.count)
        throw new StorageLocationError(
          "This job is running or finished. Wait for its current step to finish.",
          409,
        );
      return Response.json({ success: true });
    });
  });
}
export function DELETE(request: Request, context: Context) {
  return sessionApi(async () => {
    const { user, job } = await owned(request, context);
    checkStorageOrigin(request);
    return withOwnerStorageLock(user.id, async () => {
      const current = await prisma.storageJob.findUniqueOrThrow({
        where: { id: job.id },
      });
      if (current.status === "running" || current.status === "queued")
        throw new StorageLocationError("Cancel or finish the job first.", 409);
      if (job.kind === "backup") {
        if (
          await prisma.storageJob.count({
            where: {
              ownerId: user.id,
              kind: "restore",
              status: { in: ["queued", "running", "failed"] },
              payload: { path: ["backupJobId"], equals: job.id },
            },
          })
        )
          throw new StorageLocationError(
            "Finish or cancel the restore first.",
            409,
          );
        const payload = job.payload as unknown as BackupPayload;
        const storage = payload.targetLocation
          ? await getStorageForImage(payload.targetLocation)
          : (await resolveOwnerUploadLocation(user.id, payload.target)).storage;
        // Server-generated owner/job prefix only; never accept a browser-supplied deletion key.
        await storage.deletePrefix(`.serve-backups/${user.id}/${job.id}/`);
      }
      await prisma.storageJob.delete({ where: { id: job.id } });
      return Response.json({ success: true });
    });
  });
}
