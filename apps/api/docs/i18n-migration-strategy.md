# I18n Migration Strategy

## Overview

The application has been migrated from single-language (English) content to a multi-language system supporting English (EN), Russian (RU), and Uzbek (UZ).

## Architecture

### Translation Tables Pattern

Each content entity now has a corresponding translation table:

| Base Entity | Translation Table | Translatable Fields |
|-------------|-------------------|---------------------|
| Tour | TourTranslation | title, description, shortDescription, highlights |
| TourCategory | TourCategoryTranslation | name, description |
| TourFaq | TourFaqTranslation | question, answer |
| ItineraryItem | ItineraryItemTranslation | title, description, activities |
| City | CityTranslation | name, description |
| BlogPost | BlogPostTranslation | title, excerpt, content |
| BlogCategory | BlogCategoryTranslation | name, description |

### Non-Translatable Fields

These fields remain in the base entities:
- IDs and foreign keys
- Numerical data (price, duration, maxGroupSize)
- Dates (createdAt, updatedAt, publishedAt)
- Boolean flags (isActive, isFeatured, showPrice)
- Media URLs (images, coverImage)
- Slugs (used for routing, language-independent)

## Migration Phases

### Phase A: Safe Migration (✅ COMPLETED)

**Status:** Database migration applied, translation tables created and populated.

**What was done:**
1. Created `Locale` enum (`en`, `ru`, `uz`)
2. Created 7 translation tables with proper foreign keys and indexes
3. Migrated existing English data to EN translations
4. Kept deprecated columns in base tables (for backward compatibility)

**Current State:**
- ❌ Deprecated columns were removed in migration (needs code update)
- ✅ Translation tables exist and are populated with EN data
- ⚠️  Code still references old columns (causing TypeScript errors)

### Phase B: Code Migration (🚧 IN PROGRESS)

**Goal:** Update all services to use translation tables instead of deprecated columns.

**Required Changes:**

1. **API Services** - Update Prisma queries to include translations:
   ```typescript
   // OLD (deprecated)
   const tour = await prisma.tour.findUnique({
     where: { slug },
     select: {
       id: true,
       title: true,      // ❌ Doesn't exist anymore
       description: true, // ❌ Doesn't exist anymore
     }
   });

   // NEW (i18n-aware)
   const tour = await prisma.tour.findUnique({
     where: { slug },
     include: {
       translations: {
         where: { locale: requestedLocale || 'en' }
       }
     }
   });

   // Transform to include translated fields
   return {
     ...tour,
     title: tour.translations[0]?.title,
     description: tour.translations[0]?.description,
   };
   ```

2. **DTOs** - Accept optional `locale` parameter:
   ```typescript
   export class GetToursDto {
     @IsOptional()
     @IsEnum(Locale)
     locale?: Locale = Locale.en;

     // ... other fields
   }
   ```

3. **Controllers** - Pass locale to services:
   ```typescript
   @Get()
   async findAll(@Query() dto: GetToursDto) {
     return this.toursService.findAll(dto);
   }
   ```

4. **Services** - Use locale in queries:
   ```typescript
   async findAll(dto: GetToursDto) {
     const { locale = Locale.en, ...filters } = dto;

     const tours = await this.prisma.tour.findMany({
       where: filters,
       include: {
         translations: {
           where: { locale }
         },
         category: {
           include: {
             translations: {
               where: { locale }
             }
           }
         }
       }
     });

     return tours.map(tour => this.transformTour(tour, locale));
   }

   private transformTour(tour: TourWithTranslations, locale: Locale) {
     const translation = tour.translations[0];

     return {
       ...tour,
       title: translation?.title || 'Untitled',
       description: translation?.description || '',
       // ... other translated fields
     };
   }
   ```

5. **Seed Scripts** - Create translations for each locale:
   ```typescript
   // Create tour category with translations
   await prisma.tourCategory.upsert({
     where: { id: 'category-id' },
     update: {},
     create: {
       id: 'category-id',
       slug: 'cultural-tours',
       icon: '🏛️',
       order: 1,
       translations: {
         create: [
           {
             locale: Locale.en,
             name: 'Cultural Tours',
             description: 'Explore cultural heritage...',
           },
           {
             locale: Locale.ru,
             name: 'Культурные туры',
             description: 'Исследуйте культурное наследие...',
           },
           {
             locale: Locale.uz,
             name: 'Madaniy sayohatlar',
             description: 'Madaniy merosni o\'rganing...',
           },
         ],
       },
     },
   });
   ```

### Phase C: Cleanup (⏳ FUTURE)

**Goal:** Remove deprecated columns after verification.

**Prerequisites:**
- All code migrated to use translations
- Full test coverage for i18n features
- Admin panel supports adding RU/UZ translations
- Translation coverage >80% for all locales

**Steps:**
1. Create migration to remove deprecated columns:
   - `Tour`: remove `title`, `description`, `shortDescription`, `highlights`
   - `TourCategory`: remove `name`, `description`
   - etc.

2. Remove transformation helpers (no longer needed)

3. Update Prisma schema

4. Regenerate Prisma Client

5. Final verification and deployment

## Runtime Monitoring

### Translation Coverage Service

A runtime service checks translation coverage on API startup:

```
=================================================================
📊 TRANSLATION COVERAGE REPORT
=================================================================

Entity              Total   EN        RU        UZ
-----------------------------------------------------------------
Tour                 2      2 (100%)  0 (0%)    0 (0%)
TourCategory         4      4 (100%)  0 (0%)    0 (0%)
ItineraryItem        3      3 (100%)  0 (0%)    0 (0%)
City                 4      4 (100%)  0 (0%)    0 (0%)
BlogPost             1      1 (100%)  0 (0%)    0 (0%)
BlogCategory         1      1 (100%)  0 (0%)    0 (0%)
-----------------------------------------------------------------
AVERAGE                     100%      0%        0%

=================================================================

⚠️  Low Russian coverage: 0% (recommended: 80%+)
⚠️  Low Uzbek coverage: 0% (recommended: 80%+)

💡 Tip: Add missing translations via Admin Panel or seed scripts
```

## Migration Tools

### 1. Data Migration Script

**Location:** `apps/api/scripts/migrate-to-translations.ts`

**Purpose:** Populate translation tables from existing English data

**Usage:**
```bash
cd apps/api
pnpm tsx scripts/migrate-to-translations.ts
```

**Features:**
- Idempotent (safe to run multiple times)
- Skips existing translations
- Reports statistics
- Handles errors gracefully

### 2. Coverage Check API

**Endpoint:** `GET /api/health/translations`

**Response:**
```json
{
  "timestamp": "2026-01-04T07:45:00.000Z",
  "entities": [
    {
      "entity": "Tour",
      "total": 2,
      "en": 2,
      "ru": 0,
      "uz": 0,
      "enPercent": 100,
      "ruPercent": 0,
      "uzPercent": 0
    }
  ],
  "summary": {
    "totalEntities": 7,
    "avgENPercent": 100,
    "avgRUPercent": 0,
    "avgUZPercent": 0
  }
}
```

## Frontend Integration

### API Calls

Frontend should send `locale` parameter:

```typescript
// OLD
const tours = await fetch('/api/tours');

// NEW
const locale = useLocale(); // from next-intl
const tours = await fetch(`/api/tours?locale=${locale}`);
```

**Current Status:** ⚠️ Temporarily commented out (backend doesn't support yet)

### Fallback Strategy

If translation doesn't exist for requested locale:
1. Try default locale (EN)
2. Show error message if even EN is missing

## Admin Panel Integration

### Translation Management

**Features needed:**
1. Translation coverage dashboard widget
2. Edit translations per entity
3. Bulk translation tools
4. Flag missing translations

**Priority:**
- P0: Add RU/UZ translations manually
- P1: Translation coverage widget
- P2: Bulk translation import/export
- P3: AI-assisted translation suggestions

## Testing Strategy

### Unit Tests

Test each service with different locales:

```typescript
describe('ToursService', () => {
  it('should return tour in English', async () => {
    const tour = await service.findOne('tour-slug', Locale.en);
    expect(tour.title).toBe('Ancient Silk Road');
  });

  it('should return tour in Russian', async () => {
    const tour = await service.findOne('tour-slug', Locale.ru);
    expect(tour.title).toBe('Древний Шелковый путь');
  });

  it('should fallback to EN if translation missing', async () => {
    const tour = await service.findOne('new-tour-slug', Locale.uz);
    expect(tour.title).toBeTruthy(); // Should have EN fallback
  });
});
```

### E2E Tests

Test API endpoints with locale parameter:

```typescript
it('/api/tours (GET) - with locale', () => {
  return request(app.getHttpServer())
    .get('/api/tours?locale=ru')
    .expect(200)
    .expect((res) => {
      expect(res.body.data[0].title).toMatch(/[а-яА-Я]/); // Cyrillic
    });
});
```

## Rollback Plan

If migration causes issues:

1. **Immediate Rollback** (if critical bug):
   ```bash
   cd apps/api
   npx prisma migrate resolve --rolled-back 20260104051353_i18n_translation_tables
   git revert <commit-hash>
   pnpm build
   pm2 restart jahongir-dev-api
   ```

2. **Partial Rollback** (if specific entity broken):
   - Keep migration applied
   - Fix broken service code
   - Redeploy

3. **Data Preservation**:
   - Translation tables keep all data
   - Can recreate deprecated columns via migration
   - No data loss expected

## Performance Considerations

### Database Indexes

All translation tables have composite index on `(entityId, locale)` for fast lookup:

```sql
CREATE INDEX "TourTranslation_tourId_locale_idx" ON "TourTranslation"("tourId", "locale");
```

### Query Optimization

**Avoid N+1 queries** - Always include translations in initial query:

```typescript
// ❌ BAD (N+1 problem)
const tours = await prisma.tour.findMany();
for (const tour of tours) {
  tour.translations = await prisma.tourTranslation.findMany({
    where: { tourId: tour.id }
  });
}

// ✅ GOOD (single query with join)
const tours = await prisma.tour.findMany({
  include: {
    translations: {
      where: { locale }
    }
  }
});
```

### Caching Strategy

Consider caching translated content:

```typescript
@Injectable()
export class ToursService {
  async findAll(locale: Locale) {
    const cacheKey = `tours:${locale}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const tours = await this.fetchToursWithTranslations(locale);

    await this.redis.set(cacheKey, JSON.stringify(tours), 'EX', 300); // 5 min

    return tours;
  }
}
```

## Next Steps

1. **Immediate** (blocking deployment):
   - [ ] Update all services to use translations
   - [ ] Fix TypeScript errors
   - [ ] Test API endpoints with locale parameter
   - [ ] Re-enable frontend locale parameters

2. **Short-term** (1-2 weeks):
   - [ ] Add RU/UZ translations via admin panel
   - [ ] Build translation coverage dashboard widget
   - [ ] Add fallback logic for missing translations
   - [ ] Update API documentation with locale parameter

3. **Long-term** (1-2 months):
   - [ ] Achieve >80% translation coverage for RU/UZ
   - [ ] Remove deprecated columns (Phase C)
   - [ ] Implement translation caching
   - [ ] Add bulk translation tools

## References

- Migration file: `apps/api/prisma/migrations/20260104051353_i18n_translation_tables/migration.sql`
- Prisma schema: `apps/api/prisma/schema.prisma`
- Translation coverage service: `apps/api/src/common/services/translation-coverage.service.ts`
- Migration script: `apps/api/scripts/migrate-to-translations.ts`

---

**Last Updated:** 2026-01-04
**Author:** Claude Sonnet 4.5
**Status:** Phase B (Code Migration) IN PROGRESS
