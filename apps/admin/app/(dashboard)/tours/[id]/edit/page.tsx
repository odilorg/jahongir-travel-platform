'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import { TourForm } from '@/components/tours/TourForm';
import { TranslationTabs } from '@/components/translations/TranslationTabs';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// Raw API response type
interface TourApiResponse {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  duration: number;
  maxGroupSize: number | null;
  price: string | null;
  difficulty: string | null;
  isActive: boolean;
  isFeatured: boolean;
  shortDescription: string | null;
  description: string | null;
  highlights: string[] | null;
  included: string[] | null;
  excluded: string[] | null;
  images: string[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  showPrice: boolean;
  discountedPrice: string | null;
  createdAt: string;
  updatedAt: string;
}

// Transformed type for form (with numbers instead of strings for prices)
interface Tour {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  duration: number;
  maxGroupSize: number;
  price: number;
  difficulty: string;
  isActive: boolean;
  isFeatured: boolean;
  shortDescription: string | null;
  description: string | null;
  highlights: string[];
  included: string[];
  excluded: string[];
  images: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  showPrice: boolean;
  discountedPrice: number;
  createdAt: string;
  updatedAt: string;
}

export default function EditTourPage() {
  const params = useParams<{ id: string }>();
  const paramId = params.id;
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tourId, setTourId] = useState<string>(''); // Store actual ID for updates
  const [refreshingCache, setRefreshingCache] = useState(false);

  useEffect(() => {
    fetchTour();
  }, [paramId]);

  const fetchTour = async () => {
    setLoading(true);
    try {
      // paramId contains tour ID from URL, use /tours/id/:id endpoint
      const data = await api.get<TourApiResponse>(`/tours/id/${paramId}`);

      // Store the actual ID for PATCH requests
      setTourId(data.id);

      // Transform null values to proper defaults for form
      const transformedData: Tour = {
        ...data,
        highlights: data.highlights || [],
        included: data.included || [],
        excluded: data.excluded || [],
        images: data.images || [],
        // Convert price strings to numbers for Zod validation
        price: data.price ? parseFloat(data.price) : 0,
        discountedPrice: data.discountedPrice ? parseFloat(data.discountedPrice) : 0,
        maxGroupSize: data.maxGroupSize || 15,
        difficulty: data.difficulty || '',
      };

      setTour(transformedData);
    } catch (error: any) {
      toast.error('Failed to load tour');
      console.error('Fetch tour error:', error);
      router.push('/tours');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      // Use the stored tourId (actual ID) for PATCH, not the slug
      await api.patch(`/tours/${tourId}`, data);

      // Auto-refresh cache after successful update
      await refreshCache(false); // Silent refresh

      toast.success('Tour updated successfully!', {
        description: 'Changes are now live on the website',
        duration: 2000,
      });
      // Small delay to let user see the success toast
      setTimeout(() => {
        router.push('/tours');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update tour');
      console.error('Update tour error:', error);
      setSubmitting(false);
    }
  };

  const refreshCache = async (showToast = true) => {
    setRefreshingCache(true);
    try {
      // Get the tour slug for cache invalidation
      const slug = tour?.slug;

      // Call the web app's revalidation API
      const webAppUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000';
      const revalidateSecret = process.env.NEXT_PUBLIC_REVALIDATE_SECRET || 'jahongir-travel-revalidate-2024';

      const response = await fetch(`${webAppUrl}/api/revalidate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: revalidateSecret,
          type: 'tour',
          slug: slug,
        }),
      });

      const result = await response.json();

      if (result.success) {
        if (showToast) {
          toast.success('Cache refreshed!', {
            description: 'Website now shows the latest changes',
            duration: 3000,
          });
        }
      } else {
        throw new Error(result.message || 'Cache refresh failed');
      }
    } catch (error: any) {
      console.error('Cache refresh error:', error);
      if (showToast) {
        toast.error('Cache refresh failed', {
          description: 'Changes may take up to 60 seconds to appear',
        });
      }
    } finally {
      setRefreshingCache(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!tour) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/tours">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Tour</h1>
            <p className="text-muted-foreground mt-1">{tour.title}</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => refreshCache(true)}
          disabled={refreshingCache}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshingCache ? 'animate-spin' : ''}`} />
          {refreshingCache ? 'Refreshing...' : 'Refresh Website Cache'}
        </Button>
      </div>

      {/* Form */}
      <TourForm initialData={tour} onSubmit={handleSubmit} submitting={submitting} />

      {/* Translations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Translations</h2>
        <p className="text-muted-foreground">
          Manage translations for this tour in different languages
        </p>
        <TranslationTabs
          entityType="tours"
          entityId={tourId}
          fields={[
            { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Tour title' },
            { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'tour-slug' },
            { name: 'summary', label: 'Summary', type: 'textarea', placeholder: 'Brief tour summary' },
            { name: 'description', label: 'Description', type: 'richtext', placeholder: 'Full tour description' },
            { name: 'highlights', label: 'Highlight', type: 'array', placeholder: 'Tour highlight' },
            { name: 'included', label: 'Included Item', type: 'array', placeholder: 'What\'s included' },
            { name: 'excluded', label: 'Excluded Item', type: 'array', placeholder: 'What\'s excluded' },
            { name: 'metaTitle', label: 'Meta Title', type: 'text', placeholder: 'SEO title' },
            { name: 'metaDescription', label: 'Meta Description', type: 'textarea', placeholder: 'SEO description' },
          ]}
          onSaveSuccess={fetchTour}
        />
      </div>
    </div>
  );
}
