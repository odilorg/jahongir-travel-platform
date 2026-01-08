# Known Issues - Jahongir Travel Platform

> **Purpose:** Track bugs and technical debt to fix later

---

## Critical (P0) - Fix ASAP

None currently

---

## High Priority (P1) - Fix This Sprint

None currently

---

## Medium Priority (P2) - Fix Next Sprint

### Customer Authentication Not Implemented
- **Issue:** No authentication for customers (booking requires account?)
- **Impact:** Can't track customer bookings properly
- **Effort:** 4-6 hours (add NextAuth.js or similar)
- **Decision needed:** Should customers have accounts or book as guests?
- **Workaround:** Collect customer info in booking form without account

### Payment Gateway Not Integrated
- **Issue:** No payment processing implemented
- **Impact:** Can't accept online payments for bookings
- **Effort:** 8-12 hours (Stripe, Click.uz, or Payme integration)
- **Decision needed:** Which payment gateway to use?
- **Workaround:** Manual payment processing (bank transfer, cash)

---

## Low Priority (P3) - Nice to Have

### Image Upload Not Implemented
- **Issue:** No file upload functionality for tour images
- **Impact:** Can't upload tour photos from admin panel
- **Effort:** 3-4 hours (add multer + Sharp for image processing)
- **File:** `apps/api/src/tours/` (upload endpoint needed)
- **Workaround:** Manually add image URLs to database

### Email Service Not Configured (Production)
- **Issue:** Using MailHog (dev only), no real SMTP for production
- **Impact:** Can't send booking confirmation emails in production
- **Effort:** 2 hours (configure SendGrid, Mailgun, or SES)
- **Decision needed:** Which email service provider?
- **Workaround:** Manual email sending

### SEO Optimization Missing
- **Issue:** No meta tags, sitemap, robots.txt
- **Impact:** Poor search engine visibility
- **Effort:** 4-5 hours (add next-seo, generate sitemap)
- **File:** `apps/web/app/layout.tsx` (add metadata)

### Admin Panel Authentication
- **Issue:** Admin panel has no authentication yet
- **Impact:** Anyone can access admin panel
- **Effort:** 3-4 hours (add admin auth with JWT)
- **File:** `apps/admin/` (add auth middleware)
- **Workaround:** Don't expose admin panel publicly yet

---

## Performance Issues (RESOLVED 2026-01-08)

### Next.js Dev Server 100% CPU Usage (FIXED)

**Root Cause:** Three compounding issues:
1. .next cache bloat (267MB in admin app)
2. Monolithic components (TourForm.tsx 1,255 lines, BookingGrid.tsx 1,056 lines)
3. tsconfig.json including `.next/types/**/*.ts` (unnecessary re-type-checking)

**Solution Applied:**
1. ✅ Removed `.next/types` from tsconfig.json includes
2. ✅ Split TourForm.tsx into 8 smaller components (tour-form/ directory)
3. ✅ Added lazy loading for BookingGrid and BookingCalendar
4. ✅ Created cleanup script: `./scripts/clean-cache.sh`

**Prevention Guidelines:**
- **Component size limit:** Keep components under 300 lines
- **Clear cache regularly:** Run `./scripts/clean-cache.sh` when CPU spikes
- **tsconfig.json:** Never include `.next/` directories
- **Lazy load heavy components:** Use `dynamic()` for components >500 lines
- **Monitor .next size:** Should be <50MB, alarm at >100MB

**Signs you need to clean cache:**
- Dev server consuming 100% CPU
- Slow hot reload (>2 seconds per file save)
- Webpack compilation taking >10 seconds
- "Ineffective mark-compacts" errors

---

## Safeguards Implemented (2026-01-08)

### 1. Health Check Script (`./scripts/check-health.sh`)
- Checks cache sizes (warns when admin .next >100MB, web .next >50MB, turbo >200MB)
- Checks component file sizes (warns when files >300 lines)
- Monitors system memory and disk usage
- Verifies Node.js version and configuration
- Run: `pnpm health`

### 2. Memory Monitor (`./scripts/monitor-dev.sh`)
- Real-time memory monitoring for dev server processes
- Warns at 1500MB, critical alert at 2500MB
- Desktop notifications when memory is critical
- Run in separate terminal while developing

### 3. Safe Dev Mode (`pnpm dev:safe`)
- Runs health check before starting dev server
- Prevents starting dev when caches are bloated
- Catches issues before they cause 100% CPU

### 4. ESLint Max-Lines Rule
- Warns when files exceed 300 lines
- Applied to both admin and web apps
- Enforced during `pnpm lint`

### 5. Git Pre-Commit Hook (`.git/hooks/pre-commit`)
- Checks staged files for size violations
- Warns about bloated cache before commit
- Non-blocking (warnings only, won't fail commit)

### 6. Cache Cleanup Scripts
- `pnpm clean:cache` - Clean .next and .turbo caches
- `pnpm clean:deep` - Also clean node_modules/.cache

### NPM Scripts Summary:
```bash
pnpm dev        # Normal dev (use when cache is healthy)
pnpm dev:safe   # Health check + dev (recommended)
pnpm health     # Manual health check
pnpm clean:cache # Quick cache cleanup
pnpm clean:deep  # Deep cache cleanup
```

---

## Technical Debt

### Tailwind CSS 4.0 Beta
- **Issue:** Using Tailwind CSS 4.0 (beta version)
- **Impact:** Might have breaking changes in stable release
- **Solution:** Monitor Tailwind 4.0 release, update when stable
- **Effort:** 1-2 hours (migration if breaking changes)

### No Error Monitoring
- **Issue:** No Sentry or error tracking service
- **Impact:** Can't track production errors
- **Solution:** Add Sentry or similar
- **Effort:** 2 hours

### No Analytics
- **Issue:** No Google Analytics, Plausible, or analytics tracking
- **Impact:** Can't measure traffic, conversions
- **Solution:** Add analytics service
- **Effort:** 1 hour

---

## Deferred Features

### Booking System Integration
- **Status:** Planned but not implemented
- **Priority:** P1 (high priority)
- **Effort:** 12-16 hours (full booking flow with calendar, availability, pricing)

### Reviews System Frontend
- **Status:** API ready, frontend not implemented
- **Priority:** P2 (medium priority)
- **Effort:** 4-6 hours (review form, display, moderation UI)

### Blog CMS Integration
- **Status:** API ready, admin UI not implemented
- **Priority:** P2 (medium priority)
- **Effort:** 6-8 hours (rich text editor, image uploads, publishing)

### Multi-currency Support
- **Question:** Should we support USD, EUR, UZS?
- **Priority:** P3 (nice to have)
- **Effort:** 4-5 hours (currency conversion API, display logic)

---

**Last Updated:** 2026-01-08
**Review Frequency:** Weekly (remove completed items, reprioritize)
