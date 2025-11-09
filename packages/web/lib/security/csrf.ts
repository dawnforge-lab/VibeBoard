/**
 * CSRF Protection
 * Implements double-submit cookie pattern for CSRF protection
 */

import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

const CSRF_TOKEN_NAME = 'csrf_token';
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24, // 24 hours
};

/**
 * Generate a new CSRF token
 */
export function generateCSRFToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Get or create CSRF token from cookies
 */
export async function getCSRFToken(): Promise<string> {
  const cookieStore = await cookies();
  let token = cookieStore.get(CSRF_TOKEN_NAME)?.value;

  if (!token) {
    token = generateCSRFToken();
    cookieStore.set(CSRF_TOKEN_NAME, token, CSRF_COOKIE_OPTIONS);
  }

  return token;
}

/**
 * Validate CSRF token from request
 * @param request Request object
 * @returns true if token is valid, false otherwise
 */
export async function validateCSRFToken(
  request: Request
): Promise<{ valid: boolean; error?: string }> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken) {
    return { valid: false, error: 'CSRF cookie not found' };
  }

  if (!headerToken) {
    return { valid: false, error: 'CSRF token not provided in header' };
  }

  if (cookieToken !== headerToken) {
    return { valid: false, error: 'CSRF token mismatch' };
  }

  return { valid: true };
}

/**
 * Middleware helper to check CSRF for state-changing methods
 */
export async function requireCSRF(request: Request): Promise<Response | null> {
  const method = request.method;

  // Only check CSRF for state-changing methods
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const { valid, error } = await validateCSRFToken(request);

    if (!valid) {
      return new Response(
        JSON.stringify({
          error: 'CSRF validation failed',
          message: error,
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
  }

  return null; // Allow request to proceed
}

/**
 * Client-side helper to get CSRF token from cookie
 * This should be called from client components
 */
export function getCSRFTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === CSRF_TOKEN_NAME && value) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Fetch wrapper that automatically includes CSRF token
 */
export async function fetchWithCSRF(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const csrfToken = getCSRFTokenFromCookie();

  const headers = new Headers(options.headers);
  if (
    csrfToken &&
    ['POST', 'PUT', 'PATCH', 'DELETE'].includes(options.method || 'GET')
  ) {
    headers.set(CSRF_HEADER_NAME, csrfToken);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
