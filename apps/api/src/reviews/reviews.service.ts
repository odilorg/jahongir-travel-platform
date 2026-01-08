import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  private readonly logger = new Logger(ReviewsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    // Check for duplicate reviews (prevent multiple reviews from same person for same tour)
    // Use 24-hour window for reviews (less likely to legitimately submit multiple)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingReview = await this.prisma.review.findFirst({
      where: {
        tourId: createReviewDto.tourId,
        email: createReviewDto.email.toLowerCase(),
        createdAt: { gte: twentyFourHoursAgo },
        isSpam: false,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingReview) {
      this.logger.warn(
        `Duplicate review detected from ${createReviewDto.email} for tour ${createReviewDto.tourId}`,
      );
      throw new BadRequestException(
        'You have already submitted a review for this tour recently. Please wait 24 hours before submitting another review.',
      );
    }

    const review = await this.prisma.review.create({
      data: {
        ...createReviewDto,
        images: createReviewDto.images || [],
        isApproved: false, // Requires moderation
      },
    });

    this.logger.log(`New review submitted for tour: ${review.tourId}`);

    return {
      message:
        'Thank you for your review! It will be published after moderation.',
      id: review.id,
    };
  }

  async findAll(tourId?: string, approved: boolean = true) {
    const where = {
      ...(tourId && { tourId }),
      ...(approved && { isApproved: true }),
    };

    return this.prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        tour: {
          select: {
            id: true,
            translations: {
              where: { locale: 'en' },
              take: 1,
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID "${id}" not found`);
    }

    return review;
  }

  async approve(id: string) {
    const review = await this.prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });

    this.logger.log(`Approved review: ${id}`);
    return review;
  }

  async reject(id: string) {
    const review = await this.prisma.review.update({
      where: { id },
      data: { isApproved: false, isSpam: true },
    });

    this.logger.log(`Rejected review: ${id}`);
    return review;
  }

  async remove(id: string) {
    await this.prisma.review.delete({
      where: { id },
    });

    this.logger.log(`Deleted review: ${id}`);
    return { message: 'Review deleted successfully' };
  }
}
