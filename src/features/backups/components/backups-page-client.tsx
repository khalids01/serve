"use client";

import {
  Archive,
  Database,
  FileJson,
  RefreshCw,
  Save,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type BackupConfig,
  type BackupRecord,
  formatBackupSize,
  formatDateTime,
  useBackups,
  useCreateBackupMutation,
  useDeleteBackupMutation,
  useSyncBackupMutation,
  useUpdateBackupConfigMutation,
} from "@/features/backups/hooks/use-backups";

type BackupAction =
  | { type: "delete"; backup: BackupRecord }
  | { type: "sync"; backup: BackupRecord };

const statusVariant = {
  success: "default",
  failed: "destructive",
  running: "secondary",
} as const;

function toForm(config?: BackupConfig) {
  return {
    enabled: config?.enabled ?? true,
    basePrefix: config?.basePrefix ?? "data-backup",
    jsonIntervalMinutes: config?.jsonIntervalMinutes ?? 720,
    sqlIntervalMinutes: config?.sqlIntervalMinutes ?? 720,
    schedulerIntervalMinutes: config?.schedulerIntervalMinutes ?? 5,
    dailyRetentionDays: config?.dailyRetentionDays ?? 3,
    weeklyRetentionWeeks: config?.weeklyRetentionWeeks ?? 3,
    monthlyRetentionMonths: config?.monthlyRetentionMonths ?? 3,
  };
}

export function BackupsPageClient() {
  const { data, isLoading, isError, error, refetch } = useBackups();
  const updateConfig = useUpdateBackupConfigMutation();
  const createJson = useCreateBackupMutation("json");
  const createSql = useCreateBackupMutation("sql");
  const deleteBackup = useDeleteBackupMutation();
  const syncBackup = useSyncBackupMutation();
  const [form, setForm] = useState(() => toForm());
  const [action, setAction] = useState<BackupAction | null>(null);

  useEffect(() => {
    if (data?.config) {
      setForm(toForm(data.config));
    }
  }, [data?.config]);

  const isBusy = useMemo(
    () =>
      updateConfig.isPending ||
      createJson.isPending ||
      createSql.isPending ||
      deleteBackup.isPending ||
      syncBackup.isPending,
    [
      updateConfig.isPending,
      createJson.isPending,
      createSql.isPending,
      deleteBackup.isPending,
      syncBackup.isPending,
    ],
  );

  async function saveConfig() {
    try {
      await updateConfig.mutateAsync(form);
      toast.success("Backup settings saved");
    } catch {
      toast.error("Failed to save backup settings");
    }
  }

  async function createBackup(type: "json" | "sql") {
    try {
      if (type === "json") {
        await createJson.mutateAsync();
        toast.success("JSON backup created");
      } else {
        await createSql.mutateAsync();
        toast.success("SQL backup created");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create backup",
      );
    }
  }

  async function confirmAction() {
    if (!action) return;
    try {
      if (action.type === "delete") {
        await deleteBackup.mutateAsync(action.backup.id);
        toast.success("Backup deleted");
      } else {
        const response = await syncBackup.mutateAsync(action.backup.id);
        const result = response.result;
        toast.success(
          `Synced ${result.images} images and ${result.imageApplications} links`,
        );
      }
      setAction(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    }
  }

  const config = data?.config;

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Backups</h1>
            <p className="text-muted-foreground mt-2">
              Manage image metadata snapshots and PostgreSQL dumps
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={isBusy || isLoading || !config?.enabled}
              onClick={() => createBackup("json")}
            >
              <FileJson className="mr-2 h-4 w-4" />
              JSON
            </Button>
            <Button
              disabled={isBusy || isLoading || !config?.enabled}
              onClick={() => createBackup("sql")}
            >
              <Database className="mr-2 h-4 w-4" />
              SQL
            </Button>
          </div>
        </div>

        {isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Backups unavailable</AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "Failed to load backup data."}
              <Button
                variant="outline"
                size="sm"
                className="ml-3"
                onClick={() => refetch()}
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5" />
                Backup Settings
              </CardTitle>
              <CardDescription>
                Defaults come from config.ts; these values override them in the
                database.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label htmlFor="backup-enabled">Enable backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Scheduled and manual backups require this switch.
                  </p>
                </div>
                <Switch
                  id="backup-enabled"
                  checked={form.enabled}
                  onCheckedChange={(enabled) =>
                    setForm((prev) => ({ ...prev, enabled }))
                  }
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="basePrefix">Storage prefix</Label>
                  <Input
                    id="basePrefix"
                    value={form.basePrefix}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        basePrefix: event.target.value,
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="schedulerIntervalMinutes">
                    Scheduler check minutes
                  </Label>
                  <Input
                    id="schedulerIntervalMinutes"
                    type="number"
                    min={1}
                    value={form.schedulerIntervalMinutes}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        schedulerIntervalMinutes: Number(event.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="jsonIntervalMinutes">
                    JSON interval minutes
                  </Label>
                  <Input
                    id="jsonIntervalMinutes"
                    type="number"
                    min={1}
                    value={form.jsonIntervalMinutes}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        jsonIntervalMinutes: Number(event.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sqlIntervalMinutes">
                    SQL interval minutes
                  </Label>
                  <Input
                    id="sqlIntervalMinutes"
                    type="number"
                    min={1}
                    value={form.sqlIntervalMinutes}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        sqlIntervalMinutes: Number(event.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="dailyRetentionDays">
                    Daily retention days
                  </Label>
                  <Input
                    id="dailyRetentionDays"
                    type="number"
                    min={1}
                    value={form.dailyRetentionDays}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        dailyRetentionDays: Number(event.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="weeklyRetentionWeeks">
                    Weekly retention weeks
                  </Label>
                  <Input
                    id="weeklyRetentionWeeks"
                    type="number"
                    min={1}
                    value={form.weeklyRetentionWeeks}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        weeklyRetentionWeeks: Number(event.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyRetentionMonths">
                    Monthly retention months
                  </Label>
                  <Input
                    id="monthlyRetentionMonths"
                    type="number"
                    min={1}
                    value={form.monthlyRetentionMonths}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        monthlyRetentionMonths: Number(event.target.value),
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button disabled={isBusy || isLoading} onClick={saveConfig}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Last JSON Backup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {formatDateTime(config?.lastJsonBackupAt)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Last SQL Backup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  {formatDateTime(config?.lastSqlBackupAt)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Backup Files
            </CardTitle>
            <CardDescription>
              Daily, weekly, and monthly snapshots stored under the configured
              prefix.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-12 text-center text-muted-foreground">
                Loading backups...
              </div>
            ) : (data?.backups.length ?? 0) === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No backups have been created yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
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
                  {data?.backups.map((backup) => (
                    <TableRow key={backup.id}>
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
                      <TableCell>
                        {formatBackupSize(backup.sizeBytes)}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(backup.completedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {backup.type === "json" &&
                            backup.status === "success" && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isBusy}
                                onClick={() =>
                                  setAction({ type: "sync", backup })
                                }
                              >
                                <RefreshCw className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isBusy}
                            onClick={() =>
                              setAction({ type: "delete", backup })
                            }
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <AlertDialog
        open={Boolean(action)}
        onOpenChange={(open) => !open && setAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {action?.type === "sync"
                ? "Sync metadata backup?"
                : "Delete backup?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {action?.type === "sync"
                ? "This will upsert image/file metadata from the JSON backup. Existing database records will not be deleted."
                : "This will delete the backup object from storage and remove its database record."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              {action?.type === "sync" ? "Sync" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
