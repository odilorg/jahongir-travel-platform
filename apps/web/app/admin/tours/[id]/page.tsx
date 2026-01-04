"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageUpload } from "@/components/ui/image-upload"
import { ArrowLeft, Globe, Check, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
  slug: string
}

interface Translation {
  locale: string
  title: string
  slug: string
  summary: string | null
  description: string
  highlights: string[]
  included: string[]
  excluded: string[]
  metaTitle: string | null
  metaDescription: string | null
}

interface Tour {
  id: string
  price: number
  duration: number
  maxGroupSize: number
  difficulty: string
  categoryId: string
  images: string[]
  isFeatured: boolean
  isActive: boolean
  showPrice: boolean
  translations: Translation[]
}

const LOCALES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
]

const emptyTranslation = (locale: string): Translation => ({
  locale,
  title: '',
  slug: '',
  summary: '',
  description: '',
  highlights: [],
  included: [],
  excluded: [],
  metaTitle: '',
  metaDescription: '',
})

export default function EditTourPage() {
  const params = useParams()
  const router = useRouter()
  const tourId = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [activeLocale, setActiveLocale] = useState('en')

  // Tour base data (non-translatable)
  const [baseData, setBaseData] = useState({
    price: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'Moderate',
    categoryId: '',
    images: [] as string[],
    isFeatured: false,
    isActive: true,
    showPrice: true,
  })

  // Translations for each locale
  const [translations, setTranslations] = useState<Record<string, Translation>>({
    en: emptyTranslation('en'),
    ru: emptyTranslation('ru'),
    uz: emptyTranslation('uz'),
  })

  // Track which locales have been modified
  const [modifiedLocales, setModifiedLocales] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchTour()
    fetchCategories()
  }, [tourId])

  const fetchTour = async () => {
    try {
      // Fetch tour with all translations
      const res = await fetch(`http://localhost:4000/api/admin/translations/tours/${tourId}`, {
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error('Failed to fetch tour')
      }

      const data = await res.json()

      // Set base data
      setBaseData({
        price: data.price?.toString() || '',
        duration: data.duration?.toString() || '',
        maxGroupSize: data.maxGroupSize?.toString() || '',
        difficulty: data.difficulty || 'Moderate',
        categoryId: data.categoryId || '',
        images: data.images || [],
        isFeatured: data.isFeatured || false,
        isActive: data.isActive !== false,
        showPrice: data.showPrice !== false,
      })

      // Set translations
      const newTranslations: Record<string, Translation> = {
        en: emptyTranslation('en'),
        ru: emptyTranslation('ru'),
        uz: emptyTranslation('uz'),
      }

      if (data.translations) {
        data.translations.forEach((t: Translation) => {
          if (newTranslations[t.locale]) {
            newTranslations[t.locale] = {
              ...t,
              highlights: t.highlights || [],
              included: t.included || [],
              excluded: t.excluded || [],
            }
          }
        })
      }

      setTranslations(newTranslations)
    } catch (error) {
      console.error('Failed to fetch tour:', error)
      alert('Failed to load tour data')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/categories')
      const data = await res.json()
      setCategories(data.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const updateTranslation = (locale: string, field: keyof Translation, value: any) => {
    setTranslations(prev => ({
      ...prev,
      [locale]: {
        ...prev[locale],
        [field]: value,
      }
    }))
    setModifiedLocales(prev => new Set(prev).add(locale))
  }

  const handleArrayFieldChange = (locale: string, field: 'highlights' | 'included' | 'excluded', value: string) => {
    const items = value.split('\n').filter(line => line.trim())
    updateTranslation(locale, field, items)
  }

  const getArrayFieldValue = (locale: string, field: 'highlights' | 'included' | 'excluded') => {
    return translations[locale][field]?.join('\n') || ''
  }

  const handleSave = async () => {
    setSaving(true)

    try {
      // Save base tour data
      const tourRes = await fetch(`http://localhost:4000/api/tours/${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          price: parseFloat(baseData.price),
          duration: parseInt(baseData.duration),
          maxGroupSize: baseData.maxGroupSize ? parseInt(baseData.maxGroupSize) : null,
          difficulty: baseData.difficulty,
          categoryId: baseData.categoryId,
          images: baseData.images,
          isFeatured: baseData.isFeatured,
          isActive: baseData.isActive,
          showPrice: baseData.showPrice,
        }),
      })

      if (!tourRes.ok) {
        throw new Error('Failed to update tour base data')
      }

      // Save translations for each modified locale
      for (const locale of modifiedLocales) {
        const t = translations[locale]
        if (t.title) { // Only save if there's content
          const transRes = await fetch(`http://localhost:4000/api/admin/translations/tours/${tourId}/${locale}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              title: t.title,
              slug: t.slug,
              summary: t.summary || null,
              description: t.description,
              highlights: t.highlights,
              included: t.included,
              excluded: t.excluded,
              metaTitle: t.metaTitle || null,
              metaDescription: t.metaDescription || null,
            }),
          })

          if (!transRes.ok) {
            throw new Error(`Failed to save ${locale} translation`)
          }
        }
      }

      setModifiedLocales(new Set())
      alert('Tour saved successfully!')
    } catch (error: any) {
      console.error('Save error:', error)
      alert(error.message || 'Failed to save tour')
    } finally {
      setSaving(false)
    }
  }

  const getTranslationStatus = (locale: string) => {
    const t = translations[locale]
    if (!t.title) return 'empty'
    if (t.title && t.description) return 'complete'
    return 'partial'
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentTranslation = translations[activeLocale]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/admin/tours" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Tours
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Tour</h1>
          <p className="text-gray-600 mt-1">Update tour details and translations</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Base Data */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pricing & Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (USD) *</label>
                <Input
                  type="number"
                  step="0.01"
                  value={baseData.price}
                  onChange={(e) => setBaseData({ ...baseData, price: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration (days) *</label>
                <Input
                  type="number"
                  value={baseData.duration}
                  onChange={(e) => setBaseData({ ...baseData, duration: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Max Group Size</label>
                <Input
                  type="number"
                  value={baseData.maxGroupSize}
                  onChange={(e) => setBaseData({ ...baseData, maxGroupSize: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select
                  value={baseData.difficulty}
                  onChange={(e) => setBaseData({ ...baseData, difficulty: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  value={baseData.categoryId}
                  onChange={(e) => setBaseData({ ...baseData, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                >
                  <option value="">Select category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={baseData.isFeatured}
                  onChange={(e) => setBaseData({ ...baseData, isFeatured: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Featured Tour</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={baseData.isActive}
                  onChange={(e) => setBaseData({ ...baseData, isActive: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Active (visible on website)</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={baseData.showPrice}
                  onChange={(e) => setBaseData({ ...baseData, showPrice: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Show Price</span>
              </label>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={baseData.images}
                onChange={(value) => setBaseData({ ...baseData, images: value as string[] })}
                folder="tours"
                multiple={true}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Translations */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Translations
                </CardTitle>

                {/* Language Tabs */}
                <div className="flex gap-1">
                  {LOCALES.map((locale) => {
                    const status = getTranslationStatus(locale.code)
                    return (
                      <button
                        key={locale.code}
                        onClick={() => setActiveLocale(locale.code)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                          activeLocale === locale.code
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{locale.flag}</span>
                        <span>{locale.name}</span>
                        {status === 'complete' && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                        {status === 'partial' && (
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title & Slug */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <Input
                    value={currentTranslation.title}
                    onChange={(e) => updateTranslation(activeLocale, 'title', e.target.value)}
                    placeholder={`Tour title in ${LOCALES.find(l => l.code === activeLocale)?.name}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Slug *</label>
                  <Input
                    value={currentTranslation.slug}
                    onChange={(e) => updateTranslation(activeLocale, 'slug', e.target.value)}
                    placeholder="url-friendly-slug"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-sm font-medium mb-2">Summary (short description)</label>
                <Input
                  value={currentTranslation.summary || ''}
                  onChange={(e) => updateTranslation(activeLocale, 'summary', e.target.value)}
                  placeholder="Brief 1-2 sentence summary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Full Description *</label>
                <textarea
                  value={currentTranslation.description}
                  onChange={(e) => updateTranslation(activeLocale, 'description', e.target.value)}
                  placeholder="Full tour description..."
                  className="w-full min-h-[150px] px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium mb-2">Highlights (one per line)</label>
                <textarea
                  value={getArrayFieldValue(activeLocale, 'highlights')}
                  onChange={(e) => handleArrayFieldChange(activeLocale, 'highlights', e.target.value)}
                  placeholder="Visit Registan Square&#10;Explore ancient bazaars&#10;Traditional lunch included"
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>

              {/* Included */}
              <div>
                <label className="block text-sm font-medium mb-2">What's Included (one per line)</label>
                <textarea
                  value={getArrayFieldValue(activeLocale, 'included')}
                  onChange={(e) => handleArrayFieldChange(activeLocale, 'included', e.target.value)}
                  placeholder="Hotel accommodation&#10;All meals&#10;Professional guide"
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>

              {/* Excluded */}
              <div>
                <label className="block text-sm font-medium mb-2">What's Not Included (one per line)</label>
                <textarea
                  value={getArrayFieldValue(activeLocale, 'excluded')}
                  onChange={(e) => handleArrayFieldChange(activeLocale, 'excluded', e.target.value)}
                  placeholder="International flights&#10;Travel insurance&#10;Personal expenses"
                  className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                />
              </div>

              {/* SEO Fields */}
              <div className="border-t pt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">SEO Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Title</label>
                    <Input
                      value={currentTranslation.metaTitle || ''}
                      onChange={(e) => updateTranslation(activeLocale, 'metaTitle', e.target.value)}
                      placeholder="SEO title for search engines"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                    <textarea
                      value={currentTranslation.metaDescription || ''}
                      onChange={(e) => updateTranslation(activeLocale, 'metaDescription', e.target.value)}
                      placeholder="SEO description (150-160 characters recommended)"
                      className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
