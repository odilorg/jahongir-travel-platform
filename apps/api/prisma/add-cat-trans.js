const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categoryTranslations = [
  {
    categoryId: 'cmjykeabd0001jl7dzd6rvq9t',
    translations: {
      en: { name: 'Cultural Tours', slug: 'cultural-tours', description: 'Explore the rich cultural heritage of Uzbekistan.' },
      ru: { name: 'Культурные туры', slug: 'kulturnye-tury', description: 'Откройте для себя богатое культурное наследие Узбекистана.' },
      uz: { name: 'Madaniy sayohatlar', slug: 'madaniy-sayohatlar', description: "O'zbekistonning boy madaniy merosini kashf eting." },
    },
  },
  {
    categoryId: 'cmjykeabj0002jl7dlrlt0sb1',
    translations: {
      en: { name: 'Historical Tours', slug: 'historical-tours', description: 'Journey through centuries of history.' },
      ru: { name: 'Исторические туры', slug: 'istoricheskie-tury', description: 'Путешествие сквозь века истории.' },
      uz: { name: 'Tarixiy sayohatlar', slug: 'tarixiy-sayohatlar', description: "Asrlar tarixi bo'ylab sayohat." },
    },
  },
  {
    categoryId: 'cmjykeabo0003jl7d6j7yedl1',
    translations: {
      en: { name: 'Adventure Tours', slug: 'adventure-tours', description: 'Trekking and outdoor adventures.' },
      ru: { name: 'Приключенческие туры', slug: 'priklyuchencheskie-tury', description: 'Треккинг и приключения на природе.' },
      uz: { name: 'Sarguzasht sayohatlar', slug: 'sarguzasht-sayohatlar', description: 'Trekking va tabiatdagi sarguzashtlar.' },
    },
  },
  {
    categoryId: 'cmjykeabr0004jl7dy9vf2oam',
    translations: {
      en: { name: 'Family Tours', slug: 'family-tours', description: 'Safe tours for families with children.' },
      ru: { name: 'Семейные туры', slug: 'semeynye-tury', description: 'Безопасные туры для семей с детьми.' },
      uz: { name: 'Oilaviy sayohatlar', slug: 'oilaviy-sayohatlar', description: 'Bolali oilalar uchun xavfsiz sayohatlar.' },
    },
  },
];

async function main() {
  console.log('Adding category translations...');

  for (const category of categoryTranslations) {
    for (const [locale, data] of Object.entries(category.translations)) {
      try {
        const result = await prisma.tourCategoryTranslation.upsert({
          where: { categoryId_locale: { categoryId: category.categoryId, locale } },
          update: { name: data.name, slug: data.slug, description: data.description },
          create: { categoryId: category.categoryId, locale, name: data.name, slug: data.slug, description: data.description },
        });
        console.log(`✅ ${locale.toUpperCase()}: ${data.name}`);
      } catch (error) {
        console.error(`❌ Error for ${locale}:`, error.message);
      }
    }
  }

  console.log('\nDone!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
