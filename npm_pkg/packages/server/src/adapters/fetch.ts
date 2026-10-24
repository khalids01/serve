import type { FileServerClient } from "../client";
import { browserTokenInputSchema } from "../contracts";

export type BrowserTokenHandlerOptions = {
  client: FileServerClient;
  authorize: (request: Request) => boolean | Promise<boolean>;
  scopes: Array<"files:read" | "files:write" | "files:delete">;
  allowedOrigins: string[];
  expiresInSeconds?: number;
};

export function createBrowserTokenHandler(options: BrowserTokenHandlerOptions) {
  if (typeof options.authorize !== "function")
    throw new Error("authorize is required for browser token handlers.");
  if (!options.allowedOrigins?.length)
    throw new Error("allowedOrigins is required for browser token handlers.");

  const policy = browserTokenInputSchema.parse({
    scopes: options.scopes,
    allowedOrigins: options.allowedOrigins,
    expiresInSeconds: options.expiresInSeconds,
  });
  return async function browserTokenHandler(
    request: Request,
  ): Promise<Response> {
    if (request.method !== "POST") {
      return Response.json(
        { error: { code: "METHOD_NOT_ALLOWED", message: "POST is required." } },
        {
          status: 405,
          headers: { allow: "POST", "cache-control": "no-store" },
        },
      );
    }
    const origin = request.headers.get("origin");
    if (
      request.headers.get("sec-fetch-site") === "cross-site" ||
      (origin && origin !== new URL(request.url).origin)
    ) {
      return Response.json(
        {
          error: {
            code: "ORIGIN_DENIED",
            message: "Same-origin requests are required.",
          },
        },
        { status: 403, headers: { "cache-control": "no-store" } },
      );
    }
    try {
      if (!(await options.authorize(request))) {
        return Response.json(
          {
            error: {
              code: "AUTH_REQUIRED",
              message: "Authentication required.",
            },
          },
          { status: 401, headers: { "cache-control": "no-store" } },
        );
      }
      const data = await options.client.browserTokens.create(policy);
      return Response.json(
        { data },
        { headers: { "cache-control": "no-store" } },
      );
    } catch {
      const message = "Failed to mint browser token.";
      return Response.json(
        { error: { code: "TOKEN_MINT_FAILED", message } },
        { status: 502, headers: { "cache-control": "no-store" } },
      );
    }
  };
}
