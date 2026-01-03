# i18n Conventions & Guidelines

**Project:** Jahongir Travel Platform
**Last Updated:** 2026-01-03
**Applies To:** apps/web, apps/admin, apps/api

---

## Supported Locales

The platform supports three languages:

| Locale Code | Language | Script | Default? | URL Prefix |
|-------------|----------|--------|----------|------------|
| `ru` | Russian | Cyrillic | ✅ Yes | None (/) |
| `en` | English | Latin | ❌ No | `/en/` |
| `uz` | Uzbek | Latin | ❌ No | `/uz/` |

**Default Locale:** Russian (`ru`) - No URL prefix for cleaner URLs

---

## Locale Fallback Strategy

### Resolution Order

When content is requested in a specific locale, the system tries:

```
1. Requested Locale (e.g., 'ru')
   ↓ (if not found)
2. English ('en') - Fallback
   ↓ (if not found)
3. First Available Locale
   ↓ (if none)
4. Return null or error
```

### Examples

| Requested | Available Locales | Returned |
|-----------|-------------------|----------|
| `ru` | `ru`, `en`, `uz` | `ru` ✅ |
| `ru` | `en`, `uz` | `en` (fallback) |
| `uz` | `en` | `en` (fallback) |
| `de` (invalid) | `ru`, `en` | `en` (fallback) |
| `ru` | (none) | Error or null |

### API Implementation

All API endpoints that return translatable content should:

1. Accept `locale` parameter (query string or header)
2. Default to `'en'` if not provided
3. Return English translation if requested locale missing
4. Include `locale` field in response to indicate which locale was returned

**Example:**
```typescript
@Get(':slug')
async findBySlug(
  @Param('slug') slug: string,
  @Query('locale') locale: string = 'en'
) {
  return this.toursService.findBySlug(slug, locale);
}
```

---

## Required Fields Per Locale

### Minimum Translation Requirements

Every translatable entity **must** have an English (`en`) translation before publishing.

| Entity | Required Fields (EN) | Optional Fields |
|--------|---------------------|-----------------|
| **Tour** | title, slug, description | summary, highlights |
| **Blog Post** | title, slug, content | excerpt, metaTitle, metaDescription |
| **Category** | name, slug | description |
| **FAQ** | question, answer | - |
| **Itinerary Item** | title, description | activities |
| **City** | name | description |

### Validation Rules

**API Level:**
- Creating a tour without English translation → `400 Bad Request`
- Publishing a tour without English translation → `400 Bad Request`
- Draft tours can have partial translations

**Admin UI:**
- Show warning if English translation missing
- Disable "Publish" button until English translation complete
- Show translation coverage indicator (e.g., "2/3 languages")

---

## Slug Rules

### General Slug Format

**Format:** `lowercase-kebab-case-with-hyphens`

**Rules:**
- Only alphanumeric characters and hyphens
- No leading/trailing hyphens
- Maximum length: 100 characters
- Must be unique within the same locale and entity type

### Language-Specific Slug Patterns

#### English (`en`)
- **Pattern:** ASCII letters, lowercase, hyphens
- **Example:** `silk-road-journey`, `tashkent-city-tour`
- **Generation:** Auto-generate from title using slugify

#### Russian (`ru`)
- **Pattern:** Cyrillic letters allowed OR transliterated to Latin
- **Examples:**
  - Cyrillic: `шелковый-путь-путешествие`
  - Transliterated: `shelkovyy-put-puteshestvie`
- **Recommendation:** Use transliteration for better SEO and URL compatibility
- **Tool:** Use `transliteration` npm package

#### Uzbek (`uz`)
- **Pattern:** Latin script (official since 1992)
- **Example:** `ipak-yoli-sayohati`, `toshkent-shahar-safari`
- **Generation:** Auto-generate from Uzbek title

### Slug Uniqueness

**Database Constraint:**
```prisma
@@unique([locale, slug])  // Ensures unique slug per locale
```

**Conflict Handling:**
- Same entity, different locales → Different slugs allowed
  - EN: `/en/tours/silk-road-journey`
  - RU: `/ru/tours/шелковый-путь`
  - UZ: `/uz/tours/ipak-yoli-sayohati`

- Different entities, same locale → Append counter
  - First: `tashkent-tour`
  - Second: `tashkent-tour-2`
  - Third: `tashkent-tour-3`

### Slug Editing

**Admin UI Behavior:**
- Auto-generate slug from title on initial creation
- Allow manual editing before save
- Show "Slug already exists" error if conflict
- Suggest alternative slug: `{base-slug}-{counter}`

**SEO Consideration:**
- Changing published slug → Create redirect from old to new
- Store slug history for 301 redirects

---

## API Locale Parameter

The API accepts locale via **two methods** (priority order):

### 1. Query Parameter (Recommended)

**Format:** `?locale=ru` or `?lang=ru`

**Examples:**
```bash
GET /api/tours/silk-road-journey?locale=ru
GET /api/blog/samarkand-guide?locale=en
GET /api/categories?locale=uz
```

**Advantages:**
- ✅ Explicit and clear
- ✅ Easy to test in browser
- ✅ Works with caching
- ✅ Language-specific URLs for SEO

**Default:** If not provided, defaults to `'en'`

### 2. Accept-Language Header (Fallback)

**Format:** `Accept-Language: ru-RU,ru;q=0.9,en;q=0.8`

**Usage:**
```bash
curl -H "Accept-Language: ru" https://api.example.com/tours/123
```

**Parsing:**
```typescript
// Extract primary locale from Accept-Language header
const acceptLang = req.headers['accept-language']; // 'ru-RU,ru;q=0.9,en;q=0.8'
const locale = acceptLang?.split(',')[0]?.split('-')[0] || 'en'; // 'ru'
```

**Advantages:**
- ✅ Standard HTTP header
- ✅ Automatically sent by browsers

**Disadvantages:**
- ❌ Less explicit than query param
- ❌ Harder to debug
- ❌ Caching complications

**Recommendation:** Use query parameter for API calls, Accept-Language for browser requests.

---

## Frontend Locale Routing (apps/web)

### URL Structure with next-intl

**Default Locale (Russian):** No prefix
```
/                     → Russian homepage
/tours                → Russian tours page
/tours/silk-road      → Russian tour detail
/blog                 → Russian blog
```

**English:** `/en/` prefix
```
/en/                  → English homepage
/en/tours             → English tours page
/en/tours/silk-road   → English tour detail
/en/blog              → English blog
```

**Uzbek:** `/uz/` prefix
```
/uz/                  → Uzbek homepage
/uz/tours             → Uzbek tours page
/uz/tours/silk-road   → Uzbek tour detail
/uz/blog              → Uzbek blog
```

### Locale Detection Flow

1. **User visits site:** Check URL prefix (`/en/`, `/uz/`, or none)
2. **If no prefix:** Default to Russian (`ru`)
3. **Store locale in cookie:** `NEXT_LOCALE=ru`
4. **Language switcher:** Update URL prefix and cookie

### Middleware Configuration

**File:** `apps/web/middleware.ts`

```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ru', 'en', 'uz'],
  defaultLocale: 'ru',
  localePrefix: 'as-needed', // No prefix for default locale
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
```

### Language Switcher Component

**Location:** `apps/web/components/LanguageSwitcher.tsx`

**Behavior:**
- Show current locale as active
- Click language → Navigate to same page in new locale
- Preserve query parameters and hash
- Update URL prefix

**Example:**
```
Current: /en/tours/silk-road-journey
User clicks "Русский"
Navigate to: /tours/шелковый-путь (Russian slug)
```

**Slug Handling:**
- Fetch equivalent slug in target locale from API
- If no translation exists → Navigate to homepage in target locale

---

## Translation File Structure

### Static UI Translations

**Location:** `apps/web/messages/{locale}.json`

**Structure:**
```json
{
  "common": {
    "home": "Главная",
    "tours": "Туры",
    "blog": "Блог",
    "contact": "Контакты"
  },
  "tours": {
    "filter": "Фильтр",
    "duration": "Продолжительность",
    "price": "Цена",
    "bookNow": "Забронировать"
  },
  "errors": {
    "notFound": "Страница не найдена",
    "serverError": "Ошибка сервера"
  }
}
```

**Usage in Components:**
```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('tours');
<button>{t('bookNow')}</button>
```

### Dynamic Content (from Database)

**API Response:**
```json
{
  "id": "tour-123",
  "price": 1200,
  "locale": "ru",
  "title": "Путешествие по Шелковому пути",
  "slug": "shelkovyy-put",
  "description": "Откройте для себя древние города..."
}
```

**Frontend Consumption:**
```typescript
const tour = await fetch(`/api/tours/${slug}?locale=${locale}`);
<h1>{tour.title}</h1> // Already localized by API
```

---

## Admin Panel Translation UI

### Translation Tabs

**Layout:** Horizontal tabs for each locale

```
[ English (EN) ] [ Русский (RU) ] [ O'zbek (UZ) ]
─────────────────────────────────────────────────
Title:     [Silk Road Journey              ]
Slug:      [silk-road-journey              ]
Summary:   [Discover the ancient cities... ]
Description: [Large text editor             ]
```

**Rules:**
- English tab shown first (required)
- Show completion indicator per tab: ✅ Complete, ⚠️ Incomplete, ❌ Missing
- Validate required fields before allowing publish

### Translation Status Indicator

**Visual:**
```
Translation Coverage: ██████░░ 67% (2/3 languages)
✅ English (complete)
✅ Russian (complete)
❌ Uzbek (missing)
```

**Actions:**
- Click "Add Uzbek translation" → Open Uzbek tab with empty form
- Auto-save drafts per locale independently

### Bulk Translation Tools (Future)

- **Copy from English:** Auto-populate Russian/Uzbek with English text (for draft)
- **Translation API Integration:** Use Google Translate API for initial draft
- **Translation Memory:** Suggest previously translated similar phrases

---

## Database Conventions

### Naming Conventions

**Base Tables:**
```
Tour
BlogPost
Category
City
```

**Translation Tables:**
```
TourTranslation
BlogPostTranslation
CategoryTranslation
CityTranslation
```

**Pattern:** `{EntityName}Translation`

### Required Columns

All translation tables must have:

```prisma
model XTranslation {
  id        String   @id @default(cuid())
  xId       String   // Foreign key to base table
  x         X        @relation(...)

  locale    String   // 'en' | 'ru' | 'uz'

  // Translatable fields here

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([xId, locale])
  @@index([locale])
}
```

### Cascade Deletion

When base entity is deleted, all translations must be deleted:

```prisma
x  X  @relation(fields: [xId], references: [id], onDelete: Cascade)
```

---

## Testing Conventions

### API Tests

Test locale handling:

```typescript
describe('GET /tours/:slug', () => {
  it('should return Russian translation when locale=ru', async () => {
    const res = await request(app).get('/tours/shelkovyy-put?locale=ru');
    expect(res.body.locale).toBe('ru');
    expect(res.body.title).toBe('Путешествие по Шелковому пути');
  });

  it('should fallback to English when Russian missing', async () => {
    const res = await request(app).get('/tours/new-tour?locale=ru');
    expect(res.body.locale).toBe('en');
    expect(res.body.title).toBe('Silk Road Journey');
  });
});
```

### Frontend Tests

Test language switching:

```typescript
describe('LanguageSwitcher', () => {
  it('should navigate to Russian version when clicked', () => {
    render(<LanguageSwitcher />);
    fireEvent.click(screen.getByText('Русский'));
    expect(router.push).toHaveBeenCalledWith('/tours/shelkovyy-put');
  });
});
```

---

## Performance Considerations

### Caching Strategy

**API Level:**
- Cache responses per locale: `cache:tours:silk-road:ru`, `cache:tours:silk-road:en`
- Invalidate all locale caches when tour updated

**CDN Level:**
- Vary cache by `locale` query parameter
- Separate cache keys for `/en/tours`, `/ru/tours`, `/uz/tours`

### Query Optimization

**Avoid N+1 queries:**

❌ **Bad:**
```typescript
const tours = await prisma.tour.findMany();
for (const tour of tours) {
  const translation = await prisma.tourTranslation.findFirst({
    where: { tourId: tour.id, locale: 'ru' }
  });
}
```

✅ **Good:**
```typescript
const tours = await prisma.tour.findMany({
  include: {
    translations: {
      where: { locale: { in: ['ru', 'en'] } }
    }
  }
});
```

---

## Error Handling

### Missing Translation

**API Response:**
```json
{
  "id": "tour-123",
  "locale": "en",  // Fallback locale
  "requestedLocale": "uz",  // What user requested
  "title": "Silk Road Journey",
  "fallback": true  // Indicates fallback was used
}
```

**Frontend Behavior:**
- Show content in fallback language
- Display notice: "This page is not yet available in Uzbek. Showing English version."

### Invalid Locale

**API Response:**
```json
{
  "statusCode": 400,
  "message": "Invalid locale 'de'. Supported locales: en, ru, uz",
  "error": "Bad Request"
}
```

**Frontend Behavior:**
- Redirect to default locale (`ru`)
- Log error to monitoring system

---

## Migration Checklist

When adding a new translatable entity:

- [ ] Create translation table in Prisma schema
- [ ] Add `@@unique([entityId, locale])` constraint
- [ ] Add indexes: `@@index([locale])`, `@@index([slug])`
- [ ] Set `onDelete: Cascade` on relation
- [ ] Generate and run migration
- [ ] Update API service to handle locale parameter
- [ ] Update DTOs to include translation fields
- [ ] Add translation tabs in admin UI
- [ ] Update frontend to fetch localized content
- [ ] Add tests for locale handling
- [ ] Update API documentation (Swagger)

---

## References

- [ADR-001: Multilingual Architecture](./ADR-001-multilingual.md)
- [next-intl Documentation](https://next-intl-docs.vercel.app/)
- [Prisma Schema Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [ISO 639-1 Language Codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

---

**Document Owner:** Development Team
**Review Frequency:** Quarterly
**Last Review:** 2026-01-03
