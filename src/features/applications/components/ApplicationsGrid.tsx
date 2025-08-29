"use client"

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FolderOpen, Key, Settings, Upload } from 'lucide-react'
import { Application } from '@/features/applications/hooks/use-application-data'

export function ApplicationsGrid({ applications }: { applications: Application[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {applications.map((app) => (
        <Card key={app.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <Badge variant="secondary">{app.slug}</Badge>
            </div>
            <CardTitle className="mt-4">{app.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{app._count.images} files</span>
              <span>{app._count.apiKeys} API keys</span>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <Link href={`/dashboard/applications/${app.id}`}>
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/applications/${app.id}/keys`}>
                  <Key className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/upload?app=${app.id}`}>
                  <Upload className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
