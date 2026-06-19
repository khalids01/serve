import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { cleanupOldBackups } from "@/lib/backups";

export async function POST(request: NextRequest) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;

    const result = await cleanupOldBackups();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Cleanup backups error:", error);
    return NextResponse.json(
      { error: "Failed to clean old backups" },
      { status: 500 },
    );
  }
}
