'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  CalendarDays,
  List,
  LayoutGrid,
  Users,
  DollarSign,
  Clock,
  Check,
  X,
  Eye,
  CreditCard,
  Plane,
  User,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  Save,
  MapPin,
  Car,
  Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { BookingCalendar } from '@/components/BookingCalendar';
import { BookingGrid } from '@/components/BookingGrid';
import { ConfirmDialog } from '@/components/shared';

interface Guest {
  id: string;
  name: string;
  email: string;
  totalBookings: number;
}

interface Tour {
  id: string;
  title: string;
  slug: string;
}

interface Booking {
  id: string;
  tourId: string;
  tour: Tour;
  guest?: Guest;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  travelDate: string;
  numberOfPeople: number;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  specialRequests?: string;
  notes?: string;
  createdAt: string;
}

interface BookingsResponse {
  data: Booking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  totalRevenue: number;
}

interface Guide {
  id: string;
  name: string;
  phone?: string;
  languages: string[];
  isActive: boolean;
}

interface Driver {
  id: string;
  name: string;
  phone?: string;
  vehicleInfo?: string;
  isActive: boolean;
}

interface BookingStaff {
  guides: { guide: Guide; role?: string }[];
  drivers: { driver: Driver }[];
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]); // For calendar view
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<BookingsResponse['meta'] | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'grid'>('list');

  // Edit & Delete state
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editForm, setEditForm] = useState({ travelDate: '', numberOfPeople: 1, specialRequests: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Staff assignment state
  const [guides, setGuides] = useState<Guide[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [originalGuides, setOriginalGuides] = useState<string[]>([]);
  const [originalDrivers, setOriginalDrivers] = useState<string[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);

  useEffect(() => {
    fetchBookings();
    fetchStats();
  }, [page, activeTab]);

  // Fetch all bookings for calendar/grid view
  useEffect(() => {
    if (viewMode === 'calendar' || viewMode === 'grid') {
      fetchAllBookings();
    }
  }, [viewMode]);

  const fetchAllBookings = async () => {
    try {
      // Fetch more bookings for calendar (last 3 months + next 3 months)
      const response = await api.get<BookingsResponse>('/api/bookings?limit=500');
      setAllBookings(response.data);
    } catch (error: any) {
      console.error('All bookings fetch error:', error);
    }
  };

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const status = activeTab === 'all' ? undefined : activeTab;
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      if (status) params.set('status', status);

      const response = await api.get<BookingsResponse>(`/api/bookings?${params.toString()}`);
      setBookings(response.data);
      setMeta(response.meta);
    } catch (error: any) {
      toast.error('Failed to load bookings');
      console.error('Bookings fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.get<Stats>('/api/bookings/stats');
      setStats(data);
    } catch (error: any) {
      console.error('Stats fetch error:', error);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/api/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}`);
      fetchBookings();
      fetchStats();
    } catch (error: any) {
      toast.error('Failed to update booking status');
    }
  };

  const updatePayment = async (id: string, paymentStatus: string) => {
    try {
      await api.patch(`/api/bookings/${id}/payment`, { paymentStatus });
      toast.success(`Payment status updated to ${paymentStatus}`);
      fetchBookings();
    } catch (error: any) {
      toast.error('Failed to update payment status');
    }
  };

  const updateBooking = async (id: string, data: { travelDate?: string; numberOfPeople?: number; specialRequests?: string }) => {
    try {
      await api.patch(`/api/bookings/${id}`, data);
      toast.success('Booking updated successfully');
      fetchBookings();
      fetchStats();
    } catch (error: any) {
      toast.error('Failed to update booking');
    }
  };

  const deleteBooking = async () => {
    if (!bookingToDelete) return;
    setDeleting(true);
    try {
      await api.delete(`/api/bookings/${bookingToDelete}`);
      toast.success('Booking deleted successfully');
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
      fetchBookings();
      fetchStats();
      if (viewMode === 'calendar' || viewMode === 'grid') {
        fetchAllBookings();
      }
    } catch (error: any) {
      toast.error('Failed to delete booking');
    } finally {
      setDeleting(false);
    }
  };

  const openEditModal = async (booking: Booking) => {
    setEditingBooking(booking);
    setEditForm({
      travelDate: booking.travelDate.split('T')[0],
      numberOfPeople: booking.numberOfPeople,
      specialRequests: booking.specialRequests || '',
      notes: booking.notes || '',
    });

    // Fetch staff data
    setLoadingStaff(true);
    try {
      const [guidesRes, driversRes, staffRes] = await Promise.all([
        api.get<{ data: Guide[] }>('/api/guides?isActive=true&limit=100'),
        api.get<{ data: Driver[] }>('/api/drivers?isActive=true&limit=100'),
        api.get<BookingStaff & { id: string }>(`/api/bookings/${booking.id}/staff`),
      ]);

      setGuides(guidesRes.data || []);
      setDrivers(driversRes.data || []);

      // Set current assignments
      const currentGuideIds = (staffRes.guides || []).map((g: any) => g.guide.id);
      const currentDriverIds = (staffRes.drivers || []).map((d: any) => d.driver.id);

      setSelectedGuides(currentGuideIds);
      setSelectedDrivers(currentDriverIds);
      setOriginalGuides(currentGuideIds);
      setOriginalDrivers(currentDriverIds);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoadingStaff(false);
    }
  };

  const toggleGuide = (guideId: string) => {
    setSelectedGuides((prev) =>
      prev.includes(guideId)
        ? prev.filter((id) => id !== guideId)
        : [...prev, guideId]
    );
  };

  const toggleDriver = (driverId: string) => {
    setSelectedDrivers((prev) =>
      prev.includes(driverId)
        ? prev.filter((id) => id !== driverId)
        : [...prev, driverId]
    );
  };

  const handleEditSave = async () => {
    if (!editingBooking) return;
    setSaving(true);
    try {
      // Update booking details
      await api.patch(`/api/bookings/${editingBooking.id}`, {
        travelDate: editForm.travelDate,
        numberOfPeople: editForm.numberOfPeople,
        specialRequests: editForm.specialRequests,
        notes: editForm.notes,
      });

      // Handle guide assignments
      const guidesToAdd = selectedGuides.filter((id) => !originalGuides.includes(id));
      const guidesToRemove = originalGuides.filter((id) => !selectedGuides.includes(id));

      for (const guideId of guidesToAdd) {
        await api.post(`/api/bookings/${editingBooking.id}/guides`, { guideId });
      }
      for (const guideId of guidesToRemove) {
        await api.delete(`/api/bookings/${editingBooking.id}/guides/${guideId}`);
      }

      // Handle driver assignments
      const driversToAdd = selectedDrivers.filter((id) => !originalDrivers.includes(id));
      const driversToRemove = originalDrivers.filter((id) => !selectedDrivers.includes(id));

      for (const driverId of driversToAdd) {
        await api.post(`/api/bookings/${editingBooking.id}/drivers`, { driverId });
      }
      for (const driverId of driversToRemove) {
        await api.delete(`/api/bookings/${editingBooking.id}/drivers/${driverId}`);
      }

      toast.success('Booking updated successfully', {
        description: 'Changes and staff assignments have been saved.',
      });
      setEditingBooking(null);
      fetchBookings();
      if (viewMode === 'calendar' || viewMode === 'grid') {
        fetchAllBookings();
      }
    } catch (error: any) {
      toast.error('Failed to update booking');
    } finally {
      setSaving(false);
    }
  };

  const openDeleteDialog = (id: string) => {
    setBookingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'unpaid':
        return <Badge variant="outline" className="border-red-300 text-red-600">Unpaid</Badge>;
      case 'partial':
        return <Badge variant="outline" className="border-yellow-300 text-yellow-600">Partial</Badge>;
      case 'paid':
        return <Badge variant="outline" className="border-green-300 text-green-600">Paid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          {/* Left side - Customer & Tour info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{booking.customerName}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{booking.customerEmail}</span>
                </div>
                {booking.customerPhone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{booking.customerPhone}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {getStatusBadge(booking.status)}
                {getPaymentBadge(booking.paymentStatus)}
              </div>
            </div>

            {/* Guest badge if repeat customer */}
            {booking.guest && booking.guest.totalBookings > 1 && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                <User className="h-3 w-3" />
                Repeat customer ({booking.guest.totalBookings} bookings)
              </div>
            )}

            {/* Tour info */}
            <div className="flex items-center gap-2 text-sm">
              <Plane className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{booking.tour.title}</span>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(booking.travelDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{booking.numberOfPeople} people</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-semibold text-gray-900">{formatPrice(booking.totalPrice)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Booked {formatDate(booking.createdAt)}</span>
              </div>
            </div>

            {booking.specialRequests && (
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                <strong>Notes:</strong> {booking.specialRequests}
              </p>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex flex-col gap-2 lg:w-40">
            {booking.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => updateStatus(booking.id, 'confirmed')}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => updateStatus(booking.id, 'cancelled')}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            )}

            {booking.status === 'confirmed' && booking.paymentStatus !== 'paid' && (
              <Button
                size="sm"
                variant="outline"
                className="text-green-600 border-green-300 hover:bg-green-50"
                onClick={() => updatePayment(booking.id, 'paid')}
              >
                <CreditCard className="h-4 w-4 mr-1" />
                Mark Paid
              </Button>
            )}

            {booking.status === 'cancelled' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatus(booking.id, 'pending')}
              >
                Restore
              </Button>
            )}

            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedBooking(booking)}
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => openEditModal(booking)}
                title="Edit Booking"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => openDeleteDialog(booking.id)}
                title="Delete Booking"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-muted-foreground mt-1">Manage tour bookings and reservations</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Create Booking Button */}
          <Button asChild>
            <Link href="/bookings/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Booking
            </Link>
          </Button>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="gap-1"
          >
            <List className="h-4 w-4" />
            List
          </Button>
          <Button
            variant={viewMode === 'calendar' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('calendar')}
            className="gap-1"
          >
            <CalendarDays className="h-4 w-4" />
            Calendar
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="gap-1"
          >
            <LayoutGrid className="h-4 w-4" />
            Grid
          </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Bookings</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
              <div className="text-sm text-muted-foreground">Confirmed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{formatPrice(Number(stats.totalRevenue))}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <BookingCalendar
          bookings={allBookings.length > 0 ? allBookings : bookings}
          onBookingClick={(booking) => setSelectedBooking(booking as Booking)}
        />
      )}

      {/* Grid View (Hotel-style) */}
      {viewMode === 'grid' && (
        <BookingGrid
          bookings={allBookings.length > 0 ? allBookings : bookings}
          onUpdateStatus={async (id, status) => {
            await updateStatus(id, status);
            await fetchAllBookings();
          }}
          onUpdatePayment={async (id, paymentStatus) => {
            await updatePayment(id, paymentStatus);
            await fetchAllBookings();
          }}
          onUpdateBooking={async (id, data) => {
            await updateBooking(id, data);
            await fetchAllBookings();
          }}
        />
      )}

      {/* List View - Tabs */}
      {viewMode === 'list' && (
        <Tabs value={activeTab} onValueChange={(val) => { setActiveTab(val); setPage(1); }}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {stats && stats.pending > 0 && (
                <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">
                  {stats.pending}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-4">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-24 bg-gray-200 rounded" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                  <p className="text-muted-foreground">
                    {activeTab === 'all'
                      ? 'No bookings have been made yet'
                      : `No ${activeTab} bookings`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {bookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, meta.total)} of {meta.total} bookings
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!meta.hasPrev}
                        onClick={() => setPage(page - 1)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!meta.hasNext}
                        onClick={() => setPage(page + 1)}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedBooking(null)}>
          <Card className="w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Booking Details</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Customer</h3>
                  <p className="font-medium">{selectedBooking.customerName}</p>
                  <p className="text-sm">{selectedBooking.customerEmail}</p>
                  {selectedBooking.customerPhone && <p className="text-sm">{selectedBooking.customerPhone}</p>}
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Tour</h3>
                  <p className="font-medium">{selectedBooking.tour.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Travel Date</h3>
                    <p>{formatDate(selectedBooking.travelDate)}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Group Size</h3>
                    <p>{selectedBooking.numberOfPeople} people</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
                    {getStatusBadge(selectedBooking.status)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Payment</h3>
                    {getPaymentBadge(selectedBooking.paymentStatus)}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground">Total Price</h3>
                  <p className="text-xl font-bold text-green-600">{formatPrice(selectedBooking.totalPrice)}</p>
                </div>

                {selectedBooking.specialRequests && (
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Special Requests</h3>
                    <p className="text-sm bg-gray-50 p-2 rounded">{selectedBooking.specialRequests}</p>
                  </div>
                )}

                {selectedBooking.guest && (
                  <div className="pt-4 border-t">
                    <h3 className="font-semibold text-sm text-muted-foreground mb-2">Guest Profile</h3>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{selectedBooking.guest.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedBooking.guest.totalBookings} total bookings
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Booking Modal */}
      {editingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-8" onClick={() => setEditingBooking(null)}>
          <Card className="w-full max-w-2xl mx-4" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">Edit Booking</h2>
                  <p className="text-sm text-muted-foreground mt-1">{editingBooking.customerName} - {editingBooking.tour.title}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setEditingBooking(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="editTravelDate">Travel Date</Label>
                    <Input
                      id="editTravelDate"
                      type="date"
                      value={editForm.travelDate}
                      onChange={(e) => setEditForm({ ...editForm, travelDate: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="editNumberOfPeople">Number of People</Label>
                    <Input
                      id="editNumberOfPeople"
                      type="number"
                      min={1}
                      value={editForm.numberOfPeople}
                      onChange={(e) => setEditForm({ ...editForm, numberOfPeople: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="editSpecialRequests">Special Requests</Label>
                  <Textarea
                    id="editSpecialRequests"
                    value={editForm.specialRequests}
                    onChange={(e) => setEditForm({ ...editForm, specialRequests: e.target.value })}
                    placeholder="Any special requests from the customer..."
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="editNotes">Admin Notes</Label>
                  <Textarea
                    id="editNotes"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    placeholder="Internal notes about this booking..."
                    rows={2}
                  />
                </div>

                {/* Staff Assignment Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Staff Assignment
                  </h3>

                  {loadingStaff ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      <span className="ml-2 text-sm text-muted-foreground">Loading staff...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Guides */}
                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4" />
                          Guides
                        </Label>
                        {guides.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No guides available.{' '}
                            <Link href="/guides" className="text-primary hover:underline">
                              Add guides
                            </Link>
                          </p>
                        ) : (
                          <div className="grid gap-2 sm:grid-cols-2">
                            {guides.map((guide) => (
                              <div
                                key={guide.id}
                                className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                                  selectedGuides.includes(guide.id)
                                    ? 'border-primary bg-primary/5'
                                    : 'hover:bg-muted/50'
                                }`}
                                onClick={() => toggleGuide(guide.id)}
                              >
                                <Checkbox
                                  checked={selectedGuides.includes(guide.id)}
                                  onCheckedChange={() => toggleGuide(guide.id)}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{guide.name}</p>
                                  <div className="flex flex-wrap gap-1">
                                    {guide.languages.slice(0, 3).map((lang) => (
                                      <Badge key={lang} variant="secondary" className="text-xs">
                                        {lang.toUpperCase()}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Drivers */}
                      <div>
                        <Label className="flex items-center gap-2 mb-2">
                          <Car className="h-4 w-4" />
                          Drivers
                        </Label>
                        {drivers.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No drivers available.{' '}
                            <Link href="/drivers" className="text-primary hover:underline">
                              Add drivers
                            </Link>
                          </p>
                        ) : (
                          <div className="grid gap-2 sm:grid-cols-2">
                            {drivers.map((driver) => (
                              <div
                                key={driver.id}
                                className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                                  selectedDrivers.includes(driver.id)
                                    ? 'border-primary bg-primary/5'
                                    : 'hover:bg-muted/50'
                                }`}
                                onClick={() => toggleDriver(driver.id)}
                              >
                                <Checkbox
                                  checked={selectedDrivers.includes(driver.id)}
                                  onCheckedChange={() => toggleDriver(driver.id)}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{driver.name}</p>
                                  {driver.vehicleInfo && (
                                    <p className="text-xs text-muted-foreground truncate">
                                      {driver.vehicleInfo}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setEditingBooking(null)}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleEditSave} disabled={saving || loadingStaff}>
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Booking"
        description="Are you sure you want to delete this booking? This action cannot be undone and the customer will not be notified."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={deleteBooking}
        variant="destructive"
        loading={deleting}
      />
    </div>
  );
}
