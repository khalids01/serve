# Storage connections and file manager

This release targets a fresh Serve installation. Deploy with a new PostgreSQL database and the production Compose file; its migration container applies the schema before Serve starts. No conversion of existing files is provided.

## Choose storage

Go to **Dashboard → Storage**. Applications can use:

- **Default**: `STORAGE_PROVIDER` and the host's `S3_*` environment settings (or host Local when `STORAGE_PROVIDER=local`). Missing S3 settings disable Default; they do not prevent Local or saved connections from working.
- **Local storage (this VPS)**: files under `/uploads` in the persistent `serve-uploads` Docker volume, independent of the default provider.
- **A saved S3 connection**: IDrive e2, Amazon S3, Cloudflare R2, MinIO, or another S3-compatible service. The provider selector supplies presets; the endpoint, region, bucket, and addressing settings determine compatibility. Bucket creation is done with the provider, before connecting it to Serve.

To add a connection, enter a name, HTTPS S3 endpoint origin (without a bucket path), existing bucket, region, addressing mode, and credentials. For AWS choose the endpoint matching the bucket's region; for IDrive e2 use its bucket's region endpoint. Saving checks Put/Get/List/Delete permissions with a temporary probe under `connections/<connection-id>/_serve-checks/`. The probe is removed. No bucket needs public access or browser CORS.

A disabled connection cannot receive new uploads or moves. Existing files remain readable. Credentials and names can be updated; endpoint/bucket/region/addressing cannot change while the connection is used. Create another connection and move the files instead. Remove a connection only after changing application defaults and moving or permanently deleting its files, including Trash.

## Encrypt credentials

Set only on the Serve host, in Dokploy's Compose Environment:

```bash
# Run locally and paste its output as the environment value:
openssl rand -base64 32
# STORAGE_ENCRYPTION_KEY=<output>
```

Use a dedicated key, retained across redeployments. Serve uses AES-256-GCM with random nonces and authentication bound to the connection and owner. The database stores an encrypted envelope; browser APIs never return plaintext credentials or that envelope. Default S3 credentials remain in environment variables. Default and Local do not require the encryption key.

For rotation, set a new `STORAGE_ENCRYPTION_KEY` and put the old key in `STORAGE_ENCRYPTION_PREVIOUS_KEYS` (comma-separated). Redeploy, then click **Refresh encryption** for every connection. Remove old keys only after all active connections and backups you may restore can be decrypted. Back up keys separately from database exports; losing a key makes its saved credentials unreadable.

Saved endpoints must resolve to public addresses. Private MinIO is an operator opt-in: set `STORAGE_ALLOWED_PRIVATE_HOSTS=minio` for the exact internal hostname, then use `http://minio:9000` with path-style addressing. Do not allow arbitrary hostnames. DNS addresses are checked again for each socket.

## Local storage in Dokploy

The production Compose file already mounts `serve-uploads:/uploads`. Files survive container replacement and image upgrades on that VPS. Do not remove the volume. Set up VPS/volume backups separately: database JSON/SQL backups contain metadata, not the uploaded bytes. Local storage is tied to this host; moving the deployment to another VPS requires copying the volume. Multiple app replicas need shared storage; S3 is the simpler option for that deployment.

System backups use the host's Default backend, not an application's selected connection. Configure Default if scheduled backups are enabled (`BACKUP_ENABLED`), or select `STORAGE_PROVIDER=local` for local system backups. JSON backup schema v2 includes folders, Trash, application defaults, file locations, and encrypted connection records; it still requires the corresponding file bytes and encryption keys on restore.

## File manager

Open **Dashboard → Files**, select an application, and browse folders with the sidebar, breadcrumbs, back/forward, or double-click. Use grid/list views, application-wide search, name/date/size/type sorting, and image/video/audio filters. Recent, Starred, and Trash are available in the sidebar.

- Upload with the button or drop files into the current folder or a folder tile. The queue runs up to three uploads at once, shows progress, and supports cancel/retry. Cancellation after the server has received the request may still finish saving the file; refresh before retrying.
- Create folders; rename items; Ctrl/⌘ click or Shift click to select multiple items; Ctrl/⌘ A selects the displayed page. F2 renames, Enter opens, Delete moves to Trash. Ctrl/⌘ C, X, V copy, cut, and paste within the application.
- Move/copy using the toolbar or drag selected items onto a folder. The dialog can also choose another storage location. Files retain their IDs and Serve URLs when moved; copies receive new IDs. Cross-location moves verify stored bytes before changing the reference. Other copies retain their source bytes until their last reference is removed.
- Preview images, video, and audio, crop raster images as new files, download other files, or copy the public Serve URL. The manager operates inside an application; it does not expose the VPS filesystem or arbitrary bucket objects.
- Trash is recoverable and still occupies storage. Restore places items back in their folders when possible, otherwise at the application root. Delete permanently or Empty Trash releases bytes only when no entry still references them. Trash does not revoke public URLs or browser caches. Treat returned file URLs as public; private delivery requires a separate access-control feature.

Choose an application's default storage when creating it, in its Settings, or in the manager's sidebar. This affects future SDK and dashboard uploads. Existing files always read from their recorded location. Changing the host's Default bucket/provider is not a way to move files: old files retain their original endpoint/bucket snapshot, and still need credentials that can access that location.

## Consumer integration

Consuming apps still need only `FILE_SERVER_URL` and a server-side `FILE_SERVER_API_KEY`, then `@skycanvasstudio/serve-server`. React browser management uses `@skycanvasstudio/serve-react` and the documented authenticated browser-token route. No S3 credentials belong in consuming apps.

Store and render the URLs returned by Serve. They point to Serve's stable file entry, which resolves its recorded Local/S3 connection. Keep file IDs opaque. See [integration-guide.md](integration-guide.md) for tested install and upload examples.

## Development verification

`npm run typecheck`, `npm run test:deploy`, and the `npm_pkg` typecheck/lint/test suites cover the release. `npm run test:storage` exercises real database/filesystem operations and requires an explicitly selected, isolated localhost PostgreSQL database whose name ends in `_test`, with `SERVE_INTEGRATION_TEST=1`. Apply migrations to that test database first. It creates test metadata and a temporary upload directory; never point it at an application database. Saved S3 connections are checked against their real bucket when you click Test or Save in the dashboard.
