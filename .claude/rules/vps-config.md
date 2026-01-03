# VPS Configuration - Jahongir Travel Platform

> **Project-specific VPS configuration**
>
> **Global VPS rules:** See `~/.claude/rules/vps/`

---

## 🌐 VPS Status

**⬜ VPS not configured yet (TBD)**

Planned configuration:

```bash
# Will be configured later
ssh -i /path/to/key user@vps-ip
```

---

## 📁 Planned VPS Directories

**Staging:**
- Location: `/var/www/jahongir-travel-staging`
- URL: TBD (e.g., `https://staging.jahongirtravel.uz`)
- Branch: `main` or `develop`

**Production:**
- Location: `/var/www/jahongir-travel-production`
- URL: TBD (e.g., `https://jahongirtravel.uz`)
- Branch: `main` or `production`

---

## 🚀 Planned Deployment (Future)

```bash
ssh -i /path/to/key user@vps-ip
cd /var/www/jahongir-travel-staging
git pull origin main
pnpm install
pnpm prisma migrate deploy
pnpm build
pm2 restart all
pm2 logs --lines 20
```

**Full deployment protocol:** See `~/.claude/rules/vps/deployment-protocol.md`

---

## 🔧 Planned PM2 Setup

**Expected processes:**
- `web` - Customer Website (port 3000)
- `admin` - Admin Panel (port 3001)
- `api` - Backend API (port 4000)

**PM2 commands:** See `~/.claude/rules/vps/pm2-management.md`

---

## 📝 Notes

**To-Do:**
- [ ] Set up VPS server
- [ ] Install Node.js, pnpm, PM2, Nginx
- [ ] Configure PostgreSQL and Redis
- [ ] Set up SSL certificates
- [ ] Configure domain DNS
- [ ] Set up PM2 startup scripts
- [ ] Configure Nginx reverse proxy

**This file will be updated once VPS is configured.**

---

**Last Updated:** 2025-12-18
**Global VPS protocols:** `~/.claude/rules/vps/`
