'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Check } from 'lucide-react';
import { BookingForm } from './booking-form';

interface BookingSidebarProps {
  tour: {
    id: string;
    title: string;
    slug: string;
    price: number | string;
    duration: number;
    maxGroupSize?: number;
    difficulty?: string;
  };
}

export function BookingSidebar({ tour }: BookingSidebarProps) {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const price = typeof tour.price === 'string' ? parseFloat(tour.price) : tour.price;

  return (
    <>
      <div className="sticky top-24">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">From</p>
              <p className="text-4xl font-bold text-primary">${price}</p>
              <p className="text-sm text-muted-foreground">per person</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium">{tour.duration} days</span>
              </div>
              {tour.maxGroupSize && (
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Group Size</span>
                  <span className="font-medium">Max {tour.maxGroupSize} people</span>
                </div>
              )}
              {tour.difficulty && (
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Difficulty</span>
                  <span className="font-medium capitalize">{tour.difficulty}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-sm text-muted-foreground">Language</span>
                <span className="font-medium">English, Russian</span>
              </div>
            </div>

            <Button
              className="w-full bg-brand-orange hover:bg-brand-orange/90"
              size="lg"
              onClick={() => setBookingModalOpen(true)}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Book Now
            </Button>

            <Button
              variant="outline"
              className="w-full"
              size="lg"
              onClick={() => setBookingModalOpen(true)}
            >
              <Users className="h-5 w-5 mr-2" />
              Contact Us
            </Button>

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">Need help? Call us at</p>
              <a
                href="tel:+998901234567"
                className="text-primary font-semibold hover:underline"
              >
                +998 90 123 45 67
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Best Price Guarantee</p>
                  <p className="text-sm text-muted-foreground">Lowest prices guaranteed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Free Cancellation</p>
                  <p className="text-sm text-muted-foreground">Up to 24 hours before</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      <BookingForm
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        tourId={tour.id}
        tourTitle={tour.title}
        tourPrice={price}
      />
    </>
  );
}
