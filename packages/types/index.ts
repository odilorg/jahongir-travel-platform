// Common types shared across the platform

export type Locale = 'en' | 'ru' | 'uz';

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
