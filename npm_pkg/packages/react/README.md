# @skycanvasstudio/serve-react

React uploads, file selection, previews and a paginated media library for
[Serve File Server](https://github.com/khalids01/serve). Supports React 18.2 and
19, ESM/CommonJS, SSR and Next.js client boundaries. No Tailwind dependency.

```sh
npm install @skycanvasstudio/serve-react react react-dom
```

```tsx
'use client';
import {
  FileServerProvider, MediaLibrary, createTokenProvider,
} from '@skycanvasstudio/serve-react';
import '@skycanvasstudio/serve-react/styles.css';

// Keep this function stable; the provider stores tokens only in memory.
const tokenProvider = createTokenProvider('/api/file-server/token');

export function Assets() {
  return (
    <FileServerProvider baseUrl="https://files.example" tokenProvider={tokenProvider}>
      <MediaLibrary />
    </FileServerProvider>
  );
}
```

For a complete Next.js example using only the same two server env variables, see the [integration guide](https://github.com/khalids01/serve/blob/main/docs/integration-guide.md). A server page passes the public base URL into the provider; no duplicate public env variable is needed.

Create `/api/file-server/token` on your application's authenticated backend using
`@skycanvasstudio/serve-server/adapters/fetch`. It must authorize your current user before
minting a short-lived token. **Never give this package a File Server API key.**
Tokens are origin-bound and application-scoped. File URLs themselves are public;
this is not private or signed content delivery.

## Components

| Export | Purpose / key props |
| --- | --- |
| `FileServerProvider` | `baseUrl`, `tokenProvider`, optional `fetch`, `theme`, `className`; wraps children |
| `AdvancedImage` | `asset`, `alt`, dimensions, `responsiveWidths`, `sizes`, format/quality, `fallback`, image callbacks |
| `FilePicker` | Native keyboard-accessible file input, drag/drop and focused paste; `onFiles`, `accept`, `multiple`, `maxFiles`, `maxSizeBytes`, `onReject` |
| `FileUploader` | Picker and queue; `parallel` (default 3, maximum 6), `tags`, `onUploadComplete`, `onBatchComplete`, picker validation props |
| `UploadQueue` | Controlled `items`, `onCancel`, `onRetry` display |
| `ImagePicker` | Controlled single/multiple `value`/`onChange`, existing-image browsing, optional `onCrop`, `disabled` |
| `FilePreview` | Image/video/audio/PDF/text/download preview; `asset`, `textPreviewBytes` (default 32KB), optional caption tracks |
| `MediaLibrary` | Search/type filtering, pagination, grid/list layouts, preview dialog, controlled `value`/`onChange`, `multiple`, `pageSize`, `canUpload`, `canDelete`, `canSelect` |

All components accept `className`. AdvancedImage also has `wrapperClassName`;
picker has `inputClassName`; uploader has `pickerClassName`/`queueClassName`;
queue has `itemClassName`; library has toolbar/grid/item class overrides.
`AdvancedImage.fit` controls CSS object-fit; server resizing preserves aspect ratio.
Give images explicit dimensions or an intrinsic asset size to avoid layout shift.
Changing the image source resets loading/error state. SVGs bypass raster transforms.

Picker rejections contain `file`, `code`, and `message`; codes are
`too-many-files`, `file-too-large`, `file-type-not-allowed`, `duplicate-file`.
Paste is handled within the focused picker, not globally across the page.

## Hooks

- `useFileServer()` returns `{client, getToken}`; `getToken(true)` forces refresh.
- `useFiles(filters?)` returns `{data, pagination, loading, error, refetch}`.
  Filters include page, limit, search, kind, contentType, tags, sortBy and sortOrder.
  Old requests are cancelled when filters change or the component unmounts.
- `useDeleteFile()` returns `{remove, pending, error}`. Await `remove(id)` before
  hiding a deleted asset.
- `useUpload(options?)` returns `{items, upload, cancel, retry, uploading}`.
  `upload(files)` resolves to the batch's final items. Concurrent batches share
  one concurrency limit per hook instance. Failed/cancelled items can be retried
  explicitly; active requests are cancelled on unmount. Progress 100% means the
  server may still be processing; success follows a validated response.

```tsx
const { items, upload, cancel, retry } = useUpload({ parallel: 3 });
return <>
  <FilePicker multiple onFiles={(files) => { void upload(files); }} />
  <UploadQueue items={items} onCancel={cancel} onRetry={retry} />
</>;
```

HTTP errors use `BrowserFileServerError` with status/code/message/details.
Expired tokens trigger one forced refresh and one retry. Tokens refresh thirty
seconds before expiry, deduplicate concurrent requests, and never use browser
persistent storage. Keep custom token providers stable with module scope or
`useMemo`. A changed provider or base URL resets the in-memory cache.

## Styling and accessibility

Import the shipped CSS once. Styles use `fs-` classes and `--fs-*` variables:
background, foreground, muted, muted-foreground, border, primary,
primary-foreground, danger and radius. Dark mode follows a `.dark` ancestor or
`theme="dark"` on the provider. Reduced-motion preferences disable transitions.

The library uses a native modal dialog for focus containment and Escape support;
closing restores the previous focus. Delete asks for confirmation and reports
errors without hiding the asset. Permission props only affect UI: server token
scopes enforce access. Provide caption tracks for your audio/video when available.
Text preview is bounded and rendered as escaped text, never injected HTML.

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

## Upload destination and delivery

Choose a destination per upload with `storageLocationId: "local"`, `"default"`, or an owned S3 connection ID. Omit it to inherit the application's destination, then system defaults. Delivery is configured in Serve independently: Proxy streams through Serve; Direct uses expiring signed S3 URLs. Keep the stable Serve URL in your app. Local storage always streams through Serve.

Discover destinations with `useStorageLocations()`; pass `storageLocationId` to `useUpload().upload(file, options)` or `<FileUploader storageLocationId="local" />`.
