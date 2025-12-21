'use client';

import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '@/context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-4 py-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Jahongir Travel Platform
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Welcome back, {user?.name || 'Admin'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
