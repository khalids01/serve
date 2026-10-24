# Configuration

See [storage connections and file manager](storage-and-file-manager.md) for Default, encrypted S3 connections, persistent Local storage, folders, and file moves.

This guide covers environment variables, `src/config.ts`, and storage setup for Serve.

## Quick actions

1. Copy [`.env.example`](../.env.example) to `.env` and set secrets (`DATABASE_URL`, `BETTER_AUTH_SECRET`, SMTP).
2. Run `npm run db:push` (or `db:migrate`) to apply the schema.
3. Set `STORAGE_PROVIDER=local` or `s3` in the service environment.
4. Configure backups (optional) via env vars or **Dashboard → Data Backup**.
5. Sign in, create an application, and generate an API key.
6. Integrate your app using [integration-guide.md](integration-guide.md).

## Configuration Split

**Secrets and deployment-specific values** live in `.env` (see [`.env.example`](../.env.example)).

**Non-secret app settings** live in [`src/config.ts`](../src/config.ts):

| Setting | Default | Description |
| --- | --- | --- |
| `storage.provider` | `"s3"` | Controlled by `STORAGE_PROVIDER=local` or `s3` |
| `storage.cacheInStorage` | `false` | Store on-demand resize outputs under `{tenant}/_cache/` |
| `upload.maxFileSizeMb` | `50` | Server-side upload limit |
| `upload.publicMaxFileSizeMb` | `50` | Documented client limit (sync with `NEXT_PUBLIC_MAX_FILE_SIZE`) |
| `image.originalMaxDim` | `2560` | Max dimension for optimized originals |
| `image.placeholderQuality` | `60` | Placeholder WebP quality |
| `image.placeholderWidth` | `360` | Placeholder width (px) |
| `auth.enableSignup` | `false` | Allow new magic-link signups |
| `backup.enabled` | `true` | Enable scheduled and manual backups |
| `backup.basePrefix` | `"data-backup"` | Storage prefix for backup files |

## Environment Variables

Copy `.env.example` to `.env` and set values:

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (required by the current schema) |
| `BETTER_AUTH_SECRET` | Auth signing secret (required) |
| `BETTER_AUTH_URL` | Optional base URL behind proxy |
| `NEXT_PUBLIC_APP_URL` | Public Serve origin used in returned URLs; local dev defaults to http://localhost:5000 |
| `FILE_SERVER_BROWSER_TOKEN_SECRET` | Dedicated random secret of at least 32 characters; required for React browser management, configured only on the Serve host |
| `ENABLE_SIGNUP` | Set true for initial account creation; default false |
| `NEXT_PUBLIC_BASE_URL` | Optional API base for client |
| `NEXT_PUBLIC_MAX_FILE_SIZE` | Client upload limit (MB); sync with `config.upload.publicMaxFileSizeMb` |
| `EMAIL`, `EMAIL_PASSWORD` | SMTP credentials (secrets) |
| `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET` | S3 storage credentials (when using S3) |
| `STORAGE_PROVIDER` | `s3` (default) or `local` |
| `UPLOAD_DIR` | Local storage root; Docker uses `/uploads` and its persistent volume |
| `S3_REGION` | Optional region (`auto` for R2, e.g. `us-east-1` for AWS) |
| `S3_ENDPOINT` | Custom endpoint (R2/MinIO); omit for native AWS S3 |
| `BACKUP_ENABLED` | Set to `false` to disable backups |
| `BACKUP_BASE_PREFIX` | Backup folder prefix in storage (default `data-backup`) |
| `BACKUP_JSON_INTERVAL_MINUTES` | Auto metadata backup interval (minutes) |
| `BACKUP_SQL_INTERVAL_MINUTES` | Auto database backup interval (minutes) |
| `BACKUP_SCHEDULER_INTERVAL_MINUTES` | How often the scheduler checks for due jobs |
| `BACKUP_DAILY_RETENTION_DAYS` | Keep daily snapshots for N days |
| `BACKUP_WEEKLY_RETENTION_WEEKS` | Keep weekly snapshots for N weeks |
| `BACKUP_MONTHLY_RETENTION_MONTHS` | Keep monthly snapshots for N months |

SMTP host/port/from and image settings remain in [`src/config.ts`](../src/config.ts). Storage provider, local upload directory and upload limits can be set through env. For Docker builds, public URL and browser limits must match the runtime values; see [deployment.md](deployment.md).

## Dashboard layout

| Page | Path | Purpose |
| --- | --- | --- |
| Profile | `/dashboard/profile` | Account info and security |
| Settings | `/dashboard/settings` | System configuration and live stats |
| Data Backup | `/dashboard/data-backup` | Schedule backups, scan storage, restore metadata, download files |
| Cache | `/dashboard/cache` | View and clear on-demand resize cache |

## File Storage

### Local

Set `STORAGE_PROVIDER=local` and optionally `UPLOAD_DIR` in the service environment.

Local files live beneath the persistent upload root, separated by owner and location. For example, explicit Local storage uses `owners/<owner-id>/local/_blobs/`; Default has its own configuration-specific namespace. Variants and generated cache live alongside their originals.

Public file URLs use stable logical entry IDs. Use the URLs returned by Serve instead of constructing paths from hashes or storage filenames.

### S3-compatible storage (AWS S3, Cloudflare R2, MinIO, etc.)

All S3-compatible providers use the same API. Set `STORAGE_PROVIDER=s3` and configure credentials in the service environment.

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

Object keys mirror the local layout: `_blobs/{filename}` and `_blobs/_cache/{cacheName}`. Legacy `{slug}/` objects remain readable.

Use URLs returned by Serve. It reads objects and serves images via `/api/img/*` and range-capable files via `/api/v1/files/:id/content`. No public bucket or S3 CORS setup is required. Consumers configure only FILE_SERVER_URL and FILE_SERVER_API_KEY; they never need S3 credentials. A CDN can cache the Serve URLs without changing app integration.

**Note:** Switching providers does not migrate existing files. Move objects manually or use a migration script if needed.

## Cache dashboard

On-demand resize can cache outputs under each tenant's `_cache/` folder (or `_blobs/_cache/` depending on layout).

- **Dashboard → Cache** (`/dashboard/cache`): list cache entries per application or clear all.
- Controlled by `storage.cacheInStorage` in `src/config.ts`. When `false`, resize still works but skips cache read/write (re-processes each request).

## Data backup

Backups are stored in your configured object storage under:

```
{basePrefix}/{daily|weekly|monthly}/{json|sql}/{filename}
```

| Type | Contents |
| --- | --- |
| **JSON** | Image/application metadata snapshot (not raw blob files) |
| **SQL** | Full PostgreSQL dump (requires PostgreSQL) |

**Dashboard → Data Backup** (`/dashboard/data-backup`):

- Schedule automatic JSON and SQL backups
- **Take backup** manually
- **Scan storage** — import backup files from storage into the database (use after DB loss if S3 files remain)
- **Restore metadata** — upsert applications/images from a JSON backup
- **Download** — save any backup file locally
- **Clean old backups** — remove files past retention windows

**Disaster recovery:** The backup file list is database-backed. If you lose app data but still have files in S3, click **Scan storage** to rebuild the list, then restore metadata from a JSON backup.

Settings saved in the dashboard override defaults from `config.ts` and are stored in the `BackupConfig` table.

## Database

Run migrations/push schema:

```bash
npm run db:push
```

Use PostgreSQL in production (required for SQL database backups).

## Authentication

- Magic Link via Better Auth
- Configure SMTP to send magic link emails in production
- Disable new signups: set `auth.enableSignup: false` in `src/config.ts` or `ENABLE_SIGNUP=false`

## Image Processing

- Original **raster images** (JPEG, PNG, WebP) are optimized on upload; same-dimension WebP copies and blurred placeholders are generated
- PDFs, videos, audio, and other non-image files are stored as uploaded with no Sharp processing
- On-demand resizing via `/api/img/:name?w=...&h=...` with optional `format` and `quality` — **raster images only**; other file types are served as uploaded and return `400` if resize/format params are requested
- Resize cache stored under `{tenant}/_cache/` when `storage.cacheInStorage` is `true` in `src/config.ts`; set to `false` to skip cache read/write (resize still works, but re-processes on every request)

## Audit Logging

- Uploads and deletions are tracked with metadata, timestamp, IP, and user agent
- View recent activity on each application's dashboard page
