'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Trash2 } from 'lucide-react';
import type { TourDeparturesTabProps, TourDeparture } from './types';

export function TourDeparturesTab({
  departures,
  setDepartures,
  initialData,
}: TourDeparturesTabProps) {
  const addDeparture = () => {
    const today = new Date();
    const startDate = new Date(today.setMonth(today.getMonth() + 1));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (initialData?.duration || 7));

    setDepartures([
      ...departures,
      {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        maxSpots: initialData?.maxGroupSize || 12,
        spotsRemaining: initialData?.maxGroupSize || 12,
        status: 'available',
        isGuaranteed: false,
        isActive: true,
      },
    ]);
  };

  const updateDeparture = (index: number, field: keyof TourDeparture, value: any) => {
    const updated = [...departures];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-update status based on spots remaining
    if (field === 'spotsRemaining') {
      const spots = Number(value);
      const maxSpots = updated[index].maxSpots;
      if (spots === 0) {
        updated[index].status = 'sold_out';
      } else if (spots <= 2) {
        updated[index].status = 'almost_full';
      } else if (spots <= maxSpots * 0.4) {
        updated[index].status = 'filling_fast';
      } else {
        updated[index].status = 'available';
      }
    }

    setDepartures(updated);
  };

  const removeDeparture = (index: number) => {
    setDepartures(departures.filter((_, i) => i !== index));
  };

  return (
    <Card className="border border-gray-300">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Tour Departures</h3>
            <p className="text-sm text-muted-foreground">
              Manage scheduled departure dates and availability
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addDeparture}>
            <Plus className="h-4 w-4 mr-2" />
            Add Departure
          </Button>
        </div>

        {departures.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">No departures scheduled</h4>
            <p className="text-sm text-gray-500 mb-4">
              Add departure dates to show availability on the tour page
            </p>
            <Button type="button" variant="outline" onClick={addDeparture}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Departure
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {departures.map((departure, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-white hover:border-gray-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        departure.status === 'available' ? 'default' :
                        departure.status === 'filling_fast' ? 'secondary' :
                        departure.status === 'almost_full' ? 'destructive' :
                        departure.status === 'sold_out' ? 'outline' : 'secondary'
                      }
                    >
                      {departure.status.replace('_', ' ')}
                    </Badge>
                    {departure.isGuaranteed && (
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        Guaranteed
                      </Badge>
                    )}
                    {!departure.isActive && (
                      <Badge variant="outline" className="border-gray-400 text-gray-500">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDeparture(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label>Start Date *</Label>
                    <Input
                      type="date"
                      value={departure.startDate}
                      onChange={(e) => updateDeparture(index, 'startDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>End Date *</Label>
                    <Input
                      type="date"
                      value={departure.endDate}
                      onChange={(e) => updateDeparture(index, 'endDate', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Max Spots</Label>
                    <Input
                      type="number"
                      min={1}
                      value={departure.maxSpots}
                      onChange={(e) => updateDeparture(index, 'maxSpots', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Spots Remaining</Label>
                    <Input
                      type="number"
                      min={0}
                      max={departure.maxSpots}
                      value={departure.spotsRemaining}
                      onChange={(e) => updateDeparture(index, 'spotsRemaining', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label>Status</Label>
                    <Select
                      value={departure.status}
                      onValueChange={(value) => updateDeparture(index, 'status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="filling_fast">Filling Fast</SelectItem>
                        <SelectItem value="almost_full">Almost Full</SelectItem>
                        <SelectItem value="sold_out">Sold Out</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Price Modifier (%)</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={departure.priceModifier || ''}
                      onChange={(e) => updateDeparture(index, 'priceModifier', e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      e.g., 10 for +10%, -15 for -15%
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 pt-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`guaranteed-${index}`}
                        checked={departure.isGuaranteed}
                        onChange={(e) => updateDeparture(index, 'isGuaranteed', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`guaranteed-${index}`} className="font-normal cursor-pointer text-sm">
                        Guaranteed Departure
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`active-${index}`}
                        checked={departure.isActive}
                        onChange={(e) => updateDeparture(index, 'isActive', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor={`active-${index}`} className="font-normal cursor-pointer text-sm">
                        Active (visible)
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
