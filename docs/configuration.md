# Configuration

This guide lists environment variables and key settings to run Serve.

## Environment Variables

Copy `.env.example` to `.env.local` and set values:

| Variable | Description | Default |
| --- | --- | --- |
| NEXT_PUBLIC_APP_URL | Public app URL | http://localhost:3003 |
| DATABASE_URL | Prisma connection string | file:./dev.db |
| BETTER_AUTH_SECRET | Secret for auth | (required) |
| ENABLE_SIGNUP | Allow new user registration via magic link | true |
| UPLOAD_DIR | Root directory for uploaded files | uploads |
| ORIGINAL_MAX_DIM | Max dimension for optimized originals (px) | 2560 |
| MAX_FILE_SIZE | Max upload size in bytes | 10000000 |
| SMTP_HOST | Email server host (for magic links) | - |
| SMTP_PORT | Email server port | - |

Notes:
- Use a Postgres/MySQL URL in `DATABASE_URL` for production.
- `UPLOAD_DIR` can be pointed to a mounted volume or network storage.
- `MAX_FILE_SIZE` is enforced by the upload route.

## Database

- Default: SQLite via `file:./dev.db`
- Production: Prefer PostgreSQL

Run migrations/push schema:

```bash
bun run db:push   # or: npx prisma db push
```

Open Prisma Studio:

```bash
bun run db:studio # or: npx prisma studio
```

## Authentication

- Magic Link via Better-Auth
- Configure SMTP to send magic link emails in production
- To disable new signups (allowing only existing users to sign in), set `ENABLE_SIGNUP=false` in your environment

## File Storage

- Local filesystem under `UPLOAD_DIR` organized by application slug
- Original image is optimized; a same‑dimension WebP copy is generated
- Size variants are served on‑demand via `/api/img/:name?w=...&h=...` with optional `q` (quality) and cached on disk
- Supports format conversion (WebP output via extension: `/api/img/image.webp`)
- Cache directory: `{UPLOAD_DIR}/{app-slug}/_cache/`

## Audit Logging

- All file uploads and deletions are automatically tracked
- Logs include action type, target ID, metadata, timestamp, IP, and user agent
- Access via `/api/audit-logs` with pagination support
- Requires authentication and application ownership validation

## API Keys

- Keys are hashed and validated on the server
- Keys do not expire; revoke or delete to invalidate
