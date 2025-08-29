import { NextRequest } from "next/server";
import { serveImage } from "./service";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ name: string }> }
) {
  const { name } = await context.params;
  return serveImage(request, name);
}
