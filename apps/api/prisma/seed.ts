import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create categories
  const culturalCategory = await prisma.tourCategory.upsert({
    where: { slug: 'cultural-tours' },
    update: {},
    create: {
      name: 'Cultural Tours',
      slug: 'cultural-tours',
      description: 'Explore the rich cultural heritage of Uzbekistan',
      icon: '🏛️',
      order: 1,
      isActive: true,
    },
  });

  const adventureCategory = await prisma.tourCategory.upsert({
    where: { slug: 'adventure-tours' },
    update: {},
    create: {
      name: 'Adventure Tours',
      slug: 'adventure-tours',
      description: 'Exciting adventures across Uzbekistan',
      icon: '🏔️',
      order: 2,
      isActive: true,
    },
  });

  const historicalCategory = await prisma.tourCategory.upsert({
    where: { slug: 'historical-tours' },
    update: {},
    create: {
      name: 'Historical Tours',
      slug: 'historical-tours',
      description: 'Journey through ancient Silk Road cities',
      icon: '🕌',
      order: 3,
      isActive: true,
    },
  });

  console.log('✓ Categories created');

  // Create cities
  const samarkand = await prisma.city.upsert({
    where: { slug: 'samarkand' },
    update: {},
    create: {
      name: 'Samarkand',
      slug: 'samarkand',
      description: 'The crossroads of world cultures',
      country: 'Uzbekistan',
      latitude: 39.6270,
      longitude: 66.9750,
    },
  });

  const bukhara = await prisma.city.upsert({
    where: { slug: 'bukhara' },
    update: {},
    create: {
      name: 'Bukhara',
      slug: 'bukhara',
      description: 'The noble city',
      country: 'Uzbekistan',
      latitude: 39.7747,
      longitude: 64.4286,
    },
  });

  const khiva = await prisma.city.upsert({
    where: { slug: 'khiva' },
    update: {},
    create: {
      name: 'Khiva',
      slug: 'khiva',
      description: 'Open-air museum city',
      country: 'Uzbekistan',
      latitude: 41.3775,
      longitude: 60.3642,
    },
  });

  console.log('✓ Cities created');

  // Create sample tours
  const tour1 = await prisma.tour.upsert({
    where: { slug: 'classic-uzbekistan-tour' },
    update: {},
    create: {
      title: 'Classic Uzbekistan Tour',
      slug: 'classic-uzbekistan-tour',
      description:
        'Discover the highlights of Uzbekistan including Tashkent, Samarkand, Bukhara, and Khiva. This comprehensive tour takes you through the ancient Silk Road cities, magnificent Islamic architecture, and vibrant bazaars.',
      shortDescription:
        'Explore the best of Uzbekistan in 8 days - Tashkent, Samarkand, Bukhara & Khiva',
      price: 1250,
      duration: 8,
      maxGroupSize: 12,
      difficulty: 'easy',
      categoryId: culturalCategory.id,
      images: [
        '/images/tours/classic-uzbekistan-1.jpg',
        '/images/tours/classic-uzbekistan-2.jpg',
        '/images/tours/classic-uzbekistan-3.jpg',
      ],
      highlights: [
        'Registan Square in Samarkand',
        'Gur-Emir Mausoleum',
        'Ark Fortress in Bukhara',
        'Poi Kalyan Complex',
        'Itchan Kala in Khiva',
      ],
      included: [
        'Accommodation in 3-4* hotels',
        'All breakfasts',
        'English-speaking guide',
        'All entrance fees',
        'Airport transfers',
      ],
      excluded: [
        'International flights',
        'Lunches and dinners',
        'Travel insurance',
        'Personal expenses',
      ],
      metaTitle: 'Classic Uzbekistan Tour - 8 Days | Jahongir Travel',
      metaDescription:
        'Experience the best of Uzbekistan with our 8-day classic tour covering Tashkent, Samarkand, Bukhara, and Khiva. Small groups, expert guides.',
      showPrice: true,
      isActive: true,
      isFeatured: true,
      publishedAt: new Date(),
    },
  });

  const tour2 = await prisma.tour.upsert({
    where: { slug: 'samarkand-highlights' },
    update: {},
    create: {
      title: 'Samarkand Highlights',
      slug: 'samarkand-highlights',
      description:
        'Immerse yourself in the beauty of Samarkand, the pearl of the Silk Road. Visit the famous Registan Square, Gur-Emir Mausoleum, and Shahi-Zinda necropolis.',
      shortDescription: 'Explore the jewel of the Silk Road in 3 days',
      price: 450,
      duration: 3,
      maxGroupSize: 15,
      difficulty: 'easy',
      categoryId: historicalCategory.id,
      images: [
        '/images/tours/samarkand-1.jpg',
        '/images/tours/samarkand-2.jpg',
      ],
      highlights: [
        'Registan Square',
        'Gur-Emir Mausoleum',
        'Shahi-Zinda Necropolis',
        'Bibi-Khanym Mosque',
        'Siab Bazaar',
      ],
      included: [
        'Hotel accommodation',
        'Daily breakfast',
        'Professional guide',
        'Entrance tickets',
        'Transportation',
      ],
      excluded: [
        'Flights',
        'Lunch and dinner',
        'Tips',
        'Personal expenses',
      ],
      metaTitle: 'Samarkand Highlights Tour - 3 Days',
      metaDescription:
        'Discover Samarkand\'s magnificent Islamic architecture and Silk Road history in this 3-day intensive tour.',
      showPrice: true,
      isActive: true,
      isFeatured: true,
      publishedAt: new Date(),
    },
  });

  const tour3 = await prisma.tour.upsert({
    where: { slug: 'adventure-in-chimgan' },
    update: {},
    create: {
      title: 'Adventure in Chimgan Mountains',
      slug: 'adventure-in-chimgan',
      description:
        'Experience outdoor adventures in the beautiful Chimgan Mountains. Hiking, camping, and stunning nature await you.',
      shortDescription: 'Mountain adventure near Tashkent - 2 days',
      price: 280,
      duration: 2,
      maxGroupSize: 10,
      difficulty: 'moderate',
      categoryId: adventureCategory.id,
      images: ['/images/tours/chimgan-1.jpg', '/images/tours/chimgan-2.jpg'],
      highlights: [
        'Hiking in Chimgan Mountains',
        'Cable car ride',
        'Charvak Lake',
        'Mountain camping',
        'Traditional Uzbek dinner',
      ],
      included: [
        'Camping equipment',
        'All meals',
        'Mountain guide',
        'Transportation from Tashkent',
        'Cable car tickets',
      ],
      excluded: [
        'Personal hiking gear',
        'Travel insurance',
        'Tips for guide',
      ],
      metaTitle: 'Chimgan Mountains Adventure - 2 Days',
      metaDescription:
        'Escape to the Chimgan Mountains for a 2-day adventure including hiking, camping, and breathtaking views.',
      showPrice: true,
      isActive: true,
      isFeatured: false,
      publishedAt: new Date(),
    },
  });

  console.log('✓ Tours created');

  // Create itinerary items for Classic Uzbekistan Tour
  const itinerary1Day1 = await prisma.itineraryItem.create({
    data: {
      tourId: tour1.id,
      day: 1,
      title: 'Arrival in Tashkent',
      description:
        'Arrive at Tashkent International Airport. Transfer to hotel. City tour including Independence Square, Amir Temur Square, and Broadway.',
      activities: ['Airport transfer', 'City tour', 'Welcome dinner'],
      meals: ['Dinner'],
      accommodation: 'Hotel in Tashkent',
    },
  });

  const itinerary1Day2 = await prisma.itineraryItem.create({
    data: {
      tourId: tour1.id,
      day: 2,
      title: 'Tashkent to Samarkand',
      description:
        'Morning train to Samarkand. Visit Registan Square, Gur-Emir Mausoleum, and Bibi-Khanym Mosque.',
      activities: ['High-speed train', 'Registan tour', 'Local bazaar visit'],
      meals: ['Breakfast', 'Lunch'],
      accommodation: 'Hotel in Samarkand',
    },
  });

  console.log('✓ Itinerary items created');

  // Create sample reviews
  await prisma.review.create({
    data: {
      tourId: tour1.id,
      name: 'John Smith',
      email: 'john@example.com',
      country: 'USA',
      rating: 5,
      title: 'Amazing experience!',
      comment:
        'This tour exceeded all my expectations. The cities are absolutely stunning, and our guide was incredibly knowledgeable. Highly recommended!',
      images: [],
      isApproved: true,
      isFeatured: true,
    },
  });

  await prisma.review.create({
    data: {
      tourId: tour1.id,
      name: 'Maria Garcia',
      email: 'maria@example.com',
      country: 'Spain',
      rating: 5,
      title: 'Unforgettable journey',
      comment:
        'The architecture, food, and people made this trip unforgettable. Samarkand was my favorite stop. Perfect organization!',
      images: [],
      isApproved: true,
      isFeatured: false,
    },
  });

  await prisma.review.create({
    data: {
      tourId: tour2.id,
      name: 'David Lee',
      email: 'david@example.com',
      country: 'UK',
      rating: 4,
      title: 'Beautiful Samarkand',
      comment:
        'Samarkand is truly magical. The Registan at sunset is breathtaking. Would have loved one more day to explore.',
      images: [],
      isApproved: true,
      isFeatured: false,
    },
  });

  console.log('✓ Reviews created');

  // Create FAQs
  await prisma.tourFaq.createMany({
    data: [
      {
        tourId: tour1.id,
        question: 'What is included in the tour price?',
        answer:
          'The tour price includes accommodation in 3-4* hotels, all breakfasts, English-speaking guide, all entrance fees, and airport transfers.',
        order: 1,
      },
      {
        tourId: tour1.id,
        question: 'Do I need a visa for Uzbekistan?',
        answer:
          'Citizens of many countries can visit Uzbekistan visa-free for up to 30 days. Please check the latest visa requirements for your country.',
        order: 2,
      },
      {
        tourId: tour1.id,
        question: 'What is the best time to visit?',
        answer:
          'The best time to visit Uzbekistan is spring (April-May) and autumn (September-October) when the weather is pleasant.',
        order: 3,
      },
    ],
  });

  console.log('✓ FAQs created');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@jahongir-travel.uz' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@jahongir-travel.uz',
      password: '$2b$10$YourHashedPasswordHere', // This should be a hashed password
      role: 'admin',
      isActive: true,
      emailVerified: true,
    },
  });

  console.log('✓ Admin user created');

  console.log('✅ Database seeded successfully!');
  console.log(`
  Summary:
  - Categories: 3
  - Cities: 3
  - Tours: 3
  - Itinerary items: 2
  - Reviews: 3
  - FAQs: 3
  - Users: 1
  `);
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
