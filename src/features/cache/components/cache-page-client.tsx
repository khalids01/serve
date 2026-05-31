"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Database, HardDrive, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCacheSize,
  useCacheOverview,
  useClearAllCacheMutation,
  useClearApplicationCacheMutation,
} from "@/features/cache/hooks/use-cache-data";

type ClearTarget = { type: "all" } | { type: "application"; id: string; name: string };

export function CachePageClient() {
  const { data, isLoading, isError, refetch } = useCacheOverview();
  const clearAllMutation = useClearAllCacheMutation();
  const clearAppMutation = useClearApplicationCacheMutation();
  const [clearTarget, setClearTarget] = useState<ClearTarget | null>(null);

  const isClearing = clearAllMutation.isPending || clearAppMutation.isPending;

  const handleConfirmClear = async () => {
    if (!clearTarget) return;

    try {
      if (clearTarget.type === "all") {
        const result = await clearAllMutation.mutateAsync();
        toast.success(`Cleared ${formatCacheSize(result.clearedBytes)} of cache`);
      } else {
        const result = await clearAppMutation.mutateAsync(clearTarget.id);
        toast.success(
          `Cleared ${formatCacheSize(result.clearedBytes)} for ${clearTarget.name}`,
        );
      }
      setClearTarget(null);
    } catch {
      toast.error("Failed to clear cache");
    }
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cache</h1>
            <p className="text-muted-foreground mt-2">
              Manage on-demand image resize cache across your applications
            </p>
          </div>
          <Button
            variant="destructive"
            disabled={isLoading || isClearing || (data?.fileCount ?? 0) === 0}
            onClick={() => setClearTarget({ type: "all" })}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Cache
          </Button>
        </div>

        {data && !data.cacheInStorage && (
          <Card className="mb-6 border-amber-500/40 bg-amber-500/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Cache storage is disabled in{" "}
                <code className="text-xs">config.storage.cacheInStorage</code>.
                New resize requests will not write to cache, but existing cached
                files can still be cleared here.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cache Size</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "—" : formatCacheSize(data?.totalBytes ?? 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across all applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cached Files</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading ? "—" : (data?.fileCount ?? 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Resize variants stored in storage
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cache by Application</CardTitle>
            <CardDescription>
              On-demand resize outputs stored under each application&apos;s{" "}
              <code>_cache</code> folder and shared blob cache
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="mt-4 text-muted-foreground">Loading cache stats...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-12 space-y-4">
                <p className="text-muted-foreground">Failed to load cache stats.</p>
                <Button variant="outline" onClick={() => refetch()}>
                  Retry
                </Button>
              </div>
            ) : (data?.applications.length ?? 0) === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No applications yet. Create an application to start using cache.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Application</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-right">Files</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/dashboard/applications/${app.id}`}
                          className="hover:underline"
                        >
                          {app.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{app.slug}</Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {app.fileCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCacheSize(app.totalBytes)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isClearing || app.fileCount === 0}
                          onClick={() =>
                            setClearTarget({
                              type: "application",
                              id: app.id,
                              name: app.name,
                            })
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Clear
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <AlertDialog
        open={clearTarget !== null}
        onOpenChange={(open) => !open && setClearTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear cache?</AlertDialogTitle>
            <AlertDialogDescription>
              {clearTarget?.type === "all" ? (
                <>
                  This will delete all cached resize variants for every
                  application you own. Original files and upload variants are not
                  affected. New cache entries will be created again on the next
                  resize request.
                </>
              ) : (
                <>
                  This will delete all cached resize variants for{" "}
                  <strong>{clearTarget?.name}</strong>. Original files are not
                  affected.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isClearing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isClearing}
              onClick={(e) => {
                e.preventDefault();
                void handleConfirmClear();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isClearing ? "Clearing..." : "Clear cache"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
