import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, sessionApi } from "@/lib/session-api";
import { ownedConnection } from "@/lib/storage/connections";
import { withOwnerStorageLock } from "@/lib/storage/locations";
import {
  decryptStorageCredentials,
  encryptStorageCredentials,
} from "@/lib/storage/secrets";
export function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return sessionApi(async () => {
    const user = await requireSession(request),
      { id } = await context.params;
    return withOwnerStorageLock(user.id, async () => {
      const row = await ownedConnection(id, user.id);
      const encryptedCredentials = encryptStorageCredentials(
        decryptStorageCredentials(row.encryptedCredentials, user.id, id),
        user.id,
        id,
      );
      await prisma.storageConnection.update({
        where: { id },
        data: { encryptedCredentials },
      });
      return NextResponse.json({ success: true });
    });
  });
}
