"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export type BackupConfig = {
  id: string;
  enabled: boolean;
  basePrefix: string;
  jsonIntervalMinutes: number;
  sqlIntervalMinutes: number;
  schedulerIntervalMinutes: number;
  dailyRetentionDays: number;
  weeklyRetentionWeeks: number;
  monthlyRetentionMonths: number;
  lastJsonBackupAt: string | null;
  lastSqlBackupAt: string | null;
};

export type BackupRecord = {
  id: string;
  type: "json" | "sql";
  period: "daily" | "weekly" | "monthly";
  status: "running" | "success" | "failed";
  trigger: "manual" | "scheduled";
  storageKey: string | null;
  filename: string;
  sizeBytes: number | null;
  errorMessage: string | null;
  createdByUserId: string | null;
  startedAt: string;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BackupListParams = {
  page?: number;
  limit?: number;
  type?: "json" | "sql" | "";
  period?: "daily" | "weekly" | "monthly" | "";
  status?: "success" | "failed" | "running" | "";
  sizeMin?: number;
  sizeMax?: number;
  completedFrom?: string;
  completedTo?: string;
};

export const DEFAULT_BACKUP_LIST_PARAMS: BackupListParams = {
  page: 1,
  limit: 20,
  type: "json",
};

const MINUTES_PER_DAY = 24 * 60;

export function minutesToDays(minutes: number): number {
  return Math.max(1, Math.round(minutes / MINUTES_PER_DAY));
}

export function daysToMinutes(days: number): number {
  return Math.max(1, Math.floor(days)) * MINUTES_PER_DAY;
}

export function formatTimeAgo(value?: string | null): string {
  if (!value) return "Never";
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return "Never";

  const diffSeconds = Math.round((then - Date.now()) / 1000);
  const absSeconds = Math.abs(diffSeconds);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  if (absSeconds < 60) return rtf.format(diffSeconds, "second");
  const diffMinutes = Math.round(diffSeconds / 60);
  if (Math.abs(diffMinutes) < 60) return rtf.format(diffMinutes, "minute");
  const diffHours = Math.round(diffMinutes / 60);
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, "hour");
  const diffDays = Math.round(diffHours / 24);
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, "day");
  const diffMonths = Math.round(diffDays / 30);
  if (Math.abs(diffMonths) < 12) return rtf.format(diffMonths, "month");
  return rtf.format(Math.round(diffMonths / 12), "year");
}

export function settingsFormToConfigPayload(form: BackupSettingsFormState) {
  return {
    enabled: form.enabled,
    basePrefix: form.basePrefix,
    jsonIntervalMinutes: daysToMinutes(form.jsonIntervalDays),
    sqlIntervalMinutes: daysToMinutes(form.sqlIntervalDays),
    schedulerIntervalMinutes: form.schedulerIntervalMinutes,
    dailyRetentionDays: form.dailyRetentionDays,
    weeklyRetentionWeeks: form.weeklyRetentionWeeks,
    monthlyRetentionMonths: form.monthlyRetentionMonths,
  };
}

export type BackupPagination = {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type BackupsResponse = {
  config: BackupConfig;
  backups: BackupRecord[];
  totalBytes: number;
  pagination: BackupPagination;
};

export function formatBackupSize(bytes?: number | null) {
  if (!bytes) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    units.length - 1,
  );
  return `${Number((bytes / k ** index).toFixed(2))} ${units[index]}`;
}

export function formatDateTime(value?: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function buildBackupQueryParams(params: BackupListParams) {
  const query = new URLSearchParams();
  query.set("page", String(params.page ?? 1));
  query.set("limit", String(params.limit ?? 20));
  if (params.type) query.set("type", params.type);
  if (params.period) query.set("period", params.period);
  if (params.status) query.set("status", params.status);
  if (params.sizeMin != null) query.set("sizeMin", String(params.sizeMin));
  if (params.sizeMax != null) query.set("sizeMax", String(params.sizeMax));
  if (params.completedFrom) query.set("completedFrom", params.completedFrom);
  if (params.completedTo) query.set("completedTo", params.completedTo);
  return query.toString();
}

export function useBackups(params: BackupListParams = {}) {
  return useQuery<BackupsResponse>({
    queryKey: ["backups", params],
    queryFn: async () => {
      const { data } = await api.get(
        `/api/admin/backups?${buildBackupQueryParams(params)}`,
      );
      return data;
    },
  });
}

export function useUpdateBackupConfigMutation() {
  const qc = useQueryClient();
  return useMutation<{ config: BackupConfig }, Error, Partial<BackupConfig>>({
    mutationFn: async (input) => {
      const { data } = await api.patch("/api/admin/backups/config", input);
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["backups"] });
    },
  });
}

export function useCreateBackupMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (type: "json" | "sql") => {
      const { data } = await api.post(`/api/admin/backups/${type}`);
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["backups"] });
    },
  });
}

export function useDeleteBackupMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete(`/api/admin/backups/${id}`);
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["backups"] });
    },
  });
}

export function useSyncBackupMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/api/admin/backups/${id}/sync`);
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["backups"] });
      await qc.invalidateQueries({ queryKey: ["all-images"] });
    },
  });
}

export function useCleanupOldBackupsMutation() {
  const qc = useQueryClient();
  return useMutation<
    { success: boolean; deletedCount: number; freedBytes: number },
    Error,
    void
  >({
    mutationFn: async () => {
      const { data } = await api.post("/api/admin/backups/cleanup");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["backups"] });
    },
  });
}

export function useBulkDeleteBackupsMutation() {
  const qc = useQueryClient();
  return useMutation<
    { success: boolean; deletedCount: number; freedBytes: number },
    Error,
    string[]
  >({
    mutationFn: async (ids) => {
      const { data } = await api.post("/api/admin/backups/bulk-delete", {
        ids,
      });
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["backups"] });
    },
  });
}

export function useBulkSyncBackupsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { data } = await api.post("/api/admin/backups/bulk-sync", { ids });
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["backups"] });
      await qc.invalidateQueries({ queryKey: ["all-images"] });
    },
  });
}

export type BackupSettingsFormState = {
  enabled: boolean;
  basePrefix: string;
  jsonIntervalDays: number;
  sqlIntervalDays: number;
  schedulerIntervalMinutes: number;
  dailyRetentionDays: number;
  weeklyRetentionWeeks: number;
  monthlyRetentionMonths: number;
};

export function toBackupSettingsForm(
  config?: BackupConfig,
): BackupSettingsFormState {
  return {
    enabled: config?.enabled ?? true,
    basePrefix: config?.basePrefix ?? "data-backup",
    jsonIntervalDays: minutesToDays(config?.jsonIntervalMinutes ?? 720),
    sqlIntervalDays: minutesToDays(config?.sqlIntervalMinutes ?? 720),
    schedulerIntervalMinutes: config?.schedulerIntervalMinutes ?? 5,
    dailyRetentionDays: config?.dailyRetentionDays ?? 3,
    weeklyRetentionWeeks: config?.weeklyRetentionWeeks ?? 3,
    monthlyRetentionMonths: config?.monthlyRetentionMonths ?? 3,
  };
}
