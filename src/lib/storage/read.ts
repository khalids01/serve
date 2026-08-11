import { config } from "@/config";
import type {
  StorageBackend,
  StorageByteRange,
  StorageReadStream,
} from "./backend";
import { getStorage } from "./factory";
import {
  blobCacheKey,
  blobCachePrefix,
  blobKey,
  cacheKey,
  cachePrefix,
  objectKey,
  uniqueTenantKeys,
} from "./keys";

export { uniqueTenantKeys };

export async function readBlobFile(
  storage: StorageBackend,
  filename: string,
): Promise<Buffer | null> {
  return storage.get(blobKey(filename));
}

export async function readBlobCache(
  storage: StorageBackend,
  cacheName: string,
): Promise<Buffer | null> {
  return storage.get(blobCacheKey(cacheName));
}

export async function readBlobFileWithLegacy(
  storage: StorageBackend,
  filename: string,
  legacyTenantKeys: string[] = [],
): Promise<Buffer | null> {
  const blob = await readBlobFile(storage, filename);
  if (blob) return blob;
  return readTenantFile(storage, legacyTenantKeys, filename);
}

export async function openBlobFileWithLegacy(
  storage: StorageBackend,
  filename: string,
  legacyTenantKeys: string[] = [],
  range?: StorageByteRange,
): Promise<StorageReadStream | null> {
  const blob = await storage.open(blobKey(filename), range);
  if (blob) return blob;

  for (const tenantKey of legacyTenantKeys) {
    const legacy = await storage.open(objectKey(tenantKey, filename), range);
    if (legacy) return legacy;
  }

  return null;
}

export async function readBlobCacheWithLegacy(
  storage: StorageBackend,
  cacheName: string,
  legacyTenantKeys: string[] = [],
): Promise<Buffer | null> {
  if (!config.storage.cacheInStorage) return null;
  const cached = await readBlobCache(storage, cacheName);
  if (cached) return cached;
  return readTenantCache(storage, legacyTenantKeys, cacheName);
}

export async function writeBlobCache(
  storage: StorageBackend,
  cacheName: string,
  data: Buffer,
  contentType?: string,
): Promise<void> {
  if (!config.storage.cacheInStorage) return;
  await storage.put(blobCacheKey(cacheName), data, { contentType });
}

export async function deleteBlobCacheByBase(
  storage: StorageBackend,
  baseName: string,
): Promise<void> {
  const prefix = blobCachePrefix();
  const items = await storage.list(prefix);
  await Promise.all(
    items
      .filter((item) => {
        const name = item.key.slice(prefix.length);
        return name.startsWith(baseName);
      })
      .map((item) => storage.delete(item.key)),
  );
}

export async function readTenantFile(
  storage: StorageBackend,
  tenantKeys: string[],
  filename: string,
): Promise<Buffer | null> {
  for (const tenantKey of tenantKeys) {
    const data = await storage.get(objectKey(tenantKey, filename));
    if (data) return data;
  }
  return null;
}

export async function readTenantCache(
  storage: StorageBackend,
  tenantKeys: string[],
  cacheName: string,
): Promise<Buffer | null> {
  for (const tenantKey of tenantKeys) {
    const data = await storage.get(cacheKey(tenantKey, cacheName));
    if (data) return data;
  }
  return null;
}

export async function writeTenantCache(
  storage: StorageBackend,
  tenantKey: string,
  cacheName: string,
  data: Buffer,
  contentType?: string,
): Promise<void> {
  await storage.put(cacheKey(tenantKey, cacheName), data, { contentType });
}

export async function deleteTenantCacheByBase(
  storage: StorageBackend,
  tenantKeys: string[],
  baseName: string,
): Promise<void> {
  for (const tenantKey of tenantKeys) {
    const prefix = cachePrefix(tenantKey);
    const items = await storage.list(prefix);
    await Promise.all(
      items
        .filter((item) => {
          const name = item.key.slice(prefix.length);
          return name.startsWith(baseName);
        })
        .map((item) => storage.delete(item.key)),
    );
  }
}

export async function deleteBlobAndLegacyCacheByBase(
  storage: StorageBackend,
  baseName: string,
  legacyTenantKeys: string[] = [],
): Promise<void> {
  await deleteBlobCacheByBase(storage, baseName);
  await deleteTenantCacheByBase(storage, legacyTenantKeys, baseName);
}

export async function listTenantCache(
  storage: StorageBackend,
  tenantKeys: string[],
): Promise<{ name: string; sizeBytes: number; mtimeMs?: number }[]> {
  const seen = new Set<string>();
  const items: { name: string; sizeBytes: number; mtimeMs?: number }[] = [];

  for (const tenantKey of tenantKeys) {
    const prefix = cachePrefix(tenantKey);
    const listed = await storage.list(prefix);
    for (const obj of listed) {
      const name = obj.key.slice(prefix.length);
      if (seen.has(name)) continue;
      seen.add(name);
      items.push({
        name,
        sizeBytes: obj.sizeBytes,
        mtimeMs: obj.mtimeMs,
      });
    }
  }

  return items;
}

export async function clearTenantCache(
  storage: StorageBackend,
  tenantKeys: string[],
): Promise<number> {
  let totalBytes = 0;
  for (const tenantKey of tenantKeys) {
    const prefix = cachePrefix(tenantKey);
    const items = await storage.list(prefix);
    totalBytes += items.reduce((acc, item) => acc + item.sizeBytes, 0);
    await storage.deletePrefix(prefix);
  }
  return totalBytes;
}

/** Convenience wrapper using the singleton storage backend. */
export function storageHelpers() {
  const storage = getStorage();
  return {
    storage,
    readBlobFile: (filename: string) => readBlobFile(storage, filename),
    readBlobFileWithLegacy: (filename: string, legacyTenantKeys: string[]) =>
      readBlobFileWithLegacy(storage, filename, legacyTenantKeys),
    readTenantFile: (tenantKeys: string[], filename: string) =>
      readTenantFile(storage, tenantKeys, filename),
    readTenantCache: (tenantKeys: string[], cacheName: string) =>
      readTenantCache(storage, tenantKeys, cacheName),
    writeTenantCache: (
      tenantKey: string,
      cacheName: string,
      data: Buffer,
      contentType?: string,
    ) => writeTenantCache(storage, tenantKey, cacheName, data, contentType),
    deleteTenantCacheByBase: (tenantKeys: string[], baseName: string) =>
      deleteTenantCacheByBase(storage, tenantKeys, baseName),
    listTenantCache: (tenantKeys: string[]) =>
      listTenantCache(storage, tenantKeys),
    clearTenantCache: (tenantKeys: string[]) =>
      clearTenantCache(storage, tenantKeys),
  };
}
