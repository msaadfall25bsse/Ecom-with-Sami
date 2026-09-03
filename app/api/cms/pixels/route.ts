import { NextRequest, NextResponse } from 'next/server';
import { getServerCmsContent, saveServerCmsContent } from '@/utils/serverStorage';

export async function GET() {
  const data = getServerCmsContent();
  return NextResponse.json({ success: true, pixels: data.pixels });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = saveServerCmsContent({ pixels: body.pixels || body });
    return NextResponse.json({ success: true, message: 'Tracking pixels updated permanently', pixels: updated.pixels });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
