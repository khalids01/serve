FROM node:24-bookworm-slim

WORKDIR /app

# Install dependencies for Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    libssl3 \
    libc6 \
    libgcc-s1 \
    libstdc++6 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy only package files first (better caching)
COPY package.json package-lock.json* ./

# Install ALL dependencies (dev + prod)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy the rest of the project
COPY . .

RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Non-root user
RUN useradd -ms /bin/bash -u 10001 appuser

# Persistent upload directory (bind-mount this in production)
ENV UPLOAD_DIR=/uploads
RUN mkdir -p /uploads && chown -R appuser:appuser /uploads

USER appuser


EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
