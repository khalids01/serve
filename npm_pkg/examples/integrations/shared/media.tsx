"use client";
import {
  createTokenProvider,
  FileServerProvider,
  MediaLibrary,
  type TokenProvider,
} from "@file-server/react";
import "@file-server/react/styles.css";
const tokenProvider = createTokenProvider("/api/file-server/token");
export function MediaPage({
  publicFileServerUrl,
  provideToken = tokenProvider,
}: {
  publicFileServerUrl: string;
  provideToken?: TokenProvider;
}) {
  return (
    <FileServerProvider
      baseUrl={publicFileServerUrl}
      tokenProvider={provideToken}
    >
      <MediaLibrary />
    </FileServerProvider>
  );
}
