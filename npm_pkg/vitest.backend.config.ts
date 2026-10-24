import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
export default defineConfig({ resolve: { alias: [{ find: /^@file-server\/server$/, replacement: fileURLToPath(new URL("./packages/server/src/index.ts", import.meta.url)) }, { find: "@", replacement: fileURLToPath(new URL("../src", import.meta.url)) }] }, test: { include: ["tests/backend*.test.ts"], environment: "node" } });
