import { NextRequest, NextResponse } from 'next/server';
import { getCmsContent, updateCmsContent } from '@/utils/cmsStore';

export async function GET() {
  try {
    const data = getCmsContent();
    return NextResponse.json({
      success: true,
      content: data
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to fetch CMS content' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = updateCmsContent(body);
    return NextResponse.json({
      success: true,
      message: 'CMS Content updated successfully!',
      content: updated
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update CMS content' },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return POST(request);
}
