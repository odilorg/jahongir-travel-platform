// Use different URLs for server-side vs client-side requests
// Server-side: Use HTTP to localhost (API server doesn't have SSL)
// Client-side: Use HTTPS via nginx proxy
const getApiBaseUrl = () => {
  // Check if we're running on the server (Node.js)
  if (typeof window === 'undefined') {
    // Server-side: Use HTTP to localhost
    return process.env.API_URL_INTERNAL || 'http://localhost:4000/api'
  }
  // Client-side: Use public URL (will use HTTPS if page is HTTPS)
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
}

const API_BASE_URL = getApiBaseUrl()

export interface Tour {
  id: string
  title: string
  slug: string
  description: string
  shortDescription?: string
  price: number | string
  duration: number
  categoryId: string
  category?: {
    id: string
    name: string
    slug: string
    icon?: string
  }
  images: string[]
  isFeatured: boolean
  highlights?: string[]
  included?: string[]
  excluded?: string[]
  maxGroupSize?: number
  difficulty?: string
  itineraryItems?: ItineraryItem[]
  reviews?: Review[]
  averageRating?: number
  metaTitle?: string | null
  metaDescription?: string | null
  summary?: string | null
  bookingMode?: "instant" | "inquiry";
  showPrice?: boolean;
  discountedPrice?: number | string;
  _count?: {
    reviews: number
    itineraryItems: number
    bookings: number
  }
}

export interface ItineraryItem {
  id: string
  day: number
  title: string
  description: string
  accommodation?: string
  meals?: string
}

export interface Review {
  id: string
  name: string
  email: string
  country: string
  rating: number
  title: string
  comment: string
  createdAt: string
  isApproved: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export async function getTours(params?: {
  page?: number
  limit?: number
  categoryId?: string
  featured?: string
  locale?: string
}): Promise<PaginatedResponse<Tour>> {
  const searchParams = new URLSearchParams()

  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId)
  if (params?.featured) searchParams.set('featured', params.featured)
  if (params?.locale) searchParams.set('lang', params.locale)

  const url = `${API_BASE_URL}/tours?${searchParams}`

  const res = await fetch(url, {
    next: { revalidate: 60 } // Revalidate every minute
  })

  if (!res.ok) {
    throw new Error('Failed to fetch tours')
  }

  return res.json()
}

export async function getFeaturedTours(limit: number = 6, locale?: string): Promise<Tour[]> {
  const searchParams = new URLSearchParams()
  searchParams.set('limit', limit.toString())
  if (locale) searchParams.set('lang', locale)

  const url = `${API_BASE_URL}/tours/featured?${searchParams}`

  const res = await fetch(url, {
    next: { revalidate: 60 }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch featured tours')
  }

  return res.json()
}

export async function getTourBySlug(slug: string, locale?: string): Promise<Tour> {
  const searchParams = new URLSearchParams()
  if (locale) searchParams.set('lang', locale)

  const url = `${API_BASE_URL}/tours/${slug}?${searchParams}`

  const res = await fetch(url, {
    next: { revalidate: 60 }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch tour')
  }

  return res.json()
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  image?: string
  _count?: {
    tours: number
  }
}

export async function getCategories(params?: {
  limit?: number
  locale?: string
}): Promise<Category[]> {
  const searchParams = new URLSearchParams()

  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.locale) searchParams.set('lang', params.locale)

  const url = `${API_BASE_URL}/categories?${searchParams}`

  const res = await fetch(url, {
    next: { revalidate: 300 } // Revalidate every 5 minutes
  })

  if (!res.ok) {
    throw new Error('Failed to fetch categories')
  }

  return res.json()
}

// ============================================
// BLOG
// ============================================

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string | null
  categoryId: string | null
  authorId: string
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  status: string
  viewCount: number
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  category: {
    id: string
    name: string
    slug: string
  } | null
  author: {
    id: string
    name: string
    avatar: string | null
    bio: string | null
  }
  _count: {
    comments: number
  }
}

export async function getBlogPosts(params?: {
  page?: number
  limit?: number
  categoryId?: string
  locale?: string
}): Promise<PaginatedResponse<BlogPost>> {
  const searchParams = new URLSearchParams()

  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.limit) searchParams.set('limit', params.limit.toString())
  if (params?.categoryId) searchParams.set('categoryId', params.categoryId)
  // TODO: Backend needs to support locale
  // if (params?.locale) searchParams.set('lang', params.locale)

  const url = `${API_BASE_URL}/blog?${searchParams}`

  const res = await fetch(url, {
    next: { revalidate: 60 }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blog posts')
  }

  return res.json()
}

export async function getBlogPostBySlug(slug: string, locale?: string): Promise<BlogPost> {
  const searchParams = new URLSearchParams()
  // TODO: Backend needs to support locale
  // if (locale) searchParams.set('lang', locale)

  const url = `${API_BASE_URL}/blog/${slug}?${searchParams}`

  const res = await fetch(url, {
    next: { revalidate: 60 }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blog post')
  }

  return res.json()
}

export async function getBlogCategories(locale?: string): Promise<Category[]> {
  const searchParams = new URLSearchParams()
  // TODO: Backend needs to support locale
  // if (locale) searchParams.set('lang', locale)

  const url = `${API_BASE_URL}/blog/categories?${searchParams}`

  const res = await fetch(url, {
    next: { revalidate: 300 }
  })

  if (!res.ok) {
    throw new Error('Failed to fetch blog categories')
  }

  return res.json()
}

// ============================================
// FORM SUBMISSIONS
// ============================================

export interface ApiError {
  message: string | string[]
  error?: string
  statusCode: number
}

export interface FormResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

// Contact Form
export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: string
  createdAt: string
}

export async function submitContact(data: ContactFormData): Promise<FormResponse<ContactSubmission>> {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const responseData = await res.json()

    if (!res.ok) {
      const apiError = responseData as ApiError
      const errorMessage = Array.isArray(apiError.message)
        ? apiError.message[0]
        : apiError.message
      return { success: false, error: errorMessage }
    }

    return { success: true, data: responseData }
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' }
  }
}

// Booking Form
export interface BookingFormData {
  tourId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  travelDate: string
  numberOfPeople: number
  specialRequests?: string
}

export interface BookingSubmission {
  id: string
  tourId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  travelDate: string
  numberOfPeople: number
  totalPrice: number
  specialRequests?: string
  status: string
  paymentStatus: string
  createdAt: string
}

export async function submitBooking(data: BookingFormData): Promise<FormResponse<BookingSubmission>> {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const responseData = await res.json()

    if (!res.ok) {
      const apiError = responseData as ApiError
      const errorMessage = Array.isArray(apiError.message)
        ? apiError.message[0]
        : apiError.message
      return { success: false, error: errorMessage }
    }

    return { success: true, data: responseData }
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' }
  }
}

// Inquiry Form
export interface InquiryFormData {
  name: string
  email: string
  phone?: string
  tourId?: string
  travelDate?: string
  travelDateFrom?: string
  travelDateTo?: string
  numberOfPeople?: number
  budget?: number
  message: string
}

export interface InquirySubmission {
  id: string
  name: string
  email: string
  phone?: string
  tourId?: string
  travelDate?: string
  travelDateFrom?: string
  travelDateTo?: string
  numberOfPeople?: number
  budget?: number
  message: string
  status: string
  createdAt: string
}

export async function submitInquiry(data: InquiryFormData): Promise<FormResponse<InquirySubmission>> {
  try {
    const res = await fetch(`${API_BASE_URL}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const responseData = await res.json()

    if (!res.ok) {
      const apiError = responseData as ApiError
      const errorMessage = Array.isArray(apiError.message)
        ? apiError.message[0]
        : apiError.message
      return { success: false, error: errorMessage }
    }

    return { success: true, data: responseData }
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' }
  }
}

// Review Form
export interface ReviewFormData {
  tourId: string
  name: string
  email: string
  country?: string
  rating: number
  title: string
  comment: string
  images?: string[]
}

export interface ReviewSubmission {
  id: string
  tourId: string
  name: string
  email: string
  country?: string
  rating: number
  title: string
  comment: string
  images?: string[]
  isApproved: boolean
  createdAt: string
}

export async function submitReview(data: ReviewFormData): Promise<FormResponse<ReviewSubmission>> {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const responseData = await res.json()

    if (!res.ok) {
      const apiError = responseData as ApiError
      const errorMessage = Array.isArray(apiError.message)
        ? apiError.message[0]
        : apiError.message
      return { success: false, error: errorMessage }
    }

    return { success: true, data: responseData }
  } catch (error) {
    return { success: false, error: 'Network error. Please try again.' }
  }
}
