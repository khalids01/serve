import { z } from "zod";

export const browsePath = z
  .string()
  .max(2048)
  .refine(
    (key) =>
      !key.includes("\\") &&
      !Array.from(key).some(
        (char) => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127,
      ) &&
      !key.startsWith("/") &&
      !key.includes("//") &&
      !key.split("/").some((part) => part === "." || part === ".."),
    "Invalid storage path.",
  );
export const browseQuery = z.object({
  prefix: browsePath
    .default("")
    .refine(
      (key) => !key || key.endsWith("/"),
      "Folder paths must end with /.",
    ),
  cursor: z.string().max(8192).optional(),
});
export type StorageVariant = {
  key: string;
  label: string;
  sizeBytes?: number;
  modifiedAt?: number;
  width?: number | null;
  height?: number | null;
};
export type BrowseEntry = {
  key: string;
  kind: "folder" | "file";
  sizeBytes?: number;
  modifiedAt?: number;
  protected?: boolean;
  trashId?: string;
  deletedAt?: number;
  variants?: StorageVariant[];
};
export type BrowsePage = {
  entries: BrowseEntry[];
  nextCursor?: string;
  hasUnsupportedEntries?: boolean;
};
export const BROWSE_PAGE_SIZE = 100;
export const STORAGE_VIEW_PAGE_SIZE = 24;

export const storageName = z
  .string()
  .trim()
  .min(1)
  .max(255)
  .refine(
    (name) =>
      browsePath.safeParse(name).success &&
      !name.includes("/") &&
      name !== "." &&
      name !== "..",
    "Use a name without slashes or control characters.",
  );
export const storageItem = browsePath.refine(
  (key) => Boolean(key),
  "Choose an item.",
);
export const storageFolder = browseQuery.shape.prefix;
export const storageAction = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("new-folder"),
    prefix: storageFolder,
    name: storageName,
  }),
  z.object({
    action: z.literal("rename"),
    key: storageItem,
    name: storageName,
  }),
  z.object({
    action: z.enum(["copy", "move"]),
    keys: z.array(storageItem).min(1).max(100),
    destination: storageFolder,
    destinationId: z.string().max(255).optional(),
  }),
  z.object({
    action: z.literal("trash"),
    keys: z.array(storageItem).min(1).max(100),
  }),
  z.object({
    action: z.enum(["restore", "purge"]),
    ids: z.array(z.string().uuid()).min(1).max(100),
  }),
]);

export const storageClipboard = z.object({
  mode: z.enum(["copy", "move"]),
  keys: z.array(storageItem).min(1).max(100),
  id: z.string().min(1).max(255),
});
