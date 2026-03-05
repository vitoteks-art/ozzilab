#!/usr/bin/env sh
set -e

if [ -n "${DATABASE_URL}" ]; then
  echo "Running prisma migrate deploy..."
  npx prisma migrate deploy || true
fi

node node_modules/next/dist/bin/next start -p 3000
