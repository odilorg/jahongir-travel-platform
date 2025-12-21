# Git Commit Scopes - Jahongir Travel Platform

> **Project-specific commit message scopes**
>
> **Global git rules:** See `~/.claude/rules/git/workflow.md`

---

## 📋 Available Scopes

### **Apps:**
- `web` - Customer website
- `admin` - Admin panel
- `api` - Backend API

### **Features/Modules:**
- `tours` - Tour-related changes
- `blog` - Blog functionality
- `booking` - Booking system
- `categories` - Category management
- `reviews` - Review system
- `contact` - Contact form
- `inquiries` - Inquiry/lead management

### **Infrastructure:**
- `docker` - Docker configuration
- `prisma` - Database schema
- `redis` - Redis caching
- `i18n` - Internationalization (RU/EN/UZ)
- `deps` - Dependency updates

---

## 💡 Usage Examples

```bash
# Feature commits
git commit -m "feat(tours): add booking form component"
git commit -m "feat(blog): implement blog post list"
git commit -m "feat(i18n): add tour descriptions in all 3 languages"

# Bug fixes
git commit -m "fix(docker): resolve PostgreSQL connection timeout"
git commit -m "fix(api): resolve booking validation"

# Trilingual changes
git commit -m "feat(i18n): add booking form translations (RU/EN/UZ)"

# Infrastructure
git commit -m "chore(docker): configure development environment"
git commit -m "chore(deps): update Next.js to 15.1"
```

---

**Last Updated:** 2025-12-18
**Global workflow:** `~/.claude/rules/git/workflow.md`
**Commit frequency:** `~/.claude/rules/git/commit-frequency.md`
