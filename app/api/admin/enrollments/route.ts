import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbGetEnrollments, dbUpdateEnrollmentStatus } from '@/lib/database';

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
    const enrollments = await dbGetEnrollments();
    return NextResponse.json({ success: true, enrollments }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Missing id or status' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const updated = await dbUpdateEnrollmentStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    try {
      revalidatePath('/admin', 'page');
      revalidatePath('/admin/cms', 'page');
      revalidatePath('/lms', 'page');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Enrollment status updated to ${status} and student access adjusted.`,
      enrollment: updated
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
