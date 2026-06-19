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

export type BackupsResponse = {
  config: BackupConfig;
  backups: BackupRecord[];
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

export function useBackups() {
  return useQuery<BackupsResponse>({
    queryKey: ["backups"],
    queryFn: async () => {
      const { data } = await api.get("/api/admin/backups");
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

export function useCreateBackupMutation(type: "json" | "sql") {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
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
