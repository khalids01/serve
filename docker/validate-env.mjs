import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
export function validateRuntimeEnv(env) {
  for (const key of [
    "DATABASE_URL",
    "NEXT_PUBLIC_APP_URL",
    "BETTER_AUTH_SECRET",
  ])
    if (!env[key])
      throw new Error(`Set ${key} in Dokploy's Compose Environment settings.`);
  let database;
  try {
    database = new URL(env.DATABASE_URL);
  } catch {
    throw new Error("DATABASE_URL must be a PostgreSQL URL.");
  }
  if (!["postgres:", "postgresql:"].includes(database.protocol))
    throw new Error("DATABASE_URL must use PostgreSQL, not a SQLite file.");
  let origin;
  try {
    origin = new URL(env.NEXT_PUBLIC_APP_URL).origin;
  } catch {
    throw new Error("NEXT_PUBLIC_APP_URL must be an HTTP(S) origin.");
  }
  if (!/^https?:\/\//.test(origin) || origin !== env.NEXT_PUBLIC_APP_URL)
    throw new Error(
      "NEXT_PUBLIC_APP_URL must be an HTTP(S) origin without a trailing slash.",
    );
  if (env.SERVE_BUILD_PUBLIC_URL && env.SERVE_BUILD_PUBLIC_URL !== origin)
    throw new Error(
      "NEXT_PUBLIC_APP_URL differs from this image's build URL. Rebuild with the correct GitHub variable, then redeploy.",
    );
  if (env.BETTER_AUTH_SECRET.length < 32)
    throw new Error(
      "BETTER_AUTH_SECRET must contain at least 32 random characters.",
    );
  if (
    env.FILE_SERVER_BROWSER_TOKEN_SECRET &&
    env.FILE_SERVER_BROWSER_TOKEN_SECRET.length < 32
  )
    throw new Error(
      "FILE_SERVER_BROWSER_TOKEN_SECRET must contain at least 32 random characters.",
    );
  const provider = env.STORAGE_PROVIDER ?? "s3";
  if (!["local", "s3"].includes(provider))
    throw new Error("STORAGE_PROVIDER must be local or s3.");
  if (provider === "s3")
    for (const key of ["S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY", "S3_BUCKET"])
      if (!env[key])
        throw new Error(
          `S3 storage requires ${key}. Set it on the Dokploy service or select STORAGE_PROVIDER=local.`,
        );
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    validateRuntimeEnv(process.env);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
