import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function GET(request: NextRequest) {
  try {
    const studentSession = request.cookies.get('sami_student_session')?.value;
    const adminSession = request.cookies.get('sami_admin_session')?.value;

    if (adminSession === 'authenticated_super_admin') {
      return NextResponse.json({
        authenticated: true,
        role: 'ADMIN',
        user: { name: 'Muhammad Sami', email: 'admin@samiecom.com' }
      });
    }

    if (studentSession) {
      const student = db.getStudentById(studentSession);
      if (student && student.isActive) {
        return NextResponse.json({
          authenticated: true,
          role: 'STUDENT',
          user: {
            id: student.id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            city: student.city,
            completedLessons: student.completedLessons || []
          }
        });
      }
    }

    return NextResponse.json({
      authenticated: false,
      role: 'GUEST',
      user: null
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}
