import { type NextRequest, NextResponse } from "next/server";
import { protect } from "@/features/auth/guard";
import { listBackupsPaginated, type BackupListParams } from "@/lib/backups";
import type { BackupPeriod, BackupType } from "@/lib/prisma-types";

function parseBackupListParams(searchParams: URLSearchParams): BackupListParams {
  const type = searchParams.get("type");
  const period = searchParams.get("period");
  const status = searchParams.get("status");

  const sizeMinRaw = searchParams.get("sizeMin");
  const sizeMaxRaw = searchParams.get("sizeMax");

  return {
    page: Math.max(1, Number(searchParams.get("page") || 1)),
    limit: Math.min(
      100,
      Math.max(5, Number(searchParams.get("limit") || 20)),
    ),
    type:
      type === "json" || type === "sql" ? (type as BackupType) : undefined,
    period:
      period === "daily" || period === "weekly" || period === "monthly"
        ? (period as BackupPeriod)
        : undefined,
    status:
      status === "success" || status === "failed" || status === "running"
        ? status
        : undefined,
    sizeMin:
      sizeMinRaw && Number.isFinite(Number(sizeMinRaw))
        ? Number(sizeMinRaw)
        : undefined,
    sizeMax:
      sizeMaxRaw && Number.isFinite(Number(sizeMaxRaw))
        ? Number(sizeMaxRaw)
        : undefined,
    completedFrom: searchParams.get("completedFrom") || undefined,
    completedTo: searchParams.get("completedTo") || undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;

    const { searchParams } = new URL(request.url);
    return NextResponse.json(
      await listBackupsPaginated(parseBackupListParams(searchParams)),
    );
  } catch (error) {
    console.error("List backups error:", error);
    return NextResponse.json(
      { error: "Failed to list backups" },
      { status: 500 },
    );
  }
}
