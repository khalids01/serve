export * from "./client";
export * from "./contracts";
export { createTokenCache, createTokenProvider } from "./tokens";
export type { UploadTransport } from "./upload";
export { UploadError, uploadWithProgress } from "./upload";

import { BrowserFileServerClient, type TokenProvider } from "./client";
import { createTokenCache } from "./tokens";

export function createBrowserClient(options: {
  baseUrl: string;
  tokenProvider: TokenProvider;
  fetch?: typeof globalThis.fetch;
}) {
  return new BrowserFileServerClient(
    options.baseUrl,
    createTokenCache(options.tokenProvider),
    options.fetch ?? globalThis.fetch,
  );
}
