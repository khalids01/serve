# LumenBox — Self-Hosted Image Server (Project Plan)

> A minimal, open-source, S3-like image service with magic-link auth, multi-tenant “Applications”, local filesystem storage, Prisma + SQLite metadata, and simple REST APIs with API keys.

---

## 1) Goals

- **Self-hosted**: No S3 or external storage; use local filesystem.
- **Simple auth**: Better Auth with **Magic Link only**.
- **Bootstrap flow**: On first run, if no user exists → register the first user as **Admin**.
- **Multi-tenant**: Users create **Applications** (tenants). Each application has its own API key(s) and isolated storage directory.
- **Core features**: upload, compress, transform, view, search, list, delete.
- **DX first**: Clean API, TypeScript, Prisma, Next.js App Router.
- **Open-source**: Clear structure, tests, docs, examples.

---

## 2) High-Level Architecture

- **Frontend**: Next.js 14/15 (App Router), TypeScript, shadcn/ui for admin UI.
- **Backend**: Next.js Route Handlers (`app/api/**`) for REST APIs.
- **Auth**: Better Auth, Magic Link only.
- **DB**: Prisma + SQLite for metadata & auth backing store.
- **Storage**: Local filesystem under `public/uploads/{applicationId}/...`.
- **Image Processing**: `sharp` for compression, thumbnails, and transforms.
- **Search**: SQLite queries + optional FTS5 virtual table for filename/tags.
- **API Access**: Per-application API keys (hashed in DB), RBAC (admin/user).
- **Rate Limiting**: SQLite or in-memory token bucket keyed by API key.
- **Background Tasks**: Synchronous by default; optional worker queue later.

---

## 3) Data Model (Prisma)

```prisma
// prisma/schema.prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL") // e.g., file:./data.db
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id          String    @id @default(cuid())
  email       String    @unique
  role        Role      @default(USER)
  createdAt   DateTime  @default(now())
  applications Application[] @relation("UserApplications")
  apiKeys     ApiKey[]
  auditLogs   AuditLog[]
}

model Application {
  id            String   @id @default(cuid())
  name          String
  slug          String   @unique
  ownerId       String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  storageDir    String   // e.g., "uploads/<appId>"
  images        Image[]
  apiKeys       ApiKey[]
  members       User[]   @relation("UserApplications")
}

model Image {
  id            String   @id @default(cuid())
  applicationId String
  filename      String
  originalName  String
  contentType   String
  sizeBytes     Int
  width         Int?
  height        Int?
  hash          String?  // perceptual hash (optional)
  tags          String[] // simple tags
  variants      ImageVariant[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  application Application @relation(fields: [applicationId], references: [id])
}

model ImageVariant {
  id        String   @id @default(cuid())
  imageId   String
  label     String   // e.g., "thumb", "1024w", "webp"
  filename  String
  width     Int?
  height    Int?
  sizeBytes Int
  createdAt DateTime @default(now())

  image Image @relation(fields: [imageId], references: [id])
}

model ApiKey {
  id            String   @id @default(cuid())
  applicationId String
  name          String
  // Store only a hash of the key, never the raw value
  hash          String   @unique
  lastUsedAt    DateTime?
  createdAt     DateTime @default(now())
  revoked       Boolean  @default(false)

  application Application @relation(fields: [applicationId], references: [id])
}

model AuditLog {
  id            String   @id @default(cuid())
  userId        String?
  applicationId String?
  apiKeyId      String?
  action        String    // e.g., "UPLOAD", "DELETE", "LOGIN", "GENERATE_KEY"
  targetId      String?   // imageId or resourceId
  ip            String?
  userAgent     String?
  metadata      Json?
  createdAt     DateTime  @default(now())

  user         User?        @relation(fields: [userId], references: [id])
  application  Application? @relation(fields: [applicationId], references: [id])
  apiKey       ApiKey?      @relation(fields: [apiKeyId], references: [id])
}

enum Role {
  ADMIN
  USER
}
