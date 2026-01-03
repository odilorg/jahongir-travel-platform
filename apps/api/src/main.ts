import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const logger = new Logger('Bootstrap');

  // Serve static files from uploads directory
  // Use process.cwd() to get the correct path regardless of compiled location
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Web app (local)
      'http://localhost:3001', // Admin app (local)
      'http://localhost:3002', // Web app (alternate port)
      'http://localhost:3003', // Web app (alternate port)
      'http://localhost:3004', // Admin app (alternate port)
      'http://dev.jahongir-travel.uz:3010', // Web app (VPS)
      'http://dev.jahongir-travel.uz:3011', // Admin app (VPS)
      process.env.WEB_URL,
      process.env.ADMIN_URL,
    ].filter((url): url is string => typeof url === 'string'),
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.APP_PORT || 4000;
  await app.listen(port);

  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`API available at: http://localhost:${port}/api`);
}
bootstrap();
