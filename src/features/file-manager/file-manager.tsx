"use client";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Clipboard,
  Clock,
  Copy,
  Download,
  File,
  Folder,
  FolderPlus,
  HardDrive,
  LayoutGrid,
  List,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Scissors,
  Search,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ImageCropDialog } from "@/features/applications/components/image-crop-dialog";
import { StorageLocationSelect } from "@/features/storage/location-select";

type Entry = {
  id: string;
  originalName: string;
  kind: string;
  contentType: string;
  sizeBytes: number;
  folderId: string | null;
  starred: boolean;
  storageLocationId: string;
  storageLocationName?: string;
  urls: { content: string; image: string | null; placeholder: string | null };
};
type Directory = { id: string; name: string; parentId: string | null };
function directoryPath(id: string, tree: Directory[]) {
  const names: string[] = [];
  const seen = new Set<string>();
  let folder = tree.find((value) => value.id === id);
  while (folder && !seen.has(folder.id)) {
    seen.add(folder.id);
    names.unshift(folder.name);
    folder = tree.find((value) => value.id === folder?.parentId);
  }
  return names.join(" / ");
}
type Listing = {
  files: Entry[];
  folders: Directory[];
  tree: Directory[];
  pagination: { page: number; pages: number; total: number };
  defaultStorageLocationId: string;
};
type Position = { view: string; folderId: string | null };
type QueueItem = {
  id: string;
  file: globalThis.File;
  status: "waiting" | "uploading" | "done" | "failed" | "cancelled";
  progress: number;
  error?: string;
  applicationId: string;
  folderId: string | null;
  location: string;
};
const bytes = (value: number) =>
  value < 1024
    ? `${value} B`
    : value < 1048576
      ? `${(value / 1024).toFixed(1)} KB`
      : `${(value / 1048576).toFixed(1)} MB`;
async function api(url: string, body?: unknown) {
  const response = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Request failed");
  if (data.failed)
    throw new Error(
      `${data.failed} items could not be deleted. Retry after checking storage.`,
    );
  return data;
}
export function FileManager() {
  const [apps, setApps] = useState<{ id: string; name: string }[]>([]),
    [applicationId, setApplicationId] = useState(""),
    [data, setData] = useState<Listing>(),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(false),
    [busy, setBusy] = useState(false);
  const [history, setHistory] = useState<Position[]>([
      { view: "files", folderId: null },
    ]),
    [cursor, setCursor] = useState(0),
    [page, setPage] = useState(1),
    [search, setSearch] = useState(""),
    [sort, setSort] = useState("name"),
    [kind, setKind] = useState("all"),
    [layout, setLayout] = useState("grid"),
    [selection, setSelection] = useState<string[]>([]),
    [preview, setPreview] = useState<Entry>(),
    [rename, setRename] = useState<{
      id: string;
      kind: string;
      name: string;
    }>(),
    [newFolder, setNewFolder] = useState(false),
    [name, setName] = useState("");
  const [crop, setCrop] = useState<Entry>();
  const [clipboard, setClipboard] = useState<{
      action: "move" | "copy";
      fileIds: string[];
      folderIds: string[];
    }>(),
    [transfer, setTransfer] = useState<"move" | "copy">(),
    [target, setTarget] = useState(""),
    [targetStorage, setTargetStorage] = useState(""),
    [location, setLocation] = useState("default"),
    [queue, setQueue] = useState<QueueItem[]>([]);
  const requests = useRef(new Map<string, XMLHttpRequest>()),
    fileInput = useRef<HTMLInputElement>(null),
    lastSelected = useRef<string | undefined>(undefined),
    generation = useRef(0);
  const position = history[cursor],
    endpoint = `/api/file-manager/${applicationId}`;
  const navigate = (folderId: string | null, view = "files") => {
    setHistory((value) => [...value.slice(0, cursor + 1), { folderId, view }]);
    setCursor(cursor + 1);
    setPage(1);
    setSelection([]);
    setSearch("");
  };
  useEffect(() => {
    let active = true;
    api("/api/applications")
      .then((value) => {
        if (!active) return;
        setApps(value.applications);
        const requested = new URLSearchParams(window.location.search).get(
          "applicationId",
        );
        setApplicationId(
          value.applications.some((app: { id: string }) => app.id === requested)
            ? requested
            : (value.applications[0]?.id ?? ""),
        );
      })
      .catch((cause) => setError(cause.message));
    return () => {
      active = false;
    };
  }, []);
  const load = useCallback(async () => {
    if (!applicationId) return;
    const version = ++generation.current;
    setLoading(true);
    try {
      const value = await api(
        `${endpoint}?${new URLSearchParams({ view: position.view, folderId: position.folderId ?? "", page: String(page), search, sort, kind })}`,
      );
      if (version === generation.current) {
        setData(value);
        setError("");
      }
    } catch (cause) {
      if (version === generation.current)
        setError(
          cause instanceof Error ? cause.message : "Unable to load files",
        );
    } finally {
      if (version === generation.current) setLoading(false);
    }
  }, [applicationId, endpoint, position, page, search, sort, kind]);
  const refresh = useRef(load);
  refresh.current = load;
  useEffect(() => {
    const timer = setTimeout(() => void load(), 180);
    return () => clearTimeout(timer);
  }, [load]);
  const defaultStorageLocationId = data?.defaultStorageLocationId;
  useEffect(() => {
    if (defaultStorageLocationId) setLocation(defaultStorageLocationId);
  }, [defaultStorageLocationId]);
  useEffect(() => {
    if (!applicationId) return;
    generation.current++;
    setData(undefined);
    setSelection([]);
    setClipboard(undefined);
    setCrop(undefined);
    setPreview(undefined);
    setRename(undefined);
    setNewFolder(false);
    setTransfer(undefined);
    setHistory([{ view: "files", folderId: null }]);
    setCursor(0);
    setPage(1);
    setSearch("");
  }, [applicationId]);
  const items = [
    ...(data?.folders.map((folder) => ({
      id: folder.id,
      type: "folder" as const,
      name: folder.name,
      folder,
    })) ?? []),
    ...(data?.files.map((file) => ({
      id: file.id,
      type: "file" as const,
      name: file.originalName,
      file,
    })) ?? []),
  ];
  const selected = () => ({
    fileIds:
      data?.files
        .filter((file) => selection.includes(file.id))
        .map((file) => file.id) ?? [],
    folderIds:
      data?.folders
        .filter((folder) => selection.includes(folder.id))
        .map((folder) => folder.id) ?? [],
  });
  const act = async (body: unknown) => {
    setBusy(true);
    try {
      await api(endpoint, body);
      setSelection([]);
      return true;
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Operation failed");
      return false;
    } finally {
      await load();
      setBusy(false);
    }
  };
  const transferItems = (action: "move" | "copy") => {
    if (!selection.length) return;
    setTransfer(action);
    setTarget(position.folderId ?? "");
    setTargetStorage("");
  };
  const copy = (action: "move" | "copy") => {
    if (selection.length) {
      setClipboard({ action, ...selected() });
      toast.success(
        action === "move"
          ? "Ready to move: open a folder and paste"
          : "Copied selection: open a folder and paste",
      );
    }
  };
  const paste = () => {
    if (clipboard && position.view === "files")
      void act({ ...clipboard, folderId: position.folderId }).then((ok) => {
        if (ok && clipboard.action === "move") setClipboard(undefined);
      });
  };
  const remove = () => {
    if (!selection.length) return;
    if (position.view === "trash") {
      if (confirm("Permanently delete selected items? This cannot be undone."))
        void act({ action: "purge", ...selected() });
    } else void act({ action: "trash", ...selected() });
  };
  const renameSelected = () => {
    const item = items.find((item) => selection.includes(item.id));
    if (item && selection.length === 1) {
      setRename({ id: item.id, kind: item.type, name: item.name });
      setName(item.name);
    }
  };
  const openSelected = () => {
    const item = items.find((item) => selection.includes(item.id));
    if (item?.type === "folder" && position.view !== "trash") navigate(item.id);
    else if (item?.type === "file") setPreview(item.file);
  };
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (
        (event.target as HTMLElement).closest(
          "input,textarea,select,[role=dialog],[contenteditable=true]",
        )
      )
        return;
      const modifier = event.ctrlKey || event.metaKey;
      if (modifier && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setSelection(items.map((item) => item.id));
      } else if (modifier && event.key.toLowerCase() === "c") {
        event.preventDefault();
        copy("copy");
      } else if (modifier && event.key.toLowerCase() === "x") {
        event.preventDefault();
        copy("move");
      } else if (modifier && event.key.toLowerCase() === "v") {
        event.preventDefault();
        paste();
      } else if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        remove();
      } else if (event.key === "F2") {
        event.preventDefault();
        renameSelected();
      } else if (event.key === "Enter") openSelected();
      else if (event.key === "Escape") setSelection([]);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });
  const patchQueue = useCallback(
    (id: string, patch: Partial<QueueItem>) =>
      setQueue((value) =>
        value.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      ),
    [],
  );
  useEffect(() => {
    for (const item of queue) {
      if (requests.current.size >= 3) break;
      if (item.status !== "waiting" || requests.current.has(item.id)) continue;
      const xhr = new XMLHttpRequest();
      requests.current.set(item.id, xhr);
      patchQueue(item.id, { status: "uploading" });
      xhr.open("POST", `/api/file-manager/${item.applicationId}/upload`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable)
          patchQueue(item.id, {
            progress: Math.round((event.loaded / event.total) * 100),
          });
      };
      xhr.onload = () => {
        requests.current.delete(item.id);
        let message = "Upload failed";
        try {
          message = JSON.parse(xhr.responseText).error ?? message;
        } catch {}
        patchQueue(
          item.id,
          xhr.status >= 200 && xhr.status < 300
            ? { status: "done", progress: 100 }
            : { status: "failed", error: message },
        );
        void refresh.current();
      };
      xhr.onerror = () => {
        requests.current.delete(item.id);
        patchQueue(item.id, {
          status: "failed",
          error: "Network error. Retry the upload.",
        });
      };
      xhr.onabort = () => {
        requests.current.delete(item.id);
        patchQueue(item.id, { status: "cancelled" });
      };
      const form = new FormData();
      form.set("file", item.file);
      form.set("storageLocationId", item.location);
      if (item.folderId) form.set("folderId", item.folderId);
      xhr.send(form);
    }
  }, [queue, patchQueue]);
  useEffect(() => {
    const activeRequests = requests.current;
    return () => {
      for (const xhr of activeRequests.values()) xhr.abort();
    };
  }, []);
  const upload = (files: FileList | globalThis.File[]) => {
    if (!applicationId || position.view !== "files") return;
    setQueue((value) => [
      ...value,
      ...Array.from(files)
        .filter((file) => file.size > 0)
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
          status: "waiting" as const,
          progress: 0,
          applicationId,
          folderId: position.folderId,
          location,
        })),
    ]);
  };
  const choose = (id: string, event: React.MouseEvent) => {
    if (
      event.shiftKey &&
      lastSelected.current &&
      items.some((item) => item.id === lastSelected.current)
    ) {
      const start = items.findIndex((item) => item.id === lastSelected.current),
        end = items.findIndex((item) => item.id === id);
      setSelection(
        items
          .slice(Math.min(start, end), Math.max(start, end) + 1)
          .map((item) => item.id),
      );
    } else if (event.ctrlKey || event.metaKey)
      setSelection((value) =>
        value.includes(id)
          ? value.filter((value) => value !== id)
          : [...value, id],
      );
    else setSelection([id]);
    lastSelected.current = id;
  };
  const drop = (event: React.DragEvent, folderId: string | null) => {
    event.preventDefault();
    event.stopPropagation();
    const raw = event.dataTransfer.getData("application/x-serve-items");
    if (raw) {
      try {
        const value = JSON.parse(raw);
        if (value.applicationId === applicationId)
          void act({ action: "move", ...value.items, folderId });
      } catch {
        toast.error("Unable to move selection");
      }
    } else if (event.dataTransfer.files.length) {
      if (folderId === position.folderId) upload(event.dataTransfer.files);
      else
        setQueue((value) => [
          ...value,
          ...Array.from(event.dataTransfer.files).map((file) => ({
            id: crypto.randomUUID(),
            file,
            status: "waiting" as const,
            progress: 0,
            applicationId,
            folderId,
            location,
          })),
        ]);
    }
  };
  const path: Directory[] = [];
  let current = data?.tree.find((folder) => folder.id === position.folderId);
  const seen = new Set<string>();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    path.unshift(current);
    current = data?.tree.find((folder) => folder.id === current?.parentId);
  }
  const tree = (parentId: string | null, depth = 0): React.ReactNode =>
    depth > 30
      ? null
      : data?.tree
          .filter((folder) => folder.parentId === parentId)
          .map((folder) => (
            <div key={folder.id}>
              <button
                type="button"
                className={`flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-sm hover:bg-muted ${position.folderId === folder.id ? "bg-muted font-medium" : ""}`}
                style={{ paddingLeft: 12 + depth * 12 }}
                onClick={() => navigate(folder.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => drop(event, folder.id)}
              >
                <Folder className="size-4 shrink-0 text-amber-500" />
                <span className="truncate">{folder.name}</span>
              </button>
              {tree(folder.id, depth + 1)}
            </div>
          ));
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col p-3 md:p-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Files</h1>
          <p className="text-sm text-muted-foreground">
            Organize, preview, and move files across your storage.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            aria-label="Application"
            disabled={busy}
            className="h-9 max-w-60 rounded-md border bg-background px-3 text-sm"
            value={applicationId}
            onChange={(event) => setApplicationId(event.target.value)}
          >
            {apps.map((app) => (
              <option key={app.id} value={app.id}>
                {app.name}
              </option>
            ))}
          </select>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/storage">
              <HardDrive className="mr-2 size-4" />
              Storage
            </Link>
          </Button>
        </div>
      </header>
      {!apps.length && !error ? (
        <p className="p-10 text-center text-muted-foreground">
          Create an{" "}
          <Link className="underline" href="/dashboard/applications">
            application
          </Link>{" "}
          to manage its files.
        </p>
      ) : (
        <div className="flex flex-1 overflow-hidden rounded-xl border bg-card shadow-sm">
          <aside className="hidden w-52 shrink-0 space-y-1 overflow-auto border-r bg-muted/20 p-2 md:block">
            {[
              { view: "files", label: "All files", icon: Folder },
              { view: "recent", label: "Recent", icon: Clock },
              { view: "starred", label: "Starred", icon: Star },
              { view: "trash", label: "Trash", icon: Trash2 },
            ].map((item) => (
              <button
                type="button"
                key={item.view}
                className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm ${position.view === item.view && !position.folderId ? "bg-muted font-medium" : "hover:bg-muted"}`}
                onClick={() => navigate(null, item.view)}
              >
                <item.icon className="size-4" />
                {item.label}
              </button>
            ))}
            <p className="px-3 pb-1 pt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Folders
            </p>
            {tree(null)}
            <div className="space-y-2 border-t p-2 pt-4">
              <label
                htmlFor="default-storage"
                className="text-xs text-muted-foreground"
              >
                Application default storage
              </label>
              <StorageLocationSelect
                value={location}
                disabled={busy}
                onChange={(value) =>
                  void act({ action: "set-storage", storageLocationId: value })
                }
              />
            </div>
          </aside>
          <main
            className="min-w-0 flex-1"
            onDragOver={(event) => {
              if (position.view === "files") event.preventDefault();
            }}
            onDrop={(event) => drop(event, position.folderId)}
          >
            <div className="flex flex-wrap items-center gap-1 border-b p-2">
              <Button
                size="icon"
                variant="ghost"
                aria-label="Back"
                disabled={cursor === 0}
                onClick={() => {
                  setCursor(cursor - 1);
                  setSelection([]);
                  setPage(1);
                }}
              >
                <ArrowLeft className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Forward"
                disabled={cursor === history.length - 1}
                onClick={() => {
                  setCursor(cursor + 1);
                  setSelection([]);
                  setPage(1);
                }}
              >
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Parent folder"
                disabled={!position.folderId}
                onClick={() =>
                  navigate(
                    data?.tree.find((folder) => folder.id === position.folderId)
                      ?.parentId ?? null,
                  )
                }
              >
                <ArrowUp className="size-4" />
              </Button>
              <nav
                aria-label="Breadcrumb"
                className="flex min-w-0 flex-1 items-center gap-1 overflow-auto text-sm"
              >
                <button
                  type="button"
                  className="shrink-0 rounded px-2 py-1 hover:bg-muted"
                  onClick={() => navigate(null)}
                >
                  {position.view === "files" ? "All files" : position.view}
                </button>
                {path.map((folder) => (
                  <span
                    key={folder.id}
                    className="flex shrink-0 items-center gap-1"
                  >
                    <span className="text-muted-foreground">/</span>
                    <button
                      type="button"
                      className="max-w-40 truncate rounded px-2 py-1 hover:bg-muted"
                      onClick={() => navigate(folder.id)}
                    >
                      {folder.name}
                    </button>
                  </span>
                ))}
              </nav>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Refresh"
                onClick={() => void load()}
              >
                <RefreshCw
                  className={`size-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-b p-3">
              {position.view === "files" && (
                <>
                  <Button
                    size="sm"
                    disabled={busy || !applicationId}
                    onClick={() => fileInput.current?.click()}
                  >
                    <Upload className="mr-2 size-4" />
                    Upload
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy}
                    onClick={() => {
                      setName("");
                      setNewFolder(true);
                    }}
                  >
                    <FolderPlus className="mr-2 size-4" />
                    New folder
                  </Button>
                </>
              )}
              <input
                ref={fileInput}
                type="file"
                multiple
                className="hidden"
                onChange={(event) => {
                  if (event.target.files) upload(event.target.files);
                  event.target.value = "";
                }}
              />
              <div className="relative ml-auto">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  aria-label="Search files"
                  className="h-9 w-44 pl-8 lg:w-60"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search this application"
                />
              </div>
              <select
                aria-label="File type"
                className="h-9 rounded-md border bg-background px-2 text-sm"
                value={kind}
                onChange={(event) => {
                  setKind(event.target.value);
                  setPage(1);
                }}
              >
                {["all", "image", "video", "audio"].map((value) => (
                  <option key={value} value={value}>
                    {value === "all" ? "All types" : value}
                  </option>
                ))}
              </select>
              <select
                aria-label="Sort by"
                className="h-9 rounded-md border bg-background px-2 text-sm"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                {["name", "date", "size", "type"].map((value) => (
                  <option key={value} value={value}>
                    Sort: {value}
                  </option>
                ))}
              </select>
              <Button
                size="icon"
                variant="outline"
                aria-label={layout === "grid" ? "List view" : "Grid view"}
                onClick={() => setLayout(layout === "grid" ? "list" : "grid")}
              >
                {layout === "grid" ? (
                  <List className="size-4" />
                ) : (
                  <LayoutGrid className="size-4" />
                )}
              </Button>
              <select
                aria-label="View"
                className="h-9 rounded border bg-background px-2 text-sm md:hidden"
                value={position.view}
                onChange={(event) => navigate(null, event.target.value)}
              >
                {["files", "recent", "starred", "trash"].map((view) => (
                  <option key={view}>{view}</option>
                ))}
              </select>
            </div>
            <div className="flex min-h-12 flex-wrap items-center gap-1 border-b px-3 py-2 text-xs">
              <label className="mr-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  aria-label="Select all displayed items"
                  checked={
                    !!items.length &&
                    items.every((item) => selection.includes(item.id))
                  }
                  onChange={(event) =>
                    setSelection(
                      event.target.checked ? items.map((item) => item.id) : [],
                    )
                  }
                />
                {selection.length
                  ? `${selection.length} selected`
                  : `${data?.pagination.total ?? 0} files`}
              </label>
              {!!selection.length &&
                (position.view === "trash" ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={() =>
                        void act({ action: "restore", ...selected() })
                      }
                    >
                      Restore
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={remove}
                    >
                      Delete permanently
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={() => transferItems("move")}
                    >
                      Move
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={() => transferItems("copy")}
                    >
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy || selection.length !== 1}
                      onClick={renameSelected}
                    >
                      Rename
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={
                        busy ||
                        !data?.files.some((file) => selection.includes(file.id))
                      }
                      onClick={() =>
                        void act({
                          action: "star",
                          ...selected(),
                          starred: !data?.files
                            .filter((file) => selection.includes(file.id))
                            .every((file) => file.starred),
                        })
                      }
                    >
                      <Star className="mr-1 size-3" />
                      Star
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy}
                      onClick={remove}
                    >
                      <Trash2 className="mr-1 size-3" />
                      Trash
                    </Button>
                  </>
                ))}
              {clipboard && position.view === "files" && (
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy}
                  onClick={paste}
                >
                  <Clipboard className="mr-1 size-3" />
                  Paste
                </Button>
              )}
              {position.view === "trash" && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto"
                  disabled={busy}
                  onClick={() => {
                    if (
                      confirm(
                        "Permanently delete every item in this application's Trash?",
                      )
                    )
                      void act({ action: "empty-trash" });
                  }}
                >
                  Empty trash
                </Button>
              )}
            </div>
            {error && (
              <div
                role="alert"
                className="m-4 rounded border border-destructive/30 p-3 text-sm"
              >
                {error}{" "}
                <button
                  type="button"
                  className="underline"
                  onClick={() => void load()}
                >
                  Retry
                </button>
              </div>
            )}
            <div
              aria-busy={loading || busy}
              className={`min-h-80 p-3 ${layout === "grid" ? "grid content-start grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6" : "space-y-1"}`}
            >
              {items.map((item) => (
                <ContextMenu key={item.id}>
                  <ContextMenuTrigger asChild>
                    <div
                      draggable={position.view !== "trash" && !busy}
                      onDragStart={(event) => {
                        const ids = selection.includes(item.id)
                          ? selection
                          : [item.id];
                        event.dataTransfer.setData(
                          "application/x-serve-items",
                          JSON.stringify({
                            applicationId,
                            items: {
                              fileIds: data?.files
                                .filter((file) => ids.includes(file.id))
                                .map((file) => file.id),
                              folderIds: data?.folders
                                .filter((folder) => ids.includes(folder.id))
                                .map((folder) => folder.id),
                            },
                          }),
                        );
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      onDragOver={
                        item.type === "folder"
                          ? (event) => event.preventDefault()
                          : undefined
                      }
                      onDrop={
                        item.type === "folder"
                          ? (event) => drop(event, item.id)
                          : undefined
                      }
                      tabIndex={0}
                      aria-label={`${item.type}: ${item.name}`}
                      aria-selected={selection.includes(item.id)}
                      role="option"
                      onKeyDown={(event) => {
                        if (event.key === " " || event.key === "Enter") {
                          event.preventDefault();
                          event.stopPropagation();
                          setSelection([item.id]);
                          if (event.key === "Enter") {
                            if (
                              item.type === "folder" &&
                              position.view !== "trash"
                            )
                              navigate(item.id);
                            else if (item.type === "file")
                              setPreview(item.file);
                          }
                        }
                      }}
                      onClick={(event) => choose(item.id, event)}
                      onContextMenu={() => {
                        setSelection((value) =>
                          value.includes(item.id) ? value : [item.id],
                        );
                      }}
                      onDoubleClick={() => {
                        if (item.type === "folder" && position.view !== "trash")
                          navigate(item.id);
                        else if (item.type === "file") setPreview(item.file);
                      }}
                      className={`group relative cursor-default select-none rounded-lg border p-2 outline-none focus-visible:ring-2 focus-visible:ring-primary ${selection.includes(item.id) ? "border-primary/50 bg-primary/10" : "border-transparent hover:bg-muted/60"} ${layout === "list" ? "flex items-center gap-3" : ""}`}
                    >
                      <div
                        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md ${layout === "grid" ? "mb-2 aspect-[4/3] bg-muted/30" : "size-9"}`}
                      >
                        {item.type === "folder" ? (
                          <Folder
                            className={
                              layout === "grid"
                                ? "size-16 fill-amber-400/20 text-amber-500"
                                : "size-7 text-amber-500"
                            }
                          />
                        ) : item.file.kind === "image" ? (
                          // biome-ignore lint/performance/noImgElement: The URL already uses Serve delivery.
                          <img
                            alt=""
                            loading="lazy"
                            draggable={false}
                            className="size-full object-contain"
                            src={
                              item.file.urls.placeholder ??
                              item.file.urls.image ??
                              item.file.urls.content
                            }
                          />
                        ) : (
                          <File
                            className={
                              layout === "grid"
                                ? "size-12 text-muted-foreground"
                                : "size-6 text-muted-foreground"
                            }
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm" title={item.name}>
                          {item.name}
                        </p>
                        {item.type === "file" && (
                          <p className="truncate text-xs text-muted-foreground">
                            {bytes(item.file.sizeBytes)} ·{" "}
                            {item.file.storageLocationName ??
                              (item.file.storageLocationId === "local"
                                ? "Local"
                                : item.file.storageLocationId === "default"
                                  ? "Default"
                                  : "Saved S3")}
                            {item.file.starred ? " · ★" : ""}
                          </p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            aria-label={`Actions for ${item.name}`}
                            className={`size-7 ${layout === "grid" ? "absolute right-1 top-1 bg-background/80" : ""}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelection([item.id]);
                            }}
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {position.view === "trash" ? (
                            <>
                              <DropdownMenuItem
                                onSelect={() =>
                                  void act({
                                    action: "restore",
                                    fileIds:
                                      item.type === "file" ? [item.id] : [],
                                    folderIds:
                                      item.type === "folder" ? [item.id] : [],
                                  })
                                }
                              >
                                Restore
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={remove}>
                                Delete permanently
                              </DropdownMenuItem>
                            </>
                          ) : (
                            <>
                              <DropdownMenuItem
                                onSelect={() => {
                                  if (item.type === "folder") navigate(item.id);
                                  else setPreview(item.file);
                                }}
                              >
                                Open
                              </DropdownMenuItem>
                              {item.type === "file" && (
                                <DropdownMenuItem asChild>
                                  <a
                                    href={`${item.file.urls.content}?download=1`}
                                    download={item.name}
                                  >
                                    <Download className="mr-2 size-4" />
                                    Download
                                  </a>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onSelect={renameSelected}>
                                <Pencil className="mr-2 size-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => copy("copy")}>
                                <Copy className="mr-2 size-4" />
                                Copy
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => copy("move")}>
                                <Scissors className="mr-2 size-4" />
                                Cut
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={remove}>
                                <Trash2 className="mr-2 size-4" />
                                Move to Trash
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </ContextMenuTrigger>
                  <ContextMenuContent>
                    {position.view === "trash" ? (
                      <>
                        <ContextMenuItem
                          onSelect={() =>
                            void act({ action: "restore", ...selected() })
                          }
                        >
                          Restore
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={remove}>
                          Delete permanently
                        </ContextMenuItem>
                      </>
                    ) : (
                      <>
                        <ContextMenuItem onSelect={openSelected}>
                          Open
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={renameSelected}>
                          Rename
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={() => copy("copy")}>
                          Copy
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={() => copy("move")}>
                          Cut
                        </ContextMenuItem>
                        <ContextMenuItem disabled={!clipboard} onSelect={paste}>
                          Paste here
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={() => transferItems("move")}>
                          Move to…
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={() => transferItems("copy")}>
                          Copy to…
                        </ContextMenuItem>
                        <ContextMenuItem onSelect={remove}>
                          Move to Trash
                        </ContextMenuItem>
                      </>
                    )}
                  </ContextMenuContent>
                </ContextMenu>
              ))}
              {!items.length && !loading && !error && (
                <p className="col-span-full py-20 text-center text-sm text-muted-foreground">
                  {position.view === "trash"
                    ? "Trash is empty"
                    : search
                      ? "No matching files"
                      : "This folder is empty. Drop files here or use Upload."}
                </p>
              )}
            </div>
            <footer className="flex items-center justify-between border-t p-3 text-xs text-muted-foreground">
              <span>
                Ctrl/⌘ click to select · Double-click to open · F2 to rename
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage(page - 1);
                    setSelection([]);
                  }}
                >
                  Previous
                </Button>
                <span>
                  {page} / {Math.max(1, data?.pagination.pages ?? 1)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={page >= (data?.pagination.pages ?? 1)}
                  onClick={() => {
                    setPage(page + 1);
                    setSelection([]);
                  }}
                >
                  Next
                </Button>
              </div>
            </footer>
          </main>
        </div>
      )}
      {!!queue.length && (
        <section
          aria-label="Upload queue"
          className="mt-4 rounded-xl border p-3"
        >
          <div className="mb-2 flex justify-between text-sm">
            <span>
              Uploads · {queue.filter((item) => item.status === "done").length}/
              {queue.length} complete
            </span>
            <button
              type="button"
              className="underline"
              onClick={() =>
                setQueue((value) =>
                  value.filter(
                    (item) =>
                      item.status === "waiting" || item.status === "uploading",
                  ),
                )
              }
            >
              Clear completed
            </button>
          </div>
          <div className="max-h-44 space-y-2 overflow-auto">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-xs">
                <span className="w-48 truncate" title={item.file.name}>
                  {item.file.name}
                </span>
                <progress
                  aria-label={`Upload ${item.file.name}`}
                  className="h-1 flex-1"
                  max={100}
                  value={item.progress}
                />
                <span className="w-24">
                  {item.status === "uploading"
                    ? `${item.progress}%`
                    : item.status}
                </span>
                {item.error && (
                  <span
                    className="max-w-64 truncate text-destructive"
                    title={item.error}
                  >
                    {item.error}
                  </span>
                )}
                {["waiting", "uploading"].includes(item.status) ? (
                  <button
                    type="button"
                    onClick={() => {
                      requests.current.get(item.id)?.abort();
                      patchQueue(item.id, { status: "cancelled" });
                    }}
                  >
                    Cancel
                  </button>
                ) : ["failed", "cancelled"].includes(item.status) ? (
                  <button
                    type="button"
                    className="underline"
                    onClick={() =>
                      patchQueue(item.id, {
                        status: "waiting",
                        progress: 0,
                        error: undefined,
                      })
                    }
                  >
                    Retry
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}
      <Dialog
        open={newFolder || !!rename}
        onOpenChange={(value) => {
          if (!value) {
            setNewFolder(false);
            setRename(undefined);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{newFolder ? "New folder" : "Rename"}</DialogTitle>
            <DialogDescription>
              Choose a name without slashes.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void act(
                newFolder
                  ? { action: "new-folder", name, parentId: position.folderId }
                  : { action: "rename", ...rename, name },
              ).then((ok) => {
                if (ok) {
                  setNewFolder(false);
                  setRename(undefined);
                }
              });
            }}
          >
            <Input
              aria-label="Name"
              autoFocus
              required
              maxLength={255}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <Button disabled={busy} className="mt-4" type="submit">
              Save
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!transfer}
        onOpenChange={(value) => {
          if (!value) setTransfer(undefined);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {transfer === "move" ? "Move items" : "Copy items"}
            </DialogTitle>
            <DialogDescription>
              Choose a folder and optionally a storage destination. Moves keep
              the same file URLs. Storage copies are verified before the source
              is released.
            </DialogDescription>
          </DialogHeader>
          <label className="text-sm">
            Destination folder
            <select
              className="mt-1 h-10 w-full rounded border bg-background px-3"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
            >
              <option value="">All files (root)</option>
              {data?.tree.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {directoryPath(folder.id, data.tree)}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Storage destination
            <select
              className="mt-1 h-10 w-full rounded border bg-background px-3"
              value={targetStorage ? "change" : "keep"}
              onChange={(event) =>
                setTargetStorage(event.target.value === "keep" ? "" : location)
              }
            >
              <option value="keep">Keep current storage</option>
              <option value="change">Choose storage</option>
            </select>
          </label>
          {!!targetStorage && (
            <StorageLocationSelect
              value={targetStorage}
              onChange={setTargetStorage}
            />
          )}
          <Button
            disabled={busy}
            onClick={() =>
              void act({
                action: transfer,
                ...selected(),
                folderId: target || null,
                storageLocationId: targetStorage || undefined,
              }).then((ok) => {
                if (ok) setTransfer(undefined);
              })
            }
          >
            {busy ? "Working…" : transfer === "move" ? "Move" : "Copy"}
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog
        open={!!preview}
        onOpenChange={(value) => {
          if (!value) setPreview(undefined);
        }}
      >
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-4">
              {preview?.originalName}
            </DialogTitle>
            <DialogDescription>
              {preview
                ? `${preview.contentType} · ${bytes(preview.sizeBytes)}`
                : "File preview"}
            </DialogDescription>
          </DialogHeader>
          {preview &&
            (preview.kind === "image" ? (
              // biome-ignore lint/performance/noImgElement: The URL already uses Serve delivery.
              <img
                alt={preview.originalName}
                className="max-h-[65vh] w-full object-contain"
                src={preview.urls.image ?? preview.urls.content}
              />
            ) : preview.kind === "video" ? (
              // biome-ignore lint/a11y/useMediaCaption: Uploaded media may not have a caption track.
              <video
                controls
                className="max-h-[65vh] w-full"
                src={preview.urls.content}
              />
            ) : preview.kind === "audio" ? (
              // biome-ignore lint/a11y/useMediaCaption: Uploaded media may not have a caption track.
              <audio controls className="w-full" src={preview.urls.content} />
            ) : (
              <div className="rounded border p-12 text-center text-muted-foreground">
                Download this file to open it in your preferred application.
              </div>
            ))}
          {preview && (
            <div className="flex gap-2">
              <Button asChild>
                <a
                  download={preview.originalName}
                  href={`${preview.urls.content}?download=1`}
                >
                  <Download className="mr-2 size-4" />
                  Download
                </a>
              </Button>
              {preview.kind === "image" &&
                preview.contentType !== "image/svg+xml" &&
                position.view !== "trash" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCrop(preview);
                      setPreview(undefined);
                    }}
                  >
                    Crop
                  </Button>
                )}
              <Button
                variant="outline"
                onClick={() => {
                  void navigator.clipboard
                    .writeText(preview.urls.image ?? preview.urls.content)
                    .then(
                      () => toast.success("File URL copied"),
                      () => toast.error("Unable to copy URL"),
                    );
                }}
              >
                Copy URL
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ImageCropDialog
        open={!!crop}
        onOpenChange={(open) => {
          if (!open) setCrop(undefined);
        }}
        imageUrl={crop?.urls.image ?? crop?.urls.content ?? ""}
        imageName={crop?.originalName ?? ""}
        onSave={async (blob) => {
          if (!crop) return;
          const form = new FormData();
          form.set("file", blob, "cropped.jpg");
          form.set("saveMode", "new");
          form.set("applicationId", applicationId);
          const response = await fetch(`/api/images/${crop.id}/crop`, {
            method: "POST",
            body: form,
          });
          if (!response.ok) {
            const value = await response.json();
            toast.error(value.error ?? "Unable to save crop");
            throw new Error(value.error ?? "Unable to save crop");
          }
          toast.success("Cropped image saved");
          await load();
        }}
      />
    </div>
  );
}
