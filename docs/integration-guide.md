# Serve Integration Guide

Use this guide for new integrations. The same checked examples appear on Serve's /docs page.
The SDK adds API paths and authorization headers; your app does not need storage-provider code.
For earlier endpoints, see [legacy-integration-guide.md](legacy-integration-guide.md).
Choose Default, Local or a saved S3 connection in the dashboard; see
[storage connections and file manager](storage-and-file-manager.md).

## Server: two env variables and one package

Create an application and API key in the Serve dashboard. Use Node 20+ or Bun.
Install:

```sh
npm install @skycanvasstudio/serve-server
```

For an unreleased local build, install the verified server tarball from npm_pkg/artifacts instead.
In the consuming app's .env.local:

```env
# Your consuming app needs these two values. Never use a public prefix for the key.
FILE_SERVER_URL=https://files.example.com
FILE_SERVER_API_KEY=sk_replace_with_your_application_key
```

FILE_SERVER_URL is the public Serve origin, such as http://localhost:5000 in
local development. Do not append /api or a file path. Keep the key server-only;
never use NEXT_PUBLIC_ or VITE_ for the key. Restart your app after env changes.

Save upload.mjs:

```js
import { createFileServer } from "@skycanvasstudio/serve-server";

const files = createFileServer({
  baseUrl: process.env.FILE_SERVER_URL,
  apiKey: process.env.FILE_SERVER_API_KEY,
});

const asset = await files.files.upload({
  file: new Blob(["Hello from Serve"], { type: "text/plain" }),
  filename: "hello.txt",
});

console.log("File URL:", asset.urls.content);
```

Run `node --env-file=.env.local upload.mjs` (Node 20.6+). Open the printed URL:
it should show Hello from Serve. Frameworks such as Next.js load server env
variables themselves, so no extra env-loader package is required there.

## File URLs: Serve, not a bucket endpoint

Use asset.urls.content for downloads, video/audio and byte-range streaming.
Use asset.urls.image or AdvancedImage for images and resizing. Persist asset.id
when your app needs to retrieve/delete it. URLs are already absolute.

The browser requests a stable Serve URL. For stored images, variants, video, audio and
PDFs on HTTPS S3, Serve redirects to a 15-minute signed GET URL. File bytes download
directly from S3, bypassing the Serve host. New image transforms are generated on Serve,
persisted in storage, then redirected; subsequent requests reuse them. Local storage,
HTTP storage endpoints and active/text documents retain Serve delivery. Download requests
with download=1 also use direct S3 delivery. Redirects are never cached; signed responses
use private five-minute caching. Keep stable Serve URLs, not expiring redirect targets.

S3 buckets stay private; storage secret keys never leave Serve. Signed URLs expose the
object path and access-key ID and grant temporary access to anyone holding the link.
Do not log them. Native media elements can display directly. For JavaScript fetch/canvas,
configure S3 CORS for your real app origins, GET/HEAD and Range, exposing Content-Length,
Content-Range, Accept-Ranges and ETag. Management tokens must never be sent to S3.
Delivered application content remains public by known Serve URL; tokens protect management.
Dashboard storage previews separately require a session and namespace permissions.

## Framework-independent JavaScript

Install @skycanvasstudio/serve-client for vanilla JavaScript, Vue, Svelte or other frameworks.
It has no React dependency. React hooks and AdvancedImage use this same client and URL helpers.

```ts
import { createBrowserClient, createTokenProvider, imageUrl } from "@skycanvasstudio/serve-client";
const files = createBrowserClient({
  baseUrl: "https://files.example.com",
  tokenProvider: createTokenProvider("/api/file-server/token"),
});
const page = await files.list({ page: 1, limit: 24 });
const image = page.data.find((file) => file.kind === "image");
if (image) console.log(imageUrl(image, { width: 640, format: "webp" }));
```

Use the authenticated token route shown below; never give this client your API key.

## React / Next.js App Router

Keep the same FILE_SERVER_URL and FILE_SERVER_API_KEY on your consuming app's
server. Also install:

```sh
npm install @skycanvasstudio/serve-react server-only
```

React 18.2 and 19 are supported. The token route below assumes an existing Better
Auth instance at @/lib/auth. With a different provider, replace only authorize
with your app's real session/permission check. This example grants all signed-in
users file management; apply your role/tenant policy there when required.

lib/file-server.ts:

```ts
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
```

app/api/file-server/token/route.ts:

```ts
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
```

The consumer origin comes from Request, so no extra consumer-origin env variable
is required. Reverse proxies must preserve the public host/protocol. Never replace
authorize with an unconditional true. Do not copy the quickstart's lib/auth.ts:
it is a deny-by-default typecheck fixture, not an auth implementation.

app/files/files-client.tsx:

```tsx
"use client";

import {
  createTokenProvider,
  FileServerProvider,
  MediaLibrary,
} from "@skycanvasstudio/serve-react";
import "@skycanvasstudio/serve-react/styles.css";

const tokenProvider = createTokenProvider("/api/file-server/token");

export function FilesClient({ baseUrl }: { baseUrl: string }) {
  return (
    <FileServerProvider baseUrl={baseUrl} tokenProvider={tokenProvider}>
      <MediaLibrary />
    </FileServerProvider>
  );
}
```

app/files/page.tsx:

```tsx
import { files } from "@/lib/file-server";
import { FilesClient } from "./files-client";

export default function FilesPage() {
  return <FilesClient baseUrl={files.baseUrl} />;
}
```

Only the public base URL crosses into the client. After signing in, open /files,
upload an image/text file, preview it, and delete it. Import the CSS once and keep
the token provider stable. Server-only uploads do not need a provider/token route.

For Express, Nest, Elysia and TanStack Start, use the checked modules in
[npm_pkg/examples/integrations](../npm_pkg/examples/integrations/README.md).

## Configure the Serve host once

This is host configuration, not additional consuming-app env:

- NEXT_PUBLIC_APP_URL: externally reachable Serve origin, matching FILE_SERVER_URL.
- FILE_SERVER_BROWSER_TOKEN_SECRET: separate random secret of at least 32 characters;
  generate with `openssl rand -base64 32`. Required only for browser management.
- Existing PostgreSQL, auth and local/S3 storage configuration; see
  [configuration.md](configuration.md). Restart/redeploy after env changes.

Deploy the compatible /api/v1 backend before using the packages. Align reverse
proxy/platform body limits with MAX_FILE_SIZE_MB, forward the public host/protocol,
and preserve Range headers. No schema migration is added by the SDK work.

## Check the connection without changing files

Save check-serve.mjs and run `node --env-file=.env.local check-serve.mjs`:

```js
import { createFileServer } from "@skycanvasstudio/serve-server";

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
```

This checks v1 deployment, the configured public origin, API-key acceptance and
browser-token readiness. It does not upload or delete data.

| Symptom | Action |
| --- | --- |
| npm package not found | Use the exact @skycanvasstudio names and public npm registry; use tarballs for unreleased builds |
| 404 on /api/v1 | Deploy the matching backend; use an origin without /api |
| 401 INVALID_API_KEY | Use a current key for the correct Serve application |
| 503 BROWSER_TOKENS_NOT_CONFIGURED | Set the dedicated secret on the Serve host |
| Token route returns 401 | Sign in to the consuming app; connect real authorization |
| 403 ORIGIN_DENIED / browser CORS error | Check token origin and proxy public host/protocol |
| URLs point at localhost/wrong host | Correct NEXT_PUBLIC_APP_URL on Serve and redeploy |
| 413 | Align proxy/platform request size and Serve upload limits |

## Verification and practical limits

CI checks these exact code blocks for drift, typechecks the Next.js files from
clean tarball installs, and executes the standalone scripts with an injected
transport. Integration tests connect the SDK and browser-token handler to the real
Serve v1 routes, validators, serializer, file processing, range delivery and deletion,
using in-memory database/storage substitutes. This catches API/SDK incompatibility;
it does not prove a particular deployed PostgreSQL/S3/proxy configuration is healthy.
Run the connection check and a staging upload/preview/delete before release.
