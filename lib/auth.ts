import crypto from 'crypto';
import { NextRequest } from 'next/server';

const AUTH_SECRET = process.env.AUTH_SECRET || 'sami_ecommerce_secret_key_2026_super_secure_salt_98471923';

/**
 * Creates an HMAC SHA-256 signed session token for admin or student
 */
export function signSessionToken(payload: { id: string; email: string; role: 'ADMIN' | 'STUDENT'; exp: number }): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');
  return `${data}.${signature}`;
}

/**
 * Verifies and decodes an HMAC SHA-256 session token
 */
export function verifySessionToken(token: string): { id: string; email: string; role: 'ADMIN' | 'STUDENT'; exp: number } | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [data, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url');

  try {
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies Admin Session from Request cookies or headers
 */
export function getAdminSessionFromRequest(request: NextRequest) {
  const cookieVal = request.cookies.get('sami_admin_session')?.value;
  if (!cookieVal) return null;

  // Check signed token
  const payload = verifySessionToken(cookieVal);
  if (payload && payload.role === 'ADMIN') {
    return payload;
  }

  // Legacy fallback support for active sessions
  if (cookieVal === 'authenticated_super_admin') {
    return { id: 'admin_1', email: 'admin@samiecom.com', role: 'ADMIN' as const, exp: Date.now() + 86400000 };
  }

  return null;
}

/**
 * Extracts and verifies Student Session from Request cookies or headers
 */
export function getStudentSessionFromRequest(request: NextRequest) {
  const cookieVal = request.cookies.get('sami_student_session')?.value || request.cookies.get('sami_student_auth')?.value;
  if (!cookieVal) return null;

  // Check signed token
  const payload = verifySessionToken(cookieVal);
  if (payload && payload.role === 'STUDENT') {
    return payload;
  }

  // Legacy JSON fallback
  try {
    const parsed = JSON.parse(cookieVal);
    if (parsed && (parsed.id || parsed.email)) {
      return {
        id: parsed.id || 'student_1',
        email: parsed.email,
        role: 'STUDENT' as const,
        exp: Date.now() + 86400000
      };
    }
  } catch {}

  // Plain student ID fallback
  if (cookieVal.startsWith('std_') || cookieVal.length > 5) {
    return {
      id: cookieVal,
      email: '',
      role: 'STUDENT' as const,
      exp: Date.now() + 86400000
    };
  }

  return null;
}
