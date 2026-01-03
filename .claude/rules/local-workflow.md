# Local Workflow - Jahongir Travel Platform

> **Project-specific local development setup**
>
> **Global workflows:** See `~/.claude/rules/development/`

---

## 🚀 Quick Start

```bash
# 1. Start Docker services FIRST
docker-compose up -d

# 2. Then start all apps
pnpm dev
```

This starts:
- Docker: PostgreSQL (5433), Redis (6380), MailDev (1026, 8026)
- Customer Website: http://localhost:3000
- Admin Panel: http://localhost:3001
- API: http://localhost:4000

**Docker guide:** See `~/.claude/rules/development/docker-first.md`

---

## 📦 Build Order

```
apps/api
  ↓
packages/types
  ↓
apps/web, apps/admin
```

```bash
# Build all (Turborepo handles order)
pnpm build
```

**Monorepo guide:** See `~/.claude/rules/development/monorepo-workflows.md`

---

## 🗄️ Database (Prisma)

```bash
cd apps/api

# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name <migration_name>

# Open Prisma Studio
npx prisma studio  # http://localhost:5555

# Seed database
npx prisma db seed
```

---

## 🌍 Environment Variables

**API (.env in apps/api):**
```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/jahongir_travel_dev"
REDIS_URL="redis://localhost:6380"
JWT_SECRET="your-secret-key"
SMTP_HOST="localhost"
SMTP_PORT="1026"  # MailDev
```

**Web/Admin:**
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

---

## 🐳 Docker Services

```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f postgres

# Stop services
docker-compose down

# Reset (⚠️ deletes data)
docker-compose down -v
```

---

## 📧 Email Testing (MailDev)

```bash
# MailDev Web UI
http://localhost:8026

# SMTP Port: 1026
# All emails sent by API appear in MailDev
# No real emails are sent in development
```

---

## 🌐 Trilingual Testing

```bash
# Russian (default)
http://localhost:3000

# English
http://localhost:3000/en

# Uzbek
http://localhost:3000/uz

# Admin panel (all languages available)
http://localhost:3001
```

**Translation files:**
- `apps/web/messages/ru.json`
- `apps/web/messages/en.json`
- `apps/web/messages/uz.json`

---

## 🧪 Testing

```bash
pnpm test              # All tests
pnpm --filter api test # API tests only
pnpm test:coverage     # With coverage
```

---

## 🔗 Useful URLs

- Customer Website: http://localhost:3000
- Admin Panel: http://localhost:3001
- API: http://localhost:4000
- API Docs (Swagger): http://localhost:4000/api
- Prisma Studio: http://localhost:5555
- MailDev: http://localhost:8026
- PostgreSQL: localhost:5433 (user: postgres, password: postgres123)
- Redis: localhost:6380

---

**Last Updated:** 2025-12-18
**Global development workflows:** `~/.claude/rules/development/`
