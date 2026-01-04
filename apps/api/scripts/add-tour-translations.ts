import { PrismaClient, Locale } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Adding multilingual translations to tours...\n');

  // Get existing tours
  const tours = await prisma.tour.findMany({
    include: {
      translations: true,
      category: {
        include: {
          translations: true,
        },
      },
    },
  });

  console.log(`Found ${tours.length} existing tours\n`);

  // Add RU and UZ translations to existing tours
  for (const tour of tours) {
    const enTranslation = tour.translations.find((t) => t.locale === 'en');
    if (!enTranslation) {
      console.log(`⚠️  Skipping tour ${tour.id} - no EN translation found`);
      continue;
    }

    const hasRu = tour.translations.some((t) => t.locale === 'ru');
    const hasUz = tour.translations.some((t) => t.locale === 'uz');

    // Get tour title for logging
    const tourTitle = enTranslation.title;

    // Add Russian translation if missing
    if (!hasRu) {
      const ruTranslations: Record<string, any> = {
        'Classic Uzbekistan: 7-Day Journey': {
          title: 'Классический Узбекистан: 7-дневное путешествие',
          slug: 'classic-uzbekistan-7-days',
          summary: 'Откройте для себя лучшее из Узбекистана за одну неделю',
          description:
            'Познакомьтесь с главными достопримечательностями Узбекистана. Посетите Ташкент, Самарканд, Бухару и Хиву. Восхититесь потрясающей исламской архитектурой, исследуйте древние базары и погрузитесь в местную культуру.',
          highlights: [
            'Площадь Регистан в Самарканде',
            'Мавзолей Гур-Эмир',
            'Арк Бухары',
            'Ичан-Кала в Хиве',
            'Традиционная узбекская кухня',
            'Местные базары и ремесла',
          ],
          included: [
            'Все размещение (отели 3-4 звезды)',
            'Все завтраки и некоторые приемы пищи',
            'Профессиональный англоговорящий гид',
            'Все входные билеты',
            'Комфортабельный транспорт с кондиционером',
            'Билеты на скоростной поезд',
          ],
          excluded: [
            'Международные рейсы',
            'Визовые сборы',
            'Туристическая страховка',
            'Личные расходы',
            'Чаевые',
          ],
          metaTitle: 'Классический тур по Узбекистану - 7 дней | Jahongir Travel',
          metaDescription:
            'Исследуйте города Великого шёлкового пути в нашем классическом 7-дневном туре.',
        },
        'Samarkand Highlights: 3-Day Exploration': {
          title: 'Основные достопримечательности Самарканда: 3-дневное исследование',
          slug: 'samarkand-highlights-3-days',
          summary: 'Проведите 3 дня, исследуя Жемчужину Востока',
          description:
            'Погрузитесь в историю Самарканда. Этот тур исследует величественные памятники в неспешном темпе.',
          highlights: [
            'Площадь Регистан',
            'Некрополь Шахи-Зинда',
            'Мечеть Биби-Ханым',
            'Обсерватория Улугбека',
            'Базар Сиаб',
          ],
          included: [
            '2 ночи в бутик-отеле',
            'Ежедневный завтрак',
            'Опытный местный гид',
            'Все входные билеты',
            'Трансферы из аэропорта',
          ],
          excluded: ['Обед и ужин', 'Личные расходы', 'Чаевые'],
          metaTitle: null,
          metaDescription: null,
        },
      };

      const ruData = ruTranslations[tourTitle];
      if (ruData) {
        await prisma.tourTranslation.create({
          data: {
            tourId: tour.id,
            locale: Locale.ru,
            ...ruData,
          },
        });
        console.log(`✅ Added RU translation for: ${tourTitle}`);
      }
    }

    // Add Uzbek translation if missing
    if (!hasUz) {
      const uzTranslations: Record<string, any> = {
        'Classic Uzbekistan: 7-Day Journey': {
          title: 'Klassik O\'zbekiston: 7 kunlik sayohat',
          slug: 'classic-uzbekistan-7-days',
          summary: 'Bir hafta ichida O\'zbekistonning eng yaxshi joylarini kashf eting',
          description:
            'O\'zbekistonning diqqatga sazovor joylarini kashf eting. Toshkent, Samarqand, Buxoro va Xivaga tashrif buyuring. Ajoyib islom me\'morchiligini tomosha qiling, qadimiy bozorlarni o\'rganing va mahalliy madaniyatga sho\'ng\'ing.',
          highlights: [
            'Samarqanddagi Registon maydoni',
            'G\'ur-Amir maqbarasi',
            'Buxoro Arki',
            'Xivadagi Ichan Qal\'a',
            'An\'anaviy o\'zbek oshxonasi',
            'Mahalliy bozorlar va hunarmandchilik',
          ],
          included: [
            'Barcha turar joy (3-4 yulduzli mehmonxonalar)',
            'Barcha nonushtalar va ba\'zi taomlar',
            'Professional ingliz tilida so\'zlashuvchi gid',
            'Barcha kirish chiptalar',
            'Qulay konditsionerli transport',
            'Yuqori tezlikdagi poyezd chiptalar',
          ],
          excluded: [
            'Xalqaro parvozlar',
            'Viza to\'lovlari',
            'Sayohat sug\'urtasi',
            'Shaxsiy xarajatlar',
            'Maslahatlar',
          ],
          metaTitle: 'Klassik O\'zbekiston sayohati - 7 kun | Jahongir Travel',
          metaDescription:
            'Klassik 7 kunlik sayohatimizda Buyuk Ipak yo\'li shaharlarini o\'rganing.',
        },
        'Samarkand Highlights: 3-Day Exploration': {
          title: 'Samarqand diqqatga sazovor joylari: 3 kunlik sayohat',
          slug: 'samarkand-highlights-3-days',
          summary: 'Sharqning marvaridini o\'rganish uchun 3 kun o\'tkazing',
          description:
            'Samarqand tarixiga sho\'ng\'ing. Bu sayohat ajoyib yodgorliklarni sekin tempda o\'rganadi.',
          highlights: [
            'Registon maydoni',
            'Shohi-Zinda qabristoni',
            'Bibi-Xonim masjidi',
            'Ulug\'bek rasadxonasi',
            'Siob bozori',
          ],
          included: [
            '2 kecha butik mehmonxonada',
            'Kundalik nonushta',
            'Tajribali mahalliy gid',
            'Barcha kirish chiptalar',
            'Aeroport transferlari',
          ],
          excluded: ['Tushlik va kechki ovqat', 'Shaxsiy xarajatlar', 'Maslahatlar'],
          metaTitle: null,
          metaDescription: null,
        },
      };

      const uzData = uzTranslations[tourTitle];
      if (uzData) {
        await prisma.tourTranslation.create({
          data: {
            tourId: tour.id,
            locale: Locale.uz,
            ...uzData,
          },
        });
        console.log(`✅ Added UZ translation for: ${tourTitle}`);
      }
    }

    if (hasRu && hasUz) {
      console.log(`ℹ️  ${tourTitle} already has all translations`);
    }
  }

  console.log('\n✨ Creating 2 new tours with full translations...\n');

  // Get categories
  const culturalCategory = await prisma.tourCategory.findFirst({
    where: {
      translations: {
        some: {
          slug: 'cultural-tours',
        },
      },
    },
  });

  const adventureCategory = await prisma.tourCategory.findFirst({
    where: {
      translations: {
        some: {
          slug: 'adventure-tours',
        },
      },
    },
  });

  // Tour 1: Bukhara Craft Workshop Tour
  const bukharaTour = await prisma.tour.create({
    data: {
      price: 429,
      duration: 4,
      maxGroupSize: 8,
      difficulty: 'Easy',
      categoryId: culturalCategory?.id,
      images: [
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&h=800&fit=crop',
      ],
      isFeatured: true,
      showPrice: true,
      isActive: true,
      translations: {
        create: [
          {
            locale: Locale.en,
            title: 'Bukhara Craft Workshops: 4-Day Immersion',
            slug: 'bukhara-craft-workshops-4-days',
            summary: 'Master traditional crafts with Bukhara artisans',
            description:
              'Experience the living traditions of Bukhara through hands-on workshops. Learn pottery, silk embroidery, and metalwork from master craftspeople who have inherited their skills through generations. Stay in the historic old city and immerse yourself in authentic Uzbek culture.',
            highlights: [
              'Pottery workshop with master ceramicist',
              'Silk embroidery with traditional patterns',
              'Metalworking and jewelry making',
              'Historic Bukhara old city tour',
              'Traditional cooking class',
              'Stay in restored caravanserai',
            ],
            included: [
              '3 nights in historic boutique hotel',
              'All breakfasts and 2 dinners',
              'All craft workshop materials',
              'Expert artisan instructors',
              'City tour with local historian',
              'Airport/train transfers',
            ],
            excluded: [
              'Some lunches and dinners',
              'Personal shopping',
              'Travel insurance',
              'Tips for guides and artisans',
            ],
            metaTitle: 'Bukhara Craft Workshops - 4 Days | Jahongir Travel',
            metaDescription:
              'Learn traditional Uzbek crafts from master artisans in historic Bukhara.',
          },
          {
            locale: Locale.ru,
            title: 'Ремесленные мастерские Бухары: 4-дневное погружение',
            slug: 'bukhara-craft-workshops-4-days',
            summary: 'Освойте традиционные ремёсла с бухарскими мастерами',
            description:
              'Познакомьтесь с живыми традициями Бухары через практические мастер-классы. Изучите гончарное дело, шёлковую вышивку и металлообработку у мастеров, унаследовавших свои навыки через поколения. Остановитесь в историческом старом городе и погрузитесь в аутентичную узбекскую культуру.',
            highlights: [
              'Мастерская гончарного дела с мастером-керамистом',
              'Шёлковая вышивка с традиционными узорами',
              'Металлообработка и изготовление украшений',
              'Экскурсия по старому городу Бухары',
              'Урок традиционной кулинарии',
              'Проживание в отреставрированном караван-сарае',
            ],
            included: [
              '3 ночи в историческом бутик-отеле',
              'Все завтраки и 2 ужина',
              'Все материалы для ремесленных мастерских',
              'Опытные мастера-инструкторы',
              'Экскурсия по городу с местным историком',
              'Трансферы аэропорт/вокзал',
            ],
            excluded: [
              'Некоторые обеды и ужины',
              'Личные покупки',
              'Туристическая страховка',
              'Чаевые гидам и мастерам',
            ],
            metaTitle: 'Ремесленные мастерские Бухары - 4 дня | Jahongir Travel',
            metaDescription:
              'Изучайте традиционные узбекские ремёсла у мастеров в исторической Бухаре.',
          },
          {
            locale: Locale.uz,
            title: 'Buxoro hunarmandchilik ustaxonalari: 4 kunlik chuqur sayohat',
            slug: 'bukhara-craft-workshops-4-days',
            summary: 'Buxoro hunarmandlari bilan an\'anaviy hunarmandchilikni o\'rganing',
            description:
              'Amaliy ustaxonalar orqali Buxoroning tirik an\'analarini his eting. Avlodlar davomida o\'z mahoratini meros qilib olgan ustalarda kulolchilik, ipak tikish va metall ishlov berishni o\'rganing. Tarixiy eski shaharda qoling va haqiqiy o\'zbek madaniyatiga sho\'ng\'ing.',
            highlights: [
              'Usta kulolchi bilan kulolchilik ustaxonasi',
              'An\'anaviy naqshlar bilan ipak tikish',
              'Metall ishlov berish va zargarlik',
              'Tarixiy Buxoro eski shahar sayohati',
              'An\'anaviy pazandachilik darsi',
              'Qayta tiklangan karvonsaroyda turar joy',
            ],
            included: [
              'Tarixiy butik mehmonxonada 3 kecha',
              'Barcha nonushtalar va 2 kechki ovqat',
              'Barcha hunarmandchilik ustaxona materiallari',
              'Tajribali hunarmand o\'qituvchilar',
              'Mahalliy tarixchi bilan shahar sayohati',
              'Aeroport/vokzal transferlari',
            ],
            excluded: [
              'Ba\'zi tushliklar va kechki ovqatlar',
              'Shaxsiy xaridlar',
              'Sayohat sug\'urtasi',
              'Gidlar va ustalarga maslahatlar',
            ],
            metaTitle: 'Buxoro hunarmandchilik ustaxonalari - 4 kun | Jahongir Travel',
            metaDescription:
              'Tarixiy Buxorada usta hunarmandlardan an\'anaviy o\'zbek hunarmandchiligini o\'rganing.',
          },
        ],
      },
    },
  });

  console.log(`✅ Created: ${bukharaTour.id} - Bukhara Craft Workshops`);

  // Tour 2: Trekking in Chimgan Mountains
  const chimganTour = await prisma.tour.create({
    data: {
      price: 359,
      duration: 3,
      maxGroupSize: 10,
      difficulty: 'Moderate',
      categoryId: adventureCategory?.id,
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&h=800&fit=crop',
      ],
      isFeatured: false,
      showPrice: true,
      isActive: true,
      translations: {
        create: [
          {
            locale: Locale.en,
            title: 'Chimgan Mountains Trekking Adventure',
            slug: 'chimgan-mountains-trekking-3-days',
            summary: 'Trek through stunning mountain landscapes near Tashkent',
            description:
              'Escape the city and discover the natural beauty of Uzbekistan in the Chimgan Mountains. This 3-day trekking adventure takes you through alpine meadows, past crystal-clear mountain lakes, and to spectacular viewpoints. Perfect for nature lovers and photography enthusiasts.',
            highlights: [
              'Trekking to Big Chimgan peak (3,309m)',
              'Charvak Lake boat tour',
              'Alpine meadows and wildflowers',
              'Traditional mountain village visit',
              'Campfire dinner under the stars',
              'Professional mountain guide',
            ],
            included: [
              '2 nights mountain guesthouse accommodation',
              'All meals (breakfast, lunch, dinner)',
              'Professional trekking guide',
              'All transportation from Tashkent',
              'Trekking permits and fees',
              'Basic first aid kit',
            ],
            excluded: [
              'Personal trekking equipment (boots, poles)',
              'Travel insurance',
              'Personal expenses',
              'Tips for guide',
            ],
            metaTitle: 'Chimgan Mountains Trekking - 3 Days | Jahongir Travel',
            metaDescription:
              'Trek through stunning alpine landscapes in the Chimgan Mountains near Tashkent.',
          },
          {
            locale: Locale.ru,
            title: 'Треккинг в горах Чимган',
            slug: 'chimgan-mountains-trekking-3-days',
            summary: 'Треккинг по потрясающим горным ландшафтам недалеко от Ташкента',
            description:
              'Сбегите из города и откройте для себя природную красоту Узбекистана в горах Чимган. Это 3-дневное треккинг-приключение проведёт вас через альпийские луга, мимо кристально чистых горных озёр и к захватывающим смотровым площадкам. Идеально для любителей природы и энтузиастов фотографии.',
            highlights: [
              'Треккинг к вершине Большого Чимгана (3309м)',
              'Прогулка на лодке по озеру Чарвак',
              'Альпийские луга и дикие цветы',
              'Посещение традиционной горной деревни',
              'Ужин у костра под звёздами',
              'Профессиональный горный гид',
            ],
            included: [
              '2 ночи в горном гостевом доме',
              'Все приёмы пищи (завтрак, обед, ужин)',
              'Профессиональный гид по треккингу',
              'Весь транспорт из Ташкента',
              'Разрешения и сборы за треккинг',
              'Базовая аптечка первой помощи',
            ],
            excluded: [
              'Личное снаряжение для треккинга (ботинки, палки)',
              'Туристическая страховка',
              'Личные расходы',
              'Чаевые гиду',
            ],
            metaTitle: 'Треккинг в горах Чимган - 3 дня | Jahongir Travel',
            metaDescription:
              'Треккинг по потрясающим альпийским ландшафтам в горах Чимган недалеко от Ташкента.',
          },
          {
            locale: Locale.uz,
            title: 'Chimg\'on tog\'larida trekking sarguzashti',
            slug: 'chimgan-mountains-trekking-3-days',
            summary: 'Toshkent yaqinidagi ajoyib tog\' manzaralari bo\'ylab trekking',
            description:
              'Shahardan qoching va Chimg\'on tog\'larida O\'zbekistonning tabiiy go\'zalligini kashf eting. Bu 3 kunlik trekking sarguzashti sizni alpiy o\'tloqlar, tiniq tog\' ko\'llari va ajoyib tomosha nuqtalari orqali olib boradi. Tabiat ishqibozlari va fotografiya ixlosmandlari uchun mukammal.',
            highlights: [
              'Katta Chimg\'on cho\'qqisiga (3309m) trekking',
              'Chorvoq ko\'lida qayiqda sayohat',
              'Alpiy o\'tloqlar va yovvoyi gullar',
              'An\'anaviy tog\' qishlog\'iga tashrif',
              'Yulduzlar ostida gulxan yonida kechki ovqat',
              'Professional tog\' yo\'lboshchisi',
            ],
            included: [
              'Tog\' mehmonxonasida 2 kecha',
              'Barcha ovqatlar (nonushta, tushlik, kechki ovqat)',
              'Professional trekking yo\'lboshchisi',
              'Toshkentdan barcha transport',
              'Trekking ruxsatlari va to\'lovlar',
              'Asosiy birinchi yordam to\'plami',
            ],
            excluded: [
              'Shaxsiy trekking jihozlari (botinkalar, tayoqlar)',
              'Sayohat sug\'urtasi',
              'Shaxsiy xarajatlar',
              'Yo\'lboshchiga maslahatlar',
            ],
            metaTitle: 'Chimg\'on tog\'larida trekking - 3 kun | Jahongir Travel',
            metaDescription:
              'Toshkent yaqinidagi Chimg\'on tog\'larida ajoyib alpiy manzaralar bo\'ylab trekking.',
          },
        ],
      },
    },
  });

  console.log(`✅ Created: ${chimganTour.id} - Chimgan Mountains Trekking`);

  console.log('\n✨ All done! Summary:');
  console.log(`📊 Total tours with all 3 languages: ${tours.length + 2}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
