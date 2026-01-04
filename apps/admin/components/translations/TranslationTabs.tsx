'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Copy } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/shared';

type Locale = 'en' | 'ru' | 'uz';

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ru', label: 'Русский' },
  { value: 'uz', label: "O'zbek" },
];

interface TranslationField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'array';
  required?: boolean;
  placeholder?: string;
}

interface TranslationTabsProps {
  entityType: 'tours' | 'blog' | 'categories' | 'blog-categories' | 'cities' | 'itinerary' | 'tour-faq';
  entityId: string;
  fields: TranslationField[];
  onSaveSuccess?: () => void;
}

interface Translation {
  locale: Locale;
  [key: string]: any;
}

export function TranslationTabs({
  entityType,
  entityId,
  fields,
  onSaveSuccess,
}: TranslationTabsProps) {
  const [activeLocale, setActiveLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Record<Locale, Translation | null>>({
    en: null,
    ru: null,
    uz: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Record<Locale, Record<string, any>>>({
    en: {},
    ru: {},
    uz: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchTranslations();
  }, [entityType, entityId]);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const data = await api.get<Translation[]>(`/api/admin/translations/${entityType}/${entityId}`);

      const translationsMap: Record<Locale, Translation | null> = {
        en: null,
        ru: null,
        uz: null,
      };

      const formDataMap: Record<Locale, Record<string, any>> = {
        en: {},
        ru: {},
        uz: {},
      };

      data.forEach((translation) => {
        const locale = translation.locale as Locale;
        translationsMap[locale] = translation;
        formDataMap[locale] = { ...translation };
      });

      setTranslations(translationsMap);
      setFormData(formDataMap);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load translations');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        [field]: value,
      },
    }));

    // Clear error for this field
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const currentData = formData[activeLocale];

    fields.forEach((field) => {
      if (field.required && !currentData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }

    try {
      setSaving(true);
      const currentData = formData[activeLocale];

      // Remove locale and id fields from data
      const { locale, id, createdAt, updatedAt, ...dataToSave } = currentData;

      await api.put(
        `/api/admin/translations/${entityType}/${entityId}/${activeLocale}`,
        dataToSave
      );

      toast.success(`${LOCALES.find((l) => l.value === activeLocale)?.label} translation saved successfully`);

      // Refresh translations
      await fetchTranslations();

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error: any) {
      if (error.message.includes('slug')) {
        setErrors({ slug: error.message });
      }
      toast.error(error.message || 'Failed to save translation');
    } finally {
      setSaving(false);
    }
  };

  const handleCopyFromEnglish = () => {
    if (!formData.en || Object.keys(formData.en).length === 0) {
      toast.error('English translation not available');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [activeLocale]: {
        ...prev[activeLocale],
        ...formData.en,
        locale: activeLocale, // Keep the correct locale
      },
    }));

    toast.success('Copied from English');
  };

  const renderField = (field: TranslationField) => {
    const currentData = formData[activeLocale] || {};
    const value = currentData[field.name] || '';
    const error = errors[field.name];

    if (field.type === 'text') {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Input
            id={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={error ? 'border-red-500' : ''}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <Textarea
            id={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={error ? 'border-red-500' : ''}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );
    }

    if (field.type === 'richtext') {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <RichTextEditor
            value={value}
            onChange={(newValue) => handleFieldChange(field.name, newValue)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );
    }

    if (field.type === 'array') {
      const arrayValue = Array.isArray(value) ? value : [];

      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          <div className="space-y-2">
            {arrayValue.map((item, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newArray = [...arrayValue];
                    newArray[index] = e.target.value;
                    handleFieldChange(field.name, newArray);
                  }}
                  placeholder={field.placeholder}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const newArray = arrayValue.filter((_, i) => i !== index);
                    handleFieldChange(field.name, newArray);
                  }}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                handleFieldChange(field.name, [...arrayValue, '']);
              }}
            >
              Add {field.label}
            </Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading translations...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Tabs value={activeLocale} onValueChange={(value) => setActiveLocale(value as Locale)}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              {LOCALES.map((locale) => (
                <TabsTrigger key={locale.value} value={locale.value} className="gap-2">
                  {locale.label}
                  {!translations[locale.value] && (
                    <Badge variant="secondary" className="ml-2">
                      Missing
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="flex gap-2">
              {activeLocale !== 'en' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyFromEnglish}
                  disabled={!formData.en || Object.keys(formData.en).length === 0}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy from English
                </Button>
              )}
              <Button
                type="button"
                onClick={handleSave}
                disabled={saving}
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Translation'}
              </Button>
            </div>
          </div>

          {LOCALES.map((locale) => (
            <TabsContent key={locale.value} value={locale.value} className="space-y-4 mt-6">
              {fields.map((field) => renderField(field))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
