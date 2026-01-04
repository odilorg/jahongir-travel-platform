'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function TourDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  useEffect(() => {
    // Redirect to edit page
    router.replace(`/tours/${params.id}/edit`);
  }, [params.id, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
