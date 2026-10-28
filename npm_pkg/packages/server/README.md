# @skycanvasstudio/serve-server

TypeScript client for a deployed [Serve File Server](https://github.com/khalids01/serve).
Node.js 20+ or Bun 1.1+; ESM and CommonJS. Uses standard Fetch APIs, with no framework runtime dependency.

```sh
npm install @skycanvasstudio/serve-server
```

```ts
import { createFileServer, FileServerError } from '@skycanvasstudio/serve-server';

const files = createFileServer({
  baseUrl: process.env.FILE_SERVER_URL!,
  apiKey: process.env.FILE_SERVER_API_KEY!,
  timeoutMs: 60_000,
});

const asset = await files.files.upload({
  file: new Blob(['hello'], { type: 'text/plain' }),
  filename: 'hello.txt',
  tags: ['example'],
});
const { data, pagination } = await files.files.list({ page: 1, limit: 20 });
const sameAsset = await files.files.get(asset.id);
const url = files.images.url(asset, { width: 640, format: 'webp', quality: 80 });
const deletion = await files.files.delete(asset.id);
```

The consuming app needs only `FILE_SERVER_URL` (the Serve origin, without `/api`) and `FILE_SERVER_API_KEY`. Your framework loads these server env variables. For a standalone Node script, use `node --env-file=.env.local upload.mjs` (Node 20.6+). The [SDK-first integration guide](https://github.com/khalids01/serve/blob/main/docs/integration-guide.md) includes runnable examples and a connection check.

Keep this client and its API key on the server. Never use public environment
variables, browser storage, or browser imports for an API key. An API key is
scoped to one application. Content URLs are **public**; authentication protects
management operations, not file downloads.

## API

`createFileServer(options)` accepts `baseUrl`, `apiKey`, optional `fetch`,
`timeoutMs`, `headers`, and `userAgent`. The base URL must be absolute HTTP(S).

| Method | Input / result |
| --- | --- |
| `files.upload(input)` | `file: File \| Blob \| Uint8Array \| ArrayBuffer`, optional `filename`, `contentType`, `tags`, `signal`; returns `FileAsset` |
| `files.list(input?)` | `page`, `limit` (1–100), `search`, `kind`, `contentType`, `tags`, `sortBy`, `sortOrder`, `signal`; returns `{data, pagination}` |
| `files.get(id, signal?)` | Returns one application-linked `FileAsset` |
| `files.delete(id, signal?)` | Returns `{id, unlinked: true, storageDeleted}` |
| `files.crop(id, input)` | Uploads a client-cropped raster image as a new asset; takes the same input as upload |
| `images.url(asset, transform?)` | Absolute URL; supports `width`, `height`, `quality`, `format` |
| `browserTokens.create(input)` | `scopes`, `allowedOrigins`, optional `expiresInSeconds` and `signal`; returns `{token, expiresAt}` |

A filename is required for Blob/buffer uploads; a File supplies its own name.
Each upload sends one multipart file. Calls do not automatically retry writes.
`sortBy` is `createdAt`, `updatedAt`, `name`, `size`, or `type`; `sortOrder` is
`asc` or `desc`. Tags use an AND match. `kind` is image/video/audio/document/archive/other/all.
Use `asset.urls.content` for range-capable original delivery and video seeking.
Image transforms preserve aspect ratio and do not upscale; the server clamps
dimensions to 4096 and quality to 1–100. Format is original/jpg/png/webp/avif.
SVG files are delivered as images without raster transformations.

Deleting a shared asset only removes the current application's link. The last
link deletion cleans up storage. Crop replacement is deliberately unsupported;
saving as new preserves other applications' content. Public content may remain
in browser/CDN caches after deletion.

## Authenticated browser access

Set a dedicated `FILE_SERVER_BROWSER_TOKEN_SECRET` (at least 32 characters) on
the File Server, and configure `NEXT_PUBLIC_APP_URL` to its public origin. On the
**consuming application's server**, mount this Fetch handler at
`/api/file-server/token`:

```ts
import { createBrowserTokenHandler } from '@skycanvasstudio/serve-server/adapters/fetch';

export const POST = createBrowserTokenHandler({
  client: files,
  authorize: async (request) => {
    const session = await yourApp.getSession(request);
    return Boolean(session?.canManageFiles);
  },
  scopes: ['files:read', 'files:write', 'files:delete'],
  allowedOrigins: ['https://your-app.example'],
  expiresInSeconds: 300,
});
```

Supply your own session/RBAC implementation. There is no permissive default.
The handler requires POST and rejects cross-origin browser requests. Behind a reverse proxy, preserve the public Host header and HTTP(S) protocol; origin checks support internal framework Request hostnames. It ignores
client-supplied scope/origin/application policy and returns `Cache-Control:
no-store`. Origins must be exact HTTP(S) origins without paths or trailing slashes.
Tokens default to five minutes and may live at most fifteen minutes.

## Errors and cancellation

Non-2xx responses throw `FileServerError` with `status`, `code`, `message`,
`details`, and `requestId`. Network errors use `status: 0, code: NETWORK_ERROR`.
Caller cancellation and timeouts raise an AbortError. Invalid client configuration
throws `FileServerConfigurationError`. Malformed success payloads fail schema
validation. Pass AbortSignal per operation to cancel work.

File validation is not antivirus scanning. Use dedicated test applications for
integration checks. See the repository's `npm_pkg/examples/integrations` for
Next.js, TanStack Start, Express, Nest and Elysia integration modules.

MIT licensed.

## S3 delivery (0.2 backend)

Stable Serve media URLs redirect to short-lived signed S3 GET URLs, so stored images,
variants, cached transforms, video/audio and PDFs bypass the Serve host for file bytes.
New transforms are processed once and saved. Local and active/text documents stay on Serve.
Buckets remain private, but application content retains its existing public-by-URL policy.
Signed URLs expose object paths and access-key IDs, never secret keys; do not persist or log them.
For JavaScript fetch/canvas, configure bucket CORS for your actual application origins, GET/HEAD
and Range, exposing Content-Length, Content-Range, Accept-Ranges and ETag. Native media display
does not ordinarily need CORS. See [the client package](../client/README.md).
