import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { serializeBackupConfig, updateBackupConfig } from "@/lib/backups";

export async function PATCH(request: NextRequest) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;
    const input = await request.json();
    const updated = await updateBackupConfig(input);
    return NextResponse.json({ config: serializeBackupConfig(updated) });
  } catch (error) {
    console.error("Update backup config error:", error);
    return NextResponse.json(
      { error: "Failed to update backup config" },
      { status: 500 },
    );
  }
}
