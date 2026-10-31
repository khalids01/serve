import {
  createFileServer,
  FileServerError,
} from "@skycanvasstudio/serve-server";

export async function uploadAttachment(file: File) {
  const baseUrl = process.env.FILE_SERVER_URL;
  const apiKey = process.env.FILE_SERVER_API_KEY;
  if (!baseUrl || !apiKey)
    throw new Error(
      "Set FILE_SERVER_URL and FILE_SERVER_API_KEY on your backend.",
    );
  const files = createFileServer({
    baseUrl,
    apiKey,
    timeoutMs: 30_000,
  });
  const destinations = await files.storage.list();
  try {
    const asset = await files.files.upload({
      file,
      tags: ["attachment"],
      // Optional; omit to use application default, then system default.
      storageLocationId: destinations.defaultStorageLocationId,
    });
    const page = await files.files.list({
      page: 1,
      limit: 24,
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    const saved = await files.files.get(asset.id);
    const image =
      saved.kind === "image"
        ? files.images.url(saved, { width: 640, format: "webp" })
        : null;
    return { asset, page, image };
  } catch (error) {
    if (error instanceof FileServerError) {
      console.error(error.code, error.status, error.requestId);
    }
    throw error;
  }
}
