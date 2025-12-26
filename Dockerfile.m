# =========================
# 1) Builder (Ubuntu – reliable)
# =========================
FROM ubuntu:22.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# System deps needed for Node + Prisma
RUN apt-get update && apt-get install -y \
  curl \
  ca-certificates \
  openssl \
  libssl3 \
  libc6 \
  libgcc-s1 \
  libstdc++6 \
  && rm -rf /var/lib/apt/lists/*

# Install Node 24
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

# Install deps (THIS is why it works)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# Copy source
COPY . .

# Prisma + build (your known-good path)
RUN npx prisma generate
RUN npm run build


# =========================
# 2) Runtime (Slim, clean)
# =========================
FROM node:24-bookworm-slim

WORKDIR /app

RUN useradd -ms /bin/bash -u 10001 appuser

# Copy ONLY what runtime needs
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Uploads
RUN mkdir -p /app/uploads && chown -R appuser:appuser /app/uploads

ENV NODE_ENV=production
ENV UPLOAD_DIR=uploads

USER appuser

EXPOSE 3002
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
