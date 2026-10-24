#!/bin/sh
set -eu
node /app/docker/validate-env.mjs
exec "$@"
