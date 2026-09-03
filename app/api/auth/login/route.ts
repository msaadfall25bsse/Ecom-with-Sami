import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password' },
        { status: 400 }
      );
    }

    const student = db.getStudentByEmail(email);

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'No account found with this email. Please enroll first.' },
        { status: 404 }
      );
    }

    if (!student.isActive) {
      return NextResponse.json(
        { success: false, message: 'Your payment verification is currently pending approval. Please contact WhatsApp support.' },
        { status: 403 }
      );
    }

    // Check password (supports demo password or user password)
    if (student.password !== password && password !== 'studentpass2026') {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please check your password.' },
        { status: 401 }
      );
    }

    // Update last login
    db.updateStudent(student.id, { lastLogin: new Date().toISOString() });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful! Welcome to your classroom.',
      user: {
        id: student.id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        city: student.city,
        completedLessons: student.completedLessons || []
      }
    });

    // Set auth cookie
    response.cookies.set('sami_student_session', student.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Server error during authentication' },
      { status: 500 }
    );
  }
}
