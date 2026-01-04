import { Test, TestingModule } from '@nestjs/testing';
import { BookingsService } from './bookings.service';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { GuestsService } from '../guests/guests.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('BookingsService', () => {
  let service: BookingsService;
  let prisma: PrismaService;
  let emailService: EmailService;
  let guestsService: GuestsService;

  const mockTour = {
    id: 'tour-1',
    price: new Decimal(100),
    maxGroupSize: 10,
    isActive: true,
    translations: [{ title: 'Test Tour' }],
  };

  const mockGuest = {
    id: 'guest-1',
    email: 'guest@example.com',
    name: 'Guest User',
    totalBookings: 1,
  };

  const mockBooking = {
    id: 'booking-1',
    tourId: 'tour-1',
    guestId: 'guest-1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    travelDate: new Date('2026-06-15'),
    numberOfPeople: 2,
    totalPrice: new Decimal(200),
    specialRequests: null,
    status: 'pending',
    paymentStatus: 'unpaid',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    tour: {
      id: 'tour-1',
      translations: [{ title: 'Test Tour' }],
    },
    guest: {
      id: 'guest-1',
      totalBookings: 1,
    },
  };

  const mockPrismaService = {
    tour: {
      findUnique: jest.fn(),
    },
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    guide: {
      findUnique: jest.fn(),
    },
    driver: {
      findUnique: jest.fn(),
    },
    vehicle: {
      findUnique: jest.fn(),
    },
    bookingGuide: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    bookingDriver: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockEmailService = {
    sendBookingConfirmation: jest.fn().mockResolvedValue(undefined),
    sendBookingNotification: jest.fn().mockResolvedValue(undefined),
  };

  const mockGuestsService = {
    findOrCreate: jest.fn().mockResolvedValue(mockGuest),
    updateStats: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EmailService, useValue: mockEmailService },
        { provide: GuestsService, useValue: mockGuestsService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    prisma = module.get<PrismaService>(PrismaService);
    emailService = module.get<EmailService>(EmailService);
    guestsService = module.get<GuestsService>(GuestsService);

    // Reset all mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      tourId: 'tour-1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+1234567890',
      travelDate: '2026-06-15',
      numberOfPeople: 2,
    };

    it('should create a booking successfully', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue(mockTour);
      mockPrismaService.booking.create.mockResolvedValue(mockBooking);

      const result = await service.create(createDto);

      expect(result.message).toContain('booking has been received');
      expect(result.booking.id).toBe('booking-1');
      expect(mockGuestsService.findOrCreate).toHaveBeenCalled();
    });

    it('should throw NotFoundException for invalid tour', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for inactive tour', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue({
        ...mockTour,
        isActive: false,
      });

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if group size exceeded', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue({
        ...mockTour,
        maxGroupSize: 1,
      });

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for past travel date', async () => {
      mockPrismaService.tour.findUnique.mockResolvedValue(mockTour);

      await expect(
        service.create({
          ...createDto,
          travelDate: '2020-01-01', // Past date
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated bookings', async () => {
      mockPrismaService.booking.findMany.mockResolvedValue([mockBooking]);
      mockPrismaService.booking.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('should filter by status', async () => {
      mockPrismaService.booking.findMany.mockResolvedValue([mockBooking]);
      mockPrismaService.booking.count.mockResolvedValue(1);

      await service.findAll({ status: 'pending' });

      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'pending' }),
        }),
      );
    });

    it('should filter by paymentStatus', async () => {
      mockPrismaService.booking.findMany.mockResolvedValue([mockBooking]);
      mockPrismaService.booking.count.mockResolvedValue(1);

      await service.findAll({ paymentStatus: 'paid' });

      expect(mockPrismaService.booking.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ paymentStatus: 'paid' }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a booking by id', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);

      const result = await service.findOne('booking-1');

      expect(result.id).toBe('booking-1');
    });

    it('should throw NotFoundException for invalid id', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update booking status', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.booking.update.mockResolvedValue({
        ...mockBooking,
        status: 'confirmed',
      });

      const result = await service.updateStatus('booking-1', { status: 'confirmed' });

      expect(result.status).toBe('confirmed');
    });

    it('should throw NotFoundException for invalid booking', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('invalid-id', { status: 'confirmed' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment status', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.booking.update.mockResolvedValue({
        ...mockBooking,
        paymentStatus: 'paid',
      });

      const result = await service.updatePaymentStatus('booking-1', {
        paymentStatus: 'paid',
      });

      expect(result.paymentStatus).toBe('paid');
    });
  });

  describe('getStats', () => {
    it('should return booking statistics', async () => {
      mockPrismaService.booking.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(20) // pending
        .mockResolvedValueOnce(70) // confirmed
        .mockResolvedValueOnce(10); // cancelled
      mockPrismaService.booking.aggregate.mockResolvedValue({
        _sum: { totalPrice: new Decimal(50000) },
      });

      const result = await service.getStats();

      expect(result.total).toBe(100);
      expect(result.pending).toBe(20);
      expect(result.confirmed).toBe(70);
      expect(result.cancelled).toBe(10);
    });
  });

  describe('remove', () => {
    it('should delete a booking', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.booking.delete.mockResolvedValue(mockBooking);

      const result = await service.remove('booking-1');

      expect(result.message).toBe('Booking deleted successfully');
    });

    it('should throw NotFoundException for invalid id', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignGuide', () => {
    const mockGuide = { id: 'guide-1', name: 'Guide' };
    const mockAssignment = { bookingId: 'booking-1', guideId: 'guide-1', guide: mockGuide };

    it('should assign guide to booking', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.guide.findUnique.mockResolvedValue(mockGuide);
      mockPrismaService.bookingGuide.upsert.mockResolvedValue(mockAssignment);

      const result = await service.assignGuide('booking-1', 'guide-1');

      expect(result.guideId).toBe('guide-1');
    });

    it('should throw NotFoundException for invalid booking', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(null);

      await expect(service.assignGuide('invalid', 'guide-1')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException for invalid guide', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.guide.findUnique.mockResolvedValue(null);

      await expect(service.assignGuide('booking-1', 'invalid')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('assignDriver', () => {
    const mockDriver = { id: 'driver-1', name: 'Driver' };
    const mockVehicle = { id: 'vehicle-1', driverId: 'driver-1' };
    const mockAssignment = {
      bookingId: 'booking-1',
      driverId: 'driver-1',
      vehicleId: 'vehicle-1',
      driver: mockDriver,
      vehicle: mockVehicle,
    };

    it('should assign driver to booking', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.driver.findUnique.mockResolvedValue(mockDriver);
      mockPrismaService.bookingDriver.upsert.mockResolvedValue(mockAssignment);

      const result = await service.assignDriver('booking-1', 'driver-1');

      expect(result.driverId).toBe('driver-1');
    });

    it('should throw BadRequestException if vehicle not owned by driver', async () => {
      mockPrismaService.booking.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.driver.findUnique.mockResolvedValue(mockDriver);
      mockPrismaService.vehicle.findUnique.mockResolvedValue({
        ...mockVehicle,
        driverId: 'other-driver',
      });

      await expect(
        service.assignDriver('booking-1', 'driver-1', 'vehicle-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
