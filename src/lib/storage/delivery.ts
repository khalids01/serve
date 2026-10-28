import type { SignedReadOptions, StorageBackend } from "./backend";
import { blobKey, objectKey } from "./keys";

/** Authorize the object before calling. Redirects must never outlive their signed target. */
export async function directResponse(
  storage: StorageBackend,
  key: string,
  options: SignedReadOptions,
): Promise<Response | null> {
  const url = await storage.signedRead?.(key, options);
  if (!url) return null;
  return new Response(null, {
    status: 307,
    headers: {
      Location: url,
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function directBlobResponse(
  storage: StorageBackend,
  filename: string,
  legacyTenantKeys: string[],
  options: SignedReadOptions,
) {
  if (
    !storage.signedRead ||
    (!canDeliverInline(options.contentType) &&
      !options.disposition?.startsWith("attachment"))
  )
    return null;
  // HEAD only: never download file bytes to find legacy storage keys.
  for (const key of [
    blobKey(filename),
    ...legacyTenantKeys.map((tenant) => objectKey(tenant, filename)),
  ]) {
    if (await storage.stat(key)) return directResponse(storage, key, options);
  }
  return null;
}

/** Active documents require Serve's sandbox headers, which S3 cannot supply. */
export function canDeliverInline(contentType: string) {
  return /^(image\/(jpeg|png|webp|avif|gif|bmp|x-icon)|video\/[a-z0-9.+-]+|audio\/[a-z0-9.+-]+|application\/pdf)$/i.test(
    contentType,
  );
}
