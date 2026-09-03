import { NextRequest, NextResponse } from 'next/server';
import { getServerCmsContent, saveServerCmsContent } from '@/utils/serverStorage';

export async function GET() {
  const data = getServerCmsContent();
  return NextResponse.json({ success: true, payment_methods: data.payment_methods });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = saveServerCmsContent({ payment_methods: body.payment_methods || body });
    return NextResponse.json({ success: true, message: 'Payment methods updated permanently', payment_methods: updated.payment_methods });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
