'use client'

import { useState, useEffect } from 'react'
import { SiteHeader } from "@/components/core/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FolderOpen, Key, Settings, BarChart3 } from "lucide-react"
import Link from "next/link"
import { toast } from 'sonner'

interface Application {
  id: string
  name: string
  slug: string
  createdAt: string
  _count: {
    images: number
    apiKeys: number
  }
}

interface DashboardStats {
  totalFiles: number
  totalApplications: number
  totalApiKeys: number
  storageUsed: string
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalFiles: 0,
    totalApplications: 0,
    totalApiKeys: 0,
    storageUsed: '0 B'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/applications')
      if (response.ok) {
        const data = await response.json()
        const apps = data.applications || []
        setApplications(apps.slice(0, 3)) // Show only first 3 for dashboard
        
        // Calculate stats
        const totalFiles = apps.reduce((sum: number, app: Application) => sum + app._count.images, 0)
        const totalApiKeys = apps.reduce((sum: number, app: Application) => sum + app._count.apiKeys, 0)
        
        setStats({
          totalFiles,
          totalApplications: apps.length,
          totalApiKeys,
          storageUsed: '2.4 GB' // This would be calculated from actual file sizes
        })
      }
    } catch (error) {
      toast.error('Error loading dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }
  return (
    <div className="min-h-screen">
      <SiteHeader />
      
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your file storage applications and monitor usage
          </p>
        </div>

        {/* Quick Stats */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFiles}</div>
                <p className="text-xs text-muted-foreground">Across all applications</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.storageUsed}</div>
                <p className="text-xs text-muted-foreground">Total storage usage</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApplications}</div>
                <p className="text-xs text-muted-foreground">Active applications</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Keys</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalApiKeys}</div>
                <p className="text-xs text-muted-foreground">Active keys</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Files
              </CardTitle>
              <CardDescription>
                Upload and manage your files with automatic optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/dashboard/upload">
                  Start Upload
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Browse Files
              </CardTitle>
              <CardDescription>
                View and organize all your uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/files">
                  Browse Files
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage API keys for programmatic access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/api-keys">
                  Manage Keys
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
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
                  <Link href="/dashboard/applications">
                    Create Application
                  </Link>
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
                        <Link href={`/dashboard/applications/${app.id}`}>
                          View
                        </Link>
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
      </main>
    </div>
  )
}
