"use client";

import { Download, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getBackupDownloadUrl,
  type BackupRecord,
} from "@/features/backups/hooks/use-backups";

type BackupFileActionsMenuProps = {
  backup: BackupRecord;
  disabled?: boolean;
  onRestore: () => void;
  onDelete: () => void;
};

export function BackupFileActionsMenu({
  backup,
  disabled,
  onRestore,
  onDelete,
}: BackupFileActionsMenuProps) {
  const canDownload = Boolean(backup.storageKey) && backup.status !== "running";
  const canRestore = backup.type === "json" && backup.status === "success";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          disabled={disabled}
          aria-label={`Actions for ${backup.filename}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {canDownload && (
          <DropdownMenuItem asChild>
            <a href={getBackupDownloadUrl(backup.id)} download={backup.filename}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </DropdownMenuItem>
        )}
        {canRestore && (
          <DropdownMenuItem
            disabled={disabled}
            onSelect={(event) => {
              event.preventDefault();
              onRestore();
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Restore metadata
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          disabled={disabled}
          onSelect={(event) => {
            event.preventDefault();
            onDelete();
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
