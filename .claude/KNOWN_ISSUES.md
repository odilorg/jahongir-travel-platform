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

**Last Updated:** 2025-12-18
**Review Frequency:** Weekly (remove completed items, reprioritize)
