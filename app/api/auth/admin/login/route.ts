import { NextRequest, NextResponse } from 'next/server';
import { signSessionToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const expectedEmail = process.env.ADMIN_EMAIL || 'admin@samiecom.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'samiadmin2026';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    if (cleanEmail === expectedEmail.toLowerCase() && cleanPassword === expectedPassword) {
      const exp = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
      const token = signSessionToken({
        id: 'admin_root',
        email: expectedEmail,
        role: 'ADMIN',
        exp
      });

      const response = NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        admin: {
          email: expectedEmail,
          role: 'SUPER_ADMIN',
          name: 'Muhammad Sami'
        },
        redirectTo: '/admin'
      });

      response.cookies.set('sami_admin_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin credentials. Please check email and password.' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Authentication server error' },
      { status: 500 }
    );
  }
}
