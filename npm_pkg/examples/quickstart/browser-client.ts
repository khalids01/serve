import {
  BrowserFileServerError,
  createBrowserClient,
  createTokenProvider,
  imageUrl,
} from "@skycanvasstudio/serve-client";

// Public Serve origin only. This module belongs in your browser bundle.
export function createFileBrowser(baseUrl: string) {
  return createBrowserClient({
    baseUrl,
    tokenProvider: createTokenProvider("/api/file-server/token"),
  });
}

export async function uploadFromBrowser(
  client: ReturnType<typeof createFileBrowser>,
  file: File,
) {
  const locations = await client.storageLocations();
  try {
    const asset = await client.upload(file, {
      storageLocationId: locations.defaultStorageLocationId,
      tags: ["attachment"],
    });
    // Persist asset.id; render asset.urls.content for ordinary media/downloads.
    const firstPage = await client.list({ page: 1, limit: 24 });
    const saved = await client.get(asset.id);
    const image =
      saved.kind === "image" ? imageUrl(saved, { width: 640 }) : null;
    return { asset, firstPage, image };
  } catch (error) {
    if (error instanceof BrowserFileServerError) {
      console.error(error.code, error.status, error.message);
    }
    throw error;
  }
}
