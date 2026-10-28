import { type NextRequest, NextResponse } from "next/server";
import { ApiKeyService } from "@/lib/api-keys";
import { getCurrentUser } from "@/lib/auth-server";

import type { Application } from "@/lib/prisma-types";

export interface AuthContext {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role?: string | null;
  };
  application?: Application;
  authType: "api-key" | "session";
}

/**
 * Protects an API route by checking for either a valid API key or a valid session.
 *
 * Usage:
 * const auth = await protect(request);
 * if (auth instanceof NextResponse) return auth;
 * const { user, application } = auth;
 */
export async function protect(
  request: NextRequest,
): Promise<AuthContext | NextResponse> {
  const apiKey =
    request.headers.get("x-api-key") ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  // 1. Try API Key Auth
  if (apiKey && apiKey !== "undefined" && apiKey.startsWith("sk_")) {
    const validation = await ApiKeyService.validateKey(apiKey);
    if (validation) {
      return {
        user: validation.user,
        application: validation.application,
        authType: "api-key",
      };
    }
    // If an API key was provided but is invalid, reject the request
    return NextResponse.json(
      { error: "Invalid or revoked API key" },
      { status: 401 },
    );
  }

  // 2. Try Session Auth
  const user = await getCurrentUser(request.headers);
  if (user) {
    return {
      user,
      authType: "session",
    };
  }

  return NextResponse.json(
    { error: "Authentication required" },
    { status: 401 },
  );
}

/** Global administration requires a browser session, never an application API key. */
export async function protectAdmin(
  request: NextRequest,
): Promise<AuthContext | NextResponse> {
  const user = await getCurrentUser(request.headers);
  if (!user)
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  if (user.role !== "admin")
    return NextResponse.json(
      { error: "Administrator access required" },
      { status: 403 },
    );
  return { user, authType: "session" };
}
