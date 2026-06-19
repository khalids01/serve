import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { deleteBackupRecord } from "@/lib/backups";

async function requireAdmin(request: NextRequest) {
  const auth = await protect(request);
  if (auth instanceof NextResponse) return auth;
  if (auth.user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 },
    );
  }
  return auth;
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;
    const { id } = await params;
    return NextResponse.json(await deleteBackupRecord(id));
  } catch (error) {
    console.error("Delete backup error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete backup",
      },
      { status: 500 },
    );
  }
}
