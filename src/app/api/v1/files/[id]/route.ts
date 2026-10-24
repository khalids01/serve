import { type NextRequest, NextResponse } from "next/server";
import { purgeFileEntry } from "@/lib/file-deletion";
import { prisma } from "@/lib/prisma";
import {
  StorageLocationError,
  withOwnerStorageLock,
} from "@/lib/storage/locations";
import { error, preflight, withAuth } from "@/lib/v1-api";
import { linkedFile, serializeFile } from "@/lib/v1-files";
export const runtime = "nodejs";
export const OPTIONS = preflight;
type Context = { params: Promise<{ id: string }> };
export async function GET(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return withAuth("files:read", async (_request, auth) => {
    const link = await linkedFile(id, auth.applicationId);
    return link
      ? NextResponse.json({ data: serializeFile(link) })
      : error("FILE_NOT_FOUND", "File not found.", 404);
  })(request);
}
export async function DELETE(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return withAuth("files:delete", async (_request, auth) => {
    try {
      const app = await prisma.application.findUniqueOrThrow({
        where: { id: auth.applicationId },
        select: { ownerId: true },
      });
      return await withOwnerStorageLock(app.ownerId, async () =>
        NextResponse.json({
          data: await purgeFileEntry(id, auth.applicationId),
        }),
      );
    } catch (cause) {
      if (cause instanceof StorageLocationError)
        return error("FILE_NOT_FOUND", cause.message, cause.status);
      throw cause;
    }
  })(request);
}
