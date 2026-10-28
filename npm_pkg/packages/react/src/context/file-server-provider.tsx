"use client";
import {
  BrowserFileServerClient,
  createTokenCache,
  type TokenProvider,
} from "@skycanvasstudio/serve-client";
import { createContext, useContext, useMemo } from "react";

export type FileServerContextValue = {
  client: BrowserFileServerClient;
  getToken: (forceRefresh?: boolean) => Promise<string>;
};
const FileServerContext = createContext<FileServerContextValue | null>(null);
export type FileServerProviderProps = {
  baseUrl: string;
  tokenProvider: TokenProvider;
  fetch?: typeof globalThis.fetch;
  children: React.ReactNode;
  className?: string;
  theme?: "light" | "dark";
};
export {
  createTokenCache,
  createTokenProvider,
} from "@skycanvasstudio/serve-client";
export function FileServerProvider({
  baseUrl,
  tokenProvider,
  fetch: fetchImpl = globalThis.fetch,
  children,
  className,
  theme,
}: FileServerProviderProps) {
  // A changed provider or URL gets a fresh cache, preventing cross-account reuse.
  const value = useMemo<FileServerContextValue>(() => {
    const getToken = createTokenCache(tokenProvider);
    return {
      client: new BrowserFileServerClient(baseUrl, getToken, fetchImpl),
      getToken,
    };
  }, [baseUrl, fetchImpl, tokenProvider]);
  return (
    <FileServerContext.Provider value={value}>
      <div
        className={["fs-root", className].filter(Boolean).join(" ")}
        data-fs-theme={theme}
      >
        {children}
      </div>
    </FileServerContext.Provider>
  );
}
export function useFileServer() {
  const value = useContext(FileServerContext);
  if (!value)
    throw new Error("useFileServer must be used inside FileServerProvider.");
  return value;
}
