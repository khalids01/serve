import { prisma } from "@/lib/prisma";
import type { StorageBackend } from "./backend";
import { uniqueTenantKeys, blobCachePrefix } from "./keys";
import { listTenantCache, clearTenantCache } from "./read";

export type CacheItem = {
  name: string;
  sizeBytes: number;
  mtimeMs?: number;
};

export function cacheNameMatchesHash(cacheName: string, hash: string): boolean {
  return cacheName.startsWith(`${hash}_`) || cacheName.startsWith(`${hash}.`);
}

export function filterCacheItemsByHashes(
  items: CacheItem[],
  hashes: Set<string>,
): CacheItem[] {
  if (hashes.size === 0) return [];
  return items.filter((item) =>
    [...hashes].some((hash) => cacheNameMatchesHash(item.name, hash)),
  );
}

export async function listBlobCache(
  storage: StorageBackend,
): Promise<CacheItem[]> {
  const prefix = blobCachePrefix();
  const listed = await storage.list(prefix);
  return listed.map((obj) => ({
    name: obj.key.slice(prefix.length),
    sizeBytes: obj.sizeBytes,
    mtimeMs: obj.mtimeMs,
  }));
}

export async function clearBlobCacheForHashes(
  storage: StorageBackend,
  hashes: Set<string>,
): Promise<number> {
  if (hashes.size === 0) return 0;
  const prefix = blobCachePrefix();
  const listed = await storage.list(prefix);
  let totalBytes = 0;
  const toDelete = listed.filter((obj) => {
    const name = obj.key.slice(prefix.length);
    return [...hashes].some((hash) => cacheNameMatchesHash(name, hash));
  });

  await Promise.all(
    toDelete.map(async (obj) => {
      totalBytes += obj.sizeBytes;
      await storage.delete(obj.key);
    }),
  );

  return totalBytes;
}

export async function getApplicationImageHashes(
  applicationId: string,
): Promise<Set<string>> {
  const links = await prisma.imageApplication.findMany({
    where: { applicationId },
    select: { image: { select: { hash: true } } },
  });
  return new Set(links.map((link) => link.image.hash));
}

export async function getHashesByApplicationForUser(
  userId: string,
): Promise<Map<string, Set<string>>> {
  const links = await prisma.imageApplication.findMany({
    where: { application: { ownerId: userId } },
    select: {
      applicationId: true,
      image: { select: { hash: true } },
    },
  });

  const map = new Map<string, Set<string>>();
  for (const link of links) {
    let hashes = map.get(link.applicationId);
    if (!hashes) {
      hashes = new Set();
      map.set(link.applicationId, hashes);
    }
    hashes.add(link.image.hash);
  }
  return map;
}

export function summarizeCacheItems(items: CacheItem[]) {
  return {
    items,
    fileCount: items.length,
    totalBytes: items.reduce((acc, item) => acc + (item.sizeBytes || 0), 0),
  };
}

export async function listApplicationCache(
  storage: StorageBackend,
  tenantKeys: string[],
  hashes: Set<string>,
) {
  const tenantItems = await listTenantCache(storage, tenantKeys);
  const blobItems = filterCacheItemsByHashes(
    await listBlobCache(storage),
    hashes,
  );
  return summarizeCacheItems([...tenantItems, ...blobItems]);
}

export async function clearApplicationCache(
  storage: StorageBackend,
  tenantKeys: string[],
  hashes: Set<string>,
): Promise<number> {
  const tenantBytes = await clearTenantCache(storage, tenantKeys);
  const blobBytes = await clearBlobCacheForHashes(storage, hashes);
  return tenantBytes + blobBytes;
}

export async function listUserCacheOverview(
  storage: StorageBackend,
  applications: { id: string; name: string; slug: string }[],
  hashesByApp: Map<string, Set<string>>,
) {
  const blobItems = await listBlobCache(storage);

  let globalTenantBytes = 0;
  let globalTenantFileCount = 0;
  const applicationStats = [];

  for (const app of applications) {
    const tenantKeys = uniqueTenantKeys(app.slug, app.id);
    const hashes = hashesByApp.get(app.id) ?? new Set<string>();
    const tenantItems = await listTenantCache(storage, tenantKeys);
    const appBlobItems = filterCacheItemsByHashes(blobItems, hashes);
    const items = [...tenantItems, ...appBlobItems];

    globalTenantBytes += tenantItems.reduce(
      (acc, item) => acc + item.sizeBytes,
      0,
    );
    globalTenantFileCount += tenantItems.length;

    applicationStats.push({
      id: app.id,
      name: app.name,
      slug: app.slug,
      fileCount: items.length,
      totalBytes: items.reduce((acc, item) => acc + item.sizeBytes, 0),
    });
  }

  const allHashes = new Set<string>();
  for (const hashes of hashesByApp.values()) {
    for (const hash of hashes) allHashes.add(hash);
  }
  const userBlobItems = filterCacheItemsByHashes(blobItems, allHashes);
  const blobBytes = userBlobItems.reduce((acc, item) => acc + item.sizeBytes, 0);

  return {
    fileCount: globalTenantFileCount + userBlobItems.length,
    totalBytes: globalTenantBytes + blobBytes,
    applications: applicationStats,
  };
}

export async function clearAllUserCache(
  storage: StorageBackend,
  applications: { id: string; slug: string }[],
  hashesByApp: Map<string, Set<string>>,
): Promise<number> {
  let clearedBytes = 0;

  for (const app of applications) {
    const tenantKeys = uniqueTenantKeys(app.slug, app.id);
    const hashes = hashesByApp.get(app.id) ?? new Set<string>();
    clearedBytes += await clearApplicationCache(storage, tenantKeys, hashes);
  }

  return clearedBytes;
}
