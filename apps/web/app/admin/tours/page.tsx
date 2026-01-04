"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Edit, Trash2, Eye, Globe, Check, AlertCircle, X } from "lucide-react"
import Link from "next/link"

interface Translation {
  locale: string
  title: string
}

interface Tour {
  id: string
  title: string
  slug: string
  description: string
  price: number | string
  duration: number
  isFeatured: boolean
  isActive: boolean
  category?: {
    id: string
    name: string
  }
  translations?: Translation[]
}

const LOCALES = [
  { code: 'en', name: 'EN', flag: '🇬🇧' },
  { code: 'ru', name: 'RU', flag: '🇷🇺' },
  { code: 'uz', name: 'UZ', flag: '🇺🇿' },
]

export default function ToursManagementPage() {
  const [tours, setTours] = useState<Tour[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    setLoading(true)
    try {
      // Fetch tours with translations
      const res = await fetch('http://localhost:4000/api/tours?includeTranslations=true', {
        credentials: 'include',
      })
      const data = await res.json()
      setTours(data.data || [])
    } catch (error) {
      console.error('Failed to fetch tours:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this tour?')) return

    try {
      await fetch(`http://localhost:4000/api/tours/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      fetchTours()
    } catch (error) {
      console.error('Failed to delete tour:', error)
      alert('Failed to delete tour')
    }
  }

  const getTranslationStatus = (tour: Tour) => {
    if (!tour.translations || tour.translations.length === 0) {
      return { count: 0, locales: [] }
    }
    const translatedLocales = tour.translations.map(t => t.locale)
    return {
      count: translatedLocales.length,
      locales: translatedLocales
    }
  }

  const filteredTours = tours.filter(tour =>
    tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tour.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tours Management</h1>
          <p className="text-gray-600 mt-1">Manage all tour packages and translations</p>
        </div>
        <Link href="/admin/tours/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Tour
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tours..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tours Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tours ({filteredTours.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading tours...</div>
          ) : filteredTours.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No tours found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="pb-3 font-semibold text-gray-900">Title</th>
                    <th className="pb-3 font-semibold text-gray-900">Category</th>
                    <th className="pb-3 font-semibold text-gray-900">Duration</th>
                    <th className="pb-3 font-semibold text-gray-900">Price</th>
                    <th className="pb-3 font-semibold text-gray-900">
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        Translations
                      </div>
                    </th>
                    <th className="pb-3 font-semibold text-gray-900">Status</th>
                    <th className="pb-3 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredTours.map((tour) => {
                    const translationStatus = getTranslationStatus(tour)
                    return (
                      <tr key={tour.id} className="hover:bg-gray-50">
                        <td className="py-4">
                          <div className="font-medium text-gray-900">{tour.title}</div>
                          <div className="text-sm text-gray-500">{tour.slug}</div>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tour.category?.name || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="py-4 text-gray-900">{tour.duration} days</td>
                        <td className="py-4 font-medium text-gray-900">${tour.price}</td>
                        <td className="py-4">
                          <div className="flex items-center gap-1">
                            {LOCALES.map(locale => {
                              const hasTranslation = translationStatus.locales.includes(locale.code)
                              return (
                                <span
                                  key={locale.code}
                                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                    hasTranslation
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-400'
                                  }`}
                                  title={hasTranslation ? `${locale.name} translation available` : `${locale.name} translation missing`}
                                >
                                  {locale.flag}
                                  {hasTranslation ? (
                                    <Check className="h-3 w-3 ml-1" />
                                  ) : (
                                    <X className="h-3 w-3 ml-1" />
                                  )}
                                </span>
                              )
                            })}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col gap-1">
                            {tour.isFeatured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                Featured
                              </span>
                            )}
                            {tour.isActive !== false ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                Inactive
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <Link href={`/tours/${tour.slug}`} target="_blank">
                              <Button variant="ghost" size="sm" title="View on website">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/tours/${tour.id}`}>
                              <Button variant="ghost" size="sm" title="Edit tour">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(tour.id)}
                              title="Delete tour"
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
