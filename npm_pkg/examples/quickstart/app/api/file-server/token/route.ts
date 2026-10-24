import { createBrowserTokenHandler } from "@skycanvasstudio/serve-server/adapters/fetch";
import { auth } from "@/lib/auth";
import { files } from "@/lib/file-server";

export async function POST(request: Request) {
  // Next.js can use an internal hostname in request.url behind a proxy.
  // Keep the public Host header and the request's forwarded HTTP(S) protocol.
  const requestUrl = new URL(request.url);
  const host = request.headers.get("host") ?? requestUrl.host;
  const publicOrigin = new URL(`${requestUrl.protocol}//${host}`).origin;
  const tokenRequest = new Request(new URL(requestUrl.pathname, publicOrigin), {
    method: request.method,
    headers: request.headers,
    signal: request.signal,
  });
  return createBrowserTokenHandler({
    client: files,
    authorize: async (request) => {
      const session = await auth.api.getSession({ headers: request.headers });
      return Boolean(session?.user);
    },
    scopes: ["files:read", "files:write", "files:delete"],
    allowedOrigins: [publicOrigin],
  })(tokenRequest);
}
