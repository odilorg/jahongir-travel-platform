import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { GuestsModule } from '../guests/guests.module';
import { GuidesModule } from '../guides/guides.module';
import { DriversModule } from '../drivers/drivers.module';

@Module({
  imports: [PrismaModule, EmailModule, GuestsModule, GuidesModule, DriversModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
