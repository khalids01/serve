"use client";

import axios from "axios";
import {
  AlertCircle,
  CheckCircle,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Grid2X2,
  List,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ProgressiveImage } from "@/components/progressive-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Application } from "@/features/applications/hooks/use-application-data";
import type { Image, ImageVariant } from "@/lib/prisma-types";

type UploadSuccess = {
  success: true;
  image: Image & {
    url: string;
    variants: Array<ImageVariant & { url: string }>;
  };
};

interface UploadedFile {
  id: string;
  file: File;
  progress: number | null;
  status: "pending" | "uploading" | "success" | "error";
  phase?: "uploading" | "processing";
  previewUrl?: string;
  result?: UploadSuccess;
  error?: string;
}

const MAX_MB = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE ?? "50");
const maxFileSizeBytes =
  (Number.isFinite(MAX_MB) && MAX_MB > 0 ? MAX_MB : 50) * 1024 * 1024;
const MAX_PARALLEL_UPLOADS = 3;
const PROCESSING_PROGRESS_THRESHOLD = 95;

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

function createQueueId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getFileExtension(file: File) {
  const extension = file.name.split(".").pop();
  return extension ? extension.toUpperCase() : "FILE";
}

function getPublicUrl(path?: string) {
  if (!path) return "";
  return `${window.location.origin}${path}`;
}

function parseUploadError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error;
    if (typeof message === "string") return message;
    return error.message || "Upload failed";
  }

  return error instanceof Error ? error.message : "Upload failed";
}

function getStatusLabel(fileData: UploadedFile) {
  if (fileData.status === "uploading" && fileData.phase === "processing") {
    return "processing";
  }

  return fileData.status;
}

interface UploadPanelProps {
  applicationId: string;
  showAppSelector?: boolean;
  applications?: Application[];
  applicationLoading?: boolean;
  onApplicationIdChange?: (id: string) => void;
  viewFilesHref?: string;
  onUploadSuccess?: () => void;
}

type UploadFileOptions = {
  reserved?: boolean;
};

export function UploadPanel({
  applicationId,
  showAppSelector = false,
  applications = [],
  applicationLoading = false,
  onApplicationIdChange,
  viewFilesHref,
  onUploadSuccess,
}: UploadPanelProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [tags, setTags] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const uploadingIdsRef = useRef(new Set<string>());
  const previewUrlsRef = useRef(new Set<string>());

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      previewUrlsRef.current.clear();
    };
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => {
      const previewUrl = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined;

      if (previewUrl) {
        previewUrlsRef.current.add(previewUrl);
      }

      return {
        id: createQueueId(),
        file,
        progress: 0,
        previewUrl,
        status: "pending" as const,
      };
    });
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      "video/*": [".mp4", ".webm", ".mov"],
      "audio/*": [".mp3", ".wav", ".ogg"],
      "application/pdf": [".pdf"],
      "text/*": [".txt", ".md", ".json"],
    },
    maxSize: maxFileSizeBytes,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((fileData) => fileData.id === id);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
        previewUrlsRef.current.delete(fileToRemove.previewUrl);
      }

      return prev.filter((fileData) => fileData.id !== id);
    });
  };

  const copyToClipboard = async (url: string) => {
    await navigator.clipboard.writeText(url);
  };

  const uploadFile = async (
    fileData: UploadedFile,
    options: UploadFileOptions = {},
  ) => {
    if (
      (!options.reserved && uploadingIdsRef.current.has(fileData.id)) ||
      fileData.status === "uploading" ||
      fileData.status === "success"
    ) {
      return;
    }

    if (!applicationId) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id
            ? { ...f, status: "error", error: "Please select an application" }
            : f,
        ),
      );
      return;
    }

    if (!uploadingIdsRef.current.has(fileData.id)) {
      uploadingIdsRef.current.add(fileData.id);
    }

    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileData.id
          ? {
              ...f,
              status: "uploading",
              phase: "uploading",
              progress: null,
              error: undefined,
            }
          : f,
      ),
    );

    const formData = new FormData();
    formData.append("file", fileData.file);
    formData.append("applicationId", applicationId);
    if (tags) {
      formData.append(
        "tags",
        JSON.stringify(tags.split(",").map((t) => t.trim())),
      );
    }

    try {
      const response = await axios.post<UploadSuccess>(
        "/api/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            if (!progressEvent.total) return;

            const progress = Math.min(
              100,
              Math.round((progressEvent.loaded / progressEvent.total) * 100),
            );
            const phase =
              progress >= PROCESSING_PROGRESS_THRESHOLD
                ? "processing"
                : "uploading";

            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileData.id ? { ...f, phase, progress } : f,
              ),
            );
          },
        },
      );

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id
            ? {
                ...f,
                status: "success",
                phase: undefined,
                progress: 100,
                result: response.data,
              }
            : f,
        ),
      );
      onUploadSuccess?.();
    } catch (error) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileData.id
            ? {
                ...f,
                status: "error",
                phase: undefined,
                progress: 0,
                error: parseUploadError(error),
              }
            : f,
        ),
      );
    } finally {
      uploadingIdsRef.current.delete(fileData.id);
    }
  };

  const uploadAll = async () => {
    if (!applicationId) return;

    const pendingFiles = files.filter(
      (fileData) =>
        fileData.status === "pending" &&
        !uploadingIdsRef.current.has(fileData.id),
    );

    if (pendingFiles.length === 0) return;

    for (const fileData of pendingFiles) {
      uploadingIdsRef.current.add(fileData.id);
    }

    const pendingIds = new Set(pendingFiles.map((fileData) => fileData.id));
    setFiles((prev) =>
      prev.map((fileData) =>
        pendingIds.has(fileData.id)
          ? {
              ...fileData,
              status: "uploading",
              phase: "uploading",
              progress: null,
              error: undefined,
            }
          : fileData,
      ),
    );

    let nextIndex = 0;

    async function runWorker() {
      while (nextIndex < pendingFiles.length) {
        const fileData = pendingFiles[nextIndex];
        nextIndex += 1;
        await uploadFile(fileData, { reserved: true });
      }
    }

    const workerCount = Math.min(MAX_PARALLEL_UPLOADS, pendingFiles.length);
    await Promise.all(Array.from({ length: workerCount }, () => runWorker()));
  };

  const renderPreview = (fileData: UploadedFile, size: "grid" | "list") => {
    const imageUrl = fileData.result?.image.url
      ? fileData.result.image.url
      : fileData.previewUrl;
    const isImage = fileData.file.type.startsWith("image/");
    const isPdf = fileData.file.type === "application/pdf";
    const classes =
      size === "grid"
        ? "h-full w-full object-cover"
        : "h-full w-full object-cover";

    if (isImage && imageUrl) {
      return (
        <ProgressiveImage
          src={imageUrl}
          alt={fileData.file.name}
          className={classes}
        />
      );
    }

    return (
      <div className="absolute inset-0 flex items-center justify-center bg-muted/60 text-muted-foreground">
        {isPdf ? (
          <span className="text-sm font-semibold">PDF</span>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <FileText className={size === "grid" ? "h-8 w-8" : "h-4 w-4"} />
            <span className="text-xs font-semibold">
              {getFileExtension(fileData.file)}
            </span>
          </div>
        )}
      </div>
    );
  };

  const renderProgress = (fileData: UploadedFile) => {
    if (fileData.status !== "uploading") return null;

    if (fileData.progress === null || fileData.phase === "processing") {
      return (
        <div className="space-y-1">
          <div className="h-2 w-full overflow-hidden rounded-full bg-primary/20">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-primary" />
          </div>
          <p className="text-xs text-muted-foreground">
            {fileData.phase === "processing"
              ? "Finalizing upload • Processing..."
              : "Uploading..."}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <Progress value={fileData.progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {fileData.progress}% uploaded
        </p>
      </div>
    );
  };

  const renderStatus = (fileData: UploadedFile) => {
    if (fileData.status === "success" && fileData.result) {
      return (
        <p className="text-sm text-green-600">
          Uploaded successfully • {fileData.result.image.variants?.length || 0}{" "}
          variants generated
        </p>
      );
    }

    if (fileData.status === "error") {
      return <p className="text-sm text-red-500">{fileData.error}</p>;
    }

    return null;
  };

  const renderResultActions = (fileData: UploadedFile) => {
    const resultUrl = fileData.result?.image.url;
    if (!resultUrl) return null;

    const absoluteUrl = getPublicUrl(resultUrl);

    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => copyToClipboard(absoluteUrl)}
          title="Copy URL"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          asChild
          title="Open in New Tab"
        >
          <a href={resultUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          asChild
          title="Download"
        >
          <a href={resultUrl} download>
            <Download className="h-4 w-4" />
          </a>
        </Button>
      </div>
    );
  };

  const renderFileActions = (fileData: UploadedFile) => (
    <div className="flex items-center gap-2">
      {fileData.status === "pending" && (
        <Button
          size="sm"
          onClick={() => uploadFile(fileData)}
          disabled={!applicationId}
        >
          Upload
        </Button>
      )}

      {renderResultActions(fileData)}

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => removeFile(fileData.id)}
        disabled={fileData.status === "uploading"}
        title="Remove"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );

  const renderGridItem = (fileData: UploadedFile) => (
    <div key={fileData.id} className="overflow-hidden rounded-lg border">
      <div className="relative aspect-video bg-muted">
        {renderPreview(fileData, "grid")}
      </div>
      <div className="space-y-3 p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium">
                {fileData.file.name}
              </p>
              {fileData.status === "success" && (
                <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
              )}
              {fileData.status === "error" && (
                <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
              )}
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {formatFileSize(fileData.file.size)} •{" "}
              {fileData.file.type || "Unknown type"}
            </p>
          </div>
          <Badge variant="outline" className="shrink-0 text-xs capitalize">
            {getStatusLabel(fileData)}
          </Badge>
        </div>
        {renderProgress(fileData)}
        {renderStatus(fileData)}
        <div className="flex justify-end">{renderFileActions(fileData)}</div>
      </div>
    </div>
  );

  const renderListItem = (fileData: UploadedFile) => (
    <div
      key={fileData.id}
      className="flex items-center gap-4 rounded-lg border p-3"
    >
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border bg-muted">
        {renderPreview(fileData, "list")}
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{fileData.file.name}</p>
          <Badge variant="outline" className="shrink-0 text-xs capitalize">
            {getStatusLabel(fileData)}
          </Badge>
          {fileData.status === "success" && (
            <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
          )}
          {fileData.status === "error" && (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {formatFileSize(fileData.file.size)} •{" "}
          {fileData.file.type || "Unknown type"}
        </p>
        {renderProgress(fileData)}
        {renderStatus(fileData)}
      </div>
      {renderFileActions(fileData)}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Settings</CardTitle>
            <CardDescription>Configure your upload preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showAppSelector && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="application">Application</Label>
                  {applicationId && viewFilesHref && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0"
                      asChild
                    >
                      <Link href={viewFilesHref}>View Files</Link>
                    </Button>
                  )}
                </div>
                <Select
                  value={applicationId}
                  onValueChange={onApplicationIdChange}
                  disabled={applicationLoading || applications.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        applicationLoading ? "Loading..." : "Select application"
                      }
                    />
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
            )}

            <div>
              <Label htmlFor="tags" className="mb-2">
                Tags (comma separated)
              </Label>
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
              <div>
                <strong>Images:</strong> PNG, JPG, GIF, WebP
              </div>
              <div>
                <strong>Videos:</strong> MP4, WebM, MOV
              </div>
              <div>
                <strong>Audio:</strong> MP3, WAV, OGG
              </div>
              <div>
                <strong>Documents:</strong> PDF, TXT, MD
              </div>
              <div className="text-muted-foreground">
                Max size: {MAX_MB}MB per file
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardContent className="p-6">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg">Drop the files here...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">
                    Drag & drop files here, or click to select
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Support for images, videos, audio, and documents
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {files.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>Files ({files.length})</CardTitle>
                  <CardDescription>
                    Ready to upload{" "}
                    {files.filter((f) => f.status === "pending").length} files
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={(value) =>
                      value && setViewMode(value as "grid" | "list")
                    }
                  >
                    <ToggleGroupItem value="grid" aria-label="Grid view">
                      <Grid2X2 className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="list" aria-label="List view">
                      <List className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <Button
                    onClick={uploadAll}
                    disabled={
                      files.filter((f) => f.status === "pending").length ===
                        0 || !applicationId
                    }
                  >
                    Upload All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
                    : "space-y-3"
                }
              >
                {files.map((fileData) =>
                  viewMode === "grid"
                    ? renderGridItem(fileData)
                    : renderListItem(fileData),
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

interface ApplicationUploadProps {
  applicationId: string;
  onUploadSuccess?: () => void;
}

export function ApplicationUpload({
  applicationId,
  onUploadSuccess,
}: ApplicationUploadProps) {
  return (
    <UploadPanel
      applicationId={applicationId}
      onUploadSuccess={onUploadSuccess}
    />
  );
}
