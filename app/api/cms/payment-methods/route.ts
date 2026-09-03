import { NextRequest, NextResponse } from 'next/server';
import { dbGetCmsSettings, dbSaveCmsSettings } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await dbGetCmsSettings();
  return NextResponse.json({ success: true, payment_methods: data.payment_methods });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await dbSaveCmsSettings({ payment_methods: body.payment_methods || body });
    return NextResponse.json({ success: true, message: 'Payment methods updated permanently in database', payment_methods: updated.payment_methods });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
