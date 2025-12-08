#!/bin/bash
set -e

echo "=== Waiting for database ==="
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" -d "$DB_DATABASE" -c '\q' 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping..."
  sleep 2
done
echo "PostgreSQL is up!"

echo "=== Clearing caches ==="
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

echo "=== Running migrations ==="
php artisan migrate --force

echo "=== Optimizing for production ==="
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "=== Starting Apache ==="
exec apache2-foreground
