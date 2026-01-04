# UAE7Guard - Sovereign Crypto Intelligence Platform

## Overview

UAE7Guard is an enterprise-grade cryptocurrency fraud detection and intelligence platform designed for investors, institutions, and enterprises. The platform provides real-time threat lookup, scam report management, a reputation-based investigator network, and emergency response protocols. It emphasizes institutional security with AES-256 encryption, PDPL compliance, and human-verified threat intelligence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens supporting light/dark themes
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints under `/api/*` prefix
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Validation**: Zod with drizzle-zod integration for type-safe schemas

### Data Storage
- **Database**: PostgreSQL (provisioned via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Key Tables**: users, userReputation, scamReports, alerts, watchlist, securityLogs
- **Indexing**: scammerAddress field indexed for fast threat lookups

### Application Structure
```
client/           # React frontend
  src/
    components/   # UI components including shadcn/ui
    pages/        # Route pages (home, dashboard, reports, admin)
    hooks/        # Custom React hooks
    lib/          # Utilities and query client
server/           # Express backend
  routes.ts       # API endpoint definitions
  storage.ts      # Database access layer
  db.ts           # Database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle schema definitions
```

### Key Features
- **Threat Lookup**: Real-time address verification against verified threat database
- **Report Submission**: User-submitted scam reports with admin verification workflow
- **Reputation System**: Rank progression (Novice → Analyst → Investigator → Sentinel) based on verified contributions
- **Alert System**: Real-time notifications for watchlist addresses
- **Emergency SOP**: Step-by-step crisis response protocol with audit logging
- **Admin Panel**: Human-in-the-loop verification for threat reports
- **Analytics Dashboard**: Real-time platform statistics with threat type and severity breakdowns
- **API Documentation**: Comprehensive endpoint reference for integration

### Design System
- **Typography**: Inter for UI, JetBrains Mono for crypto addresses/code
- **Theme**: Dark mode default with light mode support via CSS variables
- **Component Style**: shadcn/ui "new-york" style variant

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations via `db:push` command

### Core Libraries
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database queries
- **zod**: Runtime schema validation
- **date-fns**: Date formatting utilities

### UI Framework
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, etc.)
- **Tailwind CSS**: Utility-first styling
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Build & Development
- **Vite**: Frontend bundler with HMR
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Session encryption secret for Replit Auth (required)
- `ENCRYPTION_KEY`: AES-256 encryption key for sensitive data (recommended for production)
- `ALCHEMY_API_KEY`: Alchemy API key for blockchain data (optional, enables hybrid verification)

## Authentication & Authorization

### Replit Auth Integration
- **OAuth Provider**: Replit OIDC (supports Google, GitHub, X, Apple login)
- **Session Storage**: PostgreSQL via connect-pg-simple
- **Session Duration**: 7 days with automatic token refresh

### Protected Endpoints
All user-specific endpoints require authentication:
- `/api/reports` (POST) - Submit scam reports
- `/api/watchlist` - Manage watchlist
- `/api/alerts` - View and manage alerts
- `/api/security-logs` - Security audit logs
- `/api/live-monitoring` - Wallet monitoring
- `/api/escrow` - Escrow transactions
- `/api/slippage` - Slippage calculations
- `/api/hybrid-verification` - High-value verification
- `/api/audit/*` - Encrypted audit logs

### Admin-Only Endpoints (role === "admin")
- `/api/admin/pending-reports` - View pending reports
- `/api/admin/reports/:id/verify` - Verify reports
- `/api/admin/reports/:id/reject` - Reject reports

### Public Endpoints
- `/api/threats/:address` - Threat lookup
- `/api/reports` (GET) - View all reports
- `/api/stats` - Platform statistics
- `/api/leaderboard` - Investigator leaderboard

## Recent Changes
- Added Replit Auth integration with OAuth support
- Implemented role-based authorization (isAdmin middleware)
- Created Analytics Dashboard page (/analytics)
- Created API Documentation page (/api-docs)
- Protected all sensitive endpoints with authentication
- Removed demo user fallbacks for proper session-based auth