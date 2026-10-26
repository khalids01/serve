/** Enumerate dropped directories without buffering file contents. Chrome returns directory entries in batches. */
export async function readDroppedFiles(
  transfer: DataTransfer,
  cancelled: () => boolean,
) {
  const roots = Array.from(transfer.items)
    .map((item) => item.webkitGetAsEntry?.())
    .filter((entry): entry is FileSystemEntry => Boolean(entry));
  const files: File[] = [];
  const paths = new Map<File, string>();
  const emptyFolders: string[] = [];
  if (!roots.length)
    return { files: Array.from(transfer.files), paths, emptyFolders };
  const queue = roots.map((entry) => ({ entry, path: entry.name }));
  for (let index = 0; index < queue.length; index++) {
    if (cancelled()) throw new DOMException("Upload cancelled", "AbortError");
    const { entry, path } = queue[index];
    if (entry.isFile) {
      const file = await new Promise<File>((resolve, reject) =>
        (entry as FileSystemFileEntry).file(resolve, reject),
      );
      files.push(file);
      paths.set(file, path);
    } else if (entry.isDirectory) {
      const reader = (entry as FileSystemDirectoryEntry).createReader();
      let children = 0;
      while (true) {
        if (cancelled())
          throw new DOMException("Upload cancelled", "AbortError");
        const batch = await new Promise<FileSystemEntry[]>((resolve, reject) =>
          reader.readEntries(resolve, reject),
        );
        if (!batch.length) break;
        children += batch.length;
        if (queue.length + batch.length > 10000)
          throw new Error(
            "Drop fewer than 10,000 files and folders at a time.",
          );
        queue.push(
          ...batch.map((entry) => ({ entry, path: `${path}/${entry.name}` })),
        );
      }
      if (!children) emptyFolders.push(`${path}/`);
    }
  }
  return { files, paths, emptyFolders };
}
