import { NextRequest } from "next/server";
import sharp from "sharp";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", async () => ({
  prisma: (await import("./support/memory-serve")).db,
}));
vi.mock("@/lib/storage/local", () => ({
  LocalStorageBackend: class {
    constructor() {
      Object.assign(this, storage);
    }
  },
}));
vi.mock("@/lib/storage/factory", async () => ({ getStorage: () => storage }));
vi.mock("@/lib/api-keys", () => ({
  ApiKeyService: {
    validateKey: async (key: string) =>
      ["sk_app_a", "sk_app_b"].includes(key)
        ? { application: { id: key === "sk_app_a" ? "app-a" : "app-b" } }
        : null,
  },
}));
vi.mock("@/config", () => ({
  config: {
    app: { url: "https://files.example" },
    storage: {
      provider: "local",
      local: { uploadDir: "/unused" },
      s3: {},
      cacheInStorage: true,
    },
    image: {
      originalMaxDim: 2560,
      placeholderWidth: 360,
      placeholderQuality: 60,
    },
  },
  maxFileSizeBytes: () => 50 * 1024 * 1024,
}));

import { serveImage } from "../../src/app/api/img/[name]/service";
import { POST as mint } from "../../src/app/api/v1/browser-tokens/route";
import { GET as capabilities } from "../../src/app/api/v1/capabilities/route";
import * as content from "../../src/app/api/v1/files/[id]/content/route";
import * as item from "../../src/app/api/v1/files/[id]/route";
import * as files from "../../src/app/api/v1/files/route";
import { BrowserFileServerClient } from "../packages/react/src/lib/client";
import { createFileServer } from "../packages/server/src";
import { createBrowserTokenHandler } from "../packages/server/src/adapters/fetch";
import { reset, storage } from "./support/memory-serve";

const origin = "https://consumer.example";
const bridge: typeof fetch = async (input, init) => {
  const request = new NextRequest(new Request(input, init));
  const path = request.nextUrl.pathname;
  if (path === "/api/v1/capabilities") return capabilities();
  if (path === "/api/v1/browser-tokens") return mint(request);
  if (path === "/api/v1/files")
    return request.method === "POST" ? files.POST(request) : files.GET(request);
  const match = /^\/api\/v1\/files\/([^/]+)(\/content)?$/.exec(path);
  if (match) {
    const context = {
      params: Promise.resolve({ id: decodeURIComponent(match[1]) }),
    };
    return match[2]
      ? content.GET(request, context)
      : request.method === "DELETE"
        ? item.DELETE(request, context)
        : item.GET(request, context);
  }
  if (path.startsWith("/api/img/"))
    return serveImage(request, path.slice("/api/img/".length));
  throw new Error(`Unexpected route ${path}`);
};
const client = (key = "sk_app_a") =>
  createFileServer({
    baseUrl: "https://files.example",
    apiKey: key,
    fetch: bridge,
  });
beforeEach(() => {
  reset();
  vi.stubEnv(
    "FILE_SERVER_BROWSER_TOKEN_SECRET",
    "integration-test-secret-with-32-characters",
  );
});
afterEach(() => vi.unstubAllEnvs());
describe("documented integration through real Serve routes", () => {
  it("executes the exact upload and connection-check snippets", async () => {
    vi.stubEnv("FILE_SERVER_URL", "https://files.example");
    vi.stubEnv("FILE_SERVER_API_KEY", "sk_app_a");
    vi.stubGlobal("fetch", bridge);
    const log = vi.spyOn(console, "log").mockImplementation(() => {});
    try {
      await import("../examples/quickstart/upload.mjs");
      await import("../examples/quickstart/check-serve.mjs");
      const result = await client().files.list();
      expect(result.data).toHaveLength(1);
      const response = await bridge(result.data[0].urls.content);
      expect(await response.text()).toBe("Hello from Serve");
      expect(
        log.mock.calls.some((args) =>
          String(args[0]).includes("Server SDK: connected"),
        ),
      ).toBe(true);
    } finally {
      log.mockRestore();
      vi.unstubAllGlobals();
    }
  });
  it("uploads/optimizes an image and serves its image, placeholder and transformed URLs", async () => {
    const png = await sharp({
      create: { width: 32, height: 24, channels: 3, background: "blue" },
    })
      .png()
      .toBuffer();
    const asset = await client().files.upload({
      file: new Uint8Array(png),
      filename: "photo.png",
      contentType: "image/png",
    });
    expect(asset.kind).toBe("image");
    const download = await bridge(`${asset.urls.content}?download=1`);
    expect(download.headers.get("content-disposition")).toContain(
      'filename="photo.png"',
    );
    expect(asset.urls.placeholder).toBeTruthy();
    for (const url of [
      asset.urls.image,
      asset.urls.placeholder,
      client().images.url(asset, { width: 16, format: "avif" }),
    ]) {
      const response = await bridge(String(url));
      expect(response.status).toBe(200);
      expect((await response.arrayBuffer()).byteLength).toBeGreaterThan(0);
    }
  });
  it("deduplicates across applications and preserves B after A deletes its link", async () => {
    const input = {
      file: new Blob(["shared"], { type: "text/plain" }),
      filename: "shared.txt",
    };
    const a = await client().files.upload(input),
      b = await client("sk_app_b").files.upload(input);
    expect(a.id).not.toBe(b.id);
    expect((await client().files.delete(a.id)).storageDeleted).toBe(false);
    await expect(client().files.get(a.id)).rejects.toHaveProperty(
      "status",
      404,
    );
    expect((await client("sk_app_b").files.list()).data).toHaveLength(1);
    expect(await (await bridge(b.urls.content)).text()).toBe("shared");
    expect((await client("sk_app_b").files.delete(b.id)).storageDeleted).toBe(
      true,
    );
    expect((await bridge(b.urls.content)).status).toBe(404);
  });
  it("mints through the consumer's authenticated route then lists and deletes in the browser", async () => {
    const asset = await client().files.upload({
      file: new Blob(["browser"]),
      filename: "note.txt",
    });
    const handler = createBrowserTokenHandler({
      client: client(),
      authorize: async (request) =>
        request.headers.get("cookie") === "session=valid",
      scopes: ["files:read", "files:delete"],
      allowedOrigins: [origin],
    });
    const response = await handler(
      new Request(`${origin}/api/file-server/token`, {
        method: "POST",
        headers: { origin, cookie: "session=valid" },
      }),
    );
    const token = (await response.json()).data.token;
    const browserFetch: typeof fetch = async (input, init) => {
      const headers = new Headers(init?.headers);
      headers.set("origin", origin);
      const response = await bridge(input, { ...init, headers });
      expect(response.headers.get("access-control-allow-origin")).toBe(origin);
      return response;
    };
    const browser = new BrowserFileServerClient(
      "https://files.example",
      async () => token,
      browserFetch,
    );
    expect((await browser.list()).data[0].id).toBe(asset.id);
    await browser.remove(asset.id);
    expect((await browser.list()).data).toEqual([]);
    expect(
      (
        await handler(
          new Request(`${origin}/api/file-server/token`, { method: "POST" }),
        )
      ).status,
    ).toBe(401);
  });
  it("reports missing host token configuration clearly", async () => {
    vi.stubEnv("FILE_SERVER_BROWSER_TOKEN_SECRET", "");
    expect(
      (await (await capabilities()).json()).data.browserTokens.enabled,
    ).toBe(false);
    await expect(
      client().browserTokens.create({
        scopes: ["files:read"],
        allowedOrigins: [origin],
      }),
    ).rejects.toMatchObject({
      code: "BROWSER_TOKENS_NOT_CONFIGURED",
      status: 503,
    });
  });
});
