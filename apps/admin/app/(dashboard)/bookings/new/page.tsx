'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Badge } from '@/components/ui/badge';
import { MultiSelect, type MultiSelectOption } from '@/components/ui/multi-select';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ArrowLeft, Loader2, Calendar, User, Phone, Mail, Users, MapPin, Car, Search, UserPlus, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Tour {
  id: string;
  title: string;
  price: string;
  duration: number;
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

interface Guest {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  totalBookings: number;
  totalSpent: string;
}

export default function NewBookingPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data for dropdowns
  const [tours, setTours] = useState<Tour[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  // Guest search state
  const [guests, setGuests] = useState<Guest[]>([]);
  const [guestSearch, setGuestSearch] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guestSearchOpen, setGuestSearchOpen] = useState(false);
  const [searchingGuests, setSearchingGuests] = useState(false);
  const [showNewGuestForm, setShowNewGuestForm] = useState(false);

  // Form state
  const [form, setForm] = useState({
    tourId: '',
    guestId: '', // Added for guest relation
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    travelDate: '',
    numberOfPeople: 1,
    specialRequests: '',
    notes: '',
  });

  // Selected staff
  const [selectedGuides, setSelectedGuides] = useState<string[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);

  // Selected tour for price calculation
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [toursRes, guidesRes, driversRes] = await Promise.all([
        api.get<{ data: Tour[] }>('/tours?limit=100&isActive=true'),
        api.get<{ data: Guide[] }>('/guides?isActive=true&limit=100'),
        api.get<{ data: Driver[] }>('/drivers?isActive=true&limit=100'),
      ]);

      setTours(toursRes.data || []);
      setGuides(guidesRes.data || []);
      setDrivers(driversRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load form data');
    } finally {
      setLoading(false);
    }
  };

  const handleTourChange = (tourId: string) => {
    setForm({ ...form, tourId });
    const tour = tours.find((t) => t.id === tourId);
    setSelectedTour(tour || null);
  };

  // Search guests
  const searchGuests = async (query: string) => {
    if (!query || query.length < 2) {
      setGuests([]);
      return;
    }

    setSearchingGuests(true);
    try {
      const response = await api.get<{ data: Guest[] }>(`/guests?search=${encodeURIComponent(query)}&limit=10`);
      setGuests(response.data || []);
    } catch (error) {
      console.error('Failed to search guests:', error);
      setGuests([]);
    } finally {
      setSearchingGuests(false);
    }
  };

  // Handle guest selection
  const handleGuestSelect = (guest: Guest) => {
    setSelectedGuest(guest);
    setForm({
      ...form,
      guestId: guest.id,
      customerName: guest.name,
      customerEmail: guest.email,
      customerPhone: guest.phone || '',
    });
    setGuestSearchOpen(false);
    setShowNewGuestForm(false);
  };

  // Handle manual entry (new guest)
  const handleManualEntry = () => {
    setSelectedGuest(null);
    setForm({
      ...form,
      guestId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
    });
    setShowNewGuestForm(true);
    setGuestSearchOpen(false);
  };

  // Debounce guest search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (guestSearch) {
        searchGuests(guestSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [guestSearch]);

  // Convert guides and drivers to MultiSelect options
  const guideOptions: MultiSelectOption[] = guides.map((guide) => ({
    value: guide.id,
    label: guide.name,
    description: guide.languages.map(l => l.toUpperCase()).join(', '),
  }));

  const driverOptions: MultiSelectOption[] = drivers.map((driver) => ({
    value: driver.id,
    label: driver.name,
    description: driver.vehicleInfo,
  }));

  const calculateTotalPrice = () => {
    if (!selectedTour) return 0;
    return parseFloat(selectedTour.price) * form.numberOfPeople;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.tourId) {
      toast.error('Please select a tour');
      return;
    }

    if (!form.customerName || !form.customerEmail) {
      toast.error('Please fill in customer name and email');
      return;
    }

    if (!form.travelDate) {
      toast.error('Please select a travel date');
      return;
    }

    setSubmitting(true);
    try {
      // Create booking
      const response = await api.post<{ booking: { id: string } }>('/bookings', {
        tourId: form.tourId,
        guestId: form.guestId || undefined, // Link to existing guest if selected
        customerName: form.customerName,
        customerEmail: form.customerEmail,
        customerPhone: form.customerPhone || undefined,
        travelDate: form.travelDate,
        numberOfPeople: form.numberOfPeople,
        specialRequests: form.specialRequests || undefined,
      });

      const bookingId = response.booking.id;

      // Assign guides
      for (const guideId of selectedGuides) {
        try {
          await api.post(`/bookings/${bookingId}/guides`, { guideId });
        } catch (error) {
          console.error(`Failed to assign guide ${guideId}:`, error);
        }
      }

      // Assign drivers
      for (const driverId of selectedDrivers) {
        try {
          await api.post(`/bookings/${bookingId}/drivers`, { driverId });
        } catch (error) {
          console.error(`Failed to assign driver ${driverId}:`, error);
        }
      }

      // Update notes if provided
      if (form.notes) {
        try {
          await api.patch(`/bookings/${bookingId}/status`, {
            status: 'pending',
            notes: form.notes,
          });
        } catch (error) {
          console.error('Failed to add notes:', error);
        }
      }

      toast.success('Booking created successfully!', {
        description: 'Redirecting to bookings list...',
        duration: 2000,
      });

      setTimeout(() => {
        router.push('/bookings');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
      console.error('Create booking error:', error);
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
          <Link href="/bookings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Booking</h1>
          <p className="text-muted-foreground mt-1">
            Manually create a booking for phone or walk-in customers
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tour Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tour Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tour">Tour *</Label>
                  <Select value={form.tourId} onValueChange={handleTourChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a tour" />
                    </SelectTrigger>
                    <SelectContent>
                      {tours.map((tour) => (
                        <SelectItem key={tour.id} value={tour.id}>
                          {tour.title} - ${tour.price} ({tour.duration} days)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="travelDate">Travel Date *</Label>
                    <Input
                      id="travelDate"
                      type="date"
                      value={form.travelDate}
                      onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numberOfPeople">Number of People *</Label>
                    <Input
                      id="numberOfPeople"
                      type="number"
                      min={1}
                      max={50}
                      value={form.numberOfPeople}
                      onChange={(e) =>
                        setForm({ ...form, numberOfPeople: parseInt(e.target.value) || 1 })
                      }
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Search for existing guest or create new
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Guest Search */}
                <div className="space-y-2">
                  <Label>Search Guest</Label>
                  <Popover open={guestSearchOpen} onOpenChange={setGuestSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={guestSearchOpen}
                        className="w-full justify-between"
                      >
                        {selectedGuest ? (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{selectedGuest.name}</span>
                            {selectedGuest.totalBookings > 0 && (
                              <Badge variant="secondary" className="ml-2">
                                {selectedGuest.totalBookings} booking(s)
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Search by name, email, or phone...</span>
                        )}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Type to search guests..."
                          value={guestSearch}
                          onValueChange={setGuestSearch}
                        />
                        <CommandList>
                          <CommandEmpty>
                            {searchingGuests ? (
                              <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="ml-2">Searching...</span>
                              </div>
                            ) : guestSearch.length < 2 ? (
                              'Type at least 2 characters to search'
                            ) : (
                              'No guests found'
                            )}
                          </CommandEmpty>
                          {guests.length > 0 && (
                            <CommandGroup heading="Guests">
                              {guests.map((guest) => (
                                <CommandItem
                                  key={guest.id}
                                  value={guest.id}
                                  onSelect={() => handleGuestSelect(guest)}
                                  className="cursor-pointer"
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      selectedGuest?.id === guest.id ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
                                  <div className="flex flex-col flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{guest.name}</span>
                                      {guest.totalBookings > 0 && (
                                        <Badge variant="secondary" className="text-xs">
                                          {guest.totalBookings} booking(s)
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {guest.email}
                                      </span>
                                      {guest.phone && (
                                        <span className="flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          {guest.phone}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          )}
                          <CommandSeparator />
                          <CommandGroup>
                            <CommandItem onSelect={handleManualEntry} className="cursor-pointer">
                              <UserPlus className="mr-2 h-4 w-4" />
                              <span>Create new guest</span>
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Selected Guest Info or Manual Entry */}
                {selectedGuest && (
                  <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Selected Guest</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleManualEntry}
                      >
                        Change
                      </Button>
                    </div>
                    <div className="grid gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedGuest.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedGuest.email}</span>
                      </div>
                      {selectedGuest.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedGuest.phone}</span>
                        </div>
                      )}
                      {selectedGuest.totalBookings > 0 && (
                        <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                          <Badge variant="secondary">
                            Total Bookings: {selectedGuest.totalBookings}
                          </Badge>
                          {parseFloat(selectedGuest.totalSpent) > 0 && (
                            <Badge variant="secondary">
                              Total Spent: ${parseFloat(selectedGuest.totalSpent).toLocaleString()}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Manual Entry Form (for new guests or walk-ins) */}
                {(showNewGuestForm || !selectedGuest) && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        placeholder="John Doe"
                        value={form.customerName}
                        onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="customerEmail">Email *</Label>
                        <Input
                          id="customerEmail"
                          type="email"
                          placeholder="john@example.com"
                          value={form.customerEmail}
                          onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customerPhone">Phone</Label>
                        <Input
                          id="customerPhone"
                          type="tel"
                          placeholder="+998 90 123 45 67"
                          value={form.customerPhone}
                          onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Staff Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Assign Staff
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Guides */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
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
                    <MultiSelect
                      options={guideOptions}
                      selected={selectedGuides}
                      onChange={setSelectedGuides}
                      placeholder="Select guides..."
                      searchPlaceholder="Search guides by name..."
                      emptyMessage="No guides found."
                    />
                  )}
                </div>

                {/* Drivers */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
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
                    <MultiSelect
                      options={driverOptions}
                      selected={selectedDrivers}
                      onChange={setSelectedDrivers}
                      placeholder="Select drivers..."
                      searchPlaceholder="Search drivers by name..."
                      emptyMessage="No drivers found."
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Dietary requirements, accessibility needs, etc."
                    value={form.specialRequests}
                    onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Admin Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Internal notes (not visible to customer)"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedTour ? (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground">Tour</p>
                      <p className="font-medium">{selectedTour.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedTour.duration} days
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price per person</p>
                      <p className="font-medium">${selectedTour.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Number of people</p>
                      <p className="font-medium">{form.numberOfPeople}</p>
                    </div>
                    <hr />
                    <div>
                      <p className="text-sm text-muted-foreground">Total Price</p>
                      <p className="text-2xl font-bold text-primary">
                        ${calculateTotalPrice().toLocaleString()}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Select a tour to see pricing
                  </p>
                )}

                {/* Selected Staff Summary */}
                {(selectedGuides.length > 0 || selectedDrivers.length > 0) && (
                  <>
                    <hr />
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Assigned Staff</p>
                      {selectedGuides.length > 0 && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {selectedGuides.length} guide(s)
                          </span>
                        </div>
                      )}
                      {selectedDrivers.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {selectedDrivers.length} driver(s)
                          </span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={submitting || !form.tourId}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Booking'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
