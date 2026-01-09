#!/bin/bash

# Initializes the project by setting up environment variables and running initial migrations

echo "======================================================================="
echo "=================== PMF App Initialization ============================"
echo "======================================================================="

# Input new app name
read -p "Enter your new app name (no spaces or special characters): " APP_NAME

# Input PMF Remote Host
read -p "Enter the PMF Dokku Host (get from PMF Builder Admin): " PMF_DOKKU_HOST

# Create .env file
echo ""
echo "Creating .env file..."
touch .env
echo "PMF_DOKKU_HOST=$PMF_DOKKU_HOST" >> .env
echo "" >> .env
echo ""

# Build Dokku Apps & Postgres Containers
echo ""
echo "Building Dokku apps & postgres containers..."
./scripts/init/dokku.sh $APP_NAME
echo ""

# Verify Golang Migrate Installation
echo ""
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
echo ""
echo "Installing project dependencies..."
pnpm install
echo ""

# Seed database with test data
echo ""
echo "Seeding database with test data..."
pnpm run seed
echo ""