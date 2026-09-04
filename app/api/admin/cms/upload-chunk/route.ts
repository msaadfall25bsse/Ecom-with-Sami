import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk') as File | null;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string || '0', 10);
    const totalChunks = parseInt(formData.get('totalChunks') as string || '1', 10);
    const uploadId = (formData.get('uploadId') as string || 'default').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = (formData.get('fileName') as string || `video_${Date.now()}.mp4`).replace(/[^a-zA-Z0-9._-]/g, '_');

    if (!chunk) {
      return NextResponse.json({ success: false, message: 'Missing chunk data' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const tempFilePath = path.join(uploadsDir, `temp_${uploadId}.part`);
    const buffer = Buffer.from(await chunk.arrayBuffer());

    // Append chunk to temp file
    if (chunkIndex === 0 && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    fs.appendFileSync(tempFilePath, buffer);

    // If this is the final chunk, assemble and finalize
    if (chunkIndex === totalChunks - 1) {
      const finalFilePath = path.join(uploadsDir, fileName);
      if (fs.existsSync(finalFilePath)) {
        fs.unlinkSync(finalFilePath);
      }
      fs.renameSync(tempFilePath, finalFilePath);

      let finalPublicUrl = `/uploads/videos/${fileName}`;

      // Upload assembled video to Supabase Storage if available
      if (supabase) {
        try {
          const fileData = fs.readFileSync(finalFilePath);
          const { error: sbError } = await supabase.storage
            .from('videos')
            .upload(fileName, fileData, {
              contentType: 'video/mp4',
              upsert: true
            });

          if (!sbError) {
            const { data: pUrl } = supabase.storage.from('videos').getPublicUrl(fileName);
            if (pUrl?.publicUrl) {
              finalPublicUrl = pUrl.publicUrl;
            }
          }
        } catch (e: any) {
          console.warn('Supabase chunk assemble upload error, using local url:', e.message);
        }
      }

      return NextResponse.json({
        success: true,
        isComplete: true,
        url: finalPublicUrl,
        filename: fileName
      });
    }

    // Chunk saved successfully, request next chunk
    return NextResponse.json({
      success: true,
      isComplete: false,
      chunkIndex,
      totalChunks
    });

  } catch (error: any) {
    console.error('Chunk upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error processing video chunk' },
      { status: 500 }
    );
  }
}
