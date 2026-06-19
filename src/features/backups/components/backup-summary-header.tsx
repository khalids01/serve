"use client";

import { HardDrive, Trash2 } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatBackupSize,
  useCleanupOldBackupsMutation,
} from "@/features/backups/hooks/use-backups";

type BackupSummaryHeaderProps = {
  totalBytes: number;
  totalFiles: number;
  disabled?: boolean;
};

export function BackupSummaryHeader({
  totalBytes,
  totalFiles,
  disabled,
}: BackupSummaryHeaderProps) {
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
      <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total backup storage
              </CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatBackupSize(totalBytes)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                All backup files in storage
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Backup files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalFiles.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Matching current filters
              </p>
            </CardContent>
          </Card>
        </div>
        <Button
          variant="outline"
          className="text-destructive hover:text-destructive"
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
            <AlertDialogCancel disabled={cleanup.isPending}>Cancel</AlertDialogCancel>
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
