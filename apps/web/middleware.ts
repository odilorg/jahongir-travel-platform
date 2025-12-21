import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the request is for an admin route (except login page)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Get the token from cookies
    const token = request.cookies.get('admin_token')?.value

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('from', pathname) // Save the original URL
      return NextResponse.redirect(loginUrl)
    }
  }

  // If user has token and tries to access login page, redirect to dashboard
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value
    if (token) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/admin/:path*',  // All admin routes
  ],
}
