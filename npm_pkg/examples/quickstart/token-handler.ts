import { createFileServer } from "@skycanvasstudio/serve-server";
import { createBrowserTokenHandler } from "@skycanvasstudio/serve-server/adapters/fetch";

// Mount the returned handler as POST /api/file-server/token in your own backend.
// Pass your real session AND application/tenant permission check as authorize.
export function makeTokenHandler(
  authorize: (request: Request) => Promise<boolean>,
  consumerOrigin: string,
) {
  const baseUrl = process.env.FILE_SERVER_URL;
  const apiKey = process.env.FILE_SERVER_API_KEY;
  if (!baseUrl || !apiKey)
    throw new Error(
      "Set FILE_SERVER_URL and FILE_SERVER_API_KEY on your backend.",
    );
  return createBrowserTokenHandler({
    client: createFileServer({
      baseUrl,
      apiKey,
    }),
    authorize,
    allowedOrigins: [consumerOrigin],
    scopes: ["files:read", "files:write", "files:delete"],
    expiresInSeconds: 300,
  });
}
