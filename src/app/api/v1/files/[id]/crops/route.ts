import { type NextRequest, NextResponse } from "next/server";
import { processImageUpload } from "@/lib/image-upload";
import { isSharpResizable } from "@/lib/storage/image";
import { error, preflight, withAuth } from "@/lib/v1-api";
import { linkedFile, serializeFile } from "@/lib/v1-files";
import { parseUpload, UploadValidationError } from "@/lib/v1-upload";
export const runtime = "nodejs";
export const OPTIONS = preflight;
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return withAuth("files:write", async (_request, auth) => {
    const source = await linkedFile(id, auth.applicationId);
    if (!source)
      return error(
        "FILE_NOT_FOUND",
        "The file is not linked to this application.",
        404,
      );
    if (!isSharpResizable(source.image.contentType, source.image.filename))
      return error(
        "FILE_TYPE_NOT_ALLOWED",
        "Only raster images can be cropped.",
        400,
      );
    try {
      const input = await parseUpload(request);
      if (input.saveMode !== null && input.saveMode !== "new")
        return error("INVALID_UPLOAD", "V1 supports saveMode=new only.", 400);
      if (!isSharpResizable(input.contentType))
        return error(
          "FILE_TYPE_NOT_ALLOWED",
          "A cropped raster image is required.",
          400,
        );
      const result = await processImageUpload(
        input.buffer,
        input.filename,
        input.contentType,
        auth.applicationId,
        input.tags,
      );
      const link = await linkedFile(result.id, auth.applicationId);
      if (!link) throw new Error("Crop link disappeared");
      return NextResponse.json({ data: serializeFile(link) }, { status: 201 });
    } catch (cause) {
      if (cause instanceof UploadValidationError)
        return error(cause.code, cause.message, cause.status);
      throw cause;
    }
  })(request);
}
