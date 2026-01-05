import { PrismaClient, Locale } from '@prisma/client';

const prisma = new PrismaClient();

const tourTranslations = {
  'classic-uzbekistan-7-days': {
    en: {
      title: 'Classic Uzbekistan: 7-Day Journey',
      slug: 'classic-uzbekistan-7-days',
      summary: 'Discover the best of Uzbekistan in one week. From Registan Square to the Ark of Bukhara.',
      description: 'Experience the highlights of Uzbekistan. Visit Tashkent, Samarkand, Bukhara, and Khiva. Marvel at stunning Islamic architecture, explore ancient bazaars, and immerse yourself in local culture.',
      highlights: [
        'Registan Square in Samarkand',
        'Gur-e-Amir Mausoleum',
        'Ark of Bukhara',
        'Itchan Kala in Khiva',
        'Traditional Uzbek cuisine',
        'Local bazaars and handicrafts',
      ],
      included: [
        'All accommodation (3-4 star hotels)',
        'All breakfasts and some meals',
        'Professional English-speaking guide',
        'All entrance fees',
        'Comfortable AC transportation',
        'High-speed train tickets',
      ],
      excluded: [
        'International flights',
        'Visa fees',
        'Travel insurance',
        'Personal expenses',
        'Tips',
      ],
      metaTitle: 'Classic Uzbekistan Tour - 7 Days | Jahongir Travel',
      metaDescription: 'Explore Silk Road cities on our Classic 7-day tour. Visit Tashkent, Samarkand, Bukhara, Khiva.',
    },
    ru: {
      title: 'Классический Узбекистан: 7-дневное путешествие',
      slug: 'klassicheskiy-uzbekistan-7-dney',
      summary: 'Откройте лучшее Узбекистана за одну неделю. От площади Регистан до Арка Бухары.',
      description: 'Познакомьтесь с главными достопримечательностями Узбекистана. Посетите Ташкент, Самарканд, Бухару и Хиву. Полюбуйтесь потрясающей исламской архитектурой, исследуйте древние базары и погрузитесь в местную культуру.',
      highlights: [
        'Площадь Регистан в Самарканде',
        'Мавзолей Гур-Эмир',
        'Арк Бухары',
        'Ичан-Кала в Хиве',
        'Традиционная узбекская кухня',
        'Местные базары и ремёсла',
      ],
      included: [
        'Проживание в гостиницах 3-4 звезды',
        'Все завтраки и некоторые обеды',
        'Профессиональный русскоговорящий гид',
        'Все входные билеты',
        'Комфортный транспорт с кондиционером',
        'Билеты на скоростной поезд',
      ],
      excluded: [
        'Международные перелёты',
        'Визовые сборы',
        'Туристическая страховка',
        'Личные расходы',
        'Чаевые',
      ],
      metaTitle: 'Тур по Узбекистану - 7 дней | Jahongir Travel',
      metaDescription: 'Исследуйте города Великого шёлкового пути. Посетите Ташкент, Самарканд, Бухару, Хиву.',
    },
    uz: {
      title: 'Klassik O\'zbekiston: 7 kunlik sayohat',
      slug: 'klassik-ozbekiston-7-kun',
      summary: 'Bir haftada O\'zbekistonning eng yaxshisini kashf eting. Registon maydonidan Buxoro Arkigacha.',
      description: 'O\'zbekistonning eng diqqatga sazovor joylarini tomosha qiling. Toshkent, Samarqand, Buxoro va Xivani ziyorat qiling. Ajoyib islomiy me\'morchilikni tomosha qiling, qadimiy bozorlarni kashf eting va mahalliy madaniyatga sho\'ng\'ing.',
      highlights: [
        'Samarqanddagi Registon maydoni',
        'Go\'ri Amir maqbarasi',
        'Buxoro Arki',
        'Xivadagi Ichan Qal\'a',
        'An\'anaviy o\'zbek taomlari',
        'Mahalliy bozorlar va hunarmandchilik',
      ],
      included: [
        'Barcha turar joy (3-4 yulduzli mehmonxonalar)',
        'Barcha nonushtalar va ba\'zi ovqatlar',
        'Professional o\'zbek/ingliz tilida gid',
        'Barcha kirish chiptalari',
        'Qulay konditsionerli transport',
        'Tezyurar poyezd chiptalari',
      ],
      excluded: [
        'Xalqaro parvozlar',
        'Viza to\'lovlari',
        'Sayohat sug\'urtasi',
        'Shaxsiy xarajatlar',
        'Tip (sovg\'a)',
      ],
      metaTitle: 'O\'zbekiston sayohati - 7 kun | Jahongir Travel',
      metaDescription: 'Buyuk Ipak yo\'li shaharlarini o\'rganing. Toshkent, Samarqand, Buxoro, Xivani ziyorat qiling.',
    },
  },
  'samarkand-highlights-3-days': {
    en: {
      title: 'Samarkand Highlights: 3-Day Exploration',
      slug: 'samarkand-highlights-3-days',
      summary: 'Dive deep into Samarkand\'s magnificent history over 3 unforgettable days.',
      description: 'Dive deep into Samarkand history. This focused tour lets you explore the Timurid capital at your own pace. Visit world-famous monuments, meet local artisans, and experience authentic Uzbek hospitality.',
      highlights: [
        'Registan Square',
        'Shah-i-Zinda necropolis',
        'Bibi-Khanym Mosque',
        'Ulugh Beg Observatory',
        'Siab Bazaar',
      ],
      included: [
        '2 nights boutique hotel',
        'Daily breakfast',
        'Expert local guide',
        'All entrance fees',
        'Airport transfers',
      ],
      excluded: [
        'Lunch and dinner',
        'Personal expenses',
        'Tips',
      ],
      metaTitle: 'Samarkand Highlights Tour - 3 Days | Jahongir Travel',
      metaDescription: 'Explore Samarkand in depth. Visit Registan, Shah-i-Zinda, and more.',
    },
    ru: {
      title: 'Достопримечательности Самарканда: 3-дневное исследование',
      slug: 'dostoprimechatelnosti-samarkanda-3-dnya',
      summary: 'Погрузитесь в великолепную историю Самарканда за 3 незабываемых дня.',
      description: 'Погрузитесь в историю Самарканда. Этот сфокусированный тур позволит вам исследовать столицу Тимуридов в своём темпе. Посетите всемирно известные памятники, познакомьтесь с местными ремесленниками и ощутите подлинное узбекское гостеприимство.',
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
        'Профессиональный местный гид',
        'Все входные билеты',
        'Трансфер из/в аэропорт',
      ],
      excluded: [
        'Обед и ужин',
        'Личные расходы',
        'Чаевые',
      ],
      metaTitle: 'Тур по Самарканду - 3 дня | Jahongir Travel',
      metaDescription: 'Исследуйте Самарканд углублённо. Посетите Регистан, Шахи-Зинду и многое другое.',
    },
    uz: {
      title: 'Samarqand diqqatga sazovor joylari: 3 kunlik sayohat',
      slug: 'samarqand-diqqatga-sazovor-3-kun',
      summary: '3 ta unutilmas kun davomida Samarqandning ajoyib tarixiga sho\'ng\'ing.',
      description: 'Samarqand tarixiga chuqur kirib boring. Bu maxsus sayohat sizga Temuriylar poytaxtini o\'z sur\'atingizda o\'rganish imkonini beradi. Dunyoga mashhur yodgorliklarni ziyorat qiling, mahalliy hunarmandlar bilan tanishing va haqiqiy o\'zbek mehmondo\'stligini his eting.',
      highlights: [
        'Registon maydoni',
        'Shohi Zinda majmuasi',
        'Bibixonim masjidi',
        'Ulug\'bek rasadxonasi',
        'Siyob bozori',
      ],
      included: [
        'Butik mehmonxonada 2 tun',
        'Har kunlik nonushta',
        'Professional mahalliy gid',
        'Barcha kirish chiptalari',
        'Aeroport transferi',
      ],
      excluded: [
        'Tushlik va kechki ovqat',
        'Shaxsiy xarajatlar',
        'Tip (sovg\'a)',
      ],
      metaTitle: 'Samarqand sayohati - 3 kun | Jahongir Travel',
      metaDescription: 'Samarqandni chuqur o\'rganing. Registon, Shohi Zinda va boshqalarni ziyorat qiling.',
    },
  },
  'bukhara-craft-workshops-4-days': {
    en: {
      title: 'Bukhara Craft Workshops: 4-Day Immersion',
      slug: 'bukhara-craft-workshops-4-days',
      summary: 'Experience living traditions of Bukhara through hands-on craft workshops.',
      description: 'Experience the living traditions of Bukhara through hands-on workshops with master artisans. Learn pottery, silk embroidery, and metalworking while exploring this UNESCO World Heritage city.',
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
      metaDescription: 'Learn traditional Bukhara crafts. Pottery, embroidery, metalworking with master artisans.',
    },
    ru: {
      title: 'Мастер-классы ремёсел Бухары: 4-дневное погружение',
      slug: 'master-klassy-buhary-4-dnya',
      summary: 'Познакомьтесь с живыми традициями Бухары через практические мастер-классы.',
      description: 'Познакомьтесь с живыми традициями Бухары на практических мастер-классах с мастерами-ремесленниками. Изучите гончарное дело, шёлковую вышивку и металлообработку, исследуя этот город Всемирного наследия ЮНЕСКО.',
      highlights: [
        'Гончарный мастер-класс с мастером-керамистом',
        'Шёлковая вышивка с традиционными узорами',
        'Металлообработка и ювелирное дело',
        'Экскурсия по историческому старому городу Бухары',
        'Традиционный кулинарный мастер-класс',
        'Проживание в восстановленном караван-сарае',
      ],
      included: [
        '3 ночи в историческом бутик-отеле',
        'Все завтраки и 2 ужина',
        'Все материалы для мастер-классов',
        'Мастера-ремесленники',
        'Экскурсия с местным историком',
        'Трансфер из/в аэропорт/вокзал',
      ],
      excluded: [
        'Некоторые обеды и ужины',
        'Личные покупки',
        'Туристическая страховка',
        'Чаевые гидам и мастерам',
      ],
      metaTitle: 'Мастер-классы в Бухаре - 4 дня | Jahongir Travel',
      metaDescription: 'Изучите традиционные ремёсла Бухары. Гончарное дело, вышивка, металлообработка.',
    },
    uz: {
      title: 'Buxoro hunarmandchilik ustaxonalari: 4 kunlik sayohat',
      slug: 'buxoro-hunarmandchilik-4-kun',
      summary: 'Amaliy hunarmandchilik ustaxonalari orqali Buxoroning tirik an\'analarini his eting.',
      description: 'Usta hunarmandlar bilan amaliy ustaxonalar orqali Buxoroning tirik an\'analarini his eting. YuNESKO Jahon merosi ro\'yxatidagi bu shaharni kashf etib, kulolchilik, ipak kashtachilik va metall ishlov berishni o\'rganing.',
      highlights: [
        'Usta kulol bilan kulolchilik ustaxonasi',
        'An\'anaviy naqshlar bilan ipak kashtachilik',
        'Metall ishlov berish va zargarlik',
        'Tarixiy Buxoro eski shahar sayohati',
        'An\'anaviy pazandalik darsi',
        'Qayta tiklangan karvonsaroyda turar joy',
      ],
      included: [
        'Tarixiy butik mehmonxonada 3 tun',
        'Barcha nonushtalar va 2 kechki ovqat',
        'Barcha ustaxona materiallari',
        'Tajribali usta hunarmandlar',
        'Mahalliy tarixchi bilan shahar sayohati',
        'Aeroport/vokzal transferi',
      ],
      excluded: [
        'Ba\'zi tushlik va kechki ovqatlar',
        'Shaxsiy xaridlar',
        'Sayohat sug\'urtasi',
        'Gidlar va ustalarga tip',
      ],
      metaTitle: 'Buxoro hunarmandchilik ustaxonalari - 4 kun | Jahongir Travel',
      metaDescription: 'Buxoroning an\'anaviy hunarmandchiligini o\'rganing. Kulolchilik, kashtachilik, zargarlik.',
    },
  },
  'chimgan-mountains-trekking-3-days': {
    en: {
      title: 'Chimgan Mountains Trekking Adventure',
      slug: 'chimgan-mountains-trekking-3-days',
      summary: 'Escape to the stunning Chimgan Mountains for 3 days of trekking and adventure.',
      description: 'Escape the city and discover the natural beauty of Uzbekistan\'s Chimgan Mountains. Trek through alpine meadows, visit Charvak Lake, and experience traditional mountain hospitality.',
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
      metaDescription: 'Trek in Chimgan Mountains. Big Chimgan peak, Charvak Lake, alpine meadows.',
    },
    ru: {
      title: 'Треккинг в горах Чимган: приключение',
      slug: 'trekking-chimgan-3-dnya',
      summary: 'Отправьтесь в потрясающие горы Чимган на 3 дня треккинга и приключений.',
      description: 'Покиньте город и откройте природную красоту гор Чимган в Узбекистане. Пройдите по альпийским лугам, посетите озеро Чарвак и ощутите традиционное горное гостеприимство.',
      highlights: [
        'Треккинг на Большой Чимган (3 309 м)',
        'Прогулка на лодке по озеру Чарвак',
        'Альпийские луга и дикие цветы',
        'Посещение традиционной горной деревни',
        'Ужин у костра под звёздами',
        'Профессиональный горный гид',
      ],
      included: [
        '2 ночи в горном гостевом доме',
        'Все приёмы пищи (завтрак, обед, ужин)',
        'Профессиональный треккинг-гид',
        'Весь транспорт из Ташкента',
        'Разрешения и сборы на треккинг',
        'Базовая аптечка',
      ],
      excluded: [
        'Личное снаряжение для треккинга (ботинки, палки)',
        'Туристическая страховка',
        'Личные расходы',
        'Чаевые гиду',
      ],
      metaTitle: 'Треккинг в горах Чимган - 3 дня | Jahongir Travel',
      metaDescription: 'Треккинг в горах Чимган. Большой Чимган, озеро Чарвак, альпийские луга.',
    },
    uz: {
      title: 'Chimyon tog\'larida trekking sarguzashti',
      slug: 'chimyon-trekking-3-kun',
      summary: '3 kunlik trekking va sarguzasht uchun ajoyib Chimyon tog\'lariga boring.',
      description: 'Shahardan chiqib, O\'zbekistonning Chimyon tog\'larining tabiiy go\'zalligini kashf eting. Baland tog\' o\'tloqlari bo\'ylab yuring, Chorvoq ko\'lini ziyorat qiling va an\'anaviy tog\' mehmondo\'stligini his eting.',
      highlights: [
        'Katta Chimyon cho\'qqisiga (3309 m) trekking',
        'Chorvoq ko\'lida qayiqda sayr',
        'Baland tog\' o\'tloqlari va yovvoyi gullar',
        'An\'anaviy tog\' qishlog\'iga tashrif',
        'Yulduzlar ostida gulxan atrofida kechki ovqat',
        'Professional tog\' gidi',
      ],
      included: [
        'Tog\' mehmonxonasida 2 tun turar joy',
        'Barcha ovqatlar (nonushta, tushlik, kechki ovqat)',
        'Professional trekking gidi',
        'Toshkentdan barcha transport',
        'Trekking ruxsatnomalari va to\'lovlar',
        'Asosiy birinchi yordam to\'plami',
      ],
      excluded: [
        'Shaxsiy trekking jihozlari (botinka, tayoqlar)',
        'Sayohat sug\'urtasi',
        'Shaxsiy xarajatlar',
        'Gidga tip',
      ],
      metaTitle: 'Chimyon tog\'larida trekking - 3 kun | Jahongir Travel',
      metaDescription: 'Chimyon tog\'larida trekking. Katta Chimyon cho\'qqisi, Chorvoq ko\'li, baland tog\' o\'tloqlari.',
    },
  },
};

async function main() {
  console.log('🌍 Adding tour translations...\n');

  // Get all tours with their English translations (to get slugs)
  const tours = await prisma.tour.findMany({
    select: {
      id: true,
      translations: {
        where: { locale: 'en' },
        select: { slug: true }
      }
    },
  });

  for (const tour of tours) {
    const slug = tour.translations[0]?.slug;
    if (!slug) {
      console.log(`⚠️ Tour ${tour.id} has no English translation with slug`);
      continue;
    }

    const translations = tourTranslations[slug as keyof typeof tourTranslations];
    if (!translations) {
      console.log(`⚠️ No translations found for: ${slug}`);
      continue;
    }

    console.log(`📝 Processing: ${slug}`);

    // Add translations for each locale
    for (const [locale, data] of Object.entries(translations)) {
      try {
        await prisma.tourTranslation.upsert({
          where: {
            tourId_locale: {
              tourId: tour.id,
              locale: locale as Locale,
            },
          },
          update: {
            ...data,
          },
          create: {
            tourId: tour.id,
            locale: locale as Locale,
            ...data,
          },
        });
        console.log(`  ✓ ${locale.toUpperCase()} translation added`);
      } catch (error) {
        console.error(`  ✗ Error adding ${locale} translation:`, error);
      }
    }
    console.log('');
  }

  console.log('✅ All tour translations added!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
