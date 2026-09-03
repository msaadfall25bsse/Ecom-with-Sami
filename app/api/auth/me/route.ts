import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest, getStudentSessionFromRequest } from '@/lib/auth';
import { dbGetStudentByEmail, dbGetStudents } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1. Check Admin Session
    const adminSession = getAdminSessionFromRequest(request);
    if (adminSession) {
      return NextResponse.json({
        authenticated: true,
        role: 'ADMIN',
        user: {
          id: adminSession.id,
          name: 'Muhammad Sami',
          email: adminSession.email || 'admin@samiecom.com',
          role: 'SUPER_ADMIN'
        }
      });
    }

    // 2. Check Student Session
    const studentSession = getStudentSessionFromRequest(request);
    if (studentSession) {
      let student = null;
      if (studentSession.email) {
        student = await dbGetStudentByEmail(studentSession.email);
      }
      if (!student && studentSession.id) {
        const allStudents = await dbGetStudents();
        student = allStudents.find(s => String(s.id) === String(studentSession.id)) || null;
      }

      if (student) {
        if (!student.isActive) {
          return NextResponse.json({
            authenticated: false,
            role: 'GUEST',
            user: null,
            message: 'Account is pending activation.'
          });
        }

        return NextResponse.json({
          authenticated: true,
          role: 'STUDENT',
          user: {
            id: student.id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            city: student.city,
            completedLessons: student.completedLessons || [],
            role: 'student'
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
    return NextResponse.json(
      { authenticated: false, role: 'GUEST', user: null, error: error.message },
      { status: 500 }
    );
  }
}
