'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, Plus, X, Calendar, Users, HelpCircle, Trash2, GripVertical } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { RichTextEditor, MultiImageUploadField } from '@/components/shared';

// ============================================
// TYPE DEFINITIONS FOR NEW FEATURES
// ============================================

interface TourDeparture {
  id?: string;
  startDate: string;
  endDate: string;
  maxSpots: number;
  spotsRemaining: number;
  status: 'available' | 'filling_fast' | 'almost_full' | 'sold_out' | 'cancelled';
  priceModifier?: number;
  isGuaranteed: boolean;
  isActive: boolean;
}

interface PricingTier {
  id?: string;
  minGuests: number;
  maxGuests: number;
  pricePerPerson: number;
  order: number;
  translations: {
    locale: string;
    label: string;
  }[];
}

interface FAQItem {
  id?: string;
  order: number;
  translations: {
    locale: string;
    question: string;
    answer: string;
  }[];
}

const tourSchema = z.object({
  // Basic Info
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(250),
  categoryId: z.string().min(1, 'Category is required'),
  duration: z.number().min(1, 'Duration must be at least 1 day'),
  maxGroupSize: z.number().min(1, 'Group size must be at least 1').optional(),
  difficulty: z.string().optional(),

  // Description
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),

  // Pricing
  price: z.number().min(0, 'Price must be positive'),
  discountedPrice: z.number().min(0).optional(),
  showPrice: z.boolean().optional(),

  // Status
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),

  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

type TourFormData = z.infer<typeof tourSchema>;

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

interface TourFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  submitting: boolean;
}

export function TourForm({ initialData, onSubmit, submitting }: TourFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState('basic');

  // Arrays for highlights, included, excluded
  const [highlights, setHighlights] = useState<string[]>(
    initialData?.highlights || []
  );
  const [included, setIncluded] = useState<string[]>(initialData?.included || []);
  const [excluded, setExcluded] = useState<string[]>(initialData?.excluded || []);
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  // NEW: Departures, Pricing Tiers, FAQs
  const [departures, setDepartures] = useState<TourDeparture[]>(
    initialData?.departures || []
  );
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>(
    initialData?.pricingTiers || []
  );
  const [faqs, setFaqs] = useState<FAQItem[]>(
    initialData?.faqs || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<TourFormData>({
    resolver: zodResolver(tourSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      categoryId: '',
      duration: 1,
      maxGroupSize: 15,
      difficulty: '',
      shortDescription: '',
      description: '',
      price: 0,
      discountedPrice: 0,
      showPrice: true,
      isActive: true,
      isFeatured: false,
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.get<Category[]>('/api/categories');
      setCategories(data);
    } catch (error) {
      toast.error('Failed to load categories');
    }
  };

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setValue('title', title);
    setValue(
      'slug',
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    );
  };

  const handleFormSubmit = async (data: TourFormData) => {
    const formattedData = {
      ...data,
      highlights,
      included,
      excluded,
      images,
      departures,
      pricingTiers,
      faqs,
    };
    console.log('Submitting tour with categoryId:', formattedData.categoryId);
    console.log('Full form data:', formattedData);
    await onSubmit(formattedData);
  };

  // ============================================
  // DEPARTURE MANAGEMENT FUNCTIONS
  // ============================================

  const addDeparture = () => {
    const today = new Date();
    const startDate = new Date(today.setMonth(today.getMonth() + 1));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (initialData?.duration || 7));

    setDepartures([
      ...departures,
      {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        maxSpots: initialData?.maxGroupSize || 12,
        spotsRemaining: initialData?.maxGroupSize || 12,
        status: 'available',
        isGuaranteed: false,
        isActive: true,
      },
    ]);
  };

  const updateDeparture = (index: number, field: keyof TourDeparture, value: any) => {
    const updated = [...departures];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-update status based on spots remaining
    if (field === 'spotsRemaining') {
      const spots = Number(value);
      const maxSpots = updated[index].maxSpots;
      if (spots === 0) {
        updated[index].status = 'sold_out';
      } else if (spots <= 2) {
        updated[index].status = 'almost_full';
      } else if (spots <= maxSpots * 0.4) {
        updated[index].status = 'filling_fast';
      } else {
        updated[index].status = 'available';
      }
    }

    setDepartures(updated);
  };

  const removeDeparture = (index: number) => {
    setDepartures(departures.filter((_, i) => i !== index));
  };

  // ============================================
  // PRICING TIER MANAGEMENT FUNCTIONS
  // ============================================

  const addPricingTier = () => {
    const lastTier = pricingTiers[pricingTiers.length - 1];
    const newMinGuests = lastTier ? lastTier.maxGuests + 1 : 1;

    setPricingTiers([
      ...pricingTiers,
      {
        minGuests: newMinGuests,
        maxGuests: newMinGuests + 1,
        pricePerPerson: Number(initialData?.price) || 100,
        order: pricingTiers.length,
        translations: [
          { locale: 'en', label: `${newMinGuests}-${newMinGuests + 1} People` },
          { locale: 'ru', label: `${newMinGuests}-${newMinGuests + 1} человек` },
          { locale: 'uz', label: `${newMinGuests}-${newMinGuests + 1} kishi` },
        ],
      },
    ]);
  };

  const updatePricingTier = (index: number, field: string, value: any) => {
    const updated = [...pricingTiers];
    if (field.startsWith('translation_')) {
      const [_, locale, transField] = field.split('_');
      const transIndex = updated[index].translations.findIndex(t => t.locale === locale);
      if (transIndex >= 0) {
        updated[index].translations[transIndex] = {
          ...updated[index].translations[transIndex],
          [transField]: value,
        };
      }
    } else {
      (updated[index] as any)[field] = value;
    }
    setPricingTiers(updated);
  };

  const removePricingTier = (index: number) => {
    setPricingTiers(pricingTiers.filter((_, i) => i !== index));
  };

  // ============================================
  // FAQ MANAGEMENT FUNCTIONS
  // ============================================

  const addFAQ = () => {
    setFaqs([
      ...faqs,
      {
        order: faqs.length,
        translations: [
          { locale: 'en', question: '', answer: '' },
          { locale: 'ru', question: '', answer: '' },
          { locale: 'uz', question: '', answer: '' },
        ],
      },
    ]);
  };

  const updateFAQ = (index: number, locale: string, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    const transIndex = updated[index].translations.findIndex(t => t.locale === locale);
    if (transIndex >= 0) {
      updated[index].translations[transIndex] = {
        ...updated[index].translations[transIndex],
        [field]: value,
      };
    }
    setFaqs(updated);
  };

  const removeFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Array management functions
  const addToArray = (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (!value.trim()) return;
    setArr([...arr, value.trim()]);
  };

  const removeFromArray = (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setArr(arr.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="departures" className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Departures
          </TabsTrigger>
          <TabsTrigger value="pricingTiers" className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            Group Pricing
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-1">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Info */}
        <TabsContent value="basic">
          <Card className="border border-gray-300">
            <CardContent className="pt-6 space-y-6">
              {/* Title & Slug */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tour Title</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      {...register('title')}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Mountain Adventure in Uzbekistan"
                    />
                    {errors.title && (
                      <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      Slug will be auto-generated
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      {...register('slug')}
                      placeholder="mountain-adventure-in-uzbekistan"
                    />
                    {errors.slug && (
                      <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">
                      URL-friendly identifier
                    </p>
                  </div>
                </div>
              </div>

              {/* Category, Duration, Group Size, Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Category *</Label>
                  <Select
                    value={watch('categoryId') || ''}
                    onValueChange={(value) => setValue('categoryId', value)}
                  >
                    <SelectTrigger id="categoryId" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={watch('difficulty') || ''}
                    onValueChange={(value) => setValue('difficulty', value)}
                  >
                    <SelectTrigger id="difficulty" className="w-full">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Challenging">Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (days) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    {...register('duration', { valueAsNumber: true })}
                    min={1}
                  />
                  {errors.duration && (
                    <p className="text-sm text-red-600 mt-1">{errors.duration.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="maxGroupSize">Max Group Size</Label>
                  <Input
                    id="maxGroupSize"
                    type="number"
                    {...register('maxGroupSize', { valueAsNumber: true })}
                    min={1}
                    placeholder="15"
                  />
                  {errors.maxGroupSize && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.maxGroupSize.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tour Highlights</h3>
                <div className="flex gap-2">
                  <Input
                    id="highlightInput"
                    placeholder="Add a highlight..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        addToArray(highlights, setHighlights, input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById(
                        'highlightInput'
                      ) as HTMLInputElement;
                      addToArray(highlights, setHighlights, input.value);
                      input.value = '';
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {highlights.map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {highlight}
                      <button
                        type="button"
                        onClick={() => removeFromArray(highlights, setHighlights, index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Included */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">What's Included</h3>
                <div className="flex gap-2">
                  <Input
                    id="includedInput"
                    placeholder="Add included item..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        addToArray(included, setIncluded, input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById(
                        'includedInput'
                      ) as HTMLInputElement;
                      addToArray(included, setIncluded, input.value);
                      input.value = '';
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {included.map((item, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeFromArray(included, setIncluded, index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Excluded */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">What's NOT Included</h3>
                <div className="flex gap-2">
                  <Input
                    id="excludedInput"
                    placeholder="Add excluded item..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const input = e.currentTarget;
                        addToArray(excluded, setExcluded, input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const input = document.getElementById(
                        'excludedInput'
                      ) as HTMLInputElement;
                      addToArray(excluded, setExcluded, input.value);
                      input.value = '';
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {excluded.map((item, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeFromArray(excluded, setExcluded, index)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tour Images */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tour Images</h3>
                <MultiImageUploadField
                  label="Gallery Images"
                  value={images}
                  onChange={setImages}
                  folder="tours"
                  maxImages={10}
                  helpText="First image will be used as the main tour image. Drag and drop to reorder."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Description */}
        <TabsContent value="description">
          <Card className="border border-gray-300">
            <CardContent className="pt-6 space-y-6">
              {/* Short Description */}
              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  {...register('shortDescription')}
                  placeholder="Brief overview (max 500 characters)..."
                  rows={3}
                  maxLength={500}
                />
                {errors.shortDescription && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.shortDescription.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Appears in tour cards and search results
                </p>
              </div>

              {/* Full Description */}
              <div>
                <Label htmlFor="description">Full Description</Label>
                <RichTextEditor
                  value={watch('description') || ''}
                  onChange={(value) => setValue('description', value)}
                  placeholder="Detailed tour description..."
                  minHeight="300px"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Pricing & Status */}
        <TabsContent value="pricing">
          <Card className="border border-gray-300">
            <CardContent className="pt-6 space-y-6">
              {/* Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (USD) *</Label>
                    <Input
                      id="price"
                      type="number"
                      {...register('price', { valueAsNumber: true })}
                      min={0}
                      step={0.01}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="discountedPrice">Discounted Price (USD)</Label>
                    <Input
                      id="discountedPrice"
                      type="number"
                      {...register('discountedPrice', { valueAsNumber: true })}
                      min={0}
                      step={0.01}
                      placeholder="Optional"
                    />
                    {errors.discountedPrice && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.discountedPrice.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showPrice"
                    {...register('showPrice')}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="showPrice" className="font-normal cursor-pointer">
                    Show price on tour page
                  </Label>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      {...register('isActive')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isActive" className="font-normal cursor-pointer">
                      Active (visible to users)
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      {...register('isFeatured')}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isFeatured" className="font-normal cursor-pointer">
                      Featured (show on homepage)
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Departures */}
        <TabsContent value="departures">
          <Card className="border border-gray-300">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Tour Departures</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage scheduled departure dates and availability
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={addDeparture}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Departure
                </Button>
              </div>

              {departures.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-sm font-medium text-gray-900 mb-1">No departures scheduled</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Add departure dates to show availability on the tour page
                  </p>
                  <Button type="button" variant="outline" onClick={addDeparture}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Departure
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {departures.map((departure, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-white hover:border-gray-400 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              departure.status === 'available' ? 'default' :
                              departure.status === 'filling_fast' ? 'secondary' :
                              departure.status === 'almost_full' ? 'destructive' :
                              departure.status === 'sold_out' ? 'outline' : 'secondary'
                            }
                          >
                            {departure.status.replace('_', ' ')}
                          </Badge>
                          {departure.isGuaranteed && (
                            <Badge variant="outline" className="border-green-500 text-green-700">
                              Guaranteed
                            </Badge>
                          )}
                          {!departure.isActive && (
                            <Badge variant="outline" className="border-gray-400 text-gray-500">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDeparture(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <Label>Start Date *</Label>
                          <Input
                            type="date"
                            value={departure.startDate}
                            onChange={(e) => updateDeparture(index, 'startDate', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label>End Date *</Label>
                          <Input
                            type="date"
                            value={departure.endDate}
                            onChange={(e) => updateDeparture(index, 'endDate', e.target.value)}
                          />
                        </div>

                        <div>
                          <Label>Max Spots</Label>
                          <Input
                            type="number"
                            min={1}
                            value={departure.maxSpots}
                            onChange={(e) => updateDeparture(index, 'maxSpots', Number(e.target.value))}
                          />
                        </div>

                        <div>
                          <Label>Spots Remaining</Label>
                          <Input
                            type="number"
                            min={0}
                            max={departure.maxSpots}
                            value={departure.spotsRemaining}
                            onChange={(e) => updateDeparture(index, 'spotsRemaining', Number(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <Label>Status</Label>
                          <Select
                            value={departure.status}
                            onValueChange={(value) => updateDeparture(index, 'status', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="available">Available</SelectItem>
                              <SelectItem value="filling_fast">Filling Fast</SelectItem>
                              <SelectItem value="almost_full">Almost Full</SelectItem>
                              <SelectItem value="sold_out">Sold Out</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Price Modifier (%)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={departure.priceModifier || ''}
                            onChange={(e) => updateDeparture(index, 'priceModifier', e.target.value ? Number(e.target.value) : undefined)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            e.g., 10 for +10%, -15 for -15%
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 pt-6">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`guaranteed-${index}`}
                              checked={departure.isGuaranteed}
                              onChange={(e) => updateDeparture(index, 'isGuaranteed', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor={`guaranteed-${index}`} className="font-normal cursor-pointer text-sm">
                              Guaranteed Departure
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`active-${index}`}
                              checked={departure.isActive}
                              onChange={(e) => updateDeparture(index, 'isActive', e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <Label htmlFor={`active-${index}`} className="font-normal cursor-pointer text-sm">
                              Active (visible)
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: Group Pricing Tiers */}
        <TabsContent value="pricingTiers">
          <Card className="border border-gray-300">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Group Pricing Tiers</h3>
                  <p className="text-sm text-muted-foreground">
                    Set different prices based on group size
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={addPricingTier}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tier
                </Button>
              </div>

              {pricingTiers.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-sm font-medium text-gray-900 mb-1">No pricing tiers defined</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Add group-based pricing to offer discounts for larger groups
                  </p>
                  <Button type="button" variant="outline" onClick={addPricingTier}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Tier
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {pricingTiers.map((tier, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-white hover:border-gray-400 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline">Tier {index + 1}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePricingTier(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label>Min Guests *</Label>
                          <Input
                            type="number"
                            min={1}
                            value={tier.minGuests}
                            onChange={(e) => updatePricingTier(index, 'minGuests', Number(e.target.value))}
                          />
                        </div>

                        <div>
                          <Label>Max Guests *</Label>
                          <Input
                            type="number"
                            min={tier.minGuests}
                            value={tier.maxGuests}
                            onChange={(e) => updatePricingTier(index, 'maxGuests', Number(e.target.value))}
                          />
                        </div>

                        <div>
                          <Label>Price per Person (USD) *</Label>
                          <Input
                            type="number"
                            min={0}
                            step={0.01}
                            value={tier.pricePerPerson}
                            onChange={(e) => updatePricingTier(index, 'pricePerPerson', Number(e.target.value))}
                          />
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <Label className="mb-3 block">Labels (Translations)</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">English</Label>
                            <Input
                              placeholder="1-2 People"
                              value={tier.translations.find(t => t.locale === 'en')?.label || ''}
                              onChange={(e) => updatePricingTier(index, 'translation_en_label', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Russian</Label>
                            <Input
                              placeholder="1-2 человека"
                              value={tier.translations.find(t => t.locale === 'ru')?.label || ''}
                              onChange={(e) => updatePricingTier(index, 'translation_ru_label', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Uzbek</Label>
                            <Input
                              placeholder="1-2 kishi"
                              value={tier.translations.find(t => t.locale === 'uz')?.label || ''}
                              onChange={(e) => updatePricingTier(index, 'translation_uz_label', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 6: FAQs */}
        <TabsContent value="faqs">
          <Card className="border border-gray-300">
            <CardContent className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                  <p className="text-sm text-muted-foreground">
                    Add common questions and answers for this tour
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={addFAQ}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>

              {faqs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h4 className="text-sm font-medium text-gray-900 mb-1">No FAQs added</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Add frequently asked questions to help customers
                  </p>
                  <Button type="button" variant="outline" onClick={addFAQ}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First FAQ
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-white hover:border-gray-400 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline">FAQ #{index + 1}</Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFAQ(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* English */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">EN</Badge>
                          <span className="text-sm font-medium">English</span>
                        </div>
                        <div>
                          <Label className="text-xs">Question</Label>
                          <Input
                            placeholder="What should I pack for this tour?"
                            value={faq.translations.find(t => t.locale === 'en')?.question || ''}
                            onChange={(e) => updateFAQ(index, 'en', 'question', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Answer</Label>
                          <Textarea
                            placeholder="We recommend packing..."
                            rows={2}
                            value={faq.translations.find(t => t.locale === 'en')?.answer || ''}
                            onChange={(e) => updateFAQ(index, 'en', 'answer', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Russian */}
                      <div className="space-y-3 mb-4 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">RU</Badge>
                          <span className="text-sm font-medium">Russian</span>
                        </div>
                        <div>
                          <Label className="text-xs">Вопрос</Label>
                          <Input
                            placeholder="Что мне взять с собой?"
                            value={faq.translations.find(t => t.locale === 'ru')?.question || ''}
                            onChange={(e) => updateFAQ(index, 'ru', 'question', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Ответ</Label>
                          <Textarea
                            placeholder="Мы рекомендуем взять..."
                            rows={2}
                            value={faq.translations.find(t => t.locale === 'ru')?.answer || ''}
                            onChange={(e) => updateFAQ(index, 'ru', 'answer', e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Uzbek */}
                      <div className="space-y-3 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">UZ</Badge>
                          <span className="text-sm font-medium">Uzbek</span>
                        </div>
                        <div>
                          <Label className="text-xs">Savol</Label>
                          <Input
                            placeholder="Sayohat uchun nimalar olib ketishim kerak?"
                            value={faq.translations.find(t => t.locale === 'uz')?.question || ''}
                            onChange={(e) => updateFAQ(index, 'uz', 'question', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Javob</Label>
                          <Textarea
                            placeholder="Biz tavsiya qilamiz..."
                            rows={2}
                            value={faq.translations.find(t => t.locale === 'uz')?.answer || ''}
                            onChange={(e) => updateFAQ(index, 'uz', 'answer', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 7: SEO */}
        <TabsContent value="seo">
          <Card className="border border-gray-300">
            <CardContent className="pt-6 space-y-6">
              <h3 className="text-lg font-semibold">SEO Metadata</h3>

              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  {...register('metaTitle')}
                  placeholder="Leave empty to use tour title"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 50-60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  {...register('metaDescription')}
                  placeholder="Brief description for search engines..."
                  rows={3}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  {...register('metaKeywords')}
                  placeholder="uzbekistan, travel, tours, silk road"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Comma-separated keywords
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={submitting} size="lg">
          {submitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Tour
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
