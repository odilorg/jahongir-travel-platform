'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { TourSEOTabProps } from './types';

export function TourSEOTab({ register }: TourSEOTabProps) {
  return (
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
  );
}
