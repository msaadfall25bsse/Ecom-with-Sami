import { NextResponse } from 'next/server';
import { dbGetCmsSettings } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await dbGetCmsSettings();
    return NextResponse.json({
      success: true,
      sections: data
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch public CMS data from database' },
      { status: 500 }
    );
  }
}
