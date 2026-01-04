-- ============================================================================
-- STEP 1: Create Locale enum
-- ============================================================================
CREATE TYPE "Locale" AS ENUM ('en', 'ru', 'uz');

-- ============================================================================
-- STEP 2: Create Translation Tables
-- ============================================================================

-- TourTranslation
CREATE TABLE "TourTranslation" (
    "id" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT,
    "description" TEXT,
    "highlights" TEXT[],
    "included" TEXT[],
    "excluded" TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourTranslation_pkey" PRIMARY KEY ("id")
);

-- TourCategoryTranslation
CREATE TABLE "TourCategoryTranslation" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourCategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- ItineraryItemTranslation
CREATE TABLE "ItineraryItemTranslation" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "activities" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItineraryItemTranslation_pkey" PRIMARY KEY ("id")
);

-- TourFaqTranslation
CREATE TABLE "TourFaqTranslation" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourFaqTranslation_pkey" PRIMARY KEY ("id")
);

-- CityTranslation
CREATE TABLE "CityTranslation" (
    "id" TEXT NOT NULL,
    "cityId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CityTranslation_pkey" PRIMARY KEY ("id")
);

-- BlogPostTranslation
CREATE TABLE "BlogPostTranslation" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPostTranslation_pkey" PRIMARY KEY ("id")
);

-- BlogCategoryTranslation
CREATE TABLE "BlogCategoryTranslation" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "locale" "Locale" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- ============================================================================
-- STEP 3: Create Indexes and Constraints
-- ============================================================================

-- TourTranslation
CREATE UNIQUE INDEX "TourTranslation_tourId_locale_key" ON "TourTranslation"("tourId", "locale");
CREATE UNIQUE INDEX "TourTranslation_locale_slug_key" ON "TourTranslation"("locale", "slug");
CREATE INDEX "TourTranslation_locale_idx" ON "TourTranslation"("locale");
CREATE INDEX "TourTranslation_slug_idx" ON "TourTranslation"("slug");
CREATE INDEX "TourTranslation_tourId_idx" ON "TourTranslation"("tourId");

-- TourCategoryTranslation
CREATE UNIQUE INDEX "TourCategoryTranslation_categoryId_locale_key" ON "TourCategoryTranslation"("categoryId", "locale");
CREATE UNIQUE INDEX "TourCategoryTranslation_locale_slug_key" ON "TourCategoryTranslation"("locale", "slug");
CREATE INDEX "TourCategoryTranslation_locale_idx" ON "TourCategoryTranslation"("locale");
CREATE INDEX "TourCategoryTranslation_slug_idx" ON "TourCategoryTranslation"("slug");
CREATE INDEX "TourCategoryTranslation_categoryId_idx" ON "TourCategoryTranslation"("categoryId");

-- ItineraryItemTranslation
CREATE UNIQUE INDEX "ItineraryItemTranslation_itemId_locale_key" ON "ItineraryItemTranslation"("itemId", "locale");
CREATE INDEX "ItineraryItemTranslation_locale_idx" ON "ItineraryItemTranslation"("locale");
CREATE INDEX "ItineraryItemTranslation_itemId_idx" ON "ItineraryItemTranslation"("itemId");

-- TourFaqTranslation
CREATE UNIQUE INDEX "TourFaqTranslation_faqId_locale_key" ON "TourFaqTranslation"("faqId", "locale");
CREATE INDEX "TourFaqTranslation_locale_idx" ON "TourFaqTranslation"("locale");
CREATE INDEX "TourFaqTranslation_faqId_idx" ON "TourFaqTranslation"("faqId");

-- CityTranslation
CREATE UNIQUE INDEX "CityTranslation_cityId_locale_key" ON "CityTranslation"("cityId", "locale");
CREATE UNIQUE INDEX "CityTranslation_locale_slug_key" ON "CityTranslation"("locale", "slug");
CREATE INDEX "CityTranslation_locale_idx" ON "CityTranslation"("locale");
CREATE INDEX "CityTranslation_slug_idx" ON "CityTranslation"("slug");
CREATE INDEX "CityTranslation_cityId_idx" ON "CityTranslation"("cityId");

-- BlogPostTranslation
CREATE UNIQUE INDEX "BlogPostTranslation_postId_locale_key" ON "BlogPostTranslation"("postId", "locale");
CREATE UNIQUE INDEX "BlogPostTranslation_locale_slug_key" ON "BlogPostTranslation"("locale", "slug");
CREATE INDEX "BlogPostTranslation_locale_idx" ON "BlogPostTranslation"("locale");
CREATE INDEX "BlogPostTranslation_slug_idx" ON "BlogPostTranslation"("slug");
CREATE INDEX "BlogPostTranslation_postId_idx" ON "BlogPostTranslation"("postId");

-- BlogCategoryTranslation
CREATE UNIQUE INDEX "BlogCategoryTranslation_categoryId_locale_key" ON "BlogCategoryTranslation"("categoryId", "locale");
CREATE UNIQUE INDEX "BlogCategoryTranslation_locale_slug_key" ON "BlogCategoryTranslation"("locale", "slug");
CREATE INDEX "BlogCategoryTranslation_locale_idx" ON "BlogCategoryTranslation"("locale");
CREATE INDEX "BlogCategoryTranslation_slug_idx" ON "BlogCategoryTranslation"("slug");
CREATE INDEX "BlogCategoryTranslation_categoryId_idx" ON "BlogCategoryTranslation"("categoryId");

-- ============================================================================
-- STEP 4: Add Foreign Keys
-- ============================================================================

ALTER TABLE "TourTranslation" ADD CONSTRAINT "TourTranslation_tourId_fkey"
    FOREIGN KEY ("tourId") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TourCategoryTranslation" ADD CONSTRAINT "TourCategoryTranslation_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "TourCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ItineraryItemTranslation" ADD CONSTRAINT "ItineraryItemTranslation_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES "ItineraryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "TourFaqTranslation" ADD CONSTRAINT "TourFaqTranslation_faqId_fkey"
    FOREIGN KEY ("faqId") REFERENCES "TourFaq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CityTranslation" ADD CONSTRAINT "CityTranslation_cityId_fkey"
    FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BlogPostTranslation" ADD CONSTRAINT "BlogPostTranslation_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "BlogCategoryTranslation" ADD CONSTRAINT "BlogCategoryTranslation_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================================
-- STEP 5: Migrate Existing Data to EN Translations
-- ============================================================================

-- Migrate Tour data
INSERT INTO "TourTranslation" (
    "id", "tourId", "locale", "title", "slug", "summary", "description",
    "highlights", "included", "excluded", "metaTitle", "metaDescription",
    "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid()::TEXT,
    "id",
    'en'::Locale,
    "title",
    "slug",
    "shortDescription",
    "description",
    "highlights",
    "included",
    "excluded",
    "metaTitle",
    "metaDescription",
    "createdAt",
    "updatedAt"
FROM "Tour"
WHERE EXISTS (SELECT 1 FROM "Tour" WHERE "title" IS NOT NULL);

-- Migrate TourCategory data
INSERT INTO "TourCategoryTranslation" (
    "id", "categoryId", "locale", "name", "slug", "description",
    "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid()::TEXT,
    "id",
    'en'::Locale,
    "name",
    "slug",
    "description",
    "createdAt",
    "updatedAt"
FROM "TourCategory"
WHERE "name" IS NOT NULL;

-- Migrate ItineraryItem data
INSERT INTO "ItineraryItemTranslation" (
    "id", "itemId", "locale", "title", "description", "activities",
    "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid()::TEXT,
    "id",
    'en'::Locale,
    "title",
    "description",
    "activities",
    "createdAt",
    "updatedAt"
FROM "ItineraryItem"
WHERE "title" IS NOT NULL;

-- Migrate TourFaq data
INSERT INTO "TourFaqTranslation" (
    "id", "faqId", "locale", "question", "answer",
    "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid()::TEXT,
    "id",
    'en'::Locale,
    "question",
    "answer",
    "createdAt",
    "updatedAt"
FROM "TourFaq"
WHERE "question" IS NOT NULL;

-- Migrate City data
INSERT INTO "CityTranslation" (
    "id", "cityId", "locale", "name", "slug", "description",
    "metaTitle", "metaDescription", "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid()::TEXT,
    "id",
    'en'::Locale,
    "name",
    "slug",
    "description",
    "metaTitle",
    "metaDescription",
    "createdAt",
    "updatedAt"
FROM "City"
WHERE "name" IS NOT NULL;

-- Migrate BlogPost data
INSERT INTO "BlogPostTranslation" (
    "id", "postId", "locale", "title", "slug", "excerpt", "content",
    "metaTitle", "metaDescription", "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid()::TEXT,
    "id",
    'en'::Locale,
    "title",
    "slug",
    "excerpt",
    "content",
    "metaTitle",
    "metaDescription",
    "createdAt",
    "updatedAt"
FROM "BlogPost"
WHERE "title" IS NOT NULL;

-- Migrate BlogCategory data
INSERT INTO "BlogCategoryTranslation" (
    "id", "categoryId", "locale", "name", "slug", "description",
    "createdAt", "updatedAt"
)
SELECT
    gen_random_uuid()::TEXT,
    "id",
    'en'::Locale,
    "name",
    "slug",
    "description",
    "createdAt",
    "updatedAt"
FROM "BlogCategory"
WHERE "name" IS NOT NULL;

-- ============================================================================
-- STEP 6: Drop Old Columns from Base Tables
-- ============================================================================

-- Drop Tour translatable columns and old indexes
DROP INDEX IF EXISTS "Tour_slug_idx";
ALTER TABLE "Tour" DROP COLUMN IF EXISTS "title";
ALTER TABLE "Tour" DROP COLUMN IF EXISTS "slug";
ALTER TABLE "Tour" DROP COLUMN IF EXISTS "description";
ALTER TABLE "Tour" DROP COLUMN IF EXISTS "shortDescription";
ALTER TABLE "Tour" DROP COLUMN IF EXISTS "highlights";
ALTER TABLE "Tour" DROP COLUMN IF EXISTS "included";
ALTER TABLE "Tour" DROP COLUMN IF EXISTS "excluded";
ALTER TABLE "Tour" DROP COLUMN IF EXISTS "metaTitle";
ALTER TABLE "Tour" DROP COLUMN IF EXISTS "metaDescription";
ALTER TABLE "Tour" DROP COLUMN IF EXISTS "metaKeywords";

-- Drop TourCategory translatable columns and old indexes
DROP INDEX IF EXISTS "TourCategory_slug_idx";
ALTER TABLE "TourCategory" DROP COLUMN IF EXISTS "name";
ALTER TABLE "TourCategory" DROP COLUMN IF EXISTS "slug";
ALTER TABLE "TourCategory" DROP COLUMN IF EXISTS "description";

-- Drop ItineraryItem translatable columns
ALTER TABLE "ItineraryItem" DROP COLUMN IF EXISTS "title";
ALTER TABLE "ItineraryItem" DROP COLUMN IF EXISTS "description";
ALTER TABLE "ItineraryItem" DROP COLUMN IF EXISTS "activities";

-- Drop TourFaq translatable columns
ALTER TABLE "TourFaq" DROP COLUMN IF EXISTS "question";
ALTER TABLE "TourFaq" DROP COLUMN IF EXISTS "answer";

-- Drop City translatable columns and old indexes
DROP INDEX IF EXISTS "City_slug_idx";
ALTER TABLE "City" DROP COLUMN IF EXISTS "name";
ALTER TABLE "City" DROP COLUMN IF EXISTS "slug";
ALTER TABLE "City" DROP COLUMN IF EXISTS "description";
ALTER TABLE "City" DROP COLUMN IF EXISTS "metaTitle";
ALTER TABLE "City" DROP COLUMN IF EXISTS "metaDescription";

-- Drop BlogPost translatable columns and old indexes
DROP INDEX IF EXISTS "BlogPost_slug_idx";
ALTER TABLE "BlogPost" DROP COLUMN IF EXISTS "title";
ALTER TABLE "BlogPost" DROP COLUMN IF EXISTS "slug";
ALTER TABLE "BlogPost" DROP COLUMN IF EXISTS "excerpt";
ALTER TABLE "BlogPost" DROP COLUMN IF EXISTS "content";
ALTER TABLE "BlogPost" DROP COLUMN IF EXISTS "metaTitle";
ALTER TABLE "BlogPost" DROP COLUMN IF EXISTS "metaDescription";
ALTER TABLE "BlogPost" DROP COLUMN IF EXISTS "metaKeywords";

-- Drop BlogCategory translatable columns and old indexes
DROP INDEX IF EXISTS "BlogCategory_slug_idx";
ALTER TABLE "BlogCategory" DROP COLUMN IF EXISTS "name";
ALTER TABLE "BlogCategory" DROP COLUMN IF EXISTS "slug";
ALTER TABLE "BlogCategory" DROP COLUMN IF EXISTS "description";
