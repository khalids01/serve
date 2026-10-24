import { NextResponse } from "next/server";
import { requireOwnedApplication, sessionApi } from "@/lib/session-api";
import { locationCache } from "@/lib/storage/cache-admin";

type Context = { params: Promise<{ id: string }> };
export function GET(request: Request, context: Context) {
  return sessionApi(async () => {
    const { id } = await context.params;
    await requireOwnedApplication(request, id);
    return NextResponse.json(await locationCache(id));
  });
}
export function DELETE(request: Request, context: Context) {
  return sessionApi(async () => {
    const { id } = await context.params;
    await requireOwnedApplication(request, id);
    return NextResponse.json({
      success: true,
      ...(await locationCache(id, true)),
    });
  });
}
