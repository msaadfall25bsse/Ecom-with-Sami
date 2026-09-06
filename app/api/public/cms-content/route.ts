import { NextResponse } from 'next/server';
import { dbGetCmsSettings } from '@/lib/database';

export const revalidate = 60;

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=10, s-maxage=60, stale-while-revalidate=300',
};

export async function GET() {
  try {
    const data = await dbGetCmsSettings();
    return NextResponse.json(
      { success: true, sections: data },
      { headers: CACHE_HEADERS }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch public CMS data from database' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
