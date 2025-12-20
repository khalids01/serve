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

# Install dependencies
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; else npm install --legacy-peer-deps; fi

# Copy project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Add non-root user
RUN useradd -ms /bin/bash -u 10001 appuser

# Create uploads directory
ENV UPLOAD_DIR=/uploads
RUN mkdir -p /uploads && chown -R appuser:appuser /uploads

USER appuser

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]