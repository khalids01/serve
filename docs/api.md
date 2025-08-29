# Serve API Reference

This document covers the most common endpoints and authentication for server-to-server usage. For an interactive overview, see the in-app docs at /docs.

## Authentication

Provide your API key in one of the following headers:

- x-api-key: <YOUR_API_KEY>
- Authorization: Bearer <YOUR_API_KEY>

Example (cURL):

```bash
curl -X POST \
  -H "x-api-key: sk_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" \
  -F "file=@/path/to/file.jpg" \
  -F "applicationId=<APP_ID>" \
  http://localhost:3003/api/upload
```

API keys do not expire automatically. Revoke or delete them to invalidate.

## Usage & Storage Stats

Aggregate storage stats across all applications you own.

```
GET /api/stats
```

Response:

```json
{
  "storageBytes": 123456789,
  "totals": {
    "files": 42,
    "applications": 2,
    "apiKeys": 3
  }
}
```

Notes:
- storageBytes sums sizes of original images (Image.sizeBytes) and their variants (ImageVariant.sizeBytes).

## Upload

Upload a file for an application. Requires authentication header.

```
POST /api/upload
```

Multipart form fields:
- file: the binary file
- applicationId: your application ID
- tags (optional): comma-separated or JSON array

## Images

List images for an application:

```
GET /api/images?applicationId=<APP_ID>&limit=50
```

Get original content (served by filename):

```
GET /api/img/:name
```

On-demand resize (fits inside width/height):

```
GET /api/img/:name?w=320
GET /api/img/:name?h=320
```

To request a different output format, use the corresponding extension in `:name` (e.g. `.webp`, `.avif`).

Delete an image:

```
DELETE /api/images/:id
```

## API Keys

- Manage keys in Dashboard → Applications → <App> → API Keys
- Keys have no automatic expiration; revoke or delete to invalidate
- On successful use, lastUsedAt is updated
