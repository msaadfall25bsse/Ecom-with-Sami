import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

// Dual-path directory resolver: checks primary web root, falls back to os.tmpdir()
export function getVideoStorageDir(): string {
  // Primary: public/uploads/videos
  const primaryDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
  try {
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true });
    }
    // Test write permission
    const testFile = path.join(primaryDir, `.test_${Date.now()}`);
    fs.writeFileSync(testFile, 'ok');
    fs.unlinkSync(testFile);
    return primaryDir;
  } catch {
    // Primary path restricted, use os.tmpdir fallback
  }

  // Fallback: guaranteed writable directory on Linux/Hostinger
  const fallbackDir = path.join(os.tmpdir(), 'ecom_videos');
  try {
    if (!fs.existsSync(fallbackDir)) {
      fs.mkdirSync(fallbackDir, { recursive: true });
    }
    return fallbackDir;
  } catch {
    return os.tmpdir();
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk') as File | null;
    const chunkIndex = parseInt(formData.get('chunkIndex') as string || '0', 10);
    const totalChunks = parseInt(formData.get('totalChunks') as string || '1', 10);
    const uploadId = (formData.get('uploadId') as string || 'default').replace(/[^a-zA-Z0-9_-]/g, '_');
    const fileName = (formData.get('fileName') as string || `video_${Date.now()}.mp4`).replace(/[^a-zA-Z0-9._-]/g, '_');

    if (!chunk) {
      return NextResponse.json({ success: false, message: 'Missing chunk payload' }, { status: 400 });
    }

    const storageDir = getVideoStorageDir();
    const tempFilePath = path.join(storageDir, `temp_${uploadId}.part`);
    const buffer = Buffer.from(await chunk.arrayBuffer());

    // Clean up temp file on first chunk
    if (chunkIndex === 0 && fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath); } catch {}
    }

    // Append chunk buffer to temp file
    fs.appendFileSync(tempFilePath, buffer);

    // If this is the final chunk, assemble and finalize video
    if (chunkIndex === totalChunks - 1) {
      const finalFilePath = path.join(/*turbopackIgnore: true*/ storageDir, fileName);
      if (fs.existsSync(/*turbopackIgnore: true*/ finalFilePath)) {
        try { fs.unlinkSync(finalFilePath); } catch {}
      }
      fs.renameSync(tempFilePath, finalFilePath);

      const stat = fs.statSync(/*turbopackIgnore: true*/ finalFilePath);

      // Fast streaming endpoint on Hostinger
      const videoStreamUrl = `/api/videos/${encodeURIComponent(fileName)}`;

      return NextResponse.json({
        success: true,
        isComplete: true,
        url: videoStreamUrl,
        filename: fileName,
        size: stat.size
      });
    }

    // Non-final chunk processed successfully
    return NextResponse.json({
      success: true,
      isComplete: false,
      chunkIndex,
      totalChunks
    });

  } catch (error: any) {
    console.error('Chunk upload processing error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error processing video chunk on server' },
      { status: 500 }
    );
  }
}
