import { NextResponse } from "next/server";
import { config, maxFileSizeBytes } from "@/config";
import { browserTokensEnabled } from "@/lib/v1-api";
export function GET() {
  return NextResponse.json(
    {
      data: {
        apiVersion: "v1",
        publicBaseUrl: new URL(config.app.url).origin,
        publicContent: true,
        maxFileSizeBytes: maxFileSizeBytes(),
        maxImageDimension: 4096,
        imageFormats: ["jpg", "png", "webp", "avif"],
        crop: { saveAsNew: true, replace: false },
        browserTokens: {
          enabled: browserTokensEnabled(),
          defaultLifetimeSeconds: 300,
          maxLifetimeSeconds: 900,
        },
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
