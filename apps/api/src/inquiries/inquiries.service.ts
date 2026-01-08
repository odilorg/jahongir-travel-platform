import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(private prisma: PrismaService) {}

  async create(createInquiryDto: CreateInquiryDto) {
    // Check for duplicate inquiry submissions (prevent double-click)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const duplicateWhere: any = {
      email: createInquiryDto.email.toLowerCase(),
      createdAt: { gte: fiveMinutesAgo },
      status: { notIn: ['closed', 'converted'] },
    };

    // If tourId is provided, check for duplicate inquiry for the same tour
    if (createInquiryDto.tourId) {
      duplicateWhere.tourId = createInquiryDto.tourId;
    }

    const recentDuplicate = await this.prisma.tourInquiry.findFirst({
      where: duplicateWhere,
      orderBy: { createdAt: 'desc' },
    });

    if (recentDuplicate) {
      this.logger.warn(
        `Duplicate inquiry detected from: ${createInquiryDto.email}${createInquiryDto.tourId ? ` for tour ${createInquiryDto.tourId}` : ''}`,
      );
      throw new BadRequestException(
        'You have recently submitted an inquiry. Please wait a few minutes before submitting again.',
      );
    }

    const inquiry = await this.prisma.tourInquiry.create({
      data: {
        ...createInquiryDto,
        travelDate: createInquiryDto.travelDate
          ? new Date(createInquiryDto.travelDate)
          : null,
        travelDateFrom: createInquiryDto.travelDateFrom
          ? new Date(createInquiryDto.travelDateFrom)
          : null,
        travelDateTo: createInquiryDto.travelDateTo
          ? new Date(createInquiryDto.travelDateTo)
          : null,
      },
      include: {
        ...(createInquiryDto.tourId && {
          tour: {
            select: {
              id: true,
              translations: {
                where: { locale: 'en' },
                take: 1,
              },
            },
          },
        }),
      },
    });

    this.logger.log(`New inquiry from: ${inquiry.email}`);

    // TODO: Send email notification

    return {
      message:
        'Thank you for your inquiry! We will contact you within 24 hours.',
      id: inquiry.id,
    };
  }

  async findAll(status?: string) {
    const where = status ? { status } : {};

    return this.prisma.tourInquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.tourInquiry.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.tourInquiry.update({
      where: { id },
      data: { status },
    });
  }
}
