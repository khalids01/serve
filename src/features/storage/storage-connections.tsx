"use client";
import { FolderOpen, HardDrive } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Drive = { id: string; name: string; enabled: boolean };
type Listing = { builtins: Drive[]; connections: Drive[] };
export function StorageConnections() {
  const [listing, setListing] = useState<Listing>();
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/storage-connections", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load storage.");
        setListing(await response.json());
      })
      .catch((error) => {
        if (!controller.signal.aborted) setError(error.message);
      });
    return () => controller.abort();
  }, []);
  const drives = listing ? [...listing.builtins, ...listing.connections] : [];
  return (
    <div className="space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Storage</h1>
          <p className="text-sm text-muted-foreground">
            Browse your drives and manage files.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/storage-jobs">Transfers and backups</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/settings#storage">Storage settings</Link>
          </Button>
        </div>
      </header>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      {!listing && !error && (
        <p aria-live="polite" className="text-muted-foreground">
          Loading drives…
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {drives.map((drive) => (
          <article
            key={drive.id}
            className="space-y-4 rounded-xl border bg-card p-5"
          >
            <div className="flex items-center gap-3">
              <HardDrive className="size-5 text-primary" />
              <h2 className="font-semibold">{drive.name}</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {drive.enabled
                ? "Ready to browse"
                : "Unavailable — check its connection in Settings."}
            </p>
            <Button
              variant="outline"
              disabled={!drive.enabled}
              asChild={drive.enabled}
            >
              {drive.enabled ? (
                <Link
                  href={`/dashboard/storage/${encodeURIComponent(drive.id)}`}
                >
                  <FolderOpen className="mr-2 size-4" />
                  Browse files
                </Link>
              ) : (
                "Unavailable"
              )}
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
