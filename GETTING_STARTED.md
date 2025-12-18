# Getting Started with Jahongir Travel Platform

Welcome to the Jahongir Travel Platform development environment!

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **pnpm** 9+ (Install: `npm install -g pnpm`)
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** ([Download](https://git-scm.com/))

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/odilorg/jahongir-travel-platform.git
cd jahongir-travel-platform
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for all workspaces (web, admin, api, packages).

### 3. Start Docker Services

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- MailHog (ports 1025, 8025)

### 4. Setup Database

```bash
# Navigate to API directory
cd apps/api

# Copy environment file
cp .env.example .env

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

### 5. Start Development Servers

```bash
# From project root
pnpm dev
```

This starts all applications simultaneously:
- **Customer Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3001
- **API:** http://localhost:4000

## 🛠️ Development Workflow

### Working on Customer Website

```bash
cd apps/web
pnpm dev
```

The website uses:
- Next.js 15 (App Router)
- Tailwind CSS 4.0
- TypeScript

### Working on Admin Panel

```bash
cd apps/admin
pnpm dev
```

The admin panel uses:
- Next.js 15 (App Router)
- Tailwind CSS 4.0
- TypeScript

### Working on API

```bash
cd apps/api
pnpm start:dev
```

The API uses:
- NestJS 10
- Prisma ORM
- PostgreSQL

### Database Management

```bash
# Open Prisma Studio (visual database editor)
cd apps/api
npx prisma studio
# Opens at http://localhost:5555
```

### Email Testing

MailHog captures all emails sent in development:
- **Web UI:** http://localhost:8025
- **SMTP:** localhost:1025

## 📦 Project Structure

```
jahongir-travel-platform/
├── apps/
│   ├── web/              # Customer website (Next.js)
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities
│   ├── admin/            # Admin panel (Next.js)
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities
│   └── api/              # Backend API (NestJS)
│       ├── src/          # Source code
│       └── prisma/       # Database schema
├── packages/
│   ├── types/            # Shared TypeScript types
│   └── config/           # Shared configuration
└── docker-compose.yml    # Docker services
```

## 🧪 Testing

### Run All Tests

```bash
pnpm test
```

### Run Tests for Specific App

```bash
# Web
cd apps/web
pnpm test

# Admin
cd apps/admin
pnpm test

# API
cd apps/api
pnpm test
pnpm test:e2e
```

## 🎨 Code Quality

### Linting

```bash
pnpm lint
```

### Formatting

```bash
pnpm format
```

### Type Checking

```bash
pnpm type-check
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View running containers
docker-compose ps

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d jahongir_travel_dev

# Access Redis CLI
docker-compose exec redis redis-cli
```

## 🗄️ Database Operations

### Create Migration

```bash
cd apps/api
npx prisma migrate dev --name <migration_name>
```

### Reset Database

```bash
cd apps/api
npx prisma migrate reset
```

### Seed Database

```bash
cd apps/api
npx prisma db seed
```

## 🌍 Environment Variables

Each app has its own `.env` file:

- **apps/web/.env** - Customer website config
- **apps/admin/.env** - Admin panel config
- **apps/api/.env** - API config

Copy from `.env.example` and update values:

```bash
# API
cd apps/api
cp .env.example .env

# Edit DATABASE_URL, JWT_SECRET, etc.
```

## 📱 Accessing Services

| Service | URL | Description |
|---------|-----|-------------|
| Customer Website | http://localhost:3000 | Public-facing website |
| Admin Panel | http://localhost:3001 | Admin dashboard |
| API | http://localhost:4000 | REST API |
| API Docs | http://localhost:4000/api | Swagger documentation |
| Prisma Studio | http://localhost:5555 | Database GUI |
| MailHog | http://localhost:8025 | Email testing |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache |

## 🚨 Troubleshooting

### Port Already in Use

If you get "port already in use" errors:

```bash
# Find process using port
lsof -i :3000
lsof -i :4000
lsof -i :5432

# Kill process
kill -9 <PID>
```

### Docker Issues

```bash
# Remove all containers and volumes
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

### Database Issues

```bash
# Reset database
cd apps/api
npx prisma migrate reset

# Regenerate Prisma Client
npx prisma generate
```

### pnpm Issues

```bash
# Clear pnpm cache
pnpm store prune

# Remove node_modules and reinstall
pnpm clean
pnpm install
```

## 📚 Useful Commands

```bash
# Build all apps for production
pnpm build

# Clean all build artifacts
pnpm clean

# Update all dependencies
pnpm update --latest

# Check for security vulnerabilities
pnpm audit

# Add dependency to specific app
cd apps/web
pnpm add <package>

# Add dev dependency to root
pnpm add -D <package> -w
```

## 🎯 Next Steps

1. **Explore the codebase** - Familiarize yourself with the structure
2. **Read the API docs** - http://localhost:4000/api
3. **Check Prisma Studio** - http://localhost:5555
4. **Build a feature** - Start with the tour listing page
5. **Write tests** - Add unit and E2E tests

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Turborepo Documentation](https://turbo.build/repo/docs)

## 🤝 Getting Help

If you run into issues:

1. Check the troubleshooting section above
2. Review the documentation
3. Ask the team on Slack/Discord
4. Create an issue on GitHub

---

Happy coding! 🚀
