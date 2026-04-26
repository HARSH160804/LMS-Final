#!/bin/bash

# LMS Platform Deployment Script
# Usage: ./scripts/deploy.sh [environment]
# Example: ./scripts/deploy.sh production

set -e

ENVIRONMENT=${1:-development}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🚀 Deploying LMS Platform to $ENVIRONMENT environment..."

# Load environment variables
if [ -f "$PROJECT_ROOT/.env.$ENVIRONMENT" ]; then
    echo "📝 Loading environment variables from .env.$ENVIRONMENT"
    export $(cat "$PROJECT_ROOT/.env.$ENVIRONMENT" | grep -v '^#' | xargs)
elif [ -f "$PROJECT_ROOT/.env" ]; then
    echo "📝 Loading environment variables from .env"
    export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)
else
    echo "❌ No environment file found!"
    exit 1
fi

# Check required variables
REQUIRED_VARS=("MONGO_URI" "JWT_SECRET" "CLOUDINARY_CLOUD_NAME" "VITE_BACKEND_URL")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Required variable $var is not set!"
        exit 1
    fi
done

echo "✅ Environment variables validated"

# Build Docker images
echo "🔨 Building Docker images..."

cd "$PROJECT_ROOT"

# Build backend
echo "Building backend..."
docker build -t lms-backend:$ENVIRONMENT ./backend

# Build frontend
echo "Building frontend..."
docker build \
    --build-arg VITE_BACKEND_URL="$VITE_BACKEND_URL" \
    -t lms-frontend:$ENVIRONMENT \
    ./frontend

echo "✅ Docker images built successfully"

# Deploy with docker-compose
echo "🚢 Deploying containers..."

if [ "$ENVIRONMENT" = "production" ]; then
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
else
    docker-compose up -d
fi

echo "✅ Containers deployed"

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Health checks
echo "🏥 Running health checks..."

BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health || echo "000")
FRONTEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/health || echo "000")

if [ "$BACKEND_HEALTH" = "200" ]; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed (HTTP $BACKEND_HEALTH)"
    docker-compose logs backend
    exit 1
fi

if [ "$FRONTEND_HEALTH" = "200" ]; then
    echo "✅ Frontend is healthy"
else
    echo "❌ Frontend health check failed (HTTP $FRONTEND_HEALTH)"
    docker-compose logs frontend
    exit 1
fi

# Show running containers
echo "📊 Running containers:"
docker-compose ps

echo "✅ Deployment completed successfully!"
echo "🌐 Application is available at: http://localhost"
echo "📚 API documentation: http://localhost/api/health"
