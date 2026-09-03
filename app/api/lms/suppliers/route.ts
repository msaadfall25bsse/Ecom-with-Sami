import { NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function GET() {
  try {
    const suppliers = db.getSuppliers();
    return NextResponse.json({
      success: true,
      suppliers
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
