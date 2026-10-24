import { NextResponse } from "next/server";
import { config } from "@/config";
import { prisma } from "@/lib/prisma";
import { requireSession, sessionApi } from "@/lib/session-api";
import { locationCache } from "@/lib/storage/cache-admin";
export function GET(request: Request) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    const apps = await prisma.application.findMany({
      where: { ownerId: user.id },
      select: { id: true, name: true, slug: true },
    });
    const applications = await Promise.all(
      apps.map(async (app) => ({ ...app, ...(await locationCache(app.id)) })),
    );
    return NextResponse.json({
      cacheInStorage: config.storage.cacheInStorage,
      applications,
      fileCount: applications.reduce((n, app) => n + app.fileCount, 0),
      totalBytes: applications.reduce((n, app) => n + app.totalBytes, 0),
    });
  });
}
export function DELETE(request: Request) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    const apps = await prisma.application.findMany({
      where: { ownerId: user.id },
      select: { id: true },
    });
    let clearedBytes = 0;
    for (const app of apps)
      clearedBytes += (await locationCache(app.id, true)).clearedBytes;
    return NextResponse.json({ success: true, clearedBytes });
  });
}
