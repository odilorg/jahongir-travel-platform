import { PrismaClient, Locale } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const TOUR_ID = 'cmjzhfwg5000ejlevk7jv6vgo';

  console.log('🌍 Adding translations for Chimgan Mountains Trekking tour...\n');

  // English
  await prisma.tourTranslation.upsert({
    where: { tourId_locale: { tourId: TOUR_ID, locale: Locale.en } },
    create: {
      tourId: TOUR_ID,
      locale: Locale.en,
      title: 'Chimgan Mountains Trekking Adventure',
      slug: 'chimgan-mountains-trekking-3-days',
      summary: 'Trek through stunning mountain landscapes near Tashkent',
      description: `Escape the city and discover the natural beauty of Uzbekistan in the Chimgan Mountains. This 3-day trekking adventure takes you through alpine meadows, past crystal-clear mountain lakes, and to spectacular viewpoints. Perfect for nature lovers and photography enthusiasts.

The Chimgan Mountains, located just 80km from Tashkent, offer some of the most breathtaking scenery in Central Asia. Our experienced guides will lead you through well-marked trails, sharing knowledge about local flora, fauna, and mountain traditions.

Whether you are an experienced trekker or a beginner looking for adventure, this tour offers the perfect balance of challenge and reward. Each evening, return to comfortable mountain guesthouses where you can relax and enjoy traditional Uzbek hospitality.`,
      highlights: ['Trekking to Big Chimgan peak (3,309m)', 'Charvak Lake boat tour', 'Alpine meadows and wildflowers', 'Traditional mountain village visit', 'Campfire dinner under the stars', 'Professional mountain guide'],
      included: ['2 nights mountain guesthouse accommodation', 'All meals (breakfast, lunch, dinner)', 'Professional trekking guide', 'All transportation from Tashkent', 'Trekking permits and fees', 'Basic first aid kit'],
      excluded: ['Personal trekking equipment (boots, poles)', 'Travel insurance', 'Personal expenses', 'Tips for guide'],
      metaTitle: 'Chimgan Mountains Trekking - 3 Days Adventure | Jahongir Travel',
      metaDescription: 'Trek through stunning alpine landscapes in the Chimgan Mountains near Tashkent. 3-day adventure with professional guides, accommodation, and meals included.',
    },
    update: {
      title: 'Chimgan Mountains Trekking Adventure',
      slug: 'chimgan-mountains-trekking-3-days',
      summary: 'Trek through stunning mountain landscapes near Tashkent',
      description: `Escape the city and discover the natural beauty of Uzbekistan in the Chimgan Mountains. This 3-day trekking adventure takes you through alpine meadows, past crystal-clear mountain lakes, and to spectacular viewpoints. Perfect for nature lovers and photography enthusiasts.

The Chimgan Mountains, located just 80km from Tashkent, offer some of the most breathtaking scenery in Central Asia. Our experienced guides will lead you through well-marked trails, sharing knowledge about local flora, fauna, and mountain traditions.

Whether you are an experienced trekker or a beginner looking for adventure, this tour offers the perfect balance of challenge and reward. Each evening, return to comfortable mountain guesthouses where you can relax and enjoy traditional Uzbek hospitality.`,
      highlights: ['Trekking to Big Chimgan peak (3,309m)', 'Charvak Lake boat tour', 'Alpine meadows and wildflowers', 'Traditional mountain village visit', 'Campfire dinner under the stars', 'Professional mountain guide'],
      included: ['2 nights mountain guesthouse accommodation', 'All meals (breakfast, lunch, dinner)', 'Professional trekking guide', 'All transportation from Tashkent', 'Trekking permits and fees', 'Basic first aid kit'],
      excluded: ['Personal trekking equipment (boots, poles)', 'Travel insurance', 'Personal expenses', 'Tips for guide'],
      metaTitle: 'Chimgan Mountains Trekking - 3 Days Adventure | Jahongir Travel',
      metaDescription: 'Trek through stunning alpine landscapes in the Chimgan Mountains near Tashkent. 3-day adventure with professional guides, accommodation, and meals included.',
    },
  });
  console.log('✅ EN: Chimgan Mountains Trekking Adventure');

  // Russian
  await prisma.tourTranslation.upsert({
    where: { tourId_locale: { tourId: TOUR_ID, locale: Locale.ru } },
    create: {
      tourId: TOUR_ID,
      locale: Locale.ru,
      title: 'Треккинг в горах Чимган',
      slug: 'trekking-v-gorah-chimgan-3-dnya',
      summary: 'Пешие прогулки по живописным горным пейзажам недалеко от Ташкента',
      description: `Отдохните от городской суеты и откройте для себя природную красоту Узбекистана в горах Чимган. Это 3-дневное треккинговое приключение проведёт вас через альпийские луга, мимо кристально чистых горных озёр и к впечатляющим смотровым площадкам. Идеально подходит для любителей природы и фотографии.

Горы Чимган, расположенные всего в 80 км от Ташкента, предлагают одни из самых захватывающих пейзажей в Центральной Азии. Наши опытные гиды проведут вас по хорошо размеченным тропам, делясь знаниями о местной флоре, фауне и горных традициях.

Независимо от того, являетесь ли вы опытным путешественником или новичком, ищущим приключений, этот тур предлагает идеальный баланс между вызовом и наградой. Каждый вечер возвращайтесь в уютные горные гостевые дома, где вы сможете расслабиться и насладиться традиционным узбекским гостеприимством.`,
      highlights: ['Восхождение на Большой Чимган (3309м)', 'Прогулка на лодке по Чарвакскому водохранилищу', 'Альпийские луга и полевые цветы', 'Посещение традиционной горной деревни', 'Ужин у костра под звёздами', 'Профессиональный горный гид'],
      included: ['Проживание в горном гостевом доме (2 ночи)', 'Все приёмы пищи (завтрак, обед, ужин)', 'Профессиональный треккинг-гид', 'Весь транспорт из Ташкента', 'Разрешения и сборы за треккинг', 'Базовая аптечка первой помощи'],
      excluded: ['Личное треккинговое снаряжение (ботинки, палки)', 'Туристическая страховка', 'Личные расходы', 'Чаевые гиду'],
      metaTitle: 'Треккинг в горах Чимган - 3 дня приключений | Jahongir Travel',
      metaDescription: 'Пешие прогулки по живописным альпийским пейзажам в горах Чимган недалеко от Ташкента. 3-дневное приключение с профессиональными гидами, проживанием и питанием.',
    },
    update: {
      title: 'Треккинг в горах Чимган',
      slug: 'trekking-v-gorah-chimgan-3-dnya',
      summary: 'Пешие прогулки по живописным горным пейзажам недалеко от Ташкента',
      description: `Отдохните от городской суеты и откройте для себя природную красоту Узбекистана в горах Чимган. Это 3-дневное треккинговое приключение проведёт вас через альпийские луга, мимо кристально чистых горных озёр и к впечатляющим смотровым площадкам. Идеально подходит для любителей природы и фотографии.

Горы Чимган, расположенные всего в 80 км от Ташкента, предлагают одни из самых захватывающих пейзажей в Центральной Азии. Наши опытные гиды проведут вас по хорошо размеченным тропам, делясь знаниями о местной флоре, фауне и горных традициях.

Независимо от того, являетесь ли вы опытным путешественником или новичком, ищущим приключений, этот тур предлагает идеальный баланс между вызовом и наградой. Каждый вечер возвращайтесь в уютные горные гостевые дома, где вы сможете расслабиться и насладиться традиционным узбекским гостеприимством.`,
      highlights: ['Восхождение на Большой Чимган (3309м)', 'Прогулка на лодке по Чарвакскому водохранилищу', 'Альпийские луга и полевые цветы', 'Посещение традиционной горной деревни', 'Ужин у костра под звёздами', 'Профессиональный горный гид'],
      included: ['Проживание в горном гостевом доме (2 ночи)', 'Все приёмы пищи (завтрак, обед, ужин)', 'Профессиональный треккинг-гид', 'Весь транспорт из Ташкента', 'Разрешения и сборы за треккинг', 'Базовая аптечка первой помощи'],
      excluded: ['Личное треккинговое снаряжение (ботинки, палки)', 'Туристическая страховка', 'Личные расходы', 'Чаевые гиду'],
      metaTitle: 'Треккинг в горах Чимган - 3 дня приключений | Jahongir Travel',
      metaDescription: 'Пешие прогулки по живописным альпийским пейзажам в горах Чимган недалеко от Ташкента. 3-дневное приключение с профессиональными гидами, проживанием и питанием.',
    },
  });
  console.log('✅ RU: Треккинг в горах Чимган');

  // Uzbek
  await prisma.tourTranslation.upsert({
    where: { tourId_locale: { tourId: TOUR_ID, locale: Locale.uz } },
    create: {
      tourId: TOUR_ID,
      locale: Locale.uz,
      title: "Chimgon tog'larida trekking sarguzashti",
      slug: 'chimgon-toglarida-trekking-3-kun',
      summary: "Toshkent yaqinidagi ajoyib tog' manzaralarida piyoda sayohat",
      description: `Shahar shovqinidan qoching va Chimgon tog'larida O'zbekistonning tabiiy go'zalligini kashf eting. Bu 3 kunlik trekking sarguzashti sizni alp yaylovlari, billur toza tog' ko'llari va ajoyib manzarali nuqtalar orqali olib boradi. Tabiat ishqibozlari va fotograf-havaskorlar uchun ideal.

Toshkentdan atigi 80 km masofada joylashgan Chimgon tog'lari Markaziy Osiyodagi eng hayratlanarli manzaralarni taklif etadi. Tajribali gidlarimiz sizni yaxshi belgilangan yo'llar bo'ylab olib borishadi, mahalliy flora, fauna va tog' an'analari haqida bilim ulashishadi.

Tajribali sayohatchi bo'lsangiz yoki sarguzasht izlayotgan yangi boshlovchi bo'lsangiz ham, bu sayohat qiyinchilik va mukofotning mukammal muvozanatini taklif etadi. Har oqshom qulay tog' mehmonxonalariga qaytib, dam olishingiz va an'anaviy o'zbek mehmondo'stligidan bahramand bo'lishingiz mumkin.`,
      highlights: ["Katta Chimgon cho'qqisiga chiqish (3309m)", "Charvok suv ombori bo'ylab qayiqda sayohat", "Alp yaylovlari va yovvoyi gullar", "An'anaviy tog' qishlog'iga tashrif", "Yulduzlar ostida gulxan kechki ovqati", "Professional tog' gidi"],
      included: ["Tog' mehmonxonasida turar joy (2 kecha)", "Barcha ovqatlar (nonushta, tushlik, kechki ovqat)", "Professional trekking gidi", "Toshkentdan barcha transport", "Trekking ruxsatnomalari va to'lovlar", "Asosiy birinchi yordam to'plami"],
      excluded: ["Shaxsiy trekking jihozlari (etiklar, tayoqlar)", "Sayohat sug'urtasi", "Shaxsiy xarajatlar", "Gid uchun tip"],
      metaTitle: "Chimgon tog'larida trekking - 3 kunlik sarguzasht | Jahongir Travel",
      metaDescription: "Toshkent yaqinidagi Chimgon tog'larining ajoyib alp manzaralarida piyoda sayohat. Professional gidlar, turar joy va ovqat bilan 3 kunlik sarguzasht.",
    },
    update: {
      title: "Chimgon tog'larida trekking sarguzashti",
      slug: 'chimgon-toglarida-trekking-3-kun',
      summary: "Toshkent yaqinidagi ajoyib tog' manzaralarida piyoda sayohat",
      description: `Shahar shovqinidan qoching va Chimgon tog'larida O'zbekistonning tabiiy go'zalligini kashf eting. Bu 3 kunlik trekking sarguzashti sizni alp yaylovlari, billur toza tog' ko'llari va ajoyib manzarali nuqtalar orqali olib boradi. Tabiat ishqibozlari va fotograf-havaskorlar uchun ideal.

Toshkentdan atigi 80 km masofada joylashgan Chimgon tog'lari Markaziy Osiyodagi eng hayratlanarli manzaralarni taklif etadi. Tajribali gidlarimiz sizni yaxshi belgilangan yo'llar bo'ylab olib borishadi, mahalliy flora, fauna va tog' an'analari haqida bilim ulashishadi.

Tajribali sayohatchi bo'lsangiz yoki sarguzasht izlayotgan yangi boshlovchi bo'lsangiz ham, bu sayohat qiyinchilik va mukofotning mukammal muvozanatini taklif etadi. Har oqshom qulay tog' mehmonxonalariga qaytib, dam olishingiz va an'anaviy o'zbek mehmondo'stligidan bahramand bo'lishingiz mumkin.`,
      highlights: ["Katta Chimgon cho'qqisiga chiqish (3309m)", "Charvok suv ombori bo'ylab qayiqda sayohat", "Alp yaylovlari va yovvoyi gullar", "An'anaviy tog' qishlog'iga tashrif", "Yulduzlar ostida gulxan kechki ovqati", "Professional tog' gidi"],
      included: ["Tog' mehmonxonasida turar joy (2 kecha)", "Barcha ovqatlar (nonushta, tushlik, kechki ovqat)", "Professional trekking gidi", "Toshkentdan barcha transport", "Trekking ruxsatnomalari va to'lovlar", "Asosiy birinchi yordam to'plami"],
      excluded: ["Shaxsiy trekking jihozlari (etiklar, tayoqlar)", "Sayohat sug'urtasi", "Shaxsiy xarajatlar", "Gid uchun tip"],
      metaTitle: "Chimgon tog'larida trekking - 3 kunlik sarguzasht | Jahongir Travel",
      metaDescription: "Toshkent yaqinidagi Chimgon tog'larining ajoyib alp manzaralarida piyoda sayohat. Professional gidlar, turar joy va ovqat bilan 3 kunlik sarguzasht.",
    },
  });
  console.log("✅ UZ: Chimgon tog'larida trekking sarguzashti");

  // Verify
  const translations = await prisma.tourTranslation.findMany({
    where: { tourId: TOUR_ID },
    select: { locale: true, title: true, slug: true },
  });

  console.log('\n📋 All translations:');
  translations.forEach((t) => console.log(`  - ${t.locale}: ${t.title}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
