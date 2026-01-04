import { PrismaClient, Locale } from '@prisma/client';

const prisma = new PrismaClient();

const categoryTranslations = [
  {
    categoryId: 'cmjykeabd0001jl7dzd6rvq9t', // Cultural Tours
    translations: {
      en: { name: 'Cultural Tours', slug: 'cultural-tours', description: 'Explore the rich cultural heritage of Uzbekistan, from ancient Silk Road cities to traditional crafts.' },
      ru: { name: 'Культурные туры', slug: 'kulturnye-tury', description: 'Откройте для себя богатое культурное наследие Узбекистана, от древних городов Шёлкового пути до традиционных ремёсел.' },
      uz: { name: 'Madaniy sayohatlar', slug: 'madaniy-sayohatlar', description: 'O\'zbekistonning boy madaniy merosini kashf eting, qadimgi Ipak yo\'li shaharlaridan an\'anaviy hunarmandchilikkacha.' },
    },
  },
  {
    categoryId: 'cmjykeabj0002jl7dlrlt0sb1', // Historical Tours
    translations: {
      en: { name: 'Historical Tours', slug: 'historical-tours', description: 'Journey through centuries of history along the Great Silk Road.' },
      ru: { name: 'Исторические туры', slug: 'istoricheskie-tury', description: 'Путешествие сквозь века истории по Великому шёлковому пути.' },
      uz: { name: 'Tarixiy sayohatlar', slug: 'tarixiy-sayohatlar', description: 'Buyuk Ipak yo\'li bo\'ylab asrlar tarixi bo\'ylab sayohat.' },
    },
  },
  {
    categoryId: 'cmjykeabo0003jl7d6j7yedl1', // Adventure Tours
    translations: {
      en: { name: 'Adventure Tours', slug: 'adventure-tours', description: 'Trekking, hiking, and outdoor adventures in mountains and deserts.' },
      ru: { name: 'Приключенческие туры', slug: 'priklyuchencheskie-tury', description: 'Треккинг, пешие походы и приключения на природе в горах и пустынях.' },
      uz: { name: 'Sarguzasht sayohatlar', slug: 'sarguzasht-sayohatlar', description: 'Tog\'lar va cho\'llarda trekking, piyoda sayohatlar va tabiatdagi sarguzashtlar.' },
    },
  },
  {
    categoryId: 'cmjykeabr0004jl7dy9vf2oam', // Family Tours
    translations: {
      en: { name: 'Family Tours', slug: 'family-tours', description: 'Safe and fun tours designed for families with children.' },
      ru: { name: 'Семейные туры', slug: 'semeynye-tury', description: 'Безопасные и увлекательные туры для семей с детьми.' },
      uz: { name: 'Oilaviy sayohatlar', slug: 'oilaviy-sayohatlar', description: 'Bolali oilalar uchun xavfsiz va qiziqarli sayohatlar.' },
    },
  },
];

async function main() {
  console.log('Adding category translations...');

  for (const category of categoryTranslations) {
    for (const [locale, data] of Object.entries(category.translations)) {
      try {
        const result = await prisma.tourCategoryTranslation.upsert({
          where: {
            categoryId_locale: {
              categoryId: category.categoryId,
              locale: locale as Locale,
            },
          },
          update: {
            name: data.name,
            slug: data.slug,
            description: data.description,
          },
          create: {
            categoryId: category.categoryId,
            locale: locale as Locale,
            name: data.name,
            slug: data.slug,
            description: data.description,
          },
        });
        console.log(`✅ ${locale.toUpperCase()}: ${data.name}`);
      } catch (error) {
        console.error(`❌ Error for ${locale}: ${data.name}`, error);
      }
    }
  }

  console.log('\nDone!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
