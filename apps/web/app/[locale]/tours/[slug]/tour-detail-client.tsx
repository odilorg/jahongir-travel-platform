'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import {
  MapPin, Clock, Users, Check, X, ChevronLeft, Star,
  ShieldCheck, Headphones, BadgeCheck,
  CreditCard, MessageCircle, ChevronRight, Camera
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { Tour } from "@/lib/api";
import { submitInquiry } from "@/lib/api";
import { AccordionItinerary } from "@/components/tour/accordion-itinerary";
import { BookingForm, generateMockDepartures, generateMockPricingTiers } from "@/components/tour/booking-form";
import { InquiryBookingForm, type InquiryFormData } from "@/components/tour/inquiry-booking-form";
import { TourFAQ, generateMockFAQs } from "@/components/tour/tour-faq";
import {
  CancellationPolicy,
  MeetingPoint,
  KnowBeforeYouGo,
  generateMockCancellationPolicy,
  generateMockMeetingPoint,
  generateMockKnowBeforeYouGo
} from "@/components/tour/tour-policies";
import { cn } from "@/lib/utils";

// WhatsApp Icon Component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// Section Title component with brand accent bar
function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn(
      "relative pl-4 text-xl sm:text-2xl font-bold text-gray-900",
      "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-full",
      "before:bg-gradient-to-b before:from-[hsl(var(--brand-turquoise))] before:to-[hsl(var(--brand-gold))]",
      className
    )}>
      {children}
    </h2>
  );
}

interface TourDetailClientProps {
  tour: Tour;
}

// Section configuration for sticky nav
const SECTIONS = [
  { id: 'about', key: 'aboutTour' },
  { id: 'highlights', key: 'highlights' },
  { id: 'itinerary', key: 'itinerary' },
  { id: 'included', key: 'included' },
  { id: 'cancellation', key: 'cancellation' },
  { id: 'meeting', key: 'meetingPoint' },
  { id: 'faq', key: 'faq' },
] as const;

export function TourDetailClient({ tour }: TourDetailClientProps) {
  const t = useTranslations('tours');
  const tCommon = useTranslations('common');

  const [activeSection, setActiveSection] = useState<string>('about');
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [sidebarShouldStop, setSidebarShouldStop] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Mock data for new sections (will come from API later)
  const mockDepartures = generateMockDepartures(6);
  const mockPricingTiers = generateMockPricingTiers(Number(tour.price) || 500);
  const mockFAQs = generateMockFAQs();
  const mockCancellationPolicy = generateMockCancellationPolicy();
  const mockMeetingPoint = generateMockMeetingPoint();
  const mockKnowBeforeYouGo = generateMockKnowBeforeYouGo();

  // WhatsApp number (will come from config/API)
  const whatsappNumber = '+998901234567';
  const whatsappMessage = encodeURIComponent(`Hi! I'm interested in booking the tour: ${tour.title}`);
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;

  // Intersection observer for sticky nav
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyNav(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Section observer for active state
  useEffect(() => {
    const observerOptions = {
      rootMargin: '-100px 0px -50% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Observer to stop sidebar sticky before footer
  useEffect(() => {
    const footer = footerRef.current;
    const sidebar = sidebarRef.current;
    if (!footer || !sidebar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSidebarShouldStop(entry.isIntersecting);
      },
      { threshold: 0, rootMargin: '0px 0px -200px 0px' }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120; // Account for sticky header + nav
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  // Filter sections that exist
  const availableSections = SECTIONS.filter(({ id }) => {
    switch (id) {
      case 'about': return !!tour.description;
      case 'highlights': return tour.highlights && tour.highlights.length > 0;
      case 'itinerary': return tour.itineraryItems && tour.itineraryItems.length > 0;
      case 'included': return tour.included && tour.included.length > 0;
      case 'cancellation': return true; // Always show (mock data)
      case 'meeting': return true; // Always show (mock data)
      case 'faq': return true; // Always show (mock data)
      default: return false;
    }
  });

  const handleBooking = (data: { tourId: string; departureId: string; guests: number; totalPrice: number }) => {
    // TODO: Implement booking flow - redirect to checkout or show booking modal
    console.log('Booking data:', data);
    alert(`Booking: ${data.guests} guests for $${data.totalPrice}`);
  };

  const handleInquire = () => {
    // TODO: Open inquiry form or redirect to contact
    window.location.href = '/contact';
  };

  // Handler for inquiry form submission (inquiry mode)
  const handleInquirySubmit = async (data: InquiryFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await submitInquiry({
        tourId: data.tourId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        travelDateFrom: data.travelDateFrom,
        travelDateTo: data.travelDateTo,
        numberOfPeople: data.numberOfPeople,
        message: data.message || '',
      });

      if (result.success) {
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Something went wrong' };
      }
    } catch (error) {
      console.error('Inquiry submission error:', error);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Sticky Section Navigation */}
      <div
        className={cn(
          "fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b transition-all duration-300",
          showStickyNav ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-1 py-3"
            ref={navRef}
            role="tablist"
            aria-label={t('sectionNavigation') || 'Section navigation'}
          >
            {availableSections.map(({ id, key }, index) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % availableSections.length;
                    scrollToSection(availableSections[nextIndex].id);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevIndex = index === 0 ? availableSections.length - 1 : index - 1;
                    scrollToSection(availableSections[prevIndex].id);
                  }
                }}
                role="tab"
                aria-selected={activeSection === id}
                aria-current={activeSection === id ? 'true' : undefined}
                tabIndex={activeSection === id ? 0 : -1}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all focus-ring",
                  activeSection === id
                    ? "bg-brand-turquoise-light text-brand-turquoise"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {t(key)}
              </button>
            ))}
          </nav>

          {/* Mobile Nav - Horizontal Scroll */}
          <div className="md:hidden relative scroll-fade-right">
            <nav
              className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide"
              role="tablist"
              aria-label={t('sectionNavigation') || 'Section navigation'}
            >
              {availableSections.map(({ id, key }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  role="tab"
                  aria-selected={activeSection === id}
                  aria-current={activeSection === id ? 'true' : undefined}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all flex-shrink-0 min-h-[44px] min-w-[44px]",
                    activeSection === id
                      ? "bg-brand-turquoise text-white"
                      : "bg-gray-100 text-gray-600 active:bg-gray-200"
                  )}
                >
                  {t(key)}
                </button>
              ))}
              <div className="w-8 flex-shrink-0" aria-hidden="true" /> {/* Spacer for fade */}
            </nav>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand-turquoise transition-colors">
              {tCommon('home') || 'Home'}
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180 text-gray-300" />
            <Link href="/tours" className="hover:text-brand-turquoise transition-colors">
              {t('title')}
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180 text-gray-300" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{tour.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div ref={heroRef} className="space-y-5">
              {/* Tour Images - Enhanced */}
              {tour.images && tour.images.length > 0 && (
                <div className="relative">
                  {/* Main Image */}
                  <div className="aspect-[16/10] md:aspect-video rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={tour.images[0] || '/placeholder-tour.jpg'}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                    {/* Gallery Button */}
                    {tour.images.length > 1 && (
                      <button
                        onClick={() => setShowGallery(true)}
                        className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-gray-800 hover:bg-white transition-all shadow-md btn-hover"
                      >
                        <Camera className="w-4 h-4" />
                        <span>{t('viewPhotos')} ({tour.images.length})</span>
                      </button>
                    )}
                  </div>

                  {/* Thumbnail Grid */}
                  {tour.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {tour.images.slice(1, 5).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setGalleryIndex(index + 1);
                            setShowGallery(true);
                          }}
                          className="relative aspect-[4/3] rounded-lg overflow-hidden group"
                        >
                          <img
                            src={image}
                            alt={`${tour.title} - ${index + 2}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          {/* Show "+N more" on last thumbnail if there are more images */}
                          {index === 3 && tour.images.length > 5 && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="text-white font-semibold">+{tour.images.length - 5}</span>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tour Title and Meta */}
              <div>
                {/* Category + Featured Badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {/* Category - neutral decorative badge */}
                  <span className="text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">
                    {tour.category?.name || 'Tour'}
                  </span>
                  {tour.isFeatured && (
                    <span className="text-sm font-medium text-amber-700 bg-brand-gold-light px-3 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      Featured
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {tour.title}
                </h1>

                {/* Quick Info Row */}
                <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-muted-foreground mb-5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-brand-turquoise" />
                    <span className="font-medium">{tour.duration} {tCommon('days')}</span>
                  </div>
                  {tour.maxGroupSize && (
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-brand-turquoise" />
                      <span>{t('maxGroupSize')}: {tour.maxGroupSize}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-brand-turquoise" />
                    <span>{t('location')}</span>
                  </div>
                  {tour._count && tour._count.reviews > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span>{tour._count.reviews} {t('reviews')}</span>
                    </div>
                  )}
                </div>

                {/* Trust Row - unified neutral chips */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-4 px-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-gray-500" />
                    </div>
                    <span>{t('trustNoHidden')}</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-gray-200" />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-4 h-4 text-gray-500" />
                    </div>
                    <span>{t('trustSupport')}</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-gray-200" />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <BadgeCheck className="w-4 h-4 text-gray-500" />
                    </div>
                    <span>{t('trustLocal')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Tour Section */}
            {tour.description && (
              <section id="about" className="scroll-mt-32">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-3">
                    <SectionTitle>{t('aboutTour')}</SectionTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                      {tour.description}
                    </p>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Highlights Section */}
            {tour.highlights && tour.highlights.length > 0 && (
              <section id="highlights" className="scroll-mt-32">
                <Card className="border-0 shadow-sm bg-surface-2">
                  <CardHeader className="pb-3">
                    <SectionTitle>{t('highlights')}</SectionTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {tour.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3 bg-white p-3 rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-brand-turquoise/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="h-4 w-4 text-brand-turquoise" />
                          </div>
                          <span className="text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Itinerary Section */}
            {tour.itineraryItems && tour.itineraryItems.length > 0 && (
              <section id="itinerary" className="scroll-mt-32 space-y-4">
                <SectionTitle>{t('itinerary')}</SectionTitle>
                <AccordionItinerary
                  items={tour.itineraryItems}
                  translations={{
                    day: t('day'),
                    itinerary: t('itinerary'),
                    accommodation: t('accommodation') || 'Accommodation',
                    meals: t('meals') || 'Meals',
                    viewDetails: t('viewDetails') || 'View Details',
                    hideDetails: t('hideDetails') || 'Hide Details',
                    tapToExpand: t('tapToExpand'),
                    tapToCollapse: t('tapToCollapse'),
                  }}
                />
              </section>
            )}

            {/* Included/Excluded Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {tour.included && tour.included.length > 0 && (
                <section id="included" className="scroll-mt-32">
                  <Card className="border-0 shadow-sm h-full bg-green-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-green-700">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                          <Check className="h-5 w-5 text-green-600" />
                        </div>
                        {t('included')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2.5">
                        {tour.included.map((item, index) => (
                          <li key={index} className="flex items-start gap-2.5">
                            <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </section>
              )}

              {tour.excluded && tour.excluded.length > 0 && (
                <section id="excluded" className="scroll-mt-32">
                  <Card className="border-0 shadow-sm h-full bg-red-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-red-700">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                          <X className="h-5 w-5 text-red-600" />
                        </div>
                        {t('excluded')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2.5">
                        {tour.excluded.map((item, index) => (
                          <li key={index} className="flex items-start gap-2.5">
                            <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </section>
              )}
            </div>

            {/* Cancellation Policy Section */}
            <section id="cancellation" className="scroll-mt-32">
              <CancellationPolicy
                tiers={mockCancellationPolicy}
                title={t('cancellation') || 'Cancellation Policy'}
                note="We recommend purchasing travel insurance for unexpected circumstances."
              />
            </section>

            {/* Meeting Point Section */}
            <section id="meeting" className="scroll-mt-32">
              <MeetingPoint
                {...mockMeetingPoint}
                title={t('meetingPoint') || 'Meeting Point'}
              />
            </section>

            {/* Know Before You Go Section */}
            <section className="scroll-mt-32">
              <KnowBeforeYouGo
                items={mockKnowBeforeYouGo}
                title={t('knowBeforeYouGo') || 'Know Before You Go'}
              />
            </section>

            {/* FAQ Section */}
            <section id="faq" className="scroll-mt-32">
              <TourFAQ
                faqs={mockFAQs}
                title={t('faq') || 'Frequently Asked Questions'}
              />
            </section>
          </div>

          {/* Sidebar - Booking Form */}
          <div className="lg:col-span-1" ref={sidebarRef}>
            <div className={cn(
              "space-y-4 transition-all",
              sidebarShouldStop ? "lg:relative" : "lg:sticky lg:top-32"
            )}>
              {/* Main Booking Form - Conditional based on bookingMode */}
              {tour.bookingMode === "inquiry" ? (
                <InquiryBookingForm
                  tourId={tour.id}
                  tourTitle={tour.title}
                  duration={tour.duration}
                  onSubmit={handleInquirySubmit}
                  translations={{
                    requestQuote: t("requestQuote") || "Request Availability & Price",
                    travelDates: t("travelDates") || "Preferred Travel Dates",
                    startDate: t("startDate") || "Start Date",
                    endDate: t("endDate") || "End Date",
                    numberOfTravelers: t("numberOfTravelers") || "Number of Travelers",
                    travelers: t("travelers") || "travelers",
                    traveler: t("traveler") || "traveler",
                    yourDetails: t("yourDetails") || "Your Contact Details",
                    fullName: t("fullName") || "Full Name",
                    email: t("email") || "Email Address",
                    phone: t("phone") || "Phone Number",
                    message: t("message") || "Additional Information (Optional)",
                    messagePlaceholder: t("messagePlaceholder") || "Tell us about your travel plans...",
                    submit: t("submitInquiry") || "Request Availability & Price",
                    support24: t("support24") || "24/7 Support Available",
                    personalizedQuote: t("personalizedQuote") || "Personalized Quote Within 24 Hours",
                    noCommitment: t("noCommitment") || "No Commitment Required",
                    successTitle: t("inquirySuccessTitle") || "Inquiry Sent!",
                    successMessage: t("inquirySuccessMessage") || "Thank you! We will contact you within 24 hours.",
                    errorTitle: t("inquiryErrorTitle") || "Submission Failed",
                    tryAgain: t("tryAgain") || "Try Again",
                  }}
                />
              ) : (
                <BookingForm
                  tourId={tour.id}
                  tourTitle={tour.title}
                  basePrice={Number(tour.price) || 500}
                  currency="USD"
                  duration={tour.duration}
                  departures={mockDepartures}
                  pricingTiers={mockPricingTiers}
                  maxGuests={tour.maxGroupSize || 10}
                  minGuests={1}
                  translations={{
                    selectDate: t("selectDate") || "Select Departure Date",
                    selectGuests: t("selectGuests") || "Number of Guests",
                    guests: t("guests") || "guests",
                    guest: t("guest") || "guest",
                    from: t("from") || "From",
                    perPerson: tCommon("perPerson") || "per person",
                    total: t("total") || "Total",
                    bookNow: tCommon("bookNow") || "Book Now",
                    inquire: t("inquire") || "Have questions? Contact us",
                    spotsLeft: t("spotsLeft") || "spots left",
                    soldOut: t("soldOut") || "Sold Out",
                    fillingFast: t("fillingFast") || "Filling Fast",
                    almostFull: t("almostFull") || "Almost Full",
                    available: t("available") || "Available",
                    securePayment: t("securePayment") || "Secure payment",
                    freeCancellation: t("freeCancellation") || "Free cancellation up to 30 days",
                    instantConfirmation: t("instantConfirmation") || "Instant confirmation",
                    bestPrice: t("bestPrice") || "Best Price",
                    recommended: t("recommended") || "Recommended",
                    noDateSelected: t("noDateSelected") || "Choose a date",
                    selectDateFirst: t("selectDateFirst") || "Select a date to continue",
                  }}
                  onBook={handleBooking}
                  onInquire={handleInquire}
                />
              )}

              {/* Difficulty Card - neutral badge */}
              {tour.difficulty && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">{t('difficulty')}</h3>
                    <span className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium">
                      {tCommon(`difficulty.${tour.difficulty}`) || tour.difficulty}
                    </span>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Footer sentinel for sidebar sticky stop */}
        <div ref={footerRef} className="h-px" aria-hidden="true" />
      </div>

      {/* Mobile Sticky CTA with WhatsApp */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg safe-area-bottom">
        <div className="flex items-center gap-3 p-4 max-w-7xl mx-auto">
          <div className="flex-1 min-w-0">
            {tour.bookingMode === "inquiry" ? (
              <>
                <p className="text-sm font-medium text-gray-900">{tour.title}</p>
                <p className="text-xs text-muted-foreground">{t("requestQuote") || "Get personalized quote"}</p>
              </>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">{t("from")}</p>
                <p className="text-xl font-bold text-brand-turquoise truncate">
                  ${typeof tour.price === "string" ? tour.price : tour.price.toString()}
                  <span className="text-xs font-normal text-muted-foreground ml-1">/{tCommon("perPerson")}</span>
                </p>
              </>
            )}
          </div>

          {/* WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-md hover:bg-[#128C7E] transition-colors active:scale-95"
            aria-label="Contact via WhatsApp"
          >
            <WhatsAppIcon className="w-6 h-6" />
          </a>

          {/* Book Now / Request Quote Button */}
          <Button
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-brand-turquoise hover:bg-brand-turquoise/90 text-white font-semibold px-6 btn-hover min-h-[48px]"
            aria-label={tour.bookingMode === "inquiry" ? (t("requestQuote") || "Request Quote") : tCommon("bookNow")}
          >
            {tour.bookingMode === "inquiry" ? (t("requestQuote") || "Request Quote") : tCommon("bookNow")}
          </Button>
        </div>
      </div>

      {/* Mobile CTA Spacer */}
      <div className="lg:hidden mobile-cta-spacer" />

      {/* Gallery Modal */}
      {showGallery && tour.images && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            onClick={() => setShowGallery(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-8 h-8" />
          </button>

          <button
            onClick={() => setGalleryIndex(i => i > 0 ? i - 1 : tour.images!.length - 1)}
            className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img
            src={tour.images[galleryIndex]}
            alt={`${tour.title} - ${galleryIndex + 1}`}
            className="max-w-[90vw] max-h-[80vh] object-contain"
          />

          <button
            onClick={() => setGalleryIndex(i => i < tour.images!.length - 1 ? i + 1 : 0)}
            className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-sm">
            {galleryIndex + 1} / {tour.images.length}
          </div>
        </div>
      )}
    </div>
  );
}
