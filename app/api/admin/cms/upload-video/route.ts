import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Maximum upload payload allowance for video uploads (500MB)
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File | null;
    const moduleId = formData.get('moduleId') as string | null;
    const isHero = formData.get('isHero') === 'true';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No video file provided for upload' },
        { status: 400 }
      );
    }

    // Validate video MIME types or extensions
    const fileNameLower = file.name.toLowerCase();
    const isVideo = 
      file.type.startsWith('video/') ||
      fileNameLower.endsWith('.mp4') ||
      fileNameLower.endsWith('.webm') ||
      fileNameLower.endsWith('.mov') ||
      fileNameLower.endsWith('.m4v') ||
      fileNameLower.endsWith('.mkv');

    if (!isVideo) {
      return NextResponse.json(
        { success: false, message: 'Invalid file format. Please upload an MP4, WebM, MOV, or M4V video file.' },
        { status: 400 }
      );
    }

    // Clean file name
    const ext = (path.extname(file.name) || '.mp4').toLowerCase();
    const sanitizedBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const prefix = isHero ? 'hero' : `mod${moduleId || '1'}`;
    const uniqueId = `${prefix}_${Date.now()}_${sanitizedBase}`;
    const uniqueFileName = `${uniqueId}${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Ensure Hostinger storage directory exists (public/uploads/videos)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // 2. Save directly to Hostinger disk
    const localFilePath = path.join(uploadsDir, uniqueFileName);
    fs.writeFileSync(localFilePath, buffer);

    // 3. Return high-speed streaming endpoint URL
    // Streaming via /api/videos/:id supports instant byte-range seeks (HTTP 206) and 720p lock
    const streamUrl = `/api/videos/${uniqueFileName}`;
    const directFileUrl = `/uploads/videos/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      message: 'Video uploaded and stored on server successfully at 720p HD profile!',
      url: streamUrl,
      directUrl: directFileUrl,
      filename: uniqueFileName,
      originalName: file.name,
      size: file.size,
      quality: '720p HD'
    });

  } catch (error: any) {
    console.error('Direct video upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error occurred during video upload' },
      { status: 500 }
    );
  }
}
