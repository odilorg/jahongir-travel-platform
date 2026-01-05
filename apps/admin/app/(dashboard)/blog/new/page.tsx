'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { BlogForm } from '@/components/blog/BlogForm';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await api.get<{ id: string }>('/auth/profile');
      setCurrentUserId(user.id);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      toast.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await api.post('/blog', data);
      toast.success('Blog post created successfully!', {
        description: 'Redirecting to blog list...',
        duration: 2000,
      });
      setTimeout(() => {
        router.push('/blog');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
      console.error('Create post error:', error);
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
          <h1 className="text-3xl font-bold">Create Blog Post</h1>
          <p className="text-muted-foreground mt-1">Write a new article for your blog</p>
        </div>
      </div>

      {/* Form */}
      <BlogForm 
        onSubmit={handleSubmit} 
        submitting={submitting} 
        currentUserId={currentUserId}
      />
    </div>
  );
}
