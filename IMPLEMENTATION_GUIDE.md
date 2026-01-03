# 🚀 Implementation Guide - Jahongir Travel Platform

## ✅ What's Already Implemented

### Backend (NestJS API)
- ✅ 6 Core Modules (Tours, Categories, Reviews, Bookings, Users, Blog)
- ✅ Authentication System (JWT)
- ✅ Prisma ORM with PostgreSQL
- ✅ RESTful API endpoints
- ✅ Input validation & error handling

### Frontend (Next.js)
- ✅ 5 Public Pages (Home, Tours, Tour Detail, About, Contact)
- ✅ 6 Admin Pages (Dashboard, Tours, Categories, Reviews, Bookings, Users)
- ✅ Admin Login Page
- ✅ Responsive design (Mobile/Tablet/Desktop)
- ✅ API integration

---

## 📋 Remaining Features to Implement

### 1. Protected Routes & Auth Guards ⏳
### 2. Booking System with Payment Flow ⏳
### 3. Image Upload Functionality ⏳
### 4. Email Notification System ⏳
### 5. Deployment Configuration ⏳

---

## 1️⃣ Protected Routes & Auth Guards

### Backend: Protect Admin Endpoints

**Add guards to controllers:**

```typescript
// apps/api/src/tours/tours.controller.ts
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';

@Controller('tours')
export class ToursController {
  // Public endpoints
  @Get()
  findAll() { ... }

  @Get(':slug')
  findOne(@Param('slug') slug: string) { ... }

  // Protected endpoints (admin only)
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTourDto: CreateTourDto) { ... }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) { ... }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) { ... }
}
```

**Apply to all admin endpoints in:**
- `tours.controller.ts`
- `categories.controller.ts`
- `reviews.controller.ts`
- `bookings.controller.ts`

### Frontend: Protect Admin Routes

**Create middleware:**

```typescript
// apps/web/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value

  // Protect all /admin routes except /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') &&
      request.nextUrl.pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
```

**Update login to use cookies:**

```typescript
// apps/web/app/admin/login/page.tsx
// After successful login:
document.cookie = `admin_token=${data.access_token}; path=/; max-age=604800` // 7 days
```

---

## 2️⃣ Booking System with Payment Flow

### Step 1: Create Booking API Endpoint

```typescript
// apps/api/src/bookings/bookings.controller.ts
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.bookingsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }
}
```

### Step 2: Frontend Booking Form

```typescript
// apps/web/app/tours/[slug]/BookingForm.tsx
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function BookingForm({ tourId, price }: { tourId: string, price: number }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    numberOfPeople: 1,
    startDate: '',
    specialRequests: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:4000/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tourId,
          totalPrice: price * formData.numberOfPeople
        })
      })

      const booking = await response.json()

      // Redirect to payment page
      window.location.href = `/booking/${booking.id}/payment`
    } catch (error) {
      console.error('Booking failed:', error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book This Tour</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Form fields */}
          <Input
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          {/* Add other fields */}

          <div className="text-lg font-bold">
            Total: ${price * formData.numberOfPeople}
          </div>

          <Button type="submit" className="w-full">
            Continue to Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

### Step 3: Payment Integration (Stripe Example)

**Install Stripe:**
```bash
cd apps/api
pnpm add stripe
cd ../web
pnpm add @stripe/stripe-js @stripe/react-stripe-js
```

**Backend payment endpoint:**
```typescript
// apps/api/src/bookings/bookings.controller.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

@Post(':id/payment-intent')
async createPaymentIntent(@Param('id') id: string) {
  const booking = await this.bookingsService.findOne(id);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(booking.totalPrice * 100), // cents
    currency: 'usd',
    metadata: { bookingId: id },
  });

  return { clientSecret: paymentIntent.client_secret };
}
```

**Frontend payment page:**
```typescript
// apps/web/app/booking/[id]/payment/page.tsx
import { Elements, PaymentElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage({ params }: { params: { id: string } }) {
  // Implementation
}
```

---

## 3️⃣ Image Upload Functionality

### Step 1: Backend - Install Multer

```bash
cd apps/api
pnpm add @nestjs/platform-express multer
pnpm add -D @types/multer
```

### Step 2: Create Upload Module

```typescript
// apps/api/src/upload/upload.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\\/(jpg|jpeg|png|webp)$/)) {
          return callback(new Error('Only image files allowed'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      url: `/uploads/images/${file.filename}`,
      filename: file.filename,
      size: file.size,
    };
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultipleImages(@UploadedFiles() files: Express.Multer.File[]) {
    return files.map(file => ({
      url: `/uploads/images/${file.filename}`,
      filename: file.filename,
      size: file.size,
    }));
  }
}
```

### Step 3: Serve Static Files

```typescript
// apps/api/src/main.ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve uploaded files
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(4000);
}
```

### Step 4: Frontend Upload Component

```typescript
// apps/web/components/admin/ImageUpload.tsx
"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

export function ImageUpload({ onUpload }: { onUpload: (urls: string[]) => void }) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)

    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('files', file)
    })

    try {
      const response = await fetch('http://localhost:4000/api/upload/images', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      const urls = data.map((file: any) => `http://localhost:4000${file.url}`)
      onUpload(urls)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="image-upload"
      />
      <label htmlFor="image-upload">
        <Button type="button" disabled={uploading} asChild>
          <span>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Upload Images'}
          </span>
        </Button>
      </label>
    </div>
  )
}
```

---

## 4️⃣ Email Notification System

### Step 1: Install Nodemailer

```bash
cd apps/api
pnpm add @nestjs-modules/mailer nodemailer handlebars
pnpm add -D @types/nodemailer
```

### Step 2: Configure Mailer Module

```typescript
// apps/api/src/app.module.ts
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT) || 1025,
        secure: false,
        auth: process.env.SMTP_USER ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        } : undefined,
      },
      defaults: {
        from: '"JahongirTravel" <noreply@jahongir-travel.uz>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

### Step 3: Create Email Service

```typescript
// apps/api/src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendBookingConfirmation(booking: any) {
    await this.mailerService.sendMail({
      to: booking.email,
      subject: 'Booking Confirmation - JahongirTravel',
      template: './booking-confirmation',
      context: {
        name: booking.name,
        tourTitle: booking.tour.title,
        startDate: booking.startDate,
        numberOfPeople: booking.numberOfPeople,
        totalPrice: booking.totalPrice,
      },
    });
  }

  async sendContactFormNotification(contact: any) {
    await this.mailerService.sendMail({
      to: 'admin@jahongir-travel.uz',
      subject: `New Contact Form: ${contact.subject}`,
      template: './contact-notification',
      context: contact,
    });
  }
}
```

### Step 4: Create Email Templates

```handlebars
<!-- apps/api/src/templates/booking-confirmation.hbs -->
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #3b82f6; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9fafb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmation</h1>
    </div>
    <div class="content">
      <p>Dear {{name}},</p>
      <p>Your booking for <strong>{{tourTitle}}</strong> has been confirmed!</p>
      <h3>Booking Details:</h3>
      <ul>
        <li>Tour: {{tourTitle}}</li>
        <li>Start Date: {{startDate}}</li>
        <li>Number of People: {{numberOfPeople}}</li>
        <li>Total Price: ${{totalPrice}}</li>
      </ul>
      <p>We look forward to seeing you!</p>
      <p>Best regards,<br>JahongirTravel Team</p>
    </div>
  </div>
</body>
</html>
```

---

## 5️⃣ Deployment Configuration

### Prerequisites

1. **VPS Server** (Ubuntu 22.04 recommended)
2. **Domain name** configured with DNS pointing to VPS
3. **SSL certificate** (Let's Encrypt)

### Step 1: Prepare VPS

```bash
# Connect to VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Redis
apt install -y redis-server
```

### Step 2: Setup PostgreSQL

```bash
sudo -u postgres psql

CREATE DATABASE jahongir_travel_prod;
CREATE USER jahongir_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE jahongir_travel_prod TO jahongir_user;
\\q
```

### Step 3: Clone and Build Project

```bash
# Create directory
mkdir -p /var/www
cd /var/www

# Clone repository
git clone https://github.com/your-repo/jahongir-travel-platform.git
cd jahongir-travel-platform

# Install dependencies
pnpm install

# Create .env file
cd apps/api
cp .env.example .env
# Edit .env with production values

# Run migrations
pnpm prisma migrate deploy
pnpm prisma db seed

# Build all apps
cd /var/www/jahongir-travel-platform
pnpm build
```

### Step 4: Configure PM2

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [
    {
      name: 'api',
      cwd: '/var/www/jahongir-travel-platform/apps/api',
      script: 'pnpm',
      args: 'start:prod',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'web',
      cwd: '/var/www/jahongir-travel-platform/apps/web',
      script: 'pnpm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
EOF

# Start apps
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### Step 5: Configure Nginx

```bash
# Create Nginx configuration
cat > /etc/nginx/sites-available/jahongir-travel <<EOF
# API
server {
    server_name api.jahongirtravel.uz;

    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

# Website
server {
    server_name jahongirtravel.uz www.jahongirtravel.uz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable site
ln -s /etc/nginx/sites-available/jahongir-travel /etc/nginx/sites-enabled/

# Test configuration
nginx -t

# Restart Nginx
systemctl restart nginx
```

### Step 6: Setup SSL with Certbot

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificates
certbot --nginx -d jahongirtravel.uz -d www.jahongirtravel.uz
certbot --nginx -d api.jahongirtravel.uz

# Auto-renewal (already configured by certbot)
```

### Step 7: Create Deployment Script

```bash
# Create deployment script
cat > /var/www/deploy.sh <<EOF
#!/bin/bash
cd /var/www/jahongir-travel-platform

# Pull latest code
git pull origin main

# Install dependencies
pnpm install

# Run migrations
cd apps/api
pnpm prisma migrate deploy
cd ../..

# Build all apps
pnpm build

# Restart PM2 processes
pm2 restart all

echo "Deployment complete!"
EOF

chmod +x /var/www/deploy.sh
```

---

## 📝 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://jahongir_user:password@localhost:5432/jahongir_travel_prod"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this"

# Redis
REDIS_URL="redis://localhost:6379"

# Email (Production - use real SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# Stripe (if using)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NODE_ENV="production"
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL="https://api.jahongirtravel.uz"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
```

---

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT secret
- [ ] Enable CORS only for your domains
- [ ] Use HTTPS everywhere
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Sanitize database queries
- [ ] Use environment variables for secrets
- [ ] Regular security updates
- [ ] Database backups

---

## 📊 Monitoring & Maintenance

### PM2 Monitoring

```bash
pm2 status              # Check status
pm2 logs                # View logs
pm2 monit               # Real-time monitoring
pm2 restart all         # Restart all apps
```

### Database Backups

```bash
# Create backup script
cat > /var/www/backup-db.sh <<EOF
#!/bin/bash
BACKUP_DIR="/var/backups/postgres"
mkdir -p \$BACKUP_DIR

pg_dump -U jahongir_user jahongir_travel_prod > \$BACKUP_DIR/backup_\$(date +%Y%m%d_%H%M%S).sql

# Keep only last 7 days
find \$BACKUP_DIR -type f -mtime +7 -delete
EOF

chmod +x /var/www/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /var/www/backup-db.sh
```

---

## 🎉 You're Done!

Your complete travel booking platform is now implemented and deployed!

**Access URLs:**
- Website: https://jahongirtravel.uz
- API: https://api.jahongirtravel.uz
- Admin: https://jahongirtravel.uz/admin

**Need Help?**
- Check logs: `pm2 logs`
- Test API: `curl https://api.jahongirtravel.uz/health`
- Monitor: `pm2 monit`

Happy coding! 🚀
