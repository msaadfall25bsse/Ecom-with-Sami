import { NextRequest, NextResponse } from 'next/server';
import { dbGetStudents, dbUpdateStudent } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const students = dbGetStudents();
    return NextResponse.json({ success: true, students });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, isActive, password } = await request.json();
    const patch: any = {};
    if (isActive !== undefined) patch.isActive = isActive;
    if (password) patch.password = password;

    const updated = dbUpdateStudent(id, patch);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Student account updated in database', student: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
