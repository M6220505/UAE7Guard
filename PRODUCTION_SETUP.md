# UAE7Guard Production Setup Guide

## Features Implemented

| Feature | Status | File Location |
|---------|--------|---------------|
| Security Headers | Done | `lib/security.ts` |
| Rate Limiting | Done | `lib/rateLimit.ts` |
| Logging System | Done | `lib/logger.ts` |
| Health Checks | Done | `lib/healthCheck.ts` |
| Caching | Done | `lib/cache.ts` |
| Monitoring | Done | `lib/monitoring.ts` |
| Authentication | Done | `lib/auth.ts` |
| Middleware | Done | `middleware.ts` |
| Docker Support | Done | `Dockerfile`, `docker-compose.yml` |
| CI/CD Pipeline | Done | `.github/workflows/ci.yml` |
| Database Backup | Done | `scripts/backup.sh` |

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Production with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
- `AUTH_SECRET`: Secret key for session encryption (generate with `openssl rand -base64 32`)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

## API Endpoints

### Health Checks

- `GET /api/health` - Full system health
- `GET /api/health?type=live` - Liveness probe (Kubernetes)
- `GET /api/health?type=ready` - Readiness probe (Kubernetes)

### Authentication

- `POST /api/auth/login` - Login (email, password)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Metrics (Admin only)

- `GET /api/metrics` - System metrics and statistics

## Demo Credentials

- Email: `demo@example.com`
- Password: `admin`

## Security Features

### Headers Applied
- Strict-Transport-Security (HSTS)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Content-Security-Policy
- Referrer-Policy
- Permissions-Policy

### Rate Limiting
- API routes: 100 requests/minute
- Auth routes: 10 requests/minute

## Deployment to Vercel

1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy

Or use the CLI:

```bash
npx vercel --prod
```

## CI/CD Pipeline

The GitHub Actions workflow includes:
- Linting and type checking
- Build verification
- Security audit
- Docker image build
- Automatic deployment to Vercel

## Backup Strategy

Run the backup script:

```bash
chmod +x scripts/backup.sh
./scripts/backup.sh
```

Configure with environment variables:
- `BACKUP_DIR`: Backup destination (default: `./backups`)
- `RETENTION_DAYS`: Days to keep backups (default: 7)
- `DATABASE_URL`: Database connection string

## Monitoring

Access metrics at `/api/metrics` (requires admin authentication).

Metrics include:
- HTTP request counts and latencies
- Error tracking
- Cache hit rates
- Memory usage
