'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { BlogForm } from '@/components/blog/BlogForm';
import { TranslationTabs } from '@/components/translations/TranslationTabs';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
}

export default function EditBlogPostPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const data = await api.get<BlogPost>(`/blog/id/${id}`);
      setPost(data);
    } catch (error: any) {
      toast.error('Failed to load blog post');
      console.error('Fetch post error:', error);
      router.push('/blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await api.patch(`/blog/${id}`, data);
      toast.success('Blog post updated successfully!', {
        description: 'Redirecting to blog list...',
        duration: 2000,
      });
      setTimeout(() => {
        router.push('/blog');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update post');
      console.error('Update post error:', error);
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

  if (!post) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/blog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground mt-1">{post.title}</p>
        </div>
      </div>

      {/* Form */}
      <BlogForm initialData={post} onSubmit={handleSubmit} submitting={submitting} />

      {/* Translations */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Translations</h2>
        <p className="text-muted-foreground">
          Manage translations for this blog post in different languages
        </p>
        <TranslationTabs
          entityType="blog"
          entityId={id}
          fields={[
            { name: 'title', label: 'Title', type: 'text', required: true, placeholder: 'Blog post title' },
            { name: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'blog-post-slug' },
            { name: 'excerpt', label: 'Excerpt', type: 'textarea', required: true, placeholder: 'Brief excerpt' },
            { name: 'content', label: 'Content', type: 'richtext', required: true, placeholder: 'Full blog post content' },
            { name: 'metaTitle', label: 'Meta Title', type: 'text', placeholder: 'SEO title' },
            { name: 'metaDescription', label: 'Meta Description', type: 'textarea', placeholder: 'SEO description' },
            { name: 'metaKeywords', label: 'Meta Keywords', type: 'text', placeholder: 'SEO keywords (comma-separated)' },
          ]}
          onSaveSuccess={fetchPost}
        />
      </div>
    </div>
  );
}
