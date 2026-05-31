"use client";

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { ImageFileDTO } from "@/features/applications/components/application-details/types";

type ApiImage = ImageFileDTO & {
  applicationId?: string;
  application?: { id: string; name: string; slug: string };
};

type ImagesResponse = {
  images: ApiImage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

function mapImage(img: ApiImage): ImageFileDTO {
  return {
    id: img.id,
    filename: img.filename,
    originalName: img.originalName,
    contentType: img.contentType,
    sizeBytes: img.sizeBytes,
    width: img.width,
    height: img.height,
    createdAt:
      typeof img.createdAt === "string"
        ? img.createdAt
        : new Date(img.createdAt).toISOString(),
    applicationId: img.applicationId ?? img.application?.id,
    applicationName: img.applicationName ?? img.application?.name,
    linkedApplications: img.linkedApplications,
    variants: img.variants ?? [],
  };
}

export function useImages(applicationId?: string) {
  return useQuery({
    queryKey: ["all-images", applicationId ?? "all"],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: "100", sortOrder: "desc" });
      if (applicationId) {
        params.set("applicationId", applicationId);
      }
      const { data } = await api.get<ImagesResponse>(`/api/images?${params}`);
      return {
        images: (data.images ?? []).map(mapImage),
        pagination: data.pagination,
      };
    },
  });
}
