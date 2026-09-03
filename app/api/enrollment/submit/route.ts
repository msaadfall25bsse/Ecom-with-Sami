import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      fullName, 
      email, 
      phone, 
      city, 
      whereHeard, 
      paymentMethod, 
      transactionId, 
      receiptUrl 
    } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Please provide full name, email, and phone number.' },
        { status: 400 }
      );
    }

    const trackingCode = `SAMI-ENR-${Math.floor(10000 + Math.random() * 90000)}`;
    const studentId = `std_${Date.now()}`;

    // Add enrollment record to persistent database
    const enrollment = db.addEnrollment({
      id: `enr_${Date.now()}`,
      trackingCode,
      studentId,
      name: fullName,
      email,
      phone,
      city: city || 'Pakistan',
      paymentMethod: paymentMethod || 'Easypaisa',
      transactionId: transactionId || 'Pending Verification',
      whereHeard: whereHeard || 'TikTok',
      receiptUrl: receiptUrl || '',
      amount: 'PKR 3,900',
      status: 'pending',
      createdAt: new Date().toISOString()
    });

    // Check if student exists or create provisional student
    let student = db.getStudentByEmail(email);
    if (!student) {
      student = db.addStudent({
        id: studentId,
        name: fullName,
        email,
        phone,
        city: city || 'Pakistan',
        password: 'studentpass2026',
        isActive: false, // becomes active upon admin approval
        enrolledAt: new Date().toISOString().split('T')[0],
        completedLessons: []
      });
    }

    const whatsappMessage = encodeURIComponent(
      `Assalam o Alaikum Sami! I have submitted my enrollment form.\nTracking Code: ${trackingCode}\nName: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nSource: ${whereHeard || 'TikTok'}\nPayment Method: ${paymentMethod}\nAmount: PKR 3,900.\nPlease verify and activate my LMS portal.`
    );
    const whatsappUrl = `https://wa.me/923158960026?text=${whatsappMessage}`;

    return NextResponse.json({
      success: true,
      message: 'Enrollment submitted successfully!',
      enrollment: {
        trackingCode: enrollment.trackingCode,
        name: enrollment.name,
        email: enrollment.email,
        amount: enrollment.amount,
        status: enrollment.status,
        whatsappUrl
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Error processing enrollment' },
      { status: 500 }
    );
  }
}
