import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    metrics: {
      totalStudents: 9740,
      activeEnrollments: 9420,
      pendingEnrollments: 3,
      bannedStudents: 0,
      totalRevenue: 'PKR 37,986,000'
    }
  });
}
