"use client";

import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BackupFilesTable } from "@/features/backups/components/backup-files-table";
import { BackupHeaderActions } from "@/features/backups/components/backup-header-actions";
import { BackupSettingsForm } from "@/features/backups/components/backup-settings-form";
import { BackupSummaryHeader } from "@/features/backups/components/backup-summary-header";
import {
  DEFAULT_BACKUP_LIST_PARAMS,
  settingsFormToConfigPayload,
  toBackupSettingsForm,
  useBackups,
  useCreateBackupMutation,
  useUpdateBackupConfigMutation,
} from "@/features/backups/hooks/use-backups";

export function BackupsPageClient() {
  const [listParams, setListParams] = useState(DEFAULT_BACKUP_LIST_PARAMS);
  const { data, isLoading, isError, error, refetch } = useBackups(listParams);
  const updateConfig = useUpdateBackupConfigMutation();
  const createBackup = useCreateBackupMutation();
  const [form, setForm] = useState(() => toBackupSettingsForm());

  useEffect(() => {
    if (data?.config) {
      setForm(toBackupSettingsForm(data.config));
    }
  }, [data?.config]);

  const isBusy = useMemo(
    () => updateConfig.isPending || createBackup.isPending,
    [updateConfig.isPending, createBackup.isPending],
  );

  async function saveConfig() {
    try {
      await updateConfig.mutateAsync(settingsFormToConfigPayload(form));
      toast.success("Backup settings saved");
    } catch {
      toast.error("Failed to save backup settings");
    }
  }

  const pagination = data?.pagination ?? {
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-6 sm:py-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Data Backup</h1>
            <p className="text-muted-foreground mt-2">
              Schedule and manage database dumps and image/file metadata
              snapshots
            </p>
          </div>
          <BackupHeaderActions
            enabled={data?.config?.enabled}
            disabled={isBusy || isLoading}
          />
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

        <BackupSummaryHeader
          totalBytes={data?.totalBytes ?? 0}
          totalFiles={pagination.total}
        />

        <BackupSettingsForm
          form={form}
          config={data?.config}
          disabled={isBusy || isLoading}
          onChange={setForm}
          onSave={saveConfig}
        />

        <BackupFilesTable
          backups={data?.backups ?? []}
          pagination={pagination}
          listParams={listParams}
          onListParamsChange={setListParams}
          isLoading={isLoading}
          disabled={isBusy}
        />
      </main>
    </div>
  );
}
