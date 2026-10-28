import { NextResponse } from "next/server";
import { maxFileSizeBytes } from "@/config";
import { requireSession, sessionApi } from "@/lib/session-api";
import {
  BROWSE_PAGE_SIZE,
  browseQuery,
  STORAGE_VIEW_PAGE_SIZE,
} from "@/lib/storage/browse";
import { browseImageGroups } from "@/lib/storage/grouped-browse";
import {
  resolveBrowseLocation,
  StorageLocationError,
} from "@/lib/storage/locations";
import {
  boundedJSON,
  browseTrash,
  checkStorageOrigin,
  protectedStoragePath,
  storageOperation,
} from "@/lib/storage/manager";

export const runtime = "nodejs";
export function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    const { id } = await context.params;
    const { prefix, cursor } = browseQuery.parse(
      Object.fromEntries(new URL(request.url).searchParams),
    );
    if (prefix.split("/").includes(".serve-trash"))
      throw new StorageLocationError(
        "Use the Trash view to access deleted items.",
        403,
      );
    const trash = new URL(request.url).searchParams.get("trash") === "1";
    const { storage, scope, enabled, namespacePrefix } =
      await resolveBrowseLocation(user, id);
    const page = trash
      ? await browseTrash(storage, user.id, cursor)
      : await browseImageGroups(storage, prefix, cursor, {
          namespacePrefix,
          ownerId: scope === "namespace" ? user.id : undefined,
        });
    page.entries = page.entries
      .filter((entry) => !entry.key.split("/").includes(".serve-trash"))
      .map((entry) => ({
        ...entry,
        protected: protectedStoragePath(entry.key, scope),
      }));
    return NextResponse.json(
      {
        ...page,
        scope,
        pageSize: trash ? BROWSE_PAGE_SIZE : STORAGE_VIEW_PAGE_SIZE,
        enabled,
        writable: enabled && !trash && !protectedStoragePath(prefix, scope),
        maxUploadBytes: Math.min(
          maxFileSizeBytes(),
          storage.maxWriteBytes ?? Infinity,
        ),
      },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  });
}

export function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  return sessionApi(async () => {
    const user = await requireSession(request);
    checkStorageOrigin(request);
    const { id } = await context.params;
    const action = await boundedJSON(request);
    await storageOperation(user, id, action);
    return NextResponse.json(
      { success: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  });
}
