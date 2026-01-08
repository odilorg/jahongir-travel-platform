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

  // Add departures for the sample tour
  console.log('\n📅 Creating tour departures...');

  const today = new Date();
  const departureDates = [
    { offset: 14, spots: 8 },   // 2 weeks from now
    { offset: 28, spots: 12 },  // 4 weeks from now
    { offset: 42, spots: 4 },   // 6 weeks from now (almost full)
    { offset: 56, spots: 0 },   // 8 weeks from now (sold out)
  ];

  for (const dep of departureDates) {
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + dep.offset);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 3); // 3-day tour

    await prisma.tourDeparture.create({
      data: {
        tourId: silkRoadTour.id,
        startDate,
        endDate,
        maxSpots: 12,
        spotsRemaining: dep.spots,
        status: dep.spots === 0 ? 'sold_out' : dep.spots <= 4 ? 'almost_full' : dep.spots <= 8 ? 'filling_fast' : 'available',
        priceModifier: dep.offset <= 14 ? 1.1 : null, // 10% premium for near dates
        isGuaranteed: dep.offset <= 28,
        isActive: true,
      },
    });
  }
  console.log('✓ 4 tour departures created');

  // Add pricing tiers for the sample tour
  console.log('\n💰 Creating pricing tiers...');

  const pricingTiers = [
    {
      minGuests: 1, maxGuests: 2, price: 549, order: 1,
      labels: {
        en: '1-2 guests (Private)',
        ru: '1-2 гостя (Частный)',
        uz: '1-2 mehmon (Xususiy)',
      },
    },
    {
      minGuests: 3, maxGuests: 5, price: 449, order: 2,
      labels: {
        en: '3-5 guests',
        ru: '3-5 гостей',
        uz: '3-5 mehmon',
      },
    },
    {
      minGuests: 6, maxGuests: 12, price: 399, order: 3,
      labels: {
        en: '6+ guests (Group)',
        ru: '6+ гостей (Групповой)',
        uz: '6+ mehmon (Guruh)',
      },
    },
  ];

  for (const tier of pricingTiers) {
    await prisma.tourPricingTier.create({
      data: {
        tourId: silkRoadTour.id,
        minGuests: tier.minGuests,
        maxGuests: tier.maxGuests,
        pricePerPerson: tier.price,
        order: tier.order,
        isActive: true,
        translations: {
          create: [
            { locale: Locale.en, label: tier.labels.en },
            { locale: Locale.ru, label: tier.labels.ru },
            { locale: Locale.uz, label: tier.labels.uz },
          ],
        },
      },
    });
  }
  console.log('✓ 3 pricing tiers created with translations');

  // Add FAQs for the sample tour
  console.log('\n❓ Creating tour FAQs...');

  const faqs = [
    {
      order: 1,
      translations: {
        en: {
          question: 'What is the best time to visit Uzbekistan?',
          answer: 'The best time to visit Uzbekistan is during spring (April-May) and autumn (September-October) when the weather is mild and pleasant. Summers can be very hot, especially in desert areas.',
        },
        ru: {
          question: 'Когда лучше всего посетить Узбекистан?',
          answer: 'Лучшее время для посещения Узбекистана - весна (апрель-май) и осень (сентябрь-октябрь), когда погода мягкая и приятная. Летом может быть очень жарко, особенно в пустынных районах.',
        },
        uz: {
          question: 'O\'zbekistonga qachon tashrif buyurish yaxshiroq?',
          answer: 'O\'zbekistonga tashrif buyurish uchun eng yaxshi vaqt - bahor (aprel-may) va kuz (sentabr-oktabr), ob-havo yumshoq va yoqimli bo\'lganda. Yoz juda issiq bo\'lishi mumkin, ayniqsa cho\'l hududlarida.',
        },
      },
    },
    {
      order: 2,
      translations: {
        en: {
          question: 'Do I need a visa to visit Uzbekistan?',
          answer: 'Many nationalities can visit Uzbekistan visa-free for up to 30 days. Please check with your local embassy or our team for the most current visa requirements based on your nationality.',
        },
        ru: {
          question: 'Нужна ли мне виза для посещения Узбекистана?',
          answer: 'Граждане многих стран могут посещать Узбекистан без визы сроком до 30 дней. Пожалуйста, уточните в местном посольстве или у нашей команды актуальные визовые требования для вашего гражданства.',
        },
        uz: {
          question: 'O\'zbekistonga tashrif buyurish uchun viza kerakmi?',
          answer: 'Ko\'p davlat fuqarolari O\'zbekistonga 30 kungacha vizasiz tashrif buyurishlari mumkin. Iltimos, fuqaroligingiz asosida eng so\'nggi viza talablari uchun mahalliy elchixonangiz yoki jamoamiz bilan bog\'laning.',
        },
      },
    },
    {
      order: 3,
      translations: {
        en: {
          question: 'What is included in the tour price?',
          answer: 'The tour price includes accommodation, breakfast, transportation between cities, entrance fees to all sites mentioned in the itinerary, and services of an English-speaking guide. International flights and personal expenses are not included.',
        },
        ru: {
          question: 'Что включено в стоимость тура?',
          answer: 'В стоимость тура входит проживание, завтрак, транспорт между городами, входные билеты на все объекты, указанные в маршруте, и услуги англоговорящего гида. Международные перелёты и личные расходы не включены.',
        },
        uz: {
          question: 'Tur narxiga nima kiradi?',
          answer: 'Tur narxiga turar joy, nonushta, shaharlar orasidagi transport, yo\'nalishda ko\'rsatilgan barcha joylarga kirish to\'lovlari va ingliz tilida gid xizmatlari kiradi. Xalqaro parvozlar va shaxsiy xarajatlar kiritilmagan.',
        },
      },
    },
    {
      order: 4,
      translations: {
        en: {
          question: 'Can I customize the tour itinerary?',
          answer: 'Yes! We specialize in creating personalized travel experiences. Contact our team to discuss your preferences, and we\'ll create a custom itinerary tailored to your interests, schedule, and budget.',
        },
        ru: {
          question: 'Могу ли я настроить маршрут тура?',
          answer: 'Да! Мы специализируемся на создании персонализированных путешествий. Свяжитесь с нашей командой, чтобы обсудить ваши предпочтения, и мы создадим индивидуальный маршрут с учётом ваших интересов, графика и бюджета.',
        },
        uz: {
          question: 'Tur yo\'nalishini o\'zgartirishim mumkinmi?',
          answer: 'Ha! Biz shaxsiylashtirilgan sayohat tajribalarini yaratishga ixtisoslashganmiz. Afzalliklaringizni muhokama qilish uchun jamoamiz bilan bog\'laning va biz qiziqishlaringiz, jadvalingiz va byudjetingizga moslashtirilgan maxsus yo\'nalish yaratamiz.',
        },
      },
    },
  ];

  for (const faq of faqs) {
    await prisma.tourFaq.create({
      data: {
        tourId: silkRoadTour.id,
        order: faq.order,
        translations: {
          create: [
            { locale: Locale.en, question: faq.translations.en.question, answer: faq.translations.en.answer },
            { locale: Locale.ru, question: faq.translations.ru.question, answer: faq.translations.ru.answer },
            { locale: Locale.uz, question: faq.translations.uz.question, answer: faq.translations.uz.answer },
          ],
        },
      },
    });
  }
  console.log('✓ 4 FAQs created with translations');

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
  // 7. ADDITIONAL TOURS
  // ============================================================================
  console.log('\n🎯 Creating additional tours...');

  const bukharaTour = await prisma.tour.create({
    data: {
      price: 399,
      duration: 2,
      maxGroupSize: 8,
      difficulty: 'Easy',
      categoryId: historicalCategory.id,
      images: [
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=800&fit=crop',
      ],
      isFeatured: true,
      showPrice: true,
      isActive: true,
      translations: {
        create: [
          {
            locale: Locale.en,
            title: 'Bukhara Heritage Experience',
            slug: 'bukhara-heritage-experience',
            summary: 'Discover the pearl of Central Asia with its ancient madrasahs and bazaars',
            description: 'Step back in time in Bukhara, one of the best-preserved medieval cities in Central Asia. Explore ancient madrasahs, bustling bazaars, and stunning Islamic architecture.',
            highlights: [
              'UNESCO World Heritage old town',
              'Ancient trading domes',
              'Kalyan Minaret and Mosque',
              'Traditional craft workshops',
            ],
          },
          {
            locale: Locale.ru,
            title: 'Наследие Бухары',
            slug: 'bukhara-heritage-experience',
            summary: 'Откройте для себя жемчужину Центральной Азии с её древними медресе и базарами',
            description: 'Вернитесь в прошлое в Бухаре, одном из наиболее хорошо сохранившихся средневековых городов Центральной Азии.',
            highlights: [
              'Старый город ЮНЕСКО',
              'Древние торговые купола',
              'Минарет и мечеть Калян',
              'Традиционные ремесленные мастерские',
            ],
          },
          {
            locale: Locale.uz,
            title: 'Buxoro merosi tajribasi',
            slug: 'bukhara-heritage-experience',
            summary: 'Qadimiy madrasa va bozorlar bilan Markaziy Osiyo marvaridini kashf eting',
            description: 'Markaziy Osiyodagi eng yaxshi saqlanib qolgan o\'rta asr shaharlaridan biri bo\'lgan Buxoroda vaqtga qaytib boring.',
            highlights: [
              'UNESCO Jahon merosi eski shahar',
              'Qadimiy savdo gumbazlari',
              'Kalon minorasi va masjidi',
              'An\'anaviy hunarmandchilik ustaxonalari',
            ],
          },
        ],
      },
    },
  });

  const adventureTour = await prisma.tour.create({
    data: {
      price: 799,
      duration: 7,
      maxGroupSize: 10,
      difficulty: 'Moderate',
      categoryId: adventureCategory.id,
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
      ],
      isFeatured: false,
      showPrice: true,
      isActive: true,
      translations: {
        create: [
          {
            locale: Locale.en,
            title: 'Trekking in the Chimgan Mountains',
            slug: 'chimgan-mountains-trekking',
            summary: 'Active adventure in the mountains near Tashkent',
            description: 'Experience the natural beauty of Uzbekistan with hiking, trekking, and outdoor activities in the stunning Chimgan mountain range.',
            highlights: [
              'Mountain trekking routes',
              'Camping under the stars',
              'Local village homestays',
              'Fresh mountain air',
            ],
          },
          {
            locale: Locale.ru,
            title: 'Треккинг в горах Чимган',
            slug: 'chimgan-mountains-trekking',
            summary: 'Активное приключение в горах рядом с Ташкентом',
            description: 'Испытайте природную красоту Узбекистана с пешими походами, треккингом и активным отдыхом в потрясающих горах Чимган.',
            highlights: [
              'Горные маршруты для треккинга',
              'Кемпинг под звёздами',
              'Проживание в местных деревнях',
              'Свежий горный воздух',
            ],
          },
          {
            locale: Locale.uz,
            title: 'Chimg\'on tog\'larida trekking',
            slug: 'chimgan-mountains-trekking',
            summary: 'Toshkent yaqinidagi tog\'larda faol sarguzasht',
            description: 'Chimg\'on tog\' tizmasida piyoda sayohat, trekking va ochiq havoda faoliyat bilan O\'zbekistonning tabiat go\'zalligini his eting.',
            highlights: [
              'Tog\' trekking yo\'llari',
              'Yulduzlar ostida lager',
              'Mahalliy qishloq uylarida turar joy',
              'Toza tog\' havosi',
            ],
          },
        ],
      },
    },
  });

  console.log('✓ 2 additional tours created (3 total)');

  // ============================================================================
  // 8. GUESTS
  // ============================================================================
  console.log('\n👥 Creating sample guests...');

  const guest1 = await prisma.guest.create({
    data: {
      email: 'john.smith@email.com',
      name: 'John Smith',
      phone: '+1-555-0101',
      country: 'United States',
      preferredLanguage: 'en',
      totalBookings: 2,
      totalSpent: 1098,
      lastBookingAt: new Date('2025-11-15'),
    },
  });

  const guest2 = await prisma.guest.create({
    data: {
      email: 'marie.dubois@email.fr',
      name: 'Marie Dubois',
      phone: '+33-6-12-34-56-78',
      country: 'France',
      preferredLanguage: 'en',
      totalBookings: 1,
      totalSpent: 549,
      lastBookingAt: new Date('2025-12-20'),
    },
  });

  const guest3 = await prisma.guest.create({
    data: {
      email: 'hans.mueller@email.de',
      name: 'Hans Müller',
      phone: '+49-172-123-4567',
      country: 'Germany',
      preferredLanguage: 'en',
      totalBookings: 3,
      totalSpent: 1647,
      lastBookingAt: new Date('2026-01-05'),
    },
  });

  console.log('✓ 3 guests created');

  // ============================================================================
  // 9. GUIDES
  // ============================================================================
  console.log('\n🎓 Creating tour guides...');

  const guide1 = await prisma.guide.create({
    data: {
      name: 'Aziz Karimov',
      phone: '+998-90-123-4567',
      email: 'aziz.guide@jahongir-travel.uz',
      languages: ['uz', 'ru', 'en'],
      notes: 'Expert in Silk Road history. 15 years of guiding experience. Specializes in Samarkand and Bukhara tours.',
      isActive: true,
    },
  });

  const guide2 = await prisma.guide.create({
    data: {
      name: 'Dilnoza Sharipova',
      phone: '+998-91-234-5678',
      email: 'dilnoza.guide@jahongir-travel.uz',
      languages: ['uz', 'ru', 'en', 'fr'],
      notes: 'Certified cultural heritage specialist. Fluent in 4 languages. Excellent with family groups.',
      isActive: true,
    },
  });

  const guide3 = await prisma.guide.create({
    data: {
      name: 'Rustam Ibragimov',
      phone: '+998-93-345-6789',
      email: 'rustam.guide@jahongir-travel.uz',
      languages: ['uz', 'ru', 'en', 'de'],
      notes: 'Mountain trekking specialist. First aid certified. 10+ years experience in adventure tours.',
      isActive: true,
    },
  });

  console.log('✓ 3 guides created');

  // ============================================================================
  // 10. DRIVERS & VEHICLES
  // ============================================================================
  console.log('\n🚗 Creating drivers and vehicles...');

  const driver1 = await prisma.driver.create({
    data: {
      name: 'Sardor Mahmudov',
      phone: '+998-90-111-2222',
      licenseNumber: 'AB1234567',
      languages: ['uz', 'ru', 'en'],
      notes: 'Professional driver with 20 years experience. Clean driving record. Excellent knowledge of routes.',
      isActive: true,
    },
  });

  const vehicle1 = await prisma.vehicle.create({
    data: {
      plateNumber: '01-A-123-ABC',
      make: 'Toyota',
      model: 'Hiace',
      year: 2022,
      color: 'White',
      capacity: 12,
      type: 'minivan',
      isActive: true,
      drivers: {
        create: {
          driverId: driver1.id,
          isPrimary: true,
        },
      },
    },
  });

  const driver2 = await prisma.driver.create({
    data: {
      name: 'Bakhtiyar Rahimov',
      phone: '+998-91-222-3333',
      licenseNumber: 'AB2345678',
      languages: ['uz', 'ru'],
      notes: 'Experienced with long-distance routes. Comfortable, smooth driving style. Very punctual.',
      isActive: true,
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      plateNumber: '01-B-456-DEF',
      make: 'Mercedes-Benz',
      model: 'Sprinter',
      year: 2021,
      color: 'Silver',
      capacity: 15,
      type: 'van',
      isActive: true,
      drivers: {
        create: {
          driverId: driver2.id,
          isPrimary: true,
        },
      },
    },
  });

  const driver3 = await prisma.driver.create({
    data: {
      name: 'Sherzod Alimov',
      phone: '+998-93-333-4444',
      licenseNumber: 'AB3456789',
      languages: ['uz', 'ru', 'en'],
      notes: 'Luxury vehicle specialist. VIP service experience. Speaks basic English.',
      isActive: true,
    },
  });

  const vehicle3 = await prisma.vehicle.create({
    data: {
      plateNumber: '01-C-789-GHI',
      make: 'Toyota',
      model: 'Land Cruiser',
      year: 2023,
      color: 'Black',
      capacity: 7,
      type: 'suv',
      isActive: true,
      drivers: {
        create: {
          driverId: driver3.id,
          isPrimary: true,
        },
      },
    },
  });

  console.log('✓ 3 drivers created');
  console.log('✓ 3 vehicles created');

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
  console.log('  • 3 tours (9 translations total)');
  console.log('  • 4 tour departures');
  console.log('  • 3 pricing tiers (9 translations total)');
  console.log('  • 4 tour FAQs (12 translations total)');
  console.log('  • 1 blog post (3 translations total)');
  console.log('  • 3 guests');
  console.log('  • 3 guides');
  console.log('  • 3 drivers');
  console.log('  • 3 vehicles');
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
