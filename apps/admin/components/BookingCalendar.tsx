'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Booking {
  id: string;
  tour: {
    id: string;
    title: string;
    slug: string;
  };
  customerName: string;
  customerEmail: string;
  travelDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
}

interface BookingCalendarProps {
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function BookingCalendar({ bookings, onBookingClick }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get calendar days for current month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];

    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [year, month]);

  // Group bookings by date
  const bookingsByDate = useMemo(() => {
    const grouped: Record<string, Booking[]> = {};

    bookings.forEach((booking) => {
      const date = new Date(booking.travelDate);
      if (date.getFullYear() === year && date.getMonth() === month) {
        const day = date.getDate();
        const key = `${year}-${month}-${day}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(booking);
      }
    });

    return grouped;
  }, [bookings, year, month]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800 line-through opacity-60';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const handleBookingClick = (booking: Booking, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBooking(booking);
    if (onBookingClick) {
      onBookingClick(booking);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <Card>
      <CardContent className="p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-bold">
              {MONTHS[month]} {year}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-200 border border-yellow-400" />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-200 border border-green-400" />
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-red-200 border border-red-400" />
            <span>Cancelled</span>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const key = `${year}-${month}-${day}`;
            const dayBookings = day ? bookingsByDate[key] || [] : [];

            return (
              <div
                key={index}
                className={cn(
                  'min-h-[100px] border rounded-lg p-1 transition-colors',
                  day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50',
                  isToday(day as number) && 'ring-2 ring-blue-500'
                )}
              >
                {day && (
                  <>
                    <div
                      className={cn(
                        'text-sm font-medium mb-1',
                        isToday(day) ? 'text-blue-600' : 'text-gray-700'
                      )}
                    >
                      {day}
                    </div>
                    <div className="space-y-1 max-h-[80px] overflow-y-auto">
                      {dayBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className={cn(
                            'text-xs p-1 rounded border cursor-pointer truncate',
                            getStatusColor(booking.status)
                          )}
                          onClick={(e) => handleBookingClick(booking, e)}
                          title={`${booking.tour.title} - ${booking.customerName} (${booking.numberOfPeople} pax)`}
                        >
                          <div className="font-medium truncate">
                            {booking.tour.title.length > 15
                              ? booking.tour.title.substring(0, 15) + '...'
                              : booking.tour.title}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] opacity-75">
                            <Users className="h-2.5 w-2.5" />
                            {booking.numberOfPeople}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Booking Detail Popup */}
        {selectedBooking && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setSelectedBooking(null)}
          >
            <Card className="w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{selectedBooking.tour.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedBooking.travelDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedBooking.customerName}</p>
                    <p className="text-sm">{selectedBooking.customerEmail}</p>
                  </div>

                  <div className="flex gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Group Size</p>
                      <p className="font-medium">{selectedBooking.numberOfPeople} people</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-medium text-green-600">
                        {formatPrice(selectedBooking.totalPrice)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge
                      className={cn(
                        selectedBooking.status === 'pending' && 'bg-yellow-100 text-yellow-800',
                        selectedBooking.status === 'confirmed' && 'bg-green-100 text-green-800',
                        selectedBooking.status === 'cancelled' && 'bg-red-100 text-red-800'
                      )}
                    >
                      {selectedBooking.status}
                    </Badge>
                    <Badge variant="outline">
                      {selectedBooking.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
