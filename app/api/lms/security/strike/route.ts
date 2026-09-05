import { NextRequest, NextResponse } from 'next/server';
import { getStudentSessionFromRequest } from '@/lib/auth';
import { dbGetStudents, dbRecordStudentStrike } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const studentSession = getStudentSessionFromRequest(request);
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {}

    const violationType = body.violationType || 'CAPTURE_ATTEMPT';
    let targetStudentId = studentSession?.id;

    if (!targetStudentId && body.studentId) {
      targetStudentId = body.studentId;
    }

    if (!targetStudentId && body.email) {
      const allStudents = await dbGetStudents();
      const found = allStudents.find(s => s.email.toLowerCase() === body.email.toLowerCase());
      if (found) targetStudentId = found.id;
    }

    if (!targetStudentId) {
      return NextResponse.json({ success: false, message: 'Unauthenticated student session' }, { status: 401 });
    }

    const { strikeCount, isBlocked } = await dbRecordStudentStrike(targetStudentId, violationType);

    const res = NextResponse.json({
      success: true,
      strikeCount,
      isBlocked,
      message: isBlocked 
        ? 'Account suspended: Maximum DRM strike limit (5/5) reached.'
        : `Security warning strike ${strikeCount}/5 recorded.`
    });

    if (isBlocked) {
      res.cookies.set('sami_student_auth', '', { path: '/', maxAge: 0 });
      res.cookies.set('sami_student_session', '', { path: '/', maxAge: 0 });
    }

    return res;
  } catch (error: any) {
    console.error('LMS Strike API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
