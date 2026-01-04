import { Module } from '@nestjs/common';
import { AdminTranslationsController } from './admin-translations.controller';
import { AdminTranslationsService } from './admin-translations.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminTranslationsController],
  providers: [AdminTranslationsService],
  exports: [AdminTranslationsService],
})
export class AdminTranslationsModule {}
