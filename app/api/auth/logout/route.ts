import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  response.cookies.set('sami_student_session', '', { path: '/', maxAge: 0 });
  response.cookies.set('sami_student_auth', '', { path: '/', maxAge: 0 });
  response.cookies.set('sami_admin_session', '', { path: '/', maxAge: 0 });

  return response;
}

export async function GET() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  
  response.cookies.set('sami_student_session', '', { path: '/', maxAge: 0 });
  response.cookies.set('sami_student_auth', '', { path: '/', maxAge: 0 });
  response.cookies.set('sami_admin_session', '', { path: '/', maxAge: 0 });

  return response;
}
