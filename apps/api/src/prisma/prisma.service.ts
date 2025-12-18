import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Successfully connected to database');
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Disconnected from database');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    // Clean tables in correct order (respect foreign keys)
    await this.$transaction([
      this.blogComment.deleteMany(),
      this.blogPost.deleteMany(),
      this.blogCategory.deleteMany(),
      this.blogTag.deleteMany(),
      this.review.deleteMany(),
      this.tourFaq.deleteMany(),
      this.itineraryItem.deleteMany(),
      this.booking.deleteMany(),
      this.tourInquiry.deleteMany(),
      this.tour.deleteMany(),
      this.tourCategory.deleteMany(),
      this.contact.deleteMany(),
      this.lead.deleteMany(),
      this.setting.deleteMany(),
      this.redirect.deleteMany(),
      this.city.deleteMany(),
      this.user.deleteMany(),
    ]);

    this.logger.log('Database cleaned successfully');
  }
}
