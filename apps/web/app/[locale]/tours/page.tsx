import { getTours, getCategories } from '@/lib/api';
import { getLocale, getTranslations } from 'next-intl/server';
import { ToursClient } from './tours-client';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tours' });

  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function ToursPage() {
  const locale = await getLocale();

  // Fetch initial data
  const [toursData, categories] = await Promise.all([
    getTours({ page: 1, limit: 9, locale }),
    getCategories({ locale }),
  ]);

  return (
    <ToursClient
      initialTours={toursData}
      categories={categories}
      locale={locale}
    />
  );
}
