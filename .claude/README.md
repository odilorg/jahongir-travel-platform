# Claude Code Context Files - Jahongir Travel Platform

> **Quick reference for context management system**

---

## 📂 What's in This Directory?

| File | Purpose | Size | Update Frequency |
|------|---------|------|------------------|
| **PROJECT_CONTEXT.md** | Project essentials | ~1,200 tokens | Monthly / major changes |
| **SESSION_STATE.json** | Current task, todos, discoveries | ~500 tokens | Auto-updated frequently |
| **KNOWN_ISSUES.md** | Deferred bugs and technical debt | ~500 tokens | When deferring issues |
| **WORK_LOG.md** | Project history (append-only) | Growing | Major milestones |
| **GIT_SCOPES.md** | Git commit scopes | ~100 tokens | Rarely |
| **rules/** | Project-specific configs (lean) | ~200 each | When project setup changes |

---

## 🚀 Quick Start (Most Important Info)

### Current Project Status
- **Branch:** main
- **Phase:** local-dev (MVP building)
- **Progress:** Backend 60%, Frontend 20%, Admin 10%

### URLs (Local Development)
- **Customer Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3001
- **API:** http://localhost:4000
- **API Docs (Swagger):** http://localhost:4000/api
- **Prisma Studio:** http://localhost:5555
- **MailHog:** http://localhost:8025

### Quick Commands
```bash
# Start all services
docker-compose up -d    # Start Postgres, Redis, MailHog
pnpm dev                # Start web, admin, api

# Database
cd apps/api
npx prisma generate     # After schema changes
npx prisma migrate dev  # Create migration
npx prisma studio       # Visual database editor

# Build
pnpm build              # Build all apps (Turborepo)

# Deploy to VPS (when configured)
# TBD - VPS not set up yet
```

---

## 🔄 How Context Management Works

### Auto-Recovery After Auto-Compact
1. I (Claude) load `SESSION_STATE.json` (~500 tokens)
2. Load `PROJECT_CONTEXT.md` (~1,200 tokens)
3. Check git state
4. Reconstruct full context in <20 seconds

### Auto-Updates (No Manual Work)
I update `SESSION_STATE.json` automatically when:
- ✅ TodoWrite task completed
- ✅ Important insight discovered
- ✅ You say "done"/"thanks"
- ✅ 5+ messages on same task
- ✅ Phase transition (local-dev → staging-testing → production-deploy)

---

## 📁 File Usage Guide

### When to Read Each File

**SESSION_STATE.json** - Read first!
- Current task and todos
- Recent discoveries
- Open questions
- Next steps
- Docker service status

**PROJECT_CONTEXT.md** - Read for project overview
- Tech stack (Next.js 15, NestJS 10, Prisma)
- 3 apps structure (web, admin, api)
- Trilingual support (RU/EN/UZ)
- Common workflows

**KNOWN_ISSUES.md** - Read when planning features
- Deferred features (booking, payment, auth)
- Technical debt (Tailwind 4.0 beta)
- Decisions needed

**WORK_LOG.md** - Read for project history
- Initial setup (Dec 18, 2025)
- API modules completed
- Progress tracking

**GIT_SCOPES.md** - Project-specific git commit scopes
- Available scopes (tours, blog, booking, etc.)
- Usage examples with trilingual patterns

**rules/local-workflow.md** - Project-specific local setup
- Docker-first workflow
- Quick start commands
- Trilingual testing (RU/EN/UZ)

**rules/vps-config.md** - VPS configuration (future)
- VPS not configured yet
- Planned setup documented

**Global Rules** (in `~/.claude/rules/`):
- Git workflow, commit frequency, releases
- VPS deployment, PM2, Nginx
- Docker-first development
- Monorepo workflows

---

## 🌐 VPS Sync Strategy (For Future)

### What to Sync to VPS (via git)
```bash
# Track these files in git (shared context)
git add .claude/PROJECT_CONTEXT.md
git add .claude/KNOWN_ISSUES.md
git add .claude/WORK_LOG.md
git add .claude/rules/
git add .claude/README.md
git commit -m "docs: update context files"
git push origin main
```

### What NOT to Sync (local-specific)
```bash
# Add to .gitignore
.claude/SESSION_STATE.json           # Environment-specific
.claude/SESSION_STATE.*.json         # Backups
```

### On VPS (When Configured)
```bash
# Will SSH to VPS (TBD)
# cd /var/www/jahongir-travel-staging
# git pull origin main    # Gets synced context files

# VPS will have its own SESSION_STATE.json (environment: "vps")
```

---

## 🎯 Common Workflows

### Starting Work (Local)
```bash
cd /home/odil/projects/jahongir-travel-platform
docker-compose up -d    # Start Docker services
claude

# I auto-load:
# 1. SESSION_STATE.json (your current task)
# 2. PROJECT_CONTEXT.md (project essentials)
# 3. rules/local-workflow.md (project-specific local setup)
# 4. Global rules from ~/.claude/rules/ (docker-first, git, etc.)
```

### After Docker Changes
```bash
docker-compose down -v  # Remove old containers
docker-compose up -d --build
```

### After Prisma Schema Changes
```bash
cd apps/api
npx prisma generate     # Generate client
npx prisma migrate dev --name <name>
cd ../..
pnpm build              # Rebuild all
```

### Testing All Locales
```bash
# Russian (default)
http://localhost:3000

# English
http://localhost:3000/en

# Uzbek
http://localhost:3000/uz
```

### After Completing Work
I automatically:
- Update SESSION_STATE.json with final state
- Update WORK_LOG.md if major milestone
- Send Telegram notification
- You just commit and push context files to git

---

## 📊 Context Budget

**Total available:** ~200K tokens per session

**Typical usage with context files:**
- Main conversation: ~40K (20%)
- File context (auto-loaded): ~2K (1%)
- Working files: ~30K (15%)
- Tool results: ~20K (10%)
- **Buffer remaining:** ~108K (54%)

**Without context files:**
- README.md + GETTING_STARTED.md: ~3,500 tokens
- Recovery after auto-compact: ~5,000 tokens
- **Savings:** ~3,000 tokens per session

---

## 🐳 Docker Services Reference

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f mailhog

# Stop services
docker-compose down

# Reset everything (⚠️ deletes data)
docker-compose down -v
```

**Services:**
- **PostgreSQL:** localhost:5432 (database)
- **Redis:** localhost:6379 (cache)
- **MailHog:** localhost:1025 (SMTP), localhost:8025 (Web UI)

---

## 🌍 Trilingual Support

**Translation files:**
```
apps/web/messages/
├── ru.json    # Russian (default, no URL prefix)
├── en.json    # English (/en/ prefix)
└── uz.json    # Uzbek (/uz/ prefix)

apps/admin/messages/
├── ru.json
├── en.json
└── uz.json
```

**Usage in components:**
```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('namespace');
return <h1>{t('key')}</h1>;
```

---

## 🔍 Troubleshooting

### "Port already in use"
```bash
lsof -i :3000  # Find process
kill -9 <PID>  # Kill it
```

### "Docker services not starting"
```bash
docker-compose down -v
docker-compose up -d --build
```

### "Prisma Client not generated"
```bash
cd apps/api
rm -rf node_modules/.prisma
npx prisma generate
```

### "Want to reset context"
```bash
mv .claude/SESSION_STATE.json .claude/SESSION_STATE.backup.json
cp ~/.claude/templates/SESSION_STATE.hybrid.template.json .claude/SESSION_STATE.json
# Edit to match your project
```

---

## 📚 Additional Resources

**Context Management:**
- Full strategy: `~/.claude/CONTEXT_MANAGEMENT_STRATEGY.md`
- VPS vs Local: `~/.claude/CONTEXT_STRATEGY_VPS_VS_LOCAL.md`
- Templates: `~/.claude/templates/`

**Global Development Rules:**
- Git: `~/.claude/rules/git/` (workflow, commit-frequency, release-strategy)
- VPS: `~/.claude/rules/vps/` (deployment-protocol, pm2-management, nginx-basics)
- Development: `~/.claude/rules/development/` (docker-first, monorepo-workflows)

---

## 🎓 Best Practices

1. **Let Claude update SESSION_STATE.json** - Don't edit manually
2. **Always start Docker first** - `docker-compose up -d` before `pnpm dev`
3. **Use KNOWN_ISSUES.md** - Track deferred features and decisions
4. **Update translations for all 3 languages** - RU/EN/UZ mandatory
5. **Test emails in MailHog** - http://localhost:8025
6. **Sync context files via git** - Keep team aligned
7. **Review context monthly** - Remove outdated info

---

## 📋 Pre-Deployment Checklist (For Future)

**Before VPS deployment:**
- [ ] All tests passing
- [ ] Build successful for all apps
- [ ] Environment variables documented
- [ ] Database migrations tested
- [ ] All 3 languages translated
- [ ] VPS configured (Nginx, PM2, SSL)
- [ ] Domain DNS configured
- [ ] SMTP service configured (replace MailHog)

---

**Last Updated:** 2025-12-18
**Maintained by:** Claude Code (auto-updated)
**VPS Status:** Not configured yet
