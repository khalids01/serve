import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { prisma } from "../src/lib/prisma";
import {
  type BrowseEntry,
  STORAGE_VIEW_PAGE_SIZE,
} from "../src/lib/storage/browse";
import { browseImageGroups } from "../src/lib/storage/grouped-browse";
import { LocalStorageBackend } from "../src/lib/storage/local";
import { PrefixedStorage } from "../src/lib/storage/prefix";

test("grouped storage pagination", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "serve-groups-"));
  const storage = new LocalStorageBackend(root);
  const originalFindMany = prisma.image.findMany;
  let findMetadata: (args: unknown) => Promise<unknown[]> = async () => [];
  prisma.image.findMany = (async (args: unknown) =>
    findMetadata(args)) as unknown as typeof originalFindMany;
  const noScan = t.mock.method(storage, "list", async () => {
    throw new Error("Unbounded listing must not be used");
  });
  const context = { ownerId: "alice", namespacePrefix: "owners/alice/local/" };
  const put = async (key: string) => {
    await mkdir(path.dirname(path.join(root, key)), { recursive: true });
    await writeFile(path.join(root, key), "image bytes");
  };
  try {
    await t.test(
      "variants spanning raw pages appear once with all versions",
      async () => {
        const keys: string[] = [];
        for (let index = 0; index < 55; index++) {
          const hash = index.toString(16).padStart(16, "0");
          for (const suffix of [
            ".png",
            ".webp",
            "-placeholder.png",
            "-placeholder.webp",
          ]) {
            const key = `pictures/${hash}${suffix}`;
            keys.push(key);
            await put(key);
          }
        }
        keys.sort();
        // A 37-object page deliberately cuts through four-file image families.
        const raw = t.mock.method(
          storage,
          "browse",
          async (_prefix: string, token?: string) => {
            const offset = Number(token ?? 0);
            return {
              entries: keys
                .slice(offset, offset + 37)
                .map(
                  (key): BrowseEntry => ({ key, kind: "file", sizeBytes: 11 }),
                ),
              nextCursor:
                offset + 37 < keys.length ? String(offset + 37) : undefined,
            };
          },
        );
        let cursor: string | undefined;
        const originals: string[] = [];
        let pages = 0;
        do {
          const callsBefore = raw.mock.callCount();
          const page = await browseImageGroups(
            storage,
            "pictures/",
            cursor,
            context,
          );
          assert(page.entries.length <= STORAGE_VIEW_PAGE_SIZE);
          assert(raw.mock.callCount() - callsBefore <= 4);
          for (const entry of page.entries) {
            assert(
              entry.key.endsWith(".png") && !entry.key.includes("placeholder"),
            );
            assert.equal(entry.variants?.length, 3);
            assert(
              entry.variants.every((variant) =>
                variant.key.startsWith("pictures/"),
              ),
            );
            originals.push(entry.key);
          }
          cursor = page.nextCursor;
          pages++;
          assert(pages <= 4);
        } while (cursor);
        assert.equal(pages, 3);
        assert.equal(originals.length, 55);
        assert.equal(new Set(originals).size, 55);
        assert.equal(noScan.mock.callCount(), 0);
        raw.mock.restore();
      },
    );
    await t.test(
      "ordinary similar names and ambiguous originals are not collapsed",
      async () => {
        for (const name of [
          "holiday.png",
          "holiday.webp",
          "holiday-placeholder.webp",
          "1111111111111111.png",
          "1111111111111111.jpg",
          "1111111111111111.webp",
        ])
          await put(`ordinary/${name}`);
        const page = await browseImageGroups(
          storage,
          "ordinary/",
          undefined,
          context,
        );
        assert.equal(page.entries.length, 6);
        assert(page.entries.every((entry) => !entry.variants));
      },
    );
    await t.test(
      "saved metadata determines the original and cannot cross namespaces",
      async () => {
        for (const suffix of [".png", ".webp", "-placeholder.webp"])
          await put(`owners/alice/local/_blobs/2222222222222222${suffix}`);
        await put("owners/bob/local/_blobs/2222222222222222-secret.png");
        findMetadata = async (args: unknown) => {
          assert.deepEqual((args as { where: unknown }).where, {
            ownerId: "alice",
            OR: [
              { storageLocationId: "local:alice", hash: "2222222222222222" },
            ],
          });
          return [
            {
              storageLocationId: "local:alice",
              hash: "2222222222222222",
              filename: "2222222222222222.webp",
              width: 800,
              height: 600,
              variants: [
                {
                  filename: "2222222222222222.png",
                  label: "PNG",
                  width: 800,
                  height: 600,
                },
                {
                  filename: "2222222222222222-placeholder.webp",
                  label: "placeholder-webp",
                  width: 80,
                  height: 60,
                },
                {
                  filename: "../bob/secret.png",
                  label: "Invalid path",
                  width: null,
                  height: null,
                },
              ],
            },
          ];
        };
        const page = await browseImageGroups(
          new PrefixedStorage(storage, "owners/alice/local/"),
          "_blobs/",
          undefined,
          context,
        );
        assert.equal(page.entries.length, 1);
        assert.equal(page.entries[0].key, "_blobs/2222222222222222.webp");
        assert.equal(page.entries[0].variants?.length, 2);
        assert(
          page.entries[0].variants?.some(
            (variant) => variant.label === "PNG" && variant.width === 800,
          ),
        );
        findMetadata = async () => [];
      },
    );
    await t.test(
      "page cursors reject malformed offsets and other folders",
      async () => {
        for (const value of [
          { prefix: "other/", offset: 0 },
          { prefix: "pictures/", offset: -1 },
          { prefix: "pictures/", offset: 101 },
        ]) {
          const cursor = `g1.${Buffer.from(JSON.stringify(value)).toString("base64url")}`;
          await assert.rejects(
            () => browseImageGroups(storage, "pictures/", cursor, context),
            /Invalid page cursor/,
          );
        }
        await assert.rejects(
          () => browseImageGroups(storage, "pictures/", "g1.invalid", context),
          /Invalid page cursor/,
        );
      },
    );
  } finally {
    prisma.image.findMany = originalFindMany;
    noScan.mock.restore();
    await rm(root, { recursive: true, force: true });
  }
});
