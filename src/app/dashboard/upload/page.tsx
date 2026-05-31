"use client"

import { useState, useEffect } from "react"
import { UploadPanel } from "@/features/applications/components/application-details/upload-tab"
import { useApplicationData } from "@/features/applications/hooks/use-application-data"

export default function UploadPage() {
  const [applicationId, setApplicationId] = useState("")
  const { applications, applicationLoading } = useApplicationData({
    fetchList: true,
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const appParam = urlParams.get("app")

    if (appParam && applications.some((app) => app.id === appParam)) {
      setApplicationId(appParam)
    } else if (!applicationId && applications.length > 0) {
      setApplicationId(applications[0].id)
    }
  }, [applications, applicationId])

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Upload Files</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your files with automatic optimization and variant
            generation
          </p>
        </div>

        <UploadPanel
          applicationId={applicationId}
          showAppSelector
          applications={applications}
          applicationLoading={applicationLoading}
          onApplicationIdChange={setApplicationId}
          viewFilesHref={
            applicationId
              ? `/dashboard/applications/${applicationId}?tab=files`
              : undefined
          }
        />
      </main>
    </div>
  )
}
