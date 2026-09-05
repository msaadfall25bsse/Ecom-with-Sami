import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbGetStudents, dbUpdateStudent, dbDeleteStudent } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
  'Pragma': 'no-cache',
  'Expires': '0'
};

export async function GET() {
  try {
    const students = await dbGetStudents();
    return NextResponse.json({ success: true, students }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, isActive, password } = await request.json();
    const patch: any = {};
    if (isActive !== undefined) patch.isActive = isActive;
    if (password) patch.password = password;

    const updated = await dbUpdateStudent(id, patch);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    try {
      revalidatePath('/admin', 'page');
      revalidatePath('/lms', 'page');
    } catch (e) {}

    return NextResponse.json({ success: true, message: 'Student account updated in database', student: updated }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    let id = url.searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id || body.email;
      } catch (e) {}
    }

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing student ID or email' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    await dbDeleteStudent(id);

    try {
      revalidatePath('/admin', 'page');
      revalidatePath('/lms', 'page');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Student permanently deleted from database.'
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

