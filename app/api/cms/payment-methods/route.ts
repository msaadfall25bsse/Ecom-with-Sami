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

export async function GET() {
  const data = await dbGetCmsSettings();
  return NextResponse.json({ success: true, payment_methods: data.payment_methods }, { headers: NO_CACHE_HEADERS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await dbSaveCmsSettings({ payment_methods: body.payment_methods || body });
    try {
      revalidatePath('/', 'page');
      revalidatePath('/checkout', 'page');
      revalidatePath('/enrollment', 'page');
      revalidatePath('/admin/cms', 'page');
    } catch (e) {}
    return NextResponse.json({ success: true, message: 'Payment methods updated permanently in database', payment_methods: updated.payment_methods }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
