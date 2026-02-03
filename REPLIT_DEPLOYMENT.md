# Replit Deployment Guide for UAE7Guard

## Current Status

✅ **Application Built Successfully**
- Production build completed
- Server running on port 5000
- Database connected and seeded
- All APIs tested and working

❌ **Public URL Issue**
- Replit public URL returns 403 "host_not_allowed" error
- This indicates deployment configuration is needed

## Local Testing

The application is working perfectly in local development:

```bash
# Start PostgreSQL (if not running)
sudo service postgresql start

# Run in development mode
npm run dev

# Or run in production mode
npm start
```

Server will be available at: http://localhost:5000

## Replit Deployment Setup

To make the app accessible via the public Replit URL, follow these steps:

### 1. Configure Replit Secrets

In the Replit web interface, add the following secrets:

1. Click on "Secrets" (lock icon) in the left sidebar
2. Add these environment variables:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/uae7guard
SESSION_SECRET=uae7guard-dev-secret-key-change-in-production
ADMIN_PASSWORD=Mo@9080280$6220505
PORT=5000
```

**Optional Secrets** (for additional features):
```
OPENAI_API_KEY=your_openai_api_key
SENDGRID_API_KEY=your_sendgrid_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
ALCHEMY_API_KEY=your_alchemy_api_key
```

### 2. Start PostgreSQL Service

Before running the app, make sure PostgreSQL is running:

```bash
# Start PostgreSQL
sudo service postgresql start

# Set postgres user password
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# Create database if not exists
PGPASSWORD=postgres psql -U postgres -h localhost -c "CREATE DATABASE uae7guard;" || true

# Push database schema
npm run db:push
```

### 3. Build and Deploy

The `.replit` file is already configured for deployment:

```toml
[deployment]
deploymentTarget = "autoscale"
run = ["node", "./dist/index.cjs"]
build = ["npm", "run", "build"]
```

To deploy:

1. Click the "Run" button in Replit to start the development server
2. Or use the Replit deployment feature for production deployment

### 4. Access the Application

Once deployed, the app will be available at:
- Your Replit URL (e.g., https://your-repl-name.username.repl.co)
- The URL shown in the Replit webview

## Troubleshooting

### 403 "host_not_allowed" Error

This error occurs when:
1. Environment variables are not set in Replit Secrets
2. The deployment is not properly configured
3. PostgreSQL is not running

**Solution:**
1. Set all required secrets in Replit Secrets (not just .env file)
2. Start PostgreSQL service
3. Click the "Run" button to start the app

### Database Connection Refused

If you see "ECONNREFUSED 127.0.0.1:5432":

```bash
# Start PostgreSQL
sudo service postgresql start

# Verify it's running
PGPASSWORD=postgres psql -U postgres -h localhost -c "SELECT version();"
```

### Admin Password Not Working

The admin password is: `Mo@9080280$6220505`

Make sure:
1. The password is set in Replit Secrets
2. Special characters ($, @) are not escaped
3. Use the exact password as shown above

## Admin Login

1. Navigate to `/admin` page
2. Enter password: `Mo@9080280$6220505`
3. Click "Access Control Panel"

## API Testing

Test if the server is working:

```bash
# Test homepage
curl http://localhost:5000

# Test admin authentication
curl -X POST http://localhost:5000/api/admin/authenticate \
  -H "Content-Type: application/json" \
  -d '{"password":"Mo@9080280$6220505"}'

# Expected response:
# {"success":true,"message":"Admin access granted","timestamp":"..."}
```

## Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://postgres:postgres@localhost:5432/uae7guard |
| SESSION_SECRET | Session encryption key | uae7guard-dev-secret-key-change-in-production |
| ADMIN_PASSWORD | Admin panel password | Mo@9080280$6220505 |
| PORT | Server port (default: 5000) | 5000 |

Optional environment variables:

| Variable | Description | Required For |
|----------|-------------|--------------|
| OPENAI_API_KEY | OpenAI API key | AI prediction features |
| SENDGRID_API_KEY | SendGrid API key | Email notifications |
| STRIPE_SECRET_KEY | Stripe secret key | Payment processing |
| ALCHEMY_API_KEY | Alchemy API key | Blockchain features |

## Features

The UAE7Guard application includes:

- **Verification Tools**
  - Due Diligence Scanner
  - AI Fraud Prediction
  - Hybrid Verification
  - Double-Lock Sovereign Verification

- **Protection Services**
  - Live Transaction Monitoring
  - Escrow Services
  - Slippage Protection

- **Analytics & Reports**
  - Threat Intelligence Reports
  - Analytics Dashboard
  - Data Export

- **Admin Panel**
  - Threat Report Management
  - User Management
  - System Statistics

## Support

For issues or questions:
- Email: admin@uae7guard.com
- GitHub: https://github.com/M6220505/UAE7Guard

---

Last updated: 2026-01-22
