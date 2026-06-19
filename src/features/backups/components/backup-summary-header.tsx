"use client";

import { HardDrive } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBackupSize } from "@/features/backups/hooks/use-backups";

type BackupSummaryHeaderProps = {
  totalBytes: number;
  totalFiles: number;
};

export function BackupSummaryHeader({
  totalBytes,
  totalFiles,
}: BackupSummaryHeaderProps) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total backup storage
          </CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatBackupSize(totalBytes)}</div>
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
          <div className="text-2xl font-bold">{totalFiles.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Matching current filters
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
