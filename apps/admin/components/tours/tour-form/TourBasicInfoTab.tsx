'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { MultiImageUploadField } from '@/components/shared';
import type { TourBasicInfoTabProps } from './types';

// Array management helper
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

export function TourBasicInfoTab({
  register,
  errors,
  watch,
  setValue,
  categories,
  highlights,
  setHighlights,
  included,
  setIncluded,
  excluded,
  setExcluded,
  images,
  setImages,
  onTitleChange,
}: TourBasicInfoTabProps) {
  return (
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
                onChange={(e) => onTitleChange(e.target.value)}
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
  );
}
