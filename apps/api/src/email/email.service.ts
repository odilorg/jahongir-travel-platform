import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

interface PasswordResetEmailData {
  email: string;
  name: string;
  resetUrl: string;
}

interface BookingConfirmationData {
  email: string;
  name: string;
  tourTitle: string;
  date: string;
  numberOfPeople: number;
  totalPrice: number;
  bookingId: string;
}

interface BookingNotificationData {
  customerName: string;
  customerEmail: string;
  tourTitle: string;
  date: string;
  numberOfPeople: number;
  totalPrice: number;
  bookingId: string;
}

interface ContactNotificationData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

interface ContactConfirmationData {
  email: string;
  name: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '1026', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
    });
  }

  async sendPasswordReset(data: PasswordResetEmailData): Promise<void> {
    const { email, name, resetUrl } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: #f9fafb; border-radius: 8px; padding: 32px; }
    .header { text-align: center; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: bold; color: #1d4ed8; }
    h1 { color: #111827; font-size: 20px; margin-bottom: 16px; }
    p { color: #4b5563; margin-bottom: 16px; }
    .button { display: inline-block; background: #1d4ed8; color: white !important; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; margin: 16px 0; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
    .link { color: #1d4ed8; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><div class="logo">Jahongir Travel</div></div>
    <h1>Password Reset Request</h1>
    <p>Hello ${name},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>
    <p style="text-align: center;"><a href="${resetUrl}" class="button">Reset Password</a></p>
    <p>This link will expire in <strong>1 hour</strong>.</p>
    <p>If you didn't request a password reset, you can safely ignore this email.</p>
    <p>If the button doesn't work, copy and paste this link: <a href="${resetUrl}" class="link">${resetUrl}</a></p>
    <div class="footer"><p>Jahongir Travel Admin System</p></div>
  </div>
</body>
</html>`;

    const text = `Hello ${name},

We received a request to reset your password.

Click the link below to create a new password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email.

---
Jahongir Travel Admin System`;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@jahongirtravel.uz',
        to: email,
        subject: 'Password Reset - Jahongir Travel',
        text,
        html,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendBookingConfirmation(data: BookingConfirmationData): Promise<void> {
    const { email, name, tourTitle, date, numberOfPeople, totalPrice, bookingId } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: #f9fafb; border-radius: 8px; padding: 32px; }
    .header { text-align: center; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: bold; color: #1d4ed8; }
    h1 { color: #111827; font-size: 20px; margin-bottom: 16px; }
    .details { background: white; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
    .detail-row:last-child { border-bottom: none; }
    .footer { margin-top: 32px; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><div class="logo">Jahongir Travel</div></div>
    <h1>Booking Confirmation</h1>
    <p>Dear ${name},</p>
    <p>Thank you for booking with Jahongir Travel! Your booking has been confirmed.</p>
    <div class="details">
      <div class="detail-row"><span>Booking ID:</span><strong>${bookingId}</strong></div>
      <div class="detail-row"><span>Tour:</span><strong>${tourTitle}</strong></div>
      <div class="detail-row"><span>Date:</span><strong>${date}</strong></div>
      <div class="detail-row"><span>Guests:</span><strong>${numberOfPeople}</strong></div>
      <div class="detail-row"><span>Total:</span><strong>$${totalPrice.toFixed(2)}</strong></div>
    </div>
    <p>We will contact you shortly with more details about your tour.</p>
    <div class="footer"><p>Jahongir Travel</p></div>
  </div>
</body>
</html>`;

    const text = `Dear ${name},

Thank you for booking with Jahongir Travel!

Booking Details:
- Booking ID: ${bookingId}
- Tour: ${tourTitle}
- Date: ${date}
- Guests: ${numberOfPeople}
- Total: $${totalPrice.toFixed(2)}

We will contact you shortly with more details.

---
Jahongir Travel`;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@jahongirtravel.uz',
        to: email,
        subject: `Booking Confirmation - ${tourTitle}`,
        text,
        html,
      });
      this.logger.log(`Booking confirmation sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send booking confirmation to ${email}`, error);
    }
  }

  async sendBookingNotification(data: BookingNotificationData): Promise<void> {
    const { customerName, customerEmail, tourTitle, date, numberOfPeople, totalPrice, bookingId } = data;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@jahongirtravel.uz';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: #f0fdf4; border-radius: 8px; padding: 32px; }
    h1 { color: #166534; font-size: 20px; margin-bottom: 16px; }
    .details { background: white; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .detail-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎉 New Booking Received!</h1>
    <div class="details">
      <div class="detail-row"><strong>Booking ID:</strong> ${bookingId}</div>
      <div class="detail-row"><strong>Customer:</strong> ${customerName} (${customerEmail})</div>
      <div class="detail-row"><strong>Tour:</strong> ${tourTitle}</div>
      <div class="detail-row"><strong>Date:</strong> ${date}</div>
      <div class="detail-row"><strong>Guests:</strong> ${numberOfPeople}</div>
      <div class="detail-row"><strong>Total:</strong> $${totalPrice.toFixed(2)}</div>
    </div>
  </div>
</body>
</html>`;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@jahongirtravel.uz',
        to: adminEmail,
        subject: `New Booking: ${tourTitle} - ${customerName}`,
        html,
      });
      this.logger.log(`Booking notification sent to admin`);
    } catch (error) {
      this.logger.error(`Failed to send booking notification`, error);
    }
  }

  async sendContactNotification(data: ContactNotificationData): Promise<void> {
    const { name, email, phone, subject, message } = data;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@jahongirtravel.uz';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: #fef3c7; border-radius: 8px; padding: 32px; }
    h1 { color: #92400e; font-size: 20px; margin-bottom: 16px; }
    .details { background: white; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .message { background: #f9fafb; padding: 16px; border-radius: 8px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>📬 New Contact Message</h1>
    <div class="details">
      <p><strong>From:</strong> ${name} (${email})</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
      <div class="message"><p>${message}</p></div>
    </div>
  </div>
</body>
</html>`;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@jahongirtravel.uz',
        to: adminEmail,
        subject: `Contact: ${subject || 'New message'} from ${name}`,
        html,
      });
      this.logger.log(`Contact notification sent to admin`);
    } catch (error) {
      this.logger.error(`Failed to send contact notification`, error);
    }
  }

  async sendContactConfirmation(data: ContactConfirmationData): Promise<void> {
    const { email, name } = data;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .container { background: #f9fafb; border-radius: 8px; padding: 32px; }
    .header { text-align: center; margin-bottom: 24px; }
    .logo { font-size: 24px; font-weight: bold; color: #1d4ed8; }
    .footer { margin-top: 32px; font-size: 12px; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><div class="logo">Jahongir Travel</div></div>
    <p>Dear ${name},</p>
    <p>Thank you for contacting Jahongir Travel! We have received your message and will get back to you as soon as possible.</p>
    <p>Our team typically responds within 24 hours.</p>
    <div class="footer"><p>Jahongir Travel</p></div>
  </div>
</body>
</html>`;

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@jahongirtravel.uz',
        to: email,
        subject: 'Thank you for contacting Jahongir Travel',
        html,
      });
      this.logger.log(`Contact confirmation sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send contact confirmation to ${email}`, error);
    }
  }
}
