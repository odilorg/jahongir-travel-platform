# Project Context - Jahongir Travel Platform

> **Essential project information for context recovery after auto-compact**
>
> Read this file during session initialization instead of full README.md

---

## 📊 Project Overview

**What:** Modern travel platform for Uzbekistan tourism
**Market:** Uzbekistan (Russian/English/Uzbek trilingual)
**Users:** Tourists, travel agents, admin team
**Client:** Jahongir Travel company

**Key Features:**
- Tour catalog with detailed itineraries
- Online booking system
- Blog for travel content
- Admin panel for content management
- Multi-language support (RU/EN/UZ)
- Email notifications (MailHog in dev)

---

## 🛠️ Tech Stack (Essential)

### Frontend
- **Framework:** Next.js 15.1 (App Router, RSC)
- **React:** 19.0
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 4.0 + shadcn/ui
- **i18n:** next-intl (ru/en/uz)
- **State:** TanStack Query + Zustand

### Backend
- **Framework:** NestJS 10
- **Database:** PostgreSQL 16 with Prisma ORM
- **Caching:** Redis
- **Auth:** JWT (Passport.js)
- **Validation:** class-validator + class-transformer
- **Docs:** Swagger/OpenAPI

### Infrastructure
- **Monorepo:** Turborepo + pnpm workspaces
- **Node:** 20.x LTS
- **Containers:** Docker Compose (Postgres, Redis, MailHog)
- **Production:** VPS (TBD)

---

## 🏗️ Monorepo Structure

### Apps Structure

```
apps/
├── web/                # Customer website (Next.js, port 3000)
│   ├── app/            # App Router pages
│   ├── components/     # React components
│   └── lib/            # Utilities
├── admin/              # Admin panel (Next.js, port 3001)
│   ├── app/            # Admin pages
│   ├── components/     # Admin components
│   └── lib/            # Admin utilities
└── api/                # Backend API (NestJS, port 4000)
    ├── src/            # Source code
    │   ├── tours/      # Tours module
    │   ├── blog/       # Blog module
    │   ├── categories/ # Categories module
    │   ├── contact/    # Contact module
    │   ├── inquiries/  # Inquiries module
    │   └── reviews/    # Reviews module
    └── prisma/         # Database schema
```

### Packages Structure

```
packages/
├── types/              # Shared TypeScript types
├── ui/                 # Shared UI components (future)
└── config/             # Shared configurations
```

### Dependency Chain

```
apps/api (Prisma schema - source of truth)
    ↓
packages/types (shared types)
    ↓
apps/web + apps/admin (Next.js frontends)
```

**⚠️ Build order:** `api → types → web/admin`

---

## 📁 Critical File Locations

### Database Schema (Single Source of Truth)
`apps/api/prisma/schema.prisma`

### Shared Types
`packages/types/src/index.ts`

### Backend API Modules
- Tours: `apps/api/src/tours/`
- Blog: `apps/api/src/blog/`
- Categories: `apps/api/src/categories/`
- Contact: `apps/api/src/contact/`
- Inquiries: `apps/api/src/inquiries/`
- Reviews: `apps/api/src/reviews/`

### Frontend (Customer Website)
- Pages: `apps/web/app/*/page.tsx`
- Components: `apps/web/components/*.tsx`
- Translations: `apps/web/messages/ru.json`, `en.json`, `uz.json`

### Admin Panel
- Pages: `apps/admin/app/*/page.tsx`
- Components: `apps/admin/components/*.tsx`
- Translations: `apps/admin/messages/ru.json`, `en.json`, `uz.json`

---

## 🔑 Key Concepts & Business Logic

### Database Models (Prisma)
```typescript
// Core models
Tour           // Tour packages with itinerary
Category       // Tour categories (Adventure, Cultural, etc.)
ItineraryItem  // Daily tour schedule
Booking        // Customer bookings
BlogPost       // Travel blog articles
Review         // Tour reviews
Inquiry        // Customer inquiries
Contact        // Contact form submissions
User           // Admin users (authentication)
```

### Tour Types
- **Cultural tours:** Historical sites, museums
- **Adventure tours:** Hiking, trekking
- **City tours:** Tashkent, Samarkand, Bukhara
- **Multi-day tours:** Silk Road journeys

### Languages
- **Russian (ru):** Primary language (default, no URL prefix)
- **English (en):** `/en/` prefix
- **Uzbek (uz):** `/uz/` prefix

### Authentication
- Admin-only authentication (for admin panel)
- JWT tokens for API access
- Public website has no auth (customers browse freely)

---

## 🌐 URLs & Environments

### Development (Local)
- Customer Website: http://localhost:3000
- Admin Panel: http://localhost:3001
- API: http://localhost:4000
- API Docs: http://localhost:4000/api (Swagger)
- Prisma Studio: http://localhost:5555
- MailHog: http://localhost:8025

### Staging (VPS) - TBD
- Will be configured later

### Production - TBD
- Will be configured later

---

## 📊 Current Feature Status

### ✅ Completed
- Project setup with monorepo structure
- Database schema design (Tours, Categories, Blog, Reviews, Inquiries)
- API modules:
  - Tours CRUD
  - Categories CRUD
  - Blog CRUD
  - Contact form handling
  - Inquiries management
  - Reviews system

### 🚧 In Progress
- Frontend pages (basic structure in place)
- Admin panel UI
- Styling with Tailwind CSS 4.0

### 📋 Planned
- Booking system integration
- Payment processing
- Email notifications (real SMTP)
- Image upload/gallery
- SEO optimization
- Analytics dashboard
- Customer authentication (for bookings)

---

## 🎨 Frontend Routing Structure

### Customer Website (apps/web)
```
/                           → Home (Russian, default)
/en/                        → Home (English)
/uz/                        → Home (Uzbek)
/tours                      → Tour listing
/tours/[id]                 → Tour details
/blog                       → Blog listing
/blog/[slug]                → Blog article
/about                      → About page
/contact                    → Contact page
```

### Admin Panel (apps/admin)
```
/                           → Dashboard
/tours                      → Tours management
/blog                       → Blog management
/bookings                   → Bookings management
/inquiries                  → Inquiries/leads
/reviews                    → Reviews moderation
/settings                   → Settings
```

**Locale handling:**
- Russian: No prefix (default)
- English: `/en/` prefix
- Uzbek: `/uz/` prefix
- Managed by next-intl middleware

---

## 🔄 Common Development Workflows

### Start All Services
```bash
# Option 1: Start everything with Turborepo
pnpm dev

# Option 2: Individual services
pnpm --filter web dev       # Customer website
pnpm --filter admin dev     # Admin panel
pnpm --filter api start:dev # API
```

### Docker Services
```bash
# Start PostgreSQL, Redis, MailHog
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### After Prisma Schema Change
```bash
cd apps/api

# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name <migration_name>

# Update types package if needed
cd ../../packages/types
pnpm build
```

### Adding Translations
```bash
# 1. Add to all language files
apps/web/messages/ru.json   # Russian
apps/web/messages/en.json   # English
apps/web/messages/uz.json   # Uzbek

# 2. Use in component
import { useTranslations } from 'next-intl';
const t = useTranslations('namespace');
t('key');
```

---

## 🐛 Common Issues & Solutions

### Issue: "Port already in use"
**Likely cause:** Previous dev server still running
**Solution:**
```bash
lsof -i :3000  # or :3001, :4000
kill -9 <PID>
```

### Issue: Docker services not starting
**Likely cause:** Port conflict or old containers
**Solution:**
```bash
docker-compose down -v
docker-compose up -d --build
```

### Issue: "Prisma Client not generated"
**Likely cause:** Missing Prisma generate step
**Solution:**
```bash
cd apps/api
npx prisma generate
```

### Issue: Database connection failed
**Likely cause:** Docker Postgres not running
**Solution:**
```bash
docker-compose up -d postgres
# Verify with:
docker-compose ps
```

---

## 📝 Code Conventions

### File Naming
- Components: PascalCase (`TourCard.tsx`)
- Files: kebab-case (`tour-card.tsx`)
- Functions: camelCase (`getTourById`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

### Git Commits
```
type(scope): subject

Types: feat, fix, docs, style, refactor, test, chore
Examples:
  feat(tours): add itinerary display component
  fix(api): resolve booking validation bug
```

---

## 🎯 Project-Specific Best Practices

### 1. Prisma Schema = Source of Truth
Always start changes at the schema level:
1. Update `apps/api/prisma/schema.prisma`
2. Run `npx prisma generate`
3. Create migration `npx prisma migrate dev`
4. Update types in `packages/types` if needed
5. Update API endpoints
6. Update frontend

### 2. Trilingual by Default
Every user-facing string must have Russian + English + Uzbek translations.

### 3. Docker First for Development
Always start Docker services before running dev servers:
```bash
docker-compose up -d
pnpm dev
```

### 4. Test Emails in MailHog
All emails in development go to MailHog (http://localhost:8025).

---

## 🔍 Quick Reference: pnpm Commands

```bash
# Development
pnpm dev                    # Start all apps
pnpm --filter web dev       # Customer website only
pnpm --filter admin dev     # Admin panel only
pnpm --filter api start:dev # API only

# Build
pnpm build                  # Build all apps
pnpm --filter api build     # API only

# Testing
pnpm test                   # All tests
pnpm --filter api test      # API tests
pnpm --filter api test:e2e  # API E2E tests

# Utilities
pnpm lint                   # Lint all packages
pnpm format                 # Format with Prettier
pnpm clean                  # Clean build artifacts
pnpm type-check             # TypeScript check
```

---

## 📞 Important Integrations

### Email Service (Development)
- **Service:** MailHog (local SMTP server)
- **SMTP:** localhost:1025
- **Web UI:** http://localhost:8025

### Email Service (Production) - TBD
- Will use real SMTP provider (SendGrid, Mailgun, etc.)

### Payment Gateway - TBD
- To be integrated later

---

## 🎯 When to Read Full README.md

**Read README.md (~3,000 tokens) only when:**
- You need complete tech stack details
- You need deployment instructions
- Onboarding new developer
- User asks about overall architecture

**Don't read README.md when:**
- Continuing work on same feature
- Debugging (use debugging protocol instead)
- You already understand the project structure

---

**Last Updated:** 2025-12-18
**Project Repository:** /home/odil/projects/jahongir-travel-platform
**Git Remote:** https://github.com/odilorg/jahongir-travel-platform.git
**VPS Access:** TBD (not deployed yet)
