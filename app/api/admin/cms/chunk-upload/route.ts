import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 120;

/**
 * Hostinger Safe Chunked Video Uploader
 * 
 * Bypasses Nginx/LiteSpeed 413 "Payload Too Large" limits by receiving
 * video files in safe 15MB binary slices and assembling them directly on Hostinger disk.
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
    const tempDir = path.join(process.cwd(), 'public', 'uploads', 'videos', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempChunkPath = path.join(tempDir, `${safeUploadId}_part_${chunkIndex}`);
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer());
    fs.writeFileSync(tempChunkPath, chunkBuffer);

    // If this is the final chunk, assemble all parts into the final video file
    if (chunkIndex === totalChunks - 1) {
      const finalVideosDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
      if (!fs.existsSync(finalVideosDir)) {
        fs.mkdirSync(finalVideosDir, { recursive: true });
      }

      const ext = (path.extname(fileName || '') || '.mp4').toLowerCase();
      const sanitizedBase = path.basename(fileName || 'video', ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
      const prefix = isHero ? 'hero' : `mod${moduleId || '1'}`;
      const finalFileName = `${prefix}_${Date.now()}_${sanitizedBase}${ext}`;
      const finalFilePath = path.join(finalVideosDir, finalFileName);

      // Assemble all parts using WriteStream into destination file
      if (fs.existsSync(finalFilePath)) {
        try { fs.unlinkSync(finalFilePath); } catch {}
      }

      const writeStream = fs.createWriteStream(finalFilePath, { flags: 'w' });
      for (let i = 0; i < totalChunks; i++) {
        const partFile = path.join(tempDir, `${safeUploadId}_part_${i}`);
        if (!fs.existsSync(partFile)) {
          writeStream.end();
          return NextResponse.json(
            { success: false, message: `Missing chunk ${i} during assembly` },
            { status: 400 }
          );
        }
        const partData = fs.readFileSync(partFile);
        writeStream.write(partData);
        // Clean up temporary chunk immediately
        try { fs.unlinkSync(partFile); } catch {}
      }

      await new Promise<void>((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
        writeStream.end();
      });

      const finalUrl = `/api/videos/${finalFileName}`;
      const directUrl = `/uploads/videos/${finalFileName}`;

      return NextResponse.json({
        success: true,
        isCompleted: true,
        message: 'Video chunks assembled into final file on Hostinger successfully!',
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
      { success: false, message: error.message || 'Chunk upload failed' },
      { status: 500 }
    );
  }
}
