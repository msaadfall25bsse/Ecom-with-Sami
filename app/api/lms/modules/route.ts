import { NextRequest, NextResponse } from 'next/server';
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, module, lesson, moduleId } = body;

    // Action: Add new module
    if (action === 'ADD_MODULE' || (!action && module)) {
      const newMod = module || body;
      const nextId = db.getModules().length > 0 
        ? Math.max(...db.getModules().map(m => m.id)) + 1 
        : 1;

      const createdModule = db.addModule({
        id: newMod.id || nextId,
        title: newMod.title || `Module ${nextId}: New Course Topic`,
        duration: newMod.duration || '45 mins',
        description: newMod.description || 'Comprehensive step-by-step practical training.',
        lessons: newMod.lessons || []
      });

      return NextResponse.json({
        success: true,
        message: 'Module added successfully!',
        module: createdModule,
        modules: db.getModules()
      });
    }

    // Action: Add lesson to existing module
    if (action === 'ADD_LESSON') {
      if (!moduleId || !lesson) {
        return NextResponse.json({ success: false, message: 'Missing moduleId or lesson data' }, { status: 400 });
      }

      const lessonId = lesson.id || `m${moduleId}_l${Date.now()}`;
      const createdLesson = db.addLessonToModule(Number(moduleId), {
        id: lessonId,
        title: lesson.title || 'New Lecture Video',
        duration: lesson.duration || '15:00',
        videoUrl: lesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        notes: lesson.notes || ''
      });

      if (!createdLesson) {
        return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        message: 'Lesson added to module successfully!',
        lesson: createdLesson,
        modules: db.getModules()
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, moduleId, lessonId, patch } = body;

    if (action === 'UPDATE_MODULE') {
      const updated = db.updateModule(Number(moduleId), patch);
      if (!updated) return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 });
      return NextResponse.json({ success: true, message: 'Module updated successfully', module: updated, modules: db.getModules() });
    }

    if (action === 'UPDATE_LESSON') {
      const updated = db.updateLesson(Number(moduleId), lessonId, patch);
      if (!updated) return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404 });
      return NextResponse.json({ success: true, message: 'Lesson updated successfully', lesson: updated, modules: db.getModules() });
    }

    return NextResponse.json({ success: false, message: 'Invalid update action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const lessonId = searchParams.get('lessonId');

    // Delete specific lesson
    if (moduleId && lessonId) {
      const removedLesson = db.deleteLesson(Number(moduleId), lessonId);
      if (!removedLesson) return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404 });
      return NextResponse.json({ success: true, message: 'Lesson removed from module', modules: db.getModules() });
    }

    // Delete entire module
    if (moduleId) {
      const removedMod = db.deleteModule(Number(moduleId));
      if (!removedMod) return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404 });
      return NextResponse.json({ success: true, message: 'Module deleted successfully', modules: db.getModules() });
    }

    return NextResponse.json({ success: false, message: 'Missing moduleId or lessonId' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
