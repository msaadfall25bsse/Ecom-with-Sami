import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
  response.cookies.delete('sami_student_session');
  response.cookies.delete('sami_admin_session');
  return response;
}
