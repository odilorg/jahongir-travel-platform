'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TourForm } from '@/components/tours/TourForm';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function NewTourPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      const newTour = await api.post('/tours', data);
      toast.success('Tour created successfully!', {
        description: 'Redirecting to tours list...',
        duration: 2000,
      });
      // Small delay to let user see the success toast
      setTimeout(() => {
        router.push('/tours');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create tour');
      console.error('Create tour error:', error);
      setSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Create New Tour</h1>
          <p className="text-muted-foreground mt-1">Add a new tour package to your catalog</p>
        </div>
      </div>

      {/* Form */}
      <TourForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  );
}
