# UAE7Guard - Public Crypto Safety Tool

## Overview

UAE7Guard is a free, bilingual (Arabic/English) cryptocurrency safety tool designed for the general public. The platform allows anyone to check wallet addresses against a database of known scam reports, access educational content about common crypto scams, and report suspicious addresses. The platform emphasizes privacy (searches are not stored or tracked), educational purpose (not financial or legal advice), and accessibility with proper RTL support for Arabic.

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
- **Internationalization**: Custom language context for Arabic/English with RTL support

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
    contexts/     # React contexts (language-context.tsx)
    pages/        # Route pages (home, about, contact, faq, learning-center, privacy, terms)
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
- **Wallet Address Check**: Free tool to check any crypto address against scam database
- **Color-Coded Results**: Green (safe), Yellow (under review), Red (dangerous)
- **Bilingual Support**: Full Arabic/English support with RTL handling
- **Privacy-First**: Searches are not stored or tracked
- **Educational Content**: Learning Center with 6 scam types and prevention tips
- **Report Submission**: Users can report suspicious addresses
- **Accessibility**: ARIA labels on results, semantic HTML, keyboard navigation

### Public Pages
- `/` - Home page with wallet address check tool
- `/about` - About Us with mission and values
- `/learning-center` - Educational content about 6 scam types
- `/faq` - Frequently asked questions
- `/contact` - Report suspicious addresses
- `/privacy` - Privacy policy (PDPL compliant)
- `/terms` - Terms of service with educational disclaimers

### Design System
- **Typography**: Inter for UI, JetBrains Mono for crypto addresses/code
- **Theme**: Dark mode default with light mode support via CSS variables
- **Component Style**: shadcn/ui "new-york" style variant
- **Colors**: Green (#22c55e) for safe, Yellow (#eab308) for caution, Red (#ef4444) for danger

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
- **Radix UI**: Accessible component primitives (dialog, dropdown, tabs, accordion, etc.)
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

### Custom Email/Password Authentication
- **Method**: Email and password registration/login
- **Password Hashing**: bcryptjs with 12 salt rounds
- **Session Storage**: PostgreSQL via connect-pg-simple
- **Session Duration**: 7 days

### Auth Endpoints
- `POST /api/auth/signup` - Create account with {email, password, firstName, lastName}
- `POST /api/auth/login` - Login with {email, password}
- `GET /api/auth/user` - Get current authenticated user
- `POST /api/logout` - Destroy session and logout

### Public Endpoints (No Auth Required)
- `/api/threats/:address` - Threat lookup (main feature)
- `/api/reports` (GET) - View all reports
- `/api/stats` - Platform statistics
- `/api/leaderboard` - Investigator leaderboard

### Protected Endpoints (Auth Required)
- `/api/reports` (POST) - Submit scam reports
- `/api/watchlist` - Manage watchlist
- `/api/alerts` - View and manage alerts

### Admin-Only Endpoints (role === "admin")
- `/api/admin/pending-reports` - View pending reports
- `/api/admin/reports/:id/verify` - Verify reports
- `/api/admin/reports/:id/reject` - Reject reports

## Internationalization

### Language Context
Located at `client/src/contexts/language-context.tsx`, provides:
- `language`: Current language ('en' or 'ar')
- `setLanguage`: Function to switch language
- `isRTL`: Boolean for RTL text direction
- `t`: Translation object with all UI strings

### Language Toggle Component
Located at `client/src/components/language-toggle.tsx`:
- Button that toggles between EN and العربية
- Updates document direction attribute

### RTL Support
- All pages use `dir={isRTL ? "rtl" : "ltr"}` on container
- Icons and chevrons rotate appropriately for RTL
- Text alignment adjusts automatically

## Recent Changes
- Transformed from enterprise platform to public tool
- Added bilingual Arabic/English support with RTL handling
- Created language context and toggle component
- Redesigned home page with simplified navigation and "Start Check" CTA
- Created educational pages: About, Contact, Learning Center, FAQ
- Updated Privacy and Terms pages with bilingual content
- Added color-coded result system (green/yellow/red) with accessibility improvements
- Added ARIA labels to threat search results for screen readers
- Removed enterprise features from public navigation (Dashboard, Reports, Leaderboard)
- Added educational disclaimers emphasizing tool is not financial/legal advice
