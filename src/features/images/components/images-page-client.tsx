"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Grid2X2, Image as ImageIcon, List } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
import { useApplicationData } from "@/features/applications/hooks/use-application-data";
import { useImages } from "@/features/images/hooks/use-images";
import { FileGridItem } from "@/features/applications/components/application-details/file-grid-item";
import { FileListItem } from "@/features/applications/components/application-details/file-list-item";
import { ImagePreviewDialog } from "@/features/applications/components/application-details/preview-dialog";
import type { ImageFileDTO } from "@/features/applications/components/application-details/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const ALL_APPLICATIONS = "all";

export function ImagesPageClient() {
  const [applicationFilter, setApplicationFilter] = useState(ALL_APPLICATIONS);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewImage, setPreviewImage] = useState<ImageFileDTO | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [targetDelete, setTargetDelete] = useState<ImageFileDTO | null>(null);

  const queryClient = useQueryClient();
  const { applications, applicationLoading } = useApplicationData({
    fetchList: true,
  });

  const selectedAppId =
    applicationFilter === ALL_APPLICATIONS ? undefined : applicationFilter;

  const { data, isLoading } = useImages(selectedAppId);
  const images = data?.images ?? [];

  const deleteMutation = useMutation({
    mutationFn: async (imageId: string) => {
      const res = await fetch(`/api/images/${imageId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete image");
      return res.json();
    },
    onSuccess: async (_data, imageId) => {
      const deleted = images.find((img) => img.id === imageId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["all-images"] }),
        deleted?.applicationId
          ? queryClient.invalidateQueries({
              queryKey: ["application-images", deleted.applicationId],
            })
          : Promise.resolve(),
      ]);
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const onDeleteRequest = (img: ImageFileDTO) => {
    setTargetDelete(img);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!targetDelete) return;
    try {
      await deleteMutation.mutateAsync(targetDelete.id);
      toast.success("File deleted");
      setConfirmDeleteOpen(false);
      setTargetDelete(null);
    } catch {
      toast.error("Failed to delete file");
    }
  };

  const noopSelection = () => {};

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Images</h1>
          <p className="text-muted-foreground mt-2">
            Browse all uploaded files across your applications
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <div className="flex-1 max-w-xs">
            <Label htmlFor="application-filter" className="mb-2 block">
              Application
            </Label>
            <Select
              value={applicationFilter}
              onValueChange={setApplicationFilter}
              disabled={applicationLoading}
            >
              <SelectTrigger id="application-filter">
                <SelectValue
                  placeholder={
                    applicationLoading ? "Loading..." : "All applications"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_APPLICATIONS}>
                  All applications
                </SelectItem>
                {applications.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={(v) => v && setViewMode(v as "grid" | "list")}
            className="sm:ml-auto"
          >
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid2X2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>
              {isLoading
                ? "Loading..."
                : `${images.length} file${images.length === 1 ? "" : "s"} shown`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                Loading images...
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No files found</h3>
                <p className="text-muted-foreground">
                  {applicationFilter === ALL_APPLICATIONS
                    ? "Upload files to one of your applications to see them here."
                    : "No files in this application yet."}
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map((img) => (
                  <FileGridItem
                    key={img.id}
                    img={img}
                    selected={false}
                    onToggleSelection={noopSelection}
                    onPreview={setPreviewImage}
                    onDelete={onDeleteRequest}
                    copyToClipboard={copyToClipboard}
                    showSelection={false}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {images.map((img) => (
                  <FileListItem
                    key={img.id}
                    img={img}
                    selected={false}
                    onToggleSelection={noopSelection}
                    onPreview={setPreviewImage}
                    onDelete={onDeleteRequest}
                    copyToClipboard={copyToClipboard}
                    showSelection={false}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <ImagePreviewDialog
          previewImage={previewImage}
          onClose={() => setPreviewImage(null)}
          onCrop={() => setPreviewImage(null)}
          copyToClipboard={copyToClipboard}
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
