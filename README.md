# UAE7Guard

A comprehensive blockchain security platform designed to protect users in the UAE from cryptocurrency scams and fraud.

## Features

- 🛡️ **Scam Address Detection** - Check blockchain addresses against known scam databases
- 📊 **Real-time Wallet Monitoring** - Track transactions and receive instant alerts
- 🤖 **AI-Powered Risk Analysis** - Advanced machine learning for fraud detection
- 💰 **Multi-Chain Support** - Ethereum, Polygon, Arbitrum, Optimism, Base, and Bitcoin
- 🔒 **Secure Escrow** - Smart lock transactions for safe P2P trading
- 📱 **Mobile Apps** - Native iOS and Android applications
- 🇦🇪 **UAE-Localized** - AED currency support and Arabic language

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/UAE7Guard.git
cd UAE7Guard
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Required environment variables:
```bash
# Database (Supabase or PostgreSQL)
DATABASE_URL=your_database_connection_string

# Session Secret
SESSION_SECRET=your_random_secret_key

# Blockchain APIs
ALCHEMY_API_KEY=your_alchemy_api_key

# AI Integration
AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@uae7guard.com

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 3. Database Setup

**Automated Setup (Recommended):**

```bash
npm run db:setup
```

This will create all tables, indexes, and demo data automatically.

For detailed instructions and options, see [DATABASE_SETUP.md](./DATABASE_SETUP.md)

### 4. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:5000

### 5. Login with Demo Account

```
Email: admin@uae7guard.com
Password: admin123456
```

## Project Structure

```
UAE7Guard/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and helpers
├── server/              # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── db.ts            # Database connection
│   ├── seed.ts          # Database seeding
│   ├── alchemy.ts       # Blockchain integration
│   ├── risk-engine.ts   # Risk calculation logic
│   └── middleware/      # Express middleware
├── shared/              # Shared code (frontend + backend)
│   ├── schema.ts        # Drizzle ORM schema
│   └── models/          # Shared type definitions
├── scripts/             # Utility scripts
│   ├── setup-database.ts    # Database setup automation
│   ├── backup-database.sh   # Backup utility
│   └── restore-database.sh  # Restore utility
├── ios/                 # iOS Capacitor app
├── android/             # Android Capacitor app
└── public/              # Static assets
```

## Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
```

### Database
```bash
npm run db:setup         # Setup database (tables + demo data)
npm run db:setup:force   # Reset database (⚠️ deletes all data)
npm run db:seed          # Seed demo data only
npm run db:push          # Push schema changes (Drizzle)
```

### Mobile Apps
```bash
npm run cap:sync         # Sync web code to mobile apps
npm run cap:sync:ios     # Sync to iOS only
npm run cap:sync:android # Sync to Android only
npm run cap:open:ios     # Open Xcode
npm run cap:open:android # Open Android Studio
```

## Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Wouter** - Routing
- **TanStack Query** - Data fetching
- **Framer Motion** - Animations
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Supabase Auth** - Authentication (client-side)

## Authentication Architecture

> **Important:** Authentication is handled exclusively by Supabase Auth (client-side)

### How It Works

```
iOS/Web App → Supabase Auth (direct) → JWT Token
     ↓
Backend API → JWT Verification → Business Logic
```

### Key Points

- **Login/Signup:** Handled directly by Supabase Auth SDK on client
- **Backend:** Only verifies JWT tokens - never creates users or sessions
- **API Endpoints:**
  - `/api/auth/login` → Returns 410 Gone (use Supabase Auth)
  - `/api/auth/signup` → Returns 410 Gone (use Supabase Auth)

### Setup

1. Configure Supabase in `.env`:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server only
```

2. In Supabase Dashboard:
   - Enable Email/Password authentication
   - Disable Email Confirmation (for development)

### Blockchain
- **Alchemy SDK** - Multi-chain blockchain API
- **Ethers.js** - Ethereum interactions
- **Bitcoin** - Bitcoin network integration

### Integrations
- **OpenAI** - AI-powered analysis
- **Stripe** - Payment processing
- **SendGrid** - Email notifications
- **Capacitor** - Mobile app framework

## Database Schema

The application uses 14 main tables:

1. **users** - User accounts and subscriptions
2. **user_reputation** - Trust scores and ranks
3. **scam_reports** - Blockchain scam reports
4. **alerts** - User notifications
5. **watchlist** - Monitored addresses
6. **security_logs** - Audit trail
7. **live_monitoring** - Real-time wallet monitoring
8. **monitoring_alerts** - Transaction alerts
9. **escrow_transactions** - Smart lock transactions
10. **slippage_calculations** - Token slippage analysis
11. **conversations** - AI chat history
12. **messages** - Chat messages
13. **encrypted_audit_logs** - Legal-grade audit logs
14. **sessions** - Session storage

See [supabase-schema.sql](./supabase-schema.sql) for complete schema.

## Deployment

### Vercel + Supabase (Recommended)

This project is optimized for Vercel deployment with Supabase database.

1. **Create Supabase Project:**
   - Visit https://supabase.com
   - Create a new project
   - Copy the connection string

2. **Deploy to Vercel:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Deploy
   vercel
   ```

3. **Configure Environment Variables:**
   Add all required variables in Vercel dashboard

4. **Run Database Setup:**
   ```bash
   npm run db:setup
   ```

### Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# Database will be automatically initialized
```

## API Documentation

### Health Check
```
GET /api/health
```

### Wallet Analysis
```
GET /api/wallet/:network/:address
```

### Scam Reports
```
GET /api/scam-reports
POST /api/scam-reports
```

### Monitoring
```
GET /api/monitoring
POST /api/monitoring/start
POST /api/monitoring/stop
```

### AI Assistant
```
POST /api/chat
```

For complete API documentation, see the routes in [server/routes.ts](./server/routes.ts)

## Mobile Apps

### iOS

Requirements:
- macOS with Xcode installed
- iOS 13.0 or later

```bash
npm run cap:sync:ios
npm run cap:open:ios
```

### Android

Requirements:
- Android Studio
- Android SDK 24 or later

```bash
npm run cap:sync:android
npm run cap:open:android
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Security

This application handles sensitive financial data. Please:
- Never commit `.env` files
- Use strong session secrets
- Keep dependencies updated
- Report security issues privately

## License

MIT License - see [LICENSE](./LICENSE) for details

## Support

- Documentation: [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- Issues: https://github.com/yourusername/UAE7Guard/issues
- Email: support@uae7guard.com

## Acknowledgments

- Alchemy for blockchain infrastructure
- OpenAI for AI capabilities
- Supabase for database hosting
- The UAE crypto community for feedback and testing
