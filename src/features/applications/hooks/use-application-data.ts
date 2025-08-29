"use client";

import api from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Shared types
export interface Application {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  storageDir: string;
  _count: { images: number; apiKeys: number };
}

export interface ImageFile {
  id: string;
  filename: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
  variants: Array<{
    id: string;
    label: string;
    filename: string;
    width?: number;
    height?: number;
    sizeBytes: number;
  }>;
}

export interface AuditLogItem {
  id: string;
  userId?: string | null;
  applicationId?: string | null;
  action: string;
  targetId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: any;
  createdAt: string;
}

export interface CacheItem {
  name: string;
  sizeBytes: number;
  mtimeMs?: number;
}
export interface CacheResponse {
  items: CacheItem[];
  totalBytes: number;
}

export type UseApplicationDataOptions = {
  id?: string;

  fetchList?: boolean;
  fetchImages?: boolean;
  fetchActivity?: boolean;
  fetchCache?: boolean;
};


export function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}


export function useApplicationData(options?: UseApplicationDataOptions) {
  const {
    id,
    fetchList,
    fetchImages: doImages,
    fetchActivity: doActivity,
    fetchCache: doCache,
  } = options ?? {};

  const qc = useQueryClient();

  const applicationQuery = useQuery({
    queryKey: ["application", id],
    queryFn: () => api.get(`/api/applications/${id}`),
    enabled: !!id,
  });

  const listQuery = useQuery<{ applications: Application[] }>({
    queryKey: ["applications", "list"],
    queryFn: () => api.get("/api/applications"),
    enabled: Boolean(fetchList),
  });

  const createMutation = useMutation({
    mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
      const { data } = await api.post("/api/applications", { name, slug });
      return data;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["applications"] });
    },
  });

  const imagesQuery = useQuery<ImageFile[]>({
    queryKey: ["application-images", id],
    queryFn: () =>
      api
        .get(`/api/images?applicationId=${id}`)
        ?.then((data) => data.data?.images ?? []),
    enabled: Boolean(doImages && id),
  });

  const activityQuery = useQuery<AuditLogItem[]>({
    queryKey: ["application-activity", id],
    // /api/audit-logs?applicationId=${applicationId}&limit=10
    queryFn: () =>
      api
        .get(`/api/audit-logs?applicationId=${id}&limit=10`)
        ?.then((data) => data.data?.logs ?? []),
    enabled: Boolean(doActivity && id),
  });

  const cacheQuery = useQuery<CacheResponse>({
    queryKey: ["application-cache", id],
    queryFn: () => api.get(`/api/applications/${id}/cache`),
    enabled: Boolean(doCache && id),
  });

  return {
    application: applicationQuery.data ?? null,
    applications: listQuery.data?.applications ?? [],
    images: imagesQuery.data ?? [],
    activity: activityQuery.data ?? [],
    cache: cacheQuery.data,

    // loading states
    applicationLoading: applicationQuery.isLoading,
    applicationsLoading: listQuery.isLoading,
    imagesLoading: imagesQuery.isLoading,
    activityLoading: activityQuery.isLoading,
    cacheLoading: cacheQuery.isLoading,

    // expose queries if caller needs finer control
    applicationQuery,
    listQuery,
    imagesQuery,
    activityQuery,
    cacheQuery,

    // mutations
    createMutation,
  };
}
