#!/bin/sh
set -e

echo "📦 Installing dependencies..."
npm install

echo "🔧 Building application..."
npm run build

echo "✅ Build complete!"
