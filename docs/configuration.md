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
| `auth.enableSignup` | `false` | Allow new email-code and GitHub signups |
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

- Email OTP and GitHub OAuth via Better Auth
- Configure SMTP to send sign-in code emails in production
- Disable new signups: set `auth.enableSignup: false` in `src/config.ts` or `ENABLE_SIGNUP=false`

## Image Processing

- Original **raster images** (JPEG, PNG, WebP) are optimized on upload; same-dimension WebP copies and blurred placeholders are generated
- PDFs, videos, audio, and other non-image files are stored as uploaded with no Sharp processing
- On-demand resizing via `/api/img/:name?w=...&h=...` with optional `format` and `quality` — **raster images only**; other file types are served as uploaded and return `400` if resize/format params are requested
- Resize cache stored under `{tenant}/_cache/` when `storage.cacheInStorage` is `true` in `src/config.ts`; set to `false` to skip cache read/write (resize still works, but re-processes on every request)

## Audit Logging

- Application-linked uploads and deletions are tracked with metadata, timestamp, IP, and user agent
- View recent activity on each application's dashboard page

### Storage file manager

Open **Storage → Browse files** on any drive. Upload files or whole folders, drag
files or folders into the current folder, create folders, rename, cut/copy/paste, and move or
copy selections to another folder or drive. Uploads preserve original names and
folder paths, stream to storage, show progress, and can be cancelled. Existing
names are never overwritten; copy/paste in the same folder creates a numbered
copy. Direct storage uploads are stored unchanged and are not application-linked
or image-optimized; use the application's Files/Upload workflow for those features.

Double-click to open folders or previews. Use breadcrumbs, the parent button, or
browser Back to navigate. Right-click items or empty space for actions; the
three-dot menus expose the same item actions on touch devices. Checkboxes and
Ctrl/Cmd-click select multiple items, and Shift-click selects a range. Keyboard
shortcuts include Ctrl/Cmd+A/C/X/V, F2, Delete, Enter, Escape, and Up/Down arrows.
List/grid views, sorting, and name filtering are available; sorting and filtering
apply to the current page. Listings load 100 items at a time. Local directory
changes during pagination can shift entries; refresh from the first page.

Delete moves items to a private Trash under `.serve-trash/<user>/`. Trash supports
restore and permanent deletion with confirmation. Restore never overwrites an
existing item. Folder transfers copy all destination items before deleting any
source files, and failed copies clean up new destinations. Multi-item operations
can partially complete if a provider fails; refresh and check both locations.
Operations process at most 1,000 files/folders per request. S3 server-side copies
support objects up to 5 GiB; larger objects require provider tooling.

Administrators browse the entire configured upload directory or bucket, including
files added outside Serve. Other users see only their private upload namespace.
A saved connection must belong to the signed-in user, including administrators.
Paths outside `UPLOAD_DIR`, symbolic links, internal blob/cache directories,
backup paths, and application-managed files are protected from unsafe changes.
Folders containing symlinks or managed objects cannot be moved or deleted here.

Raster image previews are limited to 10 MiB; text to 1 MiB. HTML and code display
as plain text; SVG and other active content are download-only. Listing, previews,
and downloads require a session; writes also validate request origin. Private
responses are not cached and storage credentials stay on the server.

S3 listing uses delimiter-based `ListObjectsV2` pagination. The manager needs
`s3:ListBucket`, `s3:GetObject`, `s3:PutObject`, and `s3:DeleteObject`; the provider
must support conditional PutObject/CopyObject (`If-None-Match: *`) for exclusive
writes. There is no recursive scan just to open a folder. Run
`npm run test:storage-browser` for isolated browsing and mutation tests. They use
temporary local storage and an S3 protocol test server, without a live database
or bucket.
