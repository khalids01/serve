# File Server npm Packages — Implementation Plan

## 1. Purpose

Build two reusable npm packages for the existing File Server application:

- `@skycanvasstudio/serve-server`: a framework-neutral TypeScript server SDK for uploading and managing files through a deployed File Server instance.
- `@skycanvasstudio/serve-react`: React components and hooks for file/image upload, selection, preview, management, and optimized image rendering.

All npm-package source, package tooling, package tests, and package examples must live under the project-root `npm_pkg/` directory. The existing Next.js application remains in its current root structure.

The final developer experience should let a TypeScript application use File Server without implementing storage-provider logic, multipart request logic, URL construction, placeholder selection, media preview logic, or File Server authentication plumbing.

This document is an implementation plan only. It does not authorize publishing packages, starting application servers, changing the database, or running migrations.

---

## 2. Instructions for the implementation agent

Follow these rules throughout the implementation:

1. Implement phases in the order written. Do not start a later phase while an earlier phase has failing acceptance criteria.
2. Do not run Git commands unless the user explicitly asks.
3. Do not start the File Server application or any example application unless the user explicitly permits it. Static checks, unit tests, package builds, and tarball inspection are allowed.
4. Do not make a Prisma schema change or run a migration, database push, seed, or any command that can synchronize a schema without first asking the user to run/approve it.
5. Version 1 must not require a database migration. Keep the existing Prisma `Image`, `ImageVariant`, and `ImageApplication` model names internally and expose generic `FileAsset` names only at the API/SDK boundary.
6. Never expose or bundle an application API key in `@skycanvasstudio/serve-react`, browser code, public environment variables, HTML, or browser storage.
7. Never import `next/*`, Prisma, `@/` aliases, root application modules, or root application UI components from either public package.
8. Keep framework-specific code behind explicit subpath exports. Importing the main server SDK must not load Express, NestJS, Elysia, or Next.js.
9. Preserve existing `/api/*` endpoints for backward compatibility. Add `/api/v1/*` endpoints rather than silently changing existing response shapes.
10. Do not publish to npm from this plan. Prepare and verify package tarballs only; publishing requires separate user approval.
11. If the npm scope/package names are unavailable, stop and ask the user for the final names. Do not silently choose a different brand.
12. Keep changes focused. Do not move the existing Next.js app into an `apps/` folder as part of this work.

---

## 3. Locked architectural decisions

### 3.1 Directory boundary

Use an isolated nested workspace:

```text
file-server/
├── npm_pkg/
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.base.json
│   ├── README.md
│   ├── packages/
│   │   ├── contracts/
│   │   ├── server/
│   │   └── react/
│   └── examples/
│       ├── next-app-router/
│       ├── tanstack-start/
│       ├── express/
│       ├── nest/
│       └── elysia/
├── docs/
├── prisma/
├── src/
└── package.json
```

`npm_pkg/package.json` is the package-development workspace root. Do not turn the repository root into a workspace and do not relocate the app.

### 3.2 Packages

There are exactly two user-facing packages:

| Directory | Package | Published | Purpose |
| --- | --- | --- | --- |
| `npm_pkg/packages/server` | `@skycanvasstudio/serve-server` | Yes | Server-only API client and integration handlers |
| `npm_pkg/packages/react` | `@skycanvasstudio/serve-react` | Yes | React provider, hooks, uploaders, pickers, previews, and image component |
| `npm_pkg/packages/contracts` | `@file-server/contracts` | No, private | Canonical DTOs, schemas, MIME helpers, error types, and test fixtures |

The private contracts workspace must be bundled into both public packages. Published tarballs must not contain a runtime or declaration-file import of `@file-server/contracts`, and neither published `package.json` may list it as a dependency.

If reliable bundling of private contracts into declaration files becomes fragile, the permitted fallback is to publish `@file-server/contracts` as an implementation dependency. That changes the “two public packages” decision and therefore requires user approval first.

### 3.3 Runtime and module targets

- TypeScript source only; generated output goes to each package's `dist/` directory.
- `@skycanvasstudio/serve-server` supports Node.js 20+ and Bun 1.1+.
- The server SDK uses standard `fetch`, `Request`, `Response`, `Headers`, `FormData`, `Blob`, and `AbortSignal` concepts and permits injecting a custom `fetch` implementation.
- Publish ESM and CommonJS builds for the server package.
- Publish ESM and CommonJS builds for the React package, with React 18.2 and React 19 supported as peer versions.
- All package source is strict TypeScript. Do not inherit the Next.js root `tsconfig.json` because it contains app-specific path aliases and Next settings.
- Use explicit package exports; do not expose arbitrary `dist` internals.
- Packages must be tree-shakeable. Mark JavaScript modules side-effect-free while preserving the React CSS file as a declared side effect.

### 3.4 Styling decision

`@skycanvasstudio/serve-react` must not require Tailwind CSS, shadcn/ui, or the consuming application's build-time class scanning.

Ship small, namespaced plain CSS as `@skycanvasstudio/serve-react/styles.css`. Use `fs-` class names and `--fs-*` CSS custom properties. Every component must also accept `className` and useful slot class overrides so consumers can restyle it.

Do not copy the app's complete shadcn component library into the package.

### 3.5 API and tenancy decision

- Public SDK terminology is `FileAsset`, not `Image`, because the service already stores images, video, audio, PDFs, text, archives, and other files.
- An API key is scoped to exactly one File Server application.
- SDK list/get/delete calls made with an API key operate only in that key's application context.
- Global content deduplication remains an internal implementation detail.
- SDK responses must not reveal other applications linked to the same deduplicated blob.
- Existing app/session administration can continue to show cross-application information to the authenticated owner, but the new API-key and browser-token API must not.
- Version 1 treats delivered asset URLs as public URLs. Private/signed asset delivery is a future feature and must not be implied by the SDK documentation.

---

## 4. Current application capabilities to reuse

The current application already provides these foundations:

- Multipart upload in `src/app/api/upload/`.
- API-key validation and application scoping through `src/lib/api-keys.ts` and `src/features/auth/guard.ts`.
- Global content-hash deduplication in `src/lib/image-upload.ts`.
- Local and S3-compatible storage backends under `src/lib/storage/`.
- Original image optimization, WebP generation, and placeholder generation in `src/lib/file-storage.ts` and `src/lib/storage/image.ts`.
- On-demand image resizing and format/quality transformation through `/api/img/[name]`.
- Byte-range file streaming through `/api/files/[id]/content`, which is required for video seeking.
- File list/get/delete routes.
- Image crop support.
- Existing dashboard upload queue, grid/list views, type filters, progressive image, image/video/audio/PDF/text previews, and delete confirmation UI.

Reuse behavior and domain knowledge from these files, but do not directly package their Next.js, Prisma, Axios, TanStack Query, shadcn, or app-alias dependencies.

---

## 5. Problems that must be corrected before exposing management SDKs

### 5.1 Shared-file deletion

The current data model can link one deduplicated `Image` row to multiple applications. The current delete route deletes the global blob, variants, and database row when any linked application deletes it. That can remove a file used by another application.

The `/api/v1/files/:id` delete behavior must instead:

1. Resolve the authenticated application from the API key or browser token.
2. Confirm that the requested file is linked to that application.
3. Delete only that application's `ImageApplication` link.
4. Re-query/count remaining application links inside the operation.
5. Delete the global `Image`, variants, cached transformations, and storage objects only if no links remain.
6. Return whether only a link was removed or underlying storage was also deleted.
7. Never return the identities of other linked applications to an API-key/browser-token caller.

Suggested response:

```ts
type DeleteFileResult = {
  id: string
  unlinked: true
  storageDeleted: boolean
}
```

Add tests for two applications sharing the same content hash. Deleting from application A must leave application B's listing and content URL working.

### 5.2 Crop/replace on shared content

The current crop “replace” path overwrites storage by filename. If a blob is linked to multiple applications, this mutates content for all of them and also invalidates content-hash assumptions.

For `/api/v1`, use these rules:

- `saveMode: "new"` creates or deduplicates a new asset and links it to the current application.
- `saveMode: "replace"` is allowed only when exactly one application link exists.
- If more than one application link exists, return `409 FILE_SHARED` with a message telling the client to save as new.
- A replacement must recompute the content hash, filenames, variants, placeholder variants, size, width, height, and cache state. Do not merely overwrite the original filename.
- If safe atomic replacement cannot be implemented without a schema/data risk, omit replace from SDK v1 and expose “save crop as new” only.

### 5.3 Authentication order

Authenticate and authorize before reading multipart bodies. In particular, do not call `request.formData()` before validating credentials and file ownership. This avoids processing large unauthenticated bodies.

### 5.4 API response consistency

Current endpoints return different shapes and relative URL fields. `/api/v1` must use one contract, one error shape, and one serializer. Do not make SDK code guess between legacy response formats.

### 5.5 Browser secrets and CORS

The existing API-key model is server-to-server. It must not be used directly by React components. Add short-lived browser access tokens and scoped CORS before allowing `@skycanvasstudio/serve-react` to call the File Server origin directly.

---

## 6. Canonical `/api/v1` contract

Create one canonical contract in `npm_pkg/packages/contracts`. The File Server app may mirror/import generated contract artifacts only through an explicit local dependency or generated file; it must not reach into unpublished package source using fragile relative paths.

Use Zod schemas as the source for runtime validation and inferred TypeScript types. Every route must validate path/query/body inputs and serialize through the canonical schemas.

### 6.1 Shared types

The minimum public types are:

```ts
type FileKind =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "archive"
  | "other"

type FileVariant = {
  id: string
  label: string
  contentType: string
  width: number | null
  height: number | null
  sizeBytes: number
  url: string
}

type FileAsset = {
  id: string
  filename: string
  originalName: string
  contentType: string
  kind: FileKind
  sizeBytes: number
  width: number | null
  height: number | null
  tags: string[]
  createdAt: string
  updatedAt: string
  urls: {
    content: string
    image: string | null
    placeholder: string | null
  }
  variants: FileVariant[]
}

type Pagination = {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

type ApiErrorBody = {
  error: {
    code: string
    message: string
    details?: unknown
    requestId?: string
  }
}
```

Rules:

- Dates are ISO-8601 strings at the transport boundary.
- Missing dimensions are `null`, not sometimes `undefined` and sometimes `null`.
- Tags always serialize as an array.
- URLs are absolute and are based on the configured public File Server base URL, not the incoming proxy host.
- `urls.content` points to the range-capable raw file endpoint.
- `urls.image` exists only for image assets and points to the original image-serving endpoint.
- `urls.placeholder` is the preferred placeholder variant URL when available.
- Do not expose the content hash, storage key, bucket name, local path, other linked applications, owner ID, or API-key information.

### 6.2 Routes

Add these versioned routes while keeping legacy routes operational:

| Method | Route | Authentication | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/v1/files` | API key or scoped browser token | Upload one file |
| `GET` | `/api/v1/files` | API key or scoped browser token | List current application's files |
| `GET` | `/api/v1/files/:id` | API key or scoped browser token | Get one linked file |
| `DELETE` | `/api/v1/files/:id` | API key or `files:delete` token | Safely unlink/delete one file |
| `GET` | `/api/v1/files/:id/content` | Public in v1 | Stream raw file with range support |
| `HEAD` | `/api/v1/files/:id/content` | Public in v1 | Return content metadata |
| `POST` | `/api/v1/files/:id/crops` | API key or `files:write` token | Save cropped image as new; optional safe replace |
| `POST` | `/api/v1/browser-tokens` | API key only | Mint a short-lived browser token |
| `GET` | `/api/v1/capabilities` | Public | Report supported limits/features |

Use `Authorization: Bearer <credential>` as canonical authentication. Continue accepting `x-api-key` for API keys for compatibility.

### 6.3 Upload request

Version 1 uploads one file per request. Multiple selection and parallelism belong in the SDK/UI queue, not in a custom multipart JSON mapping.

Multipart fields:

```text
file: File                     required
tags: JSON string[]            optional
```

The authenticated credential determines the application. `/api/v1/files` must reject a client-supplied `applicationId`; never let browser input switch the API key/token's application.

Return `201` and `{ data: FileAsset }` for a newly stored or newly linked asset.

Validate:

- Missing/empty file.
- Maximum byte size before expensive image processing.
- Sanitized original filename and a bounded filename length.
- Bounded tag count and tag length.
- MIME type and extension consistency where detectable.
- Image decode validity before Sharp transformations.

Do not claim full malware detection in v1. Document that File Server validates file shape/type and size but is not an antivirus product.

### 6.4 List request

Supported query fields:

```ts
type ListFilesInput = {
  page?: number             // default 1
  limit?: number            // default 20, max 100
  search?: string
  kind?: FileKind | "all"
  contentType?: string
  tags?: string[]
  sortBy?: "createdAt" | "updatedAt" | "name" | "size" | "type"
  sortOrder?: "asc" | "desc"
}
```

Return `{ data: FileAsset[], pagination: Pagination }`.

Search must stay scoped to the authenticated application's junction rows before pagination/counting. Do not fetch all files and filter client-side in the API.

### 6.5 Image URL builder contract

Support these transformation fields:

```ts
type ImageTransform = {
  width?: number
  height?: number
  quality?: number
  format?: "original" | "jpg" | "png" | "webp" | "avif"
  fit?: "contain" | "cover" | "fill" | "inside" | "outside"
}
```

Only advertise transformations implemented by the server. If `fit` is not implemented in the existing image route, either add and test it or omit it from the v1 capability response and SDK type. Do not expose a non-functional option.

Clamp server-side values even if the SDK validates them. Keep maximum dimensions and allowed output formats in one shared server configuration.

### 6.6 Error codes

Use stable machine-readable codes. Minimum set:

- `AUTH_REQUIRED`
- `INVALID_API_KEY`
- `INVALID_BROWSER_TOKEN`
- `TOKEN_EXPIRED`
- `SCOPE_DENIED`
- `ORIGIN_DENIED`
- `FILE_NOT_FOUND`
- `FILE_TOO_LARGE`
- `FILE_TYPE_NOT_ALLOWED`
- `INVALID_UPLOAD`
- `INVALID_QUERY`
- `FILE_SHARED`
- `RATE_LIMITED`
- `STORAGE_ERROR`
- `INTERNAL_ERROR`

The server SDK maps non-2xx responses into a typed `FileServerError` while retaining status, code, details, and request ID.

---

## 7. Browser-token security model

### 7.1 Why it is required

React management/upload components need read/write/delete access, but shipping a long-lived File Server API key to the browser would let anyone extract it. Use short-lived scoped browser tokens.

### 7.2 Token design

Use a well-maintained JOSE/JWT library rather than custom cryptography.

Token claims must include:

```ts
type BrowserTokenClaims = {
  iss: "file-server"
  aud: "file-server-browser"
  sub: string                    // application ID
  scopes: Array<"files:read" | "files:write" | "files:delete">
  origins: string[]
  iat: number
  exp: number
  jti: string
}
```

Use a dedicated `FILE_SERVER_BROWSER_TOKEN_SECRET`, not the database URL, API-key hash, or public app URL. Validate that the secret is present and sufficiently long when the feature is enabled.

Defaults:

- Token lifetime: 5 minutes.
- Maximum lifetime accepted by the File Server: 15 minutes.
- React refresh point: 30 seconds before expiry.
- Token storage: memory only. Never use localStorage or sessionStorage by default.

`POST /api/v1/browser-tokens` is authenticated by the application's API key and accepts only requested scopes, TTL, and allowed origins. It must never mint access for a different application ID.

### 7.3 Consumer-side token handler

`@skycanvasstudio/serve-server` provides a handler factory that a consuming application's authenticated backend can mount. The handler calls the File Server token endpoint with its private API key.

The authorization callback is mandatory:

```ts
const handler = createBrowserTokenHandler({
  client: fileServer,
  authorize: async (request) => {
    // Call the consuming application's own session/RBAC check here.
    return true
  },
  scopes: ["files:read", "files:write", "files:delete"],
  allowedOrigins: ["https://consumer.example.com"],
})
```

The factory must refuse construction when `authorize` or `allowedOrigins` is omitted. Do not ship an insecure “allow everyone” default.

Use `POST` for the consumer token endpoint, send `Cache-Control: no-store`, validate same-origin/CSRF expectations, and never include the private API key in the response.

### 7.4 CORS

For browser-token requests to `/api/v1/*`:

- Handle `OPTIONS`.
- Echo only an origin included in the validated token's `origins` claim.
- Set `Vary: Origin`.
- Allow `Authorization`, `Content-Type`, and request ID headers.
- Allow only necessary methods.
- Do not combine credential cookies with wildcard origins.
- Reject an `Origin` header not present in the token.

Public content responses may retain `Access-Control-Allow-Origin: *` for v1.

---

## 8. `@skycanvasstudio/serve-server` design

### 8.1 Package structure

```text
npm_pkg/packages/server/
├── src/
│   ├── index.ts
│   ├── client.ts
│   ├── errors.ts
│   ├── request.ts
│   ├── files.ts
│   ├── images.ts
│   ├── browser-tokens.ts
│   └── adapters/
│       ├── fetch.ts
│       ├── express.ts
│       ├── elysia.ts
│       └── nest.ts
├── test/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── README.md
└── CHANGELOG.md
```

Do not create a Next-specific runtime adapter. Next.js App Router and TanStack Start should use the standard Fetch `Request -> Response` adapter from `@skycanvasstudio/serve-server/adapters/fetch`.

### 8.2 Main client API

Target API:

```ts
import { createFileServer } from "@skycanvasstudio/serve-server"

const fileServer = createFileServer({
  baseUrl: process.env.FILE_SERVER_URL!,
  apiKey: process.env.FILE_SERVER_API_KEY!,
})

const uploaded = await fileServer.files.upload({
  file,
  filename: "avatar.jpg",
  contentType: "image/jpeg",
  tags: ["avatar"],
})

const page = await fileServer.files.list({
  kind: "image",
  page: 1,
  limit: 20,
})

const asset = await fileServer.files.get(fileId)
await fileServer.files.delete(fileId)

const url = fileServer.images.url(asset, {
  width: 800,
  format: "webp",
  quality: 80,
})
```

### 8.3 Configuration

```ts
type FileServerOptions = {
  baseUrl: string
  apiKey: string
  fetch?: typeof globalThis.fetch
  timeoutMs?: number
  headers?: Record<string, string>
  userAgent?: string
}
```

Requirements:

- Trim one trailing slash from `baseUrl`.
- Reject a missing/non-HTTP(S) base URL with a clear configuration error.
- Reject missing API keys at construction time.
- Never log the API key or include it in thrown messages.
- Merge headers without allowing callers to accidentally overwrite `Authorization` through general defaults.
- Support per-call `AbortSignal`.
- Implement timeout by composing the caller signal with an internal timeout signal.
- Parse all success responses with the contract schema.
- Parse known API errors and produce a fallback `FileServerError` for malformed/non-JSON responses.
- Do not retry upload or delete automatically. They are not safely retryable without an explicit idempotency design.
- GET retries may be added later, but v1 should keep behavior predictable and make no automatic retries.

### 8.4 Upload inputs

Support inputs that work in Node 20 and Bun:

```ts
type UploadSource = File | Blob | Uint8Array | ArrayBuffer

type UploadFileInput = {
  file: UploadSource
  filename?: string
  contentType?: string
  tags?: string[]
  signal?: AbortSignal
}
```

`filename` is required unless the source is a `File`. Convert `Uint8Array` and `ArrayBuffer` into a `Blob` before appending to `FormData`. Do not buffer a Node stream silently in v1; either reject unsupported stream inputs with a useful message or design an explicitly bounded stream adapter later.

### 8.5 Server package exports

Required exports:

```json
{
  ".": {},
  "./adapters/fetch": {},
  "./adapters/express": {},
  "./adapters/elysia": {},
  "./adapters/nest": {}
}
```

Framework dependencies must be optional peers and loaded only by their subpath. The main export must install and run without any framework installed.

For the first stable implementation:

- Fully implement the Fetch adapter.
- Fully implement Express only if it can be tested without weakening types.
- Elysia and Nest may begin as typed integration helpers plus complete example code.
- Do not publish empty or misleading adapter exports. If an adapter is not ready, omit its export and keep the framework example using the main SDK/Fetch adapter.

### 8.6 Server SDK tests

Use a mocked `fetch` for deterministic unit tests. Cover:

- Authorization header construction without leaking the API key.
- Base URL normalization.
- Upload FormData field names and tags.
- Node/Bun-compatible binary input normalization.
- List query serialization and array query parameters.
- Get/delete routes.
- Image transformation URL encoding/clamping.
- Timeout and caller abort behavior.
- Success schema validation.
- JSON API errors, non-JSON errors, empty bodies, 401, 403, 404, 409, 413, 429, and 500.
- Browser-token handler authorization failure.
- Browser-token handler no-store headers.
- Required origin and scopes.
- No package import causes access to `window`, React, Next, Prisma, or root app aliases.

---

## 9. `@skycanvasstudio/serve-react` design

### 9.1 Package structure

```text
npm_pkg/packages/react/
├── src/
│   ├── index.ts
│   ├── provider/
│   │   ├── file-server-provider.tsx
│   │   └── token-manager.ts
│   ├── hooks/
│   │   ├── use-file-server.ts
│   │   ├── use-files.ts
│   │   ├── use-upload.ts
│   │   └── use-delete-file.ts
│   ├── components/
│   │   ├── advanced-image.tsx
│   │   ├── file-picker.tsx
│   │   ├── image-picker.tsx
│   │   ├── file-uploader.tsx
│   │   ├── file-preview.tsx
│   │   ├── media-library.tsx
│   │   └── upload-queue.tsx
│   ├── lib/
│   │   ├── browser-client.ts
│   │   ├── file-kind.ts
│   │   ├── object-urls.ts
│   │   └── validation.ts
│   └── styles.css
├── test/
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── README.md
└── CHANGELOG.md
```

Do not depend on Axios or TanStack Query in v1. Use fetch plus a small internal cache/state layer. Consumers can still put SDK calls inside their own query library.

### 9.2 Provider

Target API:

```tsx
import {
  FileServerProvider,
  createTokenProvider,
} from "@skycanvasstudio/serve-react"
import "@skycanvasstudio/serve-react/styles.css"

<FileServerProvider
  baseUrl="https://files.example.com"
  tokenProvider={createTokenProvider("/api/file-server/token")}
>
  {children}
</FileServerProvider>
```

Provider requirements:

- `baseUrl` is the public File Server URL.
- `tokenProvider` returns `{ token, expiresAt }` from the consumer's authenticated backend.
- Deduplicate simultaneous token requests.
- Cache tokens only in memory.
- Refresh 30 seconds before expiry.
- On one `401 TOKEN_EXPIRED`, refresh once and retry the safe request once.
- Do not retry delete or upload after an ambiguous network failure.
- Accept injected `fetch` for testing.
- Never access `window`, `document`, or browser storage at module import time.
- Produce a helpful error when a hook is used outside the provider.

### 9.3 `AdvancedImage`

This is the primary optimized image component.

Target usage:

```tsx
<AdvancedImage
  asset={asset}
  alt="User avatar"
  width={640}
  height={640}
  sizes="(max-width: 768px) 100vw, 640px"
  responsiveWidths={[320, 640, 960, 1280]}
  format="webp"
  quality={80}
  loading="lazy"
  fit="cover"
/>
```

Required behavior:

- Render semantic `<picture>`/`<img>` output, not a Next-specific component.
- Use intrinsic width/height or CSS `aspect-ratio` to prevent layout shift.
- Generate `srcSet` from File Server transformation URLs and `responsiveWidths`.
- Use the server-generated placeholder when available.
- Blur/scale the placeholder and fade in the main image after decode/load.
- Remove the placeholder after the transition.
- Default to `loading="lazy"` and `decoding="async"`; allow eager/high-priority usage for hero images.
- Forward standard safe image props and a ref.
- Expose `onLoad`, `onError`, and `onLoadingComplete`.
- Support a custom fallback node or fallback image.
- Never request raster transforms for SVG.
- Respect `prefers-reduced-motion` by disabling the fade animation.
- Keep meaningful alt text required at the TypeScript prop level; decorative images pass `alt=""` explicitly.
- Do not claim automatic CDN behavior. Performance comes from correct dimensions, cacheable URLs, placeholders, responsive sources, lazy loading, and server transformations.

### 9.4 `FilePicker`

`FilePicker` selects files but does not upload them. This makes it usable with custom forms.

Required props/behavior:

- Single or multiple selection.
- Click-to-select and drag/drop.
- Configurable `accept`, `maxSizeBytes`, `maxFiles`, and disabled state.
- Keyboard-accessible drop area and visible focus state.
- Return accepted files and structured rejected-file errors.
- Reject by count, size, and MIME/extension rules before upload.
- Support paste-to-add where the clipboard contains files.
- Do not create object URLs unless a preview is requested.
- Revoke every object URL on removal/unmount.
- Allow selecting the same file again after removal by resetting the native input value.

### 9.5 `ImagePicker`

`ImagePicker` composes `FilePicker` for image-only selection and may optionally open `MediaLibrary` to select an existing asset.

It must support:

- Local image selection.
- Existing File Server image selection.
- Controlled `value`/`onChange`.
- Single or multiple mode.
- Optional crop callback/flow.
- Preview with `AdvancedImage`.
- Clear/replace behavior.

Do not include a heavy image editor in the first primitive. Reuse `react-image-crop` only if crop is included in v1, make it an optional/lazy-loaded subpath, and upload the resulting crop as a new asset by default.

### 9.6 `FileUploader` and `UploadQueue`

`FileUploader` composes `FilePicker` with upload behavior.

Requirements:

- Queue files individually; use one `/api/v1/files` request per file.
- Default parallel uploads: 3; configurable from 1–6.
- Per-file states: `queued`, `uploading`, `processing`, `success`, `error`, `cancelled`.
- Per-file cancel through `AbortController`.
- Retry only after explicit user action.
- Support common tags applied to all files plus optional per-file tags.
- Return each `FileAsset` through `onUploadComplete` and the finished batch through `onBatchComplete`.
- Continue remaining uploads when one fails.
- Announce progress/state changes accessibly.
- Browser upload progress requires XHR because fetch upload progress is not consistently available. Keep transport internal and still use the same token/error contracts.
- Treat reaching 100% request upload as `processing` until the server response completes.
- Never retry automatically after the request body may have reached the server.

### 9.7 `FilePreview`

Select preview behavior from `contentType` and `kind`:

- Raster image: `AdvancedImage`.
- SVG: render through `<img>` using its URL; never inject SVG markup into the DOM.
- Video: native video or a lightweight player using the range-capable content URL.
- Audio: native audio controls.
- PDF: `<object>` or sandboxed iframe with download fallback.
- Plain text/JSON/XML: fetch a bounded preview only, render as escaped text, never as HTML.
- Unknown/archive: metadata and download link.

Security/accessibility requirements:

- Never use `dangerouslySetInnerHTML` for uploaded content.
- Sandbox iframe previews.
- Escape displayed filenames.
- Provide titles, labels, keyboard controls, and fallback download links.
- Do not load full text files; impose a preview byte limit.
- Lazy-load optional video/PDF enhancements to protect the base package size.

### 9.8 `MediaLibrary`

This is the reusable application-level admin component, not a File Server owner/application/API-key administration panel.

Required capabilities:

- Grid and list views.
- Server-side pagination.
- Search, kind filter, MIME filter, tag filter, and sort.
- Single-select and multi-select modes.
- Preview dialog/drawer.
- Upload action using `FileUploader`.
- Copy public/content URL.
- Download.
- Safe delete confirmation.
- Empty, loading, error, and retry states.
- Optimistic removal is allowed only after a successful delete response; do not hide an item before the server confirms.
- Permission props such as `canUpload`, `canDelete`, and `canSelect` affect the UI, while the server token scopes remain the authority.
- Controlled selection and callbacks so it can work as a form field/modal.
- No application/API-key creation UI in this component.

### 9.9 React package exports

Required main exports:

- `FileServerProvider`
- `createTokenProvider`
- `useFileServer`
- `useFiles`
- `useUpload`
- `useDeleteFile`
- `AdvancedImage`
- `FilePicker`
- `ImagePicker`
- `FileUploader`
- `UploadQueue`
- `FilePreview`
- `MediaLibrary`
- Public prop/result/error types

Also export `./styles.css`. Add component subpaths only if they materially improve tree shaking and are verified in tarball consumer tests.

### 9.10 React tests

Use Vitest, jsdom, React Testing Library, and user-event. Mock network calls; do not require a running File Server for unit tests.

Cover:

- Provider/token request deduplication, refresh, one-time expired-token retry, and no persistent storage.
- SSR import/render safety.
- `AdvancedImage` URL/srcset generation, placeholder state, load/error state, SVG handling, layout dimensions, and reduced motion.
- File picker click, keyboard, drop, paste, size/type/count rejection, duplicate selection, and object URL cleanup.
- Upload queue concurrency never exceeding the configured maximum.
- Cancel, explicit retry, partial batch failure, and callbacks.
- File preview renderer selection and unsafe content handling.
- Media library pagination/filter query construction, selection, confirmed delete, and permission props.
- Basic accessibility checks for components/dialogs.

---

## 10. Framework integration examples

Examples are part of the acceptance criteria. They must consume the packed tarballs or workspace package exports, not import package source by relative path.

Every example must show two independent flows:

1. Server-side upload using `@skycanvasstudio/serve-server`.
2. Authenticated React management using a short-lived token endpoint and `@skycanvasstudio/serve-react`.

### 10.1 Next.js App Router

- Server SDK inside a server action or route handler.
- Token endpoint in `app/api/file-server/token/route.ts` using the Fetch handler.
- The route performs the app's session/RBAC check before minting a token.
- React provider is mounted in a client provider component.
- Do not use `NEXT_PUBLIC_FILE_SERVER_API_KEY`.

### 10.2 TanStack Start

- Server SDK inside a server function/API route.
- Fetch-standard token handler behind the application's authentication check.
- Client provider and media library example.
- Ensure no server SDK import crosses into the browser bundle.

### 10.3 Express

- Create one server SDK singleton.
- Show upload from a backend route/service.
- Mount token handler after existing auth middleware.
- If an Express adapter is published, include a typed `RequestHandler`; otherwise provide a small explicit bridge in the example.

### 10.4 NestJS

- Wrap one SDK client in an injectable provider.
- Use it in a service/controller for server uploads.
- Protect the token controller with a Nest guard.
- Keep Nest dependencies out of the main SDK bundle.

### 10.5 Elysia

- Decorate/derive one SDK client for server routes.
- Mount the token endpoint behind an authentication guard.
- Show Bun `File`/`Blob` upload input.

No example may hardcode a real secret. Each example needs `.env.example` with:

```env
FILE_SERVER_URL=http://localhost:5000
FILE_SERVER_API_KEY=sk_replace_me
```

The example's public client config contains only `FILE_SERVER_URL` or an equivalent public base URL, never the API key.

---

## 11. Package configuration

### 11.1 Nested workspace root

`npm_pkg/package.json` should be private and contain workspace scripts for build, typecheck, test, lint, clean, and tarball verification. Use npm workspaces under `npm_pkg/packages/*` and `npm_pkg/examples/*`.

Keep its lockfile inside `npm_pkg/`. Do not replace or rewrite the repository root's existing lockfile as a side effect of package tooling.

### 11.2 Public package metadata

Both packages require:

- Initial version `0.1.0`.
- `license: "MIT"` consistent with the repository.
- `repository`, `homepage`, and `bugs` fields pointing to the File Server repository.
- Clear `description` and `keywords`.
- `files` allowlist containing only `dist`, README, CHANGELOG, and LICENSE as appropriate.
- Explicit `main`, `module`, `types`, and `exports`.
- `engines` matching supported runtimes.
- `publishConfig.access: "public"` if the final names remain scoped public packages.
- `prepublishOnly` running package-local validation.

`@skycanvasstudio/serve-react`:

- `peerDependencies`: React and React DOM ranges covering 18.2 and 19.
- `sideEffects`: only the CSS export.
- Browser-safe dependency graph.

`@skycanvasstudio/serve-server`:

- Must not be marked browser-safe.
- No React dependency.
- Framework packages only as optional peers for implemented adapter subpaths.

### 11.3 Build-output verification

After each package build, verify:

- No `@/` aliases remain.
- No imports point outside the package tarball.
- No API keys, environment values, absolute local paths, Prisma client, Next.js runtime, root app code, tests, or source maps containing secrets are included.
- Declaration files resolve from a clean consumer.
- ESM import and CJS require both work where advertised.
- CSS is present and referenced correctly.
- `npm pack --dry-run` includes only intended files.
- Installing the generated `.tgz` files in a temporary clean project passes typecheck/build.

---

## 12. Implementation phases

### Phase 0 — Preflight and contract freeze

Tasks:

1. Confirm `@skycanvasstudio/serve-server` and `@skycanvasstudio/serve-react` naming availability/ownership. If unavailable, ask the user before changing names.
2. Record existing static-check commands and current failures without fixing unrelated issues.
3. Add a written `/api/v1` contract document or OpenAPI file derived from section 6.
4. List existing legacy endpoints that will remain supported.
5. Confirm v1 is public-file delivery and browser tokens protect management actions, not content URLs.

Acceptance:

- Naming is confirmed or explicitly approved.
- API shapes and error codes are fixed before SDK implementation.
- No application server or database command has been run.

### Phase 1 — Backend safety and `/api/v1`

Tasks:

1. Introduce framework-independent domain/service functions inside the existing app for list/get/upload/unlink/crop serialization. Next route handlers should remain thin adapters.
2. Add the canonical `FileAsset` serializer.
3. Add input validation and error mapping.
4. Add safe application-scoped unlink/delete semantics.
5. Add safe crop-as-new and either correct replace semantics or omit replace from v1.
6. Add v1 content route aliases with byte-range and HEAD behavior.
7. Add browser-token minting/verification and scoped CORS.
8. Add capability endpoint.
9. Add unit/integration tests that do not need a running server where possible.
10. Keep legacy endpoints unchanged unless fixing a critical security issue; if legacy behavior changes, document it.

Acceptance:

- All v1 management queries are application-scoped.
- Cross-application dedupe delete/crop tests pass.
- Browser tokens cannot access an unlisted origin, application, or scope.
- Multipart body parsing happens after auth.
- No Prisma schema migration is needed.

### Phase 2 — `npm_pkg` workspace and contracts

Tasks:

1. Create the nested workspace exactly under `npm_pkg/`.
2. Add strict base TypeScript configuration and package scripts.
3. Implement private contracts schemas/types/helpers.
4. Add contract fixtures for image, video, PDF, pagination, and all error classes.
5. Configure build tooling so contracts are bundled into public packages.

Acceptance:

- Workspace typecheck/test/build commands run without importing root Next configuration.
- Contract types cannot drift from runtime schemas.
- No published artifact depends on private contracts by name.

### Phase 3 — Server SDK

Tasks:

1. Implement HTTP request core and typed error handling.
2. Implement upload/list/get/delete.
3. Implement content/image URL helpers.
4. Implement browser-token API and Fetch token-handler factory.
5. Add only framework adapters that are actually complete and tested.
6. Write package README with server-security warnings and copy-paste examples.
7. Build and test ESM/CJS artifacts.

Acceptance:

- All section 8 tests pass.
- A clean Node TypeScript consumer can install the tarball and typecheck.
- A clean Bun consumer can import and exercise the mocked client.
- Main package import has no framework dependency.

### Phase 4 — React primitives

Tasks:

1. Implement provider and browser-token lifecycle.
2. Implement browser client and error normalization.
3. Implement `AdvancedImage`.
4. Implement `FilePicker` and `ImagePicker`.
5. Implement `FileUploader` and `UploadQueue`.
6. Implement `FilePreview`.
7. Add namespaced CSS and theming variables.

Acceptance:

- All section 9 primitive tests pass.
- React package imports without a DOM during SSR.
- React package contains no API-key option.
- Object URLs and abort controllers are cleaned up.
- Package works with React 18.2 and React 19 type/runtime smoke tests.

### Phase 5 — Media library

Tasks:

1. Implement paginated file management hooks.
2. Implement grid/list display and filtering controls.
3. Compose upload and preview flows.
4. Implement controlled selection and safe delete confirmation.
5. Add permission props and accessible state announcements.

Acceptance:

- The component works as both an admin manager and an asset-picker modal.
- Filtering/pagination use server requests rather than loading the entire library.
- Delete uses the safe v1 unlink endpoint.

### Phase 6 — Framework examples

Tasks:

1. Add minimal Next.js, TanStack Start, Express, NestJS, and Elysia examples.
2. Keep each example focused on one server upload and one authenticated React management page where React applies.
3. Add environment/configuration documentation.
4. Typecheck/build every example without launching it.

Acceptance:

- All examples build/typecheck against package artifacts.
- No example exposes an API key to client code.
- Server-only imports stay out of browser bundles.

### Phase 7 — Dogfood in File Server dashboard

Do this only after package tarballs and examples are stable.

Tasks:

1. Replace the root dashboard's basic progressive image with `AdvancedImage` where behavior matches.
2. Replace upload queue/picker pieces incrementally.
3. Replace preview pieces incrementally.
4. Replace file-management UI only after parity is verified.
5. Preserve File Server owner/session-only functionality that does not belong in the application-scoped package.

Do not perform a large one-shot dashboard rewrite. One component/flow at a time must retain existing behavior.

Acceptance:

- The root dashboard uses packed/local package artifacts, not source-relative imports.
- Existing owner session auth and application selection still work.
- No visual or behavioral regression is knowingly introduced.

### Phase 8 — Release readiness

Tasks:

1. Run package build, typecheck, lint, unit tests, tarball inspection, and clean-consumer checks.
2. Generate API reference from exported declarations or a controlled documentation source.
3. Complete package READMEs and changelogs.
4. Verify package names, versions, repository metadata, license, and file allowlists.
5. Review dependency licenses and package sizes.
6. Prepare but do not execute npm publish commands.

Acceptance:

- Both tarballs pass the Definition of Done.
- Publishing remains an explicit separate user action/approval.

---

## 13. Verification matrix

| Area | Static/unit verification | Live verification after permission |
| --- | --- | --- |
| API contract | Zod/schema and route-service tests | Real HTTP responses match contract |
| API-key auth | Mock/integration tests | Upload/list/delete with a real test key |
| Browser token | Claims, expiry, scopes, origin, CORS tests | Authenticated consumer obtains token and manages files |
| Upload | Multipart construction and service tests | Image, video, PDF, text, oversize, invalid type |
| Dedup/delete | Database-service transaction tests | Same file linked to two test apps; unlink one |
| Images | URL and component tests | Placeholder, resize, WebP/AVIF, error fallback |
| Video | URL/range response tests | Seek forward/backward in browser |
| PDF | Renderer selection tests | Browser PDF preview and download fallback |
| React SSR | Node import/render tests | Next and TanStack pages render without hydration errors |
| Express/Nest/Elysia | Typecheck/build examples | Real framework route calls File Server |
| Tarballs | `npm pack`, clean install, typecheck/build | Install from npm only after publishing approval |

Live verification must use dedicated test applications/files and must not operate on production/user data.

---

## 14. Definition of Done

The task is complete only when all applicable items are true:

- `npm_pkg/` contains the isolated workspace and all package-related source/tooling/examples.
- The two public packages are `@skycanvasstudio/serve-server` and `@skycanvasstudio/serve-react`, or the user has explicitly approved replacement names.
- The existing root application has not been moved.
- `/api/v1` has consistent validated DTOs and errors.
- API keys remain server-only.
- Browser management uses short-lived, scoped, origin-bound tokens.
- A token cannot switch applications.
- Shared deduplicated files cannot be deleted or mutated through another application's access.
- Server SDK supports upload/list/get/delete and image URL generation.
- React package supports optimized image rendering, file/image selection, upload queue, image/video/audio/PDF/text-safe previews, and media management.
- React components are SSR-safe, accessible, styleable, and do not require Tailwind.
- Next.js, TanStack Start, Express, NestJS, and Elysia examples typecheck/build.
- Package tarballs contain only intended files and work in clean consumers.
- Tests cover security boundaries, errors, cleanup, concurrency, and package imports.
- Documentation clearly distinguishes server API keys, browser tokens, and public content URLs.
- No database migration was introduced for v1.
- No npm publish command was run without explicit user approval.

---

## 15. Explicitly deferred work

Do not expand v1 with these unless the user separately approves them:

- Private/signed content delivery.
- Direct-to-S3 multipart uploads and upload-finalization webhooks.
- Resumable/TUS uploads.
- Background media processing queues.
- Video transcoding, HLS generation, poster extraction, or PDF thumbnail generation.
- Malware scanning.
- Persistent per-application origin configuration, quotas, or token revocation tables requiring schema changes.
- Folder trees, asset collections, or rich metadata editing.
- A File Server owner-level applications/API-key administration UI inside the React package.
- Vue/Svelte/Solid packages.
- React Native support.
- Automatic framework auth integration; consuming applications must supply their own authorization callback/guard.

These are valid future additions, but they should not delay a secure and coherent first release.
