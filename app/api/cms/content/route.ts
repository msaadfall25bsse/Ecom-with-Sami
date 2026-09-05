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
  try {
    const data = await dbGetCmsSettings();
    return NextResponse.json(
      { success: true, content: data },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch CMS content from database' },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await dbSaveCmsSettings(body);

    // On-demand revalidate all client routes so changes reflect instantly without delay
    try {
      revalidatePath('/', 'page');
      revalidatePath('/', 'layout');
      revalidatePath('/lms', 'page');
      revalidatePath('/admin', 'page');
      revalidatePath('/admin/cms', 'page');
      revalidatePath('/checkout', 'page');
      revalidatePath('/enrollment', 'page');
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'CMS Content saved to database permanently!',
      content: updated
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update CMS content in database' },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
