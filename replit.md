# UAE7Guard - Public Crypto Safety Tool

## Overview

UAE7Guard is a free, bilingual (Arabic/English) cryptocurrency safety tool designed for the general public. It allows users to check wallet addresses against a database of known scam reports, access educational content about common crypto scams, and report suspicious addresses. The platform prioritizes user privacy (no search storage or tracking), offers educational content (not financial or legal advice), and ensures accessibility with proper RTL support for Arabic. The project's vision is to empower individuals with the knowledge and tools to navigate the crypto space safely.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Design Principles
- **Privacy-First**: Searches are not stored or tracked.
- **Bilingual Support**: Full Arabic/English support with RTL handling.
- **Educational Focus**: Providing knowledge on scam types and prevention.
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation, and touch-friendly design.
- **Modular Monolith**: Separate client and server components sharing a common schema.

### Frontend
- **Framework**: React 18 with TypeScript.
- **UI/UX**: shadcn/ui built on Radix UI, styled with Tailwind CSS, supporting light/dark themes. Typography uses Inter for UI and JetBrains Mono for crypto addresses.
- **State Management**: TanStack React Query for server state.
- **Internationalization**: Custom language context for Arabic/English with dynamic RTL adjustments.
- **Features**: Wallet address check with color-coded results (Green: safe, Yellow: under review, Red: dangerous), Learning Center, and Report Submission.
- **Mobile Experience**: Responsive design with a bottom navigation bar for native apps and PWA, safe-area-inset padding, and 44px minimum tap targets.

### Backend
- **Runtime**: Node.js with Express and TypeScript.
- **API**: RESTful endpoints (`/api/*`).
- **Database ORM**: Drizzle ORM with PostgreSQL dialect.
- **Schema Validation**: Zod with drizzle-zod for type-safe schemas.
- **Authentication**: Custom email/password authentication using bcryptjs, session storage in PostgreSQL.
- **Authorization**: Role-based access for public, authenticated, and admin users.
- **Risk Scoring**: Enhanced Multi-Factor Risk Engine (`server/risk-engine.ts`) combining Age, Activity, Value, Pattern, and Threat factors to generate a transparent risk score and recommendation.
- **Subscription System**: Integration with Stripe for managing Free, Basic, and Pro tiers, enabling feature gating based on subscription status.
- **Multi-chain Support**: Unified API endpoint (`/api/wallet/:network/:address`) for various blockchains including Bitcoin, BSC, Polygon, Arbitrum, Base, Optimism.

### Data Storage
- **Database**: PostgreSQL, with schema defined in `shared/schema.ts`. Key tables include `users`, `scamReports`, `alerts`, and `watchlist`.
- **Indexing**: `scammerAddress` field is indexed for efficient threat lookups.

### Deployment & Build
- **Build Tool**: Vite for frontend, esbuild for server.
- **Mobile Builds**: Capacitor for iOS/Android native apps, configured for TestFlight deployment via Codemagic CI/CD with automated build number management.
- **PWA**: Progressive Web App support with offline capabilities and custom icons.

## External Dependencies

- **PostgreSQL**: Primary database for all application data.
- **Stripe**: For subscription management, payment processing, and webhooks.
- **Alchemy API**: (Optional) Used for blockchain data, specifically for hybrid verification features.
- **@tanstack/react-query**: React library for server state management.
- **drizzle-orm**: TypeScript ORM for interacting with the PostgreSQL database.
- **zod**: Schema declaration and validation library.
- **Radix UI**: Unstyled, accessible component primitives.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **lucide-react**: Icon library.
- **Vite**: Frontend build tool.
- **Codemagic**: CI/CD for mobile application builds and deployment to TestFlight/App Store.