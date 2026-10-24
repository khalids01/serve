"use client";
import { useState } from "react";
import type { FileAsset, FileKind } from "../contracts";
import { useDeleteFile, useFiles } from "../hooks/use-files";
import { AdvancedImage } from "./advanced-image";
import { Dialog } from "./dialog";
import { FilePreview } from "./file-preview";
import { FileUploader } from "./file-uploader";
export type MediaLibraryProps = {
  multiple?: boolean;
  value?: FileAsset[];
  onChange?: (assets: FileAsset[]) => void;
  canUpload?: boolean;
  canDelete?: boolean;
  canSelect?: boolean;
  className?: string;
  toolbarClassName?: string;
  gridClassName?: string;
  itemClassName?: string;
  pageSize?: number;
  initialKind?: FileKind | "all";
  showKindFilter?: boolean;
};
export function MediaLibrary({
  multiple = false,
  value = [],
  onChange,
  canUpload = true,
  canDelete = true,
  canSelect = true,
  className,
  toolbarClassName,
  gridClassName,
  itemClassName,
  pageSize = 20,
  initialKind = "all",
  showKindFilter = true,
}: MediaLibraryProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [kind, setKind] = useState<FileKind | "all">(initialKind);
  const [preview, setPreview] = useState<FileAsset>();
  const [deleteError, setDeleteError] = useState<string>();
  const {
    data: assets,
    loading,
    error,
    pagination,
    refetch,
  } = useFiles({
    page,
    limit: Math.max(1, Math.min(100, pageSize)),
    search: appliedSearch || undefined,
    kind,
  });
  const { remove, pending } = useDeleteFile();
  const select = (asset: FileAsset) => {
    const selected = value.some((item) => item.id === asset.id);
    onChange?.(
      multiple
        ? selected
          ? value.filter((item) => item.id !== asset.id)
          : [...value, asset]
        : selected
          ? []
          : [asset],
    );
  };
  const deleteAsset = async (asset: FileAsset) => {
    if (!canDelete || !window.confirm(`Delete ${asset.originalName}?`)) return;
    setDeleteError(undefined);
    try {
      await remove(asset.id);
      onChange?.(value.filter((item) => item.id !== asset.id));
      if (assets.length === 1 && page > 1) setPage(page - 1);
      else refetch();
    } catch (cause) {
      setDeleteError(cause instanceof Error ? cause.message : "Delete failed.");
    }
  };
  const searchFiles = () => {
    setPage(1);
    setAppliedSearch(search);
    refetch();
  };
  return (
    <section
      className={["fs-library", className].filter(Boolean).join(" ")}
      aria-label="Media library"
    >
      <header
        className={["fs-library__toolbar", toolbarClassName]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") searchFiles();
          }}
          placeholder="Search files"
          aria-label="Search files"
        />
        {showKindFilter && (
          <select
            value={kind}
            onChange={(event) => {
              setPage(1);
              setKind(event.target.value as FileKind | "all");
            }}
            aria-label="Filter file type"
          >
            <option value="all">All files</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="document">Documents</option>
            <option value="archive">Archives</option>
            <option value="other">Other</option>
          </select>
        )}
        <select
          aria-label="View layout"
          value={view}
          onChange={(event) => setView(event.target.value as "grid" | "list")}
        >
          <option value="grid">Grid</option>
          <option value="list">List</option>
        </select>
        <button type="button" onClick={searchFiles}>
          Search
        </button>
      </header>
      {canUpload && (
        <FileUploader multiple onUploadComplete={refetch}>
          Upload files
        </FileUploader>
      )}
      {deleteError && <p role="alert">{deleteError}</p>}
      {loading ? (
        <output>Loading files…</output>
      ) : error ? (
        <p role="alert">{error.message}</p>
      ) : assets.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <div
          className={[
            view === "grid" ? "fs-library__grid" : "fs-library__list",
            gridClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {assets.map((asset) => (
            <article
              className={["fs-library__item", itemClassName]
                .filter(Boolean)
                .join(" ")}
              key={asset.id}
            >
              <button
                type="button"
                className="fs-library__preview"
                aria-label={`Preview ${asset.originalName}`}
                onClick={() => setPreview(asset)}
              >
                {asset.kind === "image" ? (
                  <AdvancedImage
                    asset={asset}
                    alt={asset.originalName}
                    responsiveWidths={[160, 320]}
                    width={160}
                    height={120}
                  />
                ) : (
                  <span>{asset.kind}</span>
                )}
              </button>
              <strong title={asset.originalName}>{asset.originalName}</strong>
              <small>{asset.contentType}</small>
              <div>
                {canSelect && (
                  <button
                    type="button"
                    onClick={() => select(asset)}
                    aria-pressed={value.some((item) => item.id === asset.id)}
                  >
                    {value.some((item) => item.id === asset.id)
                      ? "Selected"
                      : "Select"}
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      void deleteAsset(asset);
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      {pagination && (
        <nav aria-label="File pages">
          <button
            type="button"
            disabled={loading || !pagination.hasPrev}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            Previous
          </button>
          <span aria-live="polite">
            Page {page} of {Math.max(1, pagination.pages)}
          </span>
          <button
            type="button"
            disabled={loading || !pagination.hasNext}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </button>
        </nav>
      )}
      {preview && (
        <Dialog
          label={`Preview ${preview.originalName}`}
          onClose={() => setPreview(undefined)}
        >
          <FilePreview asset={preview} className="fs-dialog__preview" />
        </Dialog>
      )}
    </section>
  );
}
