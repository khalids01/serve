import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { deleteBackupRecords } from "@/lib/backups";

export async function POST(request: NextRequest) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;

    const body = await request.json();
    const ids = Array.isArray(body?.ids)
      ? body.ids.filter((id: unknown) => typeof id === "string")
      : [];

    if (ids.length === 0) {
      return NextResponse.json(
        { error: "At least one backup id is required" },
        { status: 400 },
      );
    }

    const result = await deleteBackupRecords(ids);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Bulk delete backups error:", error);
    return NextResponse.json(
      { error: "Failed to delete backups" },
      { status: 500 },
    );
  }
}
