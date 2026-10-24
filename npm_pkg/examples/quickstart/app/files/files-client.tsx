"use client";

import {
  createTokenProvider,
  FileServerProvider,
  MediaLibrary,
} from "@skycanvasstudio/serve-react";
import "@skycanvasstudio/serve-react/styles.css";

const tokenProvider = createTokenProvider("/api/file-server/token");

export function FilesClient({ baseUrl }: { baseUrl: string }) {
  return (
    <FileServerProvider baseUrl={baseUrl} tokenProvider={tokenProvider}>
      <MediaLibrary />
    </FileServerProvider>
  );
}
