"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  FolderOpen,
  Key,
  Upload,
  Image as ImageIcon,
  Trash2,
  Eye,
  List,
  Grid2X2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useClearCacheMutation } from "@/features/applications/hooks/use-clear-cache";
import { useDeleteImageMutation } from "@/features/applications/hooks/use-delete-image";

export interface ApplicationDTO {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  storageDir: string;
  _count: { images: number; apiKeys: number };
}

export interface ImageFileDTO {
  id: string;
  filename: string;
  originalName: string;
  contentType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  createdAt: string;
  variants: Array<{
    id: string;
    label: string;
    filename: string;
    width?: number;
    height?: number;
    sizeBytes: number;
  }>;
}

export interface AuditLogItemDTO {
  id: string;
  userId?: string | null;
  applicationId?: string | null;
  action: string;
  targetId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  metadata?: any;
  createdAt: string;
}

export interface CacheItem {
  name: string;
  sizeBytes: number;
  mtimeMs?: number;
}
export interface CacheResponse {
  items: CacheItem[];
  totalBytes: number;
}

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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [previewImage, setPreviewImage] = useState<ImageFileDTO | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [targetDelete, setTargetDelete] = useState<ImageFileDTO | null>(null);

  const cacheItems: CacheItem[] = cacheData?.items || [];
  const cacheTotalBytes: number = cacheData?.totalBytes || 0;

  const previewAbsoluteUrl = previewImage
    ? typeof window !== "undefined"
      ? new URL(
          `/api/img/${previewImage.filename}`,
          window.location.origin
        ).toString()
      : `/api/img/${previewImage.filename}`
    : "";

  const clearCache = async () => {
    try {
      const data = await clearCacheMutation.mutateAsync();
      toast.success(`Cleared ${formatFileSize(data.clearedBytes || 0)} cache`);
    } catch (e) {
      toast.error("Failed to clear cache");
    }
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
    } catch (e) {
      toast.error("Failed to delete file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen">
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
                  <CardTitle className="text-sm font-medium">
                    Total Files
                  </CardTitle>
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {application._count.images}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Uploaded files
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    API Keys
                  </CardTitle>
                  <Key className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {application._count.apiKeys}
                  </div>
                  <p className="text-xs text-muted-foreground">Active keys</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Storage Used
                  </CardTitle>
                  <FolderOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {formatFileSize(
                        images.reduce((total, img) => total + img.sizeBytes + 
                          img.variants.reduce((vTotal, variant) => vTotal + variant.sizeBytes, 0), 0) + 
                        cacheTotalBytes
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>Files: {formatFileSize(
                        images.reduce((total, img) => total + img.sizeBytes + 
                          img.variants.reduce((vTotal, variant) => vTotal + variant.sizeBytes, 0), 0)
                      )}</div>
                      <div>Cache: {formatFileSize(cacheTotalBytes)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest file uploads and deletions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No activity yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activity?.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between border rounded-md p-3"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              log.action === "DELETE"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {log.action}
                          </Badge>
                          <div className="text-sm">
                            <div className="font-medium">
                              {log.metadata?.originalName ||
                                log.metadata?.filename ||
                                log.targetId}
                            </div>
                            <div className="text-muted-foreground">
                              {formatDate(log.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground hidden md:block">
                          {log.ip || ""}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                <div className="mt-2">
                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={(v) => v && setViewMode(v as any)}
                  >
                    <ToggleGroupItem value="list" aria-label="List view">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <Grid2X2 className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </CardHeader>
              <CardContent>
                {images.length === 0 ? (
                  <div className="text-center py-8">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No files yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Upload your first file to get started.
                    </p>
                    <Button asChild>
                      <Link
                        href={`/dashboard/upload?app=${
                          application?.id || applicationId
                        }`}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div
                    className={
                      viewMode === "grid"
                        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        : "space-y-4"
                    }
                  >
                    {images?.map((img) => {
                      const url = `/api/img/${img.filename}`;
                      if (viewMode === "grid") {
                        return (
                          <div
                            key={img.id}
                            className="border rounded-lg overflow-hidden"
                          >
                            <div className="aspect-video bg-muted">
                              <img
                                src={`${url}?w=640`}
                                alt={img.originalName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3 flex items-center justify-between">
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">
                                  {img.originalName}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {formatFileSize(img.sizeBytes)} •{" "}
                                  {img.contentType}
                                  {img.width && img.height && (
                                    <>
                                      {" "}
                                      • {img.width}×{img.height}
                                    </>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setPreviewImage(img)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onDeleteRequest(img)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div
                          key={img.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg overflow-hidden flex items-center justify-center">
                              <img
                                src={`${url}?w=80`}
                                alt={img.originalName}
                                className="w-10 h-10 object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-medium">
                                {img.originalName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(img.sizeBytes)} •{" "}
                                {img.contentType}
                                {img.width && img.height && (
                                  <>
                                    {" "}
                                    • {img.width}×{img.height}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {img.variants.length} variants
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPreviewImage(img)}
                            >
                              <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteRequest(img)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Image Cache</CardTitle>
                  <CardDescription>
                    Locally cached resized images
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCache}
                  disabled={clearCacheMutation.isPending}
                >
                  Clear Cache
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Total size: {formatFileSize(cacheTotalBytes)}
                  </div>
                  {cacheItems.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No cached files
                    </div>
                  ) : (
                    <>
                      <ul className="text-sm max-h-60 overflow-auto divide-y rounded border">
                        {cacheItems.slice(0, 10)?.map((it) => (
                          <li
                            key={it.name}
                            className="flex items-center justify-between gap-3 p-2"
                          >
                            <span className="truncate">{it.name}</span>
                            <span className="text-muted-foreground">
                              {formatFileSize(it.sizeBytes)}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {cacheItems.length > 10 && (
                        <div className="text-xs text-muted-foreground">
                          + {cacheItems.length - 10} more not shown
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Dialog
              open={!!previewImage}
              onOpenChange={(o) => !o && setPreviewImage(null)}
            >
              <DialogContent className="!w-full !max-w-[900px] h-[90vh]">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle className="truncate">
                    {previewImage?.originalName}
                  </DialogTitle>
                  {previewImage && (
                    <Button variant="ghost" size="icon" asChild>
                      <a
                        href={previewAbsoluteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </DialogHeader>

                {previewImage && (
                  <div className="h-full overflow-auto">
                    <img
                      src={`/api/img/${previewImage.filename}?w=1280`}
                      alt={previewImage.originalName}
                      className="mx-auto h-full w-auto max-h-full object-contain rounded-md"
                    />
                  </div>
                )}
              </DialogContent>
            </Dialog>

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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
