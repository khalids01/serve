FROM node:24-slim

WORKDIR /app

RUN corepack enable

# Copy only package files first (better caching)
COPY package.json ./

# Install ALL dependencies (dev + prod)
RUN npm install

# Copy the rest of the project
COPY . .

RUN npx prisma generate

# Build the Next.js app
RUN npm run build

EXPOSE 3002

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
