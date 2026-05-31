# Configuration

This guide covers environment variables, `src/config.ts`, and storage setup for Serve.

## Configuration Split

**Secrets and deployment-specific values** live in `.env` (see [`.env.example`](../.env.example)).

**Non-secret app settings** live in [`src/config.ts`](../src/config.ts):

| Setting | Default | Description |
| --- | --- | --- |
| `storage.provider` | `"local"` | `"local"` or `"s3"` |
| `upload.maxFileSizeMb` | `50` | Server-side upload limit |
| `upload.publicMaxFileSizeMb` | `50` | Documented client limit (sync with `NEXT_PUBLIC_MAX_FILE_SIZE`) |
| `image.originalMaxDim` | `2560` | Max dimension for optimized originals |
| `image.placeholderQuality` | `60` | Placeholder WebP quality |
| `image.placeholderWidth` | `360` | Placeholder width (px) |
| `auth.enableSignup` | `true` | Allow new magic-link signups |

## Environment Variables

Copy `.env.example` to `.env` and set values:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Prisma connection string |
| `BETTER_AUTH_SECRET` | Auth signing secret (required) |
| `BETTER_AUTH_URL` | Optional base URL behind proxy |
| `NEXT_PUBLIC_APP_URL` | Public app URL |
| `NEXT_PUBLIC_BASE_URL` | Optional API base for client |
| `NEXT_PUBLIC_MAX_FILE_SIZE` | Client upload limit (MB); sync with `config.upload.publicMaxFileSizeMb` |
| `EMAIL`, `EMAIL_PASSWORD` | SMTP credentials (secrets) |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET` | S3 storage credentials (when using S3) |
| `S3_REGION` | Optional region (`auto` for R2, e.g. `us-east-1` for AWS) |
| `S3_ENDPOINT` | Custom endpoint (R2/MinIO); omit for native AWS S3 |

SMTP host/port/from, `UPLOAD_DIR`, upload limits, and image settings are in [`src/config.ts`](../src/config.ts).

## File Storage

### Local (default)

Set in `src/config.ts`:

```typescript
storage: {
  provider: "local",
  // ...
}
```

Files are stored under `{UPLOAD_DIR}/{application-slug}/`:

```
uploads/
  my-app/
    abc123.jpeg
    abc123.webp
    abc123-placeholder.jpeg
    _cache/
      abc123_w800_h600.webp
```

Public placeholder URLs use `/api/img/{hash}.{ext}-placeholder` (e.g. `/api/img/abc123.webp-placeholder`); on-disk files keep the `{hash}-placeholder.{ext}` naming.

### S3-compatible storage (AWS S3, Cloudflare R2, MinIO, etc.)

All S3-compatible providers use the same API. Set `storage.provider` to `"s3"` in `src/config.ts` and configure credentials in `.env`.

**Cloudflare R2 example:**

```env
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=my-bucket
S3_REGION=auto
S3_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
```

In `src/config.ts`: `forcePathStyle: true`, `region: "auto"`.

**AWS S3 example:**

```env
S3_ACCESS_KEY_ID=...
S3_SECRET_ACCESS_KEY=...
S3_BUCKET=my-bucket
S3_REGION=us-east-1
# S3_ENDPOINT omitted — uses default AWS endpoint
```

In `src/config.ts`: `forcePathStyle: false`, `region: "us-east-1"` (or match `S3_REGION`).

Object keys mirror the local layout: `{slug}/{filename}` and `{slug}/_cache/{cacheName}`.

Files are **not** served directly from the bucket. The app reads objects and serves them via `/api/img/*`, so no public bucket or CORS setup is required.

**Note:** Switching providers does not migrate existing files. Move objects manually or use a migration script if needed.

## Database

Run migrations/push schema:

```bash
npm run db:push
```

## Authentication

- Magic Link via Better Auth
- Configure SMTP to send magic link emails in production
- Disable new signups: set `auth.enableSignup: false` in `src/config.ts`

## Image Processing

- Original images are optimized; same-dimension WebP copies and blurred placeholders are generated on upload
- On-demand resizing via `/api/img/:name?w=...&h=...` with optional `format` and `quality`
- Resize cache stored under `{tenant}/_cache/` in the active storage backend

## Audit Logging

- Uploads and deletions are tracked with metadata, timestamp, IP, and user agent
- View recent activity on each application's dashboard page
