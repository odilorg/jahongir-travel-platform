'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plane,
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  Users,
  Eye,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/shared';

interface Tour {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  duration: number;
  maxGroupSize: number;
  price: string;
  difficulty: string;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ToursPage() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tourToDelete, setTourToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [toursResponse, categoriesData] = await Promise.all([
        api.get<{ data: Tour[] }>('/tours'),
        api.get<Category[]>('/categories'),
      ]);

      setTours(toursResponse.data);
      setCategories(categoriesData);
    } catch (error: any) {
      toast.error('Failed to load tours');
      console.error('Tours fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setTourToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!tourToDelete) return;

    setDeleting(true);
    try {
      await api.delete(`/api/tours/${tourToDelete}`);
      toast.success('Tour deleted successfully');
      setDeleteDialogOpen(false);
      setTourToDelete(null);
      fetchData();
    } catch (error: any) {
      toast.error('Failed to delete tour');
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Filter tours based on search and filters
  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || tour.categoryId === selectedCategory;

    const matchesStatus = selectedStatus === 'all' || (tour.isActive ? 'PUBLISHED' : 'DRAFT') === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800';
      case 'ARCHIVED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tours</h1>
          <p className="text-muted-foreground mt-1">Manage tour packages and itineraries</p>
        </div>
        <Button asChild>
          <Link href="/tours/new">
            <Plus className="h-4 w-4 mr-2" />
            Create Tour
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-gray-300 shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tours List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="pt-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTours.length === 0 ? (
        <Card className="border border-gray-300 shadow-sm">
          <CardContent className="py-12 text-center">
            <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tours found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first tour to get started'}
            </p>
            <Button asChild>
              <Link href="/tours/new">
                <Plus className="h-4 w-4 mr-2" />
                Create Tour
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <Card key={tour.id} className="border border-gray-300 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Tour Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {tour.images && tour.images.length > 0 ? (
                  <img
                    src={tour.images[0]}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Plane className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {tour.isFeatured && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500 text-white">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Tour Info */}
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg leading-tight line-clamp-2 text-gray-900">{tour.title}</h3>
                    {tour.category && (
                      <p className="text-xs text-muted-foreground font-medium mt-1 uppercase tracking-wide">{tour.category.name}</p>
                    )}
                  </div>
                  <Badge className={getStatusColor(tour.isActive ? 'PUBLISHED' : 'DRAFT')}>
                    {tour.isActive ? 'PUBLISHED' : 'DRAFT'}
                  </Badge>
                </div>

                {/* Tour Details */}
                <div className="grid grid-cols-2 gap-3 mt-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Duration</p>
                      <p className="text-sm font-semibold text-gray-900">{tour.duration}d</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-50 rounded-lg">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Guests</p>
                      <p className="text-sm font-semibold text-gray-900">Max {tour.maxGroupSize}</p>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <div className="p-1.5 bg-amber-50 rounded-lg">
                      <DollarSign className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Price</p>
                      <p className="text-lg font-bold text-gray-900">${tour.price}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-5 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-0 hover:bg-gray-100 transition-colors"
                    asChild
                  >
                    <a
                      href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://62.72.22.205:3010'}/en/tours/${tour.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      View
                      <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-0 hover:bg-gray-100 transition-colors"
                    onClick={() => router.push(`/tours/${tour.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="border-0 hover:bg-red-600 transition-colors"
                    onClick={() => openDeleteDialog(tour.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results Count */}
      {!loading && filteredTours.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          Showing {filteredTours.length} of {tours.length} tours
        </p>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Tour"
        description="Are you sure you want to delete this tour? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        variant="destructive"
        loading={deleting}
      />
    </div>
  );
}
