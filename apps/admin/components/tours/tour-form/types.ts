// Tour Form Types - Shared across all tab components

import { z } from 'zod';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface TourDeparture {
  id?: string;
  startDate: string;
  endDate: string;
  maxSpots: number;
  spotsRemaining: number;
  status: 'available' | 'filling_fast' | 'almost_full' | 'sold_out' | 'cancelled';
  priceModifier?: number;
  isGuaranteed: boolean;
  isActive: boolean;
}

export interface PricingTier {
  id?: string;
  minGuests: number;
  maxGuests: number;
  pricePerPerson: number;
  order: number;
  translations: {
    locale: string;
    label: string;
  }[];
}

export interface FAQItem {
  id?: string;
  order: number;
  translations: {
    locale: string;
    question: string;
    answer: string;
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

// ============================================
// SCHEMA
// ============================================

export const tourSchema = z.object({
  // Basic Info
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').max(250),
  categoryId: z.string().min(1, 'Category is required'),
  duration: z.number().min(1, 'Duration must be at least 1 day'),
  maxGroupSize: z.number().min(1, 'Group size must be at least 1').optional(),
  difficulty: z.string().optional(),

  // Description
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),

  // Pricing
  price: z.number().min(0, 'Price must be positive'),
  discountedPrice: z.number().min(0).optional(),
  showPrice: z.boolean().optional(),

  // Status
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),

  // SEO
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

export type TourFormData = z.infer<typeof tourSchema>;

export interface TourFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  submitting: boolean;
}

// ============================================
// TAB PROP INTERFACES
// ============================================

export interface TourBasicInfoTabProps {
  register: any;
  errors: any;
  watch: any;
  setValue: any;
  categories: Category[];
  highlights: string[];
  setHighlights: React.Dispatch<React.SetStateAction<string[]>>;
  included: string[];
  setIncluded: React.Dispatch<React.SetStateAction<string[]>>;
  excluded: string[];
  setExcluded: React.Dispatch<React.SetStateAction<string[]>>;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  onTitleChange: (title: string) => void;
}

export interface TourDescriptionTabProps {
  register: any;
  errors: any;
  watch: any;
  setValue: any;
}

export interface TourPricingTabProps {
  register: any;
  errors: any;
}

export interface TourDeparturesTabProps {
  departures: TourDeparture[];
  setDepartures: React.Dispatch<React.SetStateAction<TourDeparture[]>>;
  initialData?: any;
}

export interface TourPricingTiersTabProps {
  pricingTiers: PricingTier[];
  setPricingTiers: React.Dispatch<React.SetStateAction<PricingTier[]>>;
  initialData?: any;
}

export interface TourFAQTabProps {
  faqs: FAQItem[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQItem[]>>;
}

export interface TourSEOTabProps {
  register: any;
}
