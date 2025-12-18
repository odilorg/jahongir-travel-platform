import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // Web app
      'http://localhost:3001', // Admin app
      process.env.WEB_URL,
      process.env.ADMIN_URL,
    ].filter(Boolean),
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
