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

chown -R myuser:myuser /var/www/vendor /var/www/node_modules 2>/dev/null || true

echo "Running migrations..."
php artisan migrate --force

exec "$@"
