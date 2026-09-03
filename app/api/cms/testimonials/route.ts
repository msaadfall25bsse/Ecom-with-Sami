import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbGetCmsSettings, dbSaveCmsSettings } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
  'Pragma': 'no-cache',
  'Expires': '0'
};

const triggerRevalidate = () => {
  try {
    revalidatePath('/', 'page');
    revalidatePath('/admin/cms', 'page');
  } catch (e) {}
};

export async function GET() {
  const data = await dbGetCmsSettings();
  return NextResponse.json({ success: true, testimonials: data.testimonials }, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await dbGetCmsSettings();
    const testimonials = [body, ...data.testimonials];
    const updated = await dbSaveCmsSettings({ testimonials });
    triggerRevalidate();
    return NextResponse.json({ success: true, message: 'Testimonial added permanently to database', testimonials: updated.testimonials }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get('index') || '-1', 10);
    const data = await dbGetCmsSettings();
    if (index >= 0 && index < data.testimonials.length) {
      const testimonials = data.testimonials.filter((_, i) => i !== index);
      const updated = await dbSaveCmsSettings({ testimonials });
      triggerRevalidate();
      return NextResponse.json({ success: true, message: 'Testimonial removed from database', testimonials: updated.testimonials }, { headers: NO_CACHE_HEADERS });
    }
    return NextResponse.json({ success: false, message: 'Invalid index' }, { status: 400, headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
