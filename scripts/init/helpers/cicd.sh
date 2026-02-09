#!/bin/bash

PMF_DOKKU_HOST=$1
APP_NAME=$2

# Create prod workflow file for Dokku deployment
touch ./.github/workflows/deploy.yml
echo "---" >> ./.github/workflows/deploy.yml
echo "name: Deploy to Dokku" >> ./.github/workflows/deploy.yml
echo "on:" >> ./.github/workflows/deploy.yml
echo "  push:" >> ./.github/workflows/deploy.yml
echo "    branches:" >> ./.github/workflows/deploy.yml
echo "      - main" >> ./.github/workflows/deploy.yml
echo "jobs:" >> ./.github/workflows/deploy.yml
echo "  deploy:" >> ./.github/workflows/deploy.yml
echo "    runs-on: ubuntu-latest" >> ./.github/workflows/deploy.yml
echo "    steps:" >> ./.github/workflows/deploy.yml
echo "      - name: Checkout code" >> ./.github/workflows/deploy.yml
echo "        uses: actions/checkout@v4" >> ./.github/workflows/deploy.yml
echo "        with:" >> ./.github/workflows/deploy.yml
echo "          fetch-depth: 0" >> ./.github/workflows/deploy.yml
echo "" >> ./.github/workflows/deploy.yml
echo "      - name: Push to dokku" >> ./.github/workflows/deploy.yml
echo "        uses: dokku/github-action@master" >> ./.github/workflows/deploy.yml
echo "        with:" >> ./.github/workflows/deploy.yml
echo "          git_remote_url: 'ssh://dokku@{$PMF_DOKKU_HOST}:22/${APP_NAME}'" >> ./.github/workflows/deploy.yml
echo "          ssh-private-key: \${{ secrets.SSH_PRIVATE_SANDBOX_DOKKU_JK }}" >> ./.github/workflows/deploy.yml
echo "          branch: main" >> ./.github/workflows/deploy.yml

# Create dev workflow file for Dokku deployment
touch ./.github/workflows/deploy-dev.yml
echo "---" >> ./.github/workflows/deploy-dev.yml
echo "name: Deploy to Dokku" >> ./.github/workflows/deploy-dev.yml
echo "on:" >> ./.github/workflows/deploy-dev.yml
echo "  push:" >> ./.github/workflows/deploy-dev.yml
echo "    branches:" >> ./.github/workflows/deploy-dev.yml
echo "      - main" >> ./.github/workflows/deploy-dev.yml
echo "jobs:" >> ./.github/workflows/deploy-dev.yml
echo "  deploy:" >> ./.github/workflows/deploy-dev.yml
echo "    runs-on: ubuntu-latest" >> ./.github/workflows/deploy-dev.yml
echo "    steps:" >> ./.github/workflows/deploy-dev.yml
echo "      - name: Checkout code" >> ./.github/workflows/deploy-dev.yml
echo "        uses: actions/checkout@v4" >> ./.github/workflows/deploy-dev.yml
echo "        with:" >> ./.github/workflows/deploy-dev.yml
echo "          fetch-depth: 0" >> ./.github/workflows/deploy-dev.yml
echo "" >> ./.github/workflows/deploy-dev.yml
echo "      - name: Push to dokku" >> ./.github/workflows/deploy-dev.yml
echo "        uses: dokku/github-action@master" >> ./.github/workflows/deploy-dev.yml
echo "        with:" >> ./.github/workflows/deploy-dev.yml
echo "          git_remote_url: 'ssh://dokku@{$PMF_DOKKU_HOST}:22/${APP_NAME}-dev'" >> ./.github/workflows/deploy-dev.yml
echo "          ssh-private-key: \${{ secrets.SSH_PRIVATE_SANDBOX_DOKKU_JK }}" >> ./.github/workflows/deploy-dev.yml
echo "          branch: dev" >> ./.github/workflows/deploy-dev.yml