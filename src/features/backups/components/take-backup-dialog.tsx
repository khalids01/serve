"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateBackupMutation } from "@/features/backups/hooks/use-backups";

type TakeBackupDialogProps = {
  enabled?: boolean;
  disabled?: boolean;
};

export function TakeBackupDialog({
  enabled = true,
  disabled,
}: TakeBackupDialogProps) {
  const [open, setOpen] = useState(false);
  const [backupType, setBackupType] = useState<"json" | "sql">("sql");
  const createBackup = useCreateBackupMutation();

  async function handleTakeBackup() {
    try {
      await createBackup.mutateAsync(backupType);
      toast.success(
        backupType === "sql"
          ? "Database backup created"
          : "Image metadata backup created",
      );
      setOpen(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create backup",
      );
    }
  }

  return (
    <>
      <Button disabled={disabled || !enabled} onClick={() => setOpen(true)}>
        Take backup
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Take backup now</DialogTitle>
            <DialogDescription>
              Choose what to back up. Files are stored under your configured
              backup folder.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="backup-type">Backup type</Label>
            <Select
              value={backupType}
              onValueChange={(value) =>
                setBackupType(value as "json" | "sql")
              }
            >
              <SelectTrigger id="backup-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sql">Database (SQL)</SelectItem>
                <SelectItem value="json">Image metadata (JSON)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {backupType === "sql"
                ? "Full PostgreSQL dump of your database."
                : "JSON snapshot of applications, files, links, and variants — not the raw files in storage."}
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={createBackup.isPending}
              onClick={() => void handleTakeBackup()}
            >
              {createBackup.isPending ? "Creating..." : "Take backup now"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
