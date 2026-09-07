import { NextResponse } from 'next/server';
import { getLiveVisitors } from '@/lib/mysql';

/**
 * Hostinger MySQL Realtime Analytics Endpoint.
 * - 100% Read-Only visitor count query.
 * - Zero Supabase dependency.
 * - Returns exact count of open tabs/devices.
 */
export async function GET() {
  try {
    const live = await getLiveVisitors();

    return NextResponse.json({
      success: true,
      configured: true,
      activeUsers: live.activeCount,
      topPages: live.topPages,
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
      error: error?.message,
    });
  }
}
