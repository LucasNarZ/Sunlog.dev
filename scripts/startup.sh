#!/bin/bash

set -e

# Update system
sudo apt update -y
sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -oP '"tag_name": "\K[^"]+')
sudo curl -L "https://github.com/docker/compose/releases/download/$${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Node.js (LTS) using n
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
sudo apt install -y nodejs

# Create SSH key
mkdir -p /home/ubuntu/.ssh
ssh-keygen -t ed25519 -f /home/ubuntu/.ssh/id_ed25519 -N "" -C "ec2-startup"

# Set permissions
chown -R ubuntu:ubuntu /home/ubuntu/.ssh
chmod 700 /home/ubuntu/.ssh
chmod 600 /home/ubuntu/.ssh/id_ed25519
chmod 644 /home/ubuntu/.ssh/id_ed25519.pub

# Print public key to the log
echo "Generated SSH public key:"
cat /home/ubuntu/.ssh/id_ed25519.pub
