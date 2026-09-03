import { NextResponse } from 'next/server';
import { getCmsContent } from '@/utils/cmsStore';

export async function GET() {
  try {
    const data = getCmsContent();
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
