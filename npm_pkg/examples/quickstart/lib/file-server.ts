import "server-only";
import { createFileServer } from "@skycanvasstudio/serve-server";

const baseUrl = process.env.FILE_SERVER_URL;
const apiKey = process.env.FILE_SERVER_API_KEY;
if (!baseUrl || !apiKey) {
  throw new Error(
    "Set FILE_SERVER_URL and FILE_SERVER_API_KEY on your app's server.",
  );
}
export const files = createFileServer({ baseUrl, apiKey });
