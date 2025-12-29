import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Key, Image as ImageIcon } from "lucide-react";
import { ApplicationDTO, AuditLogItemDTO, ImageFileDTO, CacheResponse } from "./types";

interface Props {
  application: ApplicationDTO;
  images: ImageFileDTO[];
  activity: AuditLogItemDTO[];
  cacheData: CacheResponse | null;
}

export function ApplicationOverview({ application, images, activity, cacheData }: Props) {
  const cacheTotalBytes: number = cacheData?.totalBytes || 0;

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
    <div className="space-y-6">
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
                  images.reduce(
                    (total, img) =>
                      total +
                      img.sizeBytes +
                      img.variants.reduce(
                        (vTotal, variant) => vTotal + variant.sizeBytes,
                        0,
                      ),
                    0,
                  ) + cacheTotalBytes,
                )}
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>
                  Files:{" "}
                  {formatFileSize(
                    images.reduce(
                      (total, img) =>
                        total +
                        img.sizeBytes +
                        img.variants.reduce(
                          (vTotal, variant) => vTotal + variant.sizeBytes,
                          0,
                        ),
                      0,
                    ),
                  )}
                </div>
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
    </div>
  );
}
