import { type NextRequest, NextResponse } from "next/server";
import { protectAdmin } from "@/features/auth/guard";
import { prisma } from "@/lib/prisma";
import { sessionApi } from "@/lib/session-api";
import { boundedJSON, checkStorageOrigin } from "@/lib/storage/manager";
import {
  getStorageSettings,
  storageSettingsInput,
} from "@/lib/storage/settings";
export function GET(request: NextRequest) {
  return sessionApi(async () => {
    const auth = await protectAdmin(request);
    if (auth instanceof NextResponse) return auth;
    return Response.json(await getStorageSettings(), {
      headers: { "Cache-Control": "private, no-store" },
    });
  });
}
export function PATCH(request: NextRequest) {
  return sessionApi(async () => {
    const auth = await protectAdmin(request);
    if (auth instanceof NextResponse) return auth;
    checkStorageOrigin(request);
    const input = storageSettingsInput.parse(await boundedJSON(request));
    return Response.json(
      await prisma.storageSettings.upsert({
        where: { id: "default" },
        create: { id: "default", ...input },
        update: input,
      }),
      { headers: { "Cache-Control": "private, no-store" } },
    );
  });
}
