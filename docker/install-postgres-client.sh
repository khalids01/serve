#!/bin/sh
set -eu

# Debian's default client can lag behind the deployed database server.
apt-get update
apt-get install -y --no-install-recommends curl ca-certificates
install -d /usr/share/postgresql-common/pgdg
curl --fail --silent --show-error --location \
  https://www.postgresql.org/media/keys/ACCC4CF8.asc \
  --output /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc
. /etc/os-release
cat > /etc/apt/sources.list.d/pgdg.sources <<SOURCES
Types: deb
URIs: https://apt.postgresql.org/pub/repos/apt
Suites: ${VERSION_CODENAME:?}-pgdg
Architectures: $(dpkg --print-architecture)
Components: main
Signed-By: /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc
SOURCES
apt-get update
apt-get install -y --no-install-recommends postgresql-client-18
/usr/lib/postgresql/18/bin/pg_dump --version | grep -E '^pg_dump .* 18\.'
rm -rf /var/lib/apt/lists/*
