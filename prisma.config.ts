import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({
  path: "../../apps/server/.env",
});

export default defineConfig({
  engine: "classic",
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
    // seed: "bun run prisma/seed/index.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
