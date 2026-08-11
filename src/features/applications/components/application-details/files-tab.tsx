import { Grid2X2, Image as ImageIcon, List, Trash, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FileFilterControls } from "@/features/files/components/file-filter-controls";
import { type FileKind, filterFiles } from "@/features/files/lib/file-kind";
import { FileGridItem } from "./file-grid-item";
import { FileListItem } from "./file-list-item";
import type { ImageFileDTO } from "./types";

interface Props {
  images: ImageFileDTO[];
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  selectedIds: Set<string>;
  onToggleSelection: (id: string) => void;
  onSelectAll: (visibleIds: string[]) => void;
  onBulkDelete: () => void;
  isBulkDeleting: boolean;
  onPreview: (img: ImageFileDTO) => void;
  onDeleteRequest: (img: ImageFileDTO) => void;
  copyToClipboard: (text: string) => void;
  onNavigateToUpload?: () => void;
}

export function ApplicationFiles({
  images,
  viewMode,
  onViewModeChange,
  selectedIds,
  onToggleSelection,
  onSelectAll,
  onBulkDelete,
  isBulkDeleting,
  onPreview,
  onDeleteRequest,
  copyToClipboard,
  onNavigateToUpload,
}: Props) {
  const [search, setSearch] = useState("");
  const [kind, setKind] = useState<FileKind>("all");
  const filteredFiles = useMemo(
    () => filterFiles(images, search, kind),
    [images, search, kind],
  );
  const visibleIds = filteredFiles.map((file) => file.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.has(id));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>
          {filteredFiles.length === images.length
            ? `${images.length} file${images.length === 1 ? "" : "s"} uploaded to this application`
            : `${filteredFiles.length} of ${images.length} files shown`}
        </CardDescription>
        <div className="mt-3">
          <FileFilterControls
            search={search}
            kind={kind}
            onSearchChange={setSearch}
            onKindChange={setKind}
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <Checkbox
              id="select-all"
              checked={allVisibleSelected}
              disabled={visibleIds.length === 0}
              onCheckedChange={() => onSelectAll(visibleIds)}
            />
            <label
              htmlFor="select-all"
              className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline"
            >
              Select All
            </label>
          </div>

          {selectedIds.size > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  Bulk Actions ({selectedIds.size})
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={onBulkDelete}
                  disabled={isBulkDeleting}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(v) => v && onViewModeChange(v as "list" | "grid")}
            className="ml-auto"
          >
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid2X2 className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No files yet</h3>
            <p className="text-muted-foreground mb-6">
              Upload your first file to get started.
            </p>
            <Button onClick={onNavigateToUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="py-12 text-center">
            <ImageIcon className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <h3 className="font-semibold">No matching files</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or file type.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }
          >
            {filteredFiles.map((img) =>
              viewMode === "grid" ? (
                <FileGridItem
                  key={img.id}
                  img={img}
                  selected={selectedIds.has(img.id)}
                  onToggleSelection={onToggleSelection}
                  onPreview={onPreview}
                  onDelete={onDeleteRequest}
                  copyToClipboard={copyToClipboard}
                />
              ) : (
                <FileListItem
                  key={img.id}
                  img={img}
                  selected={selectedIds.has(img.id)}
                  onToggleSelection={onToggleSelection}
                  onPreview={onPreview}
                  onDelete={onDeleteRequest}
                  copyToClipboard={copyToClipboard}
                />
              ),
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
