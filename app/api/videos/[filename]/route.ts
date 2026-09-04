import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Readable } from 'stream';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const sanitizedFilename = path.basename(filename);
    
    // Check primary and fallback storage directories on Hostinger
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'uploads', 'videos', sanitizedFilename),
      path.join(os.tmpdir(), 'ecom_videos', sanitizedFilename),
      path.join(os.tmpdir(), sanitizedFilename)
    ];

    const filePath = candidatePaths.find(p => fs.existsSync(p));

    if (!filePath) {
      return new NextResponse('Video not found', { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = request.headers.get('range');

    const ext = path.extname(sanitizedFilename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/quicktime',
      '.m4v': 'video/x-m4v',
      '.mkv': 'video/x-matroska'
    };
    const contentType = mimeTypes[ext] || 'video/mp4';

    // HTTP 206 Partial Content Range handling
    if (range && range.startsWith('bytes=')) {
      const rangeVal = range.replace('bytes=', '').trim();
      let start: number;
      let end: number;

      if (rangeVal.startsWith('-')) {
        // Suffix range: bytes=-1048576 (get last N bytes for MP4 moov metadata atom)
        const suffixLength = parseInt(rangeVal.substring(1), 10);
        if (isNaN(suffixLength) || suffixLength <= 0) {
          return new NextResponse('Range Not Satisfiable', {
            status: 416,
            headers: { 'Content-Range': `bytes */${fileSize}` }
          });
        }
        start = Math.max(fileSize - suffixLength, 0);
        end = fileSize - 1;
      } else if (rangeVal.endsWith('-')) {
        // Open range: bytes=1024- (cap chunk to 5MB for instant smooth buffering)
        start = parseInt(rangeVal.replace('-', ''), 10);
        if (isNaN(start) || start >= fileSize) {
          return new NextResponse('Range Not Satisfiable', {
            status: 416,
            headers: { 'Content-Range': `bytes */${fileSize}` }
          });
        }
        const MAX_CHUNK = 5 * 1024 * 1024; // 5MB fast chunk
        end = Math.min(start + MAX_CHUNK - 1, fileSize - 1);
      } else {
        // Explicit range: bytes=0-1023
        const parts = rangeVal.split('-');
        start = parseInt(parts[0], 10);
        end = parseInt(parts[1], 10);
        if (isNaN(start) || isNaN(end) || start > end || start >= fileSize) {
          return new NextResponse('Range Not Satisfiable', {
            status: 416,
            headers: { 'Content-Range': `bytes */${fileSize}` }
          });
        }
        end = Math.min(end, fileSize - 1);
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });
      const webStream = Readable.toWeb(fileStream);

      return new NextResponse(webStream as any, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': String(chunkSize),
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600'
        }
      });
    } else {
      // Full file stream with Accept-Ranges declared
      const fileStream = fs.createReadStream(filePath);
      const webStream = Readable.toWeb(fileStream);

      return new NextResponse(webStream as any, {
        status: 200,
        headers: {
          'Content-Length': String(fileSize),
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
  } catch (error: any) {
    console.error('Video streaming error:', error);
    return new NextResponse(error.message || 'Stream error', { status: 500 });
  }
}
