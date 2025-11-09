/**
 * Security Headers
 * Implements OWASP recommended security headers
 */

export interface SecurityHeadersOptions {
  enableCSP?: boolean;
  enableHSTS?: boolean;
  enableFrameGuard?: boolean;
  enableXSSProtection?: boolean;
  enableContentTypeNoSniff?: boolean;
  enableReferrerPolicy?: boolean;
}

/**
 * Get security headers for responses
 */
export function getSecurityHeaders(
  options: SecurityHeadersOptions = {}
): Record<string, string> {
  const {
    enableCSP = true,
    enableHSTS = true,
    enableFrameGuard = true,
    enableXSSProtection = true,
    enableContentTypeNoSniff = true,
    enableReferrerPolicy = true,
  } = options;

  const headers: Record<string, string> = {};

  // Content Security Policy (CSP)
  if (enableCSP) {
    // Adjust CSP based on your needs
    headers['Content-Security-Policy'] = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Adjust for Next.js
      "style-src 'self' 'unsafe-inline'", // Required for inline styles
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');
  }

  // HTTP Strict Transport Security (HSTS)
  if (enableHSTS) {
    // Force HTTPS for 2 years, include subdomains
    headers['Strict-Transport-Security'] =
      'max-age=63072000; includeSubDomains; preload';
  }

  // Prevent clickjacking
  if (enableFrameGuard) {
    headers['X-Frame-Options'] = 'DENY';
  }

  // XSS Protection (legacy, but still useful for older browsers)
  if (enableXSSProtection) {
    headers['X-XSS-Protection'] = '1; mode=block';
  }

  // Prevent MIME type sniffing
  if (enableContentTypeNoSniff) {
    headers['X-Content-Type-Options'] = 'nosniff';
  }

  // Referrer Policy
  if (enableReferrerPolicy) {
    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
  }

  // Permissions Policy (formerly Feature Policy)
  headers['Permissions-Policy'] = [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()', // Disable FLoC
  ].join(', ');

  return headers;
}

/**
 * Apply security headers to a Next.js response
 */
export function applySecurityHeaders(
  response: Response,
  options?: SecurityHeadersOptions
): Response {
  const headers = getSecurityHeaders(options);
  const newHeaders = new Headers(response.headers);

  for (const [key, value] of Object.entries(headers)) {
    newHeaders.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
