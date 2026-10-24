import { NextResponse } from "next/server";
import { collectUnusedImages } from "@/lib/file-deletion";
import { prisma } from "@/lib/prisma";
import { requireSession, sessionApi } from "@/lib/session-api";
import {
  connectionUsage,
  ownedConnection,
  publicConnection,
  updateConnection,
} from "@/lib/storage/connections";
import {
  StorageLocationError,
  withOwnerStorageLock,
} from "@/lib/storage/locations";

type Context = { params: Promise<{ id: string }> };
export function PATCH(request: Request, context: Context) {
  return sessionApi(async () => {
    const user = await requireSession(request),
      { id } = await context.params;
    const body = await request.json();
    return withOwnerStorageLock(user.id, async () =>
      NextResponse.json({
        connection: publicConnection(await updateConnection(id, user.id, body)),
      }),
    );
  });
}
export function DELETE(request: Request, context: Context) {
  return sessionApi(async () => {
    const user = await requireSession(request),
      { id } = await context.params;
    return withOwnerStorageLock(user.id, async () => {
      await ownedConnection(id, user.id);
      await collectUnusedImages(user.id);
      const usage = await connectionUsage(id);
      if (usage.files || usage.applications)
        throw new StorageLocationError(
          "This connection is still used by files or applications. Move/purge files and change application defaults first.",
          409,
        );
      await prisma.storageConnection.delete({ where: { id } });
      return NextResponse.json({ success: true });
    });
  });
}
