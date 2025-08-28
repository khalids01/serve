"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderOpen } from "lucide-react"
import { DashboardApplication } from "@/features/dashboard/hooks/use-dashboard"

export function ApplicationsSummary({ applications, loading }: { applications: DashboardApplication[]; loading: boolean }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Applications</CardTitle>
        <CardDescription>
          Your file storage applications and their current status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
                  <div>
                    <div className="h-4 bg-muted rounded w-32 mb-1 animate-pulse"></div>
                    <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
                  <div className="h-8 bg-muted rounded w-12 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first application to start organizing your files.
            </p>
            <Button asChild>
              <Link href="/dashboard/applications">Create Application</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">{app.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{app._count.images} files</Badge>
                  <Badge variant="outline">{app._count.apiKeys} keys</Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/applications/${app.id}`}>View</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/dashboard/applications">
              {applications.length === 0 ? 'Create First Application' : 'View All Applications'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
