"use client";

import {
  createTokenProvider,
  FileServerProvider,
  MediaLibrary,
} from "@file-server/react";
import "@file-server/react/styles.css";

const tokenProvider = createTokenProvider("/api/file-server/token");

export function FilesClient({ baseUrl }: { baseUrl: string }) {
  return (
    <FileServerProvider baseUrl={baseUrl} tokenProvider={tokenProvider}>
      <MediaLibrary />
    </FileServerProvider>
  );
}
