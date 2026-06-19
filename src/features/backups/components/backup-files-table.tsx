"use client";

import { Archive, RefreshCw, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  type BackupListParams,
  type BackupPagination,
  type BackupRecord,
  formatBackupSize,
  formatDateTime,
  useBulkDeleteBackupsMutation,
  useBulkSyncBackupsMutation,
  useDeleteBackupMutation,
  useSyncBackupMutation,
} from "@/features/backups/hooks/use-backups";

const statusVariant = {
  success: "default",
  failed: "destructive",
  running: "secondary",
} as const;

type ConfirmAction =
  | { type: "delete-one"; backup: BackupRecord }
  | { type: "delete-bulk"; backups: BackupRecord[] }
  | { type: "sync-one"; backup: BackupRecord }
  | { type: "sync-bulk"; backups: BackupRecord[] };

type BackupFilesTableProps = {
  backups: BackupRecord[];
  pagination: BackupPagination;
  listParams: BackupListParams;
  onListParamsChange: (params: BackupListParams) => void;
  isLoading?: boolean;
  disabled?: boolean;
};

function kbToBytes(kb: string) {
  const value = Number(kb);
  return Number.isFinite(value) && value >= 0 ? Math.round(value * 1024) : undefined;
}

export function BackupFilesTable({
  backups,
  pagination,
  listParams,
  onListParamsChange,
  isLoading,
  disabled,
}: BackupFilesTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [sizeMinKb, setSizeMinKb] = useState("");
  const [sizeMaxKb, setSizeMaxKb] = useState("");

  const deleteBackup = useDeleteBackupMutation();
  const syncBackup = useSyncBackupMutation();
  const bulkDelete = useBulkDeleteBackupsMutation();
  const bulkSync = useBulkSyncBackupsMutation();

  const pageIds = useMemo(() => backups.map((b) => b.id), [backups]);
  const allPageSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const somePageSelected =
    pageIds.some((id) => selectedIds.includes(id)) && !allPageSelected;

  const selectedBackups = useMemo(
    () => backups.filter((b) => selectedIds.includes(b.id)),
    [backups, selectedIds],
  );

  const isBusy =
    disabled ||
    deleteBackup.isPending ||
    syncBackup.isPending ||
    bulkDelete.isPending ||
    bulkSync.isPending;

  function updateParams(
    patch: Partial<BackupListParams>,
    resetPage = !("page" in patch && patch.page !== undefined),
  ) {
    const nextPage =
      "page" in patch && patch.page !== undefined
        ? patch.page
        : resetPage
          ? 1
          : (listParams.page ?? 1);

    onListParamsChange({
      ...listParams,
      ...patch,
      page: nextPage,
    });
  }

  function applySizeFilter() {
    onListParamsChange({
      ...listParams,
      page: 1,
      sizeMin: kbToBytes(sizeMinKb),
      sizeMax: kbToBytes(sizeMaxKb),
    });
  }

  function toggleAllPage(checked: boolean) {
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...pageIds])]);
    } else {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    }
  }

  function toggleRow(id: string, checked: boolean) {
    setSelectedIds((prev) =>
      checked ? [...prev, id] : prev.filter((item) => item !== id),
    );
  }

  async function confirmActionHandler() {
    if (!confirmAction) return;
    try {
      if (confirmAction.type === "delete-one") {
        await deleteBackup.mutateAsync(confirmAction.backup.id);
        setSelectedIds((prev) =>
          prev.filter((id) => id !== confirmAction.backup.id),
        );
        toast.success("Backup deleted");
      } else if (confirmAction.type === "delete-bulk") {
        const ids = confirmAction.backups.map((b) => b.id);
        const result = await bulkDelete.mutateAsync(ids);
        setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
        toast.success(
          `Deleted ${result.deletedCount} backup${result.deletedCount === 1 ? "" : "s"}`,
        );
      } else if (confirmAction.type === "sync-one") {
        const response = await syncBackup.mutateAsync(confirmAction.backup.id);
        const result = response.result;
        toast.success(
          `Restored metadata: ${result.images} images, ${result.imageApplications} links`,
        );
      } else if (confirmAction.type === "sync-bulk") {
        const ids = confirmAction.backups.map((b) => b.id);
        const response = await bulkSync.mutateAsync(ids);
        const result = response.result;
        toast.success(
          `Restored ${result.syncedCount} backup${result.syncedCount === 1 ? "" : "s"} (${result.images} images)`,
        );
        if (result.skippedCount > 0) {
          toast.message(`${result.skippedCount} backup(s) could not be restored`);
        }
      }
      setConfirmAction(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    }
  }

  const syncableSelected = selectedBackups.filter(
    (b) => b.type === "json" && b.status === "success",
  );

  const showingFrom =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const showingTo = Math.min(
    pagination.page * pagination.limit,
    pagination.total,
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Backup Files
          </CardTitle>
          <CardDescription>
            Filter, paginate, and manage backup snapshots.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <Label>Type</Label>
              <Select
                value={listParams.type || "all"}
                onValueChange={(value) =>
                  updateParams({
                    type: value === "all" ? "" : (value as "json" | "sql"),
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="sql">Database (SQL)</SelectItem>
                  <SelectItem value="json">Image metadata (JSON)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Period</Label>
              <Select
                value={listParams.period || "all"}
                onValueChange={(value) =>
                  updateParams({
                    period:
                      value === "all"
                        ? ""
                        : (value as "daily" | "weekly" | "monthly"),
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All periods</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={listParams.status || "all"}
                onValueChange={(value) =>
                  updateParams({
                    status:
                      value === "all"
                        ? ""
                        : (value as "success" | "failed" | "running"),
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rows per page</Label>
              <Select
                value={String(listParams.limit ?? 20)}
                onValueChange={(value) =>
                  updateParams({ limit: Number(value) })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50, 100].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="completedFrom">Completed from</Label>
              <Input
                id="completedFrom"
                type="date"
                className="mt-1"
                value={listParams.completedFrom ?? ""}
                onChange={(e) =>
                  updateParams({ completedFrom: e.target.value || undefined })
                }
              />
            </div>
            <div>
              <Label htmlFor="completedTo">Completed to</Label>
              <Input
                id="completedTo"
                type="date"
                className="mt-1"
                value={listParams.completedTo ?? ""}
                onChange={(e) =>
                  updateParams({ completedTo: e.target.value || undefined })
                }
              />
            </div>
            <div>
              <Label htmlFor="sizeMinKb">Min size (KB)</Label>
              <Input
                id="sizeMinKb"
                type="number"
                min={0}
                className="mt-1"
                value={sizeMinKb}
                onChange={(e) => setSizeMinKb(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sizeMaxKb">Max size (KB)</Label>
              <div className="mt-1 flex gap-2">
                <Input
                  id="sizeMaxKb"
                  type="number"
                  min={0}
                  value={sizeMaxKb}
                  onChange={(e) => setSizeMaxKb(e.target.value)}
                />
                <Button variant="outline" onClick={applySizeFilter}>
                  Apply
                </Button>
              </div>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-md border p-3">
              <span className="text-sm text-muted-foreground">
                {selectedIds.length} selected
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={isBusy || syncableSelected.length === 0}
                onClick={() =>
                  setConfirmAction({
                    type: "sync-bulk",
                    backups: syncableSelected,
                  })
                }
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Restore metadata
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isBusy}
                onClick={() =>
                  setConfirmAction({
                    type: "delete-bulk",
                    backups: selectedBackups,
                  })
                }
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                Delete selected
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              Loading backups...
            </div>
          ) : backups.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              No backups match your filters.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox
                      checked={allPageSelected}
                      onCheckedChange={(checked) =>
                        toggleAllPage(checked === true)
                      }
                      aria-label="Select all on page"
                      {...(somePageSelected ? { "data-state": "indeterminate" } : {})}
                    />
                  </TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(backup.id)}
                        onCheckedChange={(checked) =>
                          toggleRow(backup.id, checked === true)
                        }
                        aria-label={`Select ${backup.filename}`}
                      />
                    </TableCell>
                    <TableCell className="max-w-[320px]">
                      <div className="truncate font-medium">
                        {backup.filename}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {backup.storageKey ??
                          backup.errorMessage ??
                          "No storage key"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{backup.type}</Badge>
                    </TableCell>
                    <TableCell>{backup.period}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[backup.status]}>
                        {backup.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatBackupSize(backup.sizeBytes)}</TableCell>
                    <TableCell>{formatDateTime(backup.completedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {backup.type === "json" &&
                          backup.status === "success" && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={isBusy}
                                  onClick={() =>
                                    setConfirmAction({
                                      type: "sync-one",
                                      backup,
                                    })
                                  }
                                >
                                  <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Restore metadata from this backup
                              </TooltipContent>
                            </Tooltip>
                          )}
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isBusy}
                              onClick={() =>
                                setConfirmAction({
                                  type: "delete-one",
                                  backup,
                                })
                              }
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Delete backup</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {pagination.total > 0 && (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {showingFrom}–{showingTo} of {pagination.total}
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.hasPrev) {
                          updateParams({ page: pagination.page - 1 }, false);
                        }
                      }}
                      className={
                        !pagination.hasPrev
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-3 text-sm">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.hasNext) {
                          updateParams({ page: pagination.page + 1 }, false);
                        }
                      }}
                      className={
                        !pagination.hasNext
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(confirmAction)}
        onOpenChange={(open) => !open && setConfirmAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "delete-one" ||
              confirmAction?.type === "delete-bulk"
                ? "Delete backup?"
                : "Restore metadata?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "delete-one" &&
                "This will delete the backup file from storage and remove its record."}
              {confirmAction?.type === "delete-bulk" &&
                `Delete ${confirmAction.backups.length} selected backup file(s)? This cannot be undone.`}
              {(confirmAction?.type === "sync-one" ||
                confirmAction?.type === "sync-bulk") &&
                "This will upsert image and file metadata from the JSON backup into your database. Existing records are not deleted."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isBusy}
              onClick={(e) => {
                e.preventDefault();
                void confirmActionHandler();
              }}
              className={
                confirmAction?.type === "delete-one" ||
                confirmAction?.type === "delete-bulk"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : undefined
              }
            >
              {confirmAction?.type === "delete-one" ||
              confirmAction?.type === "delete-bulk"
                ? "Delete"
                : "Restore metadata"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
