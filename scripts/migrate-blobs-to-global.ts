/**
 * One-time migration: copy image blobs from legacy per-app paths to global `_blobs/`.
 *
 * Usage: npx tsx scripts/migrate-blobs-to-global.ts
 */
import { PrismaClient } from "../prisma/generated/prisma";
import { getStorage } from "../src/lib/storage/factory";
import { blobKey, objectKey, uniqueTenantKeys } from "../src/lib/storage/keys";

const prisma = new PrismaClient();

async function migrateFilename(
  storage: ReturnType<typeof getStorage>,
  filename: string,
  legacyTenantKeys: string[],
): Promise<"copied" | "skipped" | "missing"> {
  const destination = blobKey(filename);
  if (await storage.exists(destination)) {
    return "skipped";
  }

  for (const tenantKey of legacyTenantKeys) {
    const source = objectKey(tenantKey, filename);
    const data = await storage.get(source);
    if (data) {
      await storage.put(destination, data);
      return "copied";
    }
  }

  return "missing";
}

async function main() {
  const storage = getStorage();
  const images = await prisma.image.findMany({
    include: {
      variants: true,
      applications: {
        include: {
          application: { select: { id: true, slug: true } },
        },
      },
    },
  });

  let copied = 0;
  let skipped = 0;
  let missing = 0;

  for (const image of images) {
    const legacyTenantKeys = new Set<string>();
    for (const link of image.applications) {
      for (const key of uniqueTenantKeys(
        link.application.slug,
        link.applicationId,
      )) {
        legacyTenantKeys.add(key);
      }
    }

    const keys = [...legacyTenantKeys];
    const filenames = [
      image.filename,
      ...image.variants.map((variant) => variant.filename),
    ];

    for (const filename of filenames) {
      const result = await migrateFilename(storage, filename, keys);
      if (result === "copied") copied++;
      else if (result === "skipped") skipped++;
      else missing++;
    }
  }

  console.log(
    `Migration complete. copied=${copied} skipped=${skipped} missing=${missing}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
