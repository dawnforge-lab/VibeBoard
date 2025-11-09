import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimiter, RATE_LIMITS } from './lib/security/rate-limiter';
import { getSecurityHeaders } from './lib/security/headers';

/**
 * Next.js Middleware
 * Runs on all requests before they reach the application
 * Handles:
 * - Admin route protection
 * - Rate limiting
 * - Security headers
 * - Session validation
 */

// Routes that require admin authentication
const ADMIN_ROUTES = ['/admin'];

// Routes that require rate limiting
const RATE_LIMITED_ROUTES = {
  admin: /^\/admin/,
  api: /^\/api/,
  auth: /^\/api\/auth/,
};

/**
 * Get client identifier for rate limiting
 * Uses IP address or a combination of headers
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to Next.js IP
  return request.ip || 'unknown';
}

/**
 * Check if user is authenticated admin
 */
async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  // Get session cookie
  const sessionCookie = request.cookies.get('sb-access-token');

  if (!sessionCookie) {
    return false;
  }

  // In a real implementation, you would:
  // 1. Verify the session token with Supabase
  // 2. Check if user has admin role
  // For now, we'll just check if the cookie exists
  // The actual role check happens in the admin layout

  return true;
}

/**
 * Apply rate limiting to request
 */
function applyRateLimit(
  request: NextRequest,
  identifier: string
): NextResponse | null {
  const pathname = request.nextUrl.pathname;

  // Check which rate limit to apply
  let limitConfig: { limit: number; windowMs: number } = RATE_LIMITS.public;

  if (RATE_LIMITED_ROUTES.auth.test(pathname)) {
    limitConfig = RATE_LIMITS.auth;
  } else if (RATE_LIMITED_ROUTES.admin.test(pathname)) {
    limitConfig = RATE_LIMITS.admin;
  } else if (RATE_LIMITED_ROUTES.api.test(pathname)) {
    limitConfig = RATE_LIMITS.api;
  }

  // Check rate limit
  const { allowed, remaining, resetAt } = rateLimiter.check(
    `${pathname}:${identifier}`,
    limitConfig.limit,
    limitConfig.windowMs
  );

  // Add rate limit headers
  const headers = new Headers();
  headers.set('X-RateLimit-Limit', limitConfig.limit.toString());
  headers.set('X-RateLimit-Remaining', remaining.toString());
  headers.set('X-RateLimit-Reset', new Date(resetAt).toISOString());

  if (!allowed) {
    return new NextResponse(
      JSON.stringify({
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        resetAt: new Date(resetAt).toISOString(),
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          ...Object.fromEntries(headers),
        },
      }
    );
  }

  return null; // Allow request to proceed
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const clientId = getClientIdentifier(request);

  // Apply rate limiting
  const rateLimitResponse = applyRateLimit(request, clientId);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Check if requesting admin route
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  if (isAdminRoute) {
    // Allow login page without authentication
    if (pathname === '/admin/login') {
      const response = NextResponse.next();
      // Apply security headers
      const securityHeaders = getSecurityHeaders();
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Check admin authentication
    const isAuthenticated = await isAdminAuthenticated(request);

    if (!isAuthenticated) {
      // Redirect to admin login
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Continue with request and apply security headers
  const response = NextResponse.next();

  // Apply security headers
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

// Configure which routes middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
