# syntax=docker/dockerfile:1
# Debian 13 supplies PostgreSQL 17 client tools for the optional SQL backups.
ARG NODE_IMAGE=node:24-trixie-slim
FROM ${NODE_IMAGE} AS base
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates openssl \
    && rm -rf /var/lib/apt/lists/*
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
# Prisma generation happens after its schema/config are present, never during install.
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts --no-audit --no-fund

FROM dependencies AS builder
COPY . .
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_BASE_URL=""
ARG NEXT_PUBLIC_MAX_FILE_SIZE=50
# Only public browser settings are build arguments. Production secrets are runtime-only.
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL} \
    NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL} \
    NEXT_PUBLIC_MAX_FILE_SIZE=${NEXT_PUBLIC_MAX_FILE_SIZE}
RUN node -e "const u = new URL(process.env.NEXT_PUBLIC_APP_URL); if (!['http:','https:'].includes(u.protocol) || u.origin !== process.env.NEXT_PUBLIC_APP_URL) throw new Error('Set NEXT_PUBLIC_APP_URL to the public Serve origin, without a trailing slash')"
# This URL is a build placeholder. Builds generate a client; they never migrate/seed.
RUN DATABASE_URL=postgresql://build:build@127.0.0.1:1/build \
    BETTER_AUTH_SECRET=build-only-placeholder-not-a-production-secret \
    BACKUP_ENABLED=false \
    npm run build -- --no-lint

FROM base AS migrate
ENV NODE_ENV=production
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/package.json /app/package-lock.json ./
COPY --from=builder --chown=node:node /app/prisma ./prisma
COPY --from=builder --chown=node:node /app/prisma.config.ts ./prisma.config.ts
USER node
CMD ["./node_modules/.bin/prisma", "migrate", "deploy"]

FROM base AS app
RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*
ARG REVISION=development
ARG NEXT_PUBLIC_APP_URL
LABEL org.opencontainers.image.source="https://github.com/khalids01/serve" \
      org.opencontainers.image.revision=${REVISION}
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=5000 UPLOAD_DIR=/uploads \
    SERVE_COMMIT=${REVISION} SERVE_BUILD_PUBLIC_URL=${NEXT_PUBLIC_APP_URL}
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/prisma/generated ./prisma/generated
COPY --chown=node:node docker/validate-env.mjs ./docker/validate-env.mjs
COPY --chown=node:node --chmod=755 docker/entrypoint.sh ./docker/entrypoint.sh
RUN mkdir -p /uploads && chown node:node /uploads
USER node
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:5000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
ENTRYPOINT ["/app/docker/entrypoint.sh"]
CMD ["node", "server.js"]
