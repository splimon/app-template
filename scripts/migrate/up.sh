#!/bin/bash

# Runs a full migration cycle: up, down (1), up (dev only)
# Whereas in production, only runs the migration up
# In production, the migration is called in the predeploy task

ENV_ARG=$1
MIGRATION_COUNT=$2

case $ENV_ARG in
  d|dev)
    ENV="dev"
    ;;
  p|prod)
    ENV="prod"
    ;;
  *)
    echo "Error: Invalid environment specified"
    echo "Usage: ./scripts/migrate.sh [d|dev|p|prod] [number]"
    echo "  number: optional, number of migrations to run (default: all)"
    exit 1
    ;;
esac

case $ENV in
  dev)
    ENV_FILE=".env"
    export $(cat $ENV_FILE | grep -v '^#' | xargs)
    ;;
  prod)
    ENV_FILE=".env.none"
    export PATH=../bin/:$PATH
    ;;
  *)
    exit 1
    ;;
esac

echo "Running migration cycle for $ENV environment..."

# Run migration up
echo ""
if [ -z "$MIGRATION_COUNT" ]; then
  echo "Running all pending migrations up..."
  migrate -database "${DATABASE_URL}" -path src/lib/db/migrations up
else
  echo "Running $MIGRATION_COUNT migration(s) up..."
  migrate -database "${DATABASE_URL}" -path src/lib/db/migrations up $MIGRATION_COUNT
fi

case $ENV in
  dev)
    echo ""
    # Test rollback
    echo ""
    echo "Testing rollback (down 1)..."
    migrate -database "${DATABASE_URL}" -path src/lib/db/migrations down 1

    # Run migration up again
    echo ""
    if [ -z "$MIGRATION_COUNT" ]; then
      echo "Running migration back up..."
      migrate -database "${DATABASE_URL}" -path src/lib/db/migrations up
    else
      echo "Running $MIGRATION_COUNT migration(s) back up..."
      migrate -database "${DATABASE_URL}" -path src/lib/db/migrations up $MIGRATION_COUNT
    fi
    ;;
  *)
    exit 1
    ;;
esac

echo ""
echo "Migration cycle completed successfully!"