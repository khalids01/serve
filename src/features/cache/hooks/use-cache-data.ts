"use client";

import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ApplicationCacheStat = {
  id: string;
  name: string;
  slug: string;
  fileCount: number;
  totalBytes: number;
};

export type CacheOverviewResponse = {
  cacheInStorage: boolean;
  fileCount: number;
  totalBytes: number;
  applications: ApplicationCacheStat[];
};

export function formatCacheSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function useCacheOverview() {
  return useQuery<CacheOverviewResponse>({
    queryKey: ["cache-overview"],
    queryFn: async () => {
      const { data } = await api.get("/api/cache");
      return data;
    },
  });
}

export function useClearAllCacheMutation() {
  const qc = useQueryClient();
  return useMutation<{ success: boolean; clearedBytes: number }, Error, void>({
    mutationFn: async () => {
      const { data } = await api.delete("/api/cache");
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["cache-overview"] });
      await qc.invalidateQueries({ queryKey: ["application-cache"] });
    },
  });
}

export function useClearApplicationCacheMutation() {
  const qc = useQueryClient();
  return useMutation<
    { success: boolean; clearedBytes: number },
    Error,
    string
  >({
    mutationFn: async (applicationId: string) => {
      const { data } = await api.delete(
        `/api/applications/${applicationId}/cache`,
      );
      return data;
    },
    onSuccess: async (_data, applicationId) => {
      await qc.invalidateQueries({ queryKey: ["cache-overview"] });
      await qc.invalidateQueries({
        queryKey: ["application-cache", applicationId],
      });
    },
  });
}
