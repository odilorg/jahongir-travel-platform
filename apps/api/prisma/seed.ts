import { PrismaClient, Locale } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting i18n database seeding...\n');

  // ============================================================================
  // 1. USERS
  // ============================================================================
  console.log('👤 Creating users...');

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@jahongir-travel.uz' },
    update: {
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      emailVerified: true,
      isActive: true,
    },
    create: {
      name: 'Admin User',
      email: 'admin@jahongir-travel.uz',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      emailVerified: true,
      isActive: true,
    },
  });
  console.log('✓ Admin user created');

  // ============================================================================
  // 2. TOUR CATEGORIES (with translations)
  // ============================================================================
  console.log('\n📂 Creating tour categories with translations...');

  // Cultural Tours
  const culturalCategory = await prisma.tourCategory.create({
    data: {
      icon: '🏛️',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop',
      order: 1,
      isActive: true,
      translations: {
        create: [
          {
            locale: Locale.en,
            name: 'Cultural Tours',
            slug: 'cultural-tours',
            description: 'Explore the rich cultural heritage of Uzbekistan, from ancient Silk Road cities to traditional crafts.',
          },
          {
            locale: Locale.ru,
            name: 'Культурные туры',
            slug: 'cultural-tours',
            description: 'Исследуйте богатое культурное наследие Узбекистана, от древних городов Великого шёлкового пути до традиционных ремёсел.',
          },
          {
            locale: Locale.uz,
            name: 'Madaniy sayohatlar',
            slug: 'madaniy-sayohatlar',
            description: 'O\'zbekistonning boy madaniy merosini, qadimiy Buyuk Ipak yo\'li shaharlaridan an\'anaviy hunarmandchilikkacha o\'rganing.',
          },
        ],
      },
    },
  });

  // Historical Tours
  const historicalCategory = await prisma.tourCategory.create({
    data: {
      icon: '🕌',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop',
      order: 2,
      isActive: true,
      translations: {
        create: [
          {
            locale: Locale.en,
            name: 'Historical Tours',
            slug: 'historical-tours',
            description: 'Journey through millennia of history, visiting ancient monuments and UNESCO sites.',
          },
          {
            locale: Locale.ru,
            name: 'Исторические туры',
            slug: 'historical-tours',
            description: 'Путешествие сквозь тысячелетия истории, посещение древних памятников и объектов ЮНЕСКО.',
          },
          {
            locale: Locale.uz,
            name: 'Tarixiy sayohatlar',
            slug: 'tarixiy-sayohatlar',
            description: 'Ming yillik tarix orqali sayohat qiling, qadimiy yodgorliklar va UNESCO ob\'ektlarini ziyorat qiling.',
          },
        ],
      },
    },
  });

  // Adventure Tours
  const adventureCategory = await prisma.tourCategory.create({
    data: {
      icon: '🏔️',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      order: 3,
      isActive: true,
      translations: {
        create: [
          {
            locale: Locale.en,
            name: 'Adventure Tours',
            slug: 'adventure-tours',
            description: 'Trekking, hiking, and outdoor adventures in mountains and deserts.',
          },
          {
            locale: Locale.ru,
            name: 'Приключенческие туры',
            slug: 'adventure-tours',
            description: 'Треккинг, походы и приключения на свежем воздухе в горах и пустынях.',
          },
          {
            locale: Locale.uz,
            name: 'Sarguzasht sayohatlari',
            slug: 'sarguzasht-sayohatlari',
            description: 'Tog\'lar va cho\'llarda trekking, piyoda sayohat va ochiq havoda sarguzashtlar.',
          },
        ],
      },
    },
  });

  // Family Tours
  const familyCategory = await prisma.tourCategory.create({
    data: {
      icon: '👨‍👩‍👧‍👦',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop',
      order: 4,
      isActive: true,
      translations: {
        create: [
          {
            locale: Locale.en,
            name: 'Family Tours',
            slug: 'family-tours',
            description: 'Family-friendly tours for travelers of all ages.',
          },
          {
            locale: Locale.ru,
            name: 'Семейные туры',
            slug: 'family-tours',
            description: 'Семейные туры для путешественников всех возрастов.',
          },
          {
            locale: Locale.uz,
            name: 'Oilaviy sayohatlar',
            slug: 'oilaviy-sayohatlar',
            description: 'Barcha yoshdagi sayohatchilar uchun oilaviy sayohatlar.',
          },
        ],
      },
    },
  });

  console.log('✓ 4 tour categories created with 3 languages each');

  // ============================================================================
  // 3. CITIES (with translations)
  // ============================================================================
  console.log('\n🏙️ Creating cities with translations...');

  const samarkand = await prisma.city.create({
    data: {
      latitude: 39.6270,
      longitude: 66.9750,
      translations: {
        create: [
          {
            locale: Locale.en,
            name: 'Samarkand',
            slug: 'samarkand',
            description: 'Ancient city on the Silk Road, home to stunning Islamic architecture including Registan Square.',
          },
          {
            locale: Locale.ru,
            name: 'Самарканд',
            slug: 'samarkand',
            description: 'Древний город на Великом шёлковом пути, дом потрясающей исламской архитектуры, включая площадь Регистан.',
          },
          {
            locale: Locale.uz,
            name: 'Samarqand',
            slug: 'samarqand',
            description: 'Buyuk Ipak yo\'lidagi qadimiy shahar, Registon maydoni kabi ajoyib islom me\'morchiligining uyidir.',
          },
        ],
      },
    },
  });

  const bukhara = await prisma.city.create({
    data: {
      latitude: 39.7747,
      longitude: 64.4286,
      translations: {
        create: [
          {
            locale: Locale.en,
            name: 'Bukhara',
            slug: 'bukhara',
            description: 'One of the oldest continuously inhabited cities in Central Asia, UNESCO World Heritage site.',
          },
          {
            locale: Locale.ru,
            name: 'Бухара',
            slug: 'bukhara',
            description: 'Один из старейших постоянно населённых городов Центральной Азии, объект Всемирного наследия ЮНЕСКО.',
          },
          {
            locale: Locale.uz,
            name: 'Buxoro',
            slug: 'buxoro',
            description: 'Markaziy Osiyodagi eng qadimiy doimiy aholi yashaydigan shaharlardan biri, UNESCO Jahon merosi obyekti.',
          },
        ],
      },
    },
  });

  const khiva = await prisma.city.create({
    data: {
      latitude: 41.3775,
      longitude: 60.3641,
      translations: {
        create: [
          {
            locale: Locale.en,
            name: 'Khiva',
            slug: 'khiva',
            description: 'Well-preserved ancient walled city with stunning architecture and rich history.',
          },
          {
            locale: Locale.ru,
            name: 'Хива',
            slug: 'khiva',
            description: 'Хорошо сохранившийся древний город-крепость с потрясающей архитектурой и богатой историей.',
          },
          {
            locale: Locale.uz,
            name: 'Xiva',
            slug: 'xiva',
            description: 'Yaxshi saqlanib qolgan qadimiy qal\'ali shahar, ajoyib me\'morchilik va boy tarixga ega.',
          },
        ],
      },
    },
  });

  const tashkent = await prisma.city.create({
    data: {
      latitude: 41.2995,
      longitude: 69.2401,
      translations: {
        create: [
          {
            locale: Locale.en,
            name: 'Tashkent',
            slug: 'tashkent',
            description: 'Modern capital of Uzbekistan blending Soviet architecture with traditional bazaars.',
          },
          {
            locale: Locale.ru,
            name: 'Ташкент',
            slug: 'tashkent',
            description: 'Современная столица Узбекистана, сочетающая советскую архитектуру с традиционными базарами.',
          },
          {
            locale: Locale.uz,
            name: 'Toshkent',
            slug: 'toshkent',
            description: 'O\'zbekistonning zamonaviy poytaxti, sovet me\'morchiligi bilan an\'anaviy bozorlarni birlashtiradi.',
          },
        ],
      },
    },
  });

  console.log('✓ 4 cities created with 3 languages each');

  // ============================================================================
  // 4. BLOG CATEGORIES (with translations)
  // ============================================================================
  console.log('\n📝 Creating blog categories with translations...');

  const travelTips = await prisma.blogCategory.create({
    data: {
      translations: {
        create: [
          {
            locale: Locale.en,
            name: 'Travel Tips',
            slug: 'travel-tips',
            description: 'Essential travel tips and advice for visiting Uzbekistan',
          },
          {
            locale: Locale.ru,
            name: 'Советы путешественникам',
            slug: 'travel-tips',
            description: 'Важные советы и рекомендации для посещения Узбекистана',
          },
          {
            locale: Locale.uz,
            name: 'Sayohat maslahatlari',
            slug: 'travel-tips',
            description: 'O\'zbekistonga tashrif buyurish uchun muhim maslahatlar va tavsiyalar',
          },
        ],
      },
    },
  });

  console.log('✓ 1 blog category created with 3 languages');

  // ============================================================================
  // 5. SAMPLE TOUR (with translations and relations)
  // ============================================================================
  console.log('\n🎯 Creating sample tour with translations...');

  const silkRoadTour = await prisma.tour.create({
    data: {
      price: 549,
      duration: 3,
      maxGroupSize: 12,
      difficulty: 'Easy',
      categoryId: culturalCategory.id,
      images: [
        'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&h=800&fit=crop',
      ],
      isFeatured: true,
      showPrice: true,
      isActive: true,
      translations: {
        create: [
          {
            locale: Locale.en,
            title: 'Ancient Silk Road Discovery',
            slug: 'ancient-silk-road-discovery',
            summary: 'Explore the legendary cities of Samarkand, Bukhara, and Khiva',
            description: 'Embark on a journey through time along the ancient Silk Road...',
            highlights: [
              'Visit UNESCO World Heritage sites',
              'Explore Registan Square',
              'Traditional Uzbek cuisine',
              'Expert local guides',
            ],
          },
          {
            locale: Locale.ru,
            title: 'Открытие древнего Шёлкового пути',
            slug: 'ancient-silk-road-discovery',
            summary: 'Исследуйте легендарные города Самарканд, Бухару и Хиву',
            description: 'Отправьтесь в путешествие во времени по древнему Шёлковому пути...',
            highlights: [
              'Посещение объектов Всемирного наследия ЮНЕСКО',
              'Исследование площади Регистан',
              'Традиционная узбекская кухня',
              'Опытные местные гиды',
            ],
          },
          {
            locale: Locale.uz,
            title: 'Qadimiy Ipak yo\'lini kashf etish',
            slug: 'ancient-silk-road-discovery',
            summary: 'Samarqand, Buxoro va Xiva afsonaviy shaharlarini o\'rganing',
            description: 'Qadimiy Ipak yo\'li bo\'ylab vaqt ichida sayohatga chiqing...',
            highlights: [
              'UNESCO Jahon merosi ob\'ektlariga tashrif',
              'Registon maydonini o\'rganish',
              'An\'anaviy o\'zbek oshxonasi',
              'Tajribali mahalliy ekskursiya qo\'llanmalari',
            ],
          },
        ],
      },
    },
  });

  console.log('✓ Sample tour created with 3 languages');

  // ============================================================================
  // 6. SAMPLE BLOG POST (with translations)
  // ============================================================================
  console.log('\n📰 Creating sample blog post with translations...');

  const blogPost = await prisma.blogPost.create({
    data: {
      featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
      authorId: adminUser.id,
      categoryId: travelTips.id,
      publishedAt: new Date(),
      status: 'published',
      translations: {
        create: [
          {
            locale: Locale.en,
            title: 'Top 10 Things to Do in Samarkand',
            slug: 'top-10-things-samarkand',
            excerpt: 'Discover the best attractions and activities in this ancient Silk Road city',
            content: 'Samarkand is one of the oldest inhabited cities in Central Asia...',
          },
          {
            locale: Locale.ru,
            title: 'Топ-10 вещей, которые нужно сделать в Самарканде',
            slug: 'top-10-things-samarkand',
            excerpt: 'Откройте для себя лучшие достопримечательности и развлечения в этом древнем городе Шёлкового пути',
            content: 'Самарканд - один из старейших населенных городов Центральной Азии...',
          },
          {
            locale: Locale.uz,
            title: 'Samarqandda qilish kerak bo\'lgan 10 ta narsa',
            slug: 'top-10-things-samarkand',
            excerpt: 'Bu qadimiy Ipak yo\'li shahrida eng yaxshi diqqatga sazovor joylar va tadbirlarni kashf eting',
            content: 'Samarqand Markaziy Osiyodagi eng qadimiy aholi yashaydigan shaharlardan biridir...',
          },
        ],
      },
    },
  });

  console.log('✓ Sample blog post created with 3 languages');

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('\n' + '='.repeat(60));
  console.log('✅ Database seeding completed successfully!');
  console.log('='.repeat(60));
  console.log('\n📊 Created:');
  console.log('  • 1 admin user');
  console.log('  • 4 tour categories (12 translations total)');
  console.log('  • 4 cities (12 translations total)');
  console.log('  • 1 blog category (3 translations total)');
  console.log('  • 1 sample tour (3 translations total)');
  console.log('  • 1 blog post (3 translations total)');
  console.log('\n🌍 Languages: EN, RU, UZ');
  console.log('');
}

main()
  .catch((e) => {
    console.error('\n❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
