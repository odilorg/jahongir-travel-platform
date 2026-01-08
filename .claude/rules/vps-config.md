# VPS Configuration - Jahongir Travel Platform (LOCAL)

## ⚠️ NOT APPLICABLE - LOCAL-ONLY PROJECT

**This project is for LOCAL DEVELOPMENT ONLY.**

The VPS staging site (`staging.jahongir-travel.uz`) is a **completely different project**:
- Different tech stack (Laravel vs Next.js/NestJS)
- Different location (`/domains/staging.jahongir-travel.uz/` on VPS)
- Managed by a different Telegram bot (`travel-bot`)

---

## ❌ DO NOT:

- Do NOT suggest SSH commands
- Do NOT reference VPS paths
- Do NOT suggest deploying this project to VPS
- Do NOT confuse this with the staging site

---

## ✅ LOCAL DEVELOPMENT ONLY:

```bash
# Start Docker services
docker-compose up -d

# Start development servers
pnpm dev

# Access:
# - Website: http://localhost:3000
# - Admin: http://localhost:3001
# - API: http://localhost:4000
```

---

**Last Updated:** 2026-01-08
**Status:** LOCAL-ONLY (no VPS deployment)
