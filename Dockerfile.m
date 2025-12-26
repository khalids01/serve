# =========================
# 1) BUILDER
# =========================
FROM node:24-bookworm-slim AS builder

WORKDIR /app

# ---- System deps for Prisma ----
RUN apt-get update && apt-get install -y \
  openssl \
  libssl3 \
  libc6 \
  libgcc-s1 \
  libstdc++6 \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# ---- Install deps ----
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

# ---- App source ----
COPY . .

# ---- Prisma (NO DB needed) ----
RUN npx prisma generate

# ---- Next build (standalone output) ----
RUN npm run build


# =========================
# 2) RUNTIME (SLIM)
# =========================
FROM node:24-bookworm-slim

WORKDIR /app

# ---- Runtime system deps ----
RUN apt-get update && apt-get install -y \
  openssl \
  libssl3 \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# ---- Non-root user ----
RUN useradd -ms /bin/bash -u 10001 appuser

# ---- Copy ONLY what is needed ----
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# ---- Uploads ----
ENV UPLOAD_DIR=/uploads
RUN mkdir -p /uploads && chown -R appuser:appuser /uploads

USER appuser

EXPOSE 3002

# ---- Runtime: DB exists here ----
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
