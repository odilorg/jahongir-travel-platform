// Shared configuration constants

export const SUPPORTED_LOCALES = ['en', 'ru', 'uz'] as const;

export const DEFAULT_LOCALE = 'ru';

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const TOUR_DIFFICULTY = {
  EASY: 'easy',
  MODERATE: 'moderate',
  CHALLENGING: 'challenging',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PARTIAL: 'partial',
  PAID: 'paid',
} as const;

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
} as const;

export const BLOG_POST_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
} as const;

export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  CONVERTED: 'converted',
  LOST: 'lost',
} as const;

export const API_ENDPOINTS = {
  TOURS: '/api/tours',
  CATEGORIES: '/api/categories',
  BLOG: '/api/blog',
  REVIEWS: '/api/reviews',
  INQUIRIES: '/api/inquiries',
  CONTACT: '/api/contact',
  AUTH: '/api/auth',
} as const;

export const IMAGE_SIZES = {
  THUMBNAIL: { width: 300, height: 200 },
  MEDIUM: { width: 800, height: 600 },
  LARGE: { width: 1200, height: 800 },
  HERO: { width: 1920, height: 1080 },
} as const;
