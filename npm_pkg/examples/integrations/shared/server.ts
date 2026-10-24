import { createFileServer } from "@file-server/server";
export function createClient() {
  const baseUrl = process.env.FILE_SERVER_URL;
  const apiKey = process.env.FILE_SERVER_API_KEY;
  if (!baseUrl || !apiKey)
    throw new Error(
      "Set FILE_SERVER_URL and FILE_SERVER_API_KEY on the server.",
    );
  return createFileServer({ baseUrl, apiKey, timeoutMs: 60_000 });
}
export type Authorize = (request: Request) => boolean | Promise<boolean>;
