import { NextRequest } from "next/server";
import sharp from "sharp";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  canDeliverInline,
  directResponse,
} from "../../src/lib/storage/delivery";
import { StorageLocationError } from "../../src/lib/storage/locations";
import { PrefixedStorage } from "../../src/lib/storage/prefix";
import { S3StorageBackend } from "../../src/lib/storage/s3";

const mocks = vi.hoisted(() => ({
  storage: null as unknown,
  session: true,
  deleted: false,
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    imageApplication: {
      findUnique: async () => ({
        id: "entry",
        deletedAt: mocks.deleted ? new Date() : null,
        image: {
          id: "image",
          filename: "abc.png",
          hash: "abc",
          contentType: "image/png",
          sizeBytes: 100,
          applications: [],
          variants: [],
        },
      }),
    },
  },
}));
vi.mock("@/lib/storage/locations", async (original) => ({
  ...(await original<typeof import("../../src/lib/storage/locations")>()),
  getStorageForImage: async () => mocks.storage,
  resolveBrowseLocation: async () => ({ storage: mocks.storage }),
}));
vi.mock("@/lib/session-api", async (original) => ({
  ...(await original<typeof import("../../src/lib/session-api")>()),
  requireSession: async () => {
    if (!mocks.session) throw new StorageLocationError("Unauthorized", 401);
    return { id: "alice" };
  },
}));

import { GET as content } from "../../src/app/api/files/[id]/content/route";
import { serveImage } from "../../src/app/api/img/[name]/service";
import { GET as preview } from "../../src/app/api/storage-connections/[id]/content/route";

let backend: S3StorageBackend;
let stat: ReturnType<typeof vi.spyOn>;
let open: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  mocks.session = true;
  mocks.deleted = false;
  backend = new S3StorageBackend({
    endpoint: "https://s3.example.com",
    bucket: "private",
    region: "auto",
    forcePathStyle: true,
    accessKeyId: "test-access",
    secretAccessKey: "test-secret",
  });
  stat = vi.spyOn(backend, "stat").mockImplementation(async (key) => ({
    key,
    sizeBytes: 100,
    etag: '"source-version"',
  }));
  open = vi
    .spyOn(backend, "open")
    .mockRejectedValue(new Error("Must not proxy bytes"));
  mocks.storage = new PrefixedStorage(backend, "owners/alice/default/");
});
function signed(response: Response, expectedKey: string) {
  expect(response.status).toBe(307);
  expect(response.body).toBeNull();
  expect(response.headers.get("cache-control")).toBe("private, no-store");
  const url = new URL(response.headers.get("location") ?? "");
  expect(url.origin).toBe("https://s3.example.com");
  expect(decodeURIComponent(url.pathname)).toBe(
    `/private/owners/alice/default/${expectedKey}`,
  );
  expect(url.searchParams.get("X-Amz-Expires")).toBe("900");
  expect(url.searchParams.get("X-Amz-SignedHeaders")).toBe("host");
  expect(url.searchParams.get("X-Amz-Signature")).toMatch(/^[a-f0-9]{64}$/);
  expect(url.toString()).not.toContain("test-secret");
  expect(open).not.toHaveBeenCalled();
  return url;
}
describe("direct private S3 delivery", () => {
  it("redirects public content, originals, placeholders and cached transforms without downloading S3 bytes", async () => {
    const context = { params: Promise.resolve({ id: "entry" }) };
    signed(
      await content(
        new NextRequest("https://files.example/api/files/entry/content"),
        context,
      ),
      "_blobs/abc.png",
    );
    signed(
      await serveImage(
        new NextRequest("https://files.example/api/img/entry"),
        "entry",
      ),
      "_blobs/abc.png",
    );
    signed(
      await serveImage(
        new NextRequest("https://files.example/api/img/entry.webp-placeholder"),
        "entry.webp-placeholder",
      ),
      "_blobs/abc-placeholder.webp",
    );
    signed(
      await serveImage(
        new NextRequest("https://files.example/api/img/entry?w=320&f=webp"),
        "entry",
      ),
      "_blobs/_cache/abc_w320.webp",
    );
  });
  it("authorizes dashboard previews and signs only the namespaced requested object", async () => {
    const response = await preview(
      new Request("https://files.example/api?key=photo.png&preview=1"),
      { params: Promise.resolve({ id: "default" }) },
    );
    signed(response, "photo.png");
    stat.mockClear();
    mocks.session = false;
    const denied = await preview(
      new Request("https://files.example/api?key=photo.png&preview=1"),
      { params: Promise.resolve({ id: "default" }) },
    );
    expect(denied.status).toBe(401);
    expect(denied.headers.get("location")).toBeNull();
    expect(stat).not.toHaveBeenCalled();
  });
  it("reuses a private thumbnail and versions its key when the source changes", async () => {
    const request = () =>
      preview(
        new Request("https://files.example/api?key=photo.png&thumbnail=1"),
        { params: Promise.resolve({ id: "default" }) },
      );
    const first = await request();
    const url = new URL(first.headers.get("location") ?? "");
    expect(url.pathname).toMatch(/_cache\/thumb-v1-[a-f0-9]{64}\.webp$/);
    stat.mockImplementation(async (key: string) => ({
      key,
      sizeBytes: 100,
      etag: '"changed-version"',
    }));
    const second = await request();
    expect(new URL(second.headers.get("location") ?? "").pathname).not.toBe(
      url.pathname,
    );
    expect(open).not.toHaveBeenCalled();
  });
  it("generates an image size once, then serves the stored transform directly", async () => {
    const png = await sharp({
      create: { width: 20, height: 20, channels: 3, background: "red" },
    })
      .png()
      .toBuffer();
    const objects = new Map<string, Buffer>([
      ["owners/alice/default/_blobs/abc.png", png],
    ]);
    stat.mockImplementation(async (key: string) =>
      objects.has(key)
        ? { key, sizeBytes: objects.get(key)?.length ?? 0 }
        : null,
    );
    const read = vi
      .spyOn(backend, "get")
      .mockImplementation(async (key) => objects.get(key) ?? null);
    vi.spyOn(backend, "put").mockImplementation(async (key, data) => {
      objects.set(key, data);
    });
    const request = () =>
      serveImage(
        new NextRequest("https://files.example/api/img/entry?w=10&f=webp"),
        "entry",
      );
    signed(await request(), "_blobs/_cache/abc_w10.webp");
    expect(
      (
        await sharp(
          objects.get("owners/alice/default/_blobs/_cache/abc_w10.webp"),
        ).metadata()
      ).width,
    ).toBe(10);
    read.mockClear();
    signed(await request(), "_blobs/_cache/abc_w10.webp");
    expect(read).not.toHaveBeenCalled();
  });
  it("generates a thumbnail once and never re-downloads its source on a cache hit", async () => {
    const png = await sharp({
      create: { width: 640, height: 480, channels: 3, background: "blue" },
    })
      .png()
      .toBuffer();
    const objects = new Map<string, Buffer>([
      ["owners/alice/default/photo.png", png],
    ]);
    stat.mockImplementation(async (key: string) =>
      objects.has(key)
        ? { key, sizeBytes: objects.get(key)?.length ?? 0, etag: "version-1" }
        : null,
    );
    open.mockImplementation(async (key: string) => {
      const bytes = objects.get(key);
      return bytes
        ? {
            body: new ReadableStream({
              start(controller) {
                controller.enqueue(bytes);
                controller.close();
              },
            }),
            contentLength: bytes.length,
          }
        : null;
    });
    vi.spyOn(backend, "put").mockImplementation(async (key, data) => {
      objects.set(key, data);
    });
    const request = () =>
      preview(
        new Request("https://files.example/api?key=photo.png&thumbnail=1"),
        { params: Promise.resolve({ id: "default" }) },
      );
    const first = await request();
    expect(first.status).toBe(307);
    const cached = [...objects.entries()].find(([key]) =>
      key.includes("thumb-v1-"),
    );
    expect(cached).toBeDefined();
    expect((await sharp(cached?.[1]).metadata()).width).toBe(320);
    expect(open).toHaveBeenCalledTimes(1);
    open.mockClear();
    expect((await request()).status).toBe(307);
    expect(open).not.toHaveBeenCalled();
  });
  it("keeps previews available when a read-only S3 connection cannot write caches", async () => {
    const png = await sharp({
      create: { width: 20, height: 20, channels: 3, background: "red" },
    })
      .png()
      .toBuffer();
    stat.mockImplementation(async (key: string) =>
      key.endsWith("abc.png") || key.endsWith("photo.png")
        ? { key, sizeBytes: png.length, etag: "readonly-source" }
        : null,
    );
    vi.spyOn(backend, "get").mockImplementation(async (key) =>
      key.endsWith("abc.png") ? png : null,
    );
    open.mockImplementation(async () => ({
      body: new ReadableStream({
        start(controller) {
          controller.enqueue(png);
          controller.close();
        },
      }),
      contentLength: png.length,
    }));
    vi.spyOn(backend, "put").mockRejectedValue(new Error("AccessDenied"));
    const transformed = await serveImage(
      new NextRequest("https://files.example/api/img/entry?w=10&f=webp"),
      "entry",
    );
    expect(transformed.status).toBe(200);
    expect(transformed.headers.get("location")).toBeNull();
    expect(
      (await sharp(Buffer.from(await transformed.arrayBuffer())).metadata())
        .width,
    ).toBe(10);
    const thumbnail = await preview(
      new Request("https://files.example/api?key=photo.png&thumbnail=1"),
      { params: Promise.resolve({ id: "default" }) },
    );
    expect(thumbnail.status).toBe(200);
    expect(thumbnail.headers.get("content-type")).toBe("image/webp");
  });
  it("does not send insecure HTTP links or allow namespace traversal", async () => {
    const http = new S3StorageBackend({
      endpoint: "http://localhost:9000",
      bucket: "private",
      region: "auto",
      accessKeyId: "test",
      secretAccessKey: "secret",
    });
    expect(
      await directResponse(http, "file", { contentType: "image/png" }),
    ).toBeNull();
    expect(() =>
      (mocks.storage as PrefixedStorage).signedRead("../bob/secret", {
        contentType: "image/png",
      }),
    ).toThrow();
    expect(canDeliverInline("image/svg+xml")).toBe(false);
    expect(canDeliverInline("text/html")).toBe(false);
    expect(canDeliverInline("application/xml")).toBe(false);
    expect(canDeliverInline("image/png")).toBe(true);
  });
  it("reuses signed targets briefly while keeping their lifetime bounded", async () => {
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-10-28T12:00:00Z"));
      const first = await backend.signedRead("photo.png", {
        contentType: "image/png",
      });
      vi.setSystemTime(new Date("2026-10-28T12:00:30Z"));
      expect(
        await backend.signedRead("photo.png", { contentType: "image/png" }),
      ).toBe(first);
      vi.setSystemTime(new Date("2026-10-28T12:05:00Z"));
      expect(
        await backend.signedRead("photo.png", { contentType: "image/png" }),
      ).not.toBe(first);
    } finally {
      vi.useRealTimers();
    }
  });
  it("keeps an attachment disposition in the signed request", async () => {
    const response = await content(
      new NextRequest(
        "https://files.example/api/files/entry/content?download=1",
      ),
      { params: Promise.resolve({ id: "entry" }) },
    );
    expect(
      signed(response, "_blobs/abc.png").searchParams.get(
        "response-content-disposition",
      ),
    ).toMatch(/^attachment;/);
  });
});
