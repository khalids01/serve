"use client";
import {
  CheckCircle2,
  Cloud,
  FolderOpen,
  HardDrive,
  KeyRound,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Connection = {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  bucket: string;
  region: string;
  forcePathStyle: boolean;
  enabled: boolean;
  credentialsConfigured: boolean;
};
type Listing = {
  encryptionReady: boolean;
  builtins: { id: string; name: string; enabled: boolean }[];
  connections: Connection[];
};
const presets: Record<
  string,
  { name: string; region: string; endpoint: string; forcePathStyle: boolean }
> = {
  "idrive-e2": {
    name: "IDrive e2",
    region: "auto",
    endpoint: "",
    forcePathStyle: true,
  },
  aws: {
    name: "Amazon S3",
    region: "us-east-1",
    endpoint: "https://s3.us-east-1.amazonaws.com",
    forcePathStyle: false,
  },
  r2: {
    name: "Cloudflare R2",
    region: "auto",
    endpoint: "",
    forcePathStyle: true,
  },
  minio: {
    name: "MinIO",
    region: "us-east-1",
    endpoint: "",
    forcePathStyle: true,
  },
  s3: {
    name: "S3 compatible",
    region: "auto",
    endpoint: "",
    forcePathStyle: true,
  },
};
const blank = {
  name: "",
  provider: "idrive-e2",
  endpoint: "",
  bucket: "",
  region: "auto",
  forcePathStyle: true,
  accessKeyId: "",
  secretAccessKey: "",
};
async function request(url: string, method = "GET", body?: unknown) {
  const response = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Request failed.");
  return data;
}
export function StorageConnections() {
  const [listing, setListing] = useState<Listing>(),
    [error, setError] = useState(""),
    [open, setOpen] = useState(false),
    [editing, setEditing] = useState<Connection>(),
    [form, setForm] = useState(blank),
    [busy, setBusy] = useState<string>();
  const load = useCallback(async () => {
    try {
      setListing(await request("/api/storage-connections"));
      setError("");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to load storage.",
      );
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  const act = async (
    id: string,
    operation: () => Promise<unknown>,
    message: string,
  ) => {
    setBusy(id);
    try {
      await operation();
      toast.success(message);
      await load();
    } catch (cause) {
      toast.error(cause instanceof Error ? cause.message : "Operation failed.");
    } finally {
      setBusy(undefined);
    }
  };
  const save = async () => {
    const body = {
      ...form,
      ...(editing
        ? {
            accessKeyId: form.accessKeyId || undefined,
            secretAccessKey: form.secretAccessKey || undefined,
          }
        : {}),
    };
    setBusy("save");
    try {
      await request(
        `/api/storage-connections${editing ? `/${editing.id}` : ""}`,
        editing ? "PATCH" : "POST",
        body,
      );
      toast.success("Connection tested and saved");
      setOpen(false);
      await load();
    } catch (cause) {
      toast.error(
        cause instanceof Error ? cause.message : "Unable to save connection.",
      );
    } finally {
      setBusy(undefined);
    }
  };
  return (
    <div className="flex min-w-0 flex-col gap-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Storage</h1>
          <p className="text-sm text-muted-foreground">
            Open a drive to upload, organize, and manage your files.
          </p>
        </div>
        <Button
          disabled={!listing?.encryptionReady}
          onClick={() => {
            setEditing(undefined);
            setForm(blank);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 size-4" />
          Add S3 connection
        </Button>
      </header>
      {error && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"
        >
          {error}{" "}
          <button
            type="button"
            className="underline"
            onClick={() => void load()}
          >
            Retry
          </button>
        </p>
      )}
      {!listing && !error && (
        <p
          aria-live="polite"
          className="flex items-center gap-2 py-8 text-sm text-muted-foreground"
        >
          <Loader2 className="size-4 animate-spin" />
          Loading drives…
        </p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {listing?.builtins.map((location) => (
          <article
            key={location.id}
            className="relative min-w-0 rounded-xl border bg-card p-6 transition-colors hover:border-blue-500/40"
          >
            <div className="mb-3 flex items-center gap-3">
              {location.id === "local" ? (
                <HardDrive className="size-6 text-blue-500" />
              ) : (
                <Cloud className="size-6 text-blue-500" />
              )}
              <h2 className="font-semibold">
                {location.enabled ? (
                  <Link
                    href={`/dashboard/storage/${location.id}`}
                    className="hover:text-blue-500"
                  >
                    {location.name}
                  </Link>
                ) : (
                  location.name
                )}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">
              {location.id === "local"
                ? "Files on this server. Upload files and organize them into folders."
                : "Your default storage drive, configured by the server administrator."}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {location.enabled
                ? "Ready to use"
                : "Not configured — select Local or configure the default S3 environment"}
            </p>
            {location.enabled && (
              <Button variant="outline" size="sm" className="mt-4" asChild>
                <Link href={`/dashboard/storage/${location.id}`}>
                  <FolderOpen className="mr-2 size-4" />
                  Browse files
                </Link>
              </Button>
            )}
          </article>
        ))}
      </div>
      {listing && !listing.encryptionReady && (
        <details className="rounded-lg border bg-muted/20 px-4 py-3 text-sm">
          <summary className="cursor-pointer font-medium">
            Enable saved S3 connections
          </summary>
          <div className="mt-3 flex items-start gap-3">
            <KeyRound className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 space-y-1">
              <p className="font-medium">
                Set up encryption to add S3 connections
              </p>
              <p className="break-words leading-relaxed text-muted-foreground">
                Set <code className="break-all">STORAGE_ENCRYPTION_KEY</code> on
                the server to save S3 credentials. Generate a key with{" "}
                <code className="break-all">openssl rand -base64 32</code>.
                Default and Local storage can be used without this key.
              </p>
            </div>
          </div>
        </details>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Connected buckets</h2>
        <span className="text-xs text-muted-foreground">
          {listing?.connections.length ?? 0} connections
        </span>
      </div>
      <div className="grid gap-4 xl:grid-cols-2 empty:hidden">
        {listing?.connections.map((connection) => (
          <article
            key={connection.id}
            className="relative min-w-0 rounded-xl border bg-card p-6 transition-colors hover:border-blue-500/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{connection.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {presets[connection.provider]?.name ?? connection.provider} ·{" "}
                  {connection.enabled ? "Enabled" : "Disabled"}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="size-3" />
                Credentials encrypted
              </span>
            </div>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link
                href={`/dashboard/storage/${encodeURIComponent(connection.id)}`}
              >
                <FolderOpen className="mr-2 size-4" />
                Browse files
              </Link>
            </Button>
            <details className="mt-4">
              <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                Connection settings
              </summary>
              <dl className="my-4 space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Bucket</dt>
                  <dd className="truncate font-mono">{connection.bucket}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Endpoint</dt>
                  <dd className="truncate" title={connection.endpoint}>
                    {connection.endpoint}
                  </dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Region</dt>
                  <dd>{connection.region}</dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!!busy}
                  onClick={() => {
                    setEditing(connection);
                    setForm({
                      name: connection.name,
                      provider: connection.provider,
                      endpoint: connection.endpoint,
                      bucket: connection.bucket,
                      region: connection.region,
                      forcePathStyle: connection.forcePathStyle,
                      accessKeyId: "",
                      secretAccessKey: "",
                    });
                    setOpen(true);
                  }}
                >
                  <Pencil className="mr-1 size-3" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!!busy}
                  onClick={() =>
                    void act(
                      connection.id,
                      () =>
                        request(
                          `/api/storage-connections/${connection.id}/test`,
                          "POST",
                        ),
                      "Read/write/list/delete test passed",
                    )
                  }
                >
                  <RefreshCw
                    className={`mr-1 size-3 ${busy === connection.id ? "animate-spin" : ""}`}
                  />
                  Test
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!!busy}
                  onClick={() =>
                    void act(
                      connection.id,
                      () =>
                        request(
                          `/api/storage-connections/${connection.id}`,
                          "PATCH",
                          { enabled: !connection.enabled },
                        ),
                      "Connection updated",
                    )
                  }
                >
                  {connection.enabled ? "Disable" : "Enable"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!!busy}
                  onClick={() =>
                    void act(
                      connection.id,
                      () =>
                        request(
                          `/api/storage-connections/${connection.id}/rotate-key`,
                          "POST",
                        ),
                      "Credentials re-encrypted with the current host key",
                    )
                  }
                >
                  <KeyRound className="mr-1 size-3" />
                  Refresh encryption
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!!busy}
                  onClick={() => {
                    if (
                      confirm(
                        `Remove connection “${connection.name}”? Connections used by files or applications cannot be removed.`,
                      )
                    )
                      void act(
                        connection.id,
                        () =>
                          request(
                            `/api/storage-connections/${connection.id}`,
                            "DELETE",
                          ),
                        "Connection removed",
                      );
                  }}
                >
                  <Trash2 className="mr-1 size-3" />
                  Remove
                </Button>
              </div>
            </details>
          </article>
        ))}
      </div>
      {listing?.connections.length === 0 && (
        <div className="rounded-xl border border-dashed px-6 py-6 text-center text-sm text-muted-foreground">
          Connect an S3 bucket to add another drive. Your built-in drives are
          ready to use.
        </div>
      )}
      <Dialog
        open={open}
        onOpenChange={(value) => {
          if (!busy) setOpen(value);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit storage connection" : "Add S3 connection"}
            </DialogTitle>
            <DialogDescription>
              Saving tests bucket permissions with a temporary probe file, then
              encrypts the credentials. Existing file locations cannot be
              redirected by changing the endpoint or bucket.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="connection-name">Name</Label>
                <Input
                  id="connection-name"
                  required
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="connection-provider">Provider</Label>
                <select
                  id="connection-provider"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={form.provider}
                  onChange={(event) => {
                    const provider = event.target.value;
                    setForm({
                      ...form,
                      provider,
                      region: presets[provider].region,
                      endpoint: presets[provider].endpoint,
                      forcePathStyle: presets[provider].forcePathStyle,
                    });
                  }}
                >
                  {Object.entries(presets).map(([id, value]) => (
                    <option key={id} value={id}>
                      {value.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {[
              {
                key: "endpoint",
                label: "S3 endpoint",
                placeholder: "https://your-region.idrivee2.com",
              },
              { key: "bucket", label: "Bucket", placeholder: "media" },
              { key: "region", label: "Region", placeholder: "auto" },
              {
                key: "accessKeyId",
                label: "Access key ID",
                placeholder: editing
                  ? "Leave empty to keep the stored key"
                  : "",
              },
              {
                key: "secretAccessKey",
                label: "Secret access key",
                placeholder: editing
                  ? "Leave empty to keep the stored secret"
                  : "",
              },
            ].map((field) => (
              <div key={field.key} className="space-y-1">
                <Label htmlFor={`connection-${field.key}`}>{field.label}</Label>
                <Input
                  id={`connection-${field.key}`}
                  type={field.key.includes("Key") ? "password" : "text"}
                  autoComplete={
                    field.key.includes("Key") ? "new-password" : "off"
                  }
                  required={
                    !editing ||
                    !["accessKeyId", "secretAccessKey"].includes(field.key)
                  }
                  placeholder={field.placeholder}
                  value={String(form[field.key as keyof typeof form] ?? "")}
                  onChange={(event) =>
                    setForm({ ...form, [field.key]: event.target.value })
                  }
                />
              </div>
            ))}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.forcePathStyle}
                onChange={(event) =>
                  setForm({ ...form, forcePathStyle: event.target.checked })
                }
              />
              Use path-style bucket addressing
            </label>
            <p className="text-xs text-muted-foreground">
              For MinIO on a private network, the server operator must allow the
              exact hostname in STORAGE_ALLOWED_PRIVATE_HOSTS.
            </p>
            <Button type="submit" className="w-full" disabled={busy === "save"}>
              {busy === "save" && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}
              {busy === "save"
                ? "Testing and saving…"
                : "Test and save connection"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
