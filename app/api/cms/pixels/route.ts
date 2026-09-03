import { NextRequest, NextResponse } from 'next/server';
import { getCmsContent, updateCmsContent } from '@/utils/cmsStore';

export async function GET() {
  const data = getCmsContent();
  return NextResponse.json({ success: true, pixels: data.pixels });
}

export async function PUT(request: NextRequest) {
  try {
    const pixels = await request.json();
    updateCmsContent({ pixels });
    return NextResponse.json({ success: true, message: 'Tracking Pixels updated!', pixels });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
