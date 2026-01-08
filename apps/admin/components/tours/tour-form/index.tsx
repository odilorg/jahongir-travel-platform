'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Save, Calendar, Users, HelpCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// Import types and schema
import {
  tourSchema,
  type TourFormData,
  type TourFormProps,
  type Category,
  type TourDeparture,
  type PricingTier,
  type FAQItem,
} from './types';

// Import tab components
import { TourBasicInfoTab } from './TourBasicInfoTab';
import { TourDescriptionTab } from './TourDescriptionTab';
import { TourPricingTab } from './TourPricingTab';
import { TourDeparturesTab } from './TourDeparturesTab';
import { TourPricingTiersTab } from './TourPricingTiersTab';
import { TourFAQTab } from './TourFAQTab';
import { TourSEOTab } from './TourSEOTab';

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

  // Departures, Pricing Tiers, FAQs
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
      const data = await api.get<Category[]>('/categories');
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
    console.log('Submitting tour with categoryId:', formattedData.categoryId);
    console.log('Full form data:', formattedData);
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex w-full overflow-x-auto gap-1 md:grid md:grid-cols-7 pb-2">
          <TabsTrigger value="basic" className="whitespace-nowrap min-w-[100px] flex-shrink-0">Basic Info</TabsTrigger>
          <TabsTrigger value="description" className="whitespace-nowrap min-w-[100px] flex-shrink-0">Description</TabsTrigger>
          <TabsTrigger value="pricing" className="whitespace-nowrap min-w-[90px] flex-shrink-0">Pricing</TabsTrigger>
          <TabsTrigger value="departures" className="flex items-center gap-1 whitespace-nowrap min-w-[110px] flex-shrink-0">
            <Calendar className="h-3.5 w-3.5" />
            Departures
          </TabsTrigger>
          <TabsTrigger value="pricingTiers" className="flex items-center gap-1 whitespace-nowrap min-w-[120px] flex-shrink-0">
            <Users className="h-3.5 w-3.5" />
            Group Pricing
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-1 whitespace-nowrap min-w-[80px] flex-shrink-0">
            <HelpCircle className="h-3.5 w-3.5" />
            FAQs
          </TabsTrigger>
          <TabsTrigger value="seo" className="whitespace-nowrap min-w-[70px] flex-shrink-0">SEO</TabsTrigger>
        </TabsList>

        {/* Tab 1: Basic Info */}
        <TabsContent value="basic">
          <TourBasicInfoTab
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            categories={categories}
            highlights={highlights}
            setHighlights={setHighlights}
            included={included}
            setIncluded={setIncluded}
            excluded={excluded}
            setExcluded={setExcluded}
            images={images}
            setImages={setImages}
            onTitleChange={handleTitleChange}
          />
        </TabsContent>

        {/* Tab 2: Description */}
        <TabsContent value="description">
          <TourDescriptionTab
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />
        </TabsContent>

        {/* Tab 3: Pricing & Status */}
        <TabsContent value="pricing">
          <TourPricingTab
            register={register}
            errors={errors}
          />
        </TabsContent>

        {/* Tab 4: Departures */}
        <TabsContent value="departures">
          <TourDeparturesTab
            departures={departures}
            setDepartures={setDepartures}
            initialData={initialData}
          />
        </TabsContent>

        {/* Tab 5: Group Pricing Tiers */}
        <TabsContent value="pricingTiers">
          <TourPricingTiersTab
            pricingTiers={pricingTiers}
            setPricingTiers={setPricingTiers}
            initialData={initialData}
          />
        </TabsContent>

        {/* Tab 6: FAQs */}
        <TabsContent value="faqs">
          <TourFAQTab
            faqs={faqs}
            setFaqs={setFaqs}
          />
        </TabsContent>

        {/* Tab 7: SEO */}
        <TabsContent value="seo">
          <TourSEOTab register={register} />
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

// Re-export types for external use
export * from './types';
