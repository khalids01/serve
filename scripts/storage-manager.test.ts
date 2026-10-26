import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";

test("storage file-manager writes and recovery", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "serve-manager-"));
  process.env.UPLOAD_DIR = directory;
  process.env.STORAGE_PROVIDER = "local";
  process.env.BACKUP_ENABLED = "false";
  const {
    storageOperation,
    storageUpload,
    browseTrash,
    checkStorageOrigin,
    protectedStoragePath,
  } = await import("../src/lib/storage/manager");
  const { resolveBrowseLocation } = await import(
    "../src/lib/storage/locations"
  );
  const alice = { id: "alice", role: "user" };
  const root = path.join(directory, "owners/alice/local");
  const action = (input: unknown) => storageOperation(alice, "local", input);
  const upload = (key: string, text: string) =>
    storageUpload(
      alice,
      "local",
      key,
      new Blob([text]).stream(),
      Buffer.byteLength(text),
      "text/plain",
    );
  const { storage } = await resolveBrowseLocation(alice, "local");
  const { prisma: managerPrisma } = await import("../src/lib/prisma");
  const managerTransaction = managerPrisma.$transaction;
  managerPrisma.$transaction = (async (work: (tx: unknown) => unknown) =>
    work({
      $queryRaw: async () => [],
    })) as unknown as typeof managerTransaction;

  try {
    await t.test(
      "create folders and upload original file names without overwriting",
      async () => {
        await action({ action: "new-folder", prefix: "", name: "Documents" });
        await upload("Documents/readme.txt", "hello");
        assert.equal(
          await readFile(path.join(root, "Documents/readme.txt"), "utf8"),
          "hello",
        );
        await assert.rejects(
          () => upload("Documents/readme.txt", "replaced"),
          /already exists/,
        );
        assert.equal(
          await readFile(path.join(root, "Documents/readme.txt"), "utf8"),
          "hello",
        );
        await assert.rejects(
          () => action({ action: "new-folder", prefix: "", name: "Documents" }),
          /already exists/,
        );
        await upload("Folder upload/Nested/file.txt", "folder contents");
        assert.equal(
          await readFile(
            path.join(root, "Folder upload/Nested/file.txt"),
            "utf8",
          ),
          "folder contents",
        );
      },
    );
    await t.test(
      "rename and copy/move folders retain nested files and empty folders",
      async () => {
        await action({
          action: "rename",
          key: "Documents/readme.txt",
          name: "renamed.txt",
        });
        await assert.rejects(() =>
          readFile(path.join(root, "Documents/readme.txt")),
        );
        await action({
          action: "new-folder",
          prefix: "Documents/",
          name: "Empty",
        });
        await action({ action: "new-folder", prefix: "", name: "Copies" });
        await action({
          action: "copy",
          keys: ["Documents/"],
          destination: "Copies/",
        });
        assert.equal(
          await readFile(
            path.join(root, "Copies/Documents/renamed.txt"),
            "utf8",
          ),
          "hello",
        );
        assert(
          (await stat(path.join(root, "Copies/Documents/Empty"))).isDirectory(),
        );
        await action({
          action: "move",
          keys: ["Copies/Documents/"],
          destination: "",
        }).then(
          () => assert.fail("Must not overwrite"),
          () => {},
        );
        await action({
          action: "rename",
          key: "Copies/Documents/",
          name: "Moved",
        });
        assert.equal(
          await readFile(path.join(root, "Copies/Moved/renamed.txt"), "utf8"),
          "hello",
        );
        await assert.rejects(
          () =>
            action({
              action: "move",
              keys: ["Documents/"],
              destination: "Documents/Empty/",
            }),
          /outside/,
        );
      },
    );
    await t.test(
      "copy and move across storage locations stream into the destination namespace",
      async () => {
        await action({
          action: "copy",
          keys: ["Documents/"],
          destination: "",
          destinationId: "default",
        });
        const { storage: target } = await resolveBrowseLocation(
          alice,
          "default",
        );
        const opened = await target.open("Documents/renamed.txt");
        assert(opened);
        assert.equal(await new Response(opened.body).text(), "hello");
        await upload("cross.txt", "cross drive");
        await action({
          action: "move",
          keys: ["cross.txt"],
          destination: "",
          destinationId: "default",
        });
        assert.equal(await storage.stat("cross.txt"), null);
        const moved = await target.open("cross.txt");
        assert(moved);
        assert.equal(await new Response(moved.body).text(), "cross drive");
      },
    );
    await t.test(
      "copy/paste in the same folder generates a new name",
      async () => {
        await action({
          action: "copy",
          keys: ["Documents/renamed.txt"],
          destination: "Documents/",
        });
        await action({
          action: "copy",
          keys: ["Documents/renamed.txt"],
          destination: "Documents/",
        });
        assert.equal(
          await readFile(
            path.join(root, "Documents/renamed (copy).txt"),
            "utf8",
          ),
          "hello",
        );
        assert.equal(
          await readFile(
            path.join(root, "Documents/renamed (copy 2).txt"),
            "utf8",
          ),
          "hello",
        );
        await mkdir(path.join(directory, "Alias"));
        const admin = { id: "alice", role: "admin" };
        await assert.rejects(
          () =>
            storageOperation(admin, "local", {
              action: "move",
              keys: ["Alias/"],
              destinationId: "default",
              destination: "Alias/Sub/",
            }),
          /outside/,
        );
      },
    );
    await t.test(
      "failed folder copies roll back new files and preserve every source",
      async () => {
        await upload("Rollback/a.txt", "first");
        await upload("Rollback/b.txt", "second");
        const { LocalStorageBackend } = await import(
          "../src/lib/storage/local"
        );
        const original = LocalStorageBackend.prototype.copyFile;
        let copies = 0;
        const mock = t.mock.method(
          LocalStorageBackend.prototype,
          "copyFile",
          async function (
            this: InstanceType<typeof LocalStorageBackend>,
            source: string,
            target: string,
          ) {
            if (++copies === 2) throw new Error("provider unavailable");
            return original.call(this, source, target);
          },
        );
        try {
          await assert.rejects(
            () =>
              action({
                action: "move",
                keys: ["Rollback/"],
                destination: "Failed/",
              }),
            /provider unavailable/,
          );
          assert.equal(
            await readFile(path.join(root, "Rollback/a.txt"), "utf8"),
            "first",
          );
          assert.equal(
            await readFile(path.join(root, "Rollback/b.txt"), "utf8"),
            "second",
          );
          assert.equal(await storage.stat("Failed/Rollback/"), null);
        } finally {
          mock.mock.restore();
        }
      },
    );
    await t.test(
      "Trash is private, restorable, and permanent deletion is explicit",
      async () => {
        await action({
          action: "trash",
          keys: ["Documents/", "Documents/renamed.txt"],
        });
        await assert.rejects(() =>
          readFile(path.join(root, "Documents/renamed.txt")),
        );
        const trash = await browseTrash(storage, alice.id);
        assert.equal(
          trash.entries.length,
          1,
          "Overlapping selections are deduplicated",
        );
        assert.equal(trash.entries[0].key, "Documents/");
        assert.deepEqual((await browseTrash(storage, "bob")).entries, []);
        await action({ action: "restore", ids: [trash.entries[0].trashId] });
        assert.equal(
          await readFile(path.join(root, "Documents/renamed.txt"), "utf8"),
          "hello",
        );
        assert.equal((await browseTrash(storage, alice.id)).entries.length, 0);
        await action({ action: "trash", keys: ["Copies/"] });
        const removed = (await browseTrash(storage, alice.id)).entries[0];
        await action({ action: "purge", ids: [removed.trashId] });
        assert.equal((await browseTrash(storage, alice.id)).entries.length, 0);
        await assert.rejects(
          () => action({ action: "restore", ids: [removed.trashId] }),
          /no longer exists/,
        );
      },
    );
    await t.test(
      "restore conflicts preserve the existing file and the Trash copy",
      async () => {
        await upload("conflict.txt", "original");
        await action({ action: "trash", keys: ["conflict.txt"] });
        const entry = (await browseTrash(storage, alice.id)).entries[0];
        await upload("conflict.txt", "new");
        await assert.rejects(
          () => action({ action: "restore", ids: [entry.trashId] }),
          /already exists/,
        );
        assert.equal(
          await readFile(path.join(root, "conflict.txt"), "utf8"),
          "new",
        );
        assert.equal((await browseTrash(storage, alice.id)).entries.length, 1);
      },
    );
    await t.test(
      "protected paths, traversal, symlinks, and cross-site writes are blocked",
      async () => {
        for (const key of [
          "../escape.txt",
          "_blobs/hash.txt",
          ".serve-trash/record.json",
          "folder/_cache/file.txt",
        ])
          await assert.rejects(() => upload(key, "bad"));
        await mkdir(path.join(root, "external"));
        await symlink(path.join(root, "external"), path.join(root, "shortcut"));
        await assert.rejects(() => upload("shortcut/escape.txt", "bad"));
        await assert.rejects(() =>
          readFile(path.join(root, "external/escape.txt")),
        );
        await mkdir(path.join(root, "Mixed/_blobs"), { recursive: true });
        await writeFile(
          path.join(root, "Mixed/_blobs/managed.txt"),
          "do not touch",
        );
        await assert.rejects(
          () => action({ action: "trash", keys: ["Mixed/"] }),
          /managed by Serve/,
        );
        assert.equal(
          await readFile(path.join(root, "Mixed/_blobs/managed.txt"), "utf8"),
          "do not touch",
        );
        await mkdir(path.join(root, "With link"));
        await writeFile(path.join(root, "With link/keep.txt"), "keep");
        await symlink(
          path.join(root, "external"),
          path.join(root, "With link/link"),
        );
        await assert.rejects(
          () => action({ action: "trash", keys: ["With link/"] }),
          /symbolic links/,
        );
        assert.equal(
          await readFile(path.join(root, "With link/keep.txt"), "utf8"),
          "keep",
        );
        assert(protectedStoragePath("owners/alice/", "disk"));
        assert(protectedStoragePath("data-backup/", "disk"));
        assert.throws(
          () =>
            checkStorageOrigin(
              new Request("http://localhost:5000/api", {
                headers: { origin: "https://evil.example" },
              }),
            ),
          /not allowed/,
        );
        assert.throws(
          () => checkStorageOrigin(new Request("http://localhost:5000/api")),
          /not allowed/,
        );
        checkStorageOrigin(
          new Request("http://localhost:5000/api", {
            headers: { origin: "http://localhost:5000" },
          }),
        );
      },
    );
    await t.test(
      "failed streamed writes clean up partial destinations",
      async () => {
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new TextEncoder().encode("partial"));
            controller.error(new Error("connection lost"));
          },
        });
        await assert.rejects(
          () => storage.createFile("broken.txt", stream, 100),
          /connection lost/,
        );
        assert.equal(await storage.stat("broken.txt"), null);
      },
    );
    await t.test(
      "failed Trash metadata writes preserve originals and clean up copied data",
      async () => {
        await upload("metadata-failure.txt", "keep original");
        const before = (await browseTrash(storage, alice.id)).entries.map(
          (entry) => entry.trashId,
        );
        const { LocalStorageBackend } = await import(
          "../src/lib/storage/local"
        );
        const original = LocalStorageBackend.prototype.createFile;
        const mock = t.mock.method(
          LocalStorageBackend.prototype,
          "createFile",
          async function (
            this: InstanceType<typeof LocalStorageBackend>,
            ...args: Parameters<typeof original>
          ) {
            if (args[0].endsWith("/record.json"))
              throw new Error("metadata write failed");
            return original.apply(this, args);
          },
        );
        try {
          await assert.rejects(
            () => action({ action: "trash", keys: ["metadata-failure.txt"] }),
            /metadata write failed/,
          );
          assert.equal(
            await readFile(path.join(root, "metadata-failure.txt"), "utf8"),
            "keep original",
          );
          assert.deepEqual(
            (await browseTrash(storage, alice.id)).entries.map(
              (entry) => entry.trashId,
            ),
            before,
          );
        } finally {
          mock.mock.restore();
        }
      },
    );
    await t.test(
      "disabled S3 connections reject uploads and transfer destinations",
      async () => {
        const { encryptStorageCredentials } = await import(
          "../src/lib/storage/secrets"
        );
        const previousKey = process.env.STORAGE_ENCRYPTION_KEY;
        process.env.STORAGE_ENCRYPTION_KEY = Buffer.alloc(32, 4).toString(
          "base64",
        );
        const original = managerPrisma.storageConnection.findFirst;
        const connection = {
          id: "disabled",
          ownerId: alice.id,
          enabled: false,
          endpoint: "https://s3.example.invalid",
          bucket: "test",
          region: "auto",
          forcePathStyle: true,
          encryptedCredentials: encryptStorageCredentials(
            { accessKeyId: "test", secretAccessKey: "test" },
            alice.id,
            "disabled",
          ),
        };
        managerPrisma.storageConnection.findFirst = (async () =>
          connection) as unknown as typeof original;
        try {
          await assert.rejects(
            () =>
              storageUpload(
                alice,
                "disabled",
                "test.txt",
                new Blob(["test"]).stream(),
                4,
              ),
            /Enable the storage connection/,
          );
          await assert.rejects(
            () =>
              action({
                action: "copy",
                keys: ["Documents/"],
                destination: "",
                destinationId: "disabled",
              }),
            /Enable the storage connection/,
          );
        } finally {
          managerPrisma.storageConnection.findFirst = original;
          if (previousKey === undefined)
            delete process.env.STORAGE_ENCRYPTION_KEY;
          else process.env.STORAGE_ENCRYPTION_KEY = previousKey;
        }
      },
    );
    await t.test(
      "S3 writes use exclusive conditional requests and streaming bodies",
      async () => {
        const { createServer } = await import("node:http");
        const { S3StorageBackend } = await import("../src/lib/storage/s3");
        const requests: {
          method?: string;
          path?: string;
          condition?: string;
          source?: string;
          body: string;
        }[] = [];
        const server = createServer(async (request, response) => {
          const chunks: Buffer[] = [];
          for await (const chunk of request) chunks.push(Buffer.from(chunk));
          const source = request.headers["x-amz-copy-source"] as
            | string
            | undefined;
          requests.push({
            method: request.method,
            path: request.url,
            condition: request.headers["if-none-match"] as string | undefined,
            source,
            body: Buffer.concat(chunks).toString(),
          });
          response.setHeader("ETag", '"test-etag"');
          response.end(
            source
              ? '<CopyObjectResult><ETag>"test-etag"</ETag><LastModified>2026-01-01T00:00:00Z</LastModified></CopyObjectResult>'
              : "",
          );
        });
        server.listen(0, "127.0.0.1");
        await new Promise<void>((resolve) => server.once("listening", resolve));
        const address = server.address();
        assert(address && typeof address !== "string");
        try {
          const backend = new S3StorageBackend({
            bucket: "test-bucket",
            region: "us-east-1",
            accessKeyId: "test",
            secretAccessKey: "test",
            forcePathStyle: true,
            endpoint: `http://127.0.0.1:${address.port}`,
          });
          await backend.createDirectory("Folder/");
          await backend.createFile(
            "Folder/a.txt",
            new Blob(["streamed content"]).stream(),
            16,
            "text/plain",
          );
          await backend.copyFile("Folder/a.txt", "Folder/a copy.txt");
          assert.equal(requests.length, 3);
          assert(requests.every((request) => request.condition === "*"));
          assert.equal(requests[1].body, "streamed content");
          assert.equal(requests[2].source, "test-bucket/Folder/a.txt");
        } finally {
          server.closeAllConnections();
          await new Promise<void>((resolve) => server.close(() => resolve()));
        }
      },
    );
    await t.test(
      "upload endpoint verifies bytes, origin, and size before accepting writes",
      async () => {
        const { auth } = await import("../src/lib/auth");
        const { prisma } = await import("../src/lib/prisma");
        const { PUT } = await import(
          "../src/app/api/storage-connections/[id]/content/route"
        );
        const authMock = t.mock.method(auth.api, "getSession", async () => ({
          user: alice,
        }));
        const originalTransaction = prisma.$transaction;
        prisma.$transaction = (async (work: (tx: unknown) => unknown) =>
          work({
            $queryRaw: async () => [],
          })) as unknown as typeof originalTransaction;
        const request = (
          key: string,
          size: string,
          text: string,
          origin = "http://localhost:5000",
        ) =>
          PUT(
            new Request(
              `http://localhost:5000/api?${new URLSearchParams({ key })}`,
              {
                method: "PUT",
                headers: {
                  origin,
                  "x-file-size": size,
                  "content-type": "text/plain",
                },
                body: text,
              },
            ),
            { params: Promise.resolve({ id: "local" }) },
          );
        try {
          assert.equal((await request("route.txt", "4", "test")).status, 200);
          assert.equal((await request("empty.txt", "0", "")).status, 200);
          assert.equal((await storage.stat("empty.txt"))?.sizeBytes, 0);
          assert.equal(
            await readFile(path.join(root, "route.txt"), "utf8"),
            "test",
          );
          assert.equal(
            (await request("too-long.txt", "1", "test")).status,
            413,
          );
          assert.equal(await storage.stat("too-long.txt"), null);
          assert.equal((await request("short.txt", "8", "test")).status, 400);
          assert.equal(await storage.stat("short.txt"), null);
          assert.equal(
            (await request("csrf.txt", "4", "test", "https://evil.example"))
              .status,
            403,
          );
          assert.equal(
            (await request("huge.txt", "999999999999", "test")).status,
            413,
          );
        } finally {
          authMock.mock.restore();
          prisma.$transaction = originalTransaction;
        }
      },
    );
  } finally {
    managerPrisma.$transaction = managerTransaction;
    await rm(directory, { recursive: true, force: true });
  }
});
