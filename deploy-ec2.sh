#!/bin/bash
set -e

# Load environment variables
source .env

# Configure AWS CLI (using environment variables from GitHub Secrets)
export AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}"
export AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}"
export AWS_DEFAULT_REGION="${AWS_REGION:-us-east-1}"

# Login to ECR
echo "Logging into ECR..."
aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# Pull latest images
echo "Pulling latest images from ECR..."
docker pull ${ECR_REGISTRY}/${ECR_REPOSITORY_BACKEND}:latest
docker pull ${ECR_REGISTRY}/${ECR_REPOSITORY_FRONTEND}:latest

# Stop and remove old containers
echo "Stopping old containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml down || true

# Start new containers
echo "Starting new containers..."
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Clean up old images
echo "Cleaning up old images..."
docker image prune -af || true

# Show status
echo "Container status:"
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

echo "Deployment complete!"
