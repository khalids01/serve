"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Files,
  Key,
  Upload,
  Settings,
} from "lucide-react";
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
import { DeleteImageConfirmDescription } from "./application-details/linked-app-badges";
import {
  ApplicationDTO,
  ImageFileDTO,
  AuditLogItemDTO,
  CacheResponse,
} from "./application-details/types";
import { ApplicationHeader } from "./application-details/header";
import { ApplicationOverview } from "./application-details/overview-tab";
import { ApplicationFiles } from "./application-details/files-tab";
import { ApplicationApiKeys } from "./application-details/api-keys-tab";
import { ApplicationUpload } from "./application-details/upload-tab";
import { ImagePreviewDialog } from "./application-details/preview-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VALID_TABS = [
  "overview",
  "files",
  "keys",
  "upload",
  "settings",
] as const;
type TabValue = (typeof VALID_TABS)[number];

const TAB_CONFIG: {
  value: TabValue;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { value: "overview", label: "Overview", icon: LayoutDashboard },
  { value: "files", label: "Files", icon: Files },
  { value: "keys", label: "API keys", icon: Key },
  { value: "upload", label: "Upload", icon: Upload },
  { value: "settings", label: "Settings", icon: Settings },
];

interface Props {
  application: ApplicationDTO;
  images: ImageFileDTO[];
  activity: AuditLogItemDTO[];
  cacheData: CacheResponse | null;
}

function parseTab(value: string | null): TabValue {
  if (value && VALID_TABS.includes(value as TabValue)) {
    return value as TabValue;
  }
  return "overview";
}

export default function ApplicationDetailsClient({
  application,
  images,
  activity,
  cacheData,
}: Props) {
  const applicationId = application.id;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const clearCacheMutation = useClearCacheMutation(applicationId);
  const deleteImageMutation = useDeleteImageMutation(applicationId);
  const cropImageMutation = useCropImageMutation(applicationId);

  const tabFromUrl = parseTab(searchParams.get("tab"));
  const viewFromUrl =
    searchParams.get("view") === "grid" ? "grid" : "list";

  const [activeTab, setActiveTab] = useState<TabValue>(tabFromUrl);
  const [viewMode, setViewMode] = useState<"list" | "grid">(viewFromUrl);
  const [previewImage, setPreviewImage] = useState<ImageFileDTO | null>(null);
  const [cropImage, setCropImage] = useState<ImageFileDTO | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [targetDelete, setTargetDelete] = useState<ImageFileDTO | null>(null);

  const updateUrl = useCallback(
    (tab: TabValue, view?: "list" | "grid") => {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === "overview") {
        params.delete("tab");
      } else {
        params.set("tab", tab);
      }
      if (tab === "files" && view === "grid") {
        params.set("view", "grid");
      } else {
        params.delete("view");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    setActiveTab(tabFromUrl);
    if (tabFromUrl === "files") {
      setViewMode(viewFromUrl);
    }
  }, [tabFromUrl, viewFromUrl]);

  const handleTabChange = (value: string) => {
    const tab = parseTab(value);
    setActiveTab(tab);
    updateUrl(tab, tab === "files" ? viewMode : undefined);
  };

  const handleViewModeChange = (mode: "list" | "grid") => {
    setViewMode(mode);
    updateUrl("files", mode);
  };

  const handleNavigateToUpload = () => {
    setActiveTab("upload");
    updateUrl("upload");
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
      setSelectedIds(new Set(images.map((img) => img.id)));
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
    } catch {
      toast.error("Failed to delete file");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const idsToDelete = Array.from(selectedIds);
    setIsBulkDeleting(true);

    if (
      !window.confirm(
        `Are you sure you want to delete ${idsToDelete.length} files?`
      )
    ) {
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

  const handleSaveCrop = async (
    croppedBlob: Blob,
    saveMode: "new" | "replace"
  ) => {
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
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to save cropped image";
      toast.error(message);
      setCropImage(null);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <ApplicationHeader application={application} />

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            {TAB_CONFIG.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                aria-label={label}
                title={label}
                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-1.5 py-2 px-1 sm:px-3"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline text-xs sm:text-sm">
                  {label}
                </span>
              </TabsTrigger>
            ))}
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
              onNavigateToUpload={handleNavigateToUpload}
            />
          </TabsContent>

          <TabsContent value="keys">
            <ApplicationApiKeys applicationId={applicationId} />
          </TabsContent>

          <TabsContent value="upload">
            <ApplicationUpload applicationId={applicationId} />
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
          linkedApplications={cropImage?.linkedApplications}
          onSave={handleSaveCrop}
        />

        <AlertDialog
          open={confirmDeleteOpen}
          onOpenChange={setConfirmDeleteOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this file?</AlertDialogTitle>
              <AlertDialogDescription asChild>
                <DeleteImageConfirmDescription image={targetDelete} />
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
