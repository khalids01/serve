"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatBytes } from "@/lib/format-bytes";

export type DashboardStats = {
  totalFiles: number;
  totalApplications: number;
  totalApiKeys: number;
  storageUsed: string;
};

type StatsResponse = {
  storageBytes: number;
  totals: { files: number; applications: number; apiKeys: number };
};

export function useDashboardData() {
  const statsQuery = useQuery<StatsResponse>({
    queryKey: ["stats", "dashboard"],
    queryFn: async () => {
      const { data } = await api.get("/api/stats");
      return data;
    },
  });

  const totals = statsQuery.data?.totals;
  const stats: DashboardStats = {
    totalFiles: totals?.files ?? 0,
    totalApplications: totals?.applications ?? 0,
    totalApiKeys: totals?.apiKeys ?? 0,
    storageUsed: formatBytes(statsQuery.data?.storageBytes ?? 0),
  };

  return { ...statsQuery, isLoading: statsQuery.isLoading, stats, statsQuery };
}
