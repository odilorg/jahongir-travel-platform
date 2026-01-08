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
  FileText,
  Building2,
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
}

interface ContractRate {
  id: string;
  supplierType: string;
  serviceType: string;
  amount: string;
  currency: string;
  notes?: string;
}

interface Contract {
  id: string;
  companyId: string;
  startDate: string;
  endDate?: string;
  status: string;
  terms?: string;
  notes?: string;
  createdAt: string;
  company: Company;
  rates: ContractRate[];
  _count?: {
    rates: number;
  };
}

interface ContractsResponse {
  data: Contract[];
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
  expired: number;
  pending: number;
}

interface RateFormData {
  supplierType: string;
  serviceType: string;
  amount: string;
  currency: string;
}

const SERVICE_TYPES = {
  driver: [
    { value: 'airport_transfer', label: 'Airport Transfer' },
    { value: 'half_day', label: 'Half Day (4h)' },
    { value: 'full_day', label: 'Full Day (8h)' },
    { value: 'multi_day', label: 'Multi Day (per day)' },
    { value: 'per_km', label: 'Per Kilometer' },
  ],
  guide: [
    { value: 'half_day', label: 'Half Day (4h)' },
    { value: 'full_day', label: 'Full Day (8h)' },
    { value: 'multi_day', label: 'Multi Day (per day)' },
  ],
};

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'expired', label: 'Expired' },
  { value: 'terminated', label: 'Terminated' },
];

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<ContractsResponse['meta'] | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState({
    companyId: '',
    startDate: '',
    endDate: '',
    status: 'active',
    terms: '',
    notes: '',
  });
  const [rates, setRates] = useState<RateFormData[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContracts();
    fetchCompanies();
    fetchStats();
  }, [page, statusFilter]);

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '10');
      if (statusFilter) params.set('status', statusFilter);

      const response = await api.get<ContractsResponse>(`/contracts?${params.toString()}`);
      setContracts(response.data);
      setMeta(response.meta);
    } catch (error: any) {
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get<{ data: Company[] }>('/supplier-companies?limit=100');
      setCompanies(response.data);
    } catch (error: any) {
      console.error('Failed to fetch companies:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await api.get<Stats>('/contracts/stats');
      setStats(data);
    } catch (error: any) {
      console.error('Stats fetch error:', error);
    }
  };

  const openCreateForm = () => {
    setEditingContract(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      companyId: '',
      startDate: today,
      endDate: '',
      status: 'active',
      terms: '',
      notes: '',
    });
    setRates([]);
    setShowForm(true);
  };

  const openEditForm = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      companyId: contract.companyId,
      startDate: contract.startDate.split('T')[0],
      endDate: contract.endDate ? contract.endDate.split('T')[0] : '',
      status: contract.status,
      terms: contract.terms || '',
      notes: contract.notes || '',
    });
    setRates(contract.rates.map(r => ({
      supplierType: r.supplierType,
      serviceType: r.serviceType,
      amount: r.amount,
      currency: r.currency,
    })));
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        endDate: formData.endDate || undefined,
        rates: rates.map(r => ({
          ...r,
          amount: parseFloat(r.amount),
        })),
      };

      if (editingContract) {
        await api.patch(`/contracts/${editingContract.id}`, payload);
        // Update rates separately
        if (rates.length > 0) {
          await api.post(`/contracts/${editingContract.id}/rates`, rates.map(r => ({
            ...r,
            amount: parseFloat(r.amount),
          })));
        }
        toast.success('Contract updated successfully');
      } else {
        await api.post('/contracts', payload);
        toast.success('Contract created successfully');
      }
      setShowForm(false);
      fetchContracts();
      fetchStats();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save contract');
    } finally {
      setSaving(false);
    }
  };

  const deleteContract = async (contract: Contract) => {
    if (!confirm('Are you sure you want to delete this contract?')) return;

    try {
      await api.delete(`/contracts/${contract.id}`);
      toast.success('Contract deleted successfully');
      fetchContracts();
      fetchStats();
    } catch (error: any) {
      toast.error('Failed to delete contract');
    }
  };

  const addRate = () => {
    setRates([...rates, { supplierType: 'driver', serviceType: 'full_day', amount: '', currency: 'USD' }]);
  };

  const removeRate = (index: number) => {
    setRates(rates.filter((_, i) => i !== index));
  };

  const updateRate = (index: number, field: keyof RateFormData, value: string) => {
    const newRates = [...rates];
    newRates[index] = { ...newRates[index], [field]: value };
    // Reset service type when supplier type changes
    if (field === 'supplierType') {
      newRates[index].serviceType = value === 'driver' ? 'full_day' : 'full_day';
    }
    setRates(newRates);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getServiceTypeLabel = (type: string) => {
    const allTypes = [...SERVICE_TYPES.driver, ...SERVICE_TYPES.guide];
    return allTypes.find(t => t.value === type)?.label || type;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ContractCard = ({ contract }: { contract: Contract }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 cursor-pointer" onClick={() => setSelectedContract(contract)}>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{contract.company.name}</h3>
                <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(contract.startDate)}
                  {contract.endDate && ` - ${formatDate(contract.endDate)}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{contract.rates.length} rate{contract.rates.length !== 1 ? 's' : ''} defined</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => openEditForm(contract)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteContract(contract)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* Show rates preview */}
        {contract.rates.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {contract.rates.slice(0, 4).map((rate, idx) => (
                <div key={idx} className="text-sm">
                  <span className="text-muted-foreground capitalize">{rate.supplierType}: </span>
                  <span className="font-medium">${rate.amount}</span>
                  <span className="text-muted-foreground text-xs"> ({getServiceTypeLabel(rate.serviceType)})</span>
                </div>
              ))}
              {contract.rates.length > 4 && (
                <div className="text-sm text-muted-foreground">+{contract.rates.length - 4} more</div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contracts</h1>
          <p className="text-muted-foreground mt-1">Manage supplier company contracts and rates</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Contract
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
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
                <FileText className="h-5 w-5 text-green-600" />
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
                <FileText className="h-5 w-5 text-yellow-600" />
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="text-2xl font-bold text-gray-400">{stats.expired}</div>
                  <div className="text-sm text-muted-foreground">Expired</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contracts List */}
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
        ) : contracts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contracts found</h3>
              <p className="text-muted-foreground">
                {statusFilter ? 'Try changing the filter' : 'Add your first contract to get started'}
              </p>
              {!statusFilter && (
                <Button className="mt-4" onClick={openCreateForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contract
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {contracts.map((contract) => (
              <ContractCard key={contract.id} contract={contract} />
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
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingContract ? 'Edit Contract' : 'Add Contract'}
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="companyId">Company *</Label>
                  <Select
                    value={formData.companyId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, companyId: value }))}
                    disabled={!!editingContract}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="terms">Terms</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                    rows={2}
                    placeholder="Contract terms and conditions..."
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                  />
                </div>

                {/* Rates Section */}
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-lg">Rates</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addRate}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Rate
                    </Button>
                  </div>

                  {rates.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No rates added yet. Click "Add Rate" to define pricing.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {rates.map((rate, idx) => (
                        <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                          <div className="col-span-3">
                            <Label className="text-xs">Type</Label>
                            <Select
                              value={rate.supplierType}
                              onValueChange={(value) => updateRate(idx, 'supplierType', value)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="driver">Driver</SelectItem>
                                <SelectItem value="guide">Guide</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-4">
                            <Label className="text-xs">Service</Label>
                            <Select
                              value={rate.serviceType}
                              onValueChange={(value) => updateRate(idx, 'serviceType', value)}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {SERVICE_TYPES[rate.supplierType as keyof typeof SERVICE_TYPES].map((st) => (
                                  <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Amount</Label>
                            <Input
                              type="number"
                              className="h-9"
                              value={rate.amount}
                              onChange={(e) => updateRate(idx, 'amount', e.target.value)}
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                          <div className="col-span-2">
                            <Label className="text-xs">Currency</Label>
                            <Select
                              value={rate.currency}
                              onValueChange={(value) => updateRate(idx, 'currency', value)}
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
                          <div className="col-span-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-9 px-2"
                              onClick={() => removeRate(idx)}
                            >
                              <X className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving || !formData.companyId}>
                    {saving ? 'Saving...' : editingContract ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contract Details Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold">{selectedContract.company.name}</h2>
                      <Badge className={getStatusColor(selectedContract.status)}>
                        {selectedContract.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">
                      {formatDate(selectedContract.startDate)}
                      {selectedContract.endDate && ` - ${formatDate(selectedContract.endDate)}`}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedContract(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Terms */}
              {selectedContract.terms && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Terms</h3>
                  <p className="text-muted-foreground">{selectedContract.terms}</p>
                </div>
              )}

              {/* Notes */}
              {selectedContract.notes && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-muted-foreground">{selectedContract.notes}</p>
                </div>
              )}

              {/* Rates */}
              <div>
                <h3 className="font-semibold mb-4">Rates ({selectedContract.rates.length})</h3>
                {selectedContract.rates.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No rates defined for this contract</p>
                ) : (
                  <div className="space-y-2">
                    {selectedContract.rates.map((rate) => (
                      <div key={rate.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="capitalize font-medium">{rate.supplierType}</span>
                          <span className="text-muted-foreground mx-2">-</span>
                          <span>{getServiceTypeLabel(rate.serviceType)}</span>
                        </div>
                        <div className="font-bold">
                          {rate.currency === 'USD' ? '$' : ''}{rate.amount} {rate.currency}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                <Button variant="outline" onClick={() => openEditForm(selectedContract)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" onClick={() => setSelectedContract(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
