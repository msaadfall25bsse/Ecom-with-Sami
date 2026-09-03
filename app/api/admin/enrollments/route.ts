import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function GET() {
  try {
    const enrollments = db.getEnrollments();
    return NextResponse.json({ success: true, enrollments });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Missing id or status' }, { status: 400 });
    }

    const updated = db.updateEnrollmentStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Enrollment status updated to ${status} and student access adjusted.`,
      enrollment: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
