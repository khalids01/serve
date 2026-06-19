"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TakeBackupDialog } from "@/features/backups/components/take-backup-dialog";
import {
  formatBackupSize,
  useCleanupOldBackupsMutation,
} from "@/features/backups/hooks/use-backups";

type BackupHeaderActionsProps = {
  enabled?: boolean;
  disabled?: boolean;
};

export function BackupHeaderActions({
  enabled,
  disabled,
}: BackupHeaderActionsProps) {
  const cleanup = useCleanupOldBackupsMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleCleanup() {
    try {
      const result = await cleanup.mutateAsync();
      toast.success(
        `Removed ${result.deletedCount} old backup${result.deletedCount === 1 ? "" : "s"} (${formatBackupSize(result.freedBytes)} freed)`,
      );
      setConfirmOpen(false);
    } catch {
      toast.error("Failed to clean old backups");
    }
  }

  return (
    <>
      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        <TakeBackupDialog
          enabled={enabled}
          disabled={disabled}
          className="w-full sm:w-auto"
        />
        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive sm:w-auto"
          disabled={disabled || cleanup.isPending}
          onClick={() => setConfirmOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clean old backups
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clean old backups?</AlertDialogTitle>
            <AlertDialogDescription>
              This deletes backup files that are older than your retention
              settings (daily, weekly, and monthly). Recent backups are kept.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cleanup.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={cleanup.isPending}
              onClick={(e) => {
                e.preventDefault();
                void handleCleanup();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cleanup.isPending ? "Cleaning..." : "Clean old backups"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
