'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Guide {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  languages: string[];
  notes?: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    bookings: number;
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
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchGuides();
    fetchStats();
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

      const response = await api.get<GuidesResponse>(`/api/guides?${params.toString()}`);
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

  const viewGuideDetails = async (guideId: string) => {
    setLoadingGuide(true);
    try {
      const guide = await api.get<GuideWithBookings>(`/api/guides/${guideId}`);
      setSelectedGuide(guide);
    } catch (error: any) {
      toast.error('Failed to load guide details');
    } finally {
      setLoadingGuide(false);
    }
  };

  const openCreateForm = () => {
    setEditingGuide(null);
    setFormData({ name: '', phone: '', email: '', languages: [], notes: '' });
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
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingGuide) {
        await api.patch(`/api/guides/${editingGuide.id}`, formData);
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
      await api.patch(`/api/guides/${guide.id}`, { isActive: !guide.isActive });
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
                    <h2 className="text-xl font-bold">{selectedGuide.name}</h2>
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
