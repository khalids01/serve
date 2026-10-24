import assert from "node:assert/strict";
import { test } from "node:test";
import { validateRuntimeEnv } from "./validate-env.mjs";

const valid = {
  DATABASE_URL: "postgresql://user:password@postgres:5432/serve",
  NEXT_PUBLIC_APP_URL: "https://files.example",
  SERVE_BUILD_PUBLIC_URL: "https://files.example",
  BETTER_AUTH_SECRET: "a".repeat(32),
  STORAGE_PROVIDER: "local",
};
test("accepts runtime-only secrets and matching public origin", () =>
  assert.doesNotThrow(() => validateRuntimeEnv(valid)));
test("rejects a runtime URL different from the baked browser URL", () =>
  assert.throws(
    () =>
      validateRuntimeEnv({
        ...valid,
        NEXT_PUBLIC_APP_URL: "https://wrong.example",
      }),
    /Rebuild/,
  ));
test("rejects missing env, SQLite, short secrets and invalid encryption keys", () => {
  for (const env of [
    { ...valid, DATABASE_URL: "" },
    { ...valid, DATABASE_URL: "file:./dev.db" },
    { ...valid, BETTER_AUTH_SECRET: "short" },
    { ...valid, STORAGE_ENCRYPTION_KEY: "invalid" },
    { ...valid, FILE_SERVER_BROWSER_TOKEN_SECRET: "short" },
  ])
    assert.throws(() => validateRuntimeEnv(env));
});
test("configuration errors do not expose credentials", () => {
  assert.throws(
    () =>
      validateRuntimeEnv({
        ...valid,
        DATABASE_URL: "do-not-log-this-password",
      }),
    (error) => !error.message.includes("do-not-log"),
  );
});

test("allows missing Default S3 configuration so Local and saved connections remain usable", () =>
  assert.doesNotThrow(() =>
    validateRuntimeEnv({ ...valid, STORAGE_PROVIDER: "s3" }),
  ));
