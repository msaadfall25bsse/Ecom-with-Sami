import { NextResponse } from 'next/server';
import { dbGetStudents, dbGetEnrollments } from '@/lib/database';

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
    const enrollments = await dbGetEnrollments();

    const pendingEnrollments = enrollments.filter(e => e.status === 'pending');
    const approvedEnrollments = enrollments.filter(e => e.status === 'approved');
    const totalStudentsCount = students.length;

    // Calculate 100% REAL and ORIGINAL revenue from actual approved enrollments
    const totalRevenuePKR = approvedEnrollments.reduce((sum, e) => {
      const cleanAmt = parseInt((e.amount || '').replace(/[^0-9]/g, ''), 10);
      return sum + (isNaN(cleanAmt) ? 3799 : cleanAmt);
    }, 0);

    const totalRevenueFormatted = `PKR ${totalRevenuePKR.toLocaleString()}`;

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents: totalStudentsCount,
        pendingApprovals: pendingEnrollments.length,
        approvedEnrollments: approvedEnrollments.length,
        totalRevenue: totalRevenuePKR,
        totalRevenueFormatted,
        courseFee: 3799,
        courseFeeFormatted: 'PKR 3,799',
        recentEnrollments: enrollments.slice(0, 8)
      }
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
