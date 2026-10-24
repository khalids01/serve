import { files } from "@/lib/file-server";
import { FilesClient } from "./files-client";

export default function FilesPage() {
  return <FilesClient baseUrl={files.baseUrl} />;
}
