#!/bin/bash

# Initializes SSH key for the application

ENV_FILE=".env"
export $(cat $ENV_FILE | grep -v '^#' | xargs)

echo "Initializing SSH key..."

# Check if SSH keys already exist
if [ -f "$HOME/.ssh/id_ed25519" ]; then
    echo "SSH key already exists."
else
    # Generate new SSH keys
    read -p "Enter your Github-associated email for SSH key generation: " user_email
    ssh-keygen -t ed25519 -C "$user_email" -f "$HOME/.ssh/id_ed25519" -N ""
    echo "New SSH key generated."
fi

# Display the public key
echo "Your public SSH key is:"
cat "$HOME/.ssh/id_ed25519.pub"

# Send instructions to add the SSH key to Github
echo "Send the above public key to PMF Builder admin then press any key to continue..."
read -n 1 -s

# Validate SSH access
echo "Validating SSH access..."
ssh dokku@$PMF_DOKKU_HOST apps:list 

echo "SSH key initialized successfully!"