import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 300;

/**
 * Reliable Video Storage Directory Resolver
 * Tries the public web directory first; falls back to os.tmpdir()
 * to guarantee 100% writable permission across all Linux & Hostinger environments.
 */
function getVideoStorageDir(): string {
  // 1. Primary: public/uploads/videos
  const primaryDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
  try {
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true });
    }
    const testFile = path.join(primaryDir, `.perm_${Date.now()}`);
    fs.writeFileSync(testFile, '1');
    fs.unlinkSync(testFile);
    return primaryDir;
  } catch {
    // Primary path restricted or no permission, proceed to fallback
  }

  // 2. Guaranteed writable Linux fallback
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

/**
 * Hostinger Safe Chunked Video Uploader
 * 
 * Directly appends binary chunk slices to a single temporary file
 * and renames on completion — eliminating disk permission errors,
 * memory overhead, and multi-part assembly bottlenecks.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const chunk = formData.get('chunk') as File | null;
    const uploadId = formData.get('uploadId') as string | null;
    const chunkIndexStr = formData.get('chunkIndex') as string | null;
    const totalChunksStr = formData.get('totalChunks') as string | null;
    const fileName = formData.get('fileName') as string | null;
    const isHero = formData.get('isHero') === 'true';
    const moduleId = formData.get('moduleId') as string | null;

    if (!chunk || !uploadId || chunkIndexStr === null || totalChunksStr === null) {
      return NextResponse.json(
        { success: false, message: 'Missing required chunk parameters' },
        { status: 400 }
      );
    }

    const chunkIndex = parseInt(chunkIndexStr, 10);
    const totalChunks = parseInt(totalChunksStr, 10);
    const safeUploadId = uploadId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const storageDir = getVideoStorageDir();

    const tempFilePath = path.join(storageDir, `temp_${safeUploadId}.part`);
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer());

    // On the first chunk, clean up any previous aborted attempt
    if (chunkIndex === 0 && fs.existsSync(tempFilePath)) {
      try { fs.unlinkSync(tempFilePath); } catch {}
    }

    // Append current chunk directly to the assembling temporary file
    fs.appendFileSync(tempFilePath, chunkBuffer);

    // If this is the final chunk, finalize into permanent video file
    if (chunkIndex === totalChunks - 1) {
      const ext = (path.extname(fileName || '') || '.mp4').toLowerCase();
      const sanitizedBase = path.basename(fileName || 'video', ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
      const prefix = isHero ? 'hero' : `mod${moduleId || '1'}`;
      const finalFileName = `${prefix}_${Date.now()}_${sanitizedBase}${ext}`;
      const finalFilePath = path.join(storageDir, finalFileName);

      if (fs.existsSync(finalFilePath)) {
        try { fs.unlinkSync(finalFilePath); } catch {}
      }

      fs.renameSync(tempFilePath, finalFilePath);

      const finalUrl = `/api/videos/${encodeURIComponent(finalFileName)}`;
      const directUrl = `/uploads/videos/${finalFileName}`;

      return NextResponse.json({
        success: true,
        isCompleted: true,
        message: 'Video saved successfully!',
        url: finalUrl,
        directUrl,
        filename: finalFileName
      });
    }

    return NextResponse.json({
      success: true,
      isCompleted: false,
      chunkIndex,
      totalChunks,
      message: `Chunk ${chunkIndex + 1}/${totalChunks} saved successfully`
    });

  } catch (error: any) {
    console.error('Chunk upload exception:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Chunk upload processing error on server' },
      { status: 500 }
    );
  }
}
