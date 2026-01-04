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
import { Save, Plus, X } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { RichTextEditor, MultiImageUploadField } from '@/components/shared';

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
    };
    await onSubmit(formattedData);
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Status</TabsTrigger>
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

        {/* Tab 4: SEO */}
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
