'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
  Repeat,
  TrendingUp,
  Users,
  Plane,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Guest {
  id: string;
  email: string;
  name: string;
  phone?: string;
  country?: string;
  preferredLanguage?: string;
  totalBookings: number;
  totalSpent: number;
  lastBookingAt?: string;
  createdAt: string;
}

interface GuestWithBookings extends Guest {
  bookings: Array<{
    id: string;
    travelDate: string;
    numberOfPeople: number;
    totalPrice: number;
    status: string;
    createdAt: string;
    tour: {
      id: string;
      title: string;
      slug: string;
    };
  }>;
}

interface GuestsResponse {
  data: Guest[];
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
  totalGuests: number;
  repeatGuests: number;
  repeatRate: string;
  totalRevenue: number;
  recentGuests: number;
  topGuestsByBookings: Guest[];
  topGuestsBySpending: Guest[];
}

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<GuestsResponse['meta'] | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<GuestWithBookings | null>(null);
  const [loadingGuest, setLoadingGuest] = useState(false);

  useEffect(() => {
    fetchGuests();
    fetchStats();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchGuests();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchGuests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      params.set('sortBy', 'totalBookings');
      params.set('sortOrder', 'desc');
      if (search) params.set('search', search);

      const response = await api.get<GuestsResponse>(`/guests?${params.toString()}`);
      setGuests(response.data);
      setMeta(response.meta);
    } catch (error: any) {
      toast.error('Failed to load guests');
      console.error('Guests fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.get<Stats>('/guests/stats');
      setStats(data);
    } catch (error: any) {
      console.error('Stats fetch error:', error);
    }
  };

  const viewGuestDetails = async (guestId: string) => {
    setLoadingGuest(true);
    try {
      const guest = await api.get<GuestWithBookings>(`/guests/${guestId}`);
      setSelectedGuest(guest);
    } catch (error: any) {
      toast.error('Failed to load guest details');
    } finally {
      setLoadingGuest(false);
    }
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

  const getLanguageLabel = (lang?: string) => {
    switch (lang) {
      case 'ru': return 'Russian';
      case 'en': return 'English';
      case 'uz': return 'Uzbek';
      default: return lang || 'N/A';
    }
  };

  const GuestCard = ({ guest }: { guest: Guest }) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => viewGuestDetails(guest.id)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{guest.name}</h3>
                {guest.totalBookings > 1 && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Repeat className="h-3 w-3 mr-1" />
                    Repeat
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{guest.email}</span>
              </div>
              {guest.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{guest.phone}</span>
                </div>
              )}
              {guest.country && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4" />
                  <span>{guest.country}</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold text-blue-600">{guest.totalBookings}</span>
            </div>
            <p className="text-xs text-muted-foreground">bookings</p>
            <div className="flex items-center justify-end gap-1 mt-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="font-semibold text-green-600">{formatPrice(Number(guest.totalSpent))}</span>
            </div>
            {guest.lastBookingAt && (
              <p className="text-xs text-muted-foreground">
                Last: {formatDate(guest.lastBookingAt)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Guests</h1>
        <p className="text-muted-foreground mt-1">Customer database and booking history</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalGuests}</div>
                  <div className="text-sm text-muted-foreground">Total Guests</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Repeat className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.repeatGuests}</div>
                  <div className="text-sm text-muted-foreground">Repeat Customers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.repeatRate}%</div>
                  <div className="text-sm text-muted-foreground">Repeat Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{formatPrice(Number(stats.totalRevenue))}</div>
                  <div className="text-sm text-muted-foreground">Lifetime Value</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Guests */}
      {stats && stats.topGuestsByBookings.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Top Customers</h3>
            <div className="flex flex-wrap gap-2">
              {stats.topGuestsByBookings.map((guest, idx) => (
                <Badge
                  key={guest.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => viewGuestDetails(guest.id)}
                >
                  {idx + 1}. {guest.name} ({guest.totalBookings} bookings)
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Guests List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-20 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : guests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No guests found</h3>
              <p className="text-muted-foreground">
                {search ? 'Try adjusting your search' : 'Guests will appear here after bookings are made'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {guests.map((guest) => (
              <GuestCard key={guest.id} guest={guest} />
            ))}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, meta.total)} of {meta.total} guests
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
      </div>

      {/* Guest Details Modal */}
      {selectedGuest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedGuest(null)}>
          <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedGuest.name}</h2>
                    <p className="text-muted-foreground">{selectedGuest.email}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedGuest(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Guest Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedGuest.totalBookings}</div>
                  <div className="text-xs text-muted-foreground">Bookings</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{formatPrice(Number(selectedGuest.totalSpent))}</div>
                  <div className="text-xs text-muted-foreground">Total Spent</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-sm font-medium">{getLanguageLabel(selectedGuest.preferredLanguage)}</div>
                  <div className="text-xs text-muted-foreground">Language</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-sm font-medium">{selectedGuest.country || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">Country</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                {selectedGuest.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedGuest.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Customer since {formatDate(selectedGuest.createdAt)}</span>
                </div>
                {selectedGuest.lastBookingAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Last booking: {formatDate(selectedGuest.lastBookingAt)}</span>
                  </div>
                )}
              </div>

              {/* Booking History */}
              <div>
                <h3 className="font-semibold mb-3">Booking History</h3>
                {selectedGuest.bookings.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No bookings yet</p>
                ) : (
                  <div className="space-y-3">
                    {selectedGuest.bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Plane className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{booking.tour.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(booking.travelDate)} - {booking.numberOfPeople} people
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatPrice(Number(booking.totalPrice))}</p>
                          <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
