'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { submitBooking, type BookingFormData } from '@/lib/api';

// Schema matching backend CreateBookingDto
const bookingSchema = z.object({
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerPhone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]*$/.test(val),
      'Phone number can only contain digits, spaces, and +-()'
    ),
  travelDate: z.string().min(1, 'Travel date is required'),
  numberOfPeople: z
    .number()
    .min(1, 'At least 1 person is required')
    .max(50, 'Maximum group size is 50 people'),
  specialRequests: z
    .string()
    .max(1000, 'Special requests cannot exceed 1000 characters')
    .optional(),
});

type FormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tourId: string;
  tourTitle: string;
  tourPrice: number;
}

export function BookingForm({
  open,
  onOpenChange,
  tourId,
  tourTitle,
  tourPrice,
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      travelDate: '',
      numberOfPeople: 1,
      specialRequests: '',
    },
  });

  const numberOfPeople = watch('numberOfPeople');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const bookingData: BookingFormData = {
      tourId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || undefined,
      travelDate: data.travelDate,
      numberOfPeople: data.numberOfPeople,
      specialRequests: data.specialRequests || undefined,
    };

    const result = await submitBooking(bookingData);

    setIsSubmitting(false);

    if (result.success) {
      setSubmitStatus('success');
      setTotalPrice(result.data?.totalPrice || null);
      reset();

      // Close modal after 3 seconds
      setTimeout(() => {
        onOpenChange(false);
        setSubmitStatus('idle');
        setTotalPrice(null);
      }, 3000);
    } else {
      setSubmitStatus('error');
      setErrorMessage(result.error || 'Something went wrong');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset status after closing
    setTimeout(() => {
      setSubmitStatus('idle');
      setTotalPrice(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book Your Tour</DialogTitle>
          <DialogDescription>
            Complete the form below to reserve your spot. We'll send you a confirmation email.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === 'success' ? (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground mb-2">
              Thank you for your booking. We've sent a confirmation email.
            </p>
            {totalPrice && (
              <p className="text-lg font-semibold text-primary">
                Total: ${totalPrice.toLocaleString()}
              </p>
            )}
          </div>
        ) : submitStatus === 'error' ? (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Booking Failed</h3>
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <Button onClick={() => setSubmitStatus('idle')}>Try Again</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Tour Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-lg">{tourTitle}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-muted-foreground">
                  ${tourPrice} per person
                </p>
                {numberOfPeople > 0 && (
                  <p className="text-sm font-medium text-primary">
                    Estimated: ${(tourPrice * numberOfPeople).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                {...register('customerName')}
                placeholder="John Doe"
                className="mt-1"
              />
              {errors.customerName && (
                <p className="text-sm text-red-600 mt-1">{errors.customerName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="customerEmail">Email Address *</Label>
              <Input
                id="customerEmail"
                type="email"
                {...register('customerEmail')}
                placeholder="john@example.com"
                className="mt-1"
              />
              {errors.customerEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.customerEmail.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                {...register('customerPhone')}
                placeholder="+998 90 123 45 67"
                className="mt-1"
              />
              {errors.customerPhone && (
                <p className="text-sm text-red-600 mt-1">{errors.customerPhone.message}</p>
              )}
            </div>

            {/* Travel Date and Number of People */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="travelDate">Travel Date *</Label>
                <Input
                  id="travelDate"
                  type="date"
                  {...register('travelDate')}
                  className="mt-1"
                  min={minDate}
                />
                {errors.travelDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.travelDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="numberOfPeople">Number of People *</Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  {...register('numberOfPeople', { valueAsNumber: true })}
                  placeholder="2"
                  min="1"
                  max="50"
                  className="mt-1"
                />
                {errors.numberOfPeople && (
                  <p className="text-sm text-red-600 mt-1">{errors.numberOfPeople.message}</p>
                )}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
              <Textarea
                id="specialRequests"
                {...register('specialRequests')}
                placeholder="Dietary requirements, accessibility needs, special occasions..."
                rows={3}
                className="mt-1"
              />
              {errors.specialRequests && (
                <p className="text-sm text-red-600 mt-1">{errors.specialRequests.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-brand-orange hover:bg-brand-orange/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
