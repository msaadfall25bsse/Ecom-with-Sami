import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { 
  dbGetModules, 
  dbAddModule, 
  dbUpdateModule, 
  dbDeleteModule, 
  dbAddLesson, 
  dbUpdateLesson, 
  dbDeleteLesson 
} from '@/lib/database';

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
    revalidatePath('/', 'page');
    revalidatePath('/', 'layout');
    revalidatePath('/lms', 'page');
    revalidatePath('/admin', 'page');
    revalidatePath('/admin/cms', 'page');
  } catch (e) {}
};

export async function GET() {
  try {
    const modules = await dbGetModules();
    return NextResponse.json({
      success: true,
      modules
    }, { headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, module, lesson, moduleId } = body;

    // Action: Add new module
    if (action === 'ADD_MODULE' || (!action && module)) {
      const newMod = module || body;
      const currentModules = await dbGetModules();
      const nextId = currentModules.length > 0 
        ? Math.max(...currentModules.map(m => m.id)) + 1 
        : 1;

      const createdModule = await dbAddModule({
        id: newMod.id || nextId,
        title: newMod.title || `Module ${nextId}: New Course Topic`,
        duration: newMod.duration || '45 mins',
        description: newMod.description || 'Comprehensive step-by-step practical training.',
        lessons: newMod.lessons || []
      });

      triggerRevalidate();

      return NextResponse.json({
        success: true,
        message: 'Module added to database successfully!',
        module: createdModule,
        modules: await dbGetModules()
      }, { headers: NO_CACHE_HEADERS });
    }

    // Action: Add lesson to existing module
    if (action === 'ADD_LESSON') {
      if (!moduleId || !lesson) {
        return NextResponse.json({ success: false, message: 'Missing moduleId or lesson data' }, { status: 400, headers: NO_CACHE_HEADERS });
      }

      const lessonId = lesson.id || `m${moduleId}_l${Date.now()}`;
      const createdLesson = await dbAddLesson(Number(moduleId), {
        id: lessonId,
        title: lesson.title || 'New Lecture Video',
        duration: lesson.duration || '15:00',
        videoUrl: lesson.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        notes: lesson.notes || ''
      });

      if (!createdLesson) {
        return NextResponse.json({ success: false, message: 'Module not found in database' }, { status: 404, headers: NO_CACHE_HEADERS });
      }

      triggerRevalidate();

      return NextResponse.json({
        success: true,
        message: 'Lesson added to module in database successfully!',
        lesson: createdLesson,
        modules: await dbGetModules()
      }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: false, message: 'Invalid action payload' }, { status: 400, headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, moduleId, lessonId, patch } = body;

    if (action === 'UPDATE_MODULE') {
      const updated = await dbUpdateModule(Number(moduleId), patch);
      if (!updated) return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404, headers: NO_CACHE_HEADERS });
      
      triggerRevalidate();
      return NextResponse.json({ success: true, message: 'Module updated in database', module: updated, modules: await dbGetModules() }, { headers: NO_CACHE_HEADERS });
    }

    if (action === 'UPDATE_LESSON') {
      const updated = await dbUpdateLesson(Number(moduleId), lessonId, patch);
      if (!updated) return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404, headers: NO_CACHE_HEADERS });
      
      triggerRevalidate();
      return NextResponse.json({ success: true, message: 'Lesson updated in database', lesson: updated, modules: await dbGetModules() }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: false, message: 'Invalid update action' }, { status: 400, headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const lessonId = searchParams.get('lessonId');

    // Delete specific lesson
    if (moduleId && lessonId) {
      const removed = await dbDeleteLesson(Number(moduleId), lessonId);
      if (!removed) return NextResponse.json({ success: false, message: 'Lesson not found' }, { status: 404, headers: NO_CACHE_HEADERS });
      
      triggerRevalidate();
      return NextResponse.json({ success: true, message: 'Lesson removed from database', modules: await dbGetModules() }, { headers: NO_CACHE_HEADERS });
    }

    // Delete entire module
    if (moduleId) {
      const removed = await dbDeleteModule(Number(moduleId));
      if (!removed) return NextResponse.json({ success: false, message: 'Module not found' }, { status: 404, headers: NO_CACHE_HEADERS });
      
      triggerRevalidate();
      return NextResponse.json({ success: true, message: 'Module deleted from database', modules: await dbGetModules() }, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json({ success: false, message: 'Missing moduleId or lessonId' }, { status: 400, headers: NO_CACHE_HEADERS });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: NO_CACHE_HEADERS });
  }
}
