#!/bin/bash
set -e

SITE="iti-comite"
LIVE="/var/www/$SITE"
FLAG="/run/nginx-maintenance/$SITE"

cd "$LIVE"

# Maintenance mode on
sudo touch "$FLAG"
trap 'sudo rm -f "$FLAG"' EXIT

# Pull latest
git pull

# Install & build
bun install --frozen-lockfile
bun run build

echo "Deploy complete."
