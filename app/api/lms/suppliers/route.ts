import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbGetSuppliers, dbAddSupplier, dbDeleteSupplier } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
  'Pragma': 'no-cache',
  'Expires': '0'
};

const triggerRevalidate = () => {
  try {
    revalidatePath('/lms', 'page');
    revalidatePath('/admin', 'page');
    revalidatePath('/admin/cms', 'page');
  } catch (e) {}
};

export async function GET() {
  try {
    const suppliers = await dbGetSuppliers();
    return NextResponse.json({
      success: true,
      suppliers
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newSupplier = await dbAddSupplier({
      id: body.id || `sup_${Date.now()}`,
      name: body.name || 'New Verified Wholesale Supplier',
      category: body.category || 'General Wholesale & Electronics',
      country: body.country || 'UAE',
      city: body.city || 'Dubai',
      phone: body.phone || '+971500000000',
      whatsappLink: body.whatsappLink || `https://wa.me/${(body.phone || '').replace(/[^0-9]/g, '')}`,
      minOrder: body.minOrder || '1 Piece (Dropshipping Enabled)',
      deliveryTime: body.deliveryTime || '24-48 Hours',
      codSupported: body.codSupported !== undefined ? body.codSupported : true,
      notes: body.notes || 'Verified supplier with local stock in UAE/KSA.'
    });

    triggerRevalidate();

    return NextResponse.json({
      success: true,
      message: 'Supplier added to database successfully!',
      supplier: newSupplier,
      suppliers: await dbGetSuppliers()
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'Supplier ID required' }, { status: 400, headers: NO_CACHE_HEADERS });

    const deleted = await dbDeleteSupplier(id);
    if (!deleted) return NextResponse.json({ success: false, message: 'Supplier not found' }, { status: 404, headers: NO_CACHE_HEADERS });

    triggerRevalidate();

    return NextResponse.json({
      success: true,
      message: 'Supplier deleted from database',
      suppliers: await dbGetSuppliers()
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
