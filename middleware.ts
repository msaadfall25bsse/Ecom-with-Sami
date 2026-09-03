import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. ADMIN ROUTE PROTECTION (/admin, /admin/cms, etc.)
  if (pathname.startsWith('/admin')) {
    // Exclude the login page itself
    if (pathname === '/admin/login') {
      const adminCookie = request.cookies.get('sami_admin_session')?.value;
      if (adminCookie) {
        // Already logged in -> redirect to admin dashboard
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Check admin authentication session
    const adminCookie = request.cookies.get('sami_admin_session')?.value;
    if (!adminCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. STUDENT LMS ROUTE PROTECTION (/lms, /lms/...)
  if (pathname.startsWith('/lms')) {
    const studentCookie = request.cookies.get('sami_student_session')?.value || request.cookies.get('sami_student_auth')?.value;
    if (!studentCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. STUDENT LOGIN PAGE REDIRECT (/login)
  if (pathname === '/login') {
    const studentCookie = request.cookies.get('sami_student_session')?.value || request.cookies.get('sami_student_auth')?.value;
    if (studentCookie) {
      return NextResponse.redirect(new URL('/lms', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/lms/:path*',
    '/login'
  ]
};
