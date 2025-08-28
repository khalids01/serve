'use client'

import { ApplicationsSummary } from "@/features/dashboard/components/ApplicationsSummary"
import { QuickActions } from "@/features/dashboard/components/QuickActions"
import { StatsGrid } from "@/features/dashboard/components/StatsGrid"
import { useDashboardData } from "@/features/dashboard/hooks/use-dashboard"

export default function DashboardPage() {
  const { applications, stats, isLoading } = useDashboardData()
  return (
    <div className="min-h-screen">
      
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your file storage applications and monitor usage
          </p>
        </div>

        <StatsGrid stats={stats} loading={isLoading} />

        <QuickActions />

        <ApplicationsSummary applications={applications} loading={isLoading} />
      </main>
    </div>
  )
}
