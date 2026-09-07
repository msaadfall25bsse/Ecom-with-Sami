import { NextRequest, NextResponse } from 'next/server';
import { recordVisitorPing, removeVisitor, recordSessionHit } from '@/lib/mysql';

/**
 * Hostinger MySQL Realtime Analytics & Session Tracker.
 * - Records active visitor live heartbeats (active_visitors table).
 * - Aggregates Shopify-style daily sessions & funnel pageviews (analytics_daily table).
 * - Zero Supabase. 100% isolated MySQL tables.
 */
export async function POST(req: NextRequest) {
  try {
    let body: {
      visitorId?: string;
      sessionId?: string;
      page?: string;
      action?: 'ping' | 'leave' | 'pageview';
    } = {};

    try {
      body = await req.json();
    } catch {
      // Body may be empty or beacon
    }

    const visitorId = body.visitorId?.trim();
    if (!visitorId) {
      return NextResponse.json({ success: false, error: 'Missing visitorId' }, { status: 400 });
    }

    // 1. Leave action on tab close
    if (body.action === 'leave') {
      await removeVisitor(visitorId);
      return NextResponse.json({ success: true, action: 'removed' });
    }

    const page = body.page || '/';

    // 2. Active visitor heartbeat ping
    await recordVisitorPing(visitorId, page);

    // 3. If a new page navigation / initial session hit occurs, aggregate into analytics_daily
    const sessionId = body.sessionId?.trim() || visitorId;
    if (body.action === 'pageview') {
      await recordSessionHit(sessionId, page);
    }

    return NextResponse.json({ success: true, action: 'recorded' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
