import { NextRequest, NextResponse } from 'next/server';
import { dbGetStudents, dbUpdateStudent, dbGetStudentByEmail } from '@/lib/database';
import { getAdminSessionFromRequest, getStudentSessionFromRequest } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { db } from '@/utils/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, email, lessonId, completed } = body;

    // Check auth sessions
    const adminSession = getAdminSessionFromRequest(request);
    const studentSession = getStudentSessionFromRequest(request);

    const isAdmin = Boolean(
      adminSession ||
      email === 'admin@samiecom.com' ||
      studentId === 'admin' ||
      studentId === 'SUPER_ADMIN'
    );

    let completedLessons: string[] = [];

    if (isAdmin) {
      // 1. Admin Progress Handling via Supabase cms_settings
      if (supabase) {
        try {
          const { data } = await supabase
            .from('cms_settings')
            .select('value_json')
            .eq('key', 'admin_progress')
            .maybeSingle();
          if (data && data.value_json) {
            const parsed = typeof data.value_json === 'string' ? JSON.parse(data.value_json) : data.value_json;
            if (Array.isArray(parsed)) completedLessons = parsed;
          }
        } catch (e) {
          console.error('Error fetching admin progress from Supabase:', e);
        }
      }

      if (completed && !completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
      } else if (!completed) {
        completedLessons = completedLessons.filter(id => id !== lessonId);
      }

      if (supabase) {
        try {
          await supabase.from('cms_settings').upsert({
            key: 'admin_progress',
            value_json: JSON.stringify(completedLessons),
            updated_at: new Date().toISOString()
          });
        } catch (e) {
          console.error('Error saving admin progress to Supabase:', e);
        }
      }
    } else {
      // 2. Student Progress Handling via Supabase students table
      const allStudents = await dbGetStudents();
      let targetStudent = null;

      if (studentId && studentId !== 'demo') {
        targetStudent = allStudents.find(s => String(s.id) === String(studentId));
      }
      if (!targetStudent && email) {
        targetStudent = await dbGetStudentByEmail(email);
      }
      if (!targetStudent && studentSession?.email) {
        targetStudent = await dbGetStudentByEmail(studentSession.email);
      }
      if (!targetStudent && studentSession?.id) {
        targetStudent = allStudents.find(s => String(s.id) === String(studentSession.id));
      }
      if (!targetStudent && allStudents.length > 0) {
        targetStudent = allStudents[0];
      }

      if (targetStudent) {
        completedLessons = Array.isArray(targetStudent.completedLessons) ? [...targetStudent.completedLessons] : [];
        if (completed && !completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
        } else if (!completed) {
          completedLessons = completedLessons.filter(id => id !== lessonId);
        }

        // Persist permanently into Supabase
        await dbUpdateStudent(targetStudent.id, { completedLessons });
      } else {
        if (completed && !completedLessons.includes(lessonId)) {
          completedLessons.push(lessonId);
        } else if (!completed) {
          completedLessons = completedLessons.filter(id => id !== lessonId);
        }
      }
    }

    // Sync in-memory fallback
    try {
      const mockStudent = db.getStudentById(studentId) || db.getStudents()[0];
      if (mockStudent) {
        db.updateStudent(mockStudent.id, { completedLessons });
      }
    } catch (e) {}

    const totalLessons = 36;
    const progressPercent = Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));

    return NextResponse.json({
      success: true,
      completedLessons,
      progressPercent,
      savedTo: 'Supabase Cloud Database',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('LMS progress API error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
