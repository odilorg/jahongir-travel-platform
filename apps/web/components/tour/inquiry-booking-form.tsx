'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar, Users, Clock, Loader2, CheckCircle, XCircle,
  MessageSquare, Shield, Headphones, Send
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface InquiryBookingFormProps {
  tourId: string;
  tourTitle: string;
  duration: number;
  translations: {
    requestQuote: string;
    travelDates: string;
    startDate: string;
    endDate: string;
    numberOfTravelers: string;
    travelers: string;
    traveler: string;
    yourDetails: string;
    fullName: string;
    email: string;
    phone: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    support24: string;
    personalizedQuote: string;
    noCommitment: string;
    successTitle: string;
    successMessage: string;
    errorTitle: string;
    tryAgain: string;
  };
  onSubmit?: (data: InquiryFormData) => Promise<{ success: boolean; error?: string }>;
}

export interface InquiryFormData {
  tourId: string;
  name: string;
  email: string;
  phone: string;
  travelDateFrom: string;
  travelDateTo: string;
  numberOfPeople: number;
  message: string;
}

// ============================================
// VALIDATION SCHEMA
// ============================================

const inquirySchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .min(7, 'Phone number is required')
    .regex(/^[\d\s\-+()]*$/, 'Phone number can only contain digits, spaces, and +-()'),
  travelDateFrom: z.string().min(1, 'Start date is required'),
  travelDateTo: z.string().min(1, 'End date is required'),
  numberOfPeople: z
    .number()
    .min(1, 'At least 1 traveler is required')
    .max(100, 'Maximum is 100 travelers'),
  message: z
    .string()
    .max(2000, 'Message cannot exceed 2000 characters')
    .optional(),
});

type FormData = z.infer<typeof inquirySchema>;

// ============================================
// MAIN COMPONENT
// ============================================

export function InquiryBookingForm({
  tourId,
  tourTitle,
  duration,
  translations: t,
  onSubmit
}: InquiryBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Get tomorrow's date as minimum start date
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
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      travelDateFrom: '',
      travelDateTo: '',
      numberOfPeople: 2,
      message: '',
    },
  });

  const numberOfPeople = watch('numberOfPeople');
  const travelDateFrom = watch('travelDateFrom');

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      if (onSubmit) {
        const result = await onSubmit({
          tourId,
          name: data.name,
          email: data.email,
          phone: data.phone,
          travelDateFrom: data.travelDateFrom,
          travelDateTo: data.travelDateTo,
          numberOfPeople: data.numberOfPeople,
          message: data.message || '',
        });

        if (result.success) {
          setSubmitStatus('success');
          reset();
        } else {
          setSubmitStatus('error');
          setErrorMessage(result.error || 'Something went wrong');
        }
      } else {
        // Mock success for testing
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubmitStatus('success');
        reset();
      }
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate minimum end date based on start date and tour duration
  const getMinEndDate = () => {
    if (!travelDateFrom) return minDate;
    const startDate = new Date(travelDateFrom);
    startDate.setDate(startDate.getDate() + duration - 1);
    return startDate.toISOString().split('T')[0];
  };

  if (submitStatus === 'success') {
    return (
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-brand-turquoise to-brand-gold" />
        <CardContent className="p-6 sm:p-8">
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t.successTitle}</h3>
            <p className="text-muted-foreground">{t.successMessage}</p>
            <Button
              onClick={() => setSubmitStatus('idle')}
              variant="outline"
              className="mt-4"
            >
              Send Another Inquiry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (submitStatus === 'error') {
    return (
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-brand-turquoise to-brand-gold" />
        <CardContent className="p-6 sm:p-8">
          <div className="py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t.errorTitle}</h3>
            <p className="text-red-600 mb-4">{errorMessage}</p>
            <Button onClick={() => setSubmitStatus('idle')}>{t.tryAgain}</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      {/* Brand accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-turquoise to-brand-gold" />

      <CardContent className="p-5 sm:p-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          {/* Header */}
          <div className="text-center pb-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">{t.requestQuote}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {tourTitle}
            </p>
          </div>

          {/* Travel Dates Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-turquoise" />
              {t.travelDates}
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="travelDateFrom" className="text-xs text-gray-500">
                  {t.startDate}
                </Label>
                <Input
                  id="travelDateFrom"
                  type="date"
                  {...register('travelDateFrom')}
                  min={minDate}
                  className="mt-1"
                />
                {errors.travelDateFrom && (
                  <p className="text-xs text-red-600 mt-1">{errors.travelDateFrom.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="travelDateTo" className="text-xs text-gray-500">
                  {t.endDate}
                </Label>
                <Input
                  id="travelDateTo"
                  type="date"
                  {...register('travelDateTo')}
                  min={getMinEndDate()}
                  className="mt-1"
                />
                {errors.travelDateTo && (
                  <p className="text-xs text-red-600 mt-1">{errors.travelDateTo.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Number of Travelers */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-turquoise" />
              {t.numberOfTravelers}
            </label>
            <Input
              type="number"
              {...register('numberOfPeople', { valueAsNumber: true })}
              min="1"
              max="100"
              className="w-full"
            />
            {errors.numberOfPeople && (
              <p className="text-xs text-red-600 mt-1">{errors.numberOfPeople.message}</p>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-700">{t.yourDetails}</h4>

            <div>
              <Label htmlFor="name" className="text-xs text-gray-500">
                {t.fullName} *
              </Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="John Doe"
                className="mt-1"
              />
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-xs text-gray-500">
                {t.email} *
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@example.com"
                className="mt-1"
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-xs text-gray-500">
                {t.phone} *
              </Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+998 90 123 45 67"
                className="mt-1"
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Message (Optional) */}
          <div>
            <Label htmlFor="message" className="text-xs text-gray-500">
              {t.message}
            </Label>
            <Textarea
              id="message"
              {...register('message')}
              placeholder={t.messagePlaceholder}
              rows={3}
              className="mt-1"
            />
            {errors.message && (
              <p className="text-xs text-red-600 mt-1">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full font-semibold text-base h-12 bg-brand-turquoise hover:bg-brand-turquoise/90 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t.submit}
              </>
            )}
          </Button>

          {/* Trust Badges - No payment methods! */}
          <div className="pt-4 border-t border-gray-100 space-y-2.5">
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Headphones className="w-4 h-4 text-brand-turquoise flex-shrink-0" />
              <span>{t.support24}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <MessageSquare className="w-4 h-4 text-brand-turquoise flex-shrink-0" />
              <span>{t.personalizedQuote}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-brand-turquoise flex-shrink-0" />
              <span>{t.noCommitment}</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
