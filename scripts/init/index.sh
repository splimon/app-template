#!/bin/bash

# Initializes the project by setting up environment variables and running initial migrations

echo "======================================================================="
echo "=================== PMF App Initialization ============================"
echo "======================================================================="

# Input new app name
echo ""
read -p "Enter your new app name (no spaces or special characters): " APP_NAME

# Input PMF Remote Host
read -p "Enter the PMF Dokku Host (get from PMF Builder Admin): " PMF_DOKKU_HOST

# Create .env file
echo ""
echo "Creating .env file..."
touch .env
echo "PMF_DOKKU_HOST=$PMF_DOKKU_HOST" >> .env
echo "" >> .env

# Build Dokku Apps & Postgres Containers
echo ""
echo "Building Dokku apps & postgres containers..."
./scripts/init/dokku.sh $APP_NAME

# Verify Golang Migrate Installation
echo "Verifying Golang Migrate installation..."
if ! command -v migrate &> /dev/null
then
    echo "Golang Migrate could not be found, please install it."
    # Windows use scoop
    if [[ "$OSTYPE" == "msys" ]]; then
        scoop install migrate
    # MacOS use brew
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        brew install golang-migrate
    # Linux use apt-get
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo apt-get install -y golang-migrate
    else
        echo "Unsupported OS. Please install Golang Migrate manually from https://github.com/golang-migrate/migrate"
    fi
else
    echo "Golang Migrate is already installed."
fi
echo ""

# Install dependencies
echo "Installing project dependencies..."
pnpm install
echo ""

# Run database migrations
./scripts/init/db.sh

# Create sysadmin user for dev on this project
# Create a pepper for password hashing and store it in .env
echo "Creating pepper..."
PEPPER=$(openssl rand -hex 32)
echo "PASSWORD_HASH_SECRET=$PEPPER" >> .env
echo ""

# Set up system admin user
echo ""
echo "Setting up system admin user..."
tsx ./scripts/init/sysadmin.ts
echo ""

echo "======================================================================="
echo "================= PMF App Initialization Complete ====================="
echo "======================================================================="
echo ""
echo "You can now start the development server with 'pnpm dev'"