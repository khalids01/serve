FROM node:24-bookworm-slim

WORKDIR /app

# System deps for Prisma
RUN apt-get update && apt-get install -y \
  openssl \
  libssl3 \
  libc6 \
  libgcc-s1 \
  libstdc++6 \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Dependencies
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

# App source
COPY . .

# Prisma client (NO DB NEEDED)
RUN npx prisma generate

# Build
RUN npm run build

# Non-root user
RUN useradd -ms /bin/bash -u 10001 appuser

# Uploads
ENV UPLOAD_DIR=/uploads
RUN mkdir -p /uploads && chown -R appuser:appuser /uploads

USER appuser

EXPOSE 3002

# DB exists at runtime → migrations OK
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
