#!/bin/bash
# UAE7Guard - Railway Environment Variables Validator
# Run this script to check if all required variables are set

echo "🔍 UAE7Guard Railway Environment Validator"
echo "==========================================="
echo ""

ERRORS=0
WARNINGS=0

# Function to check required variable
check_required() {
    local var_name=$1
    local var_value=$(printenv "$var_name")
    if [ -z "$var_value" ]; then
        echo "❌ MISSING: $var_name (REQUIRED)"
        ((ERRORS++))
    else
        echo "✅ $var_name is set"
    fi
}

# Function to check optional variable
check_optional() {
    local var_name=$1
    local var_value=$(printenv "$var_name")
    if [ -z "$var_value" ]; then
        echo "⚠️  MISSING: $var_name (optional)"
        ((WARNINGS++))
    else
        echo "✅ $var_name is set"
    fi
}

echo "📌 REQUIRED - Core Configuration"
echo "---------------------------------"
check_required "NODE_ENV"
check_required "DATABASE_URL"
check_required "SESSION_SECRET"
echo ""

echo "📌 REQUIRED - Firebase Authentication"
echo "--------------------------------------"
check_required "VITE_FIREBASE_API_KEY"
check_required "VITE_FIREBASE_AUTH_DOMAIN"
check_required "VITE_FIREBASE_PROJECT_ID"
check_required "VITE_FIREBASE_STORAGE_BUCKET"
check_required "VITE_FIREBASE_MESSAGING_SENDER_ID"
check_required "VITE_FIREBASE_APP_ID"
echo ""

echo "📌 REQUIRED - Apple Review Account"
echo "-----------------------------------"
check_required "APPLE_REVIEW_PASSWORD"
echo ""

echo "📌 OPTIONAL - Blockchain (Alchemy)"
echo "-----------------------------------"
check_optional "ALCHEMY_API_KEY"
echo ""

echo "📌 OPTIONAL - AI Features (OpenAI)"
echo "-----------------------------------"
check_optional "OPENAI_API_KEY"
echo ""

echo "📌 OPTIONAL - Email Service (SendGrid)"
echo "---------------------------------------"
check_optional "SENDGRID_API_KEY"
echo ""

echo "📌 OPTIONAL - Payments (Stripe)"
echo "--------------------------------"
check_optional "STRIPE_SECRET_KEY"
check_optional "STRIPE_PUBLISHABLE_KEY"
echo ""

echo "==========================================="
if [ $ERRORS -gt 0 ]; then
    echo "❌ FAILED: $ERRORS required variable(s) missing"
    echo "   Fix these before deploying!"
    exit 1
else
    echo "✅ All required variables are set!"
    if [ $WARNINGS -gt 0 ]; then
        echo "⚠️  $WARNINGS optional variable(s) missing"
        echo "   Some features may be disabled"
    fi
    exit 0
fi
