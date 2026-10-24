import { NextResponse } from "next/server";
import { managerListing, managerOperation } from "@/lib/file-manager";
import { requireOwnedApplication, sessionApi } from "@/lib/session-api";

type Context = { params: Promise<{ applicationId: string }> };
export function GET(request: Request, context: Context) {
  return sessionApi(async () => {
    const { applicationId } = await context.params;
    await requireOwnedApplication(request, applicationId);
    return NextResponse.json(
      await managerListing(applicationId, new URL(request.url).searchParams),
      { headers: { "Cache-Control": "no-store" } },
    );
  });
}
export function POST(request: Request, context: Context) {
  return sessionApi(async () => {
    const { applicationId } = await context.params,
      { user } = await requireOwnedApplication(request, applicationId);
    return NextResponse.json(
      await managerOperation(applicationId, user.id, await request.json()),
    );
  });
}
