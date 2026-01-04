import { getTourBySlug } from '@/lib/api';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { TourDetailClient } from './tour-detail-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  try {
    const tour = await getTourBySlug(slug, locale);

    return {
      title: tour.metaTitle || tour.title,
      description: tour.metaDescription || tour.summary || tour.description?.substring(0, 160),
    };
  } catch (error) {
    return {
      title: 'Tour Not Found',
      description: 'The requested tour could not be found',
    };
  }
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();

  try {
    const tour = await getTourBySlug(slug, locale);

    return <TourDetailClient tour={tour} />;
  } catch (error) {
    notFound();
  }
}
