import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest, getStudentSessionFromRequest } from '@/lib/auth';
import { dbGetStudentByEmail, dbGetStudents } from '@/lib/database';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 1. Check Admin Session
    const adminSession = getAdminSessionFromRequest(request);
    if (adminSession) {
      let adminCompletedLessons: string[] = [];
      if (supabase) {
        try {
          const { data } = await supabase
            .from('cms_settings')
            .select('value_json')
            .eq('key', 'admin_progress')
            .maybeSingle();
          if (data && data.value_json) {
            const parsed = typeof data.value_json === 'string' ? JSON.parse(data.value_json) : data.value_json;
            if (Array.isArray(parsed)) adminCompletedLessons = parsed;
          }
        } catch (e) {
          console.error('Supabase admin progress load error:', e);
        }
      }

      return NextResponse.json({
        authenticated: true,
        role: 'ADMIN',
        user: {
          id: adminSession.id,
          name: 'Muhammad Sami',
          email: adminSession.email || 'admin@samiecom.com',
          role: 'SUPER_ADMIN',
          completedLessons: adminCompletedLessons
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

      if (!student || !student.isActive) {
        const res = NextResponse.json({
          authenticated: false,
          role: 'GUEST',
          user: null,
          reason: 'suspended',
          message: 'Student account has been suspended or rejected by the administrator.'
        });
        res.cookies.set('sami_student_auth', '', { path: '/', maxAge: 0 });
        res.cookies.set('sami_student_session', '', { path: '/', maxAge: 0 });
        return res;
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
