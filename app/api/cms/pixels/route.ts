import { NextRequest, NextResponse } from 'next/server';
import { dbGetCmsSettings, dbSaveCmsSettings } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = dbGetCmsSettings();
  return NextResponse.json({ success: true, pixels: data.pixels });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = dbSaveCmsSettings({ pixels: body.pixels || body });
    return NextResponse.json({ success: true, message: 'Tracking pixels updated permanently in database', pixels: updated.pixels });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
