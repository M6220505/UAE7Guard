# 📊 UAE7Guard - Analytics & Monitoring Setup

## Overview

Track user behavior, performance, and system health across UAE7Guard platform.

---

## 1. Google Analytics 4 (GA4)

### Setup

1. Go to: https://analytics.google.com
2. Create Property: "UAE7Guard"
3. Select "Web" data stream
4. Copy **Measurement ID** (G-XXXXXXXXXX)

### Integration

Add to `/root/UAE7Guard/client/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Track Custom Events

```typescript
// Track wallet check
gtag('event', 'wallet_check', {
  'address': '0x123...',
  'network': 'ethereum',
  'result': 'safe'
});

// Track subscription
gtag('event', 'purchase', {
  'transaction_id': 'txn_123',
  'value': 29.99,
  'currency': 'USD',
  'items': [{
    'item_name': 'Pro Plan',
    'item_category': 'subscription'
  }]
});
```

---

## 2. Plausible Analytics (Privacy-Friendly Alternative)

**Cost:** $9/month (100K pageviews)

**Benefits:**
- GDPR compliant
- No cookies
- Lightweight (<1KB)
- Simple dashboard

### Setup

1. Sign up: https://plausible.io
2. Add domain: uae7guard.com
3. Copy snippet

```html
<script defer data-domain="uae7guard.com" src="https://plausible.io/js/script.js"></script>
```

---

## 3. PostHog (Product Analytics)

**Cost:** FREE (1M events/month)

**Features:**
- Session recordings
- Heatmaps
- Feature flags
- A/B testing

### Setup

```typescript
// Install
npm install posthog-js

// Initialize
import posthog from 'posthog-js'

posthog.init('YOUR_API_KEY', {
  api_host: 'https://app.posthog.com'
})

// Track events
posthog.capture('wallet_checked', {
  network: 'ethereum',
  result: 'scam_detected'
})
```

---

## 4. Sentry (Error Tracking)

**Cost:** FREE (5K errors/month)

### Setup

```bash
npm install @sentry/react @sentry/tracing
```

```typescript
// client/src/main.tsx
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});
```

### Error Boundaries

```typescript
<Sentry.ErrorBoundary fallback={<ErrorFallback />}>
  <App />
</Sentry.ErrorBoundary>
```

---

## 5. Uptime Monitoring

### Option A: UptimeRobot (FREE)

- https://uptimerobot.com
- Monitor 50 URLs for free
- 5-minute check intervals
- Email/SMS alerts

**Setup:**
1. Create account
2. Add monitor: https://uae7guard.com/api/health
3. Alert settings: Email
4. Done!

### Option B: Better Stack (Paid)

**Cost:** $18/month

**Features:**
- 1-minute intervals
- Status page
- Incident management
- Multiple regions

---

## 6. Railway Monitoring (Built-in)

Railway provides:
- CPU/Memory usage
- Request logs
- Deployment history
- Health checks

**Access:**
1. Railway dashboard
2. Select project
3. Metrics tab

---

## 7. Custom Monitoring Dashboard

Create admin dashboard showing:

```typescript
// server/routes.ts
app.get("/api/admin/metrics", isAdmin, async (req, res) => {
  const metrics = {
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    requests: {
      total: requestCounter,
      perSecond: Math.round(requestCounter / process.uptime())
    },
    users: {
      active: activeUsers,
      total: totalUsers
    },
    revenue: {
      today: todayRevenue,
      thisMonth: monthRevenue,
      mrr: calculateMRR()
    }
  };
  
  res.json(metrics);
});
```

---

## 8. Logging Strategy

### Winston Logger

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Usage
logger.info('Wallet checked', { address: '0x123', result: 'safe' });
logger.error('Database connection failed', { error: err.message });
```

---

## 9. Key Metrics to Track

### Business Metrics
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Conversion rate (signup → paid)
- Churn rate
- MRR growth
- Customer Acquisition Cost (CAC)

### Product Metrics
- Wallet checks per day
- AI analysis usage
- Scams detected
- False positive rate
- Average response time

### Technical Metrics
- API response time (p50, p95, p99)
- Error rate
- Uptime percentage
- Database query time
- Cache hit rate

---

## 10. Alerts Setup

### Critical Alerts (Immediate)
- API downtime >1 minute
- Error rate >5%
- Payment failures
- Security breaches

### Warning Alerts (30 minutes)
- High memory usage (>80%)
- Slow response times (>2s)
- Database connection issues

### Info Alerts (Daily digest)
- New signups
- Revenue updates
- Usage statistics

---

## Implementation Checklist

- [ ] Google Analytics installed
- [ ] Sentry error tracking enabled
- [ ] UptimeRobot monitoring setup
- [ ] Railway metrics configured
- [ ] Custom admin dashboard created
- [ ] Logging system implemented
- [ ] Alert rules configured
- [ ] Weekly reports scheduled

---

## Recommended Stack (Budget-Friendly)

**FREE Tier:**
- Google Analytics (free)
- Sentry (5K errors/month)
- UptimeRobot (50 monitors)
- Railway built-in metrics

**Total Cost:** $0/month

**Paid Tier (Optional):**
- Plausible Analytics: $9/month
- Better Stack: $18/month
- PostHog: $20/month

**Total Cost:** $47/month

---

## Quick Start (5 minutes)

1. **Google Analytics:**
   ```bash
   # Get measurement ID from analytics.google.com
   # Add to index.html
   ```

2. **Sentry:**
   ```bash
   npm install @sentry/react
   # Add to main.tsx with your DSN
   ```

3. **UptimeRobot:**
   ```
   # Create account
   # Add monitor: uae7guard.com/api/health
   ```

4. **Test:**
   ```bash
   # Trigger error
   curl https://uae7guard.com/api/nonexistent
   
   # Check Sentry dashboard
   ```

---

## Status Page

Create public status page showing:
- ✅ All systems operational
- 99.8% uptime (last 30 days)
- Latest incident: None
- Scheduled maintenance: None

**Options:**
- Statuspage.io (free for 1 page)
- Cachet (self-hosted, free)
- Custom page on uae7guard.com/status

---

## Privacy Compliance

**GDPR/PDPL Compliance:**
- Anonymize IP addresses
- Cookie consent banner
- Privacy policy updated
- Data retention policy (30 days)
- User data export/deletion

**Google Analytics:**
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true
});
```

---

## Next Steps

1. Setup Google Analytics (20 min)
2. Install Sentry (10 min)
3. Configure UptimeRobot (5 min)
4. Create admin dashboard (2 hours)
5. Test all tracking (30 min)

**Total Time:** ~3 hours
