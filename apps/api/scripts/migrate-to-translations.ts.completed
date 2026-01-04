#!/usr/bin/env ts-node
/**
 * Data migration script: Populate translation tables from existing English data
 *
 * Phase A: Safe Migration
 * - Keep old English columns (deprecated)
 * - Create EN translation rows from existing data
 * - Verify data integrity
 *
 * Usage: pnpm tsx scripts/migrate-to-translations.ts
 */

import { PrismaClient, Locale } from '@prisma/client';

const prisma = new PrismaClient();

interface MigrationStats {
  entity: string;
  totalRecords: number;
  migratedToEN: number;
  alreadyHadEN: number;
  errors: number;
}

async function migrateTours(): Promise<MigrationStats> {
  console.log('\n📦 Migrating Tours...');

  const stats: MigrationStats = {
    entity: 'Tour',
    totalRecords: 0,
    migratedToEN: 0,
    alreadyHadEN: 0,
    errors: 0,
  };

  try {
    // Get all tours
    const tours = await prisma.tour.findMany({
      include: {
        translations: true,
      },
    });

    stats.totalRecords = tours.length;
    console.log(`  Found ${tours.length} tours`);

    for (const tour of tours) {
      try {
        // Check if EN translation already exists
        const existingEN = tour.translations.find(t => t.locale === 'en');

        if (existingEN) {
          stats.alreadyHadEN++;
          console.log(`  ✓ Tour "${tour.slug}" already has EN translation`);
          continue;
        }

        // Create EN translation from deprecated columns
        await prisma.tourTranslation.create({
          data: {
            tourId: tour.id,
            locale: Locale.en,
            title: tour.title || `Tour ${tour.slug}`,
            description: tour.description || '',
            shortDescription: tour.shortDescription || undefined,
            highlights: tour.highlights || undefined,
          },
        });

        stats.migratedToEN++;
        console.log(`  ✅ Migrated tour "${tour.slug}" to EN translation`);
      } catch (error) {
        stats.errors++;
        console.error(`  ❌ Error migrating tour "${tour.slug}":`, error.message);
      }
    }
  } catch (error) {
    console.error('  ❌ Fatal error in tour migration:', error.message);
  }

  return stats;
}

async function migrateTourCategories(): Promise<MigrationStats> {
  console.log('\n📦 Migrating Tour Categories...');

  const stats: MigrationStats = {
    entity: 'TourCategory',
    totalRecords: 0,
    migratedToEN: 0,
    alreadyHadEN: 0,
    errors: 0,
  };

  try {
    const categories = await prisma.tourCategory.findMany({
      include: {
        translations: true,
      },
    });

    stats.totalRecords = categories.length;
    console.log(`  Found ${categories.length} categories`);

    for (const category of categories) {
      try {
        const existingEN = category.translations.find(t => t.locale === 'en');

        if (existingEN) {
          stats.alreadyHadEN++;
          console.log(`  ✓ Category "${category.slug}" already has EN translation`);
          continue;
        }

        await prisma.tourCategoryTranslation.create({
          data: {
            categoryId: category.id,
            locale: Locale.en,
            name: category.name || `Category ${category.slug}`,
            description: category.description || undefined,
          },
        });

        stats.migratedToEN++;
        console.log(`  ✅ Migrated category "${category.slug}" to EN translation`);
      } catch (error) {
        stats.errors++;
        console.error(`  ❌ Error migrating category "${category.slug}":`, error.message);
      }
    }
  } catch (error) {
    console.error('  ❌ Fatal error in category migration:', error.message);
  }

  return stats;
}

async function migrateTourFaqs(): Promise<MigrationStats> {
  console.log('\n📦 Migrating Tour FAQs...');

  const stats: MigrationStats = {
    entity: 'TourFaq',
    totalRecords: 0,
    migratedToEN: 0,
    alreadyHadEN: 0,
    errors: 0,
  };

  try {
    const faqs = await prisma.tourFaq.findMany({
      include: {
        translations: true,
      },
    });

    stats.totalRecords = faqs.length;
    console.log(`  Found ${faqs.length} FAQs`);

    for (const faq of faqs) {
      try {
        const existingEN = faq.translations.find(t => t.locale === 'en');

        if (existingEN) {
          stats.alreadyHadEN++;
          continue;
        }

        await prisma.tourFaqTranslation.create({
          data: {
            faqId: faq.id,
            locale: Locale.en,
            question: faq.question || 'FAQ Question',
            answer: faq.answer || 'FAQ Answer',
          },
        });

        stats.migratedToEN++;
        console.log(`  ✅ Migrated FAQ for tour ${faq.tourId}`);
      } catch (error) {
        stats.errors++;
        console.error(`  ❌ Error migrating FAQ ${faq.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('  ❌ Fatal error in FAQ migration:', error.message);
  }

  return stats;
}

async function migrateItineraryItems(): Promise<MigrationStats> {
  console.log('\n📦 Migrating Itinerary Items...');

  const stats: MigrationStats = {
    entity: 'ItineraryItem',
    totalRecords: 0,
    migratedToEN: 0,
    alreadyHadEN: 0,
    errors: 0,
  };

  try {
    const items = await prisma.itineraryItem.findMany({
      include: {
        translations: true,
      },
    });

    stats.totalRecords = items.length;
    console.log(`  Found ${items.length} itinerary items`);

    for (const item of items) {
      try {
        const existingEN = item.translations.find(t => t.locale === 'en');

        if (existingEN) {
          stats.alreadyHadEN++;
          continue;
        }

        await prisma.itineraryItemTranslation.create({
          data: {
            itemId: item.id,
            locale: Locale.en,
            title: item.title || `Day ${item.day}`,
            description: item.description || '',
            activities: item.activities || undefined,
          },
        });

        stats.migratedToEN++;
        console.log(`  ✅ Migrated itinerary item (Day ${item.day}) for tour ${item.tourId}`);
      } catch (error) {
        stats.errors++;
        console.error(`  ❌ Error migrating itinerary item ${item.id}:`, error.message);
      }
    }
  } catch (error) {
    console.error('  ❌ Fatal error in itinerary migration:', error.message);
  }

  return stats;
}

async function migrateCities(): Promise<MigrationStats> {
  console.log('\n📦 Migrating Cities...');

  const stats: MigrationStats = {
    entity: 'City',
    totalRecords: 0,
    migratedToEN: 0,
    alreadyHadEN: 0,
    errors: 0,
  };

  try {
    const cities = await prisma.city.findMany({
      include: {
        translations: true,
      },
    });

    stats.totalRecords = cities.length;
    console.log(`  Found ${cities.length} cities`);

    for (const city of cities) {
      try {
        const existingEN = city.translations.find(t => t.locale === 'en');

        if (existingEN) {
          stats.alreadyHadEN++;
          console.log(`  ✓ City "${city.name}" already has EN translation`);
          continue;
        }

        await prisma.cityTranslation.create({
          data: {
            cityId: city.id,
            locale: Locale.en,
            name: city.name || 'Unknown City',
            description: city.description || undefined,
          },
        });

        stats.migratedToEN++;
        console.log(`  ✅ Migrated city "${city.name}" to EN translation`);
      } catch (error) {
        stats.errors++;
        console.error(`  ❌ Error migrating city "${city.name}":`, error.message);
      }
    }
  } catch (error) {
    console.error('  ❌ Fatal error in city migration:', error.message);
  }

  return stats;
}

async function migrateBlogPosts(): Promise<MigrationStats> {
  console.log('\n📦 Migrating Blog Posts...');

  const stats: MigrationStats = {
    entity: 'BlogPost',
    totalRecords: 0,
    migratedToEN: 0,
    alreadyHadEN: 0,
    errors: 0,
  };

  try {
    const posts = await prisma.blogPost.findMany({
      include: {
        translations: true,
      },
    });

    stats.totalRecords = posts.length;
    console.log(`  Found ${posts.length} blog posts`);

    for (const post of posts) {
      try {
        const existingEN = post.translations.find(t => t.locale === 'en');

        if (existingEN) {
          stats.alreadyHadEN++;
          console.log(`  ✓ Post "${post.slug}" already has EN translation`);
          continue;
        }

        await prisma.blogPostTranslation.create({
          data: {
            postId: post.id,
            locale: Locale.en,
            title: post.title || `Post ${post.slug}`,
            excerpt: post.excerpt || undefined,
            content: post.content || '',
          },
        });

        stats.migratedToEN++;
        console.log(`  ✅ Migrated blog post "${post.slug}" to EN translation`);
      } catch (error) {
        stats.errors++;
        console.error(`  ❌ Error migrating blog post "${post.slug}":`, error.message);
      }
    }
  } catch (error) {
    console.error('  ❌ Fatal error in blog post migration:', error.message);
  }

  return stats;
}

async function migrateBlogCategories(): Promise<MigrationStats> {
  console.log('\n📦 Migrating Blog Categories...');

  const stats: MigrationStats = {
    entity: 'BlogCategory',
    totalRecords: 0,
    migratedToEN: 0,
    alreadyHadEN: 0,
    errors: 0,
  };

  try {
    const categories = await prisma.blogCategory.findMany({
      include: {
        translations: true,
      },
    });

    stats.totalRecords = categories.length;
    console.log(`  Found ${categories.length} blog categories`);

    for (const category of categories) {
      try {
        const existingEN = category.translations.find(t => t.locale === 'en');

        if (existingEN) {
          stats.alreadyHadEN++;
          console.log(`  ✓ Blog category "${category.slug}" already has EN translation`);
          continue;
        }

        await prisma.blogCategoryTranslation.create({
          data: {
            categoryId: category.id,
            locale: Locale.en,
            name: category.name || `Category ${category.slug}`,
            description: category.description || undefined,
          },
        });

        stats.migratedToEN++;
        console.log(`  ✅ Migrated blog category "${category.slug}" to EN translation`);
      } catch (error) {
        stats.errors++;
        console.error(`  ❌ Error migrating blog category "${category.slug}":`, error.message);
      }
    }
  } catch (error) {
    console.error('  ❌ Fatal error in blog category migration:', error.message);
  }

  return stats;
}

async function printSummary(allStats: MigrationStats[]) {
  console.log('\n' + '='.repeat(60));
  console.log('📊 MIGRATION SUMMARY');
  console.log('='.repeat(60));

  let totalRecords = 0;
  let totalMigrated = 0;
  let totalAlreadyHad = 0;
  let totalErrors = 0;

  console.log('\nEntity'.padEnd(25) + 'Total'.padEnd(10) + 'Migrated'.padEnd(12) + 'Existing'.padEnd(12) + 'Errors');
  console.log('-'.repeat(60));

  for (const stats of allStats) {
    console.log(
      stats.entity.padEnd(25) +
      stats.totalRecords.toString().padEnd(10) +
      stats.migratedToEN.toString().padEnd(12) +
      stats.alreadyHadEN.toString().padEnd(12) +
      stats.errors.toString()
    );

    totalRecords += stats.totalRecords;
    totalMigrated += stats.migratedToEN;
    totalAlreadyHad += stats.alreadyHadEN;
    totalErrors += stats.errors;
  }

  console.log('-'.repeat(60));
  console.log(
    'TOTAL'.padEnd(25) +
    totalRecords.toString().padEnd(10) +
    totalMigrated.toString().padEnd(12) +
    totalAlreadyHad.toString().padEnd(12) +
    totalErrors.toString()
  );

  console.log('\n' + '='.repeat(60));

  if (totalErrors > 0) {
    console.log(`⚠️  Migration completed with ${totalErrors} errors`);
  } else {
    console.log('✅ Migration completed successfully!');
  }

  console.log('\n📝 Next Steps:');
  console.log('  1. Verify data in Prisma Studio or database');
  console.log('  2. Test API endpoints with locale parameter');
  console.log('  3. Add RU and UZ translations via admin panel');
  console.log('  4. After verification, consider removing deprecated columns');
  console.log('='.repeat(60) + '\n');
}

async function main() {
  console.log('🚀 Starting data migration to translation tables...\n');
  console.log('Phase: A (Safe Migration - Keep deprecated columns)');
  console.log('Target Locale: EN (English)\n');

  const allStats: MigrationStats[] = [];

  try {
    allStats.push(await migrateTours());
    allStats.push(await migrateTourCategories());
    allStats.push(await migrateTourFaqs());
    allStats.push(await migrateItineraryItems());
    allStats.push(await migrateCities());
    allStats.push(await migrateBlogPosts());
    allStats.push(await migrateBlogCategories());

    await printSummary(allStats);
  } catch (error) {
    console.error('\n❌ Fatal error during migration:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
