import { NextResponse } from 'next/server';
import { getLiveVisitors, getTodayAnalytics, getLast30DaysAnalytics } from '@/lib/mysql';
import { dbGetEnrollments } from '@/lib/database';

/**
 * Hostinger MySQL Realtime Analytics & Store Performance Endpoint.
 * - 100% Read-Only visitor count and store performance query.
 * - Zero Supabase dependency for tracking.
 */
export async function GET() {
  try {
    const [live, today, month] = await Promise.all([
      getLiveVisitors(),
      getTodayAnalytics(),
      getLast30DaysAnalytics(),
    ]);

    // Query confirmed purchases/enrollments from database
    let todayPurchases = 0;
    let monthPurchases = 0;
    try {
      const enrollments = await dbGetEnrollments();
      const todayStr = new Date().toISOString().slice(0, 10);
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

      for (const e of enrollments) {
        const time = e.createdAt ? new Date(e.createdAt).getTime() : 0;
        const dateStr = e.createdAt ? new Date(e.createdAt).toISOString().slice(0, 10) : '';
        if (dateStr === todayStr) {
          todayPurchases++;
        }
        if (time >= thirtyDaysAgo || !e.createdAt) {
          monthPurchases++;
        }
      }
    } catch {
      // Ignore if enrollments fetch fails
    }

    const todayConversionRate = today.totalSessions > 0
      ? `${((todayPurchases / today.totalSessions) * 100).toFixed(1)}%`
      : '0.0%';

    const monthConversionRate = month.totalSessions > 0
      ? `${((monthPurchases / month.totalSessions) * 100).toFixed(1)}%`
      : '0.0%';

    const todayData = {
      date: today.date,
      totalSessions: today.totalSessions,
      uniqueVisitors: today.uniqueVisitors,
      homeViews: today.homeViews,
      checkoutViews: today.checkoutViews,
      enrollmentViews: today.enrollmentViews,
      purchases: todayPurchases,
      conversionRate: todayConversionRate,
      enrollmentRate: today.enrollmentRate,
    };

    const last30DaysData = {
      totalSessions: month.totalSessions,
      uniqueVisitors: month.uniqueVisitors,
      homeViews: month.homeViews,
      checkoutViews: month.checkoutViews,
      enrollmentViews: month.checkoutViews,
      purchases: monthPurchases,
      conversionRate: monthConversionRate,
    };

    return NextResponse.json({
      success: true,
      configured: true,
      activeUsers: live.activeCount,
      topPages: live.topPages,
      today: todayData,
      last30Days: last30DaysData,
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
        checkoutViews: 0,
        enrollmentViews: 0,
        purchases: 0,
        conversionRate: '0.0%',
        enrollmentRate: '0.0%',
      },
      last30Days: {
        totalSessions: 0,
        uniqueVisitors: 0,
        homeViews: 0,
        checkoutViews: 0,
        enrollmentViews: 0,
        purchases: 0,
        conversionRate: '0.0%',
      },
      error: error?.message,
    });
  }
}

