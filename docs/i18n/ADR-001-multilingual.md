# ADR-001: Multilingual Content Architecture

**Date:** 2026-01-03
**Status:** Accepted
**Decision Makers:** Development Team

---

## Context

The Jahongir Travel Platform targets the Uzbekistan tourism market, which requires content in three languages:
- **Russian (ru):** Primary language for local and regional tourists (default)
- **English (en):** International tourists and global market
- **Uzbek (uz):** Local users and cultural authenticity

Currently, the database schema stores all content in single-language fields (English only). We need to implement multilingual support **before** content creation to avoid expensive data migration later.

---

## Decision

We will use **separate translation tables** (relational approach) instead of JSON fields for multilingual content.

### Database Design: Translation Tables

Each translatable entity will have a companion translation table:

```prisma
model Tour {
  id              String   @id @default(cuid())
  price           Float
  duration        Int
  maxGroupSize    Int
  // ... other non-translatable fields

  translations    TourTranslation[]
}

model TourTranslation {
  id              String   @id @default(cuid())
  tourId          String
  tour            Tour     @relation(fields: [tourId], references: [id], onDelete: Cascade)

  locale          String   // 'en' | 'ru' | 'uz'
  title           String
  slug            String
  summary         String?  @db.Text
  description     String   @db.Text
  highlights      String[]

  @@unique([tourId, locale])
  @@unique([locale, slug])
  @@index([locale])
  @@index([slug])
}
```

---

## Rationale: Why Translation Tables Over JSON?

### ✅ Advantages of Translation Tables

1. **Type Safety**
   - Strongly typed in Prisma schema
   - TypeScript types auto-generated
   - Compile-time validation

2. **Query Performance**
   - Native database indexing on `locale` and `slug`
   - Efficient WHERE clauses: `WHERE locale = 'ru'`
   - Supports full-text search per locale

3. **Data Integrity**
   - Foreign key constraints ensure referential integrity
   - Cascade deletes handled automatically
   - Unique constraints on `(tourId, locale)` and `(locale, slug)`

4. **Flexibility**
   - Easy to add new languages (just insert new rows)
   - Can have different field lengths per locale (Uzbek text may be longer)
   - Supports partial translations (missing locales handled gracefully)

5. **SEO & Routing**
   - Each locale has its own slug: `/tours/silk-road-journey` (en), `/tours/шелковый-путь` (ru)
   - Clean URLs per language
   - Better SEO with language-specific slugs

6. **Database Features**
   - Can use PostgreSQL text search features per locale
   - Easy to query "incomplete translations" (missing locales)
   - Simple to generate reports on translation coverage

### ❌ Disadvantages of JSON Fields

1. **No Type Safety**
   - JSON fields are untyped blobs
   - Runtime errors if structure changes
   - No autocomplete in IDE

2. **Poor Query Performance**
   - Can't index JSON keys efficiently in PostgreSQL
   - Queries like `WHERE title->>'ru' = 'something'` are slow
   - No full-text search support

3. **Data Integrity**
   - No validation of JSON structure
   - Easy to have inconsistent keys across rows
   - Can't enforce required fields per locale

4. **Migration Pain**
   - Changing JSON structure = custom migration scripts
   - No automatic schema validation

---

## Fallback Strategy

### 1. Locale Resolution Order

When requesting content, the system will try locales in this order:

```
Requested Locale → English (en) → First Available Locale
```

**Examples:**
- User requests `ru`, translation exists → Return Russian
- User requests `ru`, only `en` exists → Return English (fallback)
- User requests `uz`, only `en` and `ru` exist → Return English (fallback)
- User requests invalid locale `fr` → Return English (default)

### 2. Implementation

**API Level:**
```typescript
async findTourBySlug(slug: string, locale: string = 'en'): Promise<Tour> {
  const tour = await prisma.tour.findFirst({
    where: {
      translations: {
        some: { slug, locale }
      }
    },
    include: {
      translations: {
        where: { locale: { in: [locale, 'en'] } },
        orderBy: { locale: locale === 'en' ? 'asc' : 'desc' }
      }
    }
  });

  // Use requested locale or fallback to 'en'
  const translation = tour.translations.find(t => t.locale === locale)
                   || tour.translations.find(t => t.locale === 'en')
                   || tour.translations[0];

  return { ...tour, ...translation };
}
```

### 3. Partial Translations

- Tours can exist with only English translation initially
- Admin can add Russian/Uzbek translations later
- Frontend shows "Translation not available" notice for missing locales

---

## Slug Strategy

### 1. Unique Slugs Per Locale

Each locale has its own slug, allowing language-specific URLs:

**English:** `/en/tours/silk-road-journey`
**Russian:** `/ru/tours/шелковый-путь`
**Uzbek:** `/uz/tours/ipak-yoli-sayohati`

### 2. Database Constraints

```prisma
@@unique([locale, slug])  // Ensures unique slug per locale
@@index([slug])           // Fast slug lookups
```

### 3. Slug Generation Rules

- **English:** Kebab-case ASCII: `silk-road-journey`
- **Russian:** Cyrillic transliterated or preserved: `shelkovyy-put` or `шелковый-путь`
- **Uzbek:** Latin script (official): `ipak-yoli-sayohati`

### 4. Slug Conflicts

- Same base entity, different locales → Different slugs allowed
- Different entities, same locale → Unique constraint prevents conflicts

---

## Indexing Strategy

### 1. Primary Indexes

```prisma
model TourTranslation {
  @@unique([tourId, locale])  // One translation per locale per tour
  @@unique([locale, slug])    // Unique slug within locale
  @@index([locale])           // Fast locale filtering
  @@index([slug])             // Fast slug lookups
}
```

### 2. Performance Considerations

- **Composite Index `[locale, slug]`:** Optimizes common query `WHERE locale = ? AND slug = ?`
- **Single Index `[locale]`:** Supports locale-only queries (list all Russian content)
- **Single Index `[slug]`:** Supports cross-locale slug searches

### 3. Query Patterns Optimized

```sql
-- Find tour by locale + slug (FAST - uses composite index)
SELECT * FROM TourTranslation
WHERE locale = 'ru' AND slug = 'шелковый-путь';

-- List all Russian tours (FAST - uses locale index)
SELECT * FROM TourTranslation WHERE locale = 'ru';

-- Check slug availability (FAST - uses slug index)
SELECT COUNT(*) FROM TourTranslation WHERE slug = 'silk-road';
```

---

## Translatable Entities

The following entities require translation tables:

### 1. **Tours**
- **Translatable:** title, slug, summary, description, highlights
- **Non-translatable:** price, duration, maxGroupSize, dates

### 2. **Itinerary Items**
- **Translatable:** title, description, activities
- **Non-translatable:** day, tourId, meals

### 3. **Tour FAQs**
- **Translatable:** question, answer
- **Non-translatable:** tourId, order

### 4. **Cities**
- **Translatable:** name, description
- **Non-translatable:** coordinates, timezone

### 5. **Blog Posts**
- **Translatable:** title, slug, excerpt, content, metaTitle, metaDescription
- **Non-translatable:** authorId, status, publishedAt, viewCount

### 6. **Blog Categories**
- **Translatable:** name, slug, description
- **Non-translatable:** order

### 7. **Tour Categories**
- **Translatable:** name, slug, description
- **Non-translatable:** order, icon

---

## Non-Translatable Entities

These entities do NOT need translations:

- **User** (admin users)
- **Booking** (transactional data)
- **Review** (user-generated, already in user's language)
- **Inquiry** (contact forms, already in user's language)
- **Guide/Driver** (names are proper nouns, only `languages[]` field exists)

---

## Implementation Phases

### Phase 1: Database Schema (Current)
- ✅ Create ADR and conventions documents
- ✅ Add shared locale types in `packages/types`
- ⏳ Create Prisma schema with translation tables
- ⏳ Generate and run migrations

### Phase 2: API Layer
- ⏳ Update controllers to accept `locale` parameter
- ⏳ Implement fallback logic in services
- ⏳ Update DTOs to handle translations
- ⏳ Add Swagger documentation for locale parameter

### Phase 3: Frontend (apps/web)
- ⏳ Install and configure `next-intl`
- ⏳ Implement locale routing (`/ru/`, `/en/`, `/uz/`)
- ⏳ Add language switcher component
- ⏳ Update pages to consume localized content

### Phase 4: Admin Panel (apps/admin)
- ⏳ Create translation management UI
- ⏳ Add locale tabs in forms
- ⏳ Implement translation coverage indicators
- ⏳ Add bulk translation tools

---

## Migration Path for Existing Data

1. **Create translation tables** with migrations
2. **Migrate existing English content:**
   ```sql
   INSERT INTO TourTranslation (id, tourId, locale, title, slug, description, ...)
   SELECT gen_random_uuid(), id, 'en', title, slug, description, ...
   FROM Tour;
   ```
3. **Drop old translatable columns** from base tables
4. **Update application code** to use translation tables

---

## Monitoring & Observability

### Translation Coverage Metrics

Track translation completeness per entity:

```sql
-- Tours with all 3 languages
SELECT COUNT(DISTINCT tourId)
FROM TourTranslation
GROUP BY tourId
HAVING COUNT(DISTINCT locale) = 3;

-- Tours missing Russian translation
SELECT t.id, t.createdAt
FROM Tour t
LEFT JOIN TourTranslation tt ON tt.tourId = t.id AND tt.locale = 'ru'
WHERE tt.id IS NULL;
```

### Admin Dashboard Widgets

- Translation completion percentage per locale
- Recently updated translations
- Entities missing translations (alerts)

---

## Consequences

### Positive
- ✅ Type-safe multilingual content
- ✅ Excellent query performance
- ✅ Clean SEO-friendly URLs per locale
- ✅ Easy to add new languages
- ✅ Simple to track translation coverage

### Negative
- ❌ More complex Prisma queries (must include translations)
- ❌ More database tables (2x entities for translatable content)
- ❌ Slightly larger database size (separate rows per locale)

### Mitigations
- Use Prisma `include` to simplify queries
- Create reusable query helpers for locale fallback
- Index properly to maintain performance

---

## References

- [Prisma Relations Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [PostgreSQL Indexing Best Practices](https://www.postgresql.org/docs/current/indexes.html)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)

---

**Approved By:** Development Team
**Implementation Start:** 2026-01-03
**Expected Completion:** Phase 4 by 2026-01-10
