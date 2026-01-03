'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const hasShownExpiredMessage = useRef(false);

  useEffect(() => {
    if (!loading && !user) {
      // Check if there was a token (meaning it expired) vs never logged in
      const hadToken = typeof window !== 'undefined' && localStorage.getItem('token');

      if (hadToken && !hasShownExpiredMessage.current) {
        // Clear the expired token
        localStorage.removeItem('token');

        // Show expiration message
        toast.error('Your session has expired. Please login again.');
        hasShownExpiredMessage.current = true;
      }

      // Redirect to login
      setTimeout(() => {
        window.location.href = '/login';
      }, 100); // Small delay to show toast
    }
  }, [user, loading]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}
