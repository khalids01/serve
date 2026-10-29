import { NextResponse } from "next/server";
import { config } from "@/config";
import { prisma } from "@/lib/prisma";
import { requireSession, sessionApi } from "@/lib/session-api";
import { createConnection, publicConnection } from "@/lib/storage/connections";
import {
  defaultLocationReady,
  withOwnerStorageLock,
} from "@/lib/storage/locations";
import { storageEncryptionReady } from "@/lib/storage/secrets";
import { getStorageSettings } from "@/lib/storage/settings";
export const runtime = "nodejs";
export function GET(request: Request) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    const rows = await prisma.storageConnection.findMany({
      where: { ownerId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(
      {
        encryptionReady: storageEncryptionReady(),
        canManageDefaults: user.role === "admin",
        storageSettings: await getStorageSettings(),
        defaultProvider: config.storage.provider,
        builtins: [
          {
            id: "default",
            name: `Default storage (${config.storage.provider === "s3" ? "S3 from environment" : "Local"})`,
            enabled: defaultLocationReady(),
          },
          { id: "local", name: "Local storage (this VPS)", enabled: true },
        ],
        connections: rows.map(publicConnection),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  });
}
export function POST(request: Request) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    const body = await request.json();
    return withOwnerStorageLock(user.id, async () =>
      NextResponse.json(
        { connection: publicConnection(await createConnection(user.id, body)) },
        { status: 201 },
      ),
    );
  });
}
