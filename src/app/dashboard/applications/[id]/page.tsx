'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { SiteHeader } from '@/components/core/site-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FolderOpen, Key, Upload, Settings, BarChart3, Image, Trash2 } from 'lucide-react'
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

interface ImageFile {
  id: string
  filename: string
  originalName: string
  contentType: string
  sizeBytes: number
  width?: number
  height?: number
  createdAt: string
  variants: Array<{
    id: string
    label: string
    filename: string
    width?: number
    height?: number
    sizeBytes: number
  }>
}

export default function ApplicationDetailsPage() {
  const params = useParams()
  const applicationId = params.id as string
  
  const [application, setApplication] = useState<Application | null>(null)
  const [images, setImages] = useState<ImageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [imagesLoading, setImagesLoading] = useState(false)

  useEffect(() => {
    fetchApplication()
    fetchImages()
  }, [applicationId])

  const fetchApplication = async () => {
    try {
      const response = await fetch('/api/applications')
      if (response.ok) {
        const data = await response.json()
        const app = data.applications.find((a: Application) => a.id === applicationId)
        setApplication(app || null)
      }
    } catch (error) {
      toast.error('Error fetching application')
    } finally {
      setLoading(false)
    }
  }

  const fetchImages = async () => {
    setImagesLoading(true)
    try {
      const response = await fetch('/api/images')
      if (response.ok) {
        const data = await response.json()
        // Filter images by application (this would need to be implemented in the API)
        setImages(data.images || [])
      }
    } catch (error) {
      toast.error('Error fetching images')
    } finally {
      setImagesLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="container mx-auto py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading application...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="container mx-auto py-8">
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Application not found</h3>
              <p className="text-muted-foreground mb-6">
                The application you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button asChild>
                <Link href="/dashboard/applications">Back to Applications</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{application.name}</h1>
              <p className="text-muted-foreground">
                {application.slug} • Created {formatDate(application.createdAt)}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <Button asChild>
              <Link href={`/dashboard/applications/${application.id}/keys`}>
                <Key className="h-4 w-4 mr-2" />
                Manage API Keys
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/dashboard/upload?app=${application.id}`}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Files</CardTitle>
                  <Image className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{application._count.images}</div>
                  <p className="text-xs text-muted-foreground">Uploaded files</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">API Keys</CardTitle>
                  <Key className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{application._count.apiKeys}</div>
                  <p className="text-xs text-muted-foreground">Active keys</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage Path</CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-mono bg-muted p-2 rounded">
                    {application.storageDir}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest file uploads and API usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  Activity tracking coming soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>
                  All files uploaded to this application
                </CardDescription>
              </CardHeader>
              <CardContent>
                {imagesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-muted-foreground">Loading files...</p>
                  </div>
                ) : images.length === 0 ? (
                  <div className="text-center py-8">
                    <Image className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No files yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Upload your first file to get started.
                    </p>
                    <Button asChild>
                      <Link href={`/dashboard/upload?app=${application.id}`}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                            <Image className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">{image.originalName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatFileSize(image.sizeBytes)} • {image.contentType}
                              {image.width && image.height && (
                                <> • {image.width}×{image.height}</>
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {image.variants.length} variants
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Configure your application settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Application Name</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      The display name for your application
                    </p>
                    <div className="flex gap-2">
                      <div className="flex-1 p-2 bg-muted rounded text-sm">
                        {application.name}
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Slug</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Used in API URLs and file paths
                    </p>
                    <div className="flex gap-2">
                      <div className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                        {application.slug}
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Storage Directory</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Where files are stored on the server
                    </p>
                    <div className="p-2 bg-muted rounded text-sm font-mono">
                      {application.storageDir}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" className="w-full">
                  Delete Application
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This will permanently delete the application and all its files. This action cannot be undone.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
