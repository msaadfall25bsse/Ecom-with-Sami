import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbGetEnrollments, dbUpdateEnrollmentStatus, dbDeleteEnrollment } from '@/lib/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0',
  'Pragma': 'no-cache',
  'Expires': '0'
};

export async function GET() {
  try {
    const enrollments = await dbGetEnrollments();
    return NextResponse.json({ success: true, enrollments }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

function formatWhatsAppPhone(phone: string): string {
  let clean = (phone || '').replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '92' + clean.slice(1);
  } else if (!clean.startsWith('92') && clean.length === 10) {
    clean = '92' + clean;
  }
  return clean;
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status, password } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ success: false, message: 'Missing id or status' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    const result = await dbUpdateEnrollmentStatus(id, status, password);
    if (!result || !result.enrollment) {
      return NextResponse.json({ success: false, message: 'Enrollment not found' }, { status: 404, headers: NO_CACHE_HEADERS });
    }

    const { enrollment, password: generatedPassword } = result;

    const studentPhoneClean = formatWhatsAppPhone(enrollment.phone);
    const whatsappText = encodeURIComponent(
      `🎉 *Assalam-o-Alaikum ${enrollment.name}! Welcome to Ecom With Sami Mentorship!*\n\n` +
      `Your enrollment payment proof has been verified and your Student LMS Portal Account is now *ACTIVE*.\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🔐 *YOUR LMS LOGIN CREDENTIALS:*\n` +
      `🌐 *Login Portal:* https://ecomwithsami.com/login\n` +
      `📧 *Email:* ${enrollment.email}\n` +
      `🔑 *Password:* ${generatedPassword || 'studentpass2026'}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `✅ *Next Steps:*\n` +
      `1. Open the portal link above\n` +
      `2. Enter your Email and Password\n` +
      `3. Start watching the 11 Course Modules and access the Supplier Directory!\n\n` +
      `If you face any issues, feel free to reply directly to this message.\n\n` +
      `Best Regards,\n` +
      `*Mentor Sardar Samiullah & Support Team*`
    );
    const whatsappUrl = `https://wa.me/${studentPhoneClean}?text=${whatsappText}`;

    try {
      revalidatePath('/admin', 'page');
      revalidatePath('/admin/cms', 'page');
      revalidatePath('/lms', 'page');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: `Enrollment status updated to ${status} and student access granted.`,
      enrollment,
      password: generatedPassword,
      whatsappUrl,
      studentPhoneClean
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    let id = url.searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch (e) {}
    }

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing enrollment id' }, { status: 400, headers: NO_CACHE_HEADERS });
    }

    await dbDeleteEnrollment(id);

    try {
      revalidatePath('/admin', 'page');
      revalidatePath('/admin/cms', 'page');
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Enrollment record permanently deleted from database.'
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
