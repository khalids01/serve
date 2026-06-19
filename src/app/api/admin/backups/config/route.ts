import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { serializeBackupConfig, updateBackupConfig } from "@/lib/backups";

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

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
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
