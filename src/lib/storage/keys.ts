const BLOB_PREFIX = "_blobs";
const CACHE_DIR = "_cache";

export function blobKey(filename: string): string {
  return `${BLOB_PREFIX}/${filename}`;
}

export function blobCacheKey(cacheName: string): string {
  return `${BLOB_PREFIX}/${CACHE_DIR}/${cacheName}`;
}

export function blobCachePrefix(): string {
  return `${BLOB_PREFIX}/${CACHE_DIR}/`;
}

export function objectKey(tenantKey: string, filename: string): string {
  return `${tenantKey}/${filename}`;
}

export function cacheKey(tenantKey: string, cacheName: string): string {
  return `${tenantKey}/${CACHE_DIR}/${cacheName}`;
}

export function cachePrefix(tenantKey: string): string {
  return `${tenantKey}/${CACHE_DIR}/`;
}

export function uniqueTenantKeys(
  slug: string | null | undefined,
  applicationId: string,
): string[] {
  const keys: string[] = [];
  if (slug) keys.push(slug);
  if (applicationId && applicationId !== slug) keys.push(applicationId);
  return keys;
}
