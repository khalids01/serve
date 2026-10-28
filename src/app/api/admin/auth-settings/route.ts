import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { config } from "@/config";
import { protectAdmin } from "@/features/auth/guard";
import { getSignupEnabled } from "@/lib/auth-settings";
import { prisma } from "@/lib/prisma";
import { sessionApi } from "@/lib/session-api";

export function GET(request: NextRequest) {
  return sessionApi(async () => {
    const auth = await protectAdmin(request);
    if (auth instanceof NextResponse) return auth;
    return NextResponse.json(
      { signupEnabled: await getSignupEnabled() },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  });
}
export function PATCH(request: NextRequest) {
  return sessionApi(async () => {
    const auth = await protectAdmin(request);
    if (auth instanceof NextResponse) return auth;
    const origin = request.headers.get("origin");
    if (
      !origin ||
      ![new URL(request.url).origin, new URL(config.app.url).origin].includes(
        origin,
      ) ||
      request.headers.get("sec-fetch-site") === "cross-site"
    ) {
      return NextResponse.json(
        { error: "Request origin is not allowed." },
        { status: 403 },
      );
    }
    const { signupEnabled } = z
      .object({ signupEnabled: z.boolean() })
      .strict()
      .parse(await request.json());
    const settings = await prisma.authSettings.upsert({
      where: { id: "default" },
      create: { id: "default", signupEnabled },
      update: { signupEnabled },
      select: { signupEnabled: true },
    });
    return NextResponse.json(settings, {
      headers: { "Cache-Control": "private, no-store" },
    });
  });
}
