import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { syncImageMetadataFromBackup } from "@/lib/backups";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    const result = await syncImageMetadataFromBackup(id);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Sync backup error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to sync backup",
      },
      { status: 500 },
    );
  }
}
