import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
export default defineConfig({
  oxc: { jsx: { runtime: "automatic" } },
  resolve: {
    alias: [
      {
        find: /^@skycanvasstudio\/serve-server$/,
        replacement: fileURLToPath(
          new URL("./packages/server/src/index.ts", import.meta.url),
        ),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("../src", import.meta.url)),
      },
    ],
  },
  test: { include: ["tests/backend*.test.ts"], environment: "node" },
});
