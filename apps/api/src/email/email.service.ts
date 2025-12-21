import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    // Initialize transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '1025'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          }
        : undefined,
    });
  }

  /**
   * Send email using template
   */
  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    context: Record<string, any>,
  ): Promise<void> {
    try {
      // Read template file
      // NestJS compiles to dist even in dev mode
      // __dirname in watch mode: .../apps/api/dist/src/email
      // Templates are in source: .../apps/api/src/email/templates
      // Go up from dist/src/email to project root, then to src/email/templates
      const templatePath = path.join(
        __dirname,
        '../../../src/email/templates',
        `${templateName}.hbs`,
      );
      const templateContent = await fs.readFile(templatePath, 'utf-8');

      // Compile template
      const template = handlebars.compile(templateContent);
      const html = template(context);

      // Send email
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@jahongir-travel.uz',
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
      throw error;
    }
  }

  /**
   * Send contact form notification to admin
   */
  async sendContactNotification(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<void> {
    await this.sendEmail(
      process.env.ADMIN_EMAIL || 'admin@jahongir-travel.uz',
      `New Contact Form Submission from ${data.name}`,
      'contact-notification',
      data,
    );
  }

  /**
   * Send contact form confirmation to user
   */
  async sendContactConfirmation(data: {
    name: string;
    email: string;
  }): Promise<void> {
    await this.sendEmail(
      data.email,
      'We received your message - Jahongir Travel',
      'contact-confirmation',
      data,
    );
  }

  /**
   * Send booking confirmation
   */
  async sendBookingConfirmation(data: {
    email: string;
    name: string;
    tourTitle: string;
    date: string;
    numberOfPeople: number;
    totalPrice: number;
    bookingId: string;
  }): Promise<void> {
    await this.sendEmail(
      data.email,
      `Booking Confirmation - ${data.tourTitle}`,
      'booking-confirmation',
      data,
    );
  }

  /**
   * Send booking notification to admin
   */
  async sendBookingNotification(data: {
    customerName: string;
    customerEmail: string;
    tourTitle: string;
    date: string;
    numberOfPeople: number;
    totalPrice: number;
    bookingId: string;
  }): Promise<void> {
    await this.sendEmail(
      process.env.ADMIN_EMAIL || 'admin@jahongir-travel.uz',
      `New Booking: ${data.tourTitle}`,
      'booking-notification',
      data,
    );
  }
}
