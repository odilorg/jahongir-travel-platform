import { Test, TestingModule } from '@nestjs/testing';
import { ToursService } from './tours.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Locale } from '@prisma/client';

describe('ToursService', () => {
  let service: ToursService;
  let prisma: PrismaService;

  const mockTour = {
    id: 'tour-1',
    categoryId: 'category-1',
    price: 100,
    duration: 3,
    maxGroupSize: 10,
    difficulty: 'Moderate',
    images: ['image1.jpg'],
    showPrice: true,
    discountedPrice: null,
    isActive: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: null,
    translations: [
      {
        id: 'trans-1',
        tourId: 'tour-1',
        locale: 'en' as Locale,
        title: 'Test Tour',
        slug: 'test-tour',
        summary: 'A test tour',
        description: 'Full description',
        highlights: ['Highlight 1'],
        included: ['Included 1'],
        excluded: ['Excluded 1'],
        metaTitle: null,
        metaDescription: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    category: {
      id: 'category-1',
      icon: '🏛️',
      image: null,
      order: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: 'cat-trans-1',
          categoryId: 'category-1',
          locale: 'en' as Locale,
          name: 'Cultural Tours',
          slug: 'cultural-tours',
          description: 'Cultural tours description',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    itineraryItems: [],
    reviews: [],
    faqs: [],
    _count: { reviews: 0, bookings: 0 },
  };

  const mockPrismaService = {
    tour: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    tourCategory: {
      findFirst: jest.fn(),
    },
    review: {
      aggregate: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ToursService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ToursService>(ToursService);
    prisma = module.get<PrismaService>(PrismaService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tour successfully', async () => {
      const createDto = {
        title: 'New Tour',
        slug: 'new-tour',
        categoryId: 'category-1',
        duration: 5,
        price: 200,
      };

      mockPrismaService.tour.create.mockResolvedValue(mockTour);

      const result = await service.create(createDto);

      expect(result).toEqual(mockTour);
      expect(mockPrismaService.tour.create).toHaveBeenCalledWith({
        data: {
          title: 'New Tour',
          slug: 'new-tour',
          duration: 5,
          price: 200,
          category: { connect: { id: 'category-1' } },
        },
        include: { category: true, translations: true },
      });
    });

    it('should throw BadRequestException for duplicate slug', async () => {
      mockPrismaService.tour.create.mockRejectedValue({ code: 'P2002' });

      await expect(
        service.create({
          title: 'Test',
          slug: 'existing-slug',
          categoryId: 'cat-1',
          duration: 1,
          price: 100,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException for invalid category', async () => {
      mockPrismaService.tour.create.mockRejectedValue({ code: 'P2025' });

      await expect(
        service.create({
          title: 'Test',
          slug: 'test',
          categoryId: 'invalid-category',
          duration: 1,
          price: 100,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated tours', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it('should filter by categoryId', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.findAll({ categoryId: 'category-1' });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoryId: 'category-1' }),
        }),
      );
    });

    it('should filter by difficulty', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.findAll({ difficulty: 'Easy' });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ difficulty: 'Easy' }),
        }),
      );
    });

    it('should sort by price ascending', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);
      mockPrismaService.tour.count.mockResolvedValue(1);

      await service.findAll({ sortBy: 'price-asc' });

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { price: 'asc' },
        }),
      );
    });
  });

  describe('findById', () => {
    it('should return tour by id with categoryId included', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue(mockTour);
      mockPrismaService.review.aggregate.mockResolvedValue({ _avg: { rating: 4.5 } });

      const result = await service.findById('tour-1');

      expect(result.id).toBe('tour-1');
      expect(result.categoryId).toBe('category-1'); // Verify categoryId is included
      expect(result.category.id).toBe('category-1');
      expect(result.title).toBe('Test Tour');
    });

    it('should throw NotFoundException for invalid id', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tour successfully', async () => {
      mockPrismaService.tour.update.mockResolvedValue(mockTour);

      const result = await service.update('tour-1', { price: 150 });

      expect(result).toEqual(mockTour);
      expect(mockPrismaService.tour.update).toHaveBeenCalled();
    });

    it('should filter out translation fields when updating', async () => {
      mockPrismaService.tour.update.mockResolvedValue(mockTour);

      await service.update('tour-1', {
        price: 150,
        title: 'New Title', // Should be filtered
        slug: 'new-slug', // Should be filtered
        description: 'New desc', // Should be filtered
        highlights: ['h1'], // Should be filtered
      });

      // Verify translation fields are NOT passed to Prisma
      expect(mockPrismaService.tour.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.not.objectContaining({
            title: expect.anything(),
            slug: expect.anything(),
            description: expect.anything(),
            highlights: expect.anything(),
          }),
        }),
      );
    });

    it('should update category connection', async () => {
      mockPrismaService.tour.update.mockResolvedValue(mockTour);

      await service.update('tour-1', { categoryId: 'new-category-id' });

      expect(mockPrismaService.tour.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            category: { connect: { id: 'new-category-id' } },
          }),
        }),
      );
    });

    it('should throw NotFoundException for invalid tour id', async () => {
      mockPrismaService.tour.update.mockRejectedValue({ code: 'P2025' });

      await expect(service.update('invalid-id', { price: 100 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a tour successfully', async () => {
      mockPrismaService.tour.delete.mockResolvedValue(mockTour);

      const result = await service.remove('tour-1');

      expect(result.message).toBe('Tour deleted successfully');
    });

    it('should throw NotFoundException for invalid id', async () => {
      mockPrismaService.tour.delete.mockRejectedValue({ code: 'P2025' });

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFeaturedTours', () => {
    it('should return featured tours', async () => {
      mockPrismaService.tour.findMany.mockResolvedValue([mockTour]);

      const result = await service.getFeaturedTours(6);

      expect(mockPrismaService.tour.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true, isFeatured: true },
          take: 6,
        }),
      );
      expect(result).toHaveLength(1);
    });
  });
});
