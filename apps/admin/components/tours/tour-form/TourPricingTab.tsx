'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { TourPricingTabProps } from './types';

export function TourPricingTab({ register, errors }: TourPricingTabProps) {
  return (
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
  );
}
