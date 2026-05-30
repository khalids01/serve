import type { StorageBackend } from "./backend";
import {
  objectKey,
  cacheKey,
  cachePrefix,
  uniqueTenantKeys,
} from "./keys";
import { getStorage } from "./factory";

export { uniqueTenantKeys };

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
    readTenantFile: (
      tenantKeys: string[],
      filename: string,
    ) => readTenantFile(storage, tenantKeys, filename),
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
