// Common types shared across the platform

// ============================================================================
// INTERNATIONALIZATION (i18n)
// ============================================================================

/**
 * Supported locales for the platform
 * - 'ru': Russian (default, no URL prefix)
 * - 'en': English (/en/ prefix)
 * - 'uz': Uzbek (/uz/ prefix)
 */
export type Locale = 'en' | 'ru' | 'uz';

/**
 * Default locale used as fallback
 */
export const DEFAULT_LOCALE: Locale = 'en';

/**
 * All supported locales
 */
export const SUPPORTED_LOCALES: readonly Locale[] = ['en', 'ru', 'uz'] as const;

/**
 * Locale metadata
 */
export interface LocaleMetadata {
  code: Locale;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const LOCALE_METADATA: Record<Locale, LocaleMetadata> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇬🇧',
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    flag: '🇷🇺',
  },
  uz: {
    code: 'uz',
    name: 'Uzbek',
    nativeName: 'O\'zbek',
    direction: 'ltr',
    flag: '🇺🇿',
  },
};

/**
 * Base interface for translatable entities
 */
export interface Translatable<T> {
  translations: T[];
}

/**
 * Base translation fields
 */
export interface BaseTranslation {
  id: string;
  locale: Locale;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Response wrapper for localized content
 * Includes metadata about fallback usage
 */
export interface LocalizedResponse<T> {
  data: T;
  locale: Locale;
  requestedLocale?: Locale;
  fallback: boolean;
}

/**
 * Translation coverage information
 */
export interface TranslationCoverage {
  total: number;
  available: number;
  missing: Locale[];
  percentage: number;
}

/**
 * Utility type to check if locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return SUPPORTED_LOCALES.includes(locale as Locale);
}

/**
 * Get locale with fallback to default
 */
export function getValidLocale(locale?: string | null): Locale {
  if (locale && isValidLocale(locale)) {
    return locale;
  }
  return DEFAULT_LOCALE;
}

// ============================================================================
// EXISTING TYPES
// ============================================================================

export type Status = 'active' | 'inactive' | 'archived';

export type UserRole = 'user' | 'admin' | 'super_admin';

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

// Tour types
export interface Tour {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  duration: number;
  maxGroupSize?: number;
  difficulty?: string;
  categoryId: string;
  images: string[];
  highlights: string[];
  included: string[];
  excluded: string[];
  metaTitle?: string;
  metaDescription?: string;
  showPrice: boolean;
  discountedPrice?: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface TourCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface ItineraryItem {
  id: string;
  tourId: string;
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

// Booking types
export interface Booking {
  id: string;
  tourId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  travelDate: Date;
  numberOfPeople: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  specialRequests?: string;
  notes?: string;
}

export interface TourInquiry {
  name: string;
  email: string;
  phone?: string;
  message: string;
  travelDate?: Date;
  numberOfPeople?: number;
  budget?: number;
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  images: string[];
  categoryId?: string;
  authorId: string;
  cityId?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: 'draft' | 'published';
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

// Review types
export interface Review {
  id: string;
  tourId: string;
  name: string;
  email: string;
  country?: string;
  rating: number;
  title?: string;
  comment: string;
  images: string[];
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

// Contact types
export interface ContactMessage {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

// Settings
export interface Setting {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  group: string;
}

// ============================================================================
// TRANSLATION TYPES (for database models)
// ============================================================================

/**
 * Tour translation fields
 */
export interface TourTranslation extends BaseTranslation {
  tourId: string;
  title: string;
  slug: string;
  summary?: string;
  description: string;
  highlights: string[];
  included: string[];
  excluded: string[];
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Tour with translations
 */
export interface TourWithTranslations extends Omit<Tour, 'title' | 'slug' | 'description' | 'shortDescription' | 'highlights' | 'included' | 'excluded' | 'metaTitle' | 'metaDescription'>, Translatable<TourTranslation> {}

/**
 * Blog post translation fields
 */
export interface BlogPostTranslation extends BaseTranslation {
  postId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Blog post with translations
 */
export interface BlogPostWithTranslations extends Omit<BlogPost, 'title' | 'slug' | 'excerpt' | 'content' | 'metaTitle' | 'metaDescription'>, Translatable<BlogPostTranslation> {}

/**
 * Category translation fields (for both Tour and Blog categories)
 */
export interface CategoryTranslation extends BaseTranslation {
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
}

/**
 * Tour category with translations
 */
export interface TourCategoryWithTranslations extends Omit<TourCategory, 'name' | 'slug' | 'description'>, Translatable<CategoryTranslation> {}

/**
 * Blog category with translations
 */
export interface BlogCategoryWithTranslations extends Omit<BlogCategory, 'name' | 'slug' | 'description'>, Translatable<CategoryTranslation> {}

/**
 * Itinerary item translation fields
 */
export interface ItineraryItemTranslation extends BaseTranslation {
  itemId: string;
  title: string;
  description: string;
  activities: string[];
}

/**
 * Itinerary item with translations
 */
export interface ItineraryItemWithTranslations extends Omit<ItineraryItem, 'title' | 'description' | 'activities'>, Translatable<ItineraryItemTranslation> {}

/**
 * FAQ translation fields
 */
export interface FaqTranslation extends BaseTranslation {
  faqId: string;
  question: string;
  answer: string;
}

/**
 * City translation fields
 */
export interface CityTranslation extends BaseTranslation {
  cityId: string;
  name: string;
  description?: string;
}
