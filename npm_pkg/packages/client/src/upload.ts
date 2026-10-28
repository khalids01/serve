import { type FileAsset, fileResponseSchema } from "./contracts";

export type UploadTransport = (
  url: string,
  file: File,
  tags: string[] | undefined,
  token: string,
  signal: AbortSignal,
  progress: (value: number) => void,
) => Promise<FileAsset>;
export class UploadError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
  }
}
export const uploadWithProgress: UploadTransport = (
  url,
  file,
  tags,
  token,
  signal,
  progress,
) =>
  new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Upload cancelled.", "AbortError"));
      return;
    }
    const xhr = new XMLHttpRequest();
    const abort = () => xhr.abort();
    const cleanup = () => signal.removeEventListener("abort", abort);
    xhr.open("POST", url);
    xhr.setRequestHeader("authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable)
        progress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      cleanup();
      try {
        const body = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300)
          resolve(fileResponseSchema.parse(body).data);
        else
          reject(
            new UploadError(
              body?.error?.code ?? "HTTP_ERROR",
              body?.error?.message ?? "Upload failed.",
            ),
          );
      } catch (cause) {
        reject(cause);
      }
    };
    xhr.onerror = () => {
      cleanup();
      reject(new Error("Upload failed."));
    };
    xhr.onabort = () => {
      cleanup();
      reject(new DOMException("Upload cancelled.", "AbortError"));
    };
    signal.addEventListener("abort", abort, { once: true });
    const form = new FormData();
    form.set("file", file);
    if (tags?.length) form.set("tags", JSON.stringify(tags));
    xhr.send(form);
  });
