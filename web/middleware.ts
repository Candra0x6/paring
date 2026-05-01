import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Middleware for server-side route protection
 *
 * This runs on the server for EVERY request to protected routes
 * It checks if the user has a valid authentication cookie
 *
 * Protected routes:
 * - /dashboard/* (FAMILY dashboard)
 * - /nurse/* (NURSE dashboard)
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if this is a protected route
  const isProtectedRoute =
    pathname.startsWith('/dashboard') || pathname.startsWith('/nurse');

  // Skip middleware for non-protected routes
  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Check for authentication cookie
  const authCookie = request.cookies.get('access_token');

  // If no auth cookie, redirect to login
  if (!authCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // User is authenticated, allow request to proceed
  return NextResponse.next();
}

/**
 * Configure which routes this middleware applies to
 *
 * matcher patterns:
 * - '/dashboard/:path*' matches /dashboard and all sub-routes
 * - '/nurse/:path*' matches /nurse and all sub-routes
 */
export const config = {
  matcher: ['/dashboard/:path*', '/nurse/:path*'],
};
