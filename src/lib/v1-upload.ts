import path from "node:path";
import sharp from "sharp";
import { maxFileSizeBytes } from "@/config";
import { uploadTagsSchema } from "@/lib/v1-contracts";
export class UploadValidationError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}
export async function parseUpload(
  request: Request,
  extraFields: string[] = [],
) {
  const declaredLength = Number(request.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > maxFileSizeBytes() + 1024 * 1024
  )
    throw new UploadValidationError(
      "FILE_TOO_LARGE",
      "The file exceeds the configured limit.",
      413,
    );
  const form = await request.formData();
  if (form.has("applicationId"))
    throw new UploadValidationError(
      "INVALID_UPLOAD",
      "Application context comes from the credential.",
    );
  for (const key of form.keys())
    if (!["file", "tags", "saveMode", ...extraFields].includes(key))
      throw new UploadValidationError(
        "INVALID_UPLOAD",
        `Unknown upload field: ${key}`,
      );
  const file = form.get("file");
  if (!(file instanceof File) || !file.size || form.getAll("file").length !== 1)
    throw new UploadValidationError(
      "INVALID_UPLOAD",
      "Exactly one non-empty file is required.",
    );
  if (file.size > maxFileSizeBytes())
    throw new UploadValidationError(
      "FILE_TOO_LARGE",
      "The file exceeds the configured limit.",
      413,
    );
  // biome-ignore lint/suspicious/noControlCharactersInRegex: Strip control characters from untrusted filenames.
  const controlCharacters = /[\x00-\x1f\x7f]/g;
  const name = file.name
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    ?.replace(controlCharacters, "")
    .slice(0, 255);
  if (!name?.trim())
    throw new UploadValidationError(
      "INVALID_UPLOAD",
      "A filename is required.",
    );
  let tags: string[];
  try {
    tags = uploadTagsSchema.parse(
      form.has("tags") ? JSON.parse(String(form.get("tags"))) : [],
    );
  } catch {
    throw new UploadValidationError(
      "INVALID_UPLOAD",
      "tags must be a JSON array of up to 20 non-empty strings, at most 64 characters each.",
    );
  }
  const contentType = file.type || "application/octet-stream";
  const buffer = Buffer.from(await file.arrayBuffer());
  await validateUploadImage(buffer, name, contentType);
  return {
    buffer,
    filename: name,
    contentType,
    tags,
    saveMode: form.get("saveMode"),
    folderId: form.get("folderId"),
    storageLocationId: form.get("storageLocationId"),
  };
}

export async function validateUploadImage(
  buffer: Buffer,
  name: string,
  contentType: string,
) {
  if (contentType.startsWith("image/") && contentType !== "image/svg+xml") {
    try {
      const metadata = await sharp(buffer, {
        limitInputPixels: 40_000_000,
      }).metadata();
      const actual =
        metadata.format === "jpeg"
          ? "image/jpeg"
          : metadata.format === "heif" && metadata.compression === "av1"
            ? "image/avif"
            : `image/${metadata.format}`;
      const extension = path.extname(name).toLowerCase();
      const extensions: Record<string, string[]> = {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
        "image/webp": [".webp"],
        "image/avif": [".avif"],
        "image/gif": [".gif"],
        "image/tiff": [".tif", ".tiff"],
      };
      if (
        extension &&
        extensions[actual] &&
        !extensions[actual].includes(extension)
      )
        throw new Error();
      if (
        actual !== contentType &&
        !(contentType === "image/jpg" && actual === "image/jpeg")
      )
        throw new Error();
      await sharp(buffer, { limitInputPixels: 40_000_000, failOn: "error" })
        .resize(1, 1)
        .toBuffer();
    } catch {
      throw new UploadValidationError(
        "FILE_TYPE_NOT_ALLOWED",
        "The image could not be decoded or its MIME type does not match its content.",
      );
    }
  }
}
