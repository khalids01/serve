"use client"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export type Application = {
  id: string
  name: string
  slug: string
  createdAt: string
  storageDir: string
  _count: { images: number; apiKeys: number }
}

export function useApplications() {
  return useQuery<{ applications: Application[] }>({
    queryKey: ['applications', 'list'],
    queryFn: async () => {
      const { data } = await api.get('/api/applications')
      return data
    },
  })
}

export function useCreateApplication() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
      const { data } = await api.post('/api/applications', { name, slug })
      return data
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
