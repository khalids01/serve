"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FILE_KIND_LABELS,
  FILE_KINDS,
  type FileKind,
} from "@/features/files/lib/file-kind";

interface FileFilterControlsProps {
  search: string;
  kind: FileKind;
  onSearchChange: (value: string) => void;
  onKindChange: (value: FileKind) => void;
}

export function FileFilterControls({
  search,
  kind,
  onSearchChange,
  onKindChange,
}: FileFilterControlsProps) {
  const hasFilters = Boolean(search || kind !== "all");

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1 sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search files..."
          aria-label="Search files"
          className="pl-9"
        />
      </div>
      <Select
        value={kind}
        onValueChange={(value) => onKindChange(value as FileKind)}
      >
        <SelectTrigger
          className="w-full sm:w-44"
          aria-label="Filter by file type"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FILE_KINDS.map((value) => (
            <SelectItem key={value} value={value}>
              {FILE_KIND_LABELS[value]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            onSearchChange("");
            onKindChange("all");
          }}
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      )}
    </div>
  );
}
