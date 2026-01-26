#!/usr/bin/env tsx
/**
 * Environment Configuration Checker
 * Validates that all required environment variables are set correctly
 */

import { config } from 'dotenv';
config();

interface ConfigCheck {
  name: string;
  value: string | undefined;
  required: boolean;
  valid: boolean;
  issue?: string;
}

const checks: ConfigCheck[] = [];

function checkEnvVar(
  name: string,
  required: boolean = true,
  validator?: (value: string) => { valid: boolean; issue?: string }
): void {
  const value = process.env[name];
  let valid = !!value;
  let issue: string | undefined;

  if (!value && required) {
    valid = false;
    issue = `${name} is not set`;
  } else if (value && validator) {
    const result = validator(value);
    valid = result.valid;
    issue = result.issue;
  }

  checks.push({ name, value, required, valid, issue });
}

// Check DATABASE_URL
checkEnvVar('DATABASE_URL', true, (value) => {
  if (value.includes('localhost')) {
    return {
      valid: false,
      issue: '🚨 DATABASE_URL points to localhost! This will fail in production. Please use Supabase URL.',
    };
  }
  if (!value.startsWith('postgresql://')) {
    return {
      valid: false,
      issue: 'DATABASE_URL must start with postgresql://',
    };
  }
  return { valid: true };
});

// Check SESSION_SECRET
checkEnvVar('SESSION_SECRET', true, (value) => {
  if (value === 'uae7guard-dev-secret-key-change-in-production') {
    return {
      valid: false,
      issue: '⚠️  Using default SESSION_SECRET. Generate a secure one: openssl rand -base64 32',
    };
  }
  if (value.length < 32) {
    return {
      valid: false,
      issue: 'SESSION_SECRET should be at least 32 characters long',
    };
  }
  return { valid: true };
});

// Check APPLE_REVIEW_PASSWORD
checkEnvVar('APPLE_REVIEW_PASSWORD', true);

// Optional but recommended
checkEnvVar('ALCHEMY_API_KEY', false);
checkEnvVar('AI_INTEGRATIONS_OPENAI_API_KEY', false);
checkEnvVar('SENDGRID_API_KEY', false);
checkEnvVar('STRIPE_SECRET_KEY', false);

console.log('\n🔍 Environment Configuration Check\n');
console.log('═'.repeat(80));

let hasErrors = false;
let hasWarnings = false;

for (const check of checks) {
  const status = check.valid ? '✅' : check.required ? '❌' : '⚠️ ';
  const displayValue = check.value
    ? check.value.substring(0, 20) + (check.value.length > 20 ? '...' : '')
    : 'NOT SET';

  console.log(`${status} ${check.name.padEnd(35)} ${displayValue}`);

  if (check.issue) {
    console.log(`   └─ ${check.issue}`);
  }

  if (!check.valid) {
    if (check.required) {
      hasErrors = true;
    } else {
      hasWarnings = true;
    }
  }
}

console.log('═'.repeat(80));

if (hasErrors) {
  console.log('\n❌ Configuration has ERRORS. Please fix the issues above.\n');
  console.log('📖 Quick Fix Guide:\n');
  console.log('1. Get your Supabase DATABASE_URL:');
  console.log('   - Go to https://supabase.com/dashboard');
  console.log('   - Select your project → Settings → Database');
  console.log('   - Copy the "Connection string" (URI format)');
  console.log('');
  console.log('2. Generate SESSION_SECRET:');
  console.log('   - Run: openssl rand -base64 32');
  console.log('');
  console.log('3. Update Vercel Environment Variables:');
  console.log('   - Go to https://vercel.com/dashboard');
  console.log('   - Select UAE7Guard project → Settings → Environment Variables');
  console.log('   - Update DATABASE_URL and SESSION_SECRET');
  console.log('   - Redeploy: Deployments → click "..." → Redeploy');
  console.log('');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  Configuration is OK but some optional features are not configured.\n');
  process.exit(0);
} else {
  console.log('\n✅ All configuration checks passed!\n');
  process.exit(0);
}
