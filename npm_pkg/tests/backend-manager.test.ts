import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  folders: [] as {
    id: string;
    parentId: string | null;
    deletedAt: Date | null;
    trashBatchId: string | null;
  }[],
  files: [] as Record<string, unknown>[],
  targetData: Buffer.from("content"),
  sourceData: Buffer.from("content"),
  update: vi.fn(),
  create: vi.fn(),
  folderUpdate: vi.fn(),
  imageDelete: vi.fn(),
  write: vi.fn(),
  findTarget: vi.fn(),
  access: vi.fn(),
  folderFind: vi.fn(),
}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    storageJob: { count: async () => 0 },
    folder: {
      findMany: async () => mocks.folders,
      findFirst: mocks.folderFind,
      update: mocks.folderUpdate,
    },
    imageApplication: {
      findMany: async () => mocks.files,
      updateMany: mocks.update,
      create: mocks.create,
    },
    image: {
      findMany: async () => [],
      findUnique: mocks.findTarget,
      create: vi.fn(async () => ({ id: "target-image" })),
      deleteMany: mocks.imageDelete,
    },
    $transaction: async (work: unknown) =>
      typeof work === "function"
        ? work((await import("@/lib/prisma")).prisma)
        : Promise.all(work as Promise<unknown>[]),
  },
}));
vi.mock("@/lib/blob-lock", () => ({
  withBlobLock: async (_key: string, work: (tx: unknown) => Promise<unknown>) =>
    work((await import("@/lib/prisma")).prisma),
}));
vi.mock("@/lib/storage/locations", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("../../src/lib/storage/locations")>();
  return {
    ...original,
    withOwnerStorageLock: async (
      _owner: string,
      work: () => Promise<unknown>,
    ) => work(),
    assertLocationAccess: mocks.access,
    resolveUploadLocation: async () => ({
      id: "target",
      ownerId: "owner",
      snapshot: undefined,
      storage: {
        stat: async () =>
          (await mocks.findTarget.mock.results.at(-1)?.value)
            ? { sizeBytes: mocks.targetData.length }
            : null,
        open: async () => ({
          body: new Blob([mocks.targetData]).stream(),
          contentLength: mocks.targetData.length,
        }),
        createFile: async (_key: string, body: ReadableStream) => {
          const bytes = Buffer.from(await new Response(body).arrayBuffer());
          await mocks.write(_key, bytes, { contentType: "text/plain" });
        },
      },
    }),
    getStorageForImage: async () => ({
      stat: async () => ({ contentLength: mocks.sourceData.length }),
      open: async () => ({
        body: new Blob([mocks.sourceData]).stream(),
        contentLength: mocks.sourceData.length,
      }),
    }),
  };
});

import {
  descendants,
  managerOperation,
  safeName,
} from "../../src/lib/file-manager";

const entry = () => ({
  id: "entry",
  imageId: "source-image",
  applicationId: "app",
  originalName: "note.txt",
  folderId: null,
  deletedAt: null,
  updatedAt: new Date(),
  tags: [],
  image: {
    id: "source-image",
    hash: "hash",
    storageLocationId: "source",
    filename: "hash.txt",
    contentType: "text/plain",
    sizeBytes: 7,
    width: null,
    height: null,
    variants: [],
    applications: [],
  },
});
beforeEach(() => {
  vi.clearAllMocks();
  mocks.files = [entry()];
  mocks.folders = [];
  mocks.targetData = Buffer.from("content");
  mocks.sourceData = Buffer.from("content");
  mocks.update.mockResolvedValue({ count: 1 });
  mocks.folderFind.mockResolvedValue(null);
  mocks.findTarget.mockResolvedValue(null);
});
describe("file-manager mutations", () => {
  it("moves a verified blob while retaining the public entry ID", async () => {
    await managerOperation("app", "owner", {
      action: "move",
      fileIds: ["entry"],
      storageLocationId: "target",
    });
    expect(mocks.write).toHaveBeenCalledWith(
      "_blobs/hash.txt",
      Buffer.from("content"),
      { contentType: "text/plain" },
    );
    expect(mocks.update).toHaveBeenCalledWith({
      where: expect.objectContaining({ id: "entry", imageId: "source-image" }),
      data: { imageId: "target-image", folderId: null },
    });
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("retains the source reference when verification fails", async () => {
    mocks.targetData = Buffer.from("corrupt");
    await expect(
      managerOperation("app", "owner", {
        action: "move",
        fileIds: ["entry"],
        storageLocationId: "target",
      }),
    ).rejects.toThrow(/verification|different file/);
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.imageDelete).not.toHaveBeenCalled();
  });
  it("also verifies an existing deduplicated destination before changing the reference", async () => {
    mocks.findTarget.mockResolvedValue({ id: "existing" });
    mocks.targetData = Buffer.from("corrupt");
    await expect(
      managerOperation("app", "owner", {
        action: "move",
        fileIds: ["entry"],
        storageLocationId: "target",
      }),
    ).rejects.toThrow(/verification|different file/);
    expect(mocks.update).not.toHaveBeenCalled();
    expect(mocks.write).not.toHaveBeenCalled();
  });
  it("copies to a new entry without altering its source", async () => {
    await managerOperation("app", "owner", {
      action: "copy",
      fileIds: ["entry"],
    });
    expect(mocks.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        imageId: "source-image",
        originalName: "note (copy).txt",
      }),
    });
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("rejects a selection outside the application", async () => {
    mocks.files = [];
    await expect(
      managerOperation("app", "owner", {
        action: "trash",
        fileIds: ["foreign"],
      }),
    ).rejects.toThrow(/not found/);
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("rejects a missing or foreign destination folder", async () => {
    await expect(
      managerOperation("app", "owner", {
        action: "move",
        fileIds: ["entry"],
        folderId: "foreign",
      }),
    ).rejects.toThrow(/Destination/);
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("prevents cycles when moving folders", async () => {
    mocks.files = [];
    mocks.folders = [
      { id: "parent", parentId: null, deletedAt: null, trashBatchId: null },
      { id: "child", parentId: "parent", deletedAt: null, trashBatchId: null },
    ];
    mocks.folderFind.mockResolvedValue({ id: "child" }); // Selection lookup only returns selected roots.
    const { prisma } = await import("@/lib/prisma");
    const original = prisma.folder.findMany;
    let count = 0;
    prisma.folder.findMany = vi.fn(async () =>
      ++count === 1 ? [mocks.folders[0]] : mocks.folders,
    ) as unknown as typeof original;
    try {
      await expect(
        managerOperation("app", "owner", {
          action: "move",
          folderIds: ["parent"],
          folderId: "child",
        }),
      ).rejects.toThrow(/descendants/);
      expect(mocks.folderUpdate).not.toHaveBeenCalled();
    } finally {
      prisma.folder.findMany = original;
    }
  });
  it("rejects invalid names and handles cyclic imported trees finitely", () => {
    for (const name of ["..", ".", "a/b", "a\\b", "\u0000"])
      expect(safeName.safeParse(name).success).toBe(false);
    expect(
      descendants(
        [
          { id: "a", parentId: "b" },
          { id: "b", parentId: "a" },
        ],
        ["a"],
      ),
    ).toEqual(["a", "b"]);
  });
});
