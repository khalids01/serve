import { NextResponse } from "next/server";
import { createBrowserToken, error, withAuth } from "@/lib/v1-api";
import { browserTokenInputSchema } from "@/lib/v1-contracts";
export const runtime = "nodejs";
export const POST = withAuth("files:read", async (request, auth) => {
  if (!auth.apiKey)
    return error("SCOPE_DENIED", "Only API keys may mint browser tokens.", 403);
  let body: ReturnType<typeof browserTokenInputSchema.parse>;
  try {
    body = browserTokenInputSchema.parse(await request.json());
  } catch {
    return error(
      "INVALID_QUERY",
      "Invalid token scopes, origins, or lifetime (1–900 seconds).",
      400,
    );
  }
  return NextResponse.json({
    data: await createBrowserToken(auth.applicationId, body),
  });
});
