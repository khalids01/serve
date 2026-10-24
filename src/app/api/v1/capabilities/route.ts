import { NextResponse } from "next/server";
import { maxFileSizeBytes } from "@/config";
export function GET() {
  return NextResponse.json(
    {
      data: {
        apiVersion: "v1",
        publicContent: true,
        maxFileSizeBytes: maxFileSizeBytes(),
        maxImageDimension: 4096,
        imageFormats: ["jpg", "png", "webp", "avif"],
        crop: { saveAsNew: true, replace: false },
        browserTokens: { defaultLifetimeSeconds: 300, maxLifetimeSeconds: 900 },
        uploads: { filesPerRequest: 1 },
      },
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60",
      },
    },
  );
}
