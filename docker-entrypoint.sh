#!/bin/sh
set -e

# Wait for PostgreSQL to be ready using a simple TCP connection check
echo "Waiting for PostgreSQL to be ready..."
until nc -z "$DATABASE_HOST" "$DATABASE_PORT" 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is up - running migrations..."

# Run database migrations
npx sequelize-cli db:migrate

echo "Migrations completed - starting application"

# Execute the command passed to the container
exec "$@"
