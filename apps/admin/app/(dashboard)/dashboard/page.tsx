'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Folder, Star, Mail, TrendingUp, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface DashboardStats {
  totalTours: number;
  totalCategories: number;
  pendingReviews: number;
  unreadInquiries: number;
  totalUsers: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTours: 0,
    totalCategories: 0,
    pendingReviews: 0,
    unreadInquiries: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch all stats in parallel with error handling for each
      const [toursResponse, categories, reviewsResponse, contactsResponse, usersResponse] = await Promise.all([
        api.get<{ data: any[] }>('/tours').catch(() => ({ data: [] })),
        api.get<any[]>('/categories').catch(() => []),
        api.get<{ data: any[] }>('/reviews?status=PENDING').catch(() => ({ data: [] })),
        api.get<{ data: any[] }>('/contact?status=NEW').catch(() => ({ data: [] })),
        api.get<{ data: any[] }>('/users').catch(() => ({ data: [] })),
      ]);

      setStats({
        totalTours: toursResponse.data?.length || 0,
        totalCategories: categories?.length || 0,
        pendingReviews: reviewsResponse.data?.length || 0,
        unreadInquiries: contactsResponse.data?.length || 0,
        totalUsers: usersResponse.data?.length || 0,
      });
    } catch (error: any) {
      toast.error('Failed to load dashboard stats');
      console.error('Dashboard stats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: 'Total Tours',
      value: stats.totalTours,
      icon: Plane,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      href: '/tours',
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: Folder,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      href: '/categories',
    },
    {
      title: 'Pending Reviews',
      value: stats.pendingReviews,
      icon: Star,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      href: '/reviews',
    },
    {
      title: 'New Inquiries',
      value: stats.unreadInquiries,
      icon: Mail,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      href: '/contact',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      href: '/users',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={fetchDashboardStats}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          Refresh Stats
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => (window.location.href = stat.href)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            onClick={() => (window.location.href = '/tours/new')}
            className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
          >
            <Plane className="h-5 w-5 text-blue-600 mb-2" />
            <div className="font-medium text-gray-900">Create New Tour</div>
            <div className="text-sm text-muted-foreground">
              Add a new tour package
            </div>
          </button>

          <button
            onClick={() => (window.location.href = '/categories')}
            className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all"
          >
            <Folder className="h-5 w-5 text-green-600 mb-2" />
            <div className="font-medium text-gray-900">Manage Categories</div>
            <div className="text-sm text-muted-foreground">
              Organize tour categories
            </div>
          </button>

          <button
            onClick={() => (window.location.href = '/reviews')}
            className="p-4 text-left bg-white border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all"
          >
            <Star className="h-5 w-5 text-yellow-600 mb-2" />
            <div className="font-medium text-gray-900">Review Moderation</div>
            <div className="text-sm text-muted-foreground">
              Approve or reject reviews
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
