import { IsString, IsOptional, IsIn, MaxLength, IsDateString, IsInt, Min } from 'class-validator';

export class UpdateBookingDto {
  @IsDateString({}, { message: 'Travel date must be a valid date' })
  @IsOptional()
  travelDate?: string;

  @IsInt({ message: 'Number of people must be an integer' })
  @Min(1, { message: 'Number of people must be at least 1' })
  @IsOptional()
  numberOfPeople?: number;

  @IsString({ message: 'Special requests must be a string' })
  @MaxLength(2000, { message: 'Special requests cannot exceed 2000 characters' })
  @IsOptional()
  specialRequests?: string;
}

export class UpdateBookingStatusDto {
  @IsString({ message: 'Status must be a string' })
  @IsIn(['pending', 'confirmed', 'cancelled'], {
    message: 'Status must be: pending, confirmed, or cancelled',
  })
  status: string;

  @IsString({ message: 'Notes must be a string' })
  @IsOptional()
  @MaxLength(1000, { message: 'Notes cannot exceed 1000 characters' })
  notes?: string;
}

export class UpdatePaymentStatusDto {
  @IsString({ message: 'Payment status must be a string' })
  @IsIn(['unpaid', 'partial', 'paid'], {
    message: 'Payment status must be: unpaid, partial, or paid',
  })
  paymentStatus: string;
}
