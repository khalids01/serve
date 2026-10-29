import { z } from "zod";
import { config } from "@/config";
import { prisma } from "@/lib/prisma";
import { requireSession, sessionApi } from "@/lib/session-api";
import { ownedConnection } from "@/lib/storage/connections";
import {
  StorageLocationError,
  withOwnerStorageLock,
} from "@/lib/storage/locations";
import { boundedJSON, checkStorageOrigin } from "@/lib/storage/manager";
import { getStoragePreference } from "@/lib/storage/settings";
export function GET(request: Request) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    return Response.json(
      (await getStoragePreference(user.id)) ?? {
        localBackupConnectionId: null,
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  });
}
export function PATCH(request: Request) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    checkStorageOrigin(request);
    const input = z
      .object({
        localBackupConnectionId: z.string().min(1).max(255).nullable(),
      })
      .strict()
      .parse(await boundedJSON(request));
    return withOwnerStorageLock(user.id, async () => {
      if (input.localBackupConnectionId === "default") {
        if (config.storage.provider !== "s3")
          throw new StorageLocationError(
            "Default storage must be an S3 bucket to use it as a backup.",
            409,
          );
      } else if (input.localBackupConnectionId) {
        const connection = await ownedConnection(
          input.localBackupConnectionId,
          user.id,
        );
        if (!connection.enabled)
          throw new StorageLocationError(
            "Enable the backup connection first.",
            409,
          );
      }
      return Response.json(
        await prisma.storagePreference.upsert({
          where: { ownerId: user.id },
          create: { ownerId: user.id, ...input },
          update: input,
        }),
        { headers: { "Cache-Control": "private, no-store" } },
      );
    });
  });
}
