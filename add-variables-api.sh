#!/bin/bash
# Add UAE7Guard Variables via Railway API

RAILWAY_TOKEN="fcbbff2d-f365-4126-a400-d9b2b2ede1d0"
PROJECT_ID="YOUR_PROJECT_ID"  # Need to get this

echo "🚂 Adding variables to Railway via API..."
echo ""

# Get project ID first
echo "📋 Getting projects..."
curl -s https://backboard.railway.app/graphql/v2 \
  -H "Authorization: Bearer $RAILWAY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { projects { edges { node { id name } } } }"
  }' | jq .

echo ""
echo "⚠️ Need to get PROJECT_ID from above output"
echo "Run this script with project ID as argument"
