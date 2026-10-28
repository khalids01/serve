"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronRight,
  CloudUpload,
  Copy,
  Download,
  File,
  FileArchive,
  FileImage,
  FileText,
  FileVideo,
  Folder,
  FolderInput,
  FolderPlus,
  Grid2X2,
  HardDrive,
  Info,
  List,
  Loader2,
  LockKeyhole,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  RotateCcw,
  Scissors,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Label } from "@/components/ui/label";
import {
  BROWSE_PAGE_SIZE,
  type BrowseEntry,
  type BrowsePage,
  STORAGE_VIEW_PAGE_SIZE,
  storageClipboard,
} from "@/lib/storage/browse";
import { StorageDestinationDialog } from "./storage-destination-dialog";
import { readDroppedFiles } from "./storage-drop";
import {
  StoragePreview,
  StorageThumbnail,
  storageContentURL,
  storageLabel,
  storageSize,
} from "./storage-preview";
import { useStorageSelection } from "./use-storage-selection";

const notice = {
  id: "storage-manager",
  position: "top-center" as const,
  duration: 2500,
};

type Page = BrowsePage & {
  scope: "namespace" | "disk";
  writable: boolean;
  enabled?: boolean;
  maxUploadBytes: number;
  pageSize?: number;
};
type Clipboard = { mode: "copy" | "move"; keys: string[]; id: string };
type DialogState = {
  mode: "new-folder" | "rename" | "trash" | "purge" | "copy" | "move";
  entries: BrowseEntry[];
};
type ActionName =
  | "open"
  | "download"
  | "rename"
  | "cut"
  | "copy"
  | "copy-to"
  | "move-to"
  | "trash"
  | "restore"
  | "purge"
  | "details";
function entryId(entry: BrowseEntry) {
  return entry.trashId ?? entry.key;
}
function itemKeys(entries: BrowseEntry[]) {
  return [
    ...new Set(
      entries.flatMap((entry) => [
        entry.key,
        ...(entry.variants?.map((variant) => variant.key) ?? []),
      ]),
    ),
  ];
}
function SelectionCheckbox({
  label,
  checked,
  visible,
  onChange,
}: {
  label: string;
  checked: boolean;
  visible: boolean;
  onChange: () => void;
}) {
  return (
    <label
      data-selection-control
      className={`relative inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border shadow-sm transition-opacity focus-within:opacity-100 focus-within:pointer-events-auto focus-within:ring-2 focus-within:ring-ring group-hover:opacity-100 group-hover:pointer-events-auto ${checked ? "border-blue-500/30 bg-blue-500/20 text-blue-500" : "border-border/60 bg-muted/80 text-muted-foreground"} ${visible ? "opacity-100" : "pointer-events-none opacity-0"}`}
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") event.stopPropagation();
      }}
    >
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        onChange={onChange}
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      />
      <Check
        aria-hidden="true"
        className={`size-3.5 ${checked ? "opacity-100" : "opacity-0"}`}
      />
    </label>
  );
}
function FileGlyph({
  entry,
  large = false,
}: {
  entry: BrowseEntry;
  large?: boolean;
}) {
  const Icon =
    entry.kind === "folder"
      ? Folder
      : /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(entry.key)
        ? FileImage
        : /\.(mp4|webm|mov|mkv|mp3|wav)$/i.test(entry.key)
          ? FileVideo
          : /\.(zip|gz|rar|7z|tar)$/i.test(entry.key)
            ? FileArchive
            : /\.(txt|md|json|csv|pdf|docx?|xlsx?|ya?ml|[jt]sx?)$/i.test(
                  entry.key,
                )
              ? FileText
              : File;
  return (
    <Icon
      className={`${large ? "size-12" : "size-5"} shrink-0 ${entry.kind === "folder" ? "fill-blue-500/15 text-blue-500" : "text-muted-foreground"}`}
      strokeWidth={large ? 1.4 : 1.7}
    />
  );
}

export function StorageBrowser({
  userId,
  id,
  name,
  prefix,
  cursor,
  trash = false,
}: {
  userId: string;
  id: string;
  name: string;
  prefix: string;
  cursor?: string;
  trash?: boolean;
}) {
  const router = useRouter();
  const [page, setPage] = useState<Page>();
  const [pageHistory, setPageHistory] = useState<(string | undefined)[]>([
    undefined,
  ]);
  const currentPageIndex = pageHistory.indexOf(cursor);
  const [error, setError] = useState("");
  const [operationError, setOperationError] = useState("");
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  const [selection, setSelection] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "grid">("list");
  const [sort, setSort] = useState<"name" | "size" | "modified">("name");
  const [descending, setDescending] = useState(false);
  const [clipboard, setClipboard] = useState<Clipboard>();
  const [dialog, setDialog] = useState<DialogState>();
  const [inputName, setInputName] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<BrowseEntry>();
  const [dragging, setDragging] = useState(false);
  const [upload, setUpload] = useState<{
    name: string;
    index: number;
    total: number;
    progress: number;
  }>();
  const filesInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);
  const uploadRequest = useRef<XMLHttpRequest | null>(null);
  const cancelUpload = useRef(false);
  const uploadActive = useRef(false);
  const dragDepth = useRef(0);
  const anchor = useRef<string | undefined>(undefined);
  const focused = useRef<string | undefined>(undefined);
  const endpoint = `/api/storage-connections/${encodeURIComponent(id)}`;
  const locked = busy || Boolean(upload);
  const writable = Boolean(page?.writable && !trash);
  const { rectangle, areaProps, touchSelection } = useStorageSelection({
    selection,
    setSelection,
    enabled: !locked && !loading && !dialog && !preview,
    scope: `${id}:${prefix}:${cursor ?? ""}:${trash}:${view}`,
  });
  const parts = prefix.split("/").filter(Boolean);
  const parent = parts.slice(0, -1).join("/") + (parts.length > 1 ? "/" : "");
  const navigate = (folder: string, token?: string, toTrash = trash) => {
    setSelection(new Set());
    setPreview(undefined);
    setSearch("");
    if (!token || folder !== prefix || toTrash !== trash)
      setPageHistory([undefined]);
    router.push(
      `/dashboard/storage/${encodeURIComponent(id)}?${new URLSearchParams({ prefix: folder, ...(token ? { cursor: token } : {}), ...(toTrash ? { trash: "1" } : {}) })}`,
    );
  };
  const reload = () => {
    setSelection(new Set());
    setRefresh((value) => value + 1);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: refresh intentionally reloads the same folder.
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setPage(undefined);
    setSelection(new Set());
    const query = new URLSearchParams({
      prefix,
      ...(cursor ? { cursor } : {}),
      ...(trash ? { trash: "1" } : {}),
    });
    void fetch(`${endpoint}/browse?${query}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error ?? "Unable to load folder.");
        if (!controller.signal.aborted) setPage(data);
      })
      .catch((cause) => {
        if (!controller.signal.aborted) setError(cause.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [endpoint, prefix, cursor, trash, refresh]);
  useEffect(() => {
    try {
      const value = storageClipboard.safeParse(
        JSON.parse(
          sessionStorage.getItem(`serve-storage-clipboard:${userId}`) ?? "null",
        ),
      );
      setClipboard(value.success ? value.data : undefined);
    } catch {
      setClipboard(undefined);
    }
    if (localStorage.getItem("storage-file-view") === "grid") setView("grid");
    if (folderInput.current)
      folderInput.current.setAttribute("webkitdirectory", "");
    return () => {
      cancelUpload.current = true;
      uploadRequest.current?.abort();
    };
  }, [userId]);

  function rememberClipboard(value?: Clipboard) {
    setClipboard(value);
    if (value)
      sessionStorage.setItem(
        `serve-storage-clipboard:${userId}`,
        JSON.stringify(value),
      );
    else sessionStorage.removeItem(`serve-storage-clipboard:${userId}`);
  }
  const entries = [...(page?.entries ?? [])]
    .filter((entry) =>
      storageLabel(entry).toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
      const result =
        sort === "size"
          ? (a.sizeBytes ?? 0) - (b.sizeBytes ?? 0)
          : sort === "modified"
            ? (a.modifiedAt ?? a.deletedAt ?? 0) -
              (b.modifiedAt ?? b.deletedAt ?? 0)
            : storageLabel(a).localeCompare(storageLabel(b), undefined, {
                numeric: true,
              });
      return descending ? -result : result;
    });
  const selected = (page?.entries ?? []).filter((entry) =>
    selection.has(entryId(entry)),
  );
  const allSelected =
    entries.length > 0 &&
    entries.every((entry) => selection.has(entryId(entry)));
  function select(
    entry: BrowseEntry,
    event: { shiftKey?: boolean; metaKey?: boolean; ctrlKey?: boolean },
    toggle = false,
  ) {
    const key = entryId(entry);
    setSelection((current) => {
      const next =
        event.metaKey || event.ctrlKey || toggle || event.shiftKey
          ? new Set(current)
          : new Set<string>();
      if (event.shiftKey && anchor.current) {
        const start = entries.findIndex(
          (item) => entryId(item) === anchor.current,
        );
        const end = entries.findIndex((item) => entryId(item) === key);
        if (start >= 0)
          for (const item of entries.slice(
            Math.min(start, end),
            Math.max(start, end) + 1,
          ))
            next.add(entryId(item));
      } else if (toggle || event.metaKey || event.ctrlKey) {
        if (next.has(key)) next.delete(key);
        else next.add(key);
      } else next.add(key);
      return next;
    });
    if (!event.shiftKey) anchor.current = key;
    focused.current = key;
  }
  function open(entry: BrowseEntry) {
    if (entry.kind === "folder" && !trash) navigate(entry.key);
    else setPreview(entry);
  }
  function showDialog(mode: DialogState["mode"], items = selected) {
    setInputName(mode === "rename" && items[0] ? storageLabel(items[0]) : "");
    setDialogError("");
    setDialog({ mode, entries: items });
  }
  async function mutate(body: unknown, sourceId = id) {
    const response = await fetch(
      `/api/storage-connections/${encodeURIComponent(sourceId)}/browse`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Operation failed.");
  }
  async function perform(body: unknown, message: string, sourceId = id) {
    setBusy(true);
    setDialogError("");
    setOperationError("");
    try {
      await mutate(body, sourceId);
      setDialog(undefined);
      reload();
      toast.success(message, notice);
      return true;
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Operation failed.";
      setDialogError(message);
      setOperationError(message);
      toast.error(message, notice);
      reload();
      return false;
    } finally {
      setBusy(false);
    }
  }
  async function paste(destination = prefix) {
    if (!clipboard || locked || !writable) return;
    if (
      await perform(
        {
          action: clipboard.mode,
          keys: clipboard.keys,
          destination,
          destinationId: id,
        },
        clipboard.mode === "move" ? "Items moved" : "Items copied",
        clipboard.id,
      )
    ) {
      if (clipboard.mode === "move") rememberClipboard();
    }
  }
  function handleAction(action: ActionName, items: BrowseEntry[]) {
    if (!items.length || locked) return;
    if (action === "open") return open(items[0]);
    if (action === "details") return setPreview(items[0]);
    if (action === "download") {
      window.location.assign(storageContentURL(id, items[0]));
      return;
    }
    if (action === "cut" || action === "copy") {
      rememberClipboard({
        mode: action === "cut" ? "move" : "copy",
        keys: itemKeys(items),
        id,
      });
      toast.success(
        `${items.length} ${items.length === 1 ? "item" : "items"} ready to ${action === "cut" ? "move" : "copy"}`,
        notice,
      );
      return;
    }
    if (action === "restore") {
      void perform(
        { action: "restore", ids: items.map((entry) => entry.trashId) },
        "Items restored",
      );
      return;
    }
    showDialog(
      action === "copy-to" ? "copy" : action === "move-to" ? "move" : action,
      items,
    );
  }
  function actions(items: BrowseEntry[]) {
    const one = items.length === 1;
    const mutable =
      page?.enabled !== false &&
      items.length > 0 &&
      items.every((entry) => !entry.protected);
    return [
      {
        action: "open" as const,
        label: "Open",
        icon: Folder,
        show: one && !trash,
      },
      {
        action: "download" as const,
        label: "Download",
        icon: Download,
        show: one && items[0].kind === "file",
      },
      {
        action: "rename" as const,
        label: "Rename",
        icon: Pencil,
        show: one && mutable && !trash && !items[0].variants?.length,
        hint: "F2",
      },
      {
        action: "cut" as const,
        label: "Cut",
        icon: Scissors,
        show: mutable && !trash,
        hint: "Ctrl X",
      },
      {
        action: "copy" as const,
        label: "Copy",
        icon: Copy,
        show: mutable && !trash,
        hint: "Ctrl C",
      },
      {
        action: "copy-to" as const,
        label: "Copy to…",
        icon: Copy,
        show: mutable && !trash,
      },
      {
        action: "move-to" as const,
        label: "Move to…",
        icon: FolderInput,
        show: mutable && !trash,
      },
      {
        action: "restore" as const,
        label: "Restore",
        icon: RotateCcw,
        show: trash,
      },
      {
        action: "trash" as const,
        label: "Move to Trash",
        icon: Trash2,
        show: mutable && !trash,
        hint: "Del",
      },
      {
        action: "purge" as const,
        label: "Delete permanently",
        icon: Trash2,
        show: trash,
      },
      { action: "details" as const, label: "Details", icon: Info, show: one },
    ].filter((action) => action.show);
  }
  function contextItems(entry: BrowseEntry) {
    return selection.has(entryId(entry)) ? selected : [entry];
  }

  async function uploadFiles(
    files: File[],
    destination = prefix,
    paths?: Map<File, string>,
  ) {
    if (!files.length || locked || uploadActive.current || !writable) return;
    uploadActive.current = true;
    cancelUpload.current = false;
    setOperationError("");
    let succeeded = 0;
    const failures: string[] = [];
    for (let index = 0; index < files.length; index++) {
      if (cancelUpload.current) break;
      const file = files[index];
      if (file.size > (page?.maxUploadBytes ?? 0)) {
        failures.push(
          `${file.name}: exceeds ${storageSize(page?.maxUploadBytes)} limit`,
        );
        continue;
      }
      const relative = paths?.get(file) || file.webkitRelativePath || file.name;
      setUpload({
        name: relative,
        index: index + 1,
        total: files.length,
        progress: 0,
      });
      try {
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          uploadRequest.current = xhr;
          xhr.open(
            "PUT",
            `${endpoint}/content?${new URLSearchParams({ key: destination + relative })}`,
          );
          xhr.setRequestHeader("X-File-Size", String(file.size));
          xhr.setRequestHeader(
            "Content-Type",
            file.type || "application/octet-stream",
          );
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable)
              setUpload({
                name: relative,
                index: index + 1,
                total: files.length,
                progress: Math.round((event.loaded / event.total) * 100),
              });
          };
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) resolve();
            else {
              let message = "Upload failed";
              try {
                message = JSON.parse(xhr.responseText).error ?? message;
              } catch {}
              reject(new Error(message));
            }
          };
          xhr.onerror = () => reject(new Error("Network error"));
          xhr.onabort = () => reject(new Error("Upload cancelled"));
          xhr.send(file);
        });
        succeeded++;
      } catch (cause) {
        if (!cancelUpload.current)
          failures.push(
            `${file.name}: ${cause instanceof Error ? cause.message : "Upload failed"}`,
          );
      }
    }
    uploadRequest.current = null;
    uploadActive.current = false;
    setUpload(undefined);
    reload();
    if (succeeded)
      toast.success(
        `${succeeded} ${succeeded === 1 ? "file uploaded" : "files uploaded"}`,
        notice,
      );
    if (failures.length) {
      setOperationError(
        `${failures.length} upload${failures.length > 1 ? "s" : ""} failed. ${failures.slice(0, 3).join("; ")}`,
      );
      toast.error("Some files could not be uploaded", notice);
    }
    if (filesInput.current) filesInput.current.value = "";
    if (folderInput.current) folderInput.current.value = "";
  }
  async function dropFiles(transfer: DataTransfer, destination = prefix) {
    if (locked || uploadActive.current || !writable) return;
    uploadActive.current = true;
    cancelUpload.current = false;
    setOperationError("");
    setUpload({
      name: "Reading dropped folders…",
      index: 0,
      total: 0,
      progress: 0,
    });
    try {
      const dropped = await readDroppedFiles(
        transfer,
        () => cancelUpload.current,
      );
      for (const folder of dropped.emptyFolders) {
        if (cancelUpload.current) return;
        const segments = folder.split("/").filter(Boolean);
        await mutate({
          action: "new-folder",
          prefix:
            destination +
            (segments.length > 1 ? `${segments.slice(0, -1).join("/")}/` : ""),
          name: segments.at(-1),
        });
      }
      if (!cancelUpload.current) {
        uploadActive.current = false;
        await uploadFiles(dropped.files, destination, dropped.paths);
        if (!dropped.files.length) reload();
      }
    } catch (cause) {
      if (!cancelUpload.current) {
        const message =
          cause instanceof Error
            ? cause.message
            : "Unable to read dropped files.";
        setOperationError(message);
        toast.error(message, notice);
      }
    } finally {
      uploadActive.current = false;
      setUpload(undefined);
    }
  }
  function dragProps(entry: BrowseEntry) {
    return {
      draggable:
        selection.has(entryId(entry)) && !trash && !entry.protected && !locked,
      onDragStart(event: React.DragEvent<HTMLElement>) {
        const items = selection.has(entryId(entry)) ? selected : [entry];
        event.dataTransfer.setData(
          "application/x-serve-storage",
          JSON.stringify({
            id,
            keys: itemKeys(items.filter((item) => !item.protected)),
          }),
        );
        event.dataTransfer.effectAllowed = "copyMove";
      },
      onDragOver(event: React.DragEvent<HTMLElement>) {
        if (entry.kind === "folder" && !entry.protected && !trash && !locked) {
          event.preventDefault();
          event.stopPropagation();
          event.dataTransfer.dropEffect =
            event.ctrlKey || event.dataTransfer.types.includes("Files")
              ? "copy"
              : "move";
        }
      },
      onDrop(event: React.DragEvent<HTMLElement>) {
        if (entry.kind !== "folder" || entry.protected || trash || locked)
          return;
        event.preventDefault();
        event.stopPropagation();
        setDragging(false);
        dragDepth.current = 0;
        if (event.dataTransfer.types.includes("Files")) {
          void dropFiles(event.dataTransfer, entry.key);
          return;
        }
        try {
          const payload = JSON.parse(
            event.dataTransfer.getData("application/x-serve-storage"),
          );
          if (payload.id === id && Array.isArray(payload.keys))
            void perform(
              {
                action: event.ctrlKey ? "copy" : "move",
                keys: payload.keys,
                destination: entry.key,
              },
              event.ctrlKey ? "Items copied" : "Items moved",
            );
        } catch {
          toast.error("These items cannot be moved here.", notice);
        }
      },
    };
  }
  const itemMenu = (entry: BrowseEntry) => (
    <ContextMenuContent className="w-56">
      {actions(contextItems(entry)).map(
        ({ action, label, icon: Icon, hint }) => (
          <ContextMenuItem
            key={action}
            disabled={locked}
            onSelect={() => handleAction(action, contextItems(entry))}
            className={
              action === "trash" || action === "purge"
                ? "text-destructive focus:text-destructive"
                : ""
            }
          >
            <Icon className="mr-2 size-4" />
            {label}
            {hint && (
              <span
                aria-hidden="true"
                className="ml-auto text-xs text-muted-foreground"
              >
                {hint}
              </span>
            )}
          </ContextMenuItem>
        ),
      )}
      {entry.kind === "folder" && !trash && !entry.protected && clipboard && (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem
            disabled={locked}
            onSelect={() => void paste(entry.key)}
          >
            Paste into folder
          </ContextMenuItem>
        </>
      )}
    </ContextMenuContent>
  );

  function keyDown(event: React.KeyboardEvent) {
    if (
      event.key === "Enter" &&
      (event.target as HTMLElement).closest("button, a")
    )
      return;
    if (
      locked ||
      dialog ||
      preview ||
      (event.target as HTMLElement).closest(
        "input:not([type=checkbox]), textarea, select, [role='menu'], [role='dialog']",
      )
    )
      return;
    const mod = event.ctrlKey || event.metaKey;
    if (mod && event.key.toLowerCase() === "a") {
      event.preventDefault();
      setSelection(new Set(entries.map(entryId)));
    } else if (
      mod &&
      ["c", "x"].includes(event.key.toLowerCase()) &&
      !trash &&
      selected.length &&
      selected.every((entry) => !entry.protected)
    ) {
      event.preventDefault();
      handleAction(event.key.toLowerCase() === "c" ? "copy" : "cut", selected);
    } else if (mod && event.key.toLowerCase() === "v" && writable) {
      event.preventDefault();
      void paste();
    } else if (
      event.key === "F2" &&
      selected.length === 1 &&
      !selected[0].variants?.length &&
      !selected[0].protected &&
      !trash
    ) {
      event.preventDefault();
      showDialog("rename");
    } else if (
      event.key === "Delete" &&
      selected.length &&
      selected.every((entry) => !entry.protected)
    ) {
      event.preventDefault();
      showDialog(trash ? "purge" : "trash");
    } else if (event.key === "Enter" && selected.length === 1) {
      event.preventDefault();
      open(selected[0]);
    } else if (["ArrowDown", "ArrowUp"].includes(event.key) && entries.length) {
      event.preventDefault();
      const current = entries.findIndex(
        (entry) => entryId(entry) === focused.current,
      );
      const index =
        current < 0
          ? 0
          : Math.max(
              0,
              Math.min(
                entries.length - 1,
                current + (event.key === "ArrowDown" ? 1 : -1),
              ),
            );
      select(entries[index], { shiftKey: event.shiftKey });
      event.currentTarget
        .querySelector(
          `[data-entry-id="${CSS.escape(entryId(entries[index]))}"]`,
        )
        ?.scrollIntoView({ block: "nearest" });
    } else if (event.key === "Escape") setSelection(new Set());
    else if (event.key === "Backspace" && prefix && !trash) {
      event.preventDefault();
      navigate(parent);
    }
  }
  return (
    <div
      role="application"
      aria-label={`${name} file manager`}
      tabIndex={-1}
      onMouseDown={(event) => {
        if (
          !(event.target as HTMLElement).closest(
            "button, input, select, a, textarea, [role=dialog]",
          )
        )
          event.currentTarget.focus({ preventScroll: true });
      }}
      onKeyDown={keyDown}
      className="flex min-w-0 flex-1 flex-col gap-5 p-2 outline-none md:p-4"
    >
      <input
        ref={filesInput}
        type="file"
        multiple
        className="hidden"
        aria-label="Choose files to upload"
        onChange={(event) =>
          void uploadFiles(Array.from(event.target.files ?? []))
        }
      />
      <input
        ref={folderInput}
        type="file"
        multiple
        className="hidden"
        aria-label="Choose folder to upload"
        onChange={(event) =>
          void uploadFiles(Array.from(event.target.files ?? []))
        }
      />
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <Link
            href="/dashboard/storage"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            All storage
          </Link>
          <h1 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
            <span className="rounded-xl bg-blue-500/10 p-2.5 text-blue-500">
              <HardDrive className="size-5" />
            </span>
            <span className="truncate">{name}</span>
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            variant="outline"
            disabled={locked || loading}
            onClick={reload}
            aria-label="Refresh folder"
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant={trash ? "secondary" : "outline"}
            disabled={locked}
            onClick={() => navigate("", undefined, !trash)}
          >
            <Trash2 className="mr-2 size-4" />
            Trash
          </Button>
          <Button
            variant="outline"
            aria-label="New folder"
            disabled={!writable || locked}
            onClick={() => showDialog("new-folder", [])}
          >
            <FolderPlus className="size-4 sm:mr-2" />
            <span className="hidden sm:inline">New folder</span>
          </Button>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button disabled={!writable || locked}>
                <Upload className="mr-2 size-4" />
                Upload
                <ChevronDown className="ml-2 size-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onClick={(event) => event.stopPropagation()}
            >
              <DropdownMenuItem onSelect={() => filesInput.current?.click()}>
                <Upload className="mr-2 size-4" />
                Upload files
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => folderInput.current?.click()}>
                <Folder className="mr-2 size-4" />
                Upload folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <div className="flex min-h-[65vh] min-w-0 flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b px-3 py-3 sm:px-5">
          <nav
            aria-label="Folder path"
            className="flex min-w-0 flex-wrap items-center gap-1 text-sm"
          >
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Go to parent folder"
              disabled={!prefix || trash || locked}
              onClick={() => navigate(parent)}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <button
              type="button"
              onClick={() => navigate("", undefined, false)}
              className="rounded-md px-2 py-1.5 font-medium hover:bg-muted"
            >
              {name}
            </button>
            {trash ? (
              <>
                <ChevronRight className="size-3.5 text-muted-foreground" />
                <span className="px-2 font-medium">Trash</span>
              </>
            ) : (
              parts.map((part, index) => (
                <span
                  key={parts.slice(0, index + 1).join("/")}
                  className="inline-flex min-w-0 items-center gap-1"
                >
                  <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                  <button
                    type="button"
                    title={part}
                    className="max-w-40 truncate rounded-md px-2 py-1.5 hover:bg-muted"
                    onClick={() =>
                      navigate(`${parts.slice(0, index + 1).join("/")}/`)
                    }
                  >
                    {part}
                  </button>
                </span>
              ))
            )}
          </nav>
          <div className="flex w-full min-w-0 items-center justify-end gap-2 sm:w-auto sm:flex-none">
            <div className="relative min-w-0 flex-1 sm:w-56">
              <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                aria-label="Filter current page"
                placeholder="Filter this page…"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-9 pl-9"
              />
            </div>
            <div className="flex rounded-lg border p-0.5">
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                className="size-8"
                aria-label="List view"
                onClick={() => {
                  setView("list");
                  localStorage.setItem("storage-file-view", "list");
                }}
              >
                <List className="size-4" />
              </Button>
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="size-8"
                aria-label="Grid view"
                onClick={() => {
                  setView("grid");
                  localStorage.setItem("storage-file-view", "grid");
                }}
              >
                <Grid2X2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 border-b bg-muted/20 px-3 py-2 sm:px-5">
          <div className="flex flex-wrap items-center gap-1">
            {selected.length ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelection(new Set())}
                >
                  <X className="mr-1.5 size-3.5" />
                  {selected.length} selected
                </Button>
                {trash ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={locked}
                      onClick={() => handleAction("restore", selected)}
                    >
                      <RotateCcw className="mr-2 size-4" />
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={locked}
                      onClick={() => showDialog("purge")}
                      className="text-destructive"
                    >
                      Delete permanently
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={
                        locked || selected.some((entry) => entry.protected)
                      }
                      onClick={() => showDialog("move")}
                    >
                      <FolderInput className="mr-2 size-4" />
                      Move
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={
                        locked || selected.some((entry) => entry.protected)
                      }
                      onClick={() => showDialog("trash")}
                      className="text-destructive"
                    >
                      <Trash2 className="mr-2 size-4" />
                      Trash
                    </Button>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          aria-label="Selection actions"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {actions(selected).map(
                          ({ action, label, icon: Icon }) => (
                            <DropdownMenuItem
                              key={action}
                              disabled={locked}
                              onSelect={() => handleAction(action, selected)}
                            >
                              <Icon className="mr-2 size-4" />
                              {label}
                            </DropdownMenuItem>
                          ),
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </>
            ) : trash ? (
              <p className="text-xs text-muted-foreground">
                Restore deleted items or remove them permanently.
              </p>
            ) : (
              <>
                {writable && (
                  <span className="px-2 text-xs text-muted-foreground">
                    All files
                  </span>
                )}
                {!writable && page && (
                  <p className="flex items-center gap-1.5 px-2 text-xs text-muted-foreground">
                    <LockKeyhole className="size-3" />
                    {page.enabled === false
                      ? "Connection disabled"
                      : "Managed by Serve"}
                  </p>
                )}
              </>
            )}
            {clipboard && (
              <Button
                variant="ghost"
                size="sm"
                disabled={!writable || locked}
                onClick={() => void paste()}
              >
                <Copy className="mr-2 size-4" />
                Paste ({clipboard.keys.length})
              </Button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <select
              aria-label="Sort files"
              value={sort}
              onChange={(event) => setSort(event.target.value as typeof sort)}
              className="h-8 max-w-32 rounded-md border-0 bg-transparent px-2 text-xs text-muted-foreground"
            >
              <option value="name">Name</option>
              <option value="modified">Date modified</option>
              <option value="size">Size</option>
            </select>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label={descending ? "Sort ascending" : "Sort descending"}
              onClick={() => setDescending(!descending)}
            >
              {descending ? (
                <ArrowDown className="size-3.5" />
              ) : (
                <ArrowUp className="size-3.5" />
              )}
            </Button>
          </div>
        </div>
        {upload && (
          <div aria-live="polite" className="border-b bg-blue-500/5 px-5 py-3">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs">
              <span className="truncate">
                {upload.total
                  ? `Uploading ${upload.index} of ${upload.total}`
                  : "Preparing upload"}{" "}
                · {upload.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6"
                onClick={() => {
                  cancelUpload.current = true;
                  uploadRequest.current?.abort();
                }}
              >
                Cancel
              </Button>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-blue-500/10">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${upload.progress}%` }}
              />
            </div>
          </div>
        )}
        {(error || operationError) && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 border-b bg-destructive/5 px-5 py-3 text-sm text-destructive"
          >
            <p>{error || operationError}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setOperationError("");
                reload();
              }}
            >
              Retry
            </Button>
          </div>
        )}
        <ContextMenu modal={false}>
          <ContextMenuTrigger asChild>
            <fieldset
              aria-label="Files and upload drop area"
              {...areaProps}
              onContextMenu={() => setSelection(new Set())}
              className={`relative flex select-none [-webkit-touch-callout:none] min-h-80 min-w-0 flex-1 flex-col ${dragging ? "bg-blue-500/5 ring-2 ring-inset ring-blue-500" : ""}`}
              onDragEnter={(event) => {
                if (event.dataTransfer.types.includes("Files") && writable) {
                  event.preventDefault();
                  dragDepth.current++;
                  setDragging(true);
                }
              }}
              onDragOver={(event) => {
                if (event.dataTransfer.types.includes("Files") && writable) {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "copy";
                }
              }}
              onDragLeave={() => {
                dragDepth.current = Math.max(0, dragDepth.current - 1);
                if (!dragDepth.current) setDragging(false);
              }}
              onDrop={(event) => {
                if (event.dataTransfer.types.includes("Files")) {
                  event.preventDefault();
                  dragDepth.current = 0;
                  setDragging(false);
                  void dropFiles(event.dataTransfer);
                }
              }}
            >
              {loading ? (
                <div
                  aria-live="polite"
                  className="flex flex-1 items-center justify-center gap-2 p-16 text-sm text-muted-foreground"
                >
                  <Loader2 className="size-5 animate-spin" />
                  Loading files…
                </div>
              ) : entries.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
                  <span className="mb-5 rounded-2xl bg-blue-500/10 p-5">
                    {trash ? (
                      <Trash2
                        className="size-10 text-blue-500"
                        strokeWidth={1.4}
                      />
                    ) : (
                      <CloudUpload
                        className="size-10 text-blue-500"
                        strokeWidth={1.4}
                      />
                    )}
                  </span>
                  <h2 className="text-lg font-medium">
                    {search
                      ? "No matching items"
                      : trash
                        ? "Your trash is empty"
                        : page?.nextCursor
                          ? "More items are available"
                          : "This folder is empty"}
                  </h2>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {search
                      ? "Try a different name. The filter applies to this page."
                      : trash
                        ? "Deleted files and folders will appear here. You can restore them when you need them."
                        : page?.nextCursor
                          ? "Continue to the next page to see more images and files."
                          : writable
                            ? "Drop files here, upload a folder, or create a new folder to get started."
                            : "Files stored in this folder will appear here."}
                  </p>
                  {writable && !search && (
                    <div className="mt-6 flex gap-2">
                      <Button
                        size="sm"
                        disabled={locked}
                        onClick={() => filesInput.current?.click()}
                      >
                        <Upload className="mr-2 size-4" />
                        Upload files
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={locked}
                        onClick={() => showDialog("new-folder", [])}
                      >
                        <FolderPlus className="mr-2 size-4" />
                        New folder
                      </Button>
                    </div>
                  )}
                </div>
              ) : view === "list" ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b text-left text-xs text-muted-foreground">
                      <tr className="group">
                        <th className="w-10 pl-4 pr-2 py-3">
                          <SelectionCheckbox
                            label="Select all items on this page"
                            checked={allSelected}
                            visible={selection.size > 0}
                            onChange={() =>
                              setSelection(
                                allSelected
                                  ? new Set()
                                  : new Set(entries.map(entryId)),
                              )
                            }
                          />
                        </th>
                        <th className="px-2 py-3 font-medium">Name</th>
                        <th className="hidden px-4 py-3 font-medium md:table-cell">
                          {trash ? "Deleted" : "Modified"}
                        </th>
                        <th className="px-4 py-3 text-right font-medium">
                          Size
                        </th>
                        <th className="w-12">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {entries.map((entry) => (
                        <ContextMenu key={entryId(entry)} modal={false}>
                          <ContextMenuTrigger asChild>
                            <tr
                              data-entry-id={entryId(entry)}
                              aria-selected={selection.has(entryId(entry))}
                              {...dragProps(entry)}
                              className={`group cursor-pointer transition-colors ${selection.has(entryId(entry)) ? "bg-blue-500/10 hover:bg-blue-500/15" : "hover:bg-muted/50"} ${clipboard?.id === id && clipboard.mode === "move" && clipboard.keys.includes(entry.key) ? "opacity-50" : ""}`}
                              onClick={(event) => {
                                if (
                                  event.ctrlKey ||
                                  event.metaKey ||
                                  event.shiftKey ||
                                  touchSelection()
                                )
                                  select(entry, event, touchSelection());
                                else open(entry);
                              }}
                              onContextMenu={(event) => {
                                event.stopPropagation();
                                if (!selection.has(entryId(entry)))
                                  setSelection(new Set([entryId(entry)]));
                              }}
                            >
                              <td className="pl-4 pr-2 py-3">
                                <SelectionCheckbox
                                  label={`Select ${storageLabel(entry)}`}
                                  checked={selection.has(entryId(entry))}
                                  visible={selection.size > 0}
                                  onChange={() => select(entry, {}, true)}
                                />
                              </td>
                              <td className="w-full max-w-0 px-2 py-3">
                                <div className="flex items-center gap-3">
                                  <StorageThumbnail
                                    key={`${id}:${entry.key}:${entry.modifiedAt ?? ""}`}
                                    id={id}
                                    entry={entry}
                                    large={false}
                                    fallback={<FileGlyph entry={entry} />}
                                  />
                                  <button
                                    type="button"
                                    className="truncate text-left hover:underline"
                                    title={storageLabel(entry)}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      if (
                                        event.ctrlKey ||
                                        event.metaKey ||
                                        event.shiftKey ||
                                        touchSelection()
                                      )
                                        select(entry, event, touchSelection());
                                      else open(entry);
                                    }}
                                  >
                                    {storageLabel(entry)}
                                  </button>
                                  {entry.variants?.length ? (
                                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                                      {entry.variants.length + 1} versions
                                    </span>
                                  ) : null}
                                  {entry.protected && (
                                    <LockKeyhole
                                      className="size-3 shrink-0 text-muted-foreground"
                                      aria-label="Managed by Serve"
                                    />
                                  )}
                                </div>
                              </td>
                              <td className="hidden whitespace-nowrap px-4 py-3 text-xs text-muted-foreground md:table-cell">
                                {(trash ? entry.deletedAt : entry.modifiedAt)
                                  ? new Date(
                                      (trash
                                        ? entry.deletedAt
                                        : entry.modifiedAt) ?? 0,
                                    ).toLocaleString(undefined, {
                                      dateStyle: "medium",
                                      timeStyle: "short",
                                    })
                                  : "—"}
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-right text-xs tabular-nums text-muted-foreground">
                                {entry.kind === "file"
                                  ? storageSize(entry.sizeBytes)
                                  : "—"}
                              </td>
                              <td className="pr-3">
                                <DropdownMenu modal={false}>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="hidden size-8 [@media(any-pointer:coarse)]:inline-flex"
                                      data-selection-control
                                      aria-label={`Actions for ${storageLabel(entry)}`}
                                      onClick={(event) =>
                                        event.stopPropagation()
                                      }
                                    >
                                      <MoreHorizontal className="size-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    {actions(contextItems(entry)).map(
                                      ({ action, label, icon: Icon }) => (
                                        <DropdownMenuItem
                                          key={action}
                                          disabled={locked}
                                          onSelect={() =>
                                            handleAction(
                                              action,
                                              contextItems(entry),
                                            )
                                          }
                                        >
                                          <Icon className="mr-2 size-4" />
                                          {label}
                                        </DropdownMenuItem>
                                      ),
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </td>
                            </tr>
                          </ContextMenuTrigger>
                          {itemMenu(entry)}
                        </ContextMenu>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-2 content-start gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {entries.map((entry) => (
                    <ContextMenu key={entryId(entry)} modal={false}>
                      <ContextMenuTrigger asChild>
                        <fieldset
                          data-entry-id={entryId(entry)}
                          {...dragProps(entry)}
                          aria-label={storageLabel(entry)}
                          className={`group relative min-w-0 rounded-xl border p-4 transition-colors ${selection.has(entryId(entry)) ? "border-blue-500/50 bg-blue-500/10" : "border-border/70 hover:bg-muted/50"}`}
                          onContextMenu={(event) => {
                            event.stopPropagation();
                            if (!selection.has(entryId(entry)))
                              setSelection(new Set([entryId(entry)]));
                          }}
                        >
                          <div className="mb-5 flex items-start justify-between">
                            <SelectionCheckbox
                              label={`Select ${storageLabel(entry)}`}
                              checked={selection.has(entryId(entry))}
                              visible={selection.size > 0}
                              onChange={() => select(entry, {}, true)}
                            />
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="-mr-2 -mt-2 hidden size-7 [@media(any-pointer:coarse)]:inline-flex"
                                  data-selection-control
                                  aria-label={`Actions for ${storageLabel(entry)}`}
                                >
                                  <MoreHorizontal className="size-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                {actions(contextItems(entry)).map(
                                  ({ action, label, icon: Icon }) => (
                                    <DropdownMenuItem
                                      key={action}
                                      disabled={locked}
                                      onSelect={() =>
                                        handleAction(
                                          action,
                                          contextItems(entry),
                                        )
                                      }
                                    >
                                      <Icon className="mr-2 size-4" />
                                      {label}
                                    </DropdownMenuItem>
                                  ),
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <button
                            type="button"
                            className="flex w-full min-w-0 flex-col items-center gap-4 py-2"
                            aria-label={storageLabel(entry)}
                            onClick={(event) => {
                              if (
                                event.ctrlKey ||
                                event.metaKey ||
                                event.shiftKey ||
                                touchSelection()
                              )
                                select(entry, event, touchSelection());
                              else open(entry);
                            }}
                          >
                            <div className="flex h-28 w-full items-center justify-center">
                              <StorageThumbnail
                                key={`${id}:${entry.key}:${entry.modifiedAt ?? ""}`}
                                id={id}
                                entry={entry}
                                large
                                fallback={<FileGlyph entry={entry} large />}
                              />
                            </div>
                            {entry.variants?.length ? (
                              <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                {entry.variants.length + 1} versions
                              </span>
                            ) : null}
                            <span
                              className="w-full truncate text-center text-sm font-medium"
                              title={storageLabel(entry)}
                            >
                              {storageLabel(entry)}
                            </span>
                          </button>
                          <p className="mt-1 text-center text-xs text-muted-foreground">
                            {entry.protected
                              ? "Managed by Serve"
                              : entry.kind === "folder"
                                ? "Folder"
                                : storageSize(entry.sizeBytes)}
                          </p>
                        </fieldset>
                      </ContextMenuTrigger>
                      {itemMenu(entry)}
                    </ContextMenu>
                  ))}
                </div>
              )}
              {rectangle && (
                <div
                  aria-hidden="true"
                  data-selection-rectangle
                  className="pointer-events-none fixed z-40 border border-blue-500/70 bg-blue-500/15"
                  style={{
                    left: rectangle.x,
                    top: rectangle.y,
                    width: rectangle.width,
                    height: rectangle.height,
                  }}
                />
              )}
              {dragging && (
                <div className="pointer-events-none absolute inset-3 flex items-center justify-center rounded-xl border-2 border-dashed border-blue-500 bg-background/90">
                  <p className="flex items-center gap-3 font-medium text-blue-500">
                    <CloudUpload className="size-6" />
                    Drop files to upload
                  </p>
                </div>
              )}
            </fieldset>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuItem
              disabled={!writable || locked}
              onSelect={() => showDialog("new-folder", [])}
            >
              <FolderPlus className="mr-2 size-4" />
              New folder
            </ContextMenuItem>
            <ContextMenuItem
              disabled={!writable || locked}
              onSelect={() => filesInput.current?.click()}
            >
              <Upload className="mr-2 size-4" />
              Upload files
            </ContextMenuItem>
            <ContextMenuItem
              disabled={!writable || locked}
              onSelect={() => folderInput.current?.click()}
            >
              <Folder className="mr-2 size-4" />
              Upload folder
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem
              disabled={!writable || locked || !clipboard}
              onSelect={() => void paste()}
            >
              <Copy className="mr-2 size-4" />
              Paste
              <span
                aria-hidden="true"
                className="ml-auto text-xs text-muted-foreground"
              >
                Ctrl V
              </span>
            </ContextMenuItem>
            <ContextMenuItem disabled={locked} onSelect={reload}>
              <RefreshCw className="mr-2 size-4" />
              Refresh
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={() => setSelection(new Set(entries.map(entryId)))}
            >
              <Check className="mr-2 size-4" />
              Select all
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t bg-muted/10 px-5 py-3 text-xs text-muted-foreground">
          <span>
            {selected.length ? `${selected.length} selected · ` : ""}
            {entries.length} {entries.length === 1 ? "item" : "items"} on this
            page ·{" "}
            {page?.pageSize ??
              (trash ? BROWSE_PAGE_SIZE : STORAGE_VIEW_PAGE_SIZE)}{" "}
            items per page
            {page?.maxUploadBytes && writable
              ? ` · Up to ${storageSize(page.maxUploadBytes)} per file`
              : ""}
          </span>
          <nav
            aria-label="Storage pagination"
            className="flex flex-wrap items-center gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              disabled={locked || loading || !cursor}
              onClick={() => navigate(prefix)}
            >
              First page
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={locked || loading || currentPageIndex <= 0}
              onClick={() =>
                navigate(prefix, pageHistory[currentPageIndex - 1])
              }
            >
              Previous page
            </Button>
            <span aria-current="page" className="px-2 tabular-nums">
              {currentPageIndex >= 0
                ? `Page ${currentPageIndex + 1}`
                : "Current page"}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={locked || loading || !page?.nextCursor}
              onClick={() => {
                if (!page?.nextCursor) return;
                setPageHistory((history) => {
                  const index = history.indexOf(cursor);
                  return [
                    ...(index >= 0 ? history.slice(0, index + 1) : [cursor]),
                    page.nextCursor,
                  ];
                });
                navigate(prefix, page.nextCursor);
              }}
            >
              Next page
              <ChevronRight className="ml-1 size-3" />
            </Button>
          </nav>
        </footer>
      </div>
      <p className="text-xs text-muted-foreground">
        {page?.scope === "disk"
          ? "All files in this storage location."
          : "Your private storage space."}{" "}
        Click to open. Drag across items to select, or hold to select on touch
        screens. Right-click for actions. Sorting and filtering apply to this
        page.
      </p>
      {preview && (
        <StoragePreview
          key={entryId(preview)}
          id={id}
          entry={preview}
          onClose={() => setPreview(undefined)}
        />
      )}
      {dialog && (dialog.mode === "move" || dialog.mode === "copy") ? (
        <StorageDestinationDialog
          sourceId={id}
          initialPrefix={prefix}
          mode={dialog.mode}
          count={dialog.entries.length}
          busy={busy}
          errorMessage={dialogError}
          onClose={() => setDialog(undefined)}
          onChoose={(destinationId, destination) =>
            void perform(
              {
                action: dialog.mode,
                keys: itemKeys(dialog.entries),
                destinationId,
                destination,
              },
              dialog.mode === "move" ? "Items moved" : "Items copied",
            )
          }
        />
      ) : (
        dialog && (
          <Dialog
            open
            onOpenChange={(open) => {
              if (!open && !busy) setDialog(undefined);
            }}
          >
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {dialog.mode === "new-folder"
                    ? "New folder"
                    : dialog.mode === "rename"
                      ? "Rename item"
                      : dialog.mode === "trash"
                        ? "Move to Trash?"
                        : "Delete permanently?"}
                </DialogTitle>
                <DialogDescription>
                  {dialog.mode === "new-folder"
                    ? "Give your folder a name."
                    : dialog.mode === "rename"
                      ? "Enter a new name for this file or folder."
                      : dialog.mode === "trash"
                        ? `${dialog.entries.length} selected item(s), including their variants, will move to Trash. You can restore them later.`
                        : `${dialog.entries.length} selected item(s) will be permanently deleted. This cannot be undone.`}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void perform(
                    dialog.mode === "new-folder"
                      ? { action: "new-folder", prefix, name: inputName }
                      : dialog.mode === "rename"
                        ? {
                            action: "rename",
                            key: dialog.entries[0].key,
                            name: inputName,
                          }
                        : dialog.mode === "trash"
                          ? {
                              action: "trash",
                              keys: itemKeys(dialog.entries),
                            }
                          : {
                              action: "purge",
                              ids: dialog.entries.map((entry) => entry.trashId),
                            },
                    dialog.mode === "new-folder"
                      ? "Folder created"
                      : dialog.mode === "rename"
                        ? "Item renamed"
                        : dialog.mode === "trash"
                          ? "Items moved to Trash"
                          : "Items permanently deleted",
                  );
                }}
                className="space-y-4"
              >
                {(dialog.mode === "new-folder" || dialog.mode === "rename") && (
                  <div className="space-y-2">
                    <Label htmlFor="storage-item-name">Name</Label>
                    <Input
                      id="storage-item-name"
                      value={inputName}
                      onChange={(event) => setInputName(event.target.value)}
                      maxLength={255}
                      required
                      autoFocus
                      disabled={busy}
                    />
                  </div>
                )}
                {dialogError && (
                  <p role="alert" className="text-sm text-destructive">
                    {dialogError}
                  </p>
                )}
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialog(undefined)}
                    disabled={busy}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant={
                      dialog.mode === "purge" ? "destructive" : "default"
                    }
                    disabled={
                      busy ||
                      ((dialog.mode === "new-folder" ||
                        dialog.mode === "rename") &&
                        !inputName.trim())
                    }
                  >
                    {busy && <Loader2 className="mr-2 size-4 animate-spin" />}
                    {dialog.mode === "new-folder"
                      ? "Create folder"
                      : dialog.mode === "rename"
                        ? "Save name"
                        : dialog.mode === "trash"
                          ? "Move to Trash"
                          : "Delete permanently"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )
      )}
    </div>
  );
}
