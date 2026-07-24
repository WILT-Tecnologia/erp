#!/bin/bash
set -e

if [ ! -f ".env" ]; then
    echo "Copying .env.example to .env..."
    cp .env.example .env
fi

if [ ! -f "vendor/autoload.php" ]; then
    echo "Installing Composer dependencies..."
    composer install --no-interaction
fi

if [ ! -f "node_modules/.package-lock.json" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

if ! grep -q "APP_KEY=" .env || [ -z "$(grep 'APP_KEY=' .env | cut -d= -f2)" ]; then
    echo "Generating APP_KEY..."
    php artisan key:generate --force
fi

echo "Checking for pending migrations..."
if php artisan migrate:status >/dev/null 2>&1; then
    PENDING=$(php artisan migrate:status | grep -c "Pending" || true)
else
    # migrations table doesn't exist yet, so everything is pending
    PENDING=1
fi

if [ "$PENDING" -gt 0 ]; then
    echo "Running $PENDING pending migration(s)..."
    php artisan migrate --force
else
    echo "No pending migrations, skipping."
fi

exec "$@"
