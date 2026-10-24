import { createFileServer } from "@file-server/server";

const files = createFileServer({
  baseUrl: process.env.FILE_SERVER_URL,
  apiKey: process.env.FILE_SERVER_API_KEY,
});
const response = await fetch(new URL("/api/v1/capabilities", files.baseUrl));
if (!response.ok)
  throw new Error(`Serve v1 is unavailable: HTTP ${response.status}`);
const { data: capabilities } = await response.json();
if (capabilities.apiVersion !== "v1")
  throw new Error("Deploy the Serve v1 backend first.");
if (capabilities.publicBaseUrl !== new URL(files.baseUrl).origin)
  throw new Error(
    "The Serve host's NEXT_PUBLIC_APP_URL must match FILE_SERVER_URL.",
  );
const { data } = await files.files.list({ limit: 1 });
for (const asset of data) {
  for (const url of [
    asset.urls.content,
    asset.urls.image,
    asset.urls.placeholder,
  ]) {
    if (url && new URL(url).origin !== new URL(files.baseUrl).origin) {
      throw new Error(
        "The Serve host's NEXT_PUBLIC_APP_URL must match FILE_SERVER_URL.",
      );
    }
  }
}
console.log("Server SDK: connected; API key accepted.");
console.log(
  capabilities.browserTokens.enabled
    ? "React: browser tokens enabled. Add your authenticated token route."
    : "React: set FILE_SERVER_BROWSER_TOKEN_SECRET on the Serve host first.",
);
