import type { NextRequest } from "next/server";
import {
  GET as legacyGET,
  HEAD as legacyHEAD,
} from "@/app/api/files/[id]/content/route";
import { error } from "@/lib/v1-api";
export const runtime = "nodejs";
type Context = { params: Promise<{ id: string }> };
function secure(response: Response) {
  if (!response.headers.has("Content-Security-Policy"))
    response.headers.set(
      "Content-Security-Policy",
      "sandbox; default-src 'none'",
    );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}
export async function GET(request: NextRequest, context: Context) {
  const response = await legacyGET(request, context);
  if (response.status < 400 || response.status === 416) return secure(response);
  return secure(
    error(
      response.status === 404 ? "FILE_NOT_FOUND" : "INTERNAL_ERROR",
      response.status === 404 ? "File not found." : "Unable to stream file.",
      response.status,
    ),
  );
}
export async function HEAD(request: NextRequest, context: Context) {
  try {
    return secure(await legacyHEAD(request, context));
  } catch {
    return secure(new Response(null, { status: 500 }));
  }
}
