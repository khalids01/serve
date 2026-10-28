# @skycanvasstudio/serve-client

Framework-independent browser client for Serve. No React, Node built-ins, API keys or S3 credentials.
Use it from vanilla JavaScript, Vue, Svelte or React (serve-react uses this package).

```sh
npm install @skycanvasstudio/serve-client
```

```ts
import { createBrowserClient, createTokenProvider, imageUrl } from "@skycanvasstudio/serve-client";

const files = createBrowserClient({
  baseUrl: "https://files.example.com",
  tokenProvider: createTokenProvider("/api/file-server/token"),
});
const page = await files.list({ page: 1, limit: 24, kind: "image" });
const asset = page.data[0];
if (asset) document.querySelector("img")!.src = imageUrl(asset, { width: 640, format: "webp" });
// await files.upload(fileInput.files[0], { tags: ["cover"], signal });
// await files.get(asset.id);
// await files.remove(asset.id);
```

Your application's authenticated backend must implement the token route with serve-server's
createBrowserTokenHandler and its real session/permission checks. Browser tokens are short lived,
application-scoped and origin-bound. The client caches and refreshes them; no API key belongs
in the browser. An injectable fetch supports tests. API requests refuse redirects to avoid
forwarding management authorization to storage or an unexpected host.

`imageUrl(asset, { width, height, quality, format })` uses the same helper as serve-server and
serve-react's AdvancedImage. Width/height are bounded at 4096 and quality at 100 on Serve.
Native image/video/audio/PDF elements follow Serve's temporary S3 redirects without proxying
file bytes through Serve. New image transforms are generated once on Serve and persisted;
cache hits and stored variants download from S3 directly. Local and active document content
remain on Serve. Use the returned stable Serve URLs, not a persisted expiring redirect target.

Content URLs retain Serve's existing public-by-URL semantics. Management tokens do not make
those URLs private. Dashboard storage previews are separately session-authorized. A signed S3
URL is a bearer link valid up to 15 minutes; it includes object/bucket path and access-key ID,
never the secret key. Do not log it or send management tokens to it. Private browser caching
may retain downloaded bytes for five minutes. Shared CDN caching is not enabled.

For JavaScript fetch/canvas access to S3 media, configure bucket CORS for your actual app
origins: GET/HEAD, request header Range, exposed Content-Length, Content-Range, Accept-Ranges,
and ETag. Native media display ordinarily does not require CORS. Do not open bucket access.
Use uploadWithProgress for optional XMLHttpRequest progress/cancellation; client.upload uses fetch.

Read-only storage can still preview: when cache writes are unavailable, newly generated
thumbnails/transforms are returned through Serve without persistence. Stored originals and
variants continue to use direct delivery.
