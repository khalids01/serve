import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { listBackups } from "@/lib/backups";

export async function GET(request: NextRequest) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;
    return NextResponse.json(await listBackups());
  } catch (error) {
    console.error("List backups error:", error);
    return NextResponse.json(
      { error: "Failed to list backups" },
      { status: 500 },
    );
  }
}
