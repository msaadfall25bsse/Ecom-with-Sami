import { NextRequest, NextResponse } from 'next/server';
import { recordVisitorPing, removeVisitor } from '@/lib/mysql';

/**
 * Hostinger MySQL Realtime Heartbeat Endpoint.
 * Zero Supabase. 100% isolated active_visitors table.
 */
export async function POST(req: NextRequest) {
  try {
    let body: { visitorId?: string; page?: string; action?: 'ping' | 'leave' } = {};
    try {
      body = await req.json();
    } catch {
      // Body may be empty or beacon
    }

    const visitorId = body.visitorId?.trim();
    if (!visitorId) {
      return NextResponse.json({ success: false, error: 'Missing visitorId' }, { status: 400 });
    }

    if (body.action === 'leave') {
      await removeVisitor(visitorId);
      return NextResponse.json({ success: true, action: 'removed' });
    }

    const page = body.page || '/';
    await recordVisitorPing(visitorId, page);

    return NextResponse.json({ success: true, action: 'recorded' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}
