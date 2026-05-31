import { NextRequest, NextResponse } from "next/server";
import { config } from "@/config";
import { protect } from "@/features/auth/guard";
import { prisma } from "@/lib/prisma";
import {
  clearAllUserCache,
  getHashesByApplicationForUser,
  listUserCacheOverview,
} from "@/lib/storage/cache-admin";
import { getStorage } from "@/lib/storage/factory";

export async function GET(request: NextRequest) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const applications = await prisma.application.findMany({
      where: { ownerId: user.id },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    });

    const hashesByApp = await getHashesByApplicationForUser(user.id);
    const overview = await listUserCacheOverview(
      getStorage(),
      applications,
      hashesByApp,
    );

    return NextResponse.json({
      cacheInStorage: config.storage.cacheInStorage,
      ...overview,
    });
  } catch (error) {
    console.error("Global cache list error:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to list cache" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await protect(request);
    if (auth instanceof NextResponse) return auth;
    const { user } = auth;

    const applications = await prisma.application.findMany({
      where: { ownerId: user.id },
      select: { id: true, slug: true },
    });

    const hashesByApp = await getHashesByApplicationForUser(user.id);
    const clearedBytes = await clearAllUserCache(
      getStorage(),
      applications,
      hashesByApp,
    );

    return NextResponse.json({ success: true, clearedBytes });
  } catch (error) {
    console.error("Global cache clear error:", error);
    if (error instanceof Error && error.message === "Authentication required") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 });
  }
}
