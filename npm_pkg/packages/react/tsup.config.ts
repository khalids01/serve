import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { resolve: true },
  clean: true,
  sourcemap: false,
  banner: { js: '"use client";' },
  splitting: false,
  noExternal: ["@file-server/contracts"],
  external: ["react", "react-dom", "react/jsx-runtime", "zod"],
});
