"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useDeleteImageMutation(applicationId: string) {
  const qc = useQueryClient()
  return useMutation<{ success: boolean }, Error, string>({
    mutationFn: async (imageId: string) => {
      const res = await fetch(`/api/images/${imageId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete image')
      return res.json()
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['application-images', applicationId] }),
        qc.invalidateQueries({ queryKey: ['application-activity', applicationId] }),
        qc.invalidateQueries({ queryKey: ['application', applicationId] }),
      ])
    },
  })
}
