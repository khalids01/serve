import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

// No live database or bucket is used. All local writes stay in this temporary directory.
test("storage browser security, streaming, and pagination", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "serve-browse-"));
  process.env.UPLOAD_DIR = root;
  process.env.STORAGE_PROVIDER = "local";
  process.env.BACKUP_ENABLED = "false";
  const { LocalStorageBackend } = await import("../src/lib/storage/local");
  const { PrefixedStorage } = await import("../src/lib/storage/prefix");
  const { browseQuery } = await import("../src/lib/storage/browse");
  const local = new LocalStorageBackend(root);
  try {
    await mkdir(path.join(root, "one/folder"), { recursive: true });
    await mkdir(path.join(root, "two"));
    await writeFile(path.join(root, "one/readme.txt"), "hello");
    await writeFile(path.join(root, "two/secret.txt"), "private");
    await symlink(path.join(root, "two"), path.join(root, "one/shortcut"));
    await symlink(
      path.join(root, "two/secret.txt"),
      path.join(root, "one/link.txt"),
    );
    const scoped = new PrefixedStorage(local, "one/");

    await t.test(
      "one folder at a time, metadata, and namespace isolation",
      async () => {
        const page = await scoped.browse("");
        assert.deepEqual(page.entries.map((entry) => entry.key).sort(), [
          "folder/",
          "readme.txt",
        ]);
        assert.equal(
          page.entries.find((entry) => entry.key === "readme.txt")?.sizeBytes,
          5,
        );
        assert.deepEqual((await scoped.browse("folder/")).entries, []);
        const opened = await scoped.open("readme.txt");
        assert(opened);
        assert.equal(await new Response(opened.body).text(), "hello");
        const range = await scoped.open("readme.txt", { start: 1, end: 3 });
        assert(range);
        assert.equal(await new Response(range.body).text(), "ell");
        assert.equal(await scoped.open("missing.txt"), null);
      },
    );

    await t.test("traversal and symlink escapes are rejected", async () => {
      for (const prefix of [
        "../",
        "/etc/",
        "folder/../../",
        "one\\two/",
        "a//b/",
        "./",
        "a\0/",
      ]) {
        assert.equal(browseQuery.safeParse({ prefix }).success, false, prefix);
        await assert.rejects(() => scoped.browse(prefix));
      }
      await assert.rejects(async () => scoped.open("../two/secret.txt"));
      await assert.rejects(async () => scoped.open("shortcut/secret.txt"));
      await assert.rejects(async () => scoped.open("link.txt"));
      await assert.rejects(() => scoped.browse("shortcut/"));
      await assert.rejects(async () => scoped.open("folder"));
      await assert.rejects(() => scoped.browse("", "-1"));
    });

    await t.test(
      "local pagination has bounded pages and no duplicates",
      async () => {
        await mkdir(path.join(root, "large"));
        await Promise.all(
          Array.from({ length: 205 }, (_, i) =>
            writeFile(path.join(root, "large", `${i}.txt`), String(i)),
          ),
        );
        let cursor: string | undefined;
        const keys: string[] = [];
        let count = 0;
        do {
          const page = await local.browse("large/", cursor);
          assert(page.entries.length <= 100);
          keys.push(...page.entries.map((entry) => entry.key));
          cursor = page.nextCursor;
          count++;
        } while (cursor);
        assert.equal(count, 3);
        assert.equal(keys.length, 205);
        assert.equal(new Set(keys).size, 205);
      },
    );

    await t.test(
      "S3 uses a single delimiter-based paginated request",
      async () => {
        const { S3Client } = await import("@aws-sdk/client-s3");
        const { S3StorageBackend } = await import("../src/lib/storage/s3");
        const send = t.mock.method(
          S3Client.prototype,
          "send",
          async (command: { input: unknown }) => {
            assert.deepEqual(command.input, {
              Bucket: "bucket",
              Prefix: "one/",
              Delimiter: "/",
              MaxKeys: 100,
              ContinuationToken: "opaque-token",
            });
            return {
              CommonPrefixes: [{ Prefix: "one/folder/" }],
              Contents: [
                { Key: "one/", Size: 0 },
                { Key: "one/file.txt", Size: 12 },
              ],
              IsTruncated: true,
              NextContinuationToken: "next",
            };
          },
        );
        try {
          const s3 = new S3StorageBackend({
            accessKeyId: "test",
            secretAccessKey: "test",
            bucket: "bucket",
            region: "auto",
          });
          const page = await new PrefixedStorage(s3, "one/").browse(
            "",
            "opaque-token",
          );
          assert.deepEqual(page, {
            entries: [
              { key: "folder/", kind: "folder" },
              {
                key: "file.txt",
                kind: "file",
                sizeBytes: 12,
                modifiedAt: undefined,
              },
            ],
            nextCursor: "next",
          });
          assert.equal(send.mock.callCount(), 1);
        } finally {
          send.mock.restore();
        }
      },
    );

    await t.test(
      "routes require a session, enforce ownership, and isolate normal users",
      async () => {
        const { auth } = await import("../src/lib/auth");
        const { prisma } = await import("../src/lib/prisma");
        const { GET: browse } = await import(
          "../src/app/api/storage-connections/[id]/browse/route"
        );
        const { GET: content } = await import(
          "../src/app/api/storage-connections/[id]/content/route"
        );
        let session: unknown = null;
        const authMock = t.mock.method(
          auth.api,
          "getSession",
          async () => session,
        );
        const originalFindFirst = prisma.storageConnection.findFirst;
        prisma.storageConnection.findFirst = (async (args: {
          where: { ownerId: string };
        }) => {
          assert.equal(args.where.ownerId, "alice");
          return null;
        }) as unknown as typeof originalFindFirst;
        const context = (id: string) => ({ params: Promise.resolve({ id }) });
        try {
          assert.equal(
            (
              await browse(
                new Request("http://localhost/api?prefix="),
                context("local"),
              )
            ).status,
            401,
          );
          assert.equal(
            (
              await content(
                new Request("http://localhost/api?key=two/secret.txt"),
                context("local"),
              )
            ).status,
            401,
          );
          session = { user: { id: "alice", role: "user" } };
          assert.equal(
            (
              await browse(
                new Request("http://localhost/api"),
                context("someone-elses-connection"),
              )
            ).status,
            403,
          );
          assert.equal(
            (
              await content(
                new Request("http://localhost/api?key=two/secret.txt"),
                context("someone-elses-connection"),
              )
            ).status,
            403,
          );
          assert.equal(
            (
              await browse(
                new Request("http://localhost/api?prefix=../"),
                context("local"),
              )
            ).status,
            400,
          );
          await mkdir(path.join(root, "owners/alice/local"), {
            recursive: true,
          });
          await writeFile(
            path.join(root, "owners/alice/local/own.txt"),
            "owned",
          );
          const page = await (
            await browse(new Request("http://localhost/api"), context("local"))
          ).json();
          assert.equal(page.scope, "namespace");
          assert.deepEqual(
            page.entries.map((entry: { key: string }) => entry.key),
            ["own.txt"],
          );
          assert.equal(
            (
              await content(
                new Request("http://localhost/api?key=two/secret.txt"),
                context("local"),
              )
            ).status,
            404,
          );
          const download = await content(
            new Request("http://localhost/api?key=own.txt"),
            context("local"),
          );
          assert.equal(await download.text(), "owned");
          assert.equal(
            download.headers.get("cache-control"),
            "private, no-store",
          );
          assert.equal(
            download.headers.get("content-type"),
            "application/octet-stream",
          );
          assert.match(
            download.headers.get("content-disposition") ?? "",
            /^attachment;/,
          );
          session = { user: { id: "alice", role: "admin" } };
          const full = await (
            await browse(new Request("http://localhost/api"), context("local"))
          ).json();
          assert.equal(full.scope, "disk");
          assert(
            full.entries.some((entry: { key: string }) => entry.key === "two/"),
          );
        } finally {
          authMock.mock.restore();
          prisma.storageConnection.findFirst = originalFindFirst;
        }
      },
    );

    await t.test(
      "previews are inert, type-restricted, and size-limited",
      async () => {
        const { auth } = await import("../src/lib/auth");
        const { GET } = await import(
          "../src/app/api/storage-connections/[id]/content/route"
        );
        const authMock = t.mock.method(auth.api, "getSession", async () => ({
          user: { id: "alice", role: "admin" },
        }));
        const request = (key: string) =>
          GET(
            new Request(
              `http://localhost/api?${new URLSearchParams({ key, preview: "1" })}`,
            ),
            { params: Promise.resolve({ id: "local" }) },
          );
        try {
          await writeFile(
            path.join(root, "one/page.html"),
            "<script>alert(1)</script>",
          );
          const html = await request("one/page.html");
          assert.equal(
            html.headers.get("content-type"),
            "text/plain; charset=utf-8",
          );
          assert.match(
            html.headers.get("content-security-policy") ?? "",
            /sandbox/,
          );
          assert.equal(html.headers.get("x-content-type-options"), "nosniff");
          assert.equal(await html.text(), "<script>alert(1)</script>");
          assert.equal((await request("one/image.svg")).status, 415);
          assert.equal((await request("one/file.constructor")).status, 415);
          await writeFile(
            path.join(root, "one/large.txt"),
            Buffer.alloc(1024 * 1024 + 1),
          );
          assert.equal((await request("one/large.txt")).status, 413);
        } finally {
          authMock.mock.restore();
        }
      },
    );
    await t.test(
      "saved S3 connections retain their owner binding and private prefix",
      async () => {
        const { auth } = await import("../src/lib/auth");
        const { prisma } = await import("../src/lib/prisma");
        const { encryptStorageCredentials } = await import(
          "../src/lib/storage/secrets"
        );
        const { S3Client } = await import("@aws-sdk/client-s3");
        const { GET } = await import(
          "../src/app/api/storage-connections/[id]/browse/route"
        );
        const previousKey = process.env.STORAGE_ENCRYPTION_KEY;
        process.env.STORAGE_ENCRYPTION_KEY = Buffer.alloc(32, 7).toString(
          "base64",
        );
        let role = "user";
        const authMock = t.mock.method(auth.api, "getSession", async () => ({
          user: { id: "alice", role },
        }));
        const originalFindFirst = prisma.storageConnection.findFirst;
        const connection = {
          id: "owned",
          ownerId: "alice",
          bucket: "private-bucket",
          region: "auto",
          endpoint: "https://s3.example.com",
          forcePathStyle: true,
          encryptedCredentials: encryptStorageCredentials(
            {
              accessKeyId: "private-access",
              secretAccessKey: "private-secret",
            },
            "alice",
            "owned",
          ),
        };
        prisma.storageConnection.findFirst = (async (args: {
          where: { id: string; ownerId: string };
        }) => {
          assert.deepEqual(args.where, { id: "owned", ownerId: "alice" });
          return connection;
        }) as unknown as typeof originalFindFirst;
        const send = t.mock.method(
          S3Client.prototype,
          "send",
          async (command: { input: { Prefix: string } }) => {
            assert.equal(
              command.input.Prefix,
              role === "admin" ? "" : "connections/owned/",
            );
            return {
              Contents: [{ Key: `${command.input.Prefix}file.txt`, Size: 4 }],
            };
          },
        );
        try {
          const request = () =>
            GET(new Request("http://localhost/api"), {
              params: Promise.resolve({ id: "owned" }),
            });
          const normal = await (await request()).json();
          assert.equal(normal.scope, "namespace");
          assert.equal(normal.entries[0].key, "file.txt");
          assert(!JSON.stringify(normal).includes("private-secret"));
          role = "admin";
          assert.equal((await (await request()).json()).scope, "disk");
        } finally {
          authMock.mock.restore();
          send.mock.restore();
          prisma.storageConnection.findFirst = originalFindFirst;
          if (previousKey === undefined)
            delete process.env.STORAGE_ENCRYPTION_KEY;
          else process.env.STORAGE_ENCRYPTION_KEY = previousKey;
        }
      },
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
