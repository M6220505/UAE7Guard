#!/bin/bash

echo "🚀 Starting UAE7Guard on Replit..."
echo ""

# Check if PostgreSQL is running
if ! PGPASSWORD=postgres psql -U postgres -h localhost -p 5432 -c "SELECT 1" > /dev/null 2>&1; then
    echo "📦 Starting PostgreSQL..."
    sudo service postgresql start
    sleep 2

    # Set postgres password
    echo "🔑 Setting PostgreSQL password..."
    sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';" > /dev/null 2>&1

    # Create database if not exists
    echo "🗄️  Creating database..."
    PGPASSWORD=postgres psql -U postgres -h localhost -c "CREATE DATABASE uae7guard;" > /dev/null 2>&1 || echo "Database already exists"

    # Push schema
    echo "📋 Pushing database schema..."
    npm run db:push
else
    echo "✅ PostgreSQL is already running"
fi

echo ""
echo "🔧 Environment Status:"
echo "  DATABASE_URL: ${DATABASE_URL:-❌ Not set (using .env)}"
echo "  SESSION_SECRET: ${SESSION_SECRET:-❌ Not set (using .env)}"
echo "  ADMIN_PASSWORD: ${ADMIN_PASSWORD:-❌ Not set (using .env)}"
echo "  PORT: ${PORT:-5000}"
echo ""

# Check if we should run dev or production
if [ "$1" = "prod" ]; then
    echo "🏭 Starting production server..."
    npm start
else
    echo "🔨 Starting development server..."
    npm run dev
fi
