import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    // Checks connectivity and the migrated application table, without changing data.
    await prisma.application.findFirst({ select: { id: true } });
    return NextResponse.json(
      { status: "ok", commit: process.env.SERVE_COMMIT ?? "development" },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
