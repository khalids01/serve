"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'

type DeleteImageResponse = {
  success: boolean
  linkedApplications?: Array<{ id: string; name: string; slug: string }>
}

export function useDeleteImageMutation(applicationId: string) {
  const qc = useQueryClient()
  return useMutation<DeleteImageResponse, Error, string>({
    mutationFn: async (imageId: string) => {
      const res = await fetch(`/api/images/${imageId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete image')
      return res.json()
    },
    onSuccess: async (data) => {
      const appIds = new Set<string>([applicationId])
      for (const app of data.linkedApplications ?? []) {
        appIds.add(app.id)
      }

      await Promise.all([
        ...[...appIds].flatMap((id) => [
          qc.invalidateQueries({ queryKey: ['application-images', id] }),
          qc.invalidateQueries({ queryKey: ['application-activity', id] }),
          qc.invalidateQueries({ queryKey: ['application', id] }),
        ]),
        qc.invalidateQueries({ queryKey: ['all-images'] }),
      ])
    },
  })
}
