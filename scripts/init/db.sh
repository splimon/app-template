#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
    echo ".env file not found! Please run the init script first."
    exit 1
fi

# Check if user is currently on version 1 of the migrations
CURRENT_VERSION_D=$(pnpm migrate version d)
CURRENT_VERSION_P=$(pnpm migrate version p)
if [[ "$CURRENT_VERSION_D" != "1" || "$CURRENT_VERSION_P" != "1" ]]; then
    echo "Database is already initialized. Current migration versions are:"
    echo " Development DB version: $CURRENT_VERSION_D"
    echo " Production DB version:  $CURRENT_VERSION_P"    
    echo "If you want to re-initialize the database, please reset your databases and run this script again."

    # Seed database with test data
    echo "Seeding database with test data..."
    npx tsx ./scripts/init/seed.ts
    echo ""

    exit 1
fi

# Run initial migrations on development and production databases
echo ""
echo "Running initial database migrations..."
echo "This will create the following data tables in your schema:"
echo "  - users (system_roles: sysadmin, user)"
echo "  - sessions"
echo "  - login_attempts"
pnpm migrate up d 1
pnpm migrate up p 1
echo ""

# Ask if users wants multi-tenancy migration (orgs & members)
echo ""
echo "Do you want to set up multi-tenancy data tables?"
echo "This will create the following data tables in your schema:"
echo "  - orgs (roles: org_admin, member, guest)"
echo "  - members"
read -p " Do you need this data table relationship? (y/n): " MULTI_TENANCY
if [[ "$MULTI_TENANCY" == "y" || "$MULTI_TENANCY" == "Y" ]]; then
    echo "Running multi-tenancy database migrations..."
    pnpm migrate up d 1
    pnpm migrate up p 1
else     
    echo "Skipping multi-tenancy database migrations. Make sure to remove the 2nd set of migration files in src/lib/db/migrations if not needed."
fi
echo ""

# Seed database with test data
echo "Seeding database with test data..."
tsx ./scripts/init/seed.ts
echo ""