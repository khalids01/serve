'use client'

import { Card, CardContent } from '@/components/ui/card'
import { FolderOpen } from 'lucide-react'
import { ApplicationsGrid } from '@/features/applications/components/ApplicationsGrid'
import { NewApplicationDialog } from '@/features/applications/components/NewApplicationDialog'
import { useApplications } from '@/features/applications/hooks/use-applications'

export default function ApplicationsPage() {
  const { data, isLoading } = useApplications()
  const applications = data?.applications ?? []

  return (
    <div className="min-h-screen">
      
      <main className="container mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-muted-foreground mt-2">
              Manage your file storage applications and their settings
            </p>
          </div>
          <NewApplicationDialog />
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first application to start organizing and managing your files.
              </p>
              <NewApplicationDialog triggerLabel="Create First Application" />
            </CardContent>
          </Card>
        ) : (
          <ApplicationsGrid applications={applications} />
        )}
      </main>
    </div>
  )
}
