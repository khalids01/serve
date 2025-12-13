FROM debian:12-slim

WORKDIR /app

# Install dependencies for Bun + Prisma
RUN apt-get update && apt-get install -y \
    curl \
    unzip \
    openssl \
    libssl3 \
    libssl-dev \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*


RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
RUN \. "$HOME/.nvm/nvm.sh"
RUN nvm install 24
RUN nvm use 24

# Copy only package files first (better caching)
COPY package.json ./

# Install ALL dependencies (dev + prod)
RUN npm install

# Copy the rest of the project
COPY . .

RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Non-root user
RUN useradd -ms /bin/bash appuser
USER appuser


EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
