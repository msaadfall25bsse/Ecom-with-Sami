import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const expectedEmail = process.env.ADMIN_EMAIL || 'admin@samiecom.com';
    const expectedPassword = process.env.ADMIN_PASSWORD || 'samiadmin2026';

    if (email === expectedEmail && password === expectedPassword) {
      const response = NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        admin: {
          email: expectedEmail,
          role: 'SUPER_ADMIN',
          name: 'Muhammad Sami'
        }
      });

      response.cookies.set('sami_admin_session', 'authenticated_super_admin', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: 'Invalid admin credentials' },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
