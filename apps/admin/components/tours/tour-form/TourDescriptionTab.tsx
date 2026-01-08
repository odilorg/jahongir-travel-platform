'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RichTextEditor } from '@/components/shared';
import type { TourDescriptionTabProps } from './types';

export function TourDescriptionTab({
  register,
  errors,
  watch,
  setValue,
}: TourDescriptionTabProps) {
  return (
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
  );
}
