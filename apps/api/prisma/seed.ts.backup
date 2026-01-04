import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...\n');

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
  // 2. TOUR CATEGORIES
  // ============================================================================
  console.log('\n📂 Creating tour categories...');

  const culturalCategory = await prisma.tourCategory.upsert({
    where: { slug: 'cultural-tours' },
    update: {},
    create: {
      name: 'Cultural Tours',
      slug: 'cultural-tours',
      description: 'Explore the rich cultural heritage of Uzbekistan, from ancient Silk Road cities to traditional crafts.',
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=400&fit=crop',
      icon: '🏛️',
      order: 1,
    },
  });

  const historicalCategory = await prisma.tourCategory.upsert({
    where: { slug: 'historical-tours' },
    update: {},
    create: {
      name: 'Historical Tours',
      slug: 'historical-tours',
      description: 'Journey through millennia of history, visiting ancient monuments and UNESCO sites.',
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop',
      icon: '🕌',
      order: 2,
    },
  });

  const adventureCategory = await prisma.tourCategory.upsert({
    where: { slug: 'adventure-tours' },
    update: {},
    create: {
      name: 'Adventure Tours',
      slug: 'adventure-tours',
      description: 'Trekking, hiking, and outdoor adventures in mountains and deserts.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      icon: '🏔️',
      order: 3,
    },
  });

  const familyCategory = await prisma.tourCategory.upsert({
    where: { slug: 'family-tours' },
    update: {},
    create: {
      name: 'Family Tours',
      slug: 'family-tours',
      description: 'Family-friendly tours for travelers of all ages.',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&h=400&fit=crop',
      icon: '👨‍👩‍👧‍👦',
      order: 4,
    },
  });

  console.log('✓ 4 tour categories created');

  // ============================================================================
  // 3. CITIES
  // ============================================================================
  console.log('\n🏙️ Creating cities...');

  const samarkand = await prisma.city.upsert({
    where: { slug: 'samarkand' },
    update: {},
    create: {
      name: 'Samarkand',
      slug: 'samarkand',
      description: 'The Pearl of the East - home to stunning Islamic architecture including Registan Square.',
      country: 'Uzbekistan',
      latitude: 39.6542,
      longitude: 66.9597,
      image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop',
      images: ['https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&h=600&fit=crop'],
    },
  });

  const bukhara = await prisma.city.upsert({
    where: { slug: 'bukhara' },
    update: {},
    create: {
      name: 'Bukhara',
      slug: 'bukhara',
      description: 'UNESCO World Heritage site with over 140 architectural monuments.',
      country: 'Uzbekistan',
      latitude: 39.7747,
      longitude: 64.4286,
      image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
      images: [],
    },
  });

  const khiva = await prisma.city.upsert({
    where: { slug: 'khiva' },
    update: {},
    create: {
      name: 'Khiva',
      slug: 'khiva',
      description: 'Open-air museum city with perfectly preserved old town (Itchan Kala).',
      country: 'Uzbekistan',
      latitude: 41.3775,
      longitude: 60.3641,
      image: 'https://images.unsplash.com/photo-1512690459411-b9245f6eb793?w=800&h=600&fit=crop',
      images: [],
    },
  });

  const tashkent = await prisma.city.upsert({
    where: { slug: 'tashkent' },
    update: {},
    create: {
      name: 'Tashkent',
      slug: 'tashkent',
      description: 'Capital of Uzbekistan, blending modern development with historical monuments.',
      country: 'Uzbekistan',
      latitude: 41.2995,
      longitude: 69.2401,
      image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&h=600&fit=crop',
      images: [],
    },
  });

  console.log('✓ 4 cities created');

  // ============================================================================
  // 4. TOURS
  // ============================================================================
  console.log('\n🎫 Creating tours...');

  const classicTour = await prisma.tour.upsert({
    where: { slug: 'classic-uzbekistan-7-days' },
    update: {},
    create: {
      title: 'Classic Uzbekistan: 7-Day Journey',
      slug: 'classic-uzbekistan-7-days',
      description: 'Experience the highlights of Uzbekistan. Visit Tashkent, Samarkand, Bukhara, and Khiva. Marvel at stunning Islamic architecture, explore ancient bazaars, and immerse yourself in local culture.',
      shortDescription: 'Discover the best of Uzbekistan in one week. From Registan Square to the Ark of Bukhara.',
      price: 1299,
      duration: 7,
      maxGroupSize: 16,
      difficulty: 'Easy',
      categoryId: culturalCategory.id,
      images: [
        'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&h=800&fit=crop',
        'https://images.unsplash.com/photo-1512690459411-b9245f6eb793?w=1200&h=800&fit=crop',
      ],
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
      showPrice: true,
      isActive: true,
      isFeatured: true,
      publishedAt: new Date(),
    },
  });

  const samarkandTour = await prisma.tour.upsert({
    where: { slug: 'samarkand-highlights-3-days' },
    update: {},
    create: {
      title: 'Samarkand Highlights: 3-Day Exploration',
      slug: 'samarkand-highlights-3-days',
      description: 'Dive deep into Samarkand history. This focused tour explores magnificent monuments at a relaxed pace.',
      shortDescription: 'Spend 3 days exploring the Pearl of the East.',
      price: 549,
      duration: 3,
      maxGroupSize: 12,
      difficulty: 'Easy',
      categoryId: historicalCategory.id,
      images: [
        'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=800&fit=crop',
      ],
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
      showPrice: true,
      isActive: true,
      isFeatured: true,
      publishedAt: new Date(),
    },
  });

  console.log('✓ 2 tours created');

  // ============================================================================
  // 5. ITINERARY ITEMS
  // ============================================================================
  console.log('\n📅 Creating itineraries...');

  await prisma.itineraryItem.createMany({
    data: [
      {
        tourId: classicTour.id,
        day: 1,
        title: 'Arrival in Tashkent',
        description: 'Welcome to Uzbekistan! Airport transfer to hotel. Rest and prepare for city tour.',
        activities: ['Airport transfer', 'Hotel check-in', 'Welcome briefing'],
        meals: ['Dinner'],
        accommodation: '4-star hotel in Tashkent',
      },
      {
        tourId: classicTour.id,
        day: 2,
        title: 'Tashkent City Tour & Train to Samarkand',
        description: 'Morning Tashkent tour. Visit Independence Square, Chorsu Bazaar. Afternoon train to Samarkand.',
        activities: ['City tour', 'Bazaar visit', 'High-speed train'],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'Hotel in Samarkand',
      },
      {
        tourId: samarkandTour.id,
        day: 1,
        title: 'Arrival & Registan Square',
        description: 'Arrive in Samarkand. Afternoon visit to Registan Square. Sunset illumination.',
        activities: ['Hotel check-in', 'Registan visit', 'Sunset photos'],
        meals: ['Breakfast'],
        accommodation: 'Boutique hotel',
      },
    ],
  });

  console.log('✓ Itinerary items created');

  // ============================================================================
  // 6. REVIEWS
  // ============================================================================
  console.log('\n⭐ Creating reviews...');

  await prisma.review.createMany({
    data: [
      {
        tourId: classicTour.id,
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        country: 'USA',
        rating: 5,
        title: 'Trip of a Lifetime!',
        comment: 'This tour exceeded all expectations. Our guide was incredibly knowledgeable. Registan Square at sunset was breathtaking!',
        images: [],
        isApproved: true,
        isFeatured: true,
      },
      {
        tourId: classicTour.id,
        name: 'Marco Rossi',
        email: 'marco.r@example.com',
        country: 'Italy',
        rating: 5,
        title: 'Incredible Cultural Experience',
        comment: 'Uzbekistan is a hidden gem! The architecture is stunning, people are welcoming. Highly recommend!',
        images: [],
        isApproved: true,
        isFeatured: false,
      },
    ],
  });

  console.log('✓ Reviews created');

  // ============================================================================
  // 7. BLOG CATEGORIES & POSTS
  // ============================================================================
  console.log('\n📝 Creating blog content...');

  const travelTipsCategory = await prisma.blogCategory.upsert({
    where: { slug: 'travel-tips' },
    update: {},
    create: {
      name: 'Travel Tips',
      slug: 'travel-tips',
      description: 'Practical advice for traveling in Uzbekistan',
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'top-10-things-samarkand' },
    update: {},
    create: {
      title: 'Top 10 Things to Do in Samarkand',
      slug: 'top-10-things-samarkand',
      excerpt: 'Discover must-see sights and hidden gems of the legendary Silk Road city.',
      content: '<h2>Introduction</h2><p>Samarkand is a treasure trove of Islamic architecture. Here are the top experiences you shouldn\'t miss.</p>',
      featuredImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&h=800&fit=crop',
      images: [],
      categoryId: travelTipsCategory.id,
      authorId: adminUser.id,
      cityId: samarkand.id,
      status: 'published',
      publishedAt: new Date(),
    },
  });

  console.log('✓ Blog content created');

  console.log('\n✅ Database seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log('   • 1 Admin user');
  console.log('   • 4 Tour categories');
  console.log('   • 4 Cities');
  console.log('   • 2 Tours with itineraries');
  console.log('   • 2 Reviews');
  console.log('   • 1 Blog category & 1 blog post');
  console.log('\n🔑 Admin credentials:');
  console.log('   Email: admin@jahongir-travel.uz');
  console.log('   Password: admin123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
