"use client"

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export type DashboardApplication = {
  id: string
  name: string
  slug: string
  createdAt: string
  _count: { images: number; apiKeys: number }
}

export type DashboardStats = {
  totalFiles: number
  totalApplications: number
  totalApiKeys: number
  storageUsed: string
}

export function useDashboardData() {
  const query = useQuery<{ applications: DashboardApplication[] }>({
    queryKey: ['applications', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/api/applications')
      return data
    },
  })

  const apps = query.data?.applications ?? []
  const stats: DashboardStats = {
    totalFiles: apps.reduce((sum, a) => sum + a._count.images, 0),
    totalApplications: apps.length,
    totalApiKeys: apps.reduce((sum, a) => sum + a._count.apiKeys, 0),
    storageUsed: '2.4 GB',
  }

  return { ...query, applications: apps.slice(0, 3), stats }
}
