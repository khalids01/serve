import {
  apiErrorSchema,
  deleteFileResponseSchema,
  type FileAsset,
  type FileKind,
  fileResponseSchema,
  type ImageTransform,
  imageUrl,
  joinUrl,
  listFilesResponseSchema,
} from "../contracts";

export type BrowserToken = { token: string; expiresAt: string };
export type TokenProvider = () => Promise<BrowserToken>;

export class BrowserFileServerError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "BrowserFileServerError";
  }
}

export type ListInput = {
  page?: number;
  limit?: number;
  search?: string;
  kind?: FileKind | "all";
  contentType?: string;
  tags?: string[];
  sortBy?: "createdAt" | "updatedAt" | "name" | "size" | "type";
  sortOrder?: "asc" | "desc";
};

export class BrowserFileServerClient {
  constructor(
    readonly baseUrl: string,
    private readonly getToken: (forceRefresh?: boolean) => Promise<string>,
    private readonly fetchImpl: typeof fetch,
  ) {
    const url = new URL(baseUrl);
    if (!["http:", "https:"].includes(url.protocol))
      throw new Error("baseUrl must be an HTTP(S) URL.");
  }

  private async request(
    path: string,
    init: RequestInit = {},
    retry = true,
  ): Promise<Response> {
    const headers = new Headers(init.headers);
    headers.set("authorization", `Bearer ${await this.getToken(!retry)}`);
    const response = await this.fetchImpl(joinUrl(this.baseUrl, path), {
      ...init,
      headers,
    });
    if (response.ok) return response;
    const body = apiErrorSchema.safeParse(
      await response
        .clone()
        .json()
        .catch(() => null),
    );
    if (
      retry &&
      response.status === 401 &&
      body.success &&
      body.data.error.code === "TOKEN_EXPIRED"
    ) {
      return this.request(path, init, false);
    }
    throw new BrowserFileServerError(
      response.status,
      body.success ? body.data.error.code : "HTTP_ERROR",
      body.success
        ? body.data.error.message
        : `File Server request failed with ${response.status}.`,
      body.success ? body.data.error.details : undefined,
    );
  }

  async list(input: ListInput = {}, signal?: AbortSignal) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(input)) {
      if (value === undefined || value === "") continue;
      if (Array.isArray(value))
        value.forEach((item) => {
          params.append(key, item);
        });
      else params.set(key, String(value));
    }
    const response = await this.request(
      `/api/v1/files${params.size ? `?${params}` : ""}`,
      { signal },
    );
    return listFilesResponseSchema.parse(await response.json());
  }

  async get(id: string): Promise<FileAsset> {
    const response = await this.request(
      `/api/v1/files/${encodeURIComponent(id)}`,
    );
    return fileResponseSchema.parse(await response.json()).data;
  }

  async remove(id: string) {
    const response = await this.request(
      `/api/v1/files/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    return deleteFileResponseSchema.parse(await response.json()).data;
  }

  imageUrl(asset: Pick<FileAsset, "urls">, transform?: ImageTransform) {
    return imageUrl(asset, transform);
  }
}
