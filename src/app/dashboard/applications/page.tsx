'use client'

import { useState, useEffect } from 'react'
import { SiteHeader } from '@/components/core/site-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FolderOpen, Plus, Settings, Key, Upload } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Application {
  id: string
  name: string
  slug: string
  createdAt: string
  storageDir: string
  _count: {
    images: number
    apiKeys: number
  }
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newAppName, setNewAppName] = useState('')
  const [newAppSlug, setNewAppSlug] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications')
      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      } else {
        toast.error('Failed to fetch applications')
      }
    } catch (error) {
      toast.error('Error fetching applications')
    } finally {
      setLoading(false)
    }
  }

  const createApplication = async () => {
    if (!newAppName.trim() || !newAppSlug.trim()) {
      toast.error('Please enter both name and slug')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name: newAppName, 
          slug: newAppSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
        }),
      })

      if (response.ok) {
        setNewAppName('')
        setNewAppSlug('')
        setIsDialogOpen(false)
        await fetchApplications()
        toast.success('Application created successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create application')
      }
    } catch (error) {
      toast.error('Error creating application')
    } finally {
      setCreating(false)
    }
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  }

  const handleNameChange = (name: string) => {
    setNewAppName(name)
    if (!newAppSlug || newAppSlug === generateSlug(newAppName)) {
      setNewAppSlug(generateSlug(name))
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Applications</h1>
            <p className="text-muted-foreground mt-2">
              Manage your file storage applications and their settings
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Application
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Application</DialogTitle>
                <DialogDescription>
                  Create a new application to organize your files and manage API access.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="appName" className='mb-2'>Application Name</Label>
                  <Input
                    id="appName"
                    value={newAppName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g., My Website, Mobile App"
                  />
                </div>
                <div>
                  <Label htmlFor="appSlug" className='mb-2'>Slug (URL identifier)</Label>
                  <Input
                    id="appSlug"
                    value={newAppSlug}
                    onChange={(e) => setNewAppSlug(e.target.value)}
                    placeholder="e.g., my-website, mobile-app"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Used in API URLs and file paths. Only lowercase letters, numbers, and hyphens.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={createApplication}
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Application'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
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
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Application
              </Button>
            </CardContent>
          </Card>
        ) : (
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
                  <CardDescription>
                    Created {formatDate(app.createdAt)}
                  </CardDescription>
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
        )}
      </main>
    </div>
  )
}
