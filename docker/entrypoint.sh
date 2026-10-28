#!/bin/sh
set -eu
node /app/docker/validate-env.mjs
# Show the selected client in deployment logs without connecting to the database.
"${PG_DUMP_PATH:-pg_dump}" --version || true
exec "$@"
