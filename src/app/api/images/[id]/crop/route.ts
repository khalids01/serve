import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { processImageUpload } from "@/lib/image-upload";
import { prisma } from "@/lib/prisma";
import { sessionApi } from "@/lib/session-api";
import { StorageLocationError } from "@/lib/storage/locations";
import { parseUpload } from "@/lib/v1-upload";
export const runtime = "nodejs";
export function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return sessionApi(async () => {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;
    const { id } = await context.params;
    const entry = await prisma.imageApplication.findFirst({
      where: {
        OR: [{ id }, { imageId: id }],
        deletedAt: null,
        ...(auth.application ? { applicationId: auth.application.id } : {}),
        application: { ownerId: auth.user.id },
      },
      include: { image: true },
    });
    if (!entry) throw new StorageLocationError("File not found.", 404);
    // Accept the legacy application field only when it matches the authorized entry.
    const form = await request.formData();
    if (
      form.has("applicationId") &&
      form.get("applicationId") !== entry.applicationId
    )
      throw new StorageLocationError(
        "Application does not match this file.",
        403,
      );
    form.delete("applicationId");
    const input = await parseUpload(
      new Request(request.url, { method: "POST", body: form }),
    );
    if (input.saveMode === "replace")
      throw new StorageLocationError(
        "Files are immutable. Save the crop as a new file.",
        409,
      );
    if (
      !entry.image.contentType.startsWith("image/") ||
      !input.contentType.startsWith("image/") ||
      input.contentType === "image/svg+xml"
    )
      throw new StorageLocationError("Cropping requires a raster image.");
    const storageLocationId = entry.image.storageLocationId.startsWith(
      "default:",
    )
      ? "default"
      : entry.image.storageLocationId.startsWith("local:")
        ? "local"
        : entry.image.storageLocationId;
    const result = await processImageUpload(
      input.buffer,
      input.filename,
      input.contentType,
      entry.applicationId,
      input.tags,
      { folderId: entry.folderId, storageLocationId },
    );
    return NextResponse.json({ success: true, mode: "new", image: result });
  });
}
