# =========================
# 1) Builder (Ubuntu 24.04)
# =========================
FROM ubuntu:24.04 AS builder

ENV DEBIAN_FRONTEND=noninteractive
WORKDIR /app

# ---- System deps (minimal but Prisma-safe) ----
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  openssl \
  libssl3 \
  libc6 \
  libgcc-s1 \
  libstdc++6 \
  && rm -rf /var/lib/apt/lists/*

# ---- Node 24 ----
RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/*

# ---- Dependencies ----
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

# ---- Source ----
COPY . .

# ---- Prisma (builder ONLY) ----
RUN npx prisma generate
RUN npx prisma migrate deploy

# ---- Build ----
RUN npm run build


# =========================
# 2) Runtime (Ubuntu 24.04 slim)
# =========================
FROM ubuntu:24.04

WORKDIR /app

# ---- Runtime system deps ----
RUN apt-get update && apt-get install -y --no-install-recommends \
  ca-certificates \
  openssl \
  libssl3 \
  libc6 \
  libgcc-s1 \
  libstdc++6 \
  nodejs \
  && rm -rf /var/lib/apt/lists/*

# ---- Non-root user ----
RUN useradd -ms /bin/bash -u 10001 appuser

# ---- Prisma runtime env ----
ENV NODE_ENV=production
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
ENV PRISMA_CLI_BINARY_TARGETS=linux-openssl-3.0.x

# ---- Copy runtime artifacts ----
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# ---- Uploads ----
RUN mkdir -p /app/uploads \
  && chown -R appuser:appuser /app

USER appuser

EXPOSE 3002

CMD ["npm", "run", "start"]
