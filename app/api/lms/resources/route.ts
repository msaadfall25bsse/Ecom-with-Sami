import { NextResponse } from 'next/server';
import { dbGetResources } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const resources = dbGetResources();
    return NextResponse.json({
      success: true,
      resources
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
