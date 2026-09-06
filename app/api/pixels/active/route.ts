import { NextResponse } from 'next/server';
import { dbGetCmsSettings } from '@/lib/database';

export const revalidate = 60;

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
};

export async function GET() {
  try {
    const data = await dbGetCmsSettings();
    return NextResponse.json({
      success: true,
      pixels: data.pixels
    }, { headers: CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
