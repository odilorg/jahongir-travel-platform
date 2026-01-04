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
import { AccordionItinerary } from "@/components/tour/accordion-itinerary";
import { cn } from "@/lib/utils";

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
  { id: 'excluded', key: 'excluded' },
] as const;

export function TourDetailClient({ tour }: TourDetailClientProps) {
  const t = useTranslations('tours');
  const tCommon = useTranslations('common');

  const [activeSection, setActiveSection] = useState<string>('about');
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

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
      case 'excluded': return tour.excluded && tour.excluded.length > 0;
      default: return false;
    }
  });

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
          <nav className="hidden md:flex items-center gap-1 py-3" ref={navRef}>
            {availableSections.map(({ id, key }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
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
            <nav className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
              {availableSections.map(({ id, key }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all flex-shrink-0",
                    activeSection === id
                      ? "bg-brand-turquoise text-white"
                      : "bg-gray-100 text-gray-600"
                  )}
                >
                  {t(key)}
                </button>
              ))}
              <div className="w-8 flex-shrink-0" /> {/* Spacer for fade */}
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
                  <span className="text-sm font-medium text-brand-turquoise bg-brand-turquoise-light px-3 py-1 rounded-full">
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

                {/* Trust Row */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 py-4 px-4 bg-surface-2 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                    </div>
                    <span>{t('trustNoHidden')}</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-gray-200" />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Headphones className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>{t('trustSupport')}</span>
                  </div>
                  <div className="hidden sm:block w-px h-6 bg-gray-200" />
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-brand-turquoise-light flex items-center justify-center flex-shrink-0">
                      <BadgeCheck className="w-4 h-4 text-brand-turquoise" />
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
          </div>

          {/* Sidebar - Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-32 space-y-4">
              {/* Main Booking Card */}
              <Card className="border-0 shadow-lg overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-brand-turquoise to-brand-gold" />
                <CardContent className="p-5 sm:p-6">
                  {/* Price */}
                  <div className="mb-5">
                    <p className="text-sm text-muted-foreground mb-1">{t('from')}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-bold text-brand-turquoise">
                        ${typeof tour.price === 'string' ? tour.price : tour.price.toString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{tCommon('perPerson')}</p>
                  </div>

                  {/* CTA Buttons */}
                  <Button
                    size="lg"
                    className="w-full mb-3 bg-brand-turquoise hover:bg-brand-turquoise/90 text-white font-semibold btn-hover"
                  >
                    {tCommon('bookNow')}
                  </Button>

                  <Link href="/contact" className="block">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full border-brand-turquoise text-brand-turquoise hover:bg-brand-turquoise-light"
                    >
                      {tCommon('learnMore')}
                    </Button>
                  </Link>

                  {/* Response Time */}
                  <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {t('replyTime')}
                  </p>

                  {/* Trust Badges */}
                  <div className="mt-5 pt-5 border-t border-gray-100 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      <span>{t('securePayment')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Headphones className="w-4 h-4 text-blue-600" />
                      <span>{t('freeConsultation')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Difficulty Card */}
              {tour.difficulty && (
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">{t('difficulty')}</h3>
                    <span className="inline-flex items-center gap-2 bg-brand-turquoise-light text-brand-turquoise px-4 py-2 rounded-lg font-medium">
                      {tCommon(`difficulty.${tour.difficulty}`) || tour.difficulty}
                    </span>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg safe-area-bottom">
        <div className="flex items-center gap-3 p-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">{t('from')}</p>
            <p className="text-xl font-bold text-brand-turquoise">
              ${typeof tour.price === 'string' ? tour.price : tour.price.toString()}
              <span className="text-xs font-normal text-muted-foreground ml-1">/{tCommon('perPerson')}</span>
            </p>
          </div>
          <Button
            size="lg"
            className="bg-brand-turquoise hover:bg-brand-turquoise/90 text-white font-semibold px-6 btn-hover"
          >
            {tCommon('bookNow')}
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
