import { NextRequest, NextResponse } from 'next/server';
import { getServerCmsContent, saveServerCmsContent } from '@/utils/serverStorage';

export async function GET() {
  const data = getServerCmsContent();
  return NextResponse.json({ success: true, faqs: data.faqs });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = getServerCmsContent();
    const faqs = [...data.faqs, body];
    const updated = saveServerCmsContent({ faqs });
    return NextResponse.json({ success: true, message: 'FAQ added permanently', faqs: updated.faqs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get('index') || '-1', 10);
    const data = getServerCmsContent();
    if (index >= 0 && index < data.faqs.length) {
      const faqs = data.faqs.filter((_, i) => i !== index);
      const updated = saveServerCmsContent({ faqs });
      return NextResponse.json({ success: true, message: 'FAQ removed', faqs: updated.faqs });
    }
    return NextResponse.json({ success: false, message: 'Invalid FAQ index' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
