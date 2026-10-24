import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  linked: vi.fn(),
  count: vi.fn(),
  unlink: vi.fn(),
  deleteImage: vi.fn(),
  deleteBlob: vi.fn(),
  deleteObject: vi.fn(),
  lock: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    application: { findUniqueOrThrow: async () => ({ ownerId: "owner" }) },
    imageApplication: { findFirst: mocks.linked, findUnique: mocks.linked },
  },
}));
vi.mock("@/lib/blob-lock", () => ({
  withBlobLock: async (
    hash: string,
    work: (tx: unknown) => Promise<unknown>,
  ) => {
    mocks.lock(hash);
    return work({
      imageApplication: {
        findUnique: mocks.linked,
        delete: mocks.unlink,
        count: mocks.count,
      },
      image: { delete: mocks.deleteImage },
    });
  },
}));
vi.mock("@/lib/api-keys", () => ({
  ApiKeyService: {
    validateKey: async () => ({ application: { id: "app-a" } }),
  },
}));
vi.mock("@/lib/file-storage", () => ({
  FileStorageService: class {
    deleteBlobFile = mocks.deleteBlob;
  },
}));
vi.mock("@/lib/storage/factory", () => ({
  getStorage: () => ({ delete: mocks.deleteObject }),
}));
vi.mock("@/lib/storage/read", () => ({
  deleteBlobAndLegacyCacheByBase: vi.fn(),
}));

import { DELETE } from "../../src/app/api/v1/files/[id]/route";
import { listQuery, serializeFile } from "../../src/lib/v1-files";

const image = {
  id: "file",
  filename: "hash.png",
  hash: "hash",
  ownerId: "owner",
  storageLocationId: "system",
  storageConfig: null,
  contentType: "image/png",
  sizeBytes: 10,
  width: 10,
  height: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
  variants: [
    {
      id: "v",
      imageId: "file",
      createdAt: new Date(),
      label: "placeholder-webp",
      filename: "hash-placeholder.webp",
      width: 3,
      height: 3,
      sizeBytes: 2,
    },
  ],
  applications: [
    {
      applicationId: "app-a",
      application: { id: "app-a", slug: "a", name: "a" },
    },
  ],
};
const link = {
  id: "link",
  imageId: "file",
  applicationId: "app-a",
  originalName: "file.png",
  tags: ["one"],
  folderId: null,
  deletedAt: null,
  trashBatchId: null,
  starred: false,
  linkedAt: new Date(),
  updatedAt: new Date(),
  image,
};
const request = () =>
  new NextRequest("https://files.example/api/v1/files/file", {
    method: "DELETE",
    headers: { authorization: "Bearer sk_test" },
  });
beforeEach(() => {
  vi.clearAllMocks();
  mocks.linked.mockResolvedValue(link);
  mocks.unlink.mockResolvedValue({});
  mocks.deleteBlob.mockResolvedValue(undefined);
});
describe("scoped files", () => {
  it("unlinks A without deleting B's shared blob", async () => {
    mocks.count.mockResolvedValue(1);
    const response = await DELETE(request(), {
      params: Promise.resolve({ id: "file" }),
    });
    expect(await response.json()).toMatchObject({
      data: { storageDeleted: false, unlinked: true },
    });
    expect(mocks.unlink).toHaveBeenCalledWith({
      where: {
        id: "link",
      },
    });
    expect(mocks.deleteBlob).not.toHaveBeenCalled();
    expect(mocks.deleteImage).not.toHaveBeenCalled();
    expect(mocks.lock).toHaveBeenCalledWith("system:hash");
    expect(mocks.unlink.mock.invocationCallOrder[0]).toBeLessThan(
      mocks.count.mock.invocationCallOrder[0],
    );
  });
  it("deletes storage only after the last link is removed", async () => {
    mocks.count.mockResolvedValue(0);
    const response = await DELETE(request(), {
      params: Promise.resolve({ id: "file" }),
    });
    expect(await response.json()).toMatchObject({
      data: { storageDeleted: true },
    });
    expect(mocks.deleteBlob).toHaveBeenCalledWith("hash.png");
    expect(mocks.deleteImage).toHaveBeenCalledWith({ where: { id: "file" } });
  });
  it("rechecks ownership after acquiring the lock", async () => {
    mocks.linked.mockResolvedValueOnce(link).mockResolvedValueOnce(null);
    expect(
      (await DELETE(request(), { params: Promise.resolve({ id: "file" }) }))
        .status,
    ).toBe(404);
    expect(mocks.deleteBlob).not.toHaveBeenCalled();
  });
  it("serializes actual placeholder/variant URLs and omits internal fields", () => {
    const result = serializeFile(link);
    expect(result.urls.placeholder).toContain("/link-placeholder.webp");
    expect(result.variants[0].contentType).toBe("image/webp");
    expect(result).not.toHaveProperty("hash");
    expect(result).not.toHaveProperty("applications");
  });
  it("applies filters and sorting within the credential application", () => {
    const query = listQuery(
      new URLSearchParams(
        "kind=image&tags=one&sortBy=size&sortOrder=asc&page=2",
      ),
      "app-a",
    );
    expect(query.where.AND).toContainEqual({ applicationId: "app-a" });
    expect(query.where.AND).toContainEqual({
      tags: { array_contains: ["one"] },
    });
    expect(query.orderBy[0]).toEqual({ image: { sizeBytes: "asc" } });
    expect(() =>
      listQuery(new URLSearchParams("applicationId=other"), "app-a"),
    ).toThrow();
  });
});
