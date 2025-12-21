#!/bin/bash
# This script creates the .env file for the API

cat > .env << 'ENVEOF'
DATABASE_URL="postgresql://odil:odil@localhost:5432/jahongir_travel_dev"
JWT_SECRET="dev-secret-key-change-in-production-$(date +%s)"
NODE_ENV="development"
PORT=4000

# Redis (optional - not installed yet)
# REDIS_URL="redis://localhost:6379"
ENVEOF

echo "✅ .env file created successfully!"
