'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, HelpCircle, Trash2 } from 'lucide-react';
import type { TourFAQTabProps, FAQItem } from './types';

export function TourFAQTab({ faqs, setFaqs }: TourFAQTabProps) {
  const addFAQ = () => {
    setFaqs([
      ...faqs,
      {
        order: faqs.length,
        translations: [
          { locale: 'en', question: '', answer: '' },
          { locale: 'ru', question: '', answer: '' },
          { locale: 'uz', question: '', answer: '' },
        ],
      },
    ]);
  };

  const updateFAQ = (index: number, locale: string, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    const transIndex = updated[index].translations.findIndex(t => t.locale === locale);
    if (transIndex >= 0) {
      updated[index].translations[transIndex] = {
        ...updated[index].translations[transIndex],
        [field]: value,
      };
    }
    setFaqs(updated);
  };

  const removeFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  return (
    <Card className="border border-gray-300">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            <p className="text-sm text-muted-foreground">
              Add common questions and answers for this tour
            </p>
          </div>
          <Button type="button" variant="outline" onClick={addFAQ}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
        </div>

        {faqs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-sm font-medium text-gray-900 mb-1">No FAQs added</h4>
            <p className="text-sm text-gray-500 mb-4">
              Add frequently asked questions to help customers
            </p>
            <Button type="button" variant="outline" onClick={addFAQ}>
              <Plus className="h-4 w-4 mr-2" />
              Add First FAQ
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-white hover:border-gray-400 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline">FAQ #{index + 1}</Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFAQ(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* English */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">EN</Badge>
                    <span className="text-sm font-medium">English</span>
                  </div>
                  <div>
                    <Label className="text-xs">Question</Label>
                    <Input
                      placeholder="What should I pack for this tour?"
                      value={faq.translations.find(t => t.locale === 'en')?.question || ''}
                      onChange={(e) => updateFAQ(index, 'en', 'question', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Answer</Label>
                    <Textarea
                      placeholder="We recommend packing..."
                      rows={2}
                      value={faq.translations.find(t => t.locale === 'en')?.answer || ''}
                      onChange={(e) => updateFAQ(index, 'en', 'answer', e.target.value)}
                    />
                  </div>
                </div>

                {/* Russian */}
                <div className="space-y-3 mb-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">RU</Badge>
                    <span className="text-sm font-medium">Russian</span>
                  </div>
                  <div>
                    <Label className="text-xs">Вопрос</Label>
                    <Input
                      placeholder="Что мне взять с собой?"
                      value={faq.translations.find(t => t.locale === 'ru')?.question || ''}
                      onChange={(e) => updateFAQ(index, 'ru', 'question', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Ответ</Label>
                    <Textarea
                      placeholder="Мы рекомендуем взять..."
                      rows={2}
                      value={faq.translations.find(t => t.locale === 'ru')?.answer || ''}
                      onChange={(e) => updateFAQ(index, 'ru', 'answer', e.target.value)}
                    />
                  </div>
                </div>

                {/* Uzbek */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">UZ</Badge>
                    <span className="text-sm font-medium">Uzbek</span>
                  </div>
                  <div>
                    <Label className="text-xs">Savol</Label>
                    <Input
                      placeholder="Sayohat uchun nimalar olib ketishim kerak?"
                      value={faq.translations.find(t => t.locale === 'uz')?.question || ''}
                      onChange={(e) => updateFAQ(index, 'uz', 'question', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Javob</Label>
                    <Textarea
                      placeholder="Biz tavsiya qilamiz..."
                      rows={2}
                      value={faq.translations.find(t => t.locale === 'uz')?.answer || ''}
                      onChange={(e) => updateFAQ(index, 'uz', 'answer', e.target.value)}
                    />
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
