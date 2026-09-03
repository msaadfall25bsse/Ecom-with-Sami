import { NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function GET() {
  try {
    const modules = db.getModules();
    return NextResponse.json({
      success: true,
      modules
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
