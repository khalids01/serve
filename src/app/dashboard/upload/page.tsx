"use client"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import { useDropzone } from "react-dropzone"
import type { Image, ImageVariant } from "@/lib/prisma-types"
import { useApplicationData } from "@/features/applications/hooks/use-application-data"

type UploadSuccess = {
  success: true
  image: (Image & { url: string; variants: Array<ImageVariant & { url: string }> })
}

interface UploadedFile {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  result?: UploadSuccess
  error?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [applicationId, setApplicationId] = useState("")
  const [tags, setTags] = useState("")
  const { applications, applicationLoading } = useApplicationData({
    fetchList: true,
  })
  const MAX_MB = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE ?? '10')
  const maxFileSizeBytes = (Number.isFinite(MAX_MB) && MAX_MB > 0 ? MAX_MB : 10) * 1024 * 1024

  useEffect(() => {
    if (!applicationId && applications.length > 0) {
      setApplicationId(applications[0].id)
    }
  }, [applications, applicationId])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.mov'],
      'audio/*': ['.mp3', '.wav', '.ogg'],
      'application/pdf': ['.pdf'],
      'text/*': ['.txt', '.md', '.json'],
    },
    maxSize: maxFileSizeBytes
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadFile = async (fileData: UploadedFile, index: number) => {
    if (!applicationId) {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'error', error: 'Please select an application' } : f
      ))
      return
    }

    setFiles(prev => prev.map((f, i) => 
      i === index ? { ...f, status: 'uploading', progress: 0 } : f
    ))

    const formData = new FormData()
    formData.append('file', fileData.file)
    formData.append('applicationId', applicationId)
    if (tags) {
      formData.append('tags', JSON.stringify(tags.split(',').map(t => t.trim())))
    }

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result: UploadSuccess = await response.json()
      
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: 'success', 
          progress: 100, 
          result 
        } : f
      ))
    } catch (error) {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { 
          ...f, 
          status: 'error', 
          progress: 0, 
          error: error instanceof Error ? error.message : 'Upload failed' 
        } : f
      ))
    }
  }

  const uploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending')
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        await uploadFile(files[i], i)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="min-h-screen">
      
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Files</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your files with automatic optimization and variant generation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Settings</CardTitle>
                <CardDescription>
                  Configure your upload preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="application" className="mb-2">Application</Label>
                  <Select value={applicationId} onValueChange={setApplicationId} disabled={applicationLoading || applications.length === 0}>
                    <SelectTrigger>
                      <SelectValue placeholder={applicationLoading ? 'Loading...' : 'Select application'} />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tags" className="mb-2">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., profile, avatar, banner"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supported Formats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div><strong>Images:</strong> PNG, JPG, GIF, WebP</div>
                  <div><strong>Videos:</strong> MP4, WebM, MOV</div>
                  <div><strong>Audio:</strong> MP3, WAV, OGG</div>
                  <div><strong>Documents:</strong> PDF, TXT, MD</div>
                  <div className="text-muted-foreground">Max size: {MAX_MB}MB per file</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Area and File List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Drop Zone */}
            <Card>
              <CardContent className="p-6">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive 
                      ? 'border-primary bg-primary/5' 
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {isDragActive ? (
                    <p className="text-lg">Drop the files here...</p>
                  ) : (
                    <div>
                      <p className="text-lg mb-2">Drag & drop files here, or click to select</p>
                      <p className="text-sm text-muted-foreground">
                        Support for images, videos, audio, and documents
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* File List */}
            {files.length > 0 && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Files ({files.length})</CardTitle>
                    <CardDescription>
                      Ready to upload {files.filter(f => f.status === 'pending').length} files
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={uploadAll}
                    disabled={files.filter(f => f.status === 'pending').length === 0 || !applicationId}
                  >
                    Upload All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {files.map((fileData, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{fileData.file.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {formatFileSize(fileData.file.size)}
                            </Badge>
                            {fileData.status === 'success' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {fileData.status === 'error' && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          
                          {fileData.status === 'uploading' && (
                            <Progress value={fileData.progress} className="h-2" />
                          )}
                          
                          {fileData.status === 'error' && (
                            <p className="text-sm text-red-500">{fileData.error}</p>
                          )}
                          
                          {fileData.status === 'success' && fileData.result && (
                            <p className="text-sm text-green-600">
                              Uploaded successfully • {fileData.result.image.variants?.length || 0} variants generated
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {fileData.status === 'pending' && (
                            <Button
                              size="sm"
                              onClick={() => uploadFile(fileData, index)}
                              disabled={!applicationId}
                            >
                              Upload
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            disabled={fileData.status === 'uploading'}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
