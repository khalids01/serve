import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { resolve: true },
  clean: true,
  sourcemap: false,
  splitting: false,
  noExternal: ["@file-server/contracts"],
  external: ["zod"],
});
