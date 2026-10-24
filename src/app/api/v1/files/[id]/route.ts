import path from "node:path";
import { type NextRequest, NextResponse } from "next/server";
import { withBlobLock } from "@/lib/blob-lock";
import { FileStorageService } from "@/lib/file-storage";
import { getLegacyTenantKeys, imageInclude } from "@/lib/image-response";
import { getStorage } from "@/lib/storage/factory";
import { objectKey } from "@/lib/storage/keys";
import { deleteBlobAndLegacyCacheByBase } from "@/lib/storage/read";
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
      : error(
          "FILE_NOT_FOUND",
          "The file is not linked to this application.",
          404,
        );
  })(request);
}
export async function DELETE(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return withAuth("files:delete", async (_request, auth) => {
    const initial = await linkedFile(id, auth.applicationId);
    if (!initial)
      return error(
        "FILE_NOT_FOUND",
        "The file is not linked to this application.",
        404,
      );
    return withBlobLock(initial.image.hash, async (tx) => {
      const link = await tx.imageApplication.findUnique({
        where: {
          imageId_applicationId: {
            imageId: id,
            applicationId: auth.applicationId,
          },
        },
        include: { image: { include: imageInclude } },
      });
      if (!link)
        return error(
          "FILE_NOT_FOUND",
          "The file is not linked to this application.",
          404,
        );
      await tx.imageApplication.delete({
        where: {
          imageId_applicationId: {
            imageId: id,
            applicationId: auth.applicationId,
          },
        },
      });
      const remaining = await tx.imageApplication.count({
        where: { imageId: id },
      });
      if (remaining > 0)
        return NextResponse.json({
          data: { id, unlinked: true, storageDeleted: false },
        });
      const storage = getStorage(),
        files = new FileStorageService(),
        legacy = getLegacyTenantKeys(link.image);
      // Storage failure throws out of the transaction, preserving the application link.
      // A retry is safe because storage delete is idempotent.
      try {
        for (const filename of [
          link.image.filename,
          ...link.image.variants.map((variant) => variant.filename),
        ]) {
          await files.deleteBlobFile(filename);
          for (const key of legacy)
            await storage.delete(objectKey(key, filename));
        }
        await deleteBlobAndLegacyCacheByBase(
          storage,
          path.parse(link.image.filename).name,
          legacy,
        );
      } catch {
        throw new Error("Storage cleanup failed");
      }
      await tx.image.delete({ where: { id } });
      return NextResponse.json({
        data: { id, unlinked: true, storageDeleted: true },
      });
    });
  })(request);
}
