'use client';

import { useState } from 'react';
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
import { Save } from 'lucide-react';
import { RichTextEditor, ImageUploadField } from '@/components/shared';

// Schema matching backend CreatePostDto
const blogSchema = z.object({
  // Basic Info
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(250),

  // Content
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, 'Content is required'),

  // Author (will be set from current user)
  authorId: z.string().optional(),

  // Publishing
  status: z.enum(['draft', 'published']).optional(),
  featuredImage: z.string().optional(),

  // SEO (optional, if backend supports)
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  submitting: boolean;
  currentUserId?: string; // Current logged-in user ID
}

export function BlogForm({
  initialData,
  onSubmit,
  submitting,
  currentUserId
}: BlogFormProps) {
  const [content, setContent] = useState<string>(initialData?.content || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      authorId: currentUserId || '',
      status: 'draft',
      featuredImage: '',
      metaTitle: '',
      metaDescription: '',
      metaKeywords: '',
    },
  });

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    setValue('title', title);

    // Generate slug if creating new post (not editing)
    if (!initialData?.id) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setValue('slug', slug);
    }
  };

  const handleFormSubmit = async (data: BlogFormData) => {
    // Ensure content is included
    const submitData = {
      ...data,
      content,
      authorId: currentUserId || data.authorId,
    };

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Complete Guide to Samarkand"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...register('slug')}
                placeholder="complete-guide-to-samarkand"
              />
              {errors.slug && (
                <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">
                URL-friendly identifier (auto-generated from title)
              </p>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              {...register('excerpt')}
              placeholder="Brief summary shown in post listings (max 500 characters)..."
              rows={3}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Brief summary shown in listings and search results
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="pt-6">
          <div>
            <Label htmlFor="content">Content *</Label>
            <RichTextEditor
              value={content}
              onChange={(value) => {
                setContent(value);
                setValue('content', value);
              }}
              placeholder="Write your blog post content here..."
              minHeight="400px"
            />
            {errors.content && (
              <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Publishing & Featured Image */}
      <Card>
        <CardContent className="pt-6">
          <div>
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={watch('status') || 'draft'}
                onValueChange={(value: 'draft' | 'published') => setValue('status', value)}
              >
                <SelectTrigger id="status" className="w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Draft posts are not visible to public
              </p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mt-4">
            <ImageUploadField
              label="Featured Image"
              value={watch('featuredImage') || ''}
              onChange={(url) => setValue('featuredImage', url)}
              folder="blog"
              placeholder="https://example.com/images/samarkand.jpg"
              helpText="Main image shown in post listings and social media shares"
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO (Optional) */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold text-lg">SEO Settings (Optional)</h3>

          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              {...register('metaTitle')}
              placeholder="Complete Guide to Samarkand | Jahongir Travel"
              maxLength={60}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Page title for search engines (max 60 characters)
            </p>
          </div>

          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              {...register('metaDescription')}
              placeholder="Discover the ancient city of Samarkand with our comprehensive travel guide..."
              rows={2}
              maxLength={160}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Description for search results (max 160 characters)
            </p>
          </div>

          <div>
            <Label htmlFor="metaKeywords">Meta Keywords</Label>
            <Input
              id="metaKeywords"
              {...register('metaKeywords')}
              placeholder="samarkand, uzbekistan, travel, tourism, registan"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Comma-separated keywords for SEO
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {initialData ? 'Update Post' : 'Create Post'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
