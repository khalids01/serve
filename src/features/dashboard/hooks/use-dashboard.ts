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

type StatsResponse = {
  storageBytes: number
  totals: { files: number; applications: number; apiKeys: number }
}

function formatBytes(bytes: number) {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export function useDashboardData() {
  const query = useQuery<{ applications: DashboardApplication[] }>({
    queryKey: ['applications', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/api/applications')
      return data
    },
  })

  const statsQuery = useQuery<StatsResponse>({
    queryKey: ['stats', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get('/api/stats')
      return data
    },
  })

  const apps = query.data?.applications ?? []
  const stats: DashboardStats = {
    totalFiles: apps.reduce((sum, a) => sum + a._count.images, 0),
    totalApplications: apps.length,
    totalApiKeys: apps.reduce((sum, a) => sum + a._count.apiKeys, 0),
    storageUsed: formatBytes(statsQuery.data?.storageBytes ?? 0),
  }

  const combinedLoading = query.isLoading || statsQuery.isLoading
  return { ...query, isLoading: combinedLoading, applications: apps.slice(0, 3), stats, statsQuery }
}
