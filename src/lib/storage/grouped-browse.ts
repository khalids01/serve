import { z } from "zod";
import { prisma } from "@/lib/prisma";
import type { StorageBackend } from "./backend";
import {
  BROWSE_PAGE_SIZE,
  type BrowseEntry,
  type BrowsePage,
  browsePath,
  STORAGE_VIEW_PAGE_SIZE,
  type StorageVariant,
} from "./browse";
import { StorageLocationError } from "./locations";

// Only generated content IDs qualify; ordinary similarly named uploads stay independent.
const generatedImage =
  /^(.*\/)?([a-f0-9]{16}|[a-f0-9]{32}|[a-f0-9]{64})(-placeholder)?\.(png|jpe?g|webp|avif|gif)$/i;
const formats = ["jpg", "jpeg", "png", "gif", "avif", "webp"];
const positionSchema = z
  .object({
    prefix: browsePath,
    cursor: z.string().max(4096).optional(),
    offset: z.number().int().min(0).max(BROWSE_PAGE_SIZE),
  })
  .strict();
type Context = { ownerId?: string; namespacePrefix: string };
function family(entry: BrowseEntry) {
  return entry.kind === "file" && !entry.trashId
    ? generatedImage.exec(entry.key)
    : null;
}
function familyKey(entry: BrowseEntry) {
  const match = family(entry);
  return match ? `${match[1] ?? ""}${match[2]}` : undefined;
}
function location(key: string) {
  const local = /^owners\/([^/]+)\/local\/_blobs\//.exec(key);
  if (local) return `local:${local[1]}`;
  const defaults = /^owners\/([^/]+)\/default\/([a-f0-9]{16})\/_blobs\//.exec(
    key,
  );
  if (defaults) return `default:${defaults[1]}:${defaults[2]}`;
  return /^connections\/([^/]+)\/_blobs\//.exec(key)?.[1] ?? "system";
}
function variantLabel(key: string) {
  const ext = key.split(".").at(-1)?.toUpperCase() ?? "Image";
  return `${key.includes("-placeholder.") ? "Placeholder" : "Image"} · ${ext}`;
}

export async function browseImageGroups(
  storage: StorageBackend,
  prefix: string,
  token: string | undefined,
  context: Context,
): Promise<BrowsePage> {
  let position = { prefix, cursor: token, offset: 0 };
  if (token?.startsWith("g1.")) {
    try {
      const parsed = positionSchema.parse(
        JSON.parse(Buffer.from(token.slice(3), "base64url").toString()),
      );
      if (parsed.prefix !== prefix) throw new Error();
      position = { ...parsed, cursor: parsed.cursor };
    } catch {
      throw new StorageLocationError(
        "Invalid page cursor. Open the first page again.",
      );
    }
  }
  const encode = (cursor: string | undefined, offset: number) =>
    `g1.${Buffer.from(JSON.stringify({ prefix, cursor, offset })).toString("base64url")}`;
  const entries: BrowseEntry[] = [];
  const resolved = new Map<
    string,
    { primary: BrowseEntry; variants: StorageVariant[] } | null
  >();
  let hasUnsupportedEntries = false;
  // A request never scans the entire bucket, even if it encounters only variants.
  for (let request = 0; request < 4; request++) {
    const page = await storage.browse(prefix, position.cursor);
    hasUnsupportedEntries ||= Boolean(page.hasUnsupportedEntries);
    const raw = new Map(page.entries.map((entry) => [entry.key, entry]));
    const families = new Map<string, BrowseEntry[]>();
    for (const entry of page.entries) {
      const key = familyKey(entry);
      if (!key || resolved.has(key)) continue;
      families.set(key, [...(families.get(key) ?? []), entry]);
    }
    const references = [...families.values()].map(([entry]) => ({
      storageLocationId: location(context.namespacePrefix + entry.key),
      hash: family(entry)?.[2] ?? "",
    }));
    const metadata = references.length
      ? await prisma.image.findMany({
          where: {
            ...(context.ownerId ? { ownerId: context.ownerId } : {}),
            OR: references,
          },
          take: references.length,
          select: {
            storageLocationId: true,
            hash: true,
            filename: true,
            width: true,
            height: true,
            variants: {
              take: 32,
              select: {
                filename: true,
                label: true,
                width: true,
                height: true,
              },
            },
          },
        })
      : [];
    const records = new Map(
      metadata.map((image) => [
        `${image.storageLocationId}:${image.hash}`,
        image,
      ]),
    );
    async function resolveGroup(base: string, items: BrowseEntry[]) {
      const match = family(items[0]);
      if (!match) return;
      const directory = match[1] ?? "";
      const record = records.get(
        `${location(context.namespacePrefix + items[0].key)}:${match[2]}`,
      );
      const known = record
        ? [record, ...record.variants].filter(
            (item) =>
              !item.filename.includes("/") &&
              familyKey({
                key: directory + item.filename,
                kind: "file",
              }) === base,
          )
        : [];
      const candidates = known.length
        ? known.map((item) => directory + item.filename)
        : formats.flatMap((ext) => [
            `${base}.${ext}`,
            `${base}-placeholder.${ext}`,
          ]);
      const files: BrowseEntry[] = [];
      await Promise.all(
        [
          ...new Set(
            known.length
              ? candidates
              : [...items.map((item) => item.key), ...candidates],
          ),
        ].map(async (key) => {
          const listed = raw.get(key);
          const info = listed ?? (await storage.stat(key));
          if (info)
            files.push(
              listed ?? {
                key,
                kind: "file",
                sizeBytes: info.sizeBytes,
                modifiedAt: "mtimeMs" in info ? info.mtimeMs : undefined,
              },
            );
        }),
      );
      files.sort((a, b) => a.key.localeCompare(b.key));
      const originals = files.filter(
        (file) =>
          !file.key.includes("-placeholder.") && !file.key.endsWith(".webp"),
      );
      const primary =
        (record &&
          files.find((file) => file.key === directory + record.filename)) ||
        (originals.length === 1
          ? originals[0]
          : originals.length > 1
            ? undefined
            : (files.find((file) => file.key === `${base}.webp`) ??
              files.sort((a, b) => a.key.localeCompare(b.key))[0]));
      if (!primary || files.length < 2) {
        resolved.set(base, null);
        return;
      }
      resolved.set(base, {
        primary,
        variants: files
          .filter((file) => file.key !== primary.key)
          .map((file) => {
            const detail = known.find(
              (item) => directory + item.filename === file.key,
            );
            return {
              key: file.key,
              label:
                detail && "label" in detail
                  ? detail.label
                  : variantLabel(file.key),
              sizeBytes: file.sizeBytes,
              modifiedAt: file.modifiedAt,
              width: detail?.width,
              height: detail?.height,
            };
          }),
      });
    }

    for (let index = position.offset; index < page.entries.length; index++) {
      const entry = page.entries[index];
      if (entry.key.split("/").includes(".serve-trash")) continue;
      const key = familyKey(entry);
      if (key && !resolved.has(key))
        await resolveGroup(key, families.get(key) ?? [entry]);
      const group = key ? resolved.get(key) : undefined;
      if (group?.variants.some((variant) => variant.key === entry.key))
        continue;
      entries.push(
        group?.primary.key === entry.key
          ? { ...entry, variants: group.variants }
          : entry,
      );
      if (entries.length === STORAGE_VIEW_PAGE_SIZE)
        return {
          entries,
          hasUnsupportedEntries,
          nextCursor:
            index + 1 < page.entries.length
              ? encode(position.cursor, index + 1)
              : page.nextCursor
                ? encode(page.nextCursor, 0)
                : undefined,
        };
    }
    if (!page.nextCursor) return { entries, hasUnsupportedEntries };
    position = { prefix, cursor: page.nextCursor, offset: 0 };
  }
  return {
    entries,
    hasUnsupportedEntries,
    nextCursor: encode(position.cursor, 0),
  };
}
