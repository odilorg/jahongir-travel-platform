'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar, Users, ChevronDown, Check, AlertCircle,
  MessageCircle, CreditCard, Shield, Clock, Minus, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================
// TYPE DEFINITIONS (Mock - will come from API)
// ============================================

export interface TourDeparture {
  id: string;
  startDate: string;
  endDate: string;
  spotsRemaining: number;
  maxSpots: number;
  status: 'available' | 'filling_fast' | 'almost_full' | 'sold_out';
  priceModifier?: number; // e.g., 1.1 for peak season 10% increase
}

export interface PricingTier {
  id: string;
  label: string;
  minGuests: number;
  maxGuests: number;
  pricePerPerson: number;
  description?: string;
}

export interface BookingFormProps {
  tourId: string;
  tourTitle: string;
  basePrice: number;
  currency?: string;
  duration: number;
  departures: TourDeparture[];
  pricingTiers: PricingTier[];
  maxGuests?: number;
  minGuests?: number;
  translations: {
    selectDate: string;
    selectGuests: string;
    guests: string;
    guest: string;
    from: string;
    perPerson: string;
    total: string;
    bookNow: string;
    inquire: string;
    spotsLeft: string;
    soldOut: string;
    fillingFast: string;
    almostFull: string;
    available: string;
    securePayment: string;
    freeCancellation: string;
    instantConfirmation: string;
    bestPrice: string;
    recommended: string;
    noDateSelected: string;
    selectDateFirst: string;
  };
  onBook?: (data: BookingData) => void;
  onInquire?: () => void;
}

export interface BookingData {
  tourId: string;
  departureId: string;
  guests: number;
  totalPrice: number;
  pricePerPerson: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDate(dateString: string, locale: string = 'en'): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatDateRange(start: string, end: string, locale: string = 'en'): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startMonth = startDate.toLocaleDateString(locale, { month: 'short' });
  const endMonth = endDate.toLocaleDateString(locale, { month: 'short' });

  if (startMonth === endMonth) {
    return `${startDate.getDate()} - ${endDate.getDate()} ${startMonth}, ${endDate.getFullYear()}`;
  }

  return `${formatDate(start, locale)} - ${formatDate(end, locale)}`;
}

function getStatusBadge(status: TourDeparture['status'], spotsLeft: number, t: BookingFormProps['translations']) {
  switch (status) {
    case 'sold_out':
      return { label: t.soldOut, color: 'bg-red-100 text-red-700', icon: AlertCircle };
    case 'almost_full':
      return { label: `${spotsLeft} ${t.spotsLeft}`, color: 'bg-orange-100 text-orange-700', icon: AlertCircle };
    case 'filling_fast':
      return { label: t.fillingFast, color: 'bg-amber-100 text-amber-700', icon: Clock };
    default:
      return { label: t.available, color: 'bg-green-100 text-green-700', icon: Check };
  }
}

// ============================================
// MAIN COMPONENT
// ============================================

export function BookingForm({
  tourId,
  tourTitle,
  basePrice,
  currency = 'USD',
  duration,
  departures,
  pricingTiers,
  maxGuests = 10,
  minGuests = 1,
  translations: t,
  onBook,
  onInquire
}: BookingFormProps) {
  const [selectedDeparture, setSelectedDeparture] = useState<TourDeparture | null>(null);
  const [guests, setGuests] = useState(2);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate pricing based on guest count
  const currentTier = useMemo(() => {
    return pricingTiers.find(
      tier => guests >= tier.minGuests && guests <= tier.maxGuests
    ) || pricingTiers[pricingTiers.length - 1];
  }, [guests, pricingTiers]);

  const pricePerPerson = useMemo(() => {
    let price = currentTier?.pricePerPerson || basePrice;
    if (selectedDeparture?.priceModifier) {
      price = Math.round(price * selectedDeparture.priceModifier);
    }
    return price;
  }, [currentTier, basePrice, selectedDeparture]);

  const totalPrice = pricePerPerson * guests;

  // Find best value tier for highlighting
  const bestValueTier = useMemo(() => {
    return pricingTiers.reduce((best, tier) =>
      tier.pricePerPerson < best.pricePerPerson ? tier : best
    , pricingTiers[0]);
  }, [pricingTiers]);

  const handleGuestChange = (delta: number) => {
    const newValue = guests + delta;
    if (newValue >= minGuests && newValue <= maxGuests) {
      setGuests(newValue);
    }
  };

  const handleBook = async () => {
    if (!selectedDeparture || selectedDeparture.status === 'sold_out') return;

    setIsSubmitting(true);
    try {
      onBook?.({
        tourId,
        departureId: selectedDeparture.id,
        guests,
        totalPrice,
        pricePerPerson
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableDepartures = departures.filter(d => d.status !== 'sold_out');
  const hasAvailableDepartures = availableDepartures.length > 0;

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      {/* Brand accent bar */}
      <div className="h-1 bg-gradient-to-r from-brand-turquoise to-brand-gold" />

      <CardContent className="p-5 sm:p-6 space-y-5">
        {/* Price Display */}
        <div className="text-center pb-4 border-b border-gray-100">
          <p className="text-sm text-muted-foreground mb-1">{t.from}</p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-bold text-brand-turquoise">
              ${pricePerPerson.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{t.perPerson}</p>

          {/* Show tier if applicable */}
          {currentTier && pricingTiers.length > 1 && (
            <div className={cn(
              "mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
              currentTier.id === bestValueTier.id
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            )}>
              {currentTier.id === bestValueTier.id && <Check className="w-3 h-3" />}
              {currentTier.label}
              {currentTier.id === bestValueTier.id && ` - ${t.bestPrice}`}
            </div>
          )}
        </div>

        {/* Departure Date Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-turquoise" />
            {t.selectDate}
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left",
                showDatePicker
                  ? "border-brand-turquoise ring-2 ring-brand-turquoise/20"
                  : "border-gray-200 hover:border-gray-300",
                !selectedDeparture && "text-gray-500"
              )}
            >
              <span className={cn(
                selectedDeparture ? "text-gray-900 font-medium" : "text-gray-500"
              )}>
                {selectedDeparture
                  ? formatDateRange(selectedDeparture.startDate, selectedDeparture.endDate)
                  : t.noDateSelected
                }
              </span>
              <ChevronDown className={cn(
                "w-5 h-5 text-gray-400 transition-transform",
                showDatePicker && "rotate-180"
              )} />
            </button>

            {/* Date Dropdown */}
            {showDatePicker && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-[300px] overflow-y-auto">
                {departures.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No departures available
                  </div>
                ) : (
                  <div className="p-2 space-y-1">
                    {departures.map((departure) => {
                      const badge = getStatusBadge(departure.status, departure.spotsRemaining, t);
                      const BadgeIcon = badge.icon;
                      const isSelected = selectedDeparture?.id === departure.id;
                      const isDisabled = departure.status === 'sold_out';

                      return (
                        <button
                          key={departure.id}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => {
                            setSelectedDeparture(departure);
                            setShowDatePicker(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all text-left",
                            isSelected && !isDisabled && "bg-brand-turquoise-light border-2 border-brand-turquoise",
                            !isSelected && !isDisabled && "hover:bg-gray-50",
                            isDisabled && "opacity-50 cursor-not-allowed bg-gray-50"
                          )}
                        >
                          <div className="flex-1">
                            <p className={cn(
                              "font-medium",
                              isDisabled ? "text-gray-400" : "text-gray-900"
                            )}>
                              {formatDateRange(departure.startDate, departure.endDate)}
                            </p>
                            {departure.priceModifier && departure.priceModifier > 1 && (
                              <p className="text-xs text-amber-600 mt-0.5">
                                Peak season +{Math.round((departure.priceModifier - 1) * 100)}%
                              </p>
                            )}
                          </div>
                          <span className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                            badge.color
                          )}>
                            <BadgeIcon className="w-3 h-3" />
                            {badge.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Guest Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-turquoise" />
            {t.selectGuests}
          </label>

          <div className="flex items-center justify-between px-4 py-3 rounded-lg border-2 border-gray-200">
            <span className="text-gray-900 font-medium">
              {guests} {guests === 1 ? t.guest : t.guests}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleGuestChange(-1)}
                disabled={guests <= minGuests}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  guests <= minGuests
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95"
                )}
                aria-label="Decrease guests"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold text-lg">{guests}</span>
              <button
                type="button"
                onClick={() => handleGuestChange(1)}
                disabled={guests >= maxGuests}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                  guests >= maxGuests
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-brand-turquoise text-white hover:bg-brand-turquoise/90 active:scale-95"
                )}
                aria-label="Increase guests"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Pricing Tiers Info */}
          {pricingTiers.length > 1 && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-medium text-gray-600 mb-2">Group Pricing:</p>
              <div className="space-y-1.5">
                {pricingTiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={cn(
                      "flex items-center justify-between text-xs px-2 py-1.5 rounded-md transition-colors",
                      currentTier?.id === tier.id
                        ? "bg-brand-turquoise-light text-brand-turquoise font-medium"
                        : "text-gray-600"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      {currentTier?.id === tier.id && <Check className="w-3 h-3" />}
                      {tier.label}
                      {tier.minGuests === tier.maxGuests
                        ? ` (${tier.minGuests} guest)`
                        : ` (${tier.minGuests}-${tier.maxGuests} guests)`
                      }
                    </span>
                    <span className="font-medium">${tier.pricePerPerson}/pp</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Total Price */}
        <div className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">{t.total}</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">
              ${totalPrice.toLocaleString()}
            </span>
            <p className="text-xs text-gray-500">
              {guests} × ${pricePerPerson.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            size="lg"
            onClick={handleBook}
            disabled={!selectedDeparture || selectedDeparture.status === 'sold_out' || isSubmitting}
            className={cn(
              "w-full font-semibold text-base h-12",
              selectedDeparture && selectedDeparture.status !== 'sold_out'
                ? "bg-brand-turquoise hover:bg-brand-turquoise/90 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            )}
          >
            {!selectedDeparture ? t.selectDateFirst : t.bookNow}
          </Button>

          <button
            type="button"
            onClick={onInquire}
            className="w-full flex items-center justify-center gap-2 py-3 text-brand-turquoise hover:text-brand-turquoise/80 font-medium text-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {t.inquire}
          </button>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 border-t border-gray-100 space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>{t.securePayment}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>{t.freeCancellation}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>{t.instantConfirmation}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="flex items-center justify-center gap-3 pt-3">
          <CreditCard className="w-6 h-6 text-gray-400" />
          <img src="/images/payments/visa.svg" alt="Visa" className="h-5 opacity-60" />
          <img src="/images/payments/mastercard.svg" alt="Mastercard" className="h-5 opacity-60" />
          <img src="/images/payments/paypal.svg" alt="PayPal" className="h-5 opacity-60" />
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// MOCK DATA GENERATOR (for development)
// ============================================

export function generateMockDepartures(count: number = 6): TourDeparture[] {
  const today = new Date();
  const departures: TourDeparture[] = [];

  for (let i = 0; i < count; i++) {
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 30 + (i * 30)); // Every month

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 12); // 12-day tour

    const spotsRemaining = Math.floor(Math.random() * 8);
    let status: TourDeparture['status'] = 'available';

    if (spotsRemaining === 0) status = 'sold_out';
    else if (spotsRemaining <= 2) status = 'almost_full';
    else if (spotsRemaining <= 4) status = 'filling_fast';

    // Peak season modifier for summer months
    const month = startDate.getMonth();
    const isPeakSeason = month >= 5 && month <= 8; // June-September

    departures.push({
      id: `dep-${i + 1}`,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      spotsRemaining,
      maxSpots: 8,
      status,
      priceModifier: isPeakSeason ? 1.15 : undefined
    });
  }

  return departures;
}

export function generateMockPricingTiers(basePrice: number): PricingTier[] {
  return [
    {
      id: 'solo',
      label: 'Solo Traveler',
      minGuests: 1,
      maxGuests: 1,
      pricePerPerson: Math.round(basePrice * 2), // 2x for solo
      description: 'Private tour experience'
    },
    {
      id: 'couple',
      label: 'Couple',
      minGuests: 2,
      maxGuests: 2,
      pricePerPerson: Math.round(basePrice * 1.6), // 1.6x
      description: 'Intimate experience for two'
    },
    {
      id: 'small-group',
      label: 'Small Group',
      minGuests: 3,
      maxGuests: 4,
      pricePerPerson: Math.round(basePrice * 1.3), // 1.3x
      description: 'Small group discount'
    },
    {
      id: 'standard',
      label: 'Standard Group',
      minGuests: 5,
      maxGuests: 8,
      pricePerPerson: basePrice, // Base price
      description: 'Best value per person'
    }
  ];
}
