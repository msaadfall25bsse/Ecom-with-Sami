import { NextResponse } from 'next/server';
import { getLiveVisitors, getTodayAnalytics } from '@/lib/mysql';

/**
 * Hostinger MySQL Realtime Analytics & Daily Performance Endpoint.
 * - 100% Read-Only visitor count and daily sessions query.
 * - Zero Supabase dependency.
 */
export async function GET() {
  try {
    const [live, today] = await Promise.all([
      getLiveVisitors(),
      getTodayAnalytics(),
    ]);

    return NextResponse.json({
      success: true,
      configured: true,
      activeUsers: live.activeCount,
      topPages: live.topPages,
      today,
      source: 'Hostinger MySQL Real-Time',
      database: 'u787683477_ecomsaminew',
      lastUpdated: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: true,
      configured: true,
      activeUsers: 0,
      topPages: [],
      today: {
        date: new Date().toISOString().slice(0, 10),
        totalSessions: 0,
        uniqueVisitors: 0,
        homeViews: 0,
        enrollmentViews: 0,
        lmsViews: 0,
        enrollmentRate: '0.0%',
      },
      error: error?.message,
    });
  }
}
