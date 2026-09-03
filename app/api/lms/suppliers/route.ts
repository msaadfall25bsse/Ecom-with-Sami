import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function GET() {
  try {
    const suppliers = db.getSuppliers();
    return NextResponse.json({ success: true, suppliers });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSupplier = db.addSupplier({
      id: `sup_${Date.now()}`,
      name: body.name || 'New Wholesale Supplier',
      category: body.category || 'General Wholesale',
      country: body.country || 'UAE',
      city: body.city || 'Dubai',
      phone: body.phone || '+971501234567',
      whatsappLink: body.whatsappLink || `https://wa.me/${body.phone?.replace(/\D/g, '')}`,
      minOrder: body.minOrder || '1 Piece (Dropshipping)',
      deliveryTime: body.deliveryTime || '24-48 Hours',
      codSupported: body.codSupported ?? true,
      notes: body.notes || 'Verified GCC supplier.'
    });

    return NextResponse.json({
      success: true,
      message: 'Supplier added to LMS directory!',
      supplier: newSupplier,
      suppliers: db.getSuppliers()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'Missing supplier ID' }, { status: 400 });

    const removed = db.deleteSupplier(id);
    if (!removed) return NextResponse.json({ success: false, message: 'Supplier not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      message: 'Supplier removed from LMS directory',
      suppliers: db.getSuppliers()
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
