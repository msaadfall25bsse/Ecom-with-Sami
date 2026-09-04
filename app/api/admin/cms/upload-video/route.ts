import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File | null;
    const moduleId = formData.get('moduleId') as string | null;

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
    const ext = path.extname(file.name) || '.mp4';
    const sanitizedBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueFileName = `mod${moduleId || '1'}_${Date.now()}_${sanitizedBase}${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Ensure local uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Save to local filesystem
    const localFilePath = path.join(uploadsDir, uniqueFileName);
    fs.writeFileSync(localFilePath, buffer);
    const localPublicUrl = `/uploads/videos/${uniqueFileName}`;

    let finalPublicUrl = localPublicUrl;

    // 2. Attempt Supabase Storage upload for high-speed CDN streaming if available
    if (supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(uniqueFileName, buffer, {
            contentType: file.type || 'video/mp4',
            upsert: true
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from('videos')
            .getPublicUrl(uniqueFileName);

          if (publicUrlData?.publicUrl) {
            finalPublicUrl = publicUrlData.publicUrl;
          }
        } else {
          console.warn('Supabase storage upload failed, using local disk url:', uploadError.message);
        }
      } catch (err: any) {
        console.warn('Supabase upload exception, falling back to local disk:', err.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Video uploaded successfully!',
      url: finalPublicUrl,
      localUrl: localPublicUrl,
      filename: uniqueFileName,
      originalName: file.name,
      size: file.size
    });

  } catch (error: any) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server error occurred during video upload' },
      { status: 500 }
    );
  }
}
