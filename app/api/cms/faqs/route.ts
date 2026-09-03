import { NextRequest, NextResponse } from 'next/server';
import { getCmsContent, updateCmsContent } from '@/utils/cmsStore';

export async function GET() {
  const data = getCmsContent();
  return NextResponse.json({ success: true, faqs: data.faqs });
}

export async function POST(request: NextRequest) {
  try {
    const newFaq = await request.json();
    const data = getCmsContent();
    const updated = [...data.faqs, newFaq];
    updateCmsContent({ faqs: updated });
    return NextResponse.json({ success: true, message: 'FAQ added successfully!', faqs: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get('index') || '-1', 10);
    const data = getCmsContent();
    if (index >= 0 && index < data.faqs.length) {
      const updated = data.faqs.filter((_, i) => i !== index);
      updateCmsContent({ faqs: updated });
      return NextResponse.json({ success: true, message: 'FAQ removed', faqs: updated });
    }
    return NextResponse.json({ success: false, message: 'Invalid index' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
