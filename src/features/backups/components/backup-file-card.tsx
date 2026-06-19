"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { BackupFileActionsMenu } from "@/features/backups/components/backup-file-actions-menu";
import {
  type BackupRecord,
  formatBackupSize,
  formatDateTime,
} from "@/features/backups/hooks/use-backups";

const statusVariant = {
  success: "default",
  failed: "destructive",
  running: "secondary",
} as const;

type BackupFileCardProps = {
  backup: BackupRecord;
  selected: boolean;
  disabled?: boolean;
  onToggle: (checked: boolean) => void;
  onRestore: () => void;
  onDelete: () => void;
};

export function BackupFileCard({
  backup,
  selected,
  disabled,
  onToggle,
  onRestore,
  onDelete,
}: BackupFileCardProps) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={selected}
            onCheckedChange={(checked) => onToggle(checked === true)}
            aria-label={`Select ${backup.filename}`}
            className="mt-1"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium">{backup.filename}</div>
            <div className="truncate text-xs text-muted-foreground">
              {backup.storageKey ?? backup.errorMessage ?? "No storage key"}
            </div>
          </div>
          <BackupFileActionsMenu
            backup={backup}
            disabled={disabled}
            onRestore={onRestore}
            onDelete={onDelete}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{backup.type}</Badge>
          <Badge variant="secondary">{backup.period}</Badge>
          <Badge variant={statusVariant[backup.status]}>{backup.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Size</p>
            <p>{formatBackupSize(backup.sizeBytes)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Completed</p>
            <p className="truncate">{formatDateTime(backup.completedAt)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
