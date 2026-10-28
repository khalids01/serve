import { type NextRequest, NextResponse } from "next/server";
import { protectAdmin } from "@/features/auth/guard";
import { scanStorageBackups } from "@/lib/backups";

export async function POST(request: NextRequest) {
  try {
    const auth = await protectAdmin(request);
    if (auth instanceof NextResponse) return auth;

    const result = await scanStorageBackups();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Scan storage backups error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to scan storage for backups",
      },
      { status: 500 },
    );
  }
}
