# GitHub → Docker Hub → Dokploy

Use [the deployment guide](docs/deployment.md) for GitHub settings, Dokploy setup,
webhook/API options, migration behavior and rollback.

In Dokploy select **Docker Compose**, this repository's **main** branch, and
**docker-compose.production.yml**. CI publishes app/migration images before
triggering deployment. Set `IMAGE_TAG=main` for automatic deployments.
