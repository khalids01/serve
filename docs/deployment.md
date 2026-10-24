# Deployment: GitHub → Docker Hub → Dokploy

This follows the `ts-starter` ecommerce deployment pattern: CI publishes an app
image and a one-shot migration image, updates the deployment tags only after both
succeed, then sends a deployment request to Dokploy. Dokploy clones this repository,
reads `docker-compose.production.yml`, pulls the images, applies pending migrations,
and starts Serve only after migrations succeed.

Defaults: GitHub branch `main`, Docker Hub repository `khalids01/serve`, container
port `5000`, external network `dokploy-network`. PostgreSQL is provisioned separately.
No database, migration, seeding or production deployment is performed by image builds.

## 1. Create the Docker Hub repository

Create `khalids01/serve` (or your chosen repository) in Docker Hub. It can be public
or private. In this GitHub repository's **Settings → Secrets and variables → Actions**:

| Type | Name | Value |
| --- | --- | --- |
| Secret | `DOCKERHUB_TOKEN` | Docker Hub token with Read & Write permission |
| Variable | `DOCKERHUB_USERNAME` | Defaults to `khalids01`; account used to log in |
| Variable | `DOCKERHUB_IMAGE` | Defaults to `khalids01/serve`; namespace/repository |
| Variable | `NEXT_PUBLIC_APP_URL` | Actual public Serve HTTPS origin, e.g. `https://files.example.com`, no trailing slash |
| Variable | `NEXT_PUBLIC_MAX_FILE_SIZE` | Upload limit in MB; defaults to `50` |

The image contains Next.js browser assets. `NEXT_PUBLIC_*` values are baked into
those assets: set the public URL **before** building and keep the corresponding
Dokploy values identical. The startup validator refuses a different public URL,
so a domain change requires a rebuild, not just editing runtime env.

Database credentials, auth secrets, SMTP passwords, S3 keys and Dokploy credentials
are never Docker build arguments. `.dockerignore` excludes env files, `.npmrc`,
keys, host dependencies, generated Prisma files and package-development artifacts.

## 2. Create the Dokploy Compose service

1. Provision a dedicated PostgreSQL database reachable on `dokploy-network`.
   Use its internal hostname, not `localhost` in the application container.
2. Create a **Docker Compose** service in Dokploy, using regular Compose rather
   than Swarm Stack. `service_completed_successfully` is required for the migration gate.
3. Connect this repository and branch `main`; set the Compose path to
   **`docker-compose.production.yml`**. Do not use the old `docker-compose.yaml`
   or `Dockerfile.m`, which are legacy source-build configurations.
4. Set `IMAGE_TAG=main` in the Compose service's Environment settings for automatic
   deployment. Set `IMAGE_REPOSITORY` to the same value as GitHub's `DOCKERHUB_IMAGE`.
5. Copy [`.env.production.example`](../.env.production.example) into those service
   Environment settings, replacing every placeholder. Dokploy generates `.env`
   from these values. This is separate from GitHub Actions settings.
6. For a private Docker Hub repository, configure Dokploy's registry credentials
   with pull access to the repository. A GitHub Actions login does not log in your VPS.
7. Under **Domains**, route your Serve domain to service **`file-server`**, port
   **`5000`**, with HTTPS. The Compose file publishes no host ports and contains no
   server-specific Traefik router names. Preserve the public Host/protocol and Range
   headers. Set proxy/platform upload limits to accommodate `MAX_FILE_SIZE_MB`.

The app runs as non-root UID 1000. Its named `serve-uploads` volume is mounted at
`/uploads`; `UPLOAD_DIR` now controls the actual storage path. Use
`STORAGE_PROVIDER=local` for this volume, or `STORAGE_PROVIDER=s3` with bucket/key
settings for S3-compatible storage. A new volume does not import old uploads:
transfer existing local data or deliberately attach your existing volume before
switching deployments. Restored local files must be writable by UID 1000; the app does not recursively change existing volume ownership. Do not delete an old storage volume during migration.

Generate separate values for `BETTER_AUTH_SECRET` and
`FILE_SERVER_BROWSER_TOKEN_SECRET` with `openssl rand -base64 32`. Configure SMTP
(`EMAIL`, `EMAIL_PASSWORD`) for magic-link sign-in. Enable `ENABLE_SIGNUP=true`
when creating the initial account, then disable it if appropriate. Browser tokens
can be disabled by omitting their secret, but the React SDK requires it.

The runtime image includes PostgreSQL 17 `pg_dump` for SQL backups. This supports
PostgreSQL servers up to major 17; a newer database requires an image with a
compatible newer client. JSON backups do not use `pg_dump`. Configure backups and
storage as described in [configuration.md](configuration.md).

## 3. Configure one deployment trigger

Use **one** of the two options below. CI validates the chosen configuration before
building, and triggers it only after both images and moving tags are published.

### Option A: authenticated API — same as ts-starter ecommerce

This is the reference project's actual mechanism. Keep the native GitHub source
connection and **disable Dokploy Auto Deploy** for this Compose service. This
prevents a GitHub push from deploying before CI has published the images.

Set in GitHub Actions:

| Type | Name | Value |
| --- | --- | --- |
| Variable | `DOKPLOY_URL` | Dokploy HTTPS origin, e.g. `https://admin.example.com` |
| Variable | `DOKPLOY_COMPOSE_ID` | This Compose service's ID, not the project name |
| Secret | `DOKPLOY_API_KEY` | Dokploy API key with access to deploy the service |

Leave `DOKPLOY_WEBHOOK_URL` unset. The final step POSTs `{composeId}` to
`/api/compose.deploy` with the API key header. No deployment URL/key is printed.

### Option B: raw Compose webhook

Set GitHub secret **`DOKPLOY_WEBHOOK_URL`** to the complete private Compose webhook
URL shown by Dokploy, ending **`/api/deploy/compose/<token>`**. Leave all three API
settings from Option A unset.

Important: Dokploy's raw webhook requires the Compose service's **Auto Deploy to
be enabled**. To avoid a second, early GitHub-push deployment, use Dokploy's
**generic Git source** pointing to this GitHub repo and branch `main`, without a
native GitHub provider's automatic push trigger. Enable Auto Deploy for accepting
the manual webhook; register no direct GitHub or Docker Hub webhook. Use HTTPS
clone for a public repository or configure a deployment SSH key for a private one.
Leave Dokploy Watch Paths empty: CI already decides when to publish/deploy, and
manual workflow runs do not contain GitHub's changed-path arrays.

CI sends `X-GitHub-Event: push` with the branch, commit hash, repository and commit
path arrays. Plain empty POSTs can be rejected by Dokploy as “Branch Not Match”.
Redirects, branch refusals, missing credentials and non-JSON responses fail clearly.
If your Dokploy installation cannot decouple native push triggers from Auto Deploy,
use Option A, which preserves the reference project's ordering without that conflict.

These behaviors follow [Dokploy's Compose webhook handler](https://github.com/Dokploy/dokploy/blob/canary/apps/dokploy/pages/api/deploy/compose/%5BrefreshToken%5D.ts)
and [Compose documentation](https://docs.dokploy.com/docs/core/docker-compose).
Never commit the webhook token or API key. CI does not retry an ambiguous deployment
request automatically, because the first request may already have queued a deploy.

## 4. Push and deploy

Once Docker Hub, GitHub settings, Dokploy env, PostgreSQL and domain/DNS are ready:

```bash
git push origin main
```

The **Publish Docker images** workflow builds and pushes:

```text
khalids01/serve:app-sha-<full-commit>
khalids01/serve:migrate-sha-<full-commit>
```

Only after both succeed does it update:

```text
khalids01/serve:app-main
khalids01/serve:migrate-main
```

The final request queues Dokploy, whose Compose configuration pulls both images
(`pull_policy: always`). The `migrate` service runs the packaged Prisma 6 CLI:
`prisma migrate deploy`. It receives only `NODE_ENV` and `DATABASE_URL`, exits on
completion, and is not restarted. `file-server` depends on its successful exit.
A migration failure prevents a new application container from starting.

The migration image contains its own dependencies, schema, migrations and config;
it does not bind-mount source or download Prisma on the VPS. Both images are built
from the same commit. The migration image retains build dependencies; the app
image uses Next.js standalone output, Sharp and the generated Prisma client.

An accepted trigger means **queued**, not healthy. Check Dokploy logs, then:

```bash
curl --fail https://files.example.com/api/health
```

Expect `{ "status": "ok", "commit": "<published-commit>" }`. Health checks read the
migrated Application table; they do not modify data. Verify sign-in, a test upload,
preview/range delivery and application-scoped deletion. Keep your existing SMTP
and storage settings when moving an already deployed instance.

## 5. Migrations and existing databases

Builds only generate Prisma clients. Do not run `db push`, `migrate dev`, reset or
seed automatically in production. Before the first deployment against an existing
database, check its migration history and take a restorable backup. An existing
schema without matching Prisma history needs a reviewed baseline; the pipeline
cannot infer one safely. No schema change is introduced by this deployment setup.

The one-shot service applies only pending checked-in migrations. A successful,
exited migration container is expected. Use regular Compose dependency conditions,
not short-form `depends_on` or Swarm Stack; see [Docker startup ordering](https://docs.docker.com/compose/how-tos/startup-order/).
Older running app containers may remain active while migrations execute, so future
migrations should maintain compatibility during the rollout.

## 6. Manual releases, skipped builds and rollback

- Include **`[skip docker]`** in the latest commit message to skip image publication
  and deployment on that push. Other verification workflows still run.
- **Actions → Publish Docker images → Run workflow**, branch `main`, bypasses that
  skip marker. Uncheck `deploy` to publish images without calling Dokploy. GitHub
  requires the workflow to exist on the default branch for manual dispatch.
- For a controlled deployment, copy `IMAGE_TAG=sha-<full-commit>` from the Actions
  summary into Dokploy and deploy manually. The image repository must match CI.
- For rollback, select a known-good SHA tag and deploy. This changes images, not
  database history; verify compatibility with applied migrations first.
- Treat SHA tags as immutable release identifiers. Branch tags move, so deploy only
  after the complete workflow succeeds. Do not overwrite a SHA tag with different
  public build settings; create a new commit for changed settings.

## 7. Local checks and files

```bash
npm run test:deploy
npm run typecheck
SERVE_ENV_FILE=.env.production.example docker compose --env-file .env.production.example -f docker-compose.production.yml config --quiet
```

`SERVE_ENV_FILE` is only a local validation override; Dokploy normally uses `.env`.
To build test images locally, supply a public URL explicitly:

```bash
docker build --target app --build-arg NEXT_PUBLIC_APP_URL=https://files.example.com -t serve-check:app .
docker build --target migrate --build-arg NEXT_PUBLIC_APP_URL=https://files.example.com -t serve-check:migrate .
```

These commands do not publish images or apply migrations. Local verification used
`--network host` because Docker's default build network could not reach Debian
mirrors on this machine; the workflow uses the normal GitHub runner network.
Images built with example domains are verification images, not production releases.

| File | Purpose |
| --- | --- |
| `.github/workflows/publish-images.yml` | Build, publish and trigger Dokploy after success |
| `Dockerfile` targets `app` / `migrate` | Standalone app and self-contained migration images |
| `docker-compose.production.yml` | Pull images, gate startup on migration success, persist local uploads |
| `.env.production.example` | Template for Dokploy service Environment settings |
| `scripts/deploy-dokploy.mjs` | Validated API/webhook trigger with private credentials |
| `docker/entrypoint.sh`, `docker/validate-env.mjs` | Validate runtime configuration, then exec the server |

GitHub/VPS credentials and the production domain still need to be configured before
the first remote workflow run. No production migration or deployment was executed
while implementing these files.

## Verification on 2026-10-24

Both Docker targets built successfully using the example public origin (local test
images only). Offline image checks verified non-root UID 1000, writable `/uploads`,
Sharp processing, loading the Prisma native engine, PostgreSQL 17 client tools and
`prisma validate` from the self-contained migration image. Runtime configuration
validation passed without starting Serve or connecting to PostgreSQL.

Actionlint, production Compose rendering/assertions, root/package typechecks,
10 deployment/configuration tests and 28 backend tests passed. The backend tests
include health success/failure and confirmation that builds skip the backup
scheduler while runtime still registers it. No database migrations, application
startup, image publication, GitHub push or Dokploy deployment was performed.
