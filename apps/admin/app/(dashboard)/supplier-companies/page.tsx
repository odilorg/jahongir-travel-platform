'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Pencil,
  Users,
  Building,
  FileText,
  UserCheck,
  UserX,
  User,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface SupplierCompany {
  id: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  _count?: {
    drivers: number;
    guides: number;
    contracts: number;
  };
}

interface SupplierCompanyWithDetails extends SupplierCompany {
  drivers: Array<{
    id: string;
    name: string;
    phone?: string;
    isActive: boolean;
  }>;
  guides: Array<{
    id: string;
    name: string;
    phone?: string;
    isActive: boolean;
  }>;
  contracts: Array<{
    id: string;
    startDate: string;
    endDate?: string;
    status: string;
    rates: Array<{
      supplierType: string;
      serviceType: string;
      amount: string;
      currency: string;
    }>;
  }>;
}

interface CompaniesResponse {
  data: SupplierCompany[];
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
  withDrivers: number;
  withGuides: number;
  activeContracts: number;
}

export default function SupplierCompaniesPage() {
  const [companies, setCompanies] = useState<SupplierCompany[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<CompaniesResponse['meta'] | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<SupplierCompanyWithDetails | null>(null);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<SupplierCompany | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompanies();
    fetchStats();
  }, [page]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchCompanies();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      if (search) params.set('search', search);

      const response = await api.get<CompaniesResponse>(`/supplier-companies?${params.toString()}`);
      setCompanies(response.data);
      setMeta(response.meta);
    } catch (error: any) {
      toast.error('Failed to load supplier companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.get<Stats>('/supplier-companies/stats');
      setStats(data);
    } catch (error: any) {
      console.error('Stats fetch error:', error);
    }
  };

  const viewCompanyDetails = async (companyId: string) => {
    setLoadingCompany(true);
    try {
      const company = await api.get<SupplierCompanyWithDetails>(`/supplier-companies/${companyId}`);
      setSelectedCompany(company);
    } catch (error: any) {
      toast.error('Failed to load company details');
    } finally {
      setLoadingCompany(false);
    }
  };

  const openCreateForm = () => {
    setEditingCompany(null);
    setFormData({ name: '', contactPerson: '', phone: '', email: '', address: '', notes: '' });
    setShowForm(true);
  };

  const openEditForm = (company: SupplierCompany) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      contactPerson: company.contactPerson || '',
      phone: company.phone || '',
      email: company.email || '',
      address: company.address || '',
      notes: company.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingCompany) {
        await api.patch(`/supplier-companies/${editingCompany.id}`, formData);
        toast.success('Company updated successfully');
      } else {
        await api.post('/supplier-companies', formData);
        toast.success('Company created successfully');
      }
      setShowForm(false);
      fetchCompanies();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save company');
    } finally {
      setSaving(false);
    }
  };

  const toggleCompanyActive = async (company: SupplierCompany) => {
    try {
      await api.patch(`/supplier-companies/${company.id}`, { isActive: !company.isActive });
      toast.success(company.isActive ? 'Company deactivated' : 'Company activated');
      fetchCompanies();
      fetchStats();
    } catch (error: any) {
      toast.error('Failed to update company');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      airport_transfer: 'Airport Transfer',
      half_day: 'Half Day',
      full_day: 'Full Day',
      multi_day: 'Multi Day',
      per_km: 'Per KM',
    };
    return labels[type] || type;
  };

  const CompanyCard = ({ company }: { company: SupplierCompany }) => (
    <Card className={`hover:shadow-md transition-shadow ${!company.isActive ? 'opacity-60' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 cursor-pointer" onClick={() => viewCompanyDetails(company.id)}>
            <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${company.isActive ? 'bg-purple-100' : 'bg-gray-100'}`}>
              <Building2 className={`h-6 w-6 ${company.isActive ? 'text-purple-600' : 'text-gray-400'}`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{company.name}</h3>
                {!company.isActive && (
                  <Badge variant="secondary" className="bg-gray-100 text-gray-600">Inactive</Badge>
                )}
              </div>
              {company.contactPerson && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{company.contactPerson}</span>
                </div>
              )}
              {company.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{company.phone}</span>
                </div>
              )}
              {company.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{company.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">{company._count?.drivers || 0}</div>
                <div className="text-xs text-muted-foreground">Drivers</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{company._count?.guides || 0}</div>
                <div className="text-xs text-muted-foreground">Guides</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600">{company._count?.contracts || 0}</div>
                <div className="text-xs text-muted-foreground">Contracts</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => openEditForm(company)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCompanyActive(company)}
                title={company.isActive ? 'Deactivate' : 'Activate'}
              >
                {company.isActive ? <UserX className="h-4 w-4 text-red-500" /> : <UserCheck className="h-4 w-4 text-green-500" />}
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Supplier Companies</h1>
          <p className="text-muted-foreground mt-1">Manage companies that provide drivers and guides</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Company
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
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
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-blue-600">{stats.withDrivers}</div>
                  <div className="text-sm text-muted-foreground">With Drivers</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-green-600">{stats.withGuides}</div>
                  <div className="text-sm text-muted-foreground">With Guides</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-purple-600">{stats.activeContracts}</div>
                  <div className="text-sm text-muted-foreground">Active Contracts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, contact, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Companies List */}
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
        ) : companies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No companies found</h3>
              <p className="text-muted-foreground">
                {search ? 'Try adjusting your search' : 'Add your first supplier company to get started'}
              </p>
              {!search && (
                <Button className="mt-4" onClick={openCreateForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p - 1)}
                  disabled={!meta.hasPrev}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {meta.page} of {meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!meta.hasNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-lg mx-4">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingCompany ? 'Edit Company' : 'Add Company'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : editingCompany ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Company Details Modal */}
      {(selectedCompany || loadingCompany) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              {loadingCompany ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                </div>
              ) : selectedCompany && (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedCompany.name}</h2>
                        {selectedCompany.contactPerson && (
                          <p className="text-muted-foreground">{selectedCompany.contactPerson}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedCompany(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {selectedCompany.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCompany.phone}</span>
                      </div>
                    )}
                    {selectedCompany.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCompany.email}</span>
                      </div>
                    )}
                    {selectedCompany.address && (
                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedCompany.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {selectedCompany.notes && (
                    <div className="mb-6">
                      <h3 className="font-semibold mb-2">Notes</h3>
                      <p className="text-muted-foreground">{selectedCompany.notes}</p>
                    </div>
                  )}

                  {/* Drivers */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Drivers ({selectedCompany.drivers.length})</h3>
                    {selectedCompany.drivers.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No drivers assigned to this company</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.drivers.map((driver) => (
                          <Badge key={driver.id} variant={driver.isActive ? 'default' : 'secondary'}>
                            {driver.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Guides */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3">Guides ({selectedCompany.guides.length})</h3>
                    {selectedCompany.guides.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No guides assigned to this company</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedCompany.guides.map((guide) => (
                          <Badge key={guide.id} variant={guide.isActive ? 'default' : 'secondary'}>
                            {guide.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Contracts */}
                  <div>
                    <h3 className="font-semibold mb-3">Contracts ({selectedCompany.contracts.length})</h3>
                    {selectedCompany.contracts.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No contracts for this company</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedCompany.contracts.map((contract) => (
                          <Card key={contract.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                                    {contract.status}
                                  </Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {formatDate(contract.startDate)}
                                    {contract.endDate && ` - ${formatDate(contract.endDate)}`}
                                  </span>
                                </div>
                              </div>
                              {contract.rates.length > 0 && (
                                <div className="mt-2">
                                  <div className="text-sm font-medium mb-1">Rates:</div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    {contract.rates.map((rate, idx) => (
                                      <div key={idx} className="flex justify-between text-muted-foreground">
                                        <span>{rate.supplierType}: {getServiceTypeLabel(rate.serviceType)}</span>
                                        <span className="font-medium">${rate.amount}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
