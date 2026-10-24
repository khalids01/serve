import type {
  StorageBackend,
  StorageByteRange,
} from "../../../src/lib/storage/backend";

type Variant = {
  id: string;
  filename: string;
  label: string;
  width: number | null;
  height: number | null;
  sizeBytes: number;
};
type Image = {
  id: string;
  hash: string;
  ownerId: string;
  storageLocationId: string;
  storageConfig: unknown;
  filename: string;
  contentType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  createdAt: Date;
  updatedAt: Date;
  variants: Variant[];
};
type Link = {
  id: string;
  imageId: string;
  applicationId: string;
  originalName: string;
  tags: unknown;
  folderId: string | null;
  deletedAt: Date | null;
  trashBatchId: string | null;
  starred: boolean;
  linkedAt: Date;
  updatedAt: Date;
};
const images = new Map<string, Image>();
const links = new Map<string, Link>();
const blobs = new Map<string, Buffer>();
let sequence = 0;
const key = (imageId: string, applicationId: string) =>
  `${imageId}:${applicationId}`;
function hydrate(image: Image) {
  return {
    ...image,
    applications: [...links.values()]
      .filter((link) => link.imageId === image.id)
      .map((link) => ({
        ...link,
        application: {
          id: link.applicationId,
          slug: link.applicationId,
          name: link.applicationId,
        },
      })),
  };
}
function hydrateLink(link: Link) {
  const image = images.get(link.imageId);
  if (!image) throw new Error("Missing image");
  return { ...link, image: hydrate(image) };
}
type ImageWhere = {
  id?: string;
  hash?: string;
  storageLocationId_hash?: { storageLocationId: string; hash: string };
};
function find(where: ImageWhere) {
  const image = [...images.values()].find((value) =>
    where.id
      ? value.id === where.id
      : where.storageLocationId_hash
        ? value.hash === where.storageLocationId_hash.hash &&
          value.storageLocationId ===
            where.storageLocationId_hash.storageLocationId
        : value.hash === where.hash,
  );
  return image ? hydrate(image) : null;
}
function matches(
  link: Link,
  where: {
    id?: string;
    OR?: Array<{ id?: string; imageId?: string }>;
    applicationId?: string;
    imageId?: string;
    AND?: Array<{ applicationId?: string }>;
  },
) {
  return (
    (!where.id || link.id === where.id) &&
    (!where.OR ||
      where.OR.some(
        (part) => part.id === link.id || part.imageId === link.imageId,
      )) &&
    (!where.applicationId || link.applicationId === where.applicationId) &&
    (!where.imageId || link.imageId === where.imageId) &&
    (!where.AND ||
      where.AND.every(
        (part) =>
          !part.applicationId || part.applicationId === link.applicationId,
      ))
  );
}
export const db = {
  $queryRaw: async () => [{ locked: 1 }],
  $transaction: async (work: unknown) =>
    typeof work === "function"
      ? work(db)
      : Promise.all(work as Promise<unknown>[]),
  application: {
    findUniqueOrThrow: async () => ({
      ownerId: "owner",
      defaultStorageLocationId: "default",
    }),
  },
  image: {
    findFirst: async ({ where }: { where: ImageWhere }) => find(where),
    findUnique: async ({ where }: { where: ImageWhere }) => find(where),
    findUniqueOrThrow: async ({ where }: { where: ImageWhere }) => {
      const image = find(where);
      if (!image) throw new Error("Not found");
      return image;
    },
    create: async ({
      data,
    }: {
      data: Omit<Image, "id" | "createdAt" | "updatedAt" | "variants"> & {
        variants: { create: Omit<Variant, "id">[] };
        applications: {
          create: {
            applicationId: string;
            originalName: string;
            tags?: unknown;
          };
        };
      };
    }) => {
      const id = `asset-${++sequence}`;
      const now = new Date();
      const image = {
        ...data,
        id,
        width: data.width ?? null,
        height: data.height ?? null,
        createdAt: now,
        updatedAt: now,
        variants: data.variants.create.map((value) => ({
          ...value,
          id: `variant-${++sequence}`,
          width: value.width ?? null,
          height: value.height ?? null,
        })),
      };
      images.set(id, image);
      const app = data.applications.create;
      links.set(key(id, app.applicationId), {
        id: `link-${++sequence}`,
        imageId: id,
        applicationId: app.applicationId,
        originalName: app.originalName,
        tags: app.tags ?? [],
        folderId: null,
        deletedAt: null,
        trashBatchId: null,
        starred: false,
        linkedAt: now,
        updatedAt: now,
      });
      return hydrate(image);
    },
    delete: async ({ where }: { where: { id: string } }) => {
      images.delete(where.id);
    },
  },
  imageApplication: {
    create: async ({
      data,
    }: {
      data: Omit<
        Link,
        | "id"
        | "linkedAt"
        | "updatedAt"
        | "deletedAt"
        | "trashBatchId"
        | "starred"
      >;
    }) => {
      const row = {
        ...data,
        id: `link-${++sequence}`,
        linkedAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        trashBatchId: null,
        starred: false,
      };
      links.set(row.id, row);
      return hydrateLink(row);
    },
    findFirst: async ({ where }: { where: Parameters<typeof matches>[1] }) => {
      const row = [...links.values()].find((link) => matches(link, where));
      return row ? hydrateLink(row) : null;
    },
    findUnique: async ({ where }: { where: { id: string } }) => {
      const row = [...links.values()].find((link) => link.id === where.id);
      return row ? hydrateLink(row) : null;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      for (const [key, row] of links)
        if (row.id === where.id) links.delete(key);
    },
    count: async ({ where }: { where: Parameters<typeof matches>[1] }) =>
      [...links.values()].filter((link) => matches(link, where)).length,
    findMany: async ({
      where,
      skip = 0,
      take = 20,
    }: {
      where: Parameters<typeof matches>[1];
      skip?: number;
      take?: number;
    }) =>
      [...links.values()]
        .filter((link) => matches(link, where))
        .slice(skip, skip + take)
        .map(hydrateLink),
  },
};
export const storage: StorageBackend = {
  put: async (key, data) => {
    blobs.set(key, Buffer.from(data));
  },
  get: async (key) => blobs.get(key) ?? null,
  open: async (key: string, range?: StorageByteRange) => {
    const data = blobs.get(key);
    if (!data) return null;
    const bytes = new Uint8Array(
      range ? data.subarray(range.start, range.end + 1) : data,
    );
    return {
      body: new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(bytes);
          controller.close();
        },
      }),
      contentLength: bytes.byteLength,
    };
  },
  delete: async (key) => {
    blobs.delete(key);
  },
  exists: async (key) => blobs.has(key),
  list: async (prefix) =>
    [...blobs]
      .filter(([key]) => key.startsWith(prefix))
      .map(([key, data]) => ({ key, sizeBytes: data.length })),
  deletePrefix: async (prefix) => {
    for (const key of blobs.keys())
      if (key.startsWith(prefix)) blobs.delete(key);
  },
};
export function reset() {
  images.clear();
  links.clear();
  blobs.clear();
  sequence = 0;
}
