"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface CropImageParams {
  imageId: string;
  croppedBlob: Blob;
  saveMode: "new" | "replace";
}

interface CropImageResponse {
  success: boolean;
  mode: "new" | "replace";
  image: {
    id: string;
    filename: string;
    originalName?: string;
    width?: number;
    height?: number;
  };
}

export function useCropImageMutation(applicationId: string) {
  const qc = useQueryClient();
  const router = useRouter();

  return useMutation<CropImageResponse, Error, CropImageParams>({
    mutationFn: async ({ imageId, croppedBlob, saveMode }: CropImageParams) => {
      const formData = new FormData();
      formData.append("file", croppedBlob, "cropped.jpg");
      formData.append("saveMode", saveMode);

      const res = await fetch(`/api/images/${imageId}/crop`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ error: "Failed to crop image" }));
        throw new Error(error.error || "Failed to crop image");
      }

      return res.json();
    },
    onSuccess: async (data) => {
      console.log('Crop success:', data);
      // Invalidate relevant queries to refresh data
      await Promise.all([
        qc.invalidateQueries({
          queryKey: ["application-images", applicationId],
        }),
        qc.invalidateQueries({
          queryKey: ["application-activity", applicationId],
        }),
        qc.invalidateQueries({ queryKey: ["application", applicationId] }),
      ]);
      
      // Force a hard reload to ensure we see the new image
      // TODO: Replace with proper router.refresh() once we verify database is correct
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },
  });
}
