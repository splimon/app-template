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

# If dokku setup fails, exit script
if [ $? -ne 0 ]; then
    echo "Dokku setup failed. Exiting initialization."
    exit 1
fi
echo ""

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

# Insert Google OAuth credentials placeholders in .env
echo "Inserting Google OAuth credentials placeholders in .env..."
echo "GOOGLE_CLIENT_ID=your_google_client_id_here" >> .env
echo "GOOGLE_CLIENT_SECRET=your_google_client_secret_here" >> .env
echo "GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback" >> .env
echo ""

# Set up system admin user
echo "Setting up system admin user..."
tsx ./scripts/init/sysadmin.ts
echo ""

# Catch SIGINT to exit gracefully
trap "echo 'Initialization interrupted! Exiting...'; exit 1" SIGINT

echo "======================================================================="
echo "================= PMF App Initialization Complete ====================="
echo "======================================================================="
echo ""
echo "You can now start the development server with 'pnpm dev'"