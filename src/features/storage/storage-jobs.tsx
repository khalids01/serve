"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StorageLocationSelect } from "./location-select";

type Job = {
  id: string;
  kind: string;
  status: string;
  name?: string;
  source?: string;
  target?: string;
  operation?: string;
  scanned: boolean;
  phase?: string;
  attempts: number;
  error?: string;
  createdAt: string;
  counts: Array<{
    status: string;
    _count: number;
    _sum: { sizeBytes: number | null };
  }>;
};
async function request(url: string, method = "GET", body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error ?? "Unable to complete this operation.");
  return data;
}
export function StorageJobs() {
  const [jobs, setJobs] = useState<Job[]>(),
    [error, setError] = useState(""),
    [cursor, setCursor] = useState<string>(),
    [history, setHistory] = useState<Array<string | undefined>>([]),
    [next, setNext] = useState<string>();
  const [source, setSource] = useState("default"),
    [target, setTarget] = useState("local"),
    [operation, setOperation] = useState("copy"),
    [prefix, setPrefix] = useState(""),
    [busy, setBusy] = useState<string>();
  const load = useCallback(async () => {
    try {
      const data = await request(
        `/api/storage-jobs${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`,
      );
      setJobs(data.jobs);
      setNext(data.nextCursor);
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to load jobs.");
    }
  }, [cursor]);
  useEffect(() => {
    void load();
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") void load();
    }, 5000);
    return () => clearInterval(timer);
  }, [load]);
  const act = async (id: string, action: string) => {
    if (
      action === "delete" &&
      !window.confirm(
        "Permanently remove this backup and its S3 copies? Local files will remain unchanged.",
      )
    )
      return;
    if (
      action === "cancel" &&
      !window.confirm(
        "Cancel this job? Copies already created will remain. A cancelled backup will no longer protect its local source.",
      )
    )
      return;
    setBusy(id);
    try {
      await request(
        `/api/storage-jobs/${id}`,
        action === "delete" ? "DELETE" : "PATCH",
        action === "delete" ? undefined : { action },
      );
      toast.success(action === "restore" ? "Restore queued" : "Job updated");
      await load();
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : "Unable to update job.",
      );
    } finally {
      setBusy(undefined);
    }
  };
  return (
    <div className="space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Transfers and file backups
          </h1>
          <p className="text-sm text-muted-foreground">
            Background copies, verified moves, and S3 protection for new local
            uploads.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/storage">Storage settings</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="/api/file-manifest">Export metadata JSON</a>
          </Button>
        </div>
      </header>
      <section className="space-y-4 rounded-xl border bg-card p-5">
        <div>
          <h2 className="font-semibold">Transfer storage contents</h2>
          <p className="text-sm text-muted-foreground">
            Transfer a whole location or folder between S3 buckets and local
            storage. Managed images include their variants.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Source</Label>
            <StorageLocationSelect
              value={source}
              onChange={setSource}
              disabled={!!busy}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Destination</Label>
            <StorageLocationSelect
              value={target}
              onChange={setTarget}
              disabled={!!busy}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transfer-prefix">Source folder (optional)</Label>
            <Input
              id="transfer-prefix"
              placeholder="Leave empty for the whole location"
              value={prefix}
              onChange={(event) => setPrefix(event.target.value)}
              disabled={!!busy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="transfer-operation">Action</Label>
            <select
              id="transfer-operation"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              value={operation}
              onChange={(event) => setOperation(event.target.value)}
              disabled={!!busy}
            >
              <option value="copy">Copy — keep originals</option>
              <option value="move">Move — remove verified originals</option>
            </select>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          The destination receives files in your namespace. Other owners’
          namespaces, caches, Trash, and backup archives are excluded. Identical
          copies can be reused; different existing files cause a conflict. New
          files added after inventory may need a later transfer. Moving managed
          files preserves their application URLs.
        </p>
        <Button
          disabled={!!busy || source === target}
          onClick={async () => {
            setBusy("create");
            try {
              await request("/api/storage-jobs", "POST", {
                source,
                target,
                operation,
                prefix: prefix ? `${prefix.replace(/\/+$/, "")}/` : "",
              });
              toast.success("Transfer queued");
              setCursor(undefined);
              setHistory([]);
              await load();
            } catch (cause) {
              toast.error(
                cause instanceof Error
                  ? cause.message
                  : "Unable to queue transfer.",
              );
            } finally {
              setBusy(undefined);
            }
          }}
        >
          {busy === "create"
            ? "Queuing…"
            : operation === "move"
              ? "Start verified move"
              : "Start copy"}
        </Button>
      </section>
      <section className="overflow-hidden rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-semibold">Activity</h2>
          <Button variant="ghost" size="sm" onClick={() => void load()}>
            Refresh
          </Button>
        </div>
        {error && (
          <p role="alert" className="p-4 text-sm text-destructive">
            {error}
          </p>
        )}
        {!jobs && !error && (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Loading jobs…
          </p>
        )}
        {jobs?.length === 0 && (
          <div className="space-y-2 p-10 text-center">
            <p className="font-medium">No storage jobs yet</p>
            <p className="text-sm text-muted-foreground">
              Start a transfer above, or enable S3 backups for new local uploads
              in Storage.
            </p>
          </div>
        )}
        <div className="divide-y">
          {jobs?.map((job) => {
            const total = job.counts.reduce(
                (count, group) => count + group._count,
                0,
              ),
              done = job.counts
                .filter((group) => group.status !== "pending")
                .reduce((count, group) => count + group._count, 0);
            return (
              <article key={job.id} className="space-y-3 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-all text-sm font-medium">
                      {job.kind === "backup"
                        ? "Local file backup"
                        : job.kind === "restore"
                          ? "Restore local files"
                          : job.operation === "move"
                            ? "Move storage contents"
                            : "Copy storage contents"}
                      {job.name ? ` · ${job.name}` : ""}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(job.createdAt).toLocaleString()}
                      {job.source ? ` · ${job.source}` : ""}
                      {job.target ? ` → ${job.target}` : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${job.status === "completed" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : job.status === "failed" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}
                  >
                    {job.status === "completed" && job.kind === "backup"
                      ? "Backed up"
                      : job.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {job.scanned
                    ? `${done} of ${total} files verified${job.phase === "cleanup" ? " · removing verified originals" : ""}`
                    : "Preparing file inventory…"}
                  {job.attempts ? ` · ${job.attempts} retry attempts` : ""}
                </p>
                {job.error && (
                  <p role="alert" className="text-sm text-destructive">
                    {job.error}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {job.status === "failed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!!busy}
                      onClick={() => void act(job.id, "retry")}
                    >
                      Retry
                    </Button>
                  )}
                  {["queued", "failed"].includes(job.status) && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!!busy}
                      onClick={() => void act(job.id, "cancel")}
                    >
                      Cancel
                    </Button>
                  )}
                  {job.kind === "backup" && job.status === "completed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={!!busy}
                      onClick={() => void act(job.id, "restore")}
                    >
                      Restore local files
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" asChild>
                    <a href={`/api/storage-jobs/${job.id}`}>
                      Download metadata JSON
                    </a>
                  </Button>
                  {["completed", "cancelled", "failed"].includes(
                    job.status,
                  ) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      disabled={!!busy}
                      onClick={() => void act(job.id, "delete")}
                    >
                      {job.kind === "backup"
                        ? "Remove backup"
                        : "Remove record"}
                    </Button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <footer className="flex items-center justify-between gap-2 border-t p-3 text-sm">
          <span className="text-muted-foreground">
            Page {history.length + 1} · up to 25 jobs
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!history.length}
              onClick={() => {
                setCursor(history.at(-1));
                setHistory((value) => value.slice(0, -1));
              }}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!next}
              onClick={() => {
                setHistory((value) => [...value, cursor]);
                setCursor(next);
              }}
            >
              Next
            </Button>
          </div>
        </footer>
      </section>
      <p className="text-xs text-muted-foreground">
        Uploads finish locally before background backups complete. Pending or
        failed backups are not yet durable S3 copies. Database backups are
        managed separately by Dokploy.
      </p>
    </div>
  );
}
