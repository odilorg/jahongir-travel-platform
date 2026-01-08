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
  User,
  Phone,
  Mail,
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
  Building2,
  DollarSign,
  Trash2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface SupplierCompany {
  id: string;
  name: string;
}

interface GuideRate {
  id: string;
  serviceType: string;
  amount: number;
  currency: string;
  notes?: string;
}

interface Guide {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  languages: string[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  companyId?: string;
  company?: SupplierCompany;
  rates?: GuideRate[];
  _count?: {
    bookings: number;
    rates: number;
  };
}

interface GuideWithBookings extends Guide {
  bookings: Array<{
    id: string;
    role?: string;
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

interface GuidesResponse {
  data: Guide[];
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
  topGuides: Array<{
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
  { code: 'es', label: 'Spanish' },
  { code: 'it', label: 'Italian' },
  { code: 'zh', label: 'Chinese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
];

const SERVICE_TYPES = [
  { code: 'half_day', label: 'Half Day (4h)' },
  { code: 'full_day', label: 'Full Day (8h)' },
  { code: 'multi_day', label: 'Multi-Day (per day)' },
];

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<GuidesResponse['meta'] | null>(null);
  const [selectedGuide, setSelectedGuide] = useState<GuideWithBookings | null>(null);
  const [loadingGuide, setLoadingGuide] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    languages: [] as string[],
    notes: '',
    companyId: '',
  });
  const [saving, setSaving] = useState(false);
  const [companies, setCompanies] = useState<SupplierCompany[]>([]);

  // Rate management state
  const [guideRates, setGuideRates] = useState<GuideRate[]>([]);
  const [newRate, setNewRate] = useState({ serviceType: '', amount: '', currency: 'USD' });
  const [savingRate, setSavingRate] = useState(false);

  useEffect(() => {
    fetchGuides();
    fetchStats();
    fetchCompanies();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchGuides();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      if (search) params.set('search', search);

      const response = await api.get<GuidesResponse>(`/guides?${params.toString()}`);
      setGuides(response.data);
      setMeta(response.meta);
    } catch (error: any) {
      toast.error('Failed to load guides');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.get<Stats>('/guides/stats');
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

  const fetchGuideRates = async (guideId: string) => {
    try {
      const rates = await api.get<GuideRate[]>(`/guides/${guideId}/rates`);
      setGuideRates(rates || []);
    } catch (error: any) {
      console.error('Rates fetch error:', error);
    }
  };

  const handleAddRate = async (guideId: string) => {
    if (!newRate.serviceType || !newRate.amount) {
      toast.error('Please fill in service type and amount');
      return;
    }
    setSavingRate(true);
    try {
      await api.post(`/guides/${guideId}/rates`, {
        serviceType: newRate.serviceType,
        amount: parseFloat(newRate.amount),
        currency: newRate.currency,
      });
      toast.success('Rate added successfully');
      setNewRate({ serviceType: '', amount: '', currency: 'USD' });
      fetchGuideRates(guideId);
      fetchGuides();
    } catch (error: any) {
      toast.error(error.message || 'Failed to add rate');
    } finally {
      setSavingRate(false);
    }
  };

  const handleDeleteRate = async (guideId: string, rateId: string) => {
    try {
      await api.delete(`/guides/${guideId}/rates/${rateId}`);
      toast.success('Rate deleted');
      fetchGuideRates(guideId);
      fetchGuides();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete rate');
    }
  };

  const viewGuideDetails = async (guideId: string) => {
    setLoadingGuide(true);
    try {
      const guide = await api.get<GuideWithBookings>(`/guides/${guideId}`);
      setSelectedGuide(guide);
      fetchGuideRates(guideId);
    } catch (error: any) {
      toast.error('Failed to load guide details');
    } finally {
      setLoadingGuide(false);
    }
  };

  const openCreateForm = () => {
    setEditingGuide(null);
    setFormData({ name: '', phone: '', email: '', languages: [], notes: '', companyId: '' });
    setShowForm(true);
  };

  const openEditForm = (guide: Guide) => {
    setEditingGuide(guide);
    setFormData({
      name: guide.name,
      phone: guide.phone || '',
      email: guide.email || '',
      languages: guide.languages || [],
      notes: guide.notes || '',
      companyId: guide.companyId || '',
    });
    if (guide.id) {
      fetchGuideRates(guide.id);
    }
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingGuide) {
        await api.patch(`/guides/${editingGuide.id}`, formData);
        toast.success('Guide updated successfully');
      } else {
        await api.post('/guides', formData);
        toast.success('Guide created successfully');
      }
      setShowForm(false);
      fetchGuides();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save guide');
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

  const toggleGuideActive = async (guide: Guide) => {
    try {
      await api.patch(`/guides/${guide.id}`, { isActive: !guide.isActive });
      toast.success(guide.isActive ? 'Guide deactivated' : 'Guide activated');
      fetchGuides();
      fetchStats();
    } catch (error: any) {
      toast.error('Failed to update guide');
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

  const GuideCard = ({ guide }: { guide: Guide }) => (
    <Card className={`hover:shadow-md transition-shadow ${!guide.isActive ? 'opacity-60' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 cursor-pointer" onClick={() => viewGuideDetails(guide.id)}>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${guide.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
              <User className={`h-6 w-6 ${guide.isActive ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{guide.name}</h3>
                {guide.company ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Building2 className="h-3 w-3 mr-1" />
                    {guide.company.name}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-50 text-green-700">Freelancer</Badge>
                )}
                {!guide.isActive && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">Inactive</Badge>
                )}
              </div>
              {guide.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{guide.phone}</span>
                </div>
              )}
              {guide.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{guide.email}</span>
                </div>
              )}
              {guide.languages.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Languages className="h-4 w-4" />
                  <span>{guide.languages.map(getLanguageLabel).join(', ')}</span>
                </div>
              )}
              {!guide.company && guide._count?.rates !== undefined && guide._count.rates > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>{guide._count.rates} rate(s) configured</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right mr-4">
              <div className="flex items-center justify-end gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-2xl font-bold text-blue-600">{guide._count?.bookings || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">assignments</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => openEditForm(guide)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleGuideActive(guide)}
              title={guide.isActive ? 'Deactivate' : 'Activate'}
            >
              {guide.isActive ? <UserX className="h-4 w-4 text-red-500" /> : <UserCheck className="h-4 w-4 text-green-500" />}
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
          <h1 className="text-3xl font-bold">Guides</h1>
          <p className="text-muted-foreground mt-1">Manage tour guides and their assignments</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Guide
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
                  <div className="text-sm text-muted-foreground">Total Guides</div>
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
                    {stats.topGuides[0]?.assignmentCount || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Most Assignments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Top Guides */}
      {stats && stats.topGuides.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Top Guides by Assignments</h3>
            <div className="flex flex-wrap gap-2">
              {stats.topGuides.map((guide, idx) => (
                <Badge
                  key={guide.id}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50"
                  onClick={() => viewGuideDetails(guide.id)}
                >
                  {idx + 1}. {guide.name} ({guide.assignmentCount})
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
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Guides List */}
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
        ) : guides.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No guides found</h3>
              <p className="text-muted-foreground">
                {search ? 'Try adjusting your search' : 'Add your first guide to get started'}
              </p>
              {!search && (
                <Button className="mt-4" onClick={openCreateForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Guide
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {guides.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
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
                <h2 className="text-xl font-bold">{editingGuide ? 'Edit Guide' : 'Add New Guide'}</h2>
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                {editingGuide && !formData.companyId && (
                  <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <Label className="text-sm font-semibold">Freelancer Rates</Label>
                    </div>

                    {/* Existing Rates */}
                    {guideRates.length > 0 && (
                      <div className="space-y-2">
                        {guideRates.map((rate) => (
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
                              onClick={() => handleDeleteRate(editingGuide.id, rate.id)}
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
                            {SERVICE_TYPES.filter(st => !guideRates.find(r => r.serviceType === st.code)).map((st) => (
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
                        onClick={() => handleAddRate(editingGuide.id)}
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
                    {saving ? 'Saving...' : editingGuide ? 'Update Guide' : 'Add Guide'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Guide Details Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedGuide(null)}>
          <Card className="w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{selectedGuide.name}</h2>
                      {selectedGuide.company ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          <Building2 className="h-3 w-3 mr-1" />
                          {selectedGuide.company.name}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-50 text-green-700">Freelancer</Badge>
                      )}
                    </div>
                    {selectedGuide.email && <p className="text-muted-foreground">{selectedGuide.email}</p>}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedGuide(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Guide Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedGuide._count?.bookings || 0}</div>
                  <div className="text-xs text-muted-foreground">Assignments</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-sm font-medium">{selectedGuide.languages.map(getLanguageLabel).join(', ') || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">Languages</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-sm font-medium">{selectedGuide.isActive ? 'Active' : 'Inactive'}</div>
                  <div className="text-xs text-muted-foreground">Status</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-6">
                {selectedGuide.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedGuide.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Added on {formatDate(selectedGuide.createdAt)}</span>
                </div>
                {selectedGuide.notes && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">{selectedGuide.notes}</div>
                )}
              </div>

              {/* Rates Section (for freelancers) */}
              {!selectedGuide.company && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    Rates
                  </h3>
                  {guideRates.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No rates configured</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {guideRates.map((rate) => (
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
                {selectedGuide.bookings.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No assignments yet</p>
                ) : (
                  <div className="space-y-3">
                    {selectedGuide.bookings.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{assignment.booking.tour.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(assignment.booking.travelDate)} - {assignment.booking.customerName}
                          </p>
                        </div>
                        <div className="text-right">
                          {assignment.role && <Badge variant="outline" className="mb-1">{assignment.role}</Badge>}
                          <Badge variant={assignment.booking.status === 'confirmed' ? 'default' : 'secondary'} className="text-xs ml-2">
                            {assignment.booking.status}
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
