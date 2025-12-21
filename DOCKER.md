# Docker Setup - Jahongir Travel Platform

This project uses Docker for **services only** (PostgreSQL, Redis, MailDev).  
The Next.js and NestJS apps run natively with `pnpm dev` for fast development.

## Services in Docker

- **PostgreSQL 16** - Database (port 5433)
- **Redis 7** - Cache (port 6380)
- **MailDev** - Email testing (SMTP: 1026, Web: 8026)

**Note:** We use non-standard ports to avoid conflicts with other projects on your machine.

## Quick Start

```bash
# 1. Start Docker services (FIRST!)
docker-compose up -d

# 2. Then start app dev servers
pnpm dev
```

## Docker Commands

### Start Services
```bash
docker-compose up -d              # Start in background
docker-compose up                 # Start with logs
```

### Check Status
```bash
docker-compose ps                 # List running containers
docker-compose logs               # View all logs
docker-compose logs -f postgres   # Follow PostgreSQL logs
docker-compose logs -f redis      # Follow Redis logs
```

### Stop Services
```bash
docker-compose down               # Stop services (keep data)
docker-compose down -v            # Stop and DELETE all data ⚠️
```

### Restart Services
```bash
docker-compose restart            # Restart all
docker-compose restart postgres   # Restart PostgreSQL only
```

## Database Management

### Connect to PostgreSQL
```bash
# From host machine
psql -h localhost -p 5433 -U postgres -d jahongir_travel_dev

# Or via Docker
docker exec -it jahongir-postgres psql -U postgres -d jahongir_travel_dev
```

### Backup Database
```bash
# Create backup
pg_dump -h localhost -p 5433 -U postgres jahongir_travel_dev > backup.sql

# Restore from backup
psql -h localhost -p 5433 -U postgres jahongir_travel_dev < backup.sql
```

### Reset Database
```bash
# Option 1: Reset via Prisma
cd apps/api
npx prisma migrate reset

# Option 2: Delete Docker volume (⚠️ DELETES ALL DATA)
docker-compose down -v
docker-compose up -d
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

## Redis Management

### Connect to Redis
```bash
# Via Docker
docker exec -it jahongir-redis redis-cli

# Common commands:
PING                  # Test connection
KEYS *                # List all keys
GET key               # Get value
FLUSHALL              # Clear all data ⚠️
```

## MailDev (Email Testing)

### Access MailDev
```bash
# Web UI
http://localhost:8026

# SMTP Configuration (for API)
Host: localhost
Port: 1026
```

All emails sent by the API appear in MailDev. No real emails are sent in development.

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :5433  # PostgreSQL
lsof -i :6380  # Redis
lsof -i :8026  # MailDev

# Stop the process or change port in docker-compose.yml
```

### Container Won't Start
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild and start fresh
docker-compose down
docker-compose up -d --build
```

### Database Connection Refused
```bash
# Check if PostgreSQL is running
docker-compose ps

# Check if using correct port (5433, not 5432)
echo $DATABASE_URL

# Restart PostgreSQL
docker-compose restart postgres
```

## Environment Variables

Your `.env` file should point to Docker services:

```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/jahongir_travel_dev"
REDIS_URL="redis://localhost:6380"
SMTP_HOST="localhost"
SMTP_PORT="1026"
```

## Daily Workflow

```bash
# Morning
docker-compose up -d    # Start Docker services
pnpm dev                # Start apps (web, admin, api)

# Work on code...
# Hot reload works perfectly!

# End of day
# Ctrl+C to stop pnpm dev
docker-compose down     # Stop Docker services
```

## Multiple Projects on Same Machine

This setup uses custom ports to avoid conflicts:

| Service | This Project | Other Projects Might Use |
|---------|-------------|--------------------------|
| PostgreSQL | 5433 | 5432 |
| Redis | 6380 | 6379 |
| MailDev SMTP | 1026 | 1025 |
| MailDev Web | 8026 | 8025 |

Your app dev servers still use standard ports (3000, 3001, 4000).

## Production Note

In production (VPS), we **don't use Docker**. Services run natively with PM2 + Nginx.  
Docker is only for local development isolation.

---

**Last Updated:** 2025-12-18  
**See also:** `.claude/rules/local-workflow.md`, `~/.claude/rules/development/docker-first.md`
