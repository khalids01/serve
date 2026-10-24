import { errors, jwtVerify, SignJWT } from "jose";
import { type NextRequest, NextResponse } from "next/server";
import { config } from "@/config";
import { ApiKeyService } from "@/lib/api-keys";
import { browserTokenInputSchema } from "@/lib/v1-contracts";

export type FileScope = "files:read" | "files:write" | "files:delete";
export type V1Auth = {
  applicationId: string;
  scopes: FileScope[];
  apiKey: boolean;
};
const validScopes: FileScope[] = ["files:read", "files:write", "files:delete"];
function tokenSecret() {
  const secret = process.env.FILE_SERVER_BROWSER_TOKEN_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("Browser tokens are not configured.");
  return new TextEncoder().encode(secret);
}
export function error(
  code: string,
  message: string,
  status: number,
  details?: unknown,
) {
  return NextResponse.json(
    { error: { code, message, ...(details === undefined ? {} : { details }) } },
    { status },
  );
}
export async function authenticate(
  request: NextRequest,
  required: FileScope,
): Promise<V1Auth | NextResponse> {
  const value = (
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    request.headers.get("x-api-key")
  )?.trim();
  if (!value) return error("AUTH_REQUIRED", "Authentication is required.", 401);
  if (value.startsWith("sk_")) {
    // API keys are server-to-server credentials; browser origins must use tokens.
    if (request.headers.has("origin"))
      return error(
        "ORIGIN_DENIED",
        "Use a browser token for browser requests.",
        403,
      );
    const result = await ApiKeyService.validateKey(value);
    if (!result)
      return error(
        "INVALID_API_KEY",
        "The API key is invalid or revoked.",
        401,
      );
    return {
      applicationId: result.application.id,
      scopes: validScopes,
      apiKey: true,
    };
  }
  try {
    const { payload } = await jwtVerify(value, tokenSecret(), {
      algorithms: ["HS256"],
      issuer: "file-server",
      audience: "file-server-browser",
      requiredClaims: ["sub", "iat", "exp", "jti"],
      maxTokenAge: "15m",
    });
    const scopes = Array.isArray(payload.scopes)
      ? payload.scopes.filter((scope): scope is FileScope =>
          validScopes.includes(scope as FileScope),
        )
      : [];
    const origins = Array.isArray(payload.origins) ? payload.origins : [];
    const origin = request.headers.get("origin");
    if (!origin || !origins.includes(origin))
      return error(
        "ORIGIN_DENIED",
        "This origin is not allowed by the browser token.",
        403,
      );
    if (!payload.sub || !scopes.includes(required)) {
      const response = error(
        "SCOPE_DENIED",
        "The browser token does not grant this operation.",
        403,
      );
      for (const [key, value] of Object.entries(corsHeaders(origin)))
        response.headers.set(key, value);
      return response;
    }
    return { applicationId: payload.sub, scopes, apiKey: false };
  } catch (cause) {
    const code =
      cause instanceof Error && cause.name === "JWTExpired"
        ? "TOKEN_EXPIRED"
        : "INVALID_BROWSER_TOKEN";
    const response = error(
      code,
      code === "TOKEN_EXPIRED"
        ? "The browser token has expired."
        : "The browser token is invalid.",
      401,
    );
    const origin = request.headers.get("origin");
    // JWTExpired is raised only after signature verification. Expose the refresh
    // error to the signed origin, never to an arbitrary requesting origin.
    if (
      cause instanceof errors.JWTExpired &&
      origin &&
      Array.isArray(cause.payload.origins) &&
      cause.payload.origins.includes(origin)
    ) {
      for (const [key, value] of Object.entries(corsHeaders(origin)))
        response.headers.set(key, value);
    }
    return response;
  }
}
export async function createBrowserToken(applicationId: string, raw: unknown) {
  const input = browserTokenInputSchema.parse(raw);
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + input.expiresInSeconds;
  const token = await new SignJWT({
    scopes: [...new Set(input.scopes)],
    origins: [...new Set(input.allowedOrigins)],
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer("file-server")
    .setAudience("file-server-browser")
    .setSubject(applicationId)
    .setJti(crypto.randomUUID())
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt)
    .sign(tokenSecret());
  return { token, expiresAt: new Date(expiresAt * 1000).toISOString() };
}
export function absolute(path: string) {
  return new URL(path, config.app.url).toString();
}
function corsHeaders(origin: string) {
  return {
    Vary: "Origin",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "Authorization, Content-Type, X-Request-Id",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Expose-Headers": "X-Request-Id",
  };
}
// Preflight has no bearer token. Allow it without credentials; the actual request
// validates its origin against the signed token before returning any data.
export function preflight(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null")
    return error("ORIGIN_DENIED", "An HTTP(S) origin is required.", 403);
  try {
    if (new URL(origin).origin !== origin || !/^https?:/.test(origin))
      throw new Error();
  } catch {
    return error("ORIGIN_DENIED", "Invalid origin.", 403);
  }
  return new NextResponse(null, {
    status: 204,
    headers: { ...corsHeaders(origin), "Access-Control-Max-Age": "600" },
  });
}
export function withAuth(
  scope: FileScope,
  handler: (request: NextRequest, auth: V1Auth) => Promise<Response>,
) {
  return async (request: NextRequest) => {
    const requestId = crypto.randomUUID();
    let response: Response;
    let authenticated = false;
    try {
      const auth = await authenticate(request, scope);
      if (auth instanceof NextResponse) response = auth;
      else {
        authenticated = true;
        response = await handler(request, auth);
      }
    } catch (cause) {
      console.error("V1 request failed", requestId, cause);
      response = error(
        "INTERNAL_ERROR",
        "The request could not be completed.",
        500,
      );
    }
    response.headers.set("X-Request-Id", requestId);
    response.headers.set("Cache-Control", "no-store");
    const origin = request.headers.get("origin");
    if (origin && authenticated) {
      for (const [key, value] of Object.entries(corsHeaders(origin)))
        response.headers.set(key, value);
    }
    return response;
  };
}
