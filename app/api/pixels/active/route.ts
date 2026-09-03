import { NextResponse } from 'next/server';
import { dbGetCmsSettings } from '@/lib/database';

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
    return NextResponse.json({
      success: true,
      pixels: data.pixels
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
