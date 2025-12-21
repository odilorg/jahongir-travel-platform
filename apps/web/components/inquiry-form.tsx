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
import { MessageSquare, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { submitInquiry, type InquiryFormData } from '@/lib/api';

// Schema matching backend CreateInquiryDto
const inquirySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]*$/.test(val),
      'Phone number can only contain digits, spaces, and +-()'
    ),
  travelDate: z.string().optional(),
  numberOfPeople: z
    .number()
    .min(1, 'At least 1 person is required')
    .max(100, 'Maximum is 100 people')
    .optional(),
  budget: z
    .number()
    .min(0, 'Budget cannot be negative')
    .max(1000000, 'Please enter a realistic budget')
    .optional(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message cannot exceed 2000 characters'),
});

type FormData = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tourId?: string;
  tourTitle?: string;
}

export function InquiryForm({
  open,
  onOpenChange,
  tourId,
  tourTitle,
}: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      travelDate: '',
      numberOfPeople: undefined,
      budget: undefined,
      message: tourTitle
        ? `I'm interested in the "${tourTitle}" tour. Please provide more information.`
        : '',
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    const inquiryData: InquiryFormData = {
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      tourId: tourId || undefined,
      travelDate: data.travelDate || undefined,
      numberOfPeople: data.numberOfPeople || undefined,
      budget: data.budget || undefined,
      message: data.message,
    };

    const result = await submitInquiry(inquiryData);

    setIsSubmitting(false);

    if (result.success) {
      setSubmitStatus('success');
      reset();

      // Close modal after 3 seconds
      setTimeout(() => {
        onOpenChange(false);
        setSubmitStatus('idle');
      }, 3000);
    } else {
      setSubmitStatus('error');
      setErrorMessage(result.error || 'Something went wrong');
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setSubmitStatus('idle');
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Ask Us Anything</DialogTitle>
          <DialogDescription>
            Have questions about {tourTitle || 'our tours'}? We're here to help.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === 'success' ? (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Inquiry Sent!</h3>
            <p className="text-muted-foreground">
              Thank you for reaching out. We'll respond within 24 hours.
            </p>
          </div>
        ) : submitStatus === 'error' ? (
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Submission Failed</h3>
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <Button onClick={() => setSubmitStatus('idle')}>Try Again</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Tour Info (if applicable) */}
            {tourTitle && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600 font-medium">Inquiry about:</p>
                <p className="font-semibold">{tourTitle}</p>
              </div>
            )}

            {/* Name and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="John Doe"
                  className="mt-1"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="john@example.com"
                  className="mt-1"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+998 90 123 45 67"
                className="mt-1"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Travel Details (optional) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="travelDate">Preferred Date</Label>
                <Input
                  id="travelDate"
                  type="date"
                  {...register('travelDate')}
                  className="mt-1"
                />
                {errors.travelDate && (
                  <p className="text-sm text-red-600 mt-1">{errors.travelDate.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="numberOfPeople">Group Size</Label>
                <Input
                  id="numberOfPeople"
                  type="number"
                  {...register('numberOfPeople', { valueAsNumber: true })}
                  placeholder="2"
                  min="1"
                  max="100"
                  className="mt-1"
                />
                {errors.numberOfPeople && (
                  <p className="text-sm text-red-600 mt-1">{errors.numberOfPeople.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="budget">Budget (USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  {...register('budget', { valueAsNumber: true })}
                  placeholder="1000"
                  min="0"
                  className="mt-1"
                />
                {errors.budget && (
                  <p className="text-sm text-red-600 mt-1">{errors.budget.message}</p>
                )}
              </div>
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">Your Question *</Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder="Tell us about your travel plans, specific interests, or any questions you have..."
                rows={5}
                className="mt-1"
              />
              {errors.message && (
                <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
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
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Inquiry
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
