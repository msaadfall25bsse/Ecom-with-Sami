import { NextRequest, NextResponse } from 'next/server';
import { getCmsContent, updateCmsContent } from '@/utils/cmsStore';

export async function GET() {
  const data = getCmsContent();
  return NextResponse.json({ success: true, payment_methods: data.payment_methods });
}

export async function PUT(request: NextRequest) {
  try {
    const { payment_methods } = await request.json();
    if (Array.isArray(payment_methods)) {
      updateCmsContent({ payment_methods });
      return NextResponse.json({ success: true, message: 'Payment accounts updated!', payment_methods });
    }
    return NextResponse.json({ success: false, message: 'Invalid data format' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
