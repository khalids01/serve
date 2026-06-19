# Serve Integration Guide

This document is written for **developers and AI agents** integrating an application with a self-hosted **Serve** file storage instance. After reading it, you should know what credentials you need, which endpoints to call, and how to build correct URLs for uploaded files.

For interactive testing, use `/docs` in the dashboard UI. For deployment and env vars, see [configuration.md](configuration.md). For a compact endpoint list, see [api.md](api.md).

---

## Quick start checklist

1. **Deploy or reach** a running Serve instance (e.g. `https://files.example.com`).
2. **Sign in** to the dashboard and create an **Application** (tenant bucket for your app's files).
3. **Generate an API key** for that application (`sk_live_...`).
4. **Store the key server-side** — never in browser/mobile client code.
5. **Upload** with `POST /api/upload` using the API key.
6. **Persist** the returned `image.id` and `image.url` in your database.
7. **Serve files** to users via absolute URLs: `{BASE_URL}{image.url}` (public, no auth).
8. **List / delete / metadata** using authenticated JSON APIs below.

---

## Mental model

| Concept | Meaning |
| --- | --- |
| **Application** | A logical tenant. Each app has its own file namespace and API keys. |
| **Image / file record** | A row in Serve's DB pointing at stored bytes (images, PDFs, video, etc.). |
| **Blob deduplication** | Same file bytes (SHA-256) are stored once globally; re-upload links the blob to your app. |
| **Variants** | Extra renditions for raster images (WebP copy, blurred placeholder). Non-images have no variants. |
| **Public serve URL** | `/api/img/:name` — **no API key required** to read file bytes. |
| **Management API** | Upload, list, get metadata, delete — **API key or dashboard session required**. |

Serve is **API-first**: your backend talks to Serve; your frontend usually loads files from `/api/img/...` URLs.

---

## Base URL

All paths below are relative to your instance root:

```
BASE_URL = NEXT_PUBLIC_APP_URL   # e.g. https://files.example.com
API_ROOT = {BASE_URL}/api
```

Example: upload endpoint = `{BASE_URL}/api/upload`

---

## Authentication

### API key (recommended for integrations)

| Header | Value |
| --- | --- |
| `Authorization` | `Bearer sk_live_...` |
| **or** `x-api-key` | `sk_live_...` |

- Keys are scoped to **one application**. You do **not** need to send `applicationId` when using a key (it is inferred).
- Invalid or revoked keys → `401` with `{ "error": "Invalid or revoked API key" }`.
- Keys do not expire automatically; revoke in the dashboard to disable.

### Dashboard session

Signed-in browser session (cookie). Used by the dashboard UI and some routes when no API key is sent. **Not suitable for server-to-server integration** unless you automate cookie auth (avoid this).

### Public (no auth)

| Endpoint | Auth |
| --- | --- |
| `GET /api/img/:name` | None — anyone with the URL can fetch the file |

---

## Auth matrix

| Endpoint | API key | Session | Public |
| --- | :---: | :---: | :---: |
| `POST /api/upload` | Yes | Yes | No |
| `GET /api/images` | Yes | Yes | No |
| `GET /api/images/:id` | Yes | Yes | No |
| `DELETE /api/images/:id` | Yes | Yes | No |
| `GET /api/audit-logs` | Yes | Yes | No |
| `GET /api/img/:name` | — | — | **Yes** |
| `GET /api/stats` | No | Yes | No |
| `GET/POST /api/admin/backups/*` | No | Yes | No |
| `GET/DELETE /api/cache` | No | Yes | No |

**Rule for integrators:** use an **API key** for upload/list/delete. Use **session-only** routes only when building dashboard/admin tools, not product backends.

---

## Typical integration flow

```text
Your backend                          Serve
     |                                   |
     |  POST /api/upload  (multipart)    |
     |  Authorization: Bearer sk_live_*  |
     |---------------------------------->|
     |                                   | store blob, create DB record
     |  { success, image: { id, url } }  |
     |<----------------------------------|
     |                                   |
     |  Save image.id + url in your DB   |
     |                                   |
Your frontend                           Serve
     |  GET {BASE_URL}/api/img/....jpg   |
     |---------------------------------->|
     |  200 image bytes                  |
     |<----------------------------------|
```

### 1. Upload a file

```http
POST /api/upload
Authorization: Bearer sk_live_YOUR_KEY
Content-Type: multipart/form-data
```

| Field | Required | Description |
| --- | --- | --- |
| `file` | Yes | Binary file (single upload) |
| `tags` | No | JSON **string** of a string array, e.g. `"[\"avatar\",\"profile\"]"` |
| `applicationId` | No* | Required only without API key (dashboard uploads) |

\* With API key auth, `applicationId` is taken from the key.

**Success (single file):**

```json
{
  "success": true,
  "image": {
    "id": "clx123abc",
    "filename": "a1b2c3d4e5f67890.jpg",
    "originalName": "photo.jpg",
    "contentType": "image/jpeg",
    "sizeBytes": 245760,
    "width": 1920,
    "height": 1080,
    "hash": "a1b2c3...",
    "url": "/api/img/clx123abc.jpg",
    "variants": [
      {
        "id": "var_1",
        "label": "webp",
        "filename": "a1b2c3d4e5f67890.webp",
        "url": "/api/img/a1b2c3d4e5f67890.webp"
      }
    ],
    "linkedApplications": [{ "id": "app_1", "name": "My App", "slug": "my-app" }],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Multi-file upload:** send `files` as a JSON string array describing form field names, plus multiple file parts. Response shape: `{ success, images: [...], errors? }`.

**Limits:** default max file size = **50 MB** (`config.upload.maxFileSizeMb` in `src/config.ts`).

**Deduplication:** uploading identical bytes again returns the same `id` / URLs; the blob is not duplicated in storage.

### 2. Build the public file URL

Response `url` is a **path**. Prepend your instance base:

```
https://files.example.com/api/img/clx123abc.jpg
```

Use this in `<img src>`, PDF links, etc. No Authorization header on GET.

### 3. On-demand resize (images only)

Append query params to `/api/img/:name`:

```
GET /api/img/clx123abc.webp?w=800
GET /api/img/clx123abc.webp?w=400&h=300
GET /api/img/clx123abc.webp?w=1200&q=70
```

| Param | Alias | Description |
| --- | --- | --- |
| `w` | `width` | Max width (px), preserves aspect ratio |
| `h` | `height` | Max height (px) |
| `q` | `quality` | 1–100 (WebP output) |

- Request **WebP** by using `.webp` in the path name.
- **Raster images only** (JPEG, PNG, WebP). Other types return the original file or `400` if resize params are used.
- Placeholder URLs use suffix `-placeholder` in the path (see upload response variants).

### 4. List files

```http
GET /api/images?page=1&limit=20&search=avatar&sortBy=createdAt&sortOrder=desc
Authorization: Bearer sk_live_YOUR_KEY
```

With API key, `applicationId` query param is optional (defaults to key's app). With session auth, pass `applicationId` for a specific app you own.

Response includes `images[]`, `pagination` (`page`, `limit`, `total`, `pages`, `hasNext`, `hasPrev`).

### 5. Get one file's metadata

```http
GET /api/images/{id}
Authorization: Bearer sk_live_YOUR_KEY
```

Returns the same rich `image` object as upload. API key must belong to an app **linked** to that image.

### 6. Delete a file

```http
DELETE /api/images/{id}
Authorization: Bearer sk_live_YOUR_KEY
```

```json
{ "success": true }
```

Deletes the blob from storage and removes **all** application links. If the image was shared across apps, it is removed everywhere.

### 7. Audit logs (optional)

```http
GET /api/audit-logs?applicationId={appId}&page=1&limit=10
Authorization: Bearer sk_live_YOUR_KEY
```

Returns `UPLOAD` and `DELETE` events with metadata, IP, and user agent.

---

## Error handling

| Status | Typical cause |
| --- | --- |
| `401` | Missing auth, invalid API key, or expired session |
| `403` | Key's app cannot access this resource |
| `404` | Unknown `id`, application, or image file in storage |
| `400` | Missing `file`, file too large, invalid JSON in `tags` |
| `500` | Server/storage error |

Errors are JSON: `{ "error": "message", "details": "..." }` (details optional).

**Integrator practice:** retry only idempotent GETs; on upload failure, do not assume partial success — check response body.

---

## Code examples

### Node.js (fetch) — upload

```javascript
const BASE = "https://files.example.com";
const API_KEY = process.env.SERVE_API_KEY;

const form = new FormData();
form.append("file", new Blob([buffer], { type: "image/jpeg" }), "photo.jpg");
form.append("tags", JSON.stringify(["profile"]));

const res = await fetch(`${BASE}/api/upload`, {
  method: "POST",
  headers: { Authorization: `Bearer ${API_KEY}` },
  body: form,
});

const data = await res.json();
if (!res.ok) throw new Error(data.error ?? "Upload failed");

const publicUrl = `${BASE}${data.image.url}`;
// store data.image.id and publicUrl in your database
```

### Python (requests) — upload

```python
import json
import requests

BASE = "https://files.example.com"
API_KEY = "sk_live_..."

with open("photo.jpg", "rb") as f:
    res = requests.post(
        f"{BASE}/api/upload",
        headers={"Authorization": f"Bearer {API_KEY}"},
        files={"file": ("photo.jpg", f, "image/jpeg")},
        data={"tags": json.dumps(["profile"])},
    )

res.raise_for_status()
body = res.json()
public_url = BASE + body["image"]["url"]
```

### cURL — list

```bash
curl -s "https://files.example.com/api/images?page=1&limit=10" \
  -H "Authorization: Bearer sk_live_YOUR_KEY"
```

---

## What to store in your app

| Field | Store? | Why |
| --- | --- | --- |
| `image.id` | **Yes** | Stable key for metadata API and delete |
| `image.url` | **Yes** (or rebuild from id) | Public serve path |
| `image.filename` | Optional | Storage/internal name (hash-based) |
| `originalName` | Optional | Display name per application link |
| API key | **Never in client** | Server env / secrets manager only |

---

## Endpoints not for product integration

These require a **dashboard login cookie**, not an API key:

- `/api/stats` — owner storage summary
- `/api/admin/backups/*` — backup schedule, scan, restore, download
- `/api/cache` — resize cache management
- `/api/applications/*` — CRUD apps and keys (use dashboard or automate via session)

If an AI agent is wiring **end-user file upload** for a SaaS product, it should only need: **upload, list, get, delete, img serve, audit-logs**.

---

## Image processing behavior

| File type | On upload | On `/api/img` |
| --- | --- | --- |
| JPEG, PNG, WebP | Optimized; WebP + placeholder variants generated | Resize / WebP / quality supported |
| PDF, video, audio, etc. | Stored as-is | Served as-is; resize params → `400` |

---

## Related docs

| Doc | Use when |
| --- | --- |
| [api.md](api.md) | Quick endpoint reference |
| [configuration.md](configuration.md) | Env vars, S3, backups, cache |
| [deployment.md](deployment.md) | Docker, PostgreSQL, production |
| `/docs` (in app) | Live API testing with your key |

---

## Agent summary (copy-paste)

```yaml
service: Serve file storage
base_url: https://YOUR_INSTANCE
auth:
  type: api_key
  header: "Authorization: Bearer sk_live_..."
  scope: one application per key
  never_expose_in: browser, mobile app, public repos
upload:
  method: POST
  path: /api/upload
  body: multipart/form-data
  fields:
    file: required binary
    tags: optional JSON string array e.g. '["tag1"]'
serve_public:
  path: /api/img/:name
  auth: none
  resize: "?w=&h=&q=" on raster images; use .webp extension for WebP
list: GET /api/images
get_meta: GET /api/images/:id
delete: DELETE /api/images/:id
audit: GET /api/audit-logs?applicationId=&page=&limit=
max_upload_mb: 50  # default; see config.upload.maxFileSizeMb
```
