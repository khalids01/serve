# =========================
# 1) BUILDER (Bun latest)
# =========================
FROM oven/bun:latest AS builder

WORKDIR /app

# ---- Install deps ----
COPY package.json bun.lockb* ./
RUN bun install

# ---- App source ----
COPY . .

# ---- Prisma client (NO DB needed) ----
RUN bunx prisma generate

# ---- Next build (standalone output) ----
RUN bun run build


# =========================
# 2) RUNTIME (Bun latest slim)
# =========================
FROM oven/bun:latest-slim

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002
ENV UPLOAD_DIR=/uploads

# ---- Non-root user ----
RUN adduser --disabled-password --uid 10001 appuser

# ---- Copy ONLY what is needed ----
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# ---- Uploads ----
RUN mkdir -p /uploads && chown -R appuser:appuser /uploads /app
USER appuser

EXPOSE 3002

CMD ["bun", "server.js"]
