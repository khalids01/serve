export const FILE_KINDS = [
  "all",
  "image",
  "video",
  "audio",
  "document",
  "archive",
  "other",
] as const;

export type FileKind = (typeof FILE_KINDS)[number];

export const FILE_KIND_LABELS: Record<FileKind, string> = {
  all: "All files",
  image: "Images",
  video: "Videos",
  audio: "Audio",
  document: "Documents",
  archive: "Archives",
  other: "Other",
};

const DOCUMENT_MIME_PARTS = [
  "pdf",
  "text/",
  "json",
  "xml",
  "word",
  "document",
  "sheet",
  "excel",
  "presentation",
  "powerpoint",
];

const ARCHIVE_MIME_PARTS = [
  "zip",
  "rar",
  "7z",
  "tar",
  "gzip",
  "bzip",
  "compressed",
];

export function getFileKind(contentType: string): Exclude<FileKind, "all"> {
  const mime = contentType.toLowerCase();
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  if (DOCUMENT_MIME_PARTS.some((part) => mime.includes(part))) {
    return "document";
  }
  if (ARCHIVE_MIME_PARTS.some((part) => mime.includes(part))) {
    return "archive";
  }
  return "other";
}

export function getFileExtension(filename: string): string {
  const extension = filename.split(".").pop();
  return extension && extension !== filename ? extension.toUpperCase() : "FILE";
}

export function toFileContentUrl(id: string): string {
  return `/api/files/${encodeURIComponent(id)}/content`;
}

export function filterFiles<
  T extends {
    originalName: string;
    filename: string;
    contentType: string;
  },
>(files: T[], search: string, kind: FileKind): T[] {
  const normalizedSearch = search.trim().toLowerCase();
  return files.filter((file) => {
    if (kind !== "all" && getFileKind(file.contentType) !== kind) return false;
    if (!normalizedSearch) return true;
    return [file.originalName, file.filename, file.contentType].some((value) =>
      value.toLowerCase().includes(normalizedSearch),
    );
  });
}
