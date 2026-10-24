import Link from "next/link";
import { CodeBlock } from "@/features/docs/code-block";
export function StorageSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Storage and file manager</h2>
      <p>
        Each application chooses Default, Local storage on this VPS, or a saved
        S3 connection. Consuming apps still configure only their Serve URL and
        application API key.
      </p>
      <section className="space-y-3 rounded-lg border p-6">
        <h3 className="text-lg font-semibold">Connect a location</h3>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Open{" "}
            <Link className="underline" href="/dashboard/storage">
              Dashboard → Storage
            </Link>
            . Default uses the host environment; Local uses the persistent
            /uploads Docker volume.
          </li>
          <li>
            For a saved S3 connection, first set STORAGE_ENCRYPTION_KEY on the
            Serve host to a separately generated 32-byte base64 key.
          </li>
          <li>
            Add an existing bucket with its endpoint origin, region, addressing
            mode, and credentials. IDrive e2, AWS, R2, MinIO, and generic S3
            presets are available. Saving tests read/write/list/delete
            permissions, then stores credentials encrypted.
          </li>
          <li>
            Select the location when creating your application, in its Settings,
            or in the file manager sidebar. New uploads use this default;
            existing files keep their recorded location.
          </li>
        </ol>
        <CodeBlock
          language="bash"
          code="# Generate once; save its output as STORAGE_ENCRYPTION_KEY in Dokploy\nopenssl rand -base64 32"
        />
        <p>
          Keep this key across redeployments and back it up separately. For
          rotation, retain old keys in STORAGE_ENCRYPTION_PREVIOUS_KEYS,
          redeploy, and refresh encryption on each connection before removing
          old keys. Private MinIO hostnames require an operator allowlist in
          STORAGE_ALLOWED_PRIVATE_HOSTS.
        </p>
      </section>
      <section className="space-y-3 rounded-lg border p-6">
        <h3 className="text-lg font-semibold">Manage your files</h3>
        <p>
          Open{" "}
          <Link className="underline" href="/dashboard/files">
            Dashboard → Files
          </Link>{" "}
          for folders, breadcrumbs, grid/list views, search, sorting, previews,
          multi-selection, upload progress, move/copy, stars, and recoverable
          Trash. Use Ctrl/⌘ C, X, V for copy/cut/paste, F2 to rename, and Delete
          to trash selected items.
        </p>
        <p>
          Move/copy can choose another storage location. Moves retain file IDs
          and URLs; copies get new IDs. Serve verifies copied bytes before
          switching a file to the destination. Trash occupies storage and does
          not revoke public URLs. Permanent deletion releases the bytes only
          after their final reference is removed.
        </p>
      </section>
      <section className="space-y-3 rounded-lg border p-6">
        <h3 className="text-lg font-semibold">Use Serve URLs</h3>
        <p>
          Save and render the returned Serve file URLs. Serve resolves each
          file’s saved storage connection; consumers never need S3 keys or
          bucket CORS settings. Files are publicly readable by URL; keep API
          keys server-side.
        </p>
        <p>
          Local storage works in Dokploy because the production Compose file
          mounts a persistent volume. It survives redeployments on the same VPS.
          Back up that volume separately, and copy it if moving servers.
          Database backups include metadata and encrypted connections, not
          uploaded bytes. System backups use the host’s Default backend.
        </p>
        <p>
          This schema is intended for a fresh deployment. Changing environment
          bucket settings does not move existing files; use the manager’s Move
          operation.
        </p>
      </section>
    </div>
  );
}
