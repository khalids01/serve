import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { runPgDump } from "../src/lib/backups";

test("SQL backup client selection and actionable failures", async (t) => {
  const directory = await mkdtemp(path.join(tmpdir(), "serve-pg-dump-"));
  const saved = {
    DATABASE_URL: process.env.DATABASE_URL,
    PG_DUMP_PATH: process.env.PG_DUMP_PATH,
    PATH: process.env.PATH,
  };
  const client = path.join(directory, "pg_dump_18");
  const fallback = path.join(directory, "pg_dump");
  const executable = (name: string, source: string) =>
    writeFile(name, `#!/usr/bin/env node\n${source}\n`, { mode: 0o700 });
  process.env.DATABASE_URL =
    "postgresql://test:regression-secret@127.0.0.1:1/test";
  process.env.PATH = `${directory}${path.delimiter}${saved.PATH ?? ""}`;
  try {
    await executable(
      client,
      'process.stdout.write("-- PostgreSQL 18 dump\\n");',
    );
    await executable(fallback, 'process.stdout.write("-- PATH client\\n");');
    await t.test(
      "an explicit client takes precedence over an older client on PATH",
      async () => {
        process.env.PG_DUMP_PATH = client;
        assert.equal((await runPgDump()).toString(), "-- PostgreSQL 18 dump\n");
      },
    );
    await t.test(
      "local installations can use PATH without an override",
      async () => {
        delete process.env.PG_DUMP_PATH;
        assert.equal((await runPgDump()).toString(), "-- PATH client\n");
      },
    );
    await t.test(
      "version mismatches identify the application image that needs updating",
      async () => {
        await executable(
          client,
          'process.stderr.write("pg_dump: error: aborting because of server version mismatch\\nserver version: 18.6; pg_dump version: 17.11"); process.exit(1);',
        );
        process.env.PG_DUMP_PATH = client;
        await assert.rejects(runPgDump, (error: Error) => {
          assert.match(error.message, /server version: 18.6/);
          assert.match(error.message, /app container/);
          assert.match(error.message, /PG_DUMP_PATH/);
          return true;
        });
      },
    );
    await t.test(
      "missing clients explain the fix without exposing database credentials",
      async () => {
        process.env.PG_DUMP_PATH = path.join(directory, "missing");
        await assert.rejects(runPgDump, (error: Error) => {
          assert.match(error.message, /client was not found/);
          assert.doesNotMatch(error.message, /regression-secret/);
          assert.equal("spawnargs" in error, false);
          return true;
        });
      },
    );
    await t.test(
      "a missing database URL fails before starting the client",
      async () => {
        delete process.env.DATABASE_URL;
        await assert.rejects(runPgDump, /DATABASE_URL is required/);
      },
    );
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await rm(directory, { recursive: true, force: true });
  }
});
