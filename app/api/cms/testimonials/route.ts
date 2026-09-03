import { NextRequest, NextResponse } from 'next/server';
import { getCmsContent, updateCmsContent } from '@/utils/cmsStore';

export async function GET() {
  const data = getCmsContent();
  return NextResponse.json({ success: true, testimonials: data.testimonials });
}

export async function POST(request: NextRequest) {
  try {
    const newTestimonial = await request.json();
    const data = getCmsContent();
    const updated = [newTestimonial, ...data.testimonials];
    updateCmsContent({ testimonials: updated });
    return NextResponse.json({ success: true, message: 'Testimonial added successfully!', testimonials: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get('index') || '-1', 10);
    const data = getCmsContent();
    if (index >= 0 && index < data.testimonials.length) {
      const updated = data.testimonials.filter((_, i) => i !== index);
      updateCmsContent({ testimonials: updated });
      return NextResponse.json({ success: true, message: 'Testimonial removed', testimonials: updated });
    }
    return NextResponse.json({ success: false, message: 'Invalid index' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
