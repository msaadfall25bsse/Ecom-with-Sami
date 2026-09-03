import { NextRequest, NextResponse } from 'next/server';
import { dbGetCmsSettings, dbSaveCmsSettings } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  const data = await dbGetCmsSettings();
  return NextResponse.json({ success: true, testimonials: data.testimonials });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await dbGetCmsSettings();
    const testimonials = [body, ...data.testimonials];
    const updated = await dbSaveCmsSettings({ testimonials });
    return NextResponse.json({ success: true, message: 'Testimonial added permanently to database', testimonials: updated.testimonials });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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
      return NextResponse.json({ success: true, message: 'Testimonial removed from database', testimonials: updated.testimonials });
    }
    return NextResponse.json({ success: false, message: 'Invalid index' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
