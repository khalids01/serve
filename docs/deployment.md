# Deployment Guide

You can deploy Serve to Vercel, Docker, or self-host on your own infrastructure.

## Quick actions

1. Set environment variables (see [configuration.md](configuration.md)).
2. Use **PostgreSQL** in production (`DATABASE_URL`).
3. Run `npm run db:push` or migrations before first start.
4. Configure SMTP for magic-link authentication.
5. Enable backups in [configuration.md](configuration.md#data-backup) — the scheduler starts automatically via Next.js instrumentation.

## Docker

Build and run locally or in your infra:

```bash
# Build
docker build -t serve .

# Run
docker run --name serve -p 3003:3003 \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3003 \
  -e DATABASE_URL="postgresql://..." \
  -e BETTER_AUTH_SECRET="your-secret" \
  serve
```

Mount uploads to persist files across restarts:

```bash
docker run --name serve -p 3003:3003 \
  -v $(pwd)/uploads:/uploads \
  -e UPLOAD_DIR="/uploads" \
  ...
```

## Self-Hosted (Recommended)

1. Install dependencies: `bun install` (or npm)
2. Set env vars (see [configuration.md](configuration.md))
3. Push schema: `bun run db:push`
4. Build: `bun run build`
5. Start: `bun start`

## Backups in production

- **PostgreSQL** is required for SQL database dumps.
- Scheduled backups run in-process via the backup scheduler (started in `instrumentation.ts`).
- Backup files are stored in your configured storage backend (local or S3/R2) under `BACKUP_BASE_PREFIX` (default `data-backup`).
- Configure intervals and retention in **Dashboard → Data Backup** or via `BACKUP_*` env vars.
- After database loss, use **Scan storage** in the dashboard to rediscover backup files still in object storage.

## Best Practices

- Use PostgreSQL in production
- Store `UPLOAD_DIR` on persistent storage (volume or network drive) when using local storage
- Use S3-compatible storage for scalable multi-node deployments
- Configure SMTP for magic links
- Keep API keys secret; never expose in client apps
- Behind a reverse proxy, set `NEXT_PUBLIC_APP_URL` to your public URL
- Test backup restore periodically (JSON metadata restore + SQL dump recovery)
