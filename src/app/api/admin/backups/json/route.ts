import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { createBackupSnapshot } from "@/lib/backups";

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

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth instanceof NextResponse) return auth;
    const records = await createBackupSnapshot("json", "manual", auth.user.id);
    return NextResponse.json({ success: true, records });
  } catch (error) {
    console.error("Create JSON backup error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create JSON backup",
      },
      { status: 500 },
    );
  }
}
