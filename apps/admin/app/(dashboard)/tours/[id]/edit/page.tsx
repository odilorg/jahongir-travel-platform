'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { TourForm } from '@/components/tours/TourForm';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Tour {
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

export default function EditTourPage() {
  const params = useParams<{ id: string }>();
  const paramId = params.id;
  const router = useRouter();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tourId, setTourId] = useState<string>(''); // Store actual ID for updates

  useEffect(() => {
    fetchTour();
  }, [paramId]);

  const fetchTour = async () => {
    setLoading(true);
    try {
      // paramId contains tour ID from URL, use /api/tours/id/:id endpoint
      const data = await api.get<Tour>(`/api/tours/id/${paramId}`);

      // Store the actual ID for PATCH requests
      setTourId(data.id);

      // Transform null values to proper defaults for form
      const transformedData = {
        ...data,
        highlights: data.highlights || [],
        included: data.included || [],
        excluded: data.excluded || [],
        images: data.images || [],
        price: data.price || '0',
        discountedPrice: data.discountedPrice || '0',
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
      await api.patch(`/api/tours/${tourId}`, data);
      toast.success('Tour updated successfully!', {
        description: 'Redirecting to tours list...',
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

      {/* Form */}
      <TourForm initialData={tour} onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
