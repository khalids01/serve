# =========================
# 1) BUILDER (Bun latest)
# =========================
FROM oven/bun:latest AS builder

WORKDIR /app

COPY package.json bun.lockb* ./
RUN bun install

COPY . .

# Prisma client (NO DB needed)
RUN bunx prisma generate

# Build Next.js (standalone)
RUN bun run build


# =========================
# 2) RUNTIME (Bun latest)
# =========================
FROM oven/bun:latest

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3002
ENV UPLOAD_DIR=/uploads

# Non-root user
RUN adduser --disabled-password --uid 10001 appuser

# Copy runtime artifacts
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

RUN mkdir -p /uploads && chown -R appuser:appuser /uploads /app
USER appuser

EXPOSE 3002
CMD ["bun", "server.js"]
