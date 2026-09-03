import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/utils/db';

export async function POST(request: NextRequest) {
  try {
    const { studentId, lessonId, completed } = await request.json();
    const student = db.getStudentById(studentId) || db.getStudents()[0];

    if (!student) {
      return NextResponse.json({ success: false, message: 'Student not found' }, { status: 404 });
    }

    let completedLessons = student.completedLessons || [];
    if (completed && !completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    } else if (!completed) {
      completedLessons = completedLessons.filter(id => id !== lessonId);
    }

    db.updateStudent(student.id, { completedLessons });

    const totalLessons = 36;
    const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

    return NextResponse.json({
      success: true,
      completedLessons,
      progressPercent
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
