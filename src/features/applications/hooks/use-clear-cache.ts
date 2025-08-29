"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useClearCacheMutation(applicationId: string) {
  const qc = useQueryClient()
  return useMutation<{ success: boolean; clearedBytes: number }, Error, void>({
    mutationFn: async () => {
      const res = await fetch(`/api/applications/${applicationId}/cache`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to clear cache')
      return res.json()
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['application-cache', applicationId] })
    },
  })
}
