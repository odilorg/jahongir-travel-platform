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
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Pencil,
  Users,
  Calendar,
  Palette,
  Hash,
  Truck,
} from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Driver {
  id: string;
  name: string;
  phone?: string;
  isActive: boolean;
}

interface DriverVehicle {
  id: string;
  driverId: string;
  vehicleId: string;
  isPrimary: boolean;
  driver: Driver;
}

interface Vehicle {
  id: string;
  drivers: DriverVehicle[];  // Many-to-many: vehicle can have multiple drivers
  plateNumber: string;
  make: string;
  model: string;
  year?: number;
  color?: string;
  capacity?: number;
  type: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

interface VehiclesResponse {
  data: Vehicle[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface DriversResponse {
  data: Driver[];
  meta: {
    total: number;
  };
}

const VEHICLE_TYPES = [
  { value: 'sedan', label: 'Sedan', icon: '🚗' },
  { value: 'suv', label: 'SUV', icon: '🚙' },
  { value: 'minivan', label: 'Minivan', icon: '🚐' },
  { value: 'van', label: 'Van', icon: '🚌' },
  { value: 'bus', label: 'Bus', icon: '🚎' },
];

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<VehiclesResponse['meta'] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState({
    driverId: '',
    plateNumber: '',
    make: '',
    model: '',
    year: '',
    color: '',
    capacity: '',
    type: 'sedan',
    notes: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, [page, typeFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchVehicles();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (typeFilter) params.set('type', typeFilter);

      const response = await api.get<VehiclesResponse>(`/vehicles?${params.toString()}`);

      // Filter by search on client side (plate, make, model, driver name)
      let filteredData = response.data;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredData = response.data.filter(v =>
          v.plateNumber.toLowerCase().includes(searchLower) ||
          v.make.toLowerCase().includes(searchLower) ||
          v.model.toLowerCase().includes(searchLower) ||
          (v.drivers && v.drivers.length > 0 && v.drivers.some(dv => dv.driver.name.toLowerCase().includes(searchLower)))
        );
      }

      setVehicles(filteredData);
      setMeta(response.meta);
    } catch (error: any) {
      toast.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await api.get<DriversResponse>('/drivers?limit=100&isActive=true');
      setDrivers(response.data);
    } catch (error: any) {
      console.error('Failed to load drivers:', error);
    }
  };

  const openCreateForm = () => {
    setEditingVehicle(null);
    setFormData({
      driverId: '',
      plateNumber: '',
      make: '',
      model: '',
      year: '',
      color: '',
      capacity: '',
      type: 'sedan',
      notes: '',
    });
    setShowForm(true);
  };

  const openEditForm = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      driverId: vehicle.drivers[0]?.driverId || '',  // Get primary driver
      plateNumber: vehicle.plateNumber,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year?.toString() || '',
      color: vehicle.color || '',
      capacity: vehicle.capacity?.toString() || '',
      type: vehicle.type,
      notes: vehicle.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        year: formData.year ? parseInt(formData.year) : undefined,
        capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      };

      if (editingVehicle) {
        await api.patch(`/vehicles/${editingVehicle.id}`, payload);
        toast.success('Vehicle updated successfully');
      } else {
        await api.post('/vehicles', payload);
        toast.success('Vehicle created successfully');
      }
      setShowForm(false);
      fetchVehicles();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save vehicle');
    } finally {
      setSaving(false);
    }
  };

  const toggleVehicleActive = async (vehicle: Vehicle) => {
    try {
      await api.patch(`/vehicles/${vehicle.id}`, { isActive: !vehicle.isActive });
      toast.success(vehicle.isActive ? 'Vehicle deactivated' : 'Vehicle activated');
      fetchVehicles();
    } catch (error: any) {
      toast.error('Failed to update vehicle');
    }
  };

  const deleteVehicle = async (vehicle: Vehicle) => {
    if (!confirm(`Are you sure you want to delete ${vehicle.make} ${vehicle.model} (${vehicle.plateNumber})?`)) {
      return;
    }
    try {
      await api.delete(`/vehicles/${vehicle.id}`);
      toast.success('Vehicle deleted successfully');
      fetchVehicles();
    } catch (error: any) {
      toast.error('Failed to delete vehicle');
    }
  };

  const getTypeIcon = (type: string) => {
    return VEHICLE_TYPES.find(t => t.value === type)?.icon || '🚗';
  };

  const getTypeLabel = (type: string) => {
    return VEHICLE_TYPES.find(t => t.value === type)?.label || type;
  };

  // Group vehicles by driver (using primary driver or 'Unassigned')
  const vehiclesByDriver = vehicles.reduce((acc, vehicle) => {
    const driverName = vehicle.drivers[0]?.driver?.name || 'Unassigned';
    if (!acc[driverName]) {
      acc[driverName] = [];
    }
    acc[driverName].push(vehicle);
    return acc;
  }, {} as Record<string, Vehicle[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vehicles</h1>
          <p className="text-muted-foreground mt-1">Manage driver vehicles and fleet</p>
        </div>
        <Button onClick={openCreateForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {VEHICLE_TYPES.map(type => {
          const count = vehicles.filter(v => v.type === type.value).length;
          return (
            <Card
              key={type.value}
              className={`cursor-pointer hover:shadow-md transition-shadow ${typeFilter === type.value ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setTypeFilter(typeFilter === type.value ? '' : type.value)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">{type.icon}</div>
                <div className="text-xl font-bold">{count}</div>
                <div className="text-xs text-muted-foreground">{type.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by plate, make, model, or driver..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {typeFilter && (
          <Button variant="outline" onClick={() => setTypeFilter('')}>
            Clear Filter
            <X className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Vehicles List */}
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
      ) : vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
            <p className="text-muted-foreground">
              {search || typeFilter ? 'Try adjusting your filters' : 'Add your first vehicle to get started'}
            </p>
            {!search && !typeFilter && (
              <Button className="mt-4" onClick={openCreateForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(vehiclesByDriver).map(([driverName, driverVehicles]) => (
            <div key={driverName}>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                {driverName}
                <Badge variant="secondary">{driverVehicles.length} vehicles</Badge>
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {driverVehicles.map((vehicle) => (
                  <Card
                    key={vehicle.id}
                    className={`hover:shadow-md transition-shadow ${!vehicle.isActive ? 'opacity-60' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{getTypeIcon(vehicle.type)}</div>
                          <div>
                            <h4 className="font-semibold">{vehicle.make} {vehicle.model}</h4>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Hash className="h-3 w-3" />
                              <span className="font-mono">{vehicle.plateNumber}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={vehicle.isActive ? 'default' : 'secondary'}>
                          {getTypeLabel(vehicle.type)}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm mb-3">
                        {vehicle.year && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Year: {vehicle.year}</span>
                          </div>
                        )}
                        {vehicle.color && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Palette className="h-3.5 w-3.5" />
                            <span>{vehicle.color}</span>
                          </div>
                        )}
                        {vehicle.capacity && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-3.5 w-3.5" />
                            <span>{vehicle.capacity} passengers</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditForm(vehicle)}>
                          <Pencil className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant={vehicle.isActive ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => toggleVehicleActive(vehicle)}
                        >
                          {vehicle.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {meta.totalPages} ({meta.total} total)
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button variant="outline" size="sm" disabled={page === meta.totalPages} onClick={() => setPage(page + 1)}>
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
          <Card className="w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="driverId">Driver {!editingVehicle && '*'}</Label>
                  <Select
                    value={formData.driverId || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, driverId: value === 'none' ? '' : value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No driver (unassigned)</SelectItem>
                      {drivers
                        .filter((driver) => {
                          // Show driver if:
                          // 1. It's the one currently assigned to this vehicle, OR
                          // 2. It's not assigned to any other vehicle
                          const currentVehicleDriverId = editingVehicle?.drivers?.[0]?.driverId;
                          if (driver.id === currentVehicleDriverId) return true;

                          // Check if driver is assigned to another vehicle
                          const isAssignedToOther = vehicles.some(
                            (v) => v.id !== editingVehicle?.id && v.drivers?.some((d) => d.driverId === driver.id)
                          );
                          return !isAssignedToOther;
                        })
                        .map((driver) => (
                          <SelectItem key={driver.id} value={driver.id}>
                            {driver.name} {driver.phone ? `(${driver.phone})` : ''}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="make">Make *</Label>
                    <Input
                      id="make"
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      placeholder="e.g., Toyota"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="model">Model *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="e.g., Hiace"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="plateNumber">Plate Number *</Label>
                  <Input
                    id="plateNumber"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
                    placeholder="e.g., 01A123BC"
                    required
                    className="font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="1990"
                      max="2030"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      placeholder="e.g., 2020"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="e.g., White"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Vehicle Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICLE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      max="50"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      placeholder="e.g., 8"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={2}
                    placeholder="Any additional notes about this vehicle..."
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
