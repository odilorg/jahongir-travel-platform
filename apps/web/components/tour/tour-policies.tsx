'use client';

import {
  Shield, Clock, AlertTriangle, CheckCircle2, XCircle,
  MapPin, Phone, Mail, Navigation, Info, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================
// CANCELLATION POLICY
// ============================================

export interface CancellationTier {
  days: string; // e.g., "30+ days", "15-29 days"
  refund: string; // e.g., "100%", "50%", "No refund"
  description?: string;
}

export interface CancellationPolicyProps {
  tiers: CancellationTier[];
  title?: string;
  note?: string;
  className?: string;
}

export function CancellationPolicy({
  tiers,
  title = 'Cancellation Policy',
  note,
  className
}: CancellationPolicyProps) {
  const getRefundIcon = (refund: string) => {
    if (refund.includes('100')) return { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' };
    if (refund.includes('50')) return { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' };
    return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' };
  };

  return (
    <div className={cn("bg-white rounded-xl shadow-sm p-5 sm:p-6", className)}>
      <h2 className="relative pl-4 text-xl sm:text-2xl font-bold text-gray-900 mb-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-[hsl(var(--brand-turquoise))] before:to-[hsl(var(--brand-gold))]">
        {title}
      </h2>

      <div className="space-y-3">
        {tiers.map((tier, index) => {
          const { icon: Icon, color, bg } = getRefundIcon(tier.refund);

          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", bg)}>
                <Icon className={cn("w-5 h-5", color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{tier.days}</span>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-sm font-medium",
                    tier.refund.includes('100') && "bg-green-100 text-green-700",
                    tier.refund.includes('50') && "bg-amber-100 text-amber-700",
                    !tier.refund.includes('100') && !tier.refund.includes('50') && "bg-red-100 text-red-700"
                  )}>
                    {tier.refund}
                  </span>
                </div>
                {tier.description && (
                  <p className="text-sm text-gray-600">{tier.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {note && (
        <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{note}</span>
        </div>
      )}
    </div>
  );
}

// ============================================
// MEETING POINT
// ============================================

export interface MeetingPointProps {
  address: string;
  city: string;
  instructions?: string;
  time?: string;
  coordinates?: { lat: number; lng: number };
  contactPhone?: string;
  contactEmail?: string;
  title?: string;
  className?: string;
}

export function MeetingPoint({
  address,
  city,
  instructions,
  time,
  coordinates,
  contactPhone,
  contactEmail,
  title = 'Meeting Point',
  className
}: MeetingPointProps) {
  const googleMapsUrl = coordinates
    ? `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`
    : `https://www.google.com/maps/search/${encodeURIComponent(address + ', ' + city)}`;

  return (
    <div className={cn("bg-white rounded-xl shadow-sm p-5 sm:p-6", className)}>
      <h2 className="relative pl-4 text-xl sm:text-2xl font-bold text-gray-900 mb-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-[hsl(var(--brand-turquoise))] before:to-[hsl(var(--brand-gold))]">
        {title}
      </h2>

      <div className="space-y-4">
        {/* Address */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-turquoise-light flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-brand-turquoise" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{address}</p>
            <p className="text-sm text-gray-600">{city}</p>
          </div>
        </div>

        {/* Time */}
        {time && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Meeting Time</p>
              <p className="text-sm text-gray-600">{time}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        {instructions && (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-700 leading-relaxed">{instructions}</p>
          </div>
        )}

        {/* Map Link */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 bg-brand-turquoise-light text-brand-turquoise rounded-lg font-medium text-sm hover:bg-brand-turquoise hover:text-white transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Open in Google Maps
        </a>

        {/* Contact Info */}
        {(contactPhone || contactEmail) && (
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Need help finding us?</p>
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-turquoise transition-colors"
              >
                <Phone className="w-4 h-4" />
                {contactPhone}
              </a>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-turquoise transition-colors"
              >
                <Mail className="w-4 h-4" />
                {contactEmail}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// KNOW BEFORE YOU GO
// ============================================

export interface KnowBeforeItem {
  icon?: 'info' | 'warning' | 'check' | 'calendar';
  title: string;
  description: string;
}

export interface KnowBeforeYouGoProps {
  items: KnowBeforeItem[];
  title?: string;
  className?: string;
}

const iconMap = {
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-100' },
  warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100' },
  check: { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100' },
  calendar: { icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' }
};

export function KnowBeforeYouGo({
  items,
  title = 'Know Before You Go',
  className
}: KnowBeforeYouGoProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-sm p-5 sm:p-6", className)}>
      <h2 className="relative pl-4 text-xl sm:text-2xl font-bold text-gray-900 mb-6 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-[hsl(var(--brand-turquoise))] before:to-[hsl(var(--brand-gold))]">
        {title}
      </h2>

      <div className="space-y-4">
        {items.map((item, index) => {
          const iconConfig = iconMap[item.icon || 'info'];
          const Icon = iconConfig.icon;

          return (
            <div key={index} className="flex items-start gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                iconConfig.bg
              )}>
                <Icon className={cn("w-5 h-5", iconConfig.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// MOCK DATA GENERATORS
// ============================================

export function generateMockCancellationPolicy(): CancellationTier[] {
  return [
    {
      days: '30+ days before departure',
      refund: '100% refund',
      description: 'Full refund minus any non-refundable booking fees'
    },
    {
      days: '15-29 days before departure',
      refund: '50% refund',
      description: 'Half of the tour cost will be refunded'
    },
    {
      days: 'Less than 15 days',
      refund: 'No refund',
      description: 'We recommend purchasing travel insurance'
    }
  ];
}

export function generateMockMeetingPoint(): MeetingPointProps {
  return {
    address: 'Amir Timur Square',
    city: 'Tashkent, Uzbekistan',
    instructions: 'Our guide will meet you at the main entrance of the Amir Timur Museum (white building with blue dome). Look for a person holding a "Jahongir Travel" sign. We recommend arriving 15 minutes early.',
    time: '8:00 AM',
    coordinates: { lat: 41.311081, lng: 69.279737 },
    contactPhone: '+998 90 123 45 67',
    contactEmail: 'tours@jahongirtravel.uz'
  };
}

export function generateMockKnowBeforeYouGo(): KnowBeforeItem[] {
  return [
    {
      icon: 'check',
      title: 'Confirmation',
      description: 'You will receive a confirmation email within 24 hours of booking. Please check your spam folder if you don\'t see it.'
    },
    {
      icon: 'info',
      title: 'What to Bring',
      description: 'Comfortable walking shoes, sunscreen, hat, water bottle, camera, and modest clothing for mosque visits (covered shoulders and knees).'
    },
    {
      icon: 'warning',
      title: 'Physical Requirements',
      description: 'This tour involves moderate walking (3-5km per day). Not recommended for guests with mobility issues. Please contact us for accessible alternatives.'
    },
    {
      icon: 'calendar',
      title: 'Best Season',
      description: 'Spring (April-May) and autumn (September-October) offer the most pleasant weather. Summer can be very hot with temperatures exceeding 40°C.'
    },
    {
      icon: 'info',
      title: 'Language',
      description: 'Tours are conducted in English and Russian. Private guides in other languages can be arranged upon request.'
    }
  ];
}
