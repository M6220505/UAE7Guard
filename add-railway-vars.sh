#!/bin/bash
# Add UAE7Guard Email Variables to Railway
# Usage: ./add-railway-vars.sh YOUR_APP_PASSWORD

if [ -z "$1" ]; then
  echo "❌ Error: App Password required"
  echo "Usage: ./add-railway-vars.sh YOUR_APP_PASSWORD"
  echo ""
  echo "Get App Password from:"
  echo "https://myaccount.google.com/apppasswords"
  exit 1
fi

APP_PASSWORD="$1"

echo "🚂 Adding variables to Railway..."
echo ""

# Install Railway CLI if not installed
if ! command -v railway &> /dev/null; then
  echo "📦 Installing Railway CLI..."
  npm i -g @railway/cli
fi

# Login (will open browser)
echo "🔐 Login to Railway..."
railway login

# Link project (if not linked)
railway link

# Add variables
echo "✅ Adding email variables..."

railway variables set SMTP_HOST="smtp.gmail.com"
railway variables set SMTP_PORT="587"
railway variables set SMTP_SECURE="false"
railway variables set SMTP_USER="admin@uae7guard.com"
railway variables set SMTP_PASSWORD="$APP_PASSWORD"
railway variables set EMAIL_FROM="admin@uae7guard.com"
railway variables set EMAIL_SUPPORT="admin@uae7guard.com"
railway variables set EMAIL_ADMIN="admin@uae7guard.com"
railway variables set EMAIL_ENABLED="true"
railway variables set EMAIL_PROVIDER="gmail"

echo ""
echo "✅ Done! Variables added to Railway"
echo "⏳ Waiting for deployment..."
echo ""
echo "Test after 2-3 minutes:"
echo "curl -X POST https://uae7guard.com/api/test-email \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"to\":\"your@email.com\",\"type\":\"welcome\"}'"
