# Serve integration guide

Complete integration instructions for **SDK {{sdkVersion}}**, published as @skycanvasstudio/serve-server, @skycanvasstudio/serve-client, and @skycanvasstudio/serve-react. All three packages use the same release version. This entire guide is available without JavaScript at /docs and as plain Markdown at /docs.md. Agents can start with /llms.txt.
The SDK adds API paths and authorization headers; your app does not need storage-provider code.
For earlier endpoints, see [legacy REST testers](/docs/legacy).
Choose Default, Local or a saved S3 connection in the dashboard; see
the Storage section below.

## Getting started

Create an application and API key in the Serve dashboard. When reading this guide on a live Serve host, request `/api/v1/capabilities` on the same origin and confirm its `publicBaseUrl`; use that origin as FILE_SERVER_URL instead of copying the example domain. The operator must supply the application API key as a server secret. Use Node 20+ or Bun.
Install:

```sh
npm install @skycanvasstudio/serve-server@{{sdkVersion}}
```

In the consuming app's .env.local:

```env
{{snippet:consumerEnv}}
```

FILE_SERVER_URL is the public Serve origin, such as http://localhost:5000 in
local development. Do not append /api or a file path. Keep the key server-only;
never use NEXT_PUBLIC_ or VITE_ for the key. Restart your app after env changes.

Save upload.mjs:

```js
{{snippet:serverUpload}}
```

Run `node --env-file=.env.local upload.mjs` (Node 20.6+). Open the printed URL:
it should show Hello from Serve. Frameworks such as Next.js load server env
variables themselves, so no extra env-loader package is required there.

## File URLs: Serve, not a bucket endpoint

Use asset.urls.content for downloads, video/audio and byte-range streaming. In applications with a Content Security Policy, allow the Serve origin in the relevant connect-src, img-src and media-src directives; Direct delivery also needs the final storage host allowed for media. PDF embedding may require a permitted frame-src and browser viewer support. Avoid wildcard policies.
Use asset.urls.image or AdvancedImage for images and resizing. Persist asset.id
when your app needs to retrieve/delete it. URLs are already absolute.

The browser always starts from a stable Serve URL. **Proxy is the default:** Serve reads S3 and streams bytes back to the browser. **Direct** is optional, selected in Settings for Default or each saved connection: eligible S3 media requests redirect to signed GET URLs valid for 15 minutes. Direct currently signs S3 URLs. A CDN requires a separate compatible delivery setup; neither this SDK nor an S3 endpoint automatically provisions one. Never rewrite the hostname of a signed URL without a correctly configured signing/CDN integration. Direct works only when the visitor can reach the storage endpoint. If direct S3 connections are refused, select Proxy. Local storage always streams through Serve.

Resized images are processed on Serve and may be cached for reuse. In Direct mode, eligible stored transforms redirect to S3; Proxy keeps delivery through Serve. Redirect responses are not cached; signed responses use private short-term caching. Keep stable Serve URLs in your database, never expiring signed redirect targets. The SDK does not choose delivery mode per request.

S3 buckets stay private; storage secret keys never leave Serve. Signed URLs expose the
object path and access-key ID and grant temporary access to anyone holding the link.
Do not log them. Native media elements can display directly. For JavaScript fetch/canvas,
configure S3 CORS for your real app origins, GET/HEAD and Range, exposing Content-Length,
Content-Range, Accept-Ranges and ETag. Management tokens must never be sent to S3.
Delivered application content remains public by known Serve URL; tokens protect management.
Dashboard storage previews separately require a session and namespace permissions.

## Framework-independent JavaScript

Use @skycanvasstudio/serve-client for vanilla JavaScript, Vue, Svelte, or other browser frameworks. It has no React dependency. Your app still needs a backend token route; never put the application API key into this client, localStorage, HTML, or public environment variables.

```sh
npm install @skycanvasstudio/serve-client@{{sdkVersion}}
```

Copy browser-client.ts into your client-side source:

```ts
{{snippet:browserClient}}
```

Create the browser client once and reuse it. Call `const client = createFileBrowser(publicServeOrigin)` once, then `uploadFromBrowser(client, file)` with the File produced by your app's file picker. To cancel, pass an AbortController signal in upload options; list and storageLocations accept a signal as their final argument (get takes only an ID in this client version). To delete after user confirmation, call `await client.remove(asset.id)`. The returned asset, not the raw HTTP response, is the upload/get result. List returns `{ data, pagination }`. Use `pagination.hasNext` to enable your next-page control; request one page at a time rather than loading every file.

For a Fetch-compatible backend running Node 20+ or Bun, mount this factory's returned handler as POST /api/file-server/token:

```ts
{{snippet:genericTokenRoute}}
```

Supply the exact frontend origin (scheme, hostname, and optional port), for example https://app.example.com, and your real asynchronous session/permission function. Use your framework's Request/Response adapter if it does not expose Fetch objects. The complete Next.js example below shows a concrete Better Auth implementation. Express integrations must convert the incoming request and forward the handler's status, headers and body; they must authenticate the original request before minting a token. The browser token is obtained from your own backend, not directly from Serve with an API key.

## React integration

Keep the same FILE_SERVER_URL and FILE_SERVER_API_KEY on your consuming app's
server. Also install:

```sh
npm install @skycanvasstudio/serve-server@{{sdkVersion}} @skycanvasstudio/serve-react@{{sdkVersion}} server-only
```

React 18.2 and 19 are supported. The token route below assumes an existing Better
Auth instance at @/lib/auth. With a different provider, replace only authorize
with your app's real session/permission check. This example grants all signed-in
users file management; apply your role/tenant policy there when required.

lib/file-server.ts:

```ts
{{snippet:nextServerClient}}
```

app/api/file-server/token/route.ts:

```ts
{{snippet:nextTokenRoute}}
```

The consumer origin comes from Request, so no extra consumer-origin env variable
is required. Reverse proxies must preserve the public host/protocol. Never replace
authorize with an unconditional true. Do not copy the quickstart's lib/auth.ts:
it is a deny-by-default typecheck fixture, not an auth implementation.

app/files/files-client.tsx:

```tsx
{{snippet:nextFilesClient}}
```

app/files/page.tsx:

```tsx
{{snippet:nextFilesPage}}
```

Only the public base URL crosses into the client. After signing in, open /files,
upload an image/text file, preview it, and delete it. Import the CSS once and keep
the token provider stable. Server-only uploads do not need a provider/token route.

For other backends use the Fetch adapter factory above with your own authenticated route. The SDK is independent of your database and UI framework.

## Authentication

Your consuming app's login/session system is separate from Serve's dashboard login. The token route authenticates users of your consuming app. There are two separate file-management credentials:

| Credential | Where it lives | Use |
| --- | --- | --- |
| Application API key (`sk_…`) | Consuming app's backend only | Server SDK, upload/list/get/delete/crop, mint browser tokens |
| Browser token | Short-lived browser memory | Client/React management, restricted to one Serve application, scopes and allowed origins |

API keys are rejected on requests carrying a browser Origin header. Never work around this by putting keys in frontend code. The Fetch token adapter checks POST, exact Origin, the authorize callback, and scope configuration; its response is `{ data: { token, expiresAt } }` with `Cache-Control: no-store`. `createTokenProvider` expects this wrapped response; a custom TokenProvider must return the unwrapped `{ token, expiresAt }` object. Tokens are cached in memory, refreshed before expiry, and retried once after TOKEN_EXPIRED. Do not persist browser tokens or log credentials.

The Next.js example grants read/write/delete to every signed-in user of your consuming app. If those users must not see each other's application files, **do not copy that permission policy unchanged**. Use a separate Serve application/API key per tenant or trust boundary, and select the corresponding server client using your authenticated session and server-side database mapping. Never accept an API key, application ID, scopes, or arbitrary token origin from an untrusted browser. Check membership and the requested business action before returning true from authorize. Prefer read-only tokens (`files:read`) when uploads/deletion are unnecessary.

A browser `files:write` token can choose among the owner's available upload destinations. If your business rules require a fixed destination, upload through your authenticated backend and enforce the destination there instead of granting browser write access. Browser tokens do not grant access to dashboard settings, bucket browsing, account administration, transfers, or backups.

Delivered content is public by its known Serve URL. S3 buckets stay private, but **this SDK does not provide confidential per-user download authorization**. Do not treat an unpredictable file ID or a short-lived S3 URL as a privacy policy. Strict private content requires an additional protected delivery implementation. Revoking a management key or deleting an application link does not revoke previously cached public bytes.

## Storage

Configure connections, upload defaults and delivery in **Settings → Storage & backups** on Serve. Use **Storage** only to browse drives. Your consuming application does not need S3 endpoints, bucket names, credentials, local paths, or encryption keys.

| Upload choice | Meaning |
| --- | --- |
| Omit storageLocationId | Application default; an application inheriting Default uses the system upload default |
| `local` | Local persistent storage on the Serve VPS |
| `default` | The physical built-in Default drive configured by the Serve host; not necessarily the system upload default |
| Owned connection ID | An enabled S3 connection available to this application's owner |

Discover destinations with `await files.storage.list()` on the server, `await client.storageLocations()` in standalone JavaScript, or `useStorageLocations()` in React. The result contains `data` (id, name, kind, enabled, deliveryMode) and the resolved `defaultStorageLocationId`. Ignore disabled destinations. IDs come from Serve; bucket names and disk paths are not destination IDs.

```ts
{{snippet:serverOperations}}
```

Pass `storageLocationId` inside the server upload/crop input or browser upload options. In React, pass it as an option to `useUpload({ storageLocationId })` or as `<FileUploader storageLocationId="local" />`. **Do not call useUpload().upload(file, options)**: that hook's upload method accepts a File array, and its destination is configured on the hook. Changing a default affects future uploads, never moves old files. Persist the returned asset ID and stable URLs; Serve resolves the saved location.

Optional S3 backups of new local uploads run asynchronously after local writes. Existing files are not automatically backfilled, and upload success does not mean the backup is complete. Monitor Storage jobs on Serve. These file backups include variants and file/application JSON; Dokploy manages database backups. Backup/transfer administration is outside the public SDK.

## React components and hooks

The ready-made MediaLibrary from the React setup provides pagination, search, upload, previews and confirmed deletion. Use the hooks for custom screens. Import `@skycanvasstudio/serve-react/styles.css` once; wrap interactive hooks/components in FileServerProvider. AdvancedImage alone uses the provided asset URLs and does not require a provider, but its stylesheet is still needed for placeholders and layout.

```tsx
{{snippet:reactAdvanced}}
```

| API | Returned state / behavior |
| --- | --- |
| useFiles(input) | data array, pagination, loading, error, refetch; changing page/input refetches |
| useStorageLocations() | data array, defaultStorageLocationId, loading, error, refetch |
| useUpload(options) | items, uploading, upload(files: File[]), cancel(id), retry(id); upload resolves UploadItem[], not a single FileAsset |
| useDeleteFile() | remove(id), pending, error; call refetch after removal |
| FileUploader | storageLocationId, tags, accept, maxSizeBytes, maxFiles, multiple, parallel, onUploadComplete, onBatchComplete |
| FilePicker | Local file selection through onFiles(files); optional accept, multiple, maxFiles, maxSizeBytes, onReject |
| ImagePicker | Controlled asset selection through value and onChange; optional multiple, canBrowse, onCrop |
| FileServerProvider | baseUrl and tokenProvider required; optional fetch, theme (light/dark), className; create a new provider/client when switching accounts or tenants to discard cached tokens |
| MediaLibrary | optional pageSize (1–100), initialKind, showKindFilter, canUpload, canDelete, canSelect, multiple, value (FileAsset[]), onChange; hiding actions is UI only—enforce matching scopes on the server |
| FilePreview | asset required; optional className, textPreviewBytes (default 32000), captions [{ src, srcLang, label }] |
| UploadQueue | items required; optional onCancel(id), onRetry(id), className, itemClassName |
| AdvancedImage | asset and alt required; width, height, sizes, responsiveWidths, format, quality, fit, loading, fallback, onLoadingComplete optional |

`useUpload` options include tags, storageLocationId, parallel (default 3, clamped to 1–6), onUploadComplete(asset), and onBatchComplete(items). Each UploadItem has id, file, status (queued/uploading/processing/success/error/cancelled), progress, optional asset and error. The upload promise resolves a batch even when individual items fail or are cancelled: persist only successful items with an asset. Refetch your file list after upload completion.

For standalone upload progress, the exported low-level helper is `uploadWithProgress(url, file, tags, token, signal, onProgress, storageLocationId?)`, returning a FileAsset. Use the full Serve `/api/v1/files` URL, a short-lived browser token and an AbortSignal. Unlike the high-level browser client and React hook, this helper does not obtain/refresh its own token; refresh and retry once on UploadError with code TOKEN_EXPIRED. Do not supply an application API key.

Use AdvancedImage for raster images. `fit` controls CSS object-fit; it is not a server crop parameter. `responsiveWidths` creates srcSet candidates; `sizes` must describe your actual layout. Preserve intrinsic width/height to avoid layout shifts. Use loading="eager" and fetchPriority="high" only for an important above-the-fold image. Placeholders, when available, come from asset.urls.placeholder. An image error uses the fallback prop. Active SVG/HTML documents may be download-only for security; do not assume all image MIME types are safe inline content.

For videos/audio use the returned content URL with your framework's video/audio element and controls. PDFs can use a browser-supported viewer or a download link. Byte ranges are supported for seeking; browser codec support still matters. Serve does not transcode videos or supply malware scanning. Never inject uploaded HTML into your page.

## SDK reference

All examples use {{sdkVersion}}. Server methods use the API key; browser methods use the token provider. Do not manually add `/api/v1` to the configured baseUrl.

| Operation | Server SDK | Standalone client |
| --- | --- | --- |
| Upload | files.files.upload({ file, filename?, contentType?, tags?, storageLocationId?, signal? }) | client.upload(file: File, { tags?, storageLocationId?, signal? }) |
| List | files.files.list(input?) | client.list(input?, signal?) |
| Get | files.files.get(id, signal?) | client.get(id) |
| Delete | files.files.delete(id, signal?) | client.remove(id) |
| Cropped file | files.files.crop(id, uploadInput) | Upload a new file through your own backend; no browser crop convenience method |
| Destinations | files.storage.list(signal?) | client.storageLocations(signal?) |
| Image URL | files.images.url(asset, transform?) | imageUrl(asset, transform?) or client.imageUrl(asset, transform?) |
| Mint token | files.browserTokens.create({ scopes, allowedOrigins, expiresInSeconds? }) | Never mint directly with an application API key in a browser |

Server upload accepts File, Blob, Uint8Array, or ArrayBuffer. A File supplies its name; other inputs require filename. contentType is optional and inferred from Blob/File when present. Each HTTP request uploads one file. Neither SDK exposes bucket credentials.

List input supports page (1-based), limit (1–100), search, kind (`all`, `image`, `video`, `audio`, `document`, `archive`, `other`), contentType, sortBy (`createdAt`, `updatedAt`, `name`, `size`, `type`), and sortOrder (`asc`, `desc`). Server input additionally accepts tags (string array) and signal. Browser ListInput/useFiles do not expose tags filtering in 0.3.0. List returns `{ data: FileAsset[], pagination: { page, limit, total, pages, hasNext, hasPrev } }`. Empty lists have pages=0. Always honor pagination.

Upload/get/crop return a FileAsset directly; raw HTTP wraps it in `{ data }`. A FileAsset has id, filename, originalName, contentType, kind, sizeBytes, width/height (nullable), tags, createdAt/updatedAt (ISO strings), urls `{ content, image, placeholder }`, and variants. urls.image and urls.placeholder can be null. Each variant has id, label, contentType, width/height, sizeBytes, and url. Use the main asset once in your UI and expose variants underneath it; variants are not separate application uploads.

Delete returns `{ id, unlinked: true, storageDeleted: boolean }`. Shared bytes remain while another application references them. A crop is created client-side first, then submitted as a new raster file; the original is retained. The SDK does not crop by x/y coordinates or replace originals.

Image transform options are width, height (1–4096), quality (1–100), and format (`original`, `jpg`, `png`, `webp`, `avif`). Only raster images support transforms. For non-images use urls.content; check kind/contentType before requesting an image URL. The on-upload original may already be optimized; do not assume its bytes are identical to an input image.

### HTTP API

| Method and path | Auth | Purpose |
| --- | --- | --- |
| POST /api/v1/files | files:write | Multipart file; optional tags JSON array and storageLocationId |
| GET /api/v1/files | files:read | Paginated application files |
| GET /api/v1/files/:id | files:read | One application asset |
| DELETE /api/v1/files/:id | files:delete | Unlink/delete safely |
| POST /api/v1/files/:id/crops | files:write | Multipart raster file with saveMode=new |
| GET /api/v1/storage-locations | files:read | Destination metadata and resolved default |
| POST /api/v1/browser-tokens | API key only | Mint scoped token; backend only |
| GET /api/v1/capabilities | Public | apiVersion, publicBaseUrl, limits, token readiness |
| GET/HEAD /api/v1/files/:id/content | Public by known URL | Content with Range support |

Management auth is `Authorization: Bearer <application-key-or-browser-token>`. Let the SDK set multipart boundaries; never manually set a multipart Content-Type. JSON management errors have `{ error: { code, message, details?, requestId? } }`. The server SDK throws FileServerError (status, code, details, requestId), configuration errors use FileServerConfigurationError, and the browser client throws BrowserFileServerError (status, code, details). Token-route failures/network failures may be ordinary Errors; catch those too. Upload progress helpers can throw UploadError.

Read the deployed `/api/v1/capabilities` response for maxFileSizeBytes, supported image formats, maximum image dimension, and browserTokens.enabled. Default upload limits can be changed by the host. Apply the same or smaller limit in your consuming app and reverse proxy. An AbortController can cancel an active request, but cancellation after the server accepted an upload does not roll back stored data. Retrying a successful upload can reuse bytes; maintain your own business-operation idempotency if needed.

## Hosting

This is host configuration, not additional consuming-app env:

- NEXT_PUBLIC_APP_URL: externally reachable Serve origin, matching FILE_SERVER_URL.
- FILE_SERVER_BROWSER_TOKEN_SECRET: separate random secret of at least 32 characters;
  generate with `openssl rand -base64 32`. Required only for browser management.
- Existing PostgreSQL, auth and local/S3 storage configuration; see
  the existing Serve installation settings. Restart/redeploy after env changes.

Deploy the compatible /api/v1 backend before using the packages. Align reverse
proxy/platform body limits with MAX_FILE_SIZE_MB, forward the public host/protocol,
and preserve Range headers. Apply backend migrations before using new SDK features. The consuming application needs no Serve database schema or S3 credentials.

## Check the connection without changing files

Save check-serve.mjs and run `node --env-file=.env.local check-serve.mjs`:

```js
{{snippet:connectionCheck}}
```

This checks v1 deployment, the configured public origin, API-key acceptance and
browser-token readiness. It does not upload or delete data.

| Symptom | Action |
| --- | --- |
| npm package not found | Use the exact @skycanvasstudio names and public npm registry; use tarballs for unreleased builds |
| 404 on /api/v1 | Deploy the matching backend; use an origin without /api |
| 401 AUTH_REQUIRED | Supply the appropriate server key or browser token; do not use dashboard cookies as SDK credentials |
| 401 TOKEN_EXPIRED | The SDK retries once; check token-route sessions and host clock if failures persist |
| 403 SCOPE_DENIED | Mint only the additional scope your authenticated user is permitted to use |
| 403 ORIGIN_DENIED | Token is bound to a different browser origin; check exact scheme, host and port |
| 401 INVALID_API_KEY | Use a current key for the correct Serve application |
| 503 BROWSER_TOKENS_NOT_CONFIGURED | Set the dedicated secret on the Serve host |
| Token route returns 401 | Sign in to the consuming app; connect real authorization |
| 403 ORIGIN_DENIED / browser CORS error | Check token origin and proxy public host/protocol |
| URLs point at localhost/wrong host | Correct NEXT_PUBLIC_APP_URL on Serve and redeploy |
| 413 | Align proxy/platform request size and Serve upload limits |
| Direct images fail / ERR_CONNECTION_REFUSED | Select Proxy in Serve Settings, or fix browser reachability to the S3 endpoint |
| 403 / invalid storage location | Use an enabled destination from discovery belonging to this application owner |
| 429 | Respect rate limits; avoid polling or loading every page concurrently |
| React hook missing provider | Wrap the component in FileServerProvider and import CSS once |
| Image has no preview | Check kind/contentType, use urls.content for non-images, and inspect MIME/codec support |

## Verification and practical limits

CI checks these exact code blocks for drift, typechecks the Next.js files from
clean tarball installs, and executes the standalone scripts with an injected
transport. Integration tests connect the SDK and browser-token handler to the real
Serve v1 routes, validators, serializer, file processing, range delivery and deletion,
using in-memory database/storage substitutes. This catches API/SDK incompatibility;
it does not prove a particular deployed PostgreSQL/S3/proxy configuration is healthy.
Run the connection check and a staging upload/preview/delete before release.

## Integration acceptance checklist

1. The human/operator supplies the Serve origin and an application API key through server secrets. Never invent production credentials or copy keys from docs testers.
2. Install the matching {{sdkVersion}} package(s). Run the connection check: API version, public URL, key acceptance and browser-token readiness must pass.
3. Implement your existing session/tenant policy in the token or server upload route. Verify anonymous requests are denied and a foreign Origin is rejected.
4. Upload a small image and ordinary file to the default destination. Save asset.id and stable URLs in your own database. Retrieve/list them using pagination and render previews.
5. If destination overrides are required, discover available locations and test one permitted override. Confirm changing defaults does not break existing file URLs.
6. For React, verify CSS, provider, placeholders, pagination, error state, upload progress, cancellation/retry and confirmation before deletion. For standalone clients, wire the same operations to your framework's own controls.
7. On a staging asset, test deletion and a newly uploaded crop, never destructive tests on production files. Check video seeking/PDF download if your app uses those types.
8. In browser DevTools, confirm API keys never reach client JavaScript, browser storage or network requests. Tokens only go to Serve management, not signed S3 URLs.
9. Confirm Proxy/Direct behavior for your actual visitors. A passing SDK unit test cannot prove your S3 region, CDN, CORS or reverse proxy is reachable.

Agents must stop and request missing origin, credentials, authorization requirements or tenant mapping rather than weakening authorization. A working backend-only upload does not require React or browser tokens. Do not add S3 provider logic to a consuming app when Serve already handles storage.
