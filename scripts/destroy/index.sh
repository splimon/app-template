#!/bin/bash

# Undo script to destroy the Dokku apps and Postgres containers

read -p "Are you sure you want to destroy the Dokku apps and Postgres containers? This action cannot be undone. (y/n): " CONFIRMATION
if [ "$CONFIRMATION" != "y" ] && [ "$CONFIRMATION" != "Y" ]; then
    echo "Operation cancelled."
    exit 0
fi

# Destroy Dokku apps and Postgres containers
read -p "Enter your app name to remove it: " APP_NAME
./scripts/destroy/dokku.sh $APP_NAME
echo ""