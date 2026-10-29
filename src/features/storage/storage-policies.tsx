"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
export type StorageDefaults = {
  defaultUploadDestinationId: string;
  defaultDeliveryMode: string;
};
export function StorageDefaultsForm({
  initial,
  onSaved,
}: {
  initial?: StorageDefaults;
  onSaved?: () => void;
}) {
  const [settings, setSettings] = useState(initial),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    if (initial) {
      setSettings(initial);
      return;
    }
    const controller = new AbortController();
    void fetch("/api/admin/storage-settings", { signal: controller.signal })
      .then(async (response) => {
        if (response.ok) setSettings(await response.json());
      })
      .catch(() => {});
    return () => controller.abort();
  }, [initial]);
  if (!settings) return null;
  return (
    <section className="space-y-4 rounded-xl border bg-card p-6">
      <div>
        <h2 className="font-semibold">Storage defaults</h2>
        <p className="text-sm text-muted-foreground">
          Applications can choose their own destination. Individual uploads can
          override it.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="system-destination">Default upload destination</Label>
          <select
            id="system-destination"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={settings.defaultUploadDestinationId}
            disabled={busy}
            onChange={(event) =>
              setSettings({
                ...settings,
                defaultUploadDestinationId: event.target.value,
              })
            }
          >
            <option value="default">Default storage drive</option>
            <option value="local">Local storage (this VPS)</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="system-delivery">Default drive delivery</Label>
          <select
            id="system-delivery"
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
            value={settings.defaultDeliveryMode}
            disabled={busy}
            onChange={(event) =>
              setSettings({
                ...settings,
                defaultDeliveryMode: event.target.value,
              })
            }
          >
            <option value="proxy">Proxy — through Serve</option>
            <option value="direct">Direct — signed S3 URLs</option>
          </select>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Local files always load through Serve. Changing a default does not move
        existing files. Direct delivery requires visitors to be able to reach
        the storage endpoint.
      </p>
      <Button
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const response = await fetch("/api/admin/storage-settings", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                defaultUploadDestinationId: settings.defaultUploadDestinationId,
                defaultDeliveryMode: settings.defaultDeliveryMode,
              }),
            });
            const data = await response.json();
            if (!response.ok)
              throw new Error(data.error ?? "Unable to save defaults.");
            toast.success("Storage defaults saved");
            onSaved?.();
          } catch (error) {
            toast.error(
              error instanceof Error
                ? error.message
                : "Unable to save defaults.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Saving…" : "Save storage defaults"}
      </Button>
    </section>
  );
}
export function LocalBackupSettings({
  connections,
  defaultS3,
}: {
  connections: Array<{ id: string; name: string; enabled: boolean }>;
  defaultS3: boolean;
}) {
  const [target, setTarget] = useState<string>(),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/storage-preferences", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        setTarget((await response.json()).localBackupConnectionId ?? "");
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <section className="space-y-4 rounded-xl border bg-card p-6">
      <div>
        <h2 className="font-semibold">Back up new local uploads</h2>
        <p className="text-sm text-muted-foreground">
          Save on this VPS first, then copy new files and image variants to S3
          in the background.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="local-backup-target">S3 backup destination</Label>
        <select
          id="local-backup-target"
          className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          value={target ?? ""}
          disabled={target === undefined || busy}
          onChange={(event) => setTarget(event.target.value)}
        >
          <option value="">Off</option>
          {defaultS3 && <option value="default">Default S3 storage</option>}
          {connections.map((connection) => (
            <option
              key={connection.id}
              value={connection.id}
              disabled={!connection.enabled}
            >
              {connection.name}
              {!connection.enabled ? " — disabled" : ""}
            </option>
          ))}
        </select>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">
        Applies only to uploads made after enabling this setting. Existing files
        are not queued. Copies include JSON file metadata and application links.
        Backups remain in S3 when local files are deleted, until you explicitly
        remove the backup. Dokploy handles database backups.
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <Button
          disabled={target === undefined || busy}
          onClick={async () => {
            setBusy(true);
            try {
              const response = await fetch("/api/storage-preferences", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  localBackupConnectionId: target || null,
                }),
              });
              const data = await response.json();
              if (!response.ok)
                throw new Error(
                  data.error ?? "Unable to save backup destination.",
                );
              toast.success(
                target
                  ? "New local uploads will be backed up"
                  : "Local upload backups disabled",
              );
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Unable to save backup destination.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? "Saving…" : "Save backup destination"}
        </Button>
        <Link
          href="/dashboard/storage-jobs"
          className="text-sm underline underline-offset-4"
        >
          View backups and transfers
        </Link>
      </div>
    </section>
  );
}
