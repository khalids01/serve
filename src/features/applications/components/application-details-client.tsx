"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useClearCacheMutation } from "@/features/applications/hooks/use-clear-cache";
import { useDeleteImageMutation } from "@/features/applications/hooks/use-delete-image";
import { useCropImageMutation } from "@/features/applications/hooks/use-crop-image";
import { ApplicationSettingsForm } from "./application-settings-form";
import { ImageCropDialog } from "./image-crop-dialog";
import { ApplicationDTO, ImageFileDTO, AuditLogItemDTO, CacheResponse } from "./application-details/types";
import { ApplicationHeader } from "./application-details/header";
import { ApplicationOverview } from "./application-details/overview-tab";
import { ApplicationFiles } from "./application-details/files-tab";
import { ImagePreviewDialog } from "./application-details/preview-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  application: ApplicationDTO;
  images: ImageFileDTO[];
  activity: AuditLogItemDTO[];
  cacheData: CacheResponse | null;
}

export default function ApplicationDetailsClient({
  application,
  images,
  activity,
  cacheData,
}: Props) {
  const applicationId = application.id;
  const clearCacheMutation = useClearCacheMutation(applicationId);
  const deleteImageMutation = useDeleteImageMutation(applicationId);
  const cropImageMutation = useCropImageMutation(applicationId);
  
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [previewImage, setPreviewImage] = useState<ImageFileDTO | null>(null);
  const [cropImage, setCropImage] = useState<ImageFileDTO | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [targetDelete, setTargetDelete] = useState<ImageFileDTO | null>(null);

  // Sync state with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // remove #
      if (!hash) return;

      if (hash === "overview" || hash === "files" || hash === "settings") {
        setActiveTab(hash);
        if (hash === "files" && viewMode === "grid" && !window.location.hash.includes("-grid")) {
             // Optional: respect logic
        }
      } else if (hash === "files-list") {
        setActiveTab("files");
        setViewMode("list");
      } else if (hash === "files-grid") {
        setActiveTab("files");
        setViewMode("grid");
      }
    };

    // Initial check
    handleHashChange();

    // Listen for changes
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [viewMode]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  const handleViewModeChange = (mode: "list" | "grid") => {
    setViewMode(mode);
    window.location.hash = `files-${mode}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === images.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(images.map(img => img.id)));
    }
  };
  
  const cleanDeletedIds = (deletedId: string) => {
     const newSelected = new Set(selectedIds);
     newSelected.delete(deletedId);
     setSelectedIds(newSelected);
  };

  const onDeleteRequest = (img: ImageFileDTO) => {
    setTargetDelete(img);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!targetDelete) return;
    try {
      await deleteImageMutation.mutateAsync(targetDelete.id);
      toast.success("File deleted");
      setConfirmDeleteOpen(false);
      setTargetDelete(null);
      cleanDeletedIds(targetDelete.id);
    } catch (e) {
      toast.error("Failed to delete file");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const idsToDelete = Array.from(selectedIds);
    setIsBulkDeleting(true);

    if (!window.confirm(`Are you sure you want to delete ${idsToDelete.length} files?`)) {
        setIsBulkDeleting(false);
        return;
    }

    try {
        let successCount = 0;
        let failCount = 0;
        for (const id of idsToDelete) {
            try {
                await deleteImageMutation.mutateAsync(id);
                successCount++;
            } catch (e) {
                console.error(`Failed to delete ${id}`, e);
                failCount++;
            }
        }
        
        if (successCount > 0) {
            toast.success(`Deleted ${successCount} files`);
            setSelectedIds(new Set());
        }
        if (failCount > 0) {
            toast.error(`Failed to delete ${failCount} files`);
        }
    } finally {
        setIsBulkDeleting(false);
    }
  };

  const handleSaveCrop = async (croppedBlob: Blob, saveMode: "new" | "replace") => {
    if (!cropImage) return;
    try {
      await cropImageMutation.mutateAsync({
        imageId: cropImage.id,
        croppedBlob,
        saveMode,
      });
      if (saveMode === "replace") {
        toast.success("Image replaced with cropped version");
      } else {
        toast.success("Cropped image saved as new file");
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to save cropped image");
      setCropImage(null);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <ApplicationHeader application={application} />

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
             <ApplicationOverview 
                application={application} 
                images={images} 
                activity={activity} 
                cacheData={cacheData} 
             />
          </TabsContent>

          <TabsContent value="files">
             <ApplicationFiles
                applicationId={application.id}
                images={images}
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                selectedIds={selectedIds}
                onToggleSelection={toggleSelection}
                onSelectAll={toggleSelectAll}
                onBulkDelete={handleBulkDelete}
                isBulkDeleting={isBulkDeleting}
                onPreview={setPreviewImage}
                onDeleteRequest={onDeleteRequest}
                copyToClipboard={copyToClipboard}
             />
          </TabsContent>

          <TabsContent value="settings">
             <Card>
               <CardHeader>
                 <CardTitle>Application Settings</CardTitle>
                 <CardDescription>
                   Update your application configuration
                 </CardDescription>
               </CardHeader>
               <CardContent>
                 <ApplicationSettingsForm application={application} />
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>

        <ImagePreviewDialog
           previewImage={previewImage}
           onClose={() => setPreviewImage(null)}
           onCrop={(img) => {
             setCropImage(img);
             setPreviewImage(null);
           }}
           copyToClipboard={copyToClipboard}
        />

        <ImageCropDialog
          open={!!cropImage}
          onOpenChange={(open) => !open && setCropImage(null)}
          imageUrl={cropImage ? `/api/img/${cropImage.filename}` : ""}
          imageName={cropImage?.originalName || ""}
          onSave={handleSaveCrop}
        />

        <AlertDialog
          open={confirmDeleteOpen}
          onOpenChange={setConfirmDeleteOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this file?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the file and its variants from
                storage and the database.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
      </main>
    </div>
  );
}
