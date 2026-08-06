#!/bin/sh
set -e

LOCK_HASH_FILE="node_modules/.lock-hash"
CURRENT_HASH=$(md5sum package-lock.json | awk '{print $1}')

if [ ! -d "node_modules" ] || [ ! -f "$LOCK_HASH_FILE" ] || [ "$(cat "$LOCK_HASH_FILE" 2>/dev/null)" != "$CURRENT_HASH" ]; then
    echo "Dependencies out of date, running npm install..."
    npm install
    echo "$CURRENT_HASH" > "$LOCK_HASH_FILE"
else
    echo "Dependencies up to date, skipping npm install."
fi

exec "$@"
