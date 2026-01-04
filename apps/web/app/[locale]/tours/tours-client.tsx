"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Link } from "@/i18n/routing"
import { Clock, Search, Filter, X } from "lucide-react"
import type { Tour, Category, PaginatedResponse } from "@/lib/api"
import { getTours } from "@/lib/api"
import { useTranslations } from "next-intl"

interface ToursClientProps {
  initialTours: PaginatedResponse<Tour>
  categories: Category[]
  locale: string
}

export function ToursClient({ initialTours, categories, locale }: ToursClientProps) {
  const t = useTranslations('tours')
  const tCommon = useTranslations('common')

  const [tours, setTours] = useState<Tour[]>(initialTours.data)
  const [totalPages, setTotalPages] = useState(initialTours.meta.totalPages)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [minDuration, setMinDuration] = useState("")
  const [maxDuration, setMaxDuration] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchTours()
  }, [currentPage, selectedCategories, sortBy])

  const fetchTours = async () => {
    setLoading(true)
    try {
      const data = await getTours({
        page: currentPage,
        limit: 9,
        categoryId: selectedCategories[0],
        locale,
      })

      setTours(data.data || [])
      setTotalPages(data.meta?.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch tours:', error)
      setTours([])
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
    setCurrentPage(1)
  }

  const handleSearch = () => {
    fetchTours()
  }

  const handleClearFilters = () => {
    setSelectedCategories([])
    setMinPrice("")
    setMaxPrice("")
    setMinDuration("")
    setMaxDuration("")
    setSortBy("featured")
    setSearchQuery("")
    setCurrentPage(1)
  }

  // Filter tours client-side for search, price, and duration
  const filteredTours = tours.filter(tour => {
    if (searchQuery && !tour.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !tour.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    const tourPrice = typeof tour.price === 'string' ? parseFloat(tour.price) : tour.price
    if (minPrice && tourPrice < parseFloat(minPrice)) return false
    if (maxPrice && tourPrice > parseFloat(maxPrice)) return false

    if (minDuration && tour.duration < parseInt(minDuration)) return false
    if (maxDuration && tour.duration > parseInt(maxDuration)) return false

    return true
  })

  // Sort tours
  const sortedTours = [...filteredTours].sort((a, b) => {
    const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price
    const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price
    switch (sortBy) {
      case 'price-asc':
        return priceA - priceB
      case 'price-desc':
        return priceB - priceA
      case 'duration-asc':
        return a.duration - b.duration
      case 'duration-desc':
        return b.duration - a.duration
      case 'featured':
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    }
  })

  const FiltersSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-lg mb-4 text-gray-900">{tCommon('filter')}</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <label
                htmlFor={category.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-gray-700"
              >
                {category.name}
                {category._count && (
                  <span className="text-muted-foreground ml-1">({category._count.tours})</span>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">Price Range ({tCommon('currency')})</h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onBlur={handleSearch}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onBlur={handleSearch}
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-900">{t('duration')} ({tCommon('days')})</h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minDuration}
            onChange={(e) => setMinDuration(e.target.value)}
            onBlur={handleSearch}
          />
          <Input
            type="number"
            placeholder="Max"
            value={maxDuration}
            onChange={(e) => setMaxDuration(e.target.value)}
            onBlur={handleSearch}
          />
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleClearFilters}
      >
        <X className="h-4 w-4 mr-2" />
        Clear Filters
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
          <p className="text-lg opacity-90">{t('subtitle')}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Sort Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`${tCommon('search')} ${t('title').toLowerCase()}...`}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={tCommon('sort')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="duration-asc">Duration: Short to Long</SelectItem>
              <SelectItem value="duration-desc">Duration: Long to Short</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="sm:hidden"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {tCommon('filter')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:col-span-1 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-900">{tCommon('filter')}</h2>
              <FiltersSection />
            </div>
          </aside>

          {/* Tours Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{tCommon('loading')}</p>
              </div>
            ) : sortedTours.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{tCommon('noResults')}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {sortedTours.map((tour) => (
                    <Card key={tour.id} className="hover:shadow-lg transition-all hover:scale-[1.02] duration-300">
                      {tour.images && tour.images[0] && (
                        <div className="aspect-[4/3] overflow-hidden rounded-t-lg">
                          <img
                            src={tour.images[0] || '/placeholder-tour.jpg'}
                            alt={tour.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                            {tour.category?.name || 'Tour'}
                          </span>
                          {tour.isFeatured && (
                            <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-xl line-clamp-2">{tour.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {tour.duration} {tCommon('days')}
                          </span>
                          {tour._count && tour._count.reviews > 0 && (
                            <span className="text-sm">
                              ⭐ {tour._count.reviews} {t('reviews')}
                            </span>
                          )}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {tour.shortDescription || tour.description}
                        </p>
                        <p className="mt-4 text-2xl font-bold text-primary">
                          ${tour.price.toString()}
                        </p>
                      </CardContent>

                      <CardFooter>
                        <Link href={`/tours/${tour.slug}`} className="w-full">
                          <Button className="w-full">{tCommon('viewAll')}</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
