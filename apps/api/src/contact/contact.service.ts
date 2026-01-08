import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(createContactDto: CreateContactDto) {
    // Check for duplicate contact submissions (prevent double-click)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const recentDuplicate = await this.prisma.contact.findFirst({
      where: {
        email: createContactDto.email.toLowerCase(),
        createdAt: { gte: fiveMinutesAgo },
        status: { not: 'closed' },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (recentDuplicate) {
      this.logger.warn(
        `Duplicate contact submission detected from: ${createContactDto.email}`,
      );
      throw new BadRequestException(
        'You have recently submitted a message. Please wait a few minutes before submitting again.',
      );
    }

    const contact = await this.prisma.contact.create({
      data: createContactDto,
    });

    this.logger.log(`New contact message from: ${contact.email}`);

    // Send email notifications (don't block response if email fails)
    try {
      // Send notification to admin
      await this.emailService.sendContactNotification({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || undefined,
        message: contact.message,
      });

      // Send confirmation to user
      await this.emailService.sendContactConfirmation({
        name: contact.name,
        email: contact.email,
      });

      this.logger.log(`Email notifications sent for contact: ${contact.id}`);
    } catch (error) {
      // Log error but don't fail the request
      this.logger.error(`Failed to send email notifications: ${error.message}`);
    }

    return {
      message: 'Your message has been sent successfully. We will get back to you soon!',
      id: contact.id,
    };
  }

  async findAll(status?: string) {
    const where = status ? { status } : {};

    return this.prisma.contact.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.contact.update({
      where: { id },
      data: { status },
    });
  }
}
