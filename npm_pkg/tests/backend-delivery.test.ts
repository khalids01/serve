import { NextRequest } from "next/server";
import sharp from "sharp";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  find: vi.fn(),
  read: vi.fn(),
  cache: vi.fn(),
  writeCache: vi.fn(),
  open: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    imageApplication: { findUnique: async () => null },
    image: { findUnique: mocks.find },
  },
}));
vi.mock("@/lib/storage/factory", () => ({ getStorage: () => ({}) }));
vi.mock("@/lib/storage/read", () => ({
  readBlobFileWithLegacy: mocks.read,
  readBlobCacheWithLegacy: mocks.cache,
  writeBlobCache: mocks.writeCache,
  openBlobFileWithLegacy: mocks.open,
}));

import { serveImage } from "../../src/app/api/img/[name]/service";
import { GET, HEAD } from "../../src/app/api/v1/files/[id]/content/route";

const file = {
  id: "file",
  hash: "hash",
  filename: "hash.png",
  contentType: "image/png",
  sizeBytes: 10,
  applications: [],
  variants: [],
};
beforeEach(() => {
  vi.clearAllMocks();
  mocks.find.mockResolvedValue(file);
  mocks.cache.mockResolvedValue(null);
  mocks.writeCache.mockResolvedValue(undefined);
});
describe("public delivery", () => {
  it("converts an image to AVIF even without a pre-generated variant", async () => {
    const png = await sharp({
      create: { width: 2, height: 2, channels: 3, background: "red" },
    })
      .png()
      .toBuffer();
    mocks.read.mockImplementation(async (_storage, filename) =>
      filename === "hash.png" ? png : null,
    );
    const response = await serveImage(
      new NextRequest("https://files.example/api/img/file?f=avif"),
      "file",
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/avif");
    const metadata = await sharp(
      Buffer.from(await response.arrayBuffer()),
    ).metadata();
    expect(metadata.format).toBe("heif");
    expect(mocks.writeCache).toHaveBeenCalled();
  });
  it("streams bounded ranges and returns metadata for HEAD", async () => {
    mocks.open.mockResolvedValue({
      body: new Uint8Array([1, 2, 3]),
      contentLength: 3,
    });
    const context = { params: Promise.resolve({ id: "file" }) };
    const response = await GET(
      new NextRequest("https://files.example/api/v1/files/file/content", {
        headers: { range: "bytes=2-4" },
      }),
      context,
    );
    expect(response.status).toBe(206);
    expect(response.headers.get("content-range")).toBe("bytes 2-4/10");
    expect(response.headers.get("content-security-policy")).toContain(
      "sandbox",
    );
    expect(mocks.open.mock.calls[0][3]).toEqual({ start: 2, end: 4 });
    const head = await HEAD(
      new NextRequest("https://files.example/api/v1/files/file/content", {
        method: "HEAD",
      }),
      context,
    );
    expect(head.headers.get("content-length")).toBe("10");
    expect(await head.text()).toBe("");
  });
  it("sandboxes active content while allowing the native PDF viewer", async () => {
    const context = { params: Promise.resolve({ id: "file" }) };
    mocks.find.mockResolvedValue({ ...file, contentType: "text/html" });
    const html = await HEAD(
      new NextRequest("https://files.example/api/v1/files/file/content", {
        method: "HEAD",
      }),
      context,
    );
    expect(html.headers.get("content-security-policy")).toContain("sandbox");
    mocks.find.mockResolvedValue({ ...file, contentType: "application/pdf" });
    const pdf = await HEAD(
      new NextRequest("https://files.example/api/v1/files/file/content", {
        method: "HEAD",
      }),
      context,
    );
    expect(pdf.headers.get("content-security-policy")).toContain(
      "object-src 'self'",
    );
    expect(pdf.headers.get("content-security-policy")).not.toContain("sandbox");
    expect(pdf.headers.get("x-content-type-options")).toBe("nosniff");
  });
  it("rejects invalid ranges before opening storage and normalizes not-found errors", async () => {
    const context = { params: Promise.resolve({ id: "file" }) };
    const response = await GET(
      new NextRequest("https://files.example/api/v1/files/file/content", {
        headers: { range: "bytes=50-60" },
      }),
      context,
    );
    expect(response.status).toBe(416);
    expect(mocks.open).not.toHaveBeenCalled();
    mocks.find.mockResolvedValue(null);
    expect(
      await (
        await GET(
          new NextRequest("https://files.example/api/v1/files/file/content"),
          context,
        )
      ).json(),
    ).toMatchObject({ error: { code: "FILE_NOT_FOUND" } });
  });
});
