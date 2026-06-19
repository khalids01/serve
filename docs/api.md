# Serve API Reference

This document covers the most common endpoints and authentication for server-to-server usage. For an interactive overview with live testing, see the in-app docs at `/docs`.

## Quick actions

1. Create an application in the dashboard and generate an API key.
2. Send the key as `Authorization: Bearer <key>` or `x-api-key: <key>`.
3. Upload a file with `POST /api/upload`.
4. List files with `GET /api/images` and serve them via `GET /api/img/:name`.
5. Use **Dashboard → Data Backup** and **Cache** for admin tasks (session auth only).

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
- `storageBytes` counts each unique image blob once (including variants), even when linked to multiple applications.
- Requires session authentication (dashboard).

## Upload

Upload a file for an application. Requires authentication header.

```
POST /api/upload
```

Multipart form fields:
- file: the binary file
- tags (optional): comma-separated or JSON array

Note: When using API key authentication, the application ID is automatically determined from your key. No need to specify applicationId.

### Deduplication

Uploads are deduplicated globally by file content (SHA-256 hash):

- Uploading the same bytes again returns the **same `id`**, URLs, and variant metadata.
- The file is stored once in object storage under `_blobs/{hash}.{ext}`.
- Re-uploading links the existing blob to the requesting application (or refreshes that link's metadata).
- Per-application `originalName` and `tags` are stored on the app link, not on the shared blob.

Example response fields:

```json
{
  "success": true,
  "image": {
    "id": "clx123",
    "filename": "a1b2c3d4e5f67890.jpg",
    "url": "/api/img/clx123.jpg",
    "linkedApplications": [
      { "id": "app_a", "name": "Blog", "slug": "blog" },
      { "id": "app_b", "name": "Shop", "slug": "shop" }
    ]
  }
}
```

## Images

List images for an application with advanced search and sorting:

```
GET /api/images?applicationId=<APP_ID>&page=1&limit=50&search=avatar&sortBy=createdAt&sortOrder=desc
```

Query parameters:
- `applicationId`: application ID (optional with API key auth)
- `page`: page number (default: 1)
- `limit`: items per page (default: 20, max: 100)
- `search`: search in filename, original name, content type
- `contentType`: filter by MIME type (e.g., "image/jpeg")
- `sortBy`: sort field (`updatedAt` when filtered by app, otherwise `createdAt`, plus `name`, `size`, `type`)
- `sortOrder`: sort direction (`asc`, `desc`)

Response includes pagination metadata, image variants, and `linkedApplications` (all apps using that blob).

Get original content (served by filename):

```
GET /api/img/:name
```

On-demand resize (fits inside width/height), format switch, and quality control:

```
GET /api/img/:name?w=320
GET /api/img/:name?h=320
GET /api/img/:name?w=1200&h=800

# Request a different output format by changing extension in :name
GET /api/img/:baseId.webp?w=800

# Control compression quality (1–100, format-dependent)
GET /api/img/:baseId.webp?w=1200&q=70
```

Query params:
- `w` or `width`: target width (pixels)
- `h` or `height`: target height (pixels)
- `q` or `quality`: output quality (1–100)

Notes:
- To request a different output format, only `.webp` is supported via the `:name` extension.
- If no resize is requested and a same-dimension optimized WebP exists, it will be streamed directly; otherwise returns 404.

Delete an image:

```
DELETE /api/images/:id
```

Permanently deletes the blob from storage and removes all application links. If the image is linked to multiple applications, it is removed from all of them.

## Audit Logs

Retrieve activity logs for an application with pagination:

```
GET /api/audit-logs?applicationId=<APP_ID>&page=1&limit=10
```

Response:

```json
{
  "logs": [
    {
      "id": "log_123",
      "action": "UPLOAD",
      "targetId": "img_456",
      "metadata": {
        "filename": "processed_image.jpg",
        "originalName": "photo.jpg"
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "ip": "192.168.1.1",
      "userAgent": "curl/7.68.0"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

Query params:
- `applicationId`: required application ID
- `page`: page number (default: 1)
- `limit`: items per page (default: 10, max: 100)

Notes:
- Logs track UPLOAD and DELETE actions
- Requires session authentication (dashboard) or API key for the application
- Metadata includes original filename and processed filename

## Dashboard admin (session auth)

These endpoints require a signed-in dashboard session. They are **not** available with API keys.

### Backups

```
GET    /api/admin/backups              List backups (paginated, filterable)
PATCH  /api/admin/backups/config       Update backup schedule and retention
POST   /api/admin/backups/json         Take JSON metadata backup now
POST   /api/admin/backups/sql          Take SQL database backup now
POST   /api/admin/backups/scan         Scan storage and import missing backup files
POST   /api/admin/backups/cleanup      Remove backups past retention
GET    /api/admin/backups/{id}/download Download a backup file
POST   /api/admin/backups/{id}/sync    Restore metadata from JSON backup
DELETE /api/admin/backups/{id}         Delete a backup file and record
POST   /api/admin/backups/bulk-delete  Delete multiple backups
POST   /api/admin/backups/bulk-sync    Restore metadata from multiple JSON backups
```

See [configuration.md](configuration.md#data-backup) for storage layout and disaster recovery.

### Cache

```
GET    /api/cache                      List cache entries (all apps or filtered)
DELETE /api/cache                      Clear cache (all or by application)
```

Manage cache from **Dashboard → Cache** (`/dashboard/cache`).

## API Keys

- Manage keys in Dashboard → Applications → <App> → API Keys
- Keys have no automatic expiration; revoke or delete to invalidate
- On successful use, lastUsedAt is updated
