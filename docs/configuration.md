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
| `ADMIN_EMAIL` | Existing account to promote when running the admin command |
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
| Profile | `/dashboard/profile` | Editable display name, account role, and security |
| Users (admin) | `/dashboard/users` | Searchable user directory, 25 accounts per page |
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
- Enable or disable new email/GitHub accounts in **Settings → Account registration** (admin only). Fresh installations allow signup until an administrator disables it; `ENABLE_SIGNUP` is no longer used.

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

Click once to open folders or previews. Drag a rectangle across items to select them
on desktop; Ctrl/Cmd or Shift preserves the current selection. Selected items
remain draggable for file transfers. On touch screens, hold an item to enter
selection mode, then tap other items to toggle them. Scrolling cancels a pending
hold. Selection indicators are shaded circles, hidden until hover, keyboard focus,
or selection. Item menus are hidden on desktop (use right-click) and visible on
touch devices. Use breadcrumbs, the parent button, or
browser Back to navigate. Right-click items or empty space for actions; the
three-dot menus expose the same item actions on touch devices. Selection controls and
Ctrl/Cmd-click select multiple items, and Shift-click selects a range. Keyboard
shortcuts include Ctrl/Cmd+A/C/X/V, F2, Delete, Enter, Escape, and Up/Down arrows.
List/grid views, sorting, and name filtering are available; sorting and filtering
apply to the current page. The storage view shows up to 24 logical items per page,
with always-visible First, Previous, and Next controls. Listings read bounded
100-object backend chunks, scanning at most four chunks per request; they never
load the whole bucket to count pages. Local directory
changes during pagination can shift entries; refresh from the first page.

Generated image originals, WebP versions, and placeholders appear as one entry
with a version count. Open it to switch between variants and download each one.
Saved image metadata is preferred; strict content-ID filenames are the fallback.
Grouping stays within the current storage namespace and folder and remains stable
across page boundaries. Ordinary similar filenames stay separate. Group copy,
move, and Trash actions include all variants; grouped rename is not offered to
avoid partially renaming an image family. Trash lists individual stored files.

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

Raster thumbnails load lazily through the authenticated content route and are resized
to fit 320 × 240 pixels. Source images are limited to 10 MiB and 25 million pixels;
invalid images fall back to file icons.

Raster image previews are limited to 10 MiB; text to 1 MiB. Videos, audio,
and PDFs stream directly through the authenticated content route with byte-range
support, so playback and seeking do not buffer the whole file. MP4/WebM/QuickTime
video, MP3/WAV/M4A/Ogg/FLAC audio, PDFs, common raster images, and text/code/CSV/JSON
files can be previewed when supported by the browser. Unsupported formats and
codecs offer a download fallback. PDFs and text can also be previewed in the
application file manager. HTML and code display
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

### Initial administrator

Set `ADMIN_EMAIL` to your email, then sign up normally with an email code or
GitHub. Every new account starts as a regular user. Setting the environment
variable or restarting the app does not create accounts or change roles.

After signing up, open the app container's terminal and run:

```sh
node /app/docker/bootstrap-admin.mjs
```

Locally, run `npm run admin:bootstrap` (`npm run db:seed` is an alias).
The command reads `ADMIN_EMAIL` from the environment (or local `.env`) and
promotes the existing account. It fails if no matching account exists and never
creates users, changes emails, or bypasses verification. Repeated runs are safe.
Changing `ADMIN_EMAIL` does not demote previously configured administrators.

The `/auth/sign-up` page shows registration availability and offers email-code
and GitHub signup when enabled. The sign-in page links to it while signup is open.

Fresh installations allow signup so you can create the first account. After
promotion, use **Settings → Account registration** to disable signup if desired.
Existing saved signup settings are preserved when upgrading.

Global settings, email administration, and backup APIs require an admin browser
session. Application API keys cannot administer these settings. New-user creation
checks the current signup setting for every OTP/OAuth attempt; existing accounts
can still sign in while registration is disabled. No restart is needed after
changing the toggle.

### Add storage items to an application

Select one or more files or folders in Storage, then choose **Add to application**
from the toolbar, right-click menu, or touch menu. Pick an existing application
from the searchable, paginated list. This copies into that application's configured
storage and creates entries in its Files view; the source is never moved or deleted.
Both source-storage access and destination-application ownership are checked.

Folder structure is preserved, and image families import once with generated
WebP/placeholder variants. Copies run sequentially; videos and other non-optimized
files stream through private temporary files rather than full in-memory buffers.
Limits are the configured upload size (at most 500 MiB per file), 100 files,
500 MiB total, and 1,000 files/folders per operation. Optimized image imports also
have a 64 MiB / 40-million-pixel processing limit. Temporary files are removed on
success or failure. Partial failures are listed individually; retrying the original
selection preserves folders and reuses existing application entries.
