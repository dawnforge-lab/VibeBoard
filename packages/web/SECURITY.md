# Security Documentation

This document outlines the security measures implemented in VibeBoard and best practices for maintaining a secure application.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [Rate Limiting](#rate-limiting)
3. [CSRF Protection](#csrf-protection)
4. [Security Headers](#security-headers)
5. [Session Management](#session-management)
6. [API Security](#api-security)
7. [Admin Panel Security](#admin-panel-security)
8. [Best Practices](#best-practices)
9. [Incident Response](#incident-response)

## Authentication & Authorization

### Supabase Auth

We use Supabase Auth for user authentication with Row Level Security (RLS) policies.

#### Key Features:

- **JWT-based authentication** with secure httpOnly cookies
- **Role-based access control (RBAC)** for admin panel
- **Automatic session refresh** with token rotation
- **Secure password hashing** (bcrypt) handled by Supabase

#### Admin Roles:

| Role            | Description        | Access Level                 |
| --------------- | ------------------ | ---------------------------- |
| `super_admin`   | Full system access | All admin features           |
| `content_admin` | Content management | Templates, prompts, packs    |
| `support_admin` | User support       | View users, moderate content |
| `creator_admin` | Creator tools      | Font pack management         |

### Middleware Protection

Admin routes are protected at the middleware level (`middleware.ts`):

```typescript
// Automatically redirects unauthenticated users to login
if (!isAdminAuthenticated) {
  return redirect('/admin/login');
}
```

## Rate Limiting

Rate limiting prevents brute force attacks and API abuse.

### Limits by Route Type:

| Route Type       | Limit       | Window     |
| ---------------- | ----------- | ---------- |
| Admin endpoints  | 100 req/min | 1 minute   |
| API endpoints    | 60 req/min  | 1 minute   |
| Auth endpoints   | 5 req/15min | 15 minutes |
| Public endpoints | 120 req/min | 1 minute   |

### Implementation:

Located in `lib/security/rate-limiter.ts`:

```typescript
import { rateLimiter } from '@/lib/security/rate-limiter';

const { allowed, remaining, resetAt } = rateLimiter.check(
  identifier,
  limit,
  windowMs
);
```

### Response Headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2025-11-08T18:30:00.000Z
```

### Production Recommendations:

For production deployments, consider upgrading to:

- **Redis-based rate limiting** for distributed systems
- **Upstash Rate Limit** for edge deployments
- **CloudFlare Rate Limiting** for additional DDoS protection

## CSRF Protection

Cross-Site Request Forgery (CSRF) protection uses double-submit cookie pattern.

### Implementation:

Located in `lib/security/csrf.ts`:

#### Server-Side:

```typescript
import { requireCSRF } from '@/lib/security/csrf';

// In API routes
export async function POST(request: Request) {
  const csrfError = await requireCSRF(request);
  if (csrfError) return csrfError;

  // Process request...
}
```

#### Client-Side:

```typescript
import { fetchWithCSRF } from '@/lib/security/csrf';

// Automatically includes CSRF token
const response = await fetchWithCSRF('/api/admin/config', {
  method: 'POST',
  body: JSON.stringify(data),
});
```

### CSRF Token Lifecycle:

1. Token generated on first request
2. Stored in httpOnly cookie
3. Must be included in `X-CSRF-Token` header for mutations
4. Validated on server for POST/PUT/PATCH/DELETE requests

## Security Headers

Comprehensive security headers protect against common web vulnerabilities.

### Implemented Headers:

| Header                      | Value                           | Purpose                 |
| --------------------------- | ------------------------------- | ----------------------- |
| `Content-Security-Policy`   | Strict CSP                      | Prevent XSS attacks     |
| `Strict-Transport-Security` | max-age=63072000                | Force HTTPS             |
| `X-Frame-Options`           | DENY                            | Prevent clickjacking    |
| `X-Content-Type-Options`    | nosniff                         | Prevent MIME sniffing   |
| `X-XSS-Protection`          | 1; mode=block                   | Legacy XSS protection   |
| `Referrer-Policy`           | strict-origin-when-cross-origin | Control referrer info   |
| `Permissions-Policy`        | Restrictive                     | Disable unused features |

### Content Security Policy (CSP):

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self' https:;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

### HSTS (HTTP Strict Transport Security):

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

This forces HTTPS for 2 years and can be submitted to browser preload lists.

## Session Management

### Session Configuration:

- **Session timeout**: 30 minutes of idle time
- **Token rotation**: Automatic refresh before expiry
- **Secure cookies**: httpOnly, secure, sameSite=strict
- **Token storage**: httpOnly cookies (not localStorage)

### Session Security Best Practices:

1. **Never store tokens in localStorage** - vulnerable to XSS
2. **Use httpOnly cookies** - prevents JavaScript access
3. **Enable sameSite=strict** - prevents CSRF
4. **Implement session timeout** - reduces exposure window
5. **Rotate tokens regularly** - limits token lifetime

### Implementation:

Supabase handles most session management automatically, but additional protections are in place:

```typescript
// In middleware.ts
async function isAdminAuthenticated(request: NextRequest): Promise<boolean> {
  const sessionCookie = request.cookies.get('sb-access-token');
  // Verify session is valid and user has admin role
  return verifySession(sessionCookie);
}
```

## API Security

### Input Validation:

All API inputs must be validated before processing:

```typescript
// Example: Validate max length
if (input.length > MAX_INPUT_LENGTH) {
  return Response.json({ error: 'Input too long' }, { status: 400 });
}
```

### Output Sanitization:

Prevent injection attacks by sanitizing outputs:

```typescript
// Use React's built-in XSS protection
<div>{userContent}</div> // Auto-escaped

// For HTML content, use DOMPurify
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

### Database Security:

- **Row Level Security (RLS)** on all Supabase tables
- **Parameterized queries** prevent SQL injection
- **Least privilege principle** for database roles

### File Upload Security:

```typescript
// Validate file type
const allowedTypes = ['image/png', 'image/jpeg', 'application/json'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}

// Validate file size (e.g., 5MB max)
if (file.size > 5 * 1024 * 1024) {
  throw new Error('File too large');
}

// Generate safe filename
const safeFilename = `${uuid()}.${fileExt}`;
```

## Admin Panel Security

### Authentication Requirements:

1. Valid Supabase session
2. Admin role in database
3. Active session (not expired)

### Authorization Checks:

```typescript
// Example: Check user has required role
const {
  data: { user },
} = await supabase.auth.getUser();
if (!user || user.app_metadata.role !== 'super_admin') {
  return Response.json({ error: 'Unauthorized' }, { status: 403 });
}
```

### Audit Logging:

All admin actions are logged to `admin_audit_log` table:

```typescript
await logAdminAction('update', 'app_config', configId, oldValue, newValue);
```

Audit logs include:

- Admin user ID
- Action type (create, update, delete)
- Resource type and ID
- Old and new values
- IP address
- User agent
- Timestamp

### IP Whitelisting (Optional):

For super_admin accounts, you can enable IP whitelisting:

```typescript
// In admin_users table
{
  allowed_ips: ['192.168.1.100', '10.0.0.0/24'];
}
```

## Best Practices

### For Developers:

1. **Never commit secrets** to version control
   - Use `.env.local` for local development
   - Use environment variables for production

2. **Validate all inputs** server-side
   - Client-side validation is for UX only
   - Always validate on the server

3. **Use parameterized queries**
   - Never concatenate user input into SQL
   - Use Supabase query builders

4. **Implement proper error handling**
   - Don't expose internal errors to users
   - Log errors server-side for debugging

5. **Keep dependencies updated**
   - Run `pnpm audit` regularly
   - Update packages with security fixes immediately

6. **Use TypeScript**
   - Catch type errors at compile time
   - Prevents many runtime errors

### For Admins:

1. **Use strong passwords**
   - Minimum 12 characters
   - Mix of letters, numbers, symbols

2. **Enable 2FA** (when available)
   - Adds second layer of security
   - Protects against password theft

3. **Review audit logs regularly**
   - Check for suspicious activity
   - Verify all admin actions

4. **Limit admin access**
   - Give users minimum required role
   - Regularly review admin list

5. **Use VPN for remote access**
   - Adds extra security layer
   - Protects against MITM attacks

### For Deployment:

1. **Enable HTTPS only**
   - Never serve over HTTP
   - Use valid SSL certificates

2. **Set secure environment variables**
   - Use hosting provider's secrets management
   - Never hardcode secrets

3. **Configure CORS properly**
   - Only allow trusted origins
   - Don't use wildcard in production

4. **Set up monitoring**
   - Log security events
   - Alert on suspicious activity

5. **Regular security audits**
   - Review code for vulnerabilities
   - Run security scanners

## Incident Response

### If You Detect a Security Issue:

1. **Assess the severity**
   - Critical: Immediate action required
   - High: Action required within 24h
   - Medium: Action required within 1 week
   - Low: Address in next release

2. **Contain the issue**
   - Disable affected feature if needed
   - Revoke compromised credentials
   - Block malicious IPs

3. **Investigate**
   - Check audit logs
   - Review recent changes
   - Identify root cause

4. **Fix the vulnerability**
   - Patch the code
   - Update dependencies
   - Deploy fix

5. **Notify affected users** (if data breach)
   - Be transparent
   - Explain what happened
   - Describe mitigation steps

6. **Document the incident**
   - Record timeline
   - Document fix
   - Update security practices

### Security Contacts:

- **Security email**: security@vibeboard.app
- **Bug bounty**: [link to bug bounty program]

### Reporting Vulnerabilities:

If you discover a security vulnerability, please:

1. **Do not** disclose publicly
2. Email security@vibeboard.app with:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (optional)
3. Allow reasonable time for fix before disclosure
4. We will acknowledge receipt within 24 hours

## Security Checklist

### Pre-Deployment:

- [ ] All secrets in environment variables
- [ ] HTTPS enabled and enforced
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CSRF protection enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output escaping)
- [ ] File upload restrictions
- [ ] Authentication required for sensitive routes
- [ ] Role-based access control working
- [ ] Audit logging enabled
- [ ] Error messages don't expose internals
- [ ] Dependencies up to date
- [ ] Security scan passed

### Post-Deployment:

- [ ] Monitor logs for errors
- [ ] Check rate limit metrics
- [ ] Review failed login attempts
- [ ] Verify HTTPS redirects
- [ ] Test admin access controls
- [ ] Verify audit logs working
- [ ] Check security headers in production
- [ ] Monitor for unusual traffic patterns

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [Supabase Security](https://supabase.com/docs/guides/auth/server-side/overview)
- [MDN Security](https://developer.mozilla.org/en-US/docs/Web/Security)

---

**Last Updated**: 2025-11-08
**Version**: 1.0.0
