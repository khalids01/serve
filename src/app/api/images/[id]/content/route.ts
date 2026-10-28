import type { NextRequest } from "next/server";
import { serveImage } from "@/app/api/img/[name]/service";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  return serveImage(request, id);
}
