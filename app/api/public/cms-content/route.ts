import { NextResponse } from 'next/server';
import { getServerCmsContent } from '@/utils/serverStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = getServerCmsContent();
    return NextResponse.json({
      success: true,
      sections: data
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch public CMS data' },
      { status: 500 }
    );
  }
}
