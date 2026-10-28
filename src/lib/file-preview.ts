export type PreviewKind = "image" | "text" | "video" | "audio" | "pdf";
const types: Record<string, [PreviewKind, string]> = {
  png: ["image", "image/png"],
  jpg: ["image", "image/jpeg"],
  jpeg: ["image", "image/jpeg"],
  gif: ["image", "image/gif"],
  webp: ["image", "image/webp"],
  avif: ["image", "image/avif"],
  bmp: ["image", "image/bmp"],
  ico: ["image", "image/x-icon"],
  mp4: ["video", "video/mp4"],
  m4v: ["video", "video/mp4"],
  webm: ["video", "video/webm"],
  ogv: ["video", "video/ogg"],
  mov: ["video", "video/quicktime"],
  mkv: ["video", "video/x-matroska"],
  mp3: ["audio", "audio/mpeg"],
  m4a: ["audio", "audio/mp4"],
  wav: ["audio", "audio/wav"],
  ogg: ["audio", "audio/ogg"],
  oga: ["audio", "audio/ogg"],
  opus: ["audio", "audio/ogg"],
  flac: ["audio", "audio/flac"],
  aac: ["audio", "audio/aac"],
  pdf: ["pdf", "application/pdf"],
};
const textExtensions = new Set([
  "txt",
  "md",
  "json",
  "csv",
  "log",
  "yaml",
  "yml",
  "xml",
  "html",
  "htm",
  "css",
  "js",
  "ts",
  "tsx",
  "jsx",
  "sql",
  "ini",
  "toml",
  "sh",
  "py",
  "rs",
  "go",
  "c",
  "h",
  "cpp",
  "java",
  "rb",
  "php",
  "rtf",
]);
export function filePreview(
  key: string,
): { kind: PreviewKind; contentType: string } | undefined {
  const ext = key.split(".").at(-1)?.toLowerCase() ?? "";
  if (textExtensions.has(ext))
    return { kind: "text", contentType: "text/plain; charset=utf-8" };
  const type = Object.hasOwn(types, ext) ? types[ext] : undefined;
  return type ? { kind: type[0], contentType: type[1] } : undefined;
}
export function importContentType(key: string) {
  return (
    filePreview(key)?.contentType.split(";")[0] ?? "application/octet-stream"
  );
}
