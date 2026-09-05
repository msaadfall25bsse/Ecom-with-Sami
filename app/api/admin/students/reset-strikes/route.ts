import { NextRequest, NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { dbResetStudentStrikes } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const adminSession = getAdminSessionFromRequest(request);
    if (!adminSession) {
      return NextResponse.json({ success: false, message: 'Unauthorized: Admin access required' }, { status: 401 });
    }

    const body = await request.json();
    const { studentId, reactivate = true } = body;

    if (!studentId) {
      return NextResponse.json({ success: false, message: 'Student ID is required' }, { status: 400 });
    }

    const { success, student } = await dbResetStudentStrikes(studentId, reactivate);

    if (!success) {
      return NextResponse.json({ success: false, message: 'Student not found or update failed' }, { status: 404 });
    }

    revalidatePath('/admin', 'page');
    revalidatePath('/lms', 'page');

    return NextResponse.json({
      success: true,
      message: 'DRM strikes successfully reset to 0/5 and access restored.',
      student
    });
  } catch (error: any) {
    console.error('Reset strikes API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
