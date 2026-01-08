'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Trash2 } from 'lucide-react';
import type { TourPricingTiersTabProps, PricingTier } from './types';

export function TourPricingTiersTab({
  pricingTiers,
  setPricingTiers,
  initialData,
}: TourPricingTiersTabProps) {
  const addPricingTier = () => {
    const lastTier = pricingTiers[pricingTiers.length - 1];
    const newMinGuests = lastTier ? lastTier.maxGuests + 1 : 1;

    setPricingTiers([
      ...pricingTiers,
      {
        minGuests: newMinGuests,
        maxGuests: newMinGuests + 1,
        pricePerPerson: Number(initialData?.price) || 100,
        order: pricingTiers.length,
        translations: [
          { locale: 'en', label: `${newMinGuests}-${newMinGuests + 1} People` },
          { locale: 'ru', label: `${newMinGuests}-${newMinGuests + 1} человек` },
          { locale: 'uz', label: `${newMinGuests}-${newMinGuests + 1} kishi` },
        ],
      },
    ]);
  };

  const updatePricingTier = (index: number, field: string, value: any) => {
    const updated = [...pricingTiers];
    if (field.startsWith('translation_')) {
      const [_, locale, transField] = field.split('_');
      const transIndex = updated[index].translations.findIndex(t => t.locale === locale);
      if (transIndex >= 0) {
        updated[index].translations[transIndex] = {
          ...updated[index].translations[transIndex],
          [transField]: value,
        };
      }
    } else {
      (updated[index] as any)[field] = value;
    }
    setPricingTiers(updated);
  };

  const removePricingTier = (index: number) => {
    setPricingTiers(pricingTiers.filter((_, i) => i !== index));
  };

  return (
    <Card className="border border-gray-300">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Group Pricing Tiers</h3>
            <p className="text-sm text-muted-foreground">
              Set different prices based on group size
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addPricingTier}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tier
          </Button>
        </div>

        {pricingTiers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">No pricing tiers defined</h4>
            <p className="text-sm text-gray-500 mb-4">
              Add group-based pricing to offer discounts for larger groups
            </p>
            <Button type="button" variant="outline" onClick={addPricingTier}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Tier
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-white hover:border-gray-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline">Tier {index + 1}</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePricingTier(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>Min Guests *</Label>
                    <Input
                      type="number"
                      min={1}
                      value={tier.minGuests}
                      onChange={(e) => updatePricingTier(index, 'minGuests', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Max Guests *</Label>
                    <Input
                      type="number"
                      min={tier.minGuests}
                      value={tier.maxGuests}
                      onChange={(e) => updatePricingTier(index, 'maxGuests', Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label>Price per Person (USD) *</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.01}
                      value={tier.pricePerPerson}
                      onChange={(e) => updatePricingTier(index, 'pricePerPerson', Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Labels (Translations)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">English</Label>
                      <Input
                        placeholder="1-2 People"
                        value={tier.translations.find(t => t.locale === 'en')?.label || ''}
                        onChange={(e) => updatePricingTier(index, 'translation_en_label', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Russian</Label>
                      <Input
                        placeholder="1-2 человека"
                        value={tier.translations.find(t => t.locale === 'ru')?.label || ''}
                        onChange={(e) => updatePricingTier(index, 'translation_ru_label', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Uzbek</Label>
                      <Input
                        placeholder="1-2 kishi"
                        value={tier.translations.find(t => t.locale === 'uz')?.label || ''}
                        onChange={(e) => updatePricingTier(index, 'translation_uz_label', e.target.value)}
                      />
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
