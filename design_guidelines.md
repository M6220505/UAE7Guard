# DubaiVerified Platform Design Guidelines

## Design Approach
**Reference-Based Strategy**: Drawing inspiration from enterprise security and fintech leaders - Linear's precision, Stripe's trustworthiness, Bloomberg Terminal's data density, and Coinbase's crypto-native patterns.

**Core Philosophy**: Institutional-grade security platform that conveys authority, precision, and trust to investors, institutions, and enterprises. Balance data density with clarity, urgency with calm professionalism.

---

## Typography System

**Primary Font**: Inter (Google Fonts) - exceptional readability for data-heavy interfaces
**Secondary Font**: JetBrains Mono - for addresses, hashes, technical identifiers

**Hierarchy**:
- Hero Headlines: text-5xl to text-6xl, font-bold, tracking-tight
- Section Headers: text-3xl to text-4xl, font-semibold
- Data Labels: text-sm, font-medium, uppercase, tracking-wide
- Body Text: text-base, font-normal
- Crypto Addresses: font-mono, text-sm
- Metrics/Numbers: text-2xl to text-4xl, font-bold, tabular-nums

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 8, 12, 16
- Tight spacing: p-2, gap-2 (within cards, buttons)
- Standard spacing: p-4, gap-4, mb-8 (component padding, vertical rhythm)
- Section spacing: py-12 to py-16 (desktop sections)
- Generous spacing: gap-8, p-16 (hero sections, emphasis areas)

**Grid System**:
- Dashboard: 12-column grid with max-w-7xl container
- Data tables: Full-width within container
- Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for feature displays

---

## Component Library

### Navigation
Top navigation bar with logo left, primary actions center, user profile/reputation badge right. Fixed positioning with subtle backdrop blur for glassmorphism effect when scrolling.

### Hero Section (Landing Page)
Full-width hero (min-h-screen) with dramatic gradient background image showing abstract security/blockchain visualization. Centered headline emphasizing "Sovereign Intelligence" and "Institutional Digital Asset Protection". Primary CTA button with blurred background overlay. Trust indicators below: "AES-256 Encrypted • PDPL Compliant • Real-Time Intelligence"

### Threat Search Interface
Prominent search bar (max-w-2xl, centered) with mono font input for addresses. Instant visual feedback: Green (clean), Yellow (suspicious), Red (verified threat) with severity indicators and animated transitions.

### Data Cards
Elevated cards (shadow-lg) displaying:
- Scam Reports: Address, risk level badge, reporter reputation, verification status, timestamp
- Reputation Leaderboard: Rank badge (Sentinel/Investigator/Analyst icons), trust score with progress bar, verified reports count
- Alert Cards: Severity-coded borders (red/yellow/green), dismissible, action buttons

### Emergency Protocol Modal
Full-screen overlay (dark backdrop) with centered emergency card. Step-by-step checklist (large checkboxes), each step expandable with technical details. Prominent "Document Action" button logging to audit trail.

### Admin Verification Panel
Split-screen layout: Report details left (70%), verification controls right (30%). Timeline visualization of report history, evidence attachments grid, approve/reject buttons with required admin notes.

### Tables & Lists
Dense data tables with:
- Sticky headers
- Zebra striping for readability
- Mono font for addresses (truncated with hover tooltip showing full address)
- Status badges (verified/pending/rejected)
- Sort indicators on column headers
- Pagination with page jump

### Dashboard Widgets
Metrics cards showing:
- Total threats neutralized (large number)
- Reputation score with rank badge
- Active alerts count
- Monthly security brief download link
Charts: Clean line graphs for trend analysis, minimal styling focusing on data clarity

### Forms
- Input fields with floating labels
- Crypto address validation with checksum verification indicator
- Multi-step report submission with progress indicator
- File upload for evidence (drag-drop zone)
- Required field indicators
- Inline validation messages

---

## Visual Patterns

**Status Indicators**:
- Verified Threat: Red badge with shield-x icon
- Under Review: Yellow badge with clock icon
- Clean Address: Green badge with shield-check icon
- High Reputation: Gold badge with star icon

**Glassmorphism**: Apply backdrop-blur-md with semi-transparent backgrounds on floating navigation, modal overlays, and CTA buttons over hero images.

**Micro-interactions**: Subtle scale transforms on card hover (scale-105), smooth color transitions on status changes, skeleton loaders for data fetching.

---

## Images

**Hero Image**: Abstract visualization combining blockchain network nodes, security lock mechanisms, and Middle Eastern architectural elements (subtle Dubai skyline silhouette). Dark, sophisticated palette with accent lighting. Full-width background image with gradient overlay for text contrast.

**Illustration Spots**:
- Empty states: Custom illustrations for "No threats found" (shield with checkmark), "No alerts" (peaceful state)
- Feature sections: Icon sets representing encryption, real-time monitoring, reputation system

---

## Iconography

**Library**: Heroicons (CDN)
- Security: shield-check, shield-exclamation, lock-closed
- Actions: magnifying-glass, flag, bell, document-text
- Navigation: home, chart-bar, user-circle, cog
- Status: check-circle, exclamation-triangle, x-circle

---

## Platform-Specific Considerations

**Arabic/English Toggle**: Language switcher in top-right. RTL-ready layouts with proper text alignment. Arabic typography uses Tajawal font family for body, maintaining hierarchy.

**Trust Signals**: Display compliance badges (PDPL, AES-256), client testimonials (if available), encryption status indicators consistently across platform.

**Data Sensitivity**: All sensitive data (addresses, API keys) displayed in mono font with copy-to-clipboard functionality. Masked by default with reveal toggle.

**Performance**: Skeleton screens for data-heavy tables, virtualized lists for leaderboards with 100+ entries, optimistic UI updates for reputation changes.