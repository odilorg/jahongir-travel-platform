'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Car,
  Phone,
  Languages,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Pencil,
  Calendar,
  Users,
  UserCheck,
  UserX,
  CreditCard,
  Building2,
  DollarSign,
  Trash2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Vehicle {
  id: string;
  plateNumber: string;
  make: string;
  model: string;
  type: string;
}

interface DriverVehicle {
  id: string;
  vehicleId: string;
  driverId: string;
  isPrimary: boolean;
  vehicle: Vehicle;
}

interface SupplierCompany {
  id: string;
  name: string;
}

interface DriverRate {
  id: string;
  serviceType: string;
  amount: number;
  currency: string;
  notes?: string;
}

interface Driver {
  id: string;
  name: string;
  phone?: string;
  licenseNumber?: string;
  languages: string[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  vehicles?: DriverVehicle[];
  companyId?: string;
  company?: SupplierCompany;
  rates?: DriverRate[];
  _count?: {
    bookings: number;
    rates: number;
  };
}

interface DriverWithBookings extends Driver {
  bookings: Array<{
    id: string;
    booking: {
      id: string;
      travelDate: string;
      customerName: string;
      status: string;
      tour: {
        id: string;
        title: string;
      };
    };
  }>;
}

interface DriversResponse {
  data: Driver[];
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
  active: number;
  inactive: number;
  topDrivers: Array<{
    id: string;
    name: string;
    assignmentCount: number;
  }>;
}

const LANGUAGES = [
  { code: 'ru', label: 'Russian' },
  { code: 'en', label: 'English' },
  { code: 'uz', label: 'Uzbek' },
  { code: 'de', label: 'German' },
  { code: 'fr', label: 'French' },
];

const SERVICE_TYPES = [
  { code: 'airport_transfer', label: 'Airport Transfer' },
  { code: 'half_day', label: 'Half Day (4h)' },
  { code: 'full_day', label: 'Full Day (8h)' },
  { code: 'multi_day', label: 'Multi-Day (per day)' },
  { code: 'per_km', label: 'Per Kilometer' },
];

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<DriversResponse['meta'] | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<DriverWithBookings | null>(null);
  const [loadingDriver, setLoadingDriver] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    languages: [] as string[],
    notes: '',
    companyId: '',
  });
  const [saving, setSaving] = useState(false);
  const [companies, setCompanies] = useState<SupplierCompany[]>([]);

  // Rate management state
  const [driverRates, setDriverRates] = useState<DriverRate[]>([]);
  const [newRate, setNewRate] = useState({ serviceType: '', amount: '', currency: 'USD' });
  const [savingRate, setSavingRate] = useState(false);

  useEffect(() => {
    fetchDrivers();
    fetchStats();
    fetchCompanies();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchDrivers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      if (search) params.set('search', search);

      const response = await api.get<DriversResponse>(`/drivers?${params.toString()}`);
      setDrivers(response.data);
      setMeta(response.meta);
    } catch (error: any) {
      toast.error('Failed to load drivers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.get<Stats>('/drivers/stats');
      setStats(data);
    } catch (error: any) {
      console.error('Stats fetch error:', error);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get<{ data: SupplierCompany[] }>('/supplier-companies?limit=100&isActive=true');
      setCompanies(response.data || []);
    } catch (error: any) {
      console.error('Companies fetch error:', error);
    }
  };

  const fetchDriverRates = async (driverId: string) => {
    try {
      const rates = await api.get<DriverRate[]>(`/drivers/${driverId}/rates`);
      setDriverRates(rates || []);
    } catch (error: any) {
      console.error('Rates fetch error:', error);
    }
  };

  const handleAddRate = async (driverId: string) => {
    if (!newRate.serviceType || !newRate.amount) {
      toast.error('Please fill in service type and amount');
      return;
    }
    setSavingRate(true);
    try {
      await api.post(`/drivers/${driverId}/rates`, {
        serviceType: newRate.serviceType,
        amount: parseFloat(newRate.amount),
        currency: newRate.currency,
      });
      toast.success('Rate added successfully');
      setNewRate({ serviceType: '', amount: '', currency: 'USD' });
      fetchDriverRates(driverId);
      fetchDrivers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add rate');
    } finally {
      setSavingRate(false);
    }
  };

  const handleDeleteRate = async (driverId: string, rateId: string) => {
    try {
      await api.delete(`/drivers/${driverId}/rates/${rateId}`);
      toast.success('Rate deleted');
      fetchDriverRates(driverId);
      fetchDrivers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete rate');
    }
  };

  const viewDriverDetails = async (driverId: string) => {
    setLoadingDriver(true);
    try {
      const driver = await api.get<DriverWithBookings>(`/drivers/${driverId}`);
      setSelectedDriver(driver);
      fetchDriverRates(driverId);
    } catch (error: any) {
      toast.error('Failed to load driver details');
    } finally {
      setLoadingDriver(false);
    }
  };

  const openCreateForm = () => {
    setEditingDriver(null);
    setFormData({ name: '', phone: '', licenseNumber: '', languages: [], notes: '', companyId: '' });
    setShowForm(true);
  };

  const openEditForm = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone || '',
      licenseNumber: driver.licenseNumber || '',
      languages: driver.languages || [],
      notes: driver.notes || '',
      companyId: driver.companyId || '',
    });
    if (driver.id) {
      fetchDriverRates(driver.id);
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingDriver) {
        await api.patch(`/drivers/${editingDriver.id}`, formData);
        toast.success('Driver updated successfully');
      } else {
        await api.post('/drivers', formData);
        toast.success('Driver created successfully');
      }
      setShowForm(false);
      fetchDrivers();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save driver');
    } finally {
      setSaving(false);
    }
  };

  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const toggleDriverActive = async (driver: Driver) => {
    try {
      await api.patch(`/drivers/${driver.id}`, { isActive: !driver.isActive });
      toast.success(driver.isActive ? 'Driver deactivated' : 'Driver activated');
      fetchDrivers();
      fetchStats();
    } catch (error: any) {
      toast.error('Failed to update driver');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLanguageLabel = (code: string) => {
    return LANGUAGES.find(l => l.code === code)?.label || code;
  };

  const getServiceTypeLabel = (code: string) => {
    return SERVICE_TYPES.find(s => s.code === code)?.label || code;
  };

  const DriverCard = ({ driver }: { driver: Driver }) => (
    <Card className={`hover:shadow-md transition-shadow ${!driver.isActive ? 'opacity-60' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 cursor-pointer" onClick={() => viewDriverDetails(driver.id)}>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${driver.isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Car className={`h-6 w-6 ${driver.isActive ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{driver.name}</h3>
                {driver.company ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Building2 className="h-3 w-3 mr-1" />
                    {driver.company.name}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-50 text-green-700">Freelancer</Badge>
                )}
                {!driver.isActive && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">Inactive</Badge>
                )}
              </div>
              {driver.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{driver.phone}</span>
                </div>
              )}
              {driver.vehicles && driver.vehicles.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Car className="h-4 w-4" />
                  <span>{driver.vehicles[0].vehicle.make} {driver.vehicles[0].vehicle.model} ({driver.vehicles[0].vehicle.plateNumber})</span>
                </div>
              )}
              {driver.licenseNumber && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>{driver.licenseNumber}</span>
                </div>
              )}
              {driver.languages.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Languages className="h-4 w-4" />
                  <span>{driver.languages.map(getLanguageLabel).join(', ')}</span>
                </div>
              )}
              {!driver.company && driver._count?.rates !== undefined && driver._count.rates > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{driver._count.rates} rate(s) configured</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-4">
              <div className="flex items-center justify-end gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold text-blue-600">{driver._count?.bookings || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">assignments</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => openEditForm(driver)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleDriverActive(driver)}
              title={driver.isActive ? 'Deactivate' : 'Activate'}
            >
              {driver.isActive ? <UserX className="h-4 w-4 text-red-500" /> : <UserCheck className="h-4 w-4 text-green-500" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Drivers</h1>
          <p className="text-muted-foreground mt-1">Manage tour drivers and vehicles</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total Drivers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                  <div className="text-sm text-muted-foreground">Active</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-400">{stats.inactive}</div>
                  <div className="text-sm text-muted-foreground">Inactive</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.topDrivers[0]?.assignmentCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Most Assignments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Drivers */}
      {stats && stats.topDrivers.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Top Drivers by Assignments</h3>
            <div className="flex flex-wrap gap-2">
              {stats.topDrivers.map((driver, idx) => (
                <Badge
                  key={driver.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => viewDriverDetails(driver.id)}
                >
                  {idx + 1}. {driver.name} ({driver.assignmentCount})
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
          placeholder="Search by name, vehicle, or license..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Drivers List */}
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
        ) : drivers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No drivers found</h3>
              <p className="text-muted-foreground">
                {search ? 'Try adjusting your search' : 'Add your first driver to get started'}
              </p>
              {!search && (
                <Button className="mt-4" onClick={openCreateForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Driver
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {drivers.map((driver) => (
              <DriverCard key={driver.id} driver={driver} />
            ))}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, meta.total)} of {meta.total}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={!meta.hasPrev} onClick={() => setPage(page - 1)}>
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled={!meta.hasNext} onClick={() => setPage(page + 1)}>
                    Next <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <Card className="w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editingDriver ? 'Edit Driver' : 'Add New Driver'}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="licenseNumber">License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="e.g., AB1234567"
                  />
                </div>

                <div>
                  <Label htmlFor="companyId">Company (optional)</Label>
                  <Select
                    value={formData.companyId || 'freelancer'}
                    onValueChange={(value) => setFormData({ ...formData, companyId: value === 'freelancer' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company or leave as freelancer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freelancer">Freelancer (No Company)</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.companyId ? 'Company workers use contract rates' : 'Freelancers set their own rates'}
                  </p>
                </div>

                <div>
                  <Label>Languages Spoken</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {LANGUAGES.map((lang) => (
                      <Badge
                        key={lang.code}
                        variant={formData.languages.includes(lang.code) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleLanguage(lang.code)}
                      >
                        {lang.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Rate Management Section (for freelancers only, when editing) */}
                {editingDriver && !formData.companyId && (
                  <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <Label className="text-sm font-semibold">Freelancer Rates</Label>
                    </div>

                    {/* Existing Rates */}
                    {driverRates.length > 0 && (
                      <div className="space-y-2">
                        {driverRates.map((rate) => (
                          <div key={rate.id} className="flex items-center justify-between bg-white p-2 rounded border">
                            <div>
                              <span className="font-medium">{getServiceTypeLabel(rate.serviceType)}</span>
                              <span className="text-muted-foreground ml-2">
                                {rate.amount} {rate.currency}
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRate(editingDriver.id, rate.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Rate */}
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label className="text-xs">Service Type</Label>
                        <Select
                          value={newRate.serviceType}
                          onValueChange={(value) => setNewRate({ ...newRate, serviceType: value })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select service" />
                          </SelectTrigger>
                          <SelectContent>
                            {SERVICE_TYPES.filter(st => !driverRates.find(r => r.serviceType === st.code)).map((st) => (
                              <SelectItem key={st.code} value={st.code}>
                                {st.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24">
                        <Label className="text-xs">Amount</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={newRate.amount}
                          onChange={(e) => setNewRate({ ...newRate, amount: e.target.value })}
                          placeholder="0.00"
                          className="h-9"
                        />
                      </div>
                      <div className="w-20">
                        <Label className="text-xs">Currency</Label>
                        <Select
                          value={newRate.currency}
                          onValueChange={(value) => setNewRate({ ...newRate, currency: value })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="UZS">UZS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAddRate(editingDriver.id)}
                        disabled={savingRate || !newRate.serviceType || !newRate.amount}
                        className="h-9"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? 'Saving...' : editingDriver ? 'Update Driver' : 'Add Driver'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Driver Details Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedDriver(null)}>
          <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center">
                    <Car className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{selectedDriver.name}</h2>
                      {selectedDriver.company ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Building2 className="h-3 w-3 mr-1" />
                          {selectedDriver.company.name}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-50 text-green-700">Freelancer</Badge>
                      )}
                    </div>
                    {selectedDriver.vehicles && selectedDriver.vehicles.length > 0 && (
                      <p className="text-muted-foreground">
                        {selectedDriver.vehicles[0].vehicle.make} {selectedDriver.vehicles[0].vehicle.model} ({selectedDriver.vehicles[0].vehicle.plateNumber})
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDriver(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Driver Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedDriver._count?.bookings || 0}</div>
                  <div className="text-xs text-muted-foreground">Assignments</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-sm font-medium">{selectedDriver.languages.map(getLanguageLabel).join(', ') || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">Languages</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-sm font-medium">{selectedDriver.isActive ? 'Active' : 'Inactive'}</div>
                  <div className="text-xs text-muted-foreground">Status</div>
                </div>
              </div>

              {/* Contact & Vehicle Info */}
              <div className="space-y-2 mb-6">
                {selectedDriver.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedDriver.phone}</span>
                  </div>
                )}
                {selectedDriver.licenseNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>License: {selectedDriver.licenseNumber}</span>
                  </div>
                )}
                {selectedDriver.vehicles && selectedDriver.vehicles.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span>Vehicle: {selectedDriver.vehicles[0].vehicle.make} {selectedDriver.vehicles[0].vehicle.model} ({selectedDriver.vehicles[0].vehicle.plateNumber})</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Added on {formatDate(selectedDriver.createdAt)}</span>
                </div>
                {selectedDriver.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">{selectedDriver.notes}</div>
                )}
              </div>

              {/* Rates Section (for freelancers) */}
              {!selectedDriver.company && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Rates
                  </h3>
                  {driverRates.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No rates configured</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {driverRates.map((rate) => (
                        <div key={rate.id} className="bg-green-50 p-2 rounded-lg">
                          <div className="text-xs text-muted-foreground">{getServiceTypeLabel(rate.serviceType)}</div>
                          <div className="font-semibold text-green-700">{rate.amount} {rate.currency}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Assignment History */}
              <div>
                <h3 className="font-semibold mb-3">Assignment History</h3>
                {selectedDriver.bookings.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No assignments yet</p>
                ) : (
                  <div className="space-y-3">
                    {selectedDriver.bookings.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{assignment.booking.tour.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(assignment.booking.travelDate)} - {assignment.booking.customerName}
                          </p>
                        </div>
                        <Badge variant={assignment.booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs">
                          {assignment.booking.status}
                        </Badge>
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
