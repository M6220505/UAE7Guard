/**
 * UAE7Guard - Centralized Configuration
 *
 * This file contains all application configuration settings loaded from
 * environment variables with validation and defaults.
 */

import 'dotenv/config';

// Helper function to get required environment variable
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.warn(`Warning: Required environment variable ${key} is not set`);
    return '';
  }
  return value;
}

// Helper function to get optional environment variable with default
function getOptionalEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue;
}

// Helper function to parse boolean environment variable
function getBooleanEnv(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

// Helper function to parse integer environment variable
function getIntEnv(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export const config = {
  // Environment
  env: getOptionalEnv('NODE_ENV', 'development'),
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // Server
  server: {
    port: getIntEnv('PORT', 5000),
    host: getOptionalEnv('HOST', '0.0.0.0'),
    url: getOptionalEnv('APP_URL', 'http://localhost:5000'),
    apiUrl: getOptionalEnv('API_URL', ''),
    requestTimeout: getIntEnv('REQUEST_TIMEOUT', 30000),
  },

  // Database
  database: {
    url: getOptionalEnv('DATABASE_URL', ''),
    pool: {
      min: getIntEnv('DB_POOL_MIN', 2),
      max: getIntEnv('DB_POOL_MAX', 10),
      idleTimeoutMs: getIntEnv('DB_IDLE_TIMEOUT_MS', 30000),
      connectionTimeoutMs: getIntEnv('DB_CONNECTION_TIMEOUT_MS', 5000),
    },
  },

  // Security
  security: {
    sessionSecret: getOptionalEnv('SESSION_SECRET', 'dev-secret-change-in-production-' + Math.random().toString(36)),
    sessionMaxAge: getIntEnv('SESSION_MAX_AGE', 86400000), // 24 hours
    sessionName: getOptionalEnv('SESSION_NAME', 'uae7guard.sid'),
    sessionSecure: getBooleanEnv('SESSION_SECURE', true),
    sessionSameSite: getOptionalEnv('SESSION_SAME_SITE', 'strict') as 'strict' | 'lax' | 'none',
    bcryptRounds: getIntEnv('BCRYPT_ROUNDS', 12),
    jwtSecret: getOptionalEnv('JWT_SECRET', ''),
    jwtExpiresIn: getOptionalEnv('JWT_EXPIRES_IN', '7d'),
    csrfSecret: getOptionalEnv('CSRF_SECRET', ''),
  },

  // Rate Limiting
  rateLimit: {
    windowMs: getIntEnv('RATE_LIMIT_WINDOW_MS', 900000), // 15 minutes
    maxRequests: getIntEnv('RATE_LIMIT_MAX_REQUESTS', 100),
    auth: {
      windowMs: getIntEnv('RATE_LIMIT_AUTH_WINDOW_MS', 900000),
      maxRequests: getIntEnv('RATE_LIMIT_AUTH_MAX', 5),
    },
  },

  // CORS
  cors: {
    allowedOrigins: getOptionalEnv('CORS_ALLOWED_ORIGINS',
      'https://uae7guard.com,capacitor://localhost,ionic://localhost,file://').split(','),
    credentials: getBooleanEnv('CORS_CREDENTIALS', true),
  },

  // Email (SendGrid)
  email: {
    apiKey: getOptionalEnv('SENDGRID_API_KEY', ''),
    fromEmail: getOptionalEnv('SENDGRID_FROM_EMAIL', 'noreply@uae7guard.com'),
    fromName: getOptionalEnv('SENDGRID_FROM_NAME', 'UAE7Guard'),
    templates: {
      welcome: getOptionalEnv('SENDGRID_WELCOME_TEMPLATE_ID', ''),
      resetPassword: getOptionalEnv('SENDGRID_RESET_PASSWORD_TEMPLATE_ID', ''),
      alert: getOptionalEnv('SENDGRID_ALERT_TEMPLATE_ID', ''),
    },
  },

  // Payment (Stripe)
  stripe: {
    secretKey: getOptionalEnv('STRIPE_SECRET_KEY', ''),
    publishableKey: getOptionalEnv('STRIPE_PUBLISHABLE_KEY', ''),
    webhookSecret: getOptionalEnv('STRIPE_WEBHOOK_SECRET', ''),
    products: {
      basic: getOptionalEnv('STRIPE_PRODUCT_BASIC_ID', ''),
      premium: getOptionalEnv('STRIPE_PRODUCT_PREMIUM_ID', ''),
      enterprise: getOptionalEnv('STRIPE_PRODUCT_ENTERPRISE_ID', ''),
    },
  },

  // Blockchain (Alchemy)
  blockchain: {
    alchemyApiKey: getOptionalEnv('ALCHEMY_API_KEY', ''),
    alchemyNetwork: getOptionalEnv('ALCHEMY_NETWORK', 'mainnet'),
  },

  // AI (OpenAI)
  ai: {
    apiKey: getOptionalEnv('OPENAI_API_KEY', ''),
    model: getOptionalEnv('OPENAI_MODEL', 'gpt-4-turbo-preview'),
    maxTokens: getIntEnv('OPENAI_MAX_TOKENS', 2000),
    temperature: parseFloat(getOptionalEnv('OPENAI_TEMPERATURE', '0.7')),
  },

  // File Storage
  storage: {
    uploadDir: getOptionalEnv('UPLOAD_DIR', './uploads'),
    maxFileSize: getIntEnv('MAX_FILE_SIZE', 10485760), // 10MB
    provider: getOptionalEnv('STORAGE_PROVIDER', 'local'),
    aws: {
      accessKeyId: getOptionalEnv('AWS_ACCESS_KEY_ID', ''),
      secretAccessKey: getOptionalEnv('AWS_SECRET_ACCESS_KEY', ''),
      region: getOptionalEnv('AWS_REGION', 'us-east-1'),
      bucket: getOptionalEnv('AWS_S3_BUCKET', ''),
    },
  },

  // Logging
  logging: {
    level: getOptionalEnv('LOG_LEVEL', 'info'),
    format: getOptionalEnv('LOG_FORMAT', 'json'),
    logRequests: getBooleanEnv('LOG_REQUESTS', true),
  },

  // Monitoring
  monitoring: {
    sentryDsn: getOptionalEnv('SENTRY_DSN', ''),
    sentryEnvironment: getOptionalEnv('SENTRY_ENVIRONMENT', 'production'),
    sentryTracesSampleRate: parseFloat(getOptionalEnv('SENTRY_TRACES_SAMPLE_RATE', '0.1')),
    newRelicLicenseKey: getOptionalEnv('NEW_RELIC_LICENSE_KEY', ''),
    newRelicAppName: getOptionalEnv('NEW_RELIC_APP_NAME', 'UAE7Guard'),
  },

  // Redis (for caching and sessions)
  redis: {
    url: getOptionalEnv('REDIS_URL', ''),
    password: getOptionalEnv('REDIS_PASSWORD', ''),
    tls: getBooleanEnv('REDIS_TLS', false),
  },

  // Cache
  cache: {
    ttl: getIntEnv('CACHE_TTL', 3600), // 1 hour in seconds
  },

  // Feature Flags
  features: {
    registration: getBooleanEnv('ENABLE_REGISTRATION', true),
    emailVerification: getBooleanEnv('ENABLE_EMAIL_VERIFICATION', true),
    twoFactorAuth: getBooleanEnv('ENABLE_TWO_FACTOR_AUTH', false),
    blockchain: getBooleanEnv('ENABLE_BLOCKCHAIN_FEATURES', true),
    ai: getBooleanEnv('ENABLE_AI_FEATURES', true),
    payment: getBooleanEnv('ENABLE_PAYMENT_FEATURES', true),
  },

  // Maintenance
  maintenance: {
    enabled: getBooleanEnv('MAINTENANCE_MODE', false),
    message: getOptionalEnv('MAINTENANCE_MESSAGE', 'We are currently performing scheduled maintenance.'),
  },

  // Mobile App
  mobile: {
    capacitorServerUrl: getOptionalEnv('CAPACITOR_SERVER_URL', ''),
    androidPackage: getOptionalEnv('CAPACITOR_ANDROID_PACKAGE', 'com.uae7guard.app'),
    iosBundle: getOptionalEnv('CAPACITOR_IOS_BUNDLE', 'com.uae7guard.app'),
    fcmServerKey: getOptionalEnv('FCM_SERVER_KEY', ''),
    fcmSenderId: getOptionalEnv('FCM_SENDER_ID', ''),
    forceUpdateVersion: getOptionalEnv('FORCE_UPDATE_VERSION', '1.0.0'),
    recommendedUpdateVersion: getOptionalEnv('RECOMMENDED_UPDATE_VERSION', '1.0.0'),
  },

  // Performance
  performance: {
    enableCompression: getBooleanEnv('ENABLE_COMPRESSION', true),
    enableHttp2: getBooleanEnv('ENABLE_HTTP2', false),
    jsonLimit: getOptionalEnv('JSON_LIMIT', '10mb'),
    urlEncodedLimit: getOptionalEnv('URL_ENCODED_LIMIT', '10mb'),
  },

  // Compliance
  compliance: {
    dataRetentionDays: getIntEnv('DATA_RETENTION_DAYS', 365),
    gdprCompliance: getBooleanEnv('GDPR_COMPLIANCE', true),
    tosVersion: getOptionalEnv('TOS_VERSION', '1.0'),
    privacyPolicyVersion: getOptionalEnv('PRIVACY_POLICY_VERSION', '1.0'),
  },

  // Development
  development: {
    mockPaymentProvider: getBooleanEnv('MOCK_PAYMENT_PROVIDER', false),
    mockEmailProvider: getBooleanEnv('MOCK_EMAIL_PROVIDER', false),
    mockSmsProvider: getBooleanEnv('MOCK_SMS_PROVIDER', false),
    seedDatabase: getBooleanEnv('SEED_DATABASE', false),
    debug: getBooleanEnv('DEBUG', false),
  },
} as const;

// Validate required configuration in production
export function validateConfig() {
  if (!config.isProduction) {
    console.log('Running in development mode - skipping strict config validation');
    return;
  }

  const errors: string[] = [];

  // Required in production
  if (!config.database.url) {
    errors.push('DATABASE_URL is required in production');
  }

  if (!config.security.sessionSecret || config.security.sessionSecret.includes('change-this')) {
    errors.push('SESSION_SECRET must be set to a secure random value in production');
  }

  if (config.security.sessionSecret.length < 32) {
    errors.push('SESSION_SECRET must be at least 32 characters long');
  }

  // Warnings for optional but recommended settings
  if (!config.email.apiKey && config.features.emailVerification) {
    console.warn('Warning: SENDGRID_API_KEY is not set - email features will not work');
  }

  if (!config.monitoring.sentryDsn) {
    console.warn('Warning: SENTRY_DSN is not set - error tracking will not work');
  }

  if (errors.length > 0) {
    console.error('Configuration validation failed:');
    errors.forEach(error => console.error(`  - ${error}`));
    throw new Error('Invalid production configuration');
  }

  console.log('✓ Production configuration validated successfully');
}

// Export for convenience
export default config;
