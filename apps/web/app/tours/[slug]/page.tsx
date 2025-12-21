import { getTourBySlug } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { MapPin, Clock, Users, Calendar, Check, X, ChevronLeft, Star } from "lucide-react"
import { notFound } from "next/navigation"
import { BookingSidebar } from "@/components/booking-sidebar"

interface TourDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function TourDetailPage({ params }: TourDetailPageProps) {
  const { slug } = await params
  let tour

  try {
    tour = await getTourBySlug(slug)
  } catch (error) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <Link href="/tours" className="hover:text-primary transition-colors">Tours</Link>
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
                  <span>{tour.duration} Days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Small Group</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span>Uzbekistan</span>
                </div>
                {tour._count && tour._count.reviews > 0 && (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span>{tour._count.reviews} reviews</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Tour</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {tour.description}
                </p>
              </CardContent>
            </Card>

            {/* Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Tour Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tour.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-400 fill-amber-400 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Itinerary */}
            {tour.itineraryItems && tour.itineraryItems.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Tour Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tour.itineraryItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
                          {item.day}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{item.title}</h4>
                          <p className="text-muted-foreground mb-2">{item.description}</p>
                          {(item.accommodation || item.meals) && (
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              {item.accommodation && <span>🏨 {item.accommodation}</span>}
                              {item.meals && <span>🍽️ {item.meals}</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Tour Itinerary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Detailed daily itinerary will be provided upon booking. Contact us for more information.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* What's Included/Excluded */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tour.included && tour.included.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-green-600">What's Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tour.included.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {tour.excluded && tour.excluded.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-red-600">What's Not Included</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tour.excluded.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <X className="h-5 w-5 text-red-600 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Reviews Section */}
            {tour.reviews && tour.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Traveler Reviews</CardTitle>
                  {tour.averageRating && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(tour.averageRating!)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {tour.averageRating.toFixed(1)} out of 5 ({tour._count?.reviews} reviews)
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {tour.reviews.filter(r => r.isApproved).map((review) => (
                      <div key={review.id} className="border-b pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h5 className="font-semibold">{review.name}</h5>
                            <p className="text-sm text-muted-foreground">{review.country}</p>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <h6 className="font-medium mb-1">{review.title}</h6>
                        <p className="text-muted-foreground">{review.comment}</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <BookingSidebar tour={tour} />
          </div>
        </div>
      </div>
    </div>
  )
}
