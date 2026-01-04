'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { MapPin, Clock, Users, Check, X, ChevronLeft, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Tour } from "@/lib/api";

interface TourDetailClientProps {
  tour: Tour;
}

export function TourDetailClient({ tour }: TourDetailClientProps) {
  const t = useTranslations('tours');
  const tCommon = useTranslations('common');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              {tCommon('home') || 'Home'}
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <Link href="/tours" className="hover:text-primary transition-colors">
              {t('title')}
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="text-foreground font-medium">{tour.title}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tour Images */}
            {tour.images && tour.images.length > 0 && (
              <div className="space-y-4">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={tour.images[0] || '/placeholder-tour.jpg'}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {tour.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-4">
                    {tour.images.slice(1, 5).map((image, index) => (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${tour.title} - Image ${index + 2}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tour Title and Category */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded">
                  {tour.category?.name || 'Tour'}
                </span>
                {tour.isFeatured && (
                  <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded">
                    ⭐ Featured
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{tour.title}</h1>

              {/* Quick Info */}
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{tour.duration} {tCommon('days')}</span>
                </div>
                {tour.maxGroupSize && (
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{t('maxGroupSize')}: {tour.maxGroupSize}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Uzbekistan</span>
                </div>
                {tour._count && tour._count.reviews > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span>{tour._count.reviews} {t('reviews')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {tour.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Tour</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {tour.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('highlights')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Itinerary */}
            {tour.itineraryItems && tour.itineraryItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('itinerary')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {tour.itineraryItems.map((item) => (
                      <div key={item.id} className="border-l-4 border-primary pl-6 py-2">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded">
                            {t('day')} {item.day}
                          </span>
                          <h3 className="font-bold text-lg">{item.title}</h3>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{item.description}</p>
                        {item.accommodation && (
                          <p className="text-sm text-muted-foreground mt-2">
                            🏨 {item.accommodation}
                          </p>
                        )}
                        {item.meals && (
                          <p className="text-sm text-muted-foreground">
                            🍽️ {item.meals}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* What's Included/Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tour.included && tour.included.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">{t('included')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tour.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {tour.excluded && tour.excluded.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">{t('excluded')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tour.excluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">From</p>
                    <p className="text-4xl font-bold text-primary">
                      ${typeof tour.price === 'string' ? tour.price : tour.price.toString()}
                    </p>
                    <p className="text-sm text-muted-foreground">{tCommon('perPerson')}</p>
                  </div>

                  <Button size="lg" className="w-full mb-3">
                    {tCommon('bookNow')}
                  </Button>

                  <Link href="/contact" className="block">
                    <Button variant="outline" size="lg" className="w-full">
                      {tCommon('learnMore')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {tour.difficulty && (
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{t('difficulty')}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded">
                      {tCommon(`difficulty.${tour.difficulty}`) || tour.difficulty}
                    </span>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
