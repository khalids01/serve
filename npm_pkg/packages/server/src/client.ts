import {
  apiErrorSchema,
  browserTokenResponseSchema,
  deleteFileResponseSchema,
  type FileAsset,
  type FileKind,
  fileResponseSchema,
  type ImageTransform,
  imageUrl,
  joinUrl,
  listFilesResponseSchema,
  type Pagination,
} from "./contracts";
import { FileServerConfigurationError, FileServerError } from "./errors";

export type FileServerOptions = {
  baseUrl: string;
  apiKey: string;
  fetch?: typeof globalThis.fetch;
  timeoutMs?: number;
  headers?: Record<string, string>;
  userAgent?: string;
};

export type UploadSource = File | Blob | Uint8Array | ArrayBuffer;

export type UploadFileInput = {
  file: UploadSource;
  filename?: string;
  contentType?: string;
  tags?: string[];
  signal?: AbortSignal;
};

export type ListFilesInput = {
  page?: number;
  limit?: number;
  search?: string;
  kind?: FileKind | "all";
  contentType?: string;
  tags?: string[];
  sortBy?: "createdAt" | "updatedAt" | "name" | "size" | "type";
  sortOrder?: "asc" | "desc";
  signal?: AbortSignal;
};

export type BrowserTokenInput = {
  scopes: Array<"files:read" | "files:write" | "files:delete">;
  allowedOrigins: string[];
  expiresInSeconds?: number;
  signal?: AbortSignal;
};

type RequestOptions = {
  method?: string;
  body?: BodyInit | null;
  signal?: AbortSignal;
  headers?: HeadersInit;
};

function normalizeBaseUrl(value: string): string {
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("unsupported protocol");
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    throw new FileServerConfigurationError(
      "baseUrl must be an absolute HTTP(S) URL.",
    );
  }
}

function combineSignals(timeoutMs: number | undefined, signal?: AbortSignal) {
  if (!timeoutMs || timeoutMs <= 0) return { signal, cleanup: () => {} };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort(signal?.reason);
  if (signal?.aborted) onAbort();
  else signal?.addEventListener("abort", onAbort, { once: true });
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeout);
      signal?.removeEventListener("abort", onAbort);
    },
  };
}

function toBlob(input: UploadSource, contentType?: string): Blob {
  if (input instanceof Blob)
    return contentType && contentType !== input.type
      ? new Blob([input], { type: contentType })
      : input;
  if (input instanceof ArrayBuffer)
    return new Blob([input], { type: contentType });
  if (!(input instanceof Uint8Array))
    throw new FileServerConfigurationError(
      "file must be a File, Blob, Uint8Array, or ArrayBuffer.",
    );
  const copy = new Uint8Array(input.byteLength);
  copy.set(input);
  return new Blob([copy.buffer], { type: contentType });
}

function sourceFilename(input: UploadSource, filename?: string): string {
  if (filename) return filename;
  if (typeof File !== "undefined" && input instanceof File && input.name)
    return input.name;
  throw new FileServerConfigurationError(
    "filename is required unless file is a browser File.",
  );
}

export class FileServerClient {
  readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly fetchImpl: typeof globalThis.fetch;
  private readonly timeoutMs?: number;
  private readonly headers: Record<string, string>;

  constructor(options: FileServerOptions) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    if (!options.apiKey?.trim()) {
      throw new FileServerConfigurationError("apiKey is required.");
    }
    this.apiKey = options.apiKey.trim();
    this.fetchImpl = options.fetch ?? globalThis.fetch;
    if (!this.fetchImpl)
      throw new FileServerConfigurationError(
        "A fetch implementation is required.",
      );
    this.timeoutMs = options.timeoutMs;
    this.headers = { ...options.headers };
    if (options.userAgent) this.headers["user-agent"] = options.userAgent;
  }

  private async request(
    path: string,
    options: RequestOptions = {},
  ): Promise<Response> {
    const timeout = combineSignals(this.timeoutMs, options.signal);
    try {
      const headers = new Headers(this.headers);
      headers.set("authorization", `Bearer ${this.apiKey}`);
      for (const [key, value] of new Headers(options.headers))
        headers.set(key, value);
      const response = await this.fetchImpl(joinUrl(this.baseUrl, path), {
        method: options.method ?? "GET",
        body: options.body,
        headers,
        signal: timeout.signal,
      });
      if (response.ok) {
        // Consume the JSON response while timeout/cancellation are still active.
        const body = await response.arrayBuffer();
        return new Response(body, {
          status: response.status,
          headers: response.headers,
        });
      }
      const parsed = apiErrorSchema.safeParse(
        await response
          .clone()
          .json()
          .catch(() => null),
      );
      throw new FileServerError({
        status: response.status,
        code: parsed.success ? parsed.data.error.code : "HTTP_ERROR",
        message: parsed.success
          ? parsed.data.error.message
          : `File Server request failed with ${response.status}.`,
        details: parsed.success ? parsed.data.error.details : undefined,
        requestId:
          (parsed.success ? parsed.data.error.requestId : undefined) ??
          response.headers.get("x-request-id") ??
          undefined,
      });
    } catch (error) {
      if (error instanceof FileServerError) throw error;
      if (error instanceof FileServerConfigurationError) throw error;
      if (error instanceof DOMException && error.name === "AbortError")
        throw error;
      throw new FileServerError({
        status: 0,
        code: "NETWORK_ERROR",
        message:
          error instanceof Error ? error.message : "Network request failed.",
      });
    } finally {
      timeout.cleanup();
    }
  }

  readonly files = {
    upload: async (input: UploadFileInput): Promise<FileAsset> => {
      const filename = sourceFilename(input.file, input.filename);
      const blob = toBlob(input.file, input.contentType);
      const form = new FormData();
      form.set("file", blob, filename);
      if (input.tags?.length) form.set("tags", JSON.stringify(input.tags));
      const response = await this.request("/api/v1/files", {
        method: "POST",
        body: form,
        signal: input.signal,
      });
      return fileResponseSchema.parse(await response.json()).data;
    },
    list: async (
      input: ListFilesInput = {},
    ): Promise<{ data: FileAsset[]; pagination: Pagination }> => {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(input)) {
        if (key === "signal" || value === undefined || value === "") continue;
        if (Array.isArray(value))
          value.forEach((item) => {
            params.append(key, item);
          });
        else params.set(key, String(value));
      }
      const response = await this.request(
        `/api/v1/files${params.size ? `?${params}` : ""}`,
        { signal: input.signal },
      );
      return listFilesResponseSchema.parse(await response.json());
    },
    get: async (id: string, signal?: AbortSignal): Promise<FileAsset> => {
      const response = await this.request(
        `/api/v1/files/${encodeURIComponent(id)}`,
        { signal },
      );
      return fileResponseSchema.parse(await response.json()).data;
    },
    crop: async (id: string, input: UploadFileInput): Promise<FileAsset> => {
      const form = new FormData();
      form.set(
        "file",
        toBlob(input.file, input.contentType),
        sourceFilename(input.file, input.filename),
      );
      form.set("saveMode", "new");
      if (input.tags?.length) form.set("tags", JSON.stringify(input.tags));
      const response = await this.request(
        `/api/v1/files/${encodeURIComponent(id)}/crops`,
        { method: "POST", body: form, signal: input.signal },
      );
      return fileResponseSchema.parse(await response.json()).data;
    },
    delete: async (id: string, signal?: AbortSignal) => {
      const response = await this.request(
        `/api/v1/files/${encodeURIComponent(id)}`,
        { method: "DELETE", signal },
      );
      return deleteFileResponseSchema.parse(await response.json()).data;
    },
  };

  readonly browserTokens = {
    create: async (input: BrowserTokenInput) => {
      const response = await this.request("/api/v1/browser-tokens", {
        method: "POST",
        signal: input.signal,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scopes: input.scopes,
          allowedOrigins: input.allowedOrigins,
          expiresInSeconds: input.expiresInSeconds,
        }),
      });
      return browserTokenResponseSchema.parse(await response.json()).data;
    },
  };

  readonly images = {
    url: (asset: Pick<FileAsset, "urls">, transform?: ImageTransform) =>
      imageUrl(asset, transform),
  };
}

export function createFileServer(options: FileServerOptions): FileServerClient {
  return new FileServerClient(options);
}
