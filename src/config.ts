import path from "path";

export type StorageProvider = "local" | "s3";

function normalizeS3Endpoint(endpoint?: string): string | undefined {
  if (!endpoint?.trim()) return undefined;
  const trimmed = endpoint.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export const config = {
  storage: {
    /** Switch between local filesystem and S3-compatible object storage. */
    provider: "s3" as StorageProvider,
    local: {
      uploadDir: "uploads" as string,
    },
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET,
      /** AWS region (e.g. "us-east-1") or "auto" for Cloudflare R2. */
      region: process.env.S3_REGION ?? "auto",
      /** Custom endpoint for R2/MinIO/iDrive e2/etc. Omit for native AWS S3. */
      endpoint: normalizeS3Endpoint(process.env.S3_ENDPOINT),
      /** true for R2/MinIO; false for native AWS S3. */
      forcePathStyle: true,
    },
    /** Store on-demand resize cache under {tenant}/_cache/ in the active backend. */
    cacheInStorage: true,
  },

  upload: {
    maxFileSizeMb: 50,
    publicMaxFileSizeMb: 50,
  },

  image: {
    originalMaxDim: 2560,
    placeholderQuality: 60,
    placeholderWidth: 360,
  },

  auth: {
    enableSignup: process.env.ENABLE_SIGNUP === "true",
  },

  email: {
    host: "smtp.gmail.com",
    port: 465,
    from: "Serve File Storage",
  },

  app: {
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:4000",
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "",
    betterAuthUrl: process.env.BETTER_AUTH_URL,
  },

  secrets: {
    databaseUrl: process.env.DATABASE_URL,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    email: process.env.EMAIL,
    emailPassword: process.env.EMAIL_PASSWORD,
  },
} as const;

export function maxFileSizeBytes(): number {
  return config.upload.maxFileSizeMb * 1024 * 1024;
}

export function publicMaxFileSizeBytes(): number {
  const fromEnv = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE);
  const mb =
    Number.isFinite(fromEnv) && fromEnv > 0
      ? fromEnv
      : config.upload.publicMaxFileSizeMb;
  return mb * 1024 * 1024;
}

/** Human-readable storage location for a tenant (dashboard display). */
export function tenantStoragePath(slug: string): string {
  if (config.storage.provider === "s3") {
    const bucket = config.storage.s3.bucket ?? "bucket";
    return `s3://${bucket}/${slug}`;
  }
  return path.join(config.storage.local.uploadDir, slug);
}
