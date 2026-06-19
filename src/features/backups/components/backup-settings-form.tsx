"use client";

import { Save, UploadCloud } from "lucide-react";
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
  formatTimeAgo,
  type BackupConfig,
  type BackupSettingsFormState,
} from "@/features/backups/hooks/use-backups";

type BackupSettingsFormProps = {
  form: BackupSettingsFormState;
  config?: BackupConfig;
  disabled?: boolean;
  onChange: (form: BackupSettingsFormState) => void;
  onSave: () => void;
};

function Field({
  id,
  label,
  helper,
  children,
}: {
  id: string;
  label: string;
  helper: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1">{children}</div>
      <p className="text-xs text-muted-foreground mt-1">{helper}</p>
    </div>
  );
}

export function BackupSettingsForm({
  form,
  config,
  disabled,
  onChange,
  onSave,
}: BackupSettingsFormProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="h-5 w-5" />
          Backup Settings
        </CardTitle>
        <CardDescription>
          Defaults come from config.ts; saved values override them in the
          database.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Last metadata backup was{" "}
              <span className="font-semibold text-foreground">
                {formatTimeAgo(config?.lastJsonBackupAt)}
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Last database backup was{" "}
              <span className="font-semibold text-foreground">
                {formatTimeAgo(config?.lastSqlBackupAt)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <Label htmlFor="backup-enabled">Enable backups</Label>
            <p className="text-sm text-muted-foreground">
              Required for scheduled and manual backups.
            </p>
          </div>
          <Switch
            id="backup-enabled"
            checked={form.enabled}
            onCheckedChange={(enabled) => onChange({ ...form, enabled })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            id="basePrefix"
            label="Backup folder in storage"
            helper="Path prefix where backup files are saved."
          >
            <Input
              id="basePrefix"
              value={form.basePrefix}
              onChange={(e) =>
                onChange({ ...form, basePrefix: e.target.value })
              }
            />
          </Field>
          <Field
            id="schedulerIntervalMinutes"
            label="Check for scheduled backups every (minutes)"
            helper="How often the scheduler looks for due backup jobs."
          >
            <Input
              id="schedulerIntervalMinutes"
              type="number"
              min={1}
              value={form.schedulerIntervalMinutes}
              onChange={(e) =>
                onChange({
                  ...form,
                  schedulerIntervalMinutes: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field
            id="jsonIntervalDays"
            label="Auto-backup image metadata every (days)"
            helper="JSON snapshot of applications, files, and links."
          >
            <Input
              id="jsonIntervalDays"
              type="number"
              min={1}
              value={form.jsonIntervalDays}
              onChange={(e) =>
                onChange({
                  ...form,
                  jsonIntervalDays: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field
            id="sqlIntervalDays"
            label="Auto-backup database every (days)"
            helper="Full PostgreSQL dump of your database."
          >
            <Input
              id="sqlIntervalDays"
              type="number"
              min={1}
              value={form.sqlIntervalDays}
              onChange={(e) =>
                onChange({
                  ...form,
                  sqlIntervalDays: Number(e.target.value),
                })
              }
            />
          </Field>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Automatic cleanup</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Backups older than these windows are removed when you run Clean old
            backups or on the next scheduled cleanup.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <Field
              id="dailyRetentionDays"
              label="Keep daily snapshots for (days)"
              helper="Older daily copies are auto-deleted."
            >
              <Input
                id="dailyRetentionDays"
                type="number"
                min={1}
                value={form.dailyRetentionDays}
                onChange={(e) =>
                  onChange({
                    ...form,
                    dailyRetentionDays: Number(e.target.value),
                  })
                }
              />
            </Field>
            <Field
              id="weeklyRetentionWeeks"
              label="Keep weekly snapshots for (weeks)"
              helper="Older weekly copies are auto-deleted."
            >
              <Input
                id="weeklyRetentionWeeks"
                type="number"
                min={1}
                value={form.weeklyRetentionWeeks}
                onChange={(e) =>
                  onChange({
                    ...form,
                    weeklyRetentionWeeks: Number(e.target.value),
                  })
                }
              />
            </Field>
            <Field
              id="monthlyRetentionMonths"
              label="Keep monthly snapshots for (months)"
              helper="Older monthly copies are auto-deleted."
            >
              <Input
                id="monthlyRetentionMonths"
                type="number"
                min={1}
                value={form.monthlyRetentionMonths}
                onChange={(e) =>
                  onChange({
                    ...form,
                    monthlyRetentionMonths: Number(e.target.value),
                  })
                }
              />
            </Field>
          </div>
        </div>

        <div className="flex justify-end">
          <Button disabled={disabled} onClick={onSave}>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
