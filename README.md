# Jahongir Travel Platform

Modern travel platform for Uzbekistan tours built with Next.js, NestJS, and TypeScript.

## 🏗️ Project Structure

```
jahongir-travel-platform/
├── apps/
│   ├── web/              # Customer-facing website (Next.js 15)
│   ├── admin/            # Admin panel (Next.js 15)
│   └── api/              # Backend API (NestJS 10)
├── packages/
│   ├── ui/               # Shared UI components
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configurations
└── docker-compose.yml    # Local development environment
```

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS 4.0
- **Components:** Shadcn/ui
- **State Management:** TanStack Query + Zustand
- **Internationalization:** next-intl (RU/EN/UZ)

### Backend
- **Framework:** NestJS 10
- **Language:** TypeScript 5.7
- **Database:** PostgreSQL 16
- **ORM:** Prisma
- **Caching:** Redis
- **Authentication:** JWT

### DevOps
- **Monorepo:** Turborepo
- **Package Manager:** pnpm 9.x
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions

## 📦 Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose

## 🛠️ Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start development environment

```bash
# Start all services (PostgreSQL, Redis, API, Web, Admin)
pnpm dev
```

This will start:
- **Customer Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3001
- **API:** http://localhost:4000
- **Prisma Studio:** http://localhost:5555

### 3. Database Setup

```bash
# Generate Prisma client
cd apps/api
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed
```

## 📚 Available Scripts

```bash
pnpm dev          # Start all apps in development mode
pnpm build        # Build all apps for production
pnpm test         # Run tests across all packages
pnpm lint         # Lint all packages
pnpm format       # Format code with Prettier
pnpm clean        # Clean all build artifacts and node_modules
```

## 🐳 Docker Development

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild services
docker-compose up -d --build
```

## 📁 Apps

### Web (Customer Website)
Location: `apps/web`

Features:
- Homepage with hero and featured tours
- Tours listing with filters
- Tour details with booking form
- Blog listing and articles
- Contact page
- Multi-language support (RU/EN/UZ)

### Admin (Admin Panel)
Location: `apps/admin`

Features:
- Dashboard with analytics
- Tours management (CRUD)
- Blog management
- Bookings management
- Leads/CRM
- Reviews moderation
- Settings

### API (Backend)
Location: `apps/api`

Features:
- RESTful API
- JWT authentication
- Prisma ORM
- Redis caching
- Email notifications
- File uploads
- Swagger documentation

## 🗄️ Database Schema

See `apps/api/prisma/schema.prisma` for the complete database schema.

Key models:
- Tours
- Categories
- Itinerary Items
- Bookings
- Blog Posts
- Reviews
- Leads
- Users

## 🌍 Internationalization

Supported languages:
- Russian (ru)
- English (en)
- Uzbek (uz)

Translation files: `apps/web/messages/` and `apps/admin/messages/`

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Coverage
pnpm test:coverage
```

## 🚀 Deployment

### Staging
```bash
# Deploy to staging server
git push origin main
# GitHub Actions automatically deploys
```

### Production
```bash
# Deploy to production
git push origin production
```

## 📄 License

Private - All rights reserved

## 👥 Team

- Lead Developer: Odil
- Platform: Jahongir Travel

---

**Built with ❤️ for Uzbekistan tourism**
