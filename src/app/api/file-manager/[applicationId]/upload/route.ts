import { NextResponse } from "next/server";
import { processImageUpload } from "@/lib/image-upload";
import { requireOwnedApplication, sessionApi } from "@/lib/session-api";
import { StorageLocationError } from "@/lib/storage/locations";
import { parseUpload } from "@/lib/v1-upload";
export const runtime = "nodejs";
export function POST(
  request: Request,
  context: { params: Promise<{ applicationId: string }> },
) {
  return sessionApi(async () => {
    const { applicationId } = await context.params;
    await requireOwnedApplication(request, applicationId);
    const input = await parseUpload(request, ["folderId", "storageLocationId"]);
    if (input.saveMode !== null)
      throw new StorageLocationError("saveMode is not supported.");
    const result = await processImageUpload(
      input.buffer,
      input.filename,
      input.contentType,
      applicationId,
      input.tags,
      {
        folderId: input.folderId ? String(input.folderId) : null,
        storageLocationId: input.storageLocationId
          ? String(input.storageLocationId)
          : undefined,
      },
    );
    return NextResponse.json({ id: result.entryId }, { status: 201 });
  });
}
