import { NextRequest, NextResponse } from 'next/server';
import { dbAddEnrollment, dbGetStudentByEmail, dbAddStudent, generateRandomNumericPassword } from '@/lib/database';

export const dynamic = 'force-dynamic';

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
    const uniquePassword = generateRandomNumericPassword();

    // Add enrollment record to persistent database (Supabase + SQLite)
    const enrollment = await dbAddEnrollment({
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
      createdAt: new Date().toISOString(),
      password: uniquePassword
    });

    // Check if student exists or create provisional student
    let student = await dbGetStudentByEmail(email);
    if (!student) {
      student = await dbAddStudent({
        id: studentId,
        name: fullName,
        email,
        phone,
        city: city || 'Pakistan',
        password: uniquePassword,
        isActive: false, // becomes active upon admin approval
        enrolledAt: new Date().toISOString().split('T')[0],
        completedLessons: []
      });
    }

    const adminPhone = '923330093269';
    const whatsappNotifyText = encodeURIComponent(
      `Hello Mentor Sami / Admin,\n\nI have submitted my enrollment application for UAE & KSA Shopify Dropshipping Mentorship.\n\n` +
      `📋 Tracking Code: ${trackingCode}\n` +
      `👤 Name: ${fullName}\n` +
      `📧 Email: ${email}\n` +
      `📱 Phone: ${phone}\n` +
      `💳 Payment Method: ${paymentMethod || 'Easypaisa'}\n` +
      `🔢 TID: ${transactionId || 'Attached in form'}\n\n` +
      `Please verify my payment proof slip and share my LMS Login password on WhatsApp.`
    );
    const whatsappUrl = `https://wa.me/${adminPhone}?text=${whatsappNotifyText}`;

    return NextResponse.json({
      success: true,
      message: 'Enrollment application received! Admin will verify your payment slip and send your LMS password on WhatsApp.',
      trackingCode,
      enrollmentId: enrollment.id,
      loginUrl: '/login',
      studentEmail: email,
      enrollment: {
        ...enrollment,
        whatsappUrl
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit enrollment' },
      { status: 500 }
    );
  }
}
