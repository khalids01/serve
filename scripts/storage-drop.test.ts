import assert from "node:assert/strict";
import { test } from "node:test";
import { readDroppedFiles } from "../src/features/storage/storage-drop";

function fileEntry(name: string): FileSystemEntry {
  return {
    name,
    isFile: true,
    isDirectory: false,
    file: (resolve: (file: File) => void) =>
      resolve(new File(["contents"], name)),
  } as unknown as FileSystemEntry;
}
function directoryEntry(
  name: string,
  entries: FileSystemEntry[],
): FileSystemEntry {
  return {
    name,
    isFile: false,
    isDirectory: true,
    createReader() {
      let offset = 0;
      return {
        readEntries(resolve: (entries: FileSystemEntry[]) => void) {
          const batch = entries.slice(offset, offset + 100);
          offset += 100;
          resolve(batch);
        },
      };
    },
  } as unknown as FileSystemEntry;
}
function transfer(entries: FileSystemEntry[]) {
  return {
    items: entries.map((entry) => ({ webkitGetAsEntry: () => entry })),
    files: [],
  } as unknown as DataTransfer;
}

test("folder drops read every browser batch and preserve nested paths and empty folders", async () => {
  const entries = Array.from({ length: 205 }, (_, index) =>
    fileEntry(`${index}.txt`),
  );
  const result = await readDroppedFiles(
    transfer([
      directoryEntry("Photos", [
        ...entries,
        directoryEntry("Empty", []),
        directoryEntry("Nested", [fileEntry("image.jpg")]),
      ]),
    ]),
    () => false,
  );
  assert.equal(result.files.length, 206);
  assert.equal(new Set([...result.paths.values()]).size, 206);
  assert(
    result.files.some(
      (file) => result.paths.get(file) === "Photos/Nested/image.jpg",
    ),
  );
  assert.deepEqual(result.emptyFolders, ["Photos/Empty/"]);
});

test("drop preparation can be cancelled and ordinary files have a fallback", async () => {
  await assert.rejects(
    () =>
      readDroppedFiles(
        transfer([directoryEntry("Folder", [fileEntry("a.txt")])]),
        () => true,
      ),
    { name: "AbortError" },
  );
  const file = new File(["plain"], "plain.txt");
  const result = await readDroppedFiles(
    { items: [], files: [file] } as unknown as DataTransfer,
    () => false,
  );
  assert.deepEqual(result.files, [file]);
});
