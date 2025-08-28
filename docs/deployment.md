# Deployment Guide

You can deploy Serve to Vercel, Docker, or self-host on your own infrastructure.

## Docker

Build and run locally or in your infra:

```bash
# Build
docker build -t serve .

# Run
docker run --name serve -p 3003:3003 \
  -e NEXT_PUBLIC_APP_URL=http://localhost:3003 \
  -e DATABASE_URL="file:./dev.db" \
  -e BETTER_AUTH_SECRET="your-secret" \
  serve
```

Mount uploads to persist files across restarts:

```bash
docker run --name serve -p 3003:3003 \
  -v $(pwd)/uploads:/app/uploads \
  -e UPLOAD_DIR="uploads" \
  ...
```

## Self-Hosted (Recommended)

1. Install dependencies: `bun install` (or npm)
2. Set env vars (see docs/configuration.md)
3. Push schema: `bun run db:push`
4. Build: `bun build`
5. Start: `bun start`

## Best Practices

- Use PostgreSQL in production
- Store `UPLOAD_DIR` on persistent storage (volume or network drive)
- Configure SMTP for magic links
- Keep API keys secret; never expose in client apps
- Behind a reverse proxy, set `NEXT_PUBLIC_APP_URL` to your public URL
