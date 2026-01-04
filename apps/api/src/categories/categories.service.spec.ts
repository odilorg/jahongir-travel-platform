import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Locale } from '@prisma/client';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockCategory = {
    id: 'category-1',
    icon: '🏛️',
    image: null,
    order: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    translations: [
      {
        id: 'trans-1',
        categoryId: 'category-1',
        locale: 'en' as Locale,
        name: 'Cultural Tours',
        slug: 'cultural-tours',
        description: 'Explore cultural heritage',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    _count: { tours: 5 },
  };

  const mockPrismaService = {
    tourCategory: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    tourCategoryTranslation: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      mockPrismaService.tourCategory.create.mockResolvedValue(mockCategory);

      const result = await service.create({ icon: '🏛️', order: 1 });

      expect(result).toEqual(mockCategory);
      expect(mockPrismaService.tourCategory.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException for duplicate slug', async () => {
      mockPrismaService.tourCategory.create.mockRejectedValue({ code: 'P2002' });

      await expect(service.create({ icon: '🏛️' })).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return categories with flattened translations', async () => {
      mockPrismaService.tourCategory.findMany.mockResolvedValue([mockCategory]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Cultural Tours');
      expect(result[0].slug).toBe('cultural-tours');
    });

    it('should filter active categories by default', async () => {
      mockPrismaService.tourCategory.findMany.mockResolvedValue([mockCategory]);

      await service.findAll(false);

      expect(mockPrismaService.tourCategory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { isActive: true },
        }),
      );
    });

    it('should include inactive when specified', async () => {
      mockPrismaService.tourCategory.findMany.mockResolvedValue([mockCategory]);

      await service.findAll(true);

      expect(mockPrismaService.tourCategory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return category by slug with tours', async () => {
      const categoryWithTours = {
        ...mockCategory,
        tours: [
          {
            id: 'tour-1',
            price: 100,
            duration: 3,
            images: [],
            isFeatured: false,
            createdAt: new Date(),
            translations: [
              { locale: 'en' as Locale, title: 'Test Tour', slug: 'test-tour', summary: null },
            ],
            _count: { reviews: 0 },
          },
        ],
      };

      mockPrismaService.tourCategoryTranslation.findFirst.mockResolvedValue({
        category: categoryWithTours,
      });

      const result = await service.findOne('cultural-tours');

      expect(result.name).toBe('Cultural Tours');
      expect(result.tours).toHaveLength(1);
    });

    it('should throw NotFoundException for invalid slug', async () => {
      mockPrismaService.tourCategoryTranslation.findFirst.mockResolvedValue(null);

      await expect(service.findOne('invalid-slug')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update category successfully', async () => {
      mockPrismaService.tourCategory.update.mockResolvedValue({
        ...mockCategory,
        icon: '🏰',
      });

      const result = await service.update('category-1', { icon: '🏰' });

      expect(result.icon).toBe('🏰');
    });

    it('should throw NotFoundException for invalid id', async () => {
      mockPrismaService.tourCategory.update.mockRejectedValue({ code: 'P2025' });

      await expect(service.update('invalid-id', { icon: '🏰' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException for duplicate slug', async () => {
      mockPrismaService.tourCategory.update.mockRejectedValue({ code: 'P2002' });

      await expect(service.update('category-1', {})).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete category successfully', async () => {
      mockPrismaService.tourCategory.findUnique.mockResolvedValue({
        ...mockCategory,
        _count: { tours: 0 },
      });
      mockPrismaService.tourCategory.delete.mockResolvedValue(mockCategory);

      const result = await service.remove('category-1');

      expect(result.message).toBe('Category deleted successfully');
    });

    it('should throw NotFoundException for invalid id', async () => {
      mockPrismaService.tourCategory.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if category has tours', async () => {
      mockPrismaService.tourCategory.findUnique.mockResolvedValue(mockCategory);

      await expect(service.remove('category-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getPopular', () => {
    it('should return popular categories ordered by tour count', async () => {
      mockPrismaService.tourCategory.findMany.mockResolvedValue([mockCategory]);

      const result = await service.getPopular(6);

      expect(result).toHaveLength(1);
      expect(mockPrismaService.tourCategory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          orderBy: { tours: { _count: 'desc' } },
          take: 6,
        }),
      );
    });
  });
});
