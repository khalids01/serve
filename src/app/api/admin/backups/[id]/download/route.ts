import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { getBackupFileForDownload } from "@/lib/backups";

function sanitizeFilename(filename: string) {
  return filename.replace(/[^\w.\-()+ ]/g, "_");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;

    const { id } = await params;
    const { buffer, filename, contentType } =
      await getBackupFileForDownload(id);
    const safeFilename = sanitizeFilename(filename);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Content-Length": String(buffer.length),
      },
    });
  } catch (error) {
    console.error("Download backup error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to download backup";
    const status = message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
