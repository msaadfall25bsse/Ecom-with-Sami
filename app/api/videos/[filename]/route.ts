import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Readable } from 'stream';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// In-memory cache for manifests to avoid redundant storage calls for older videos
const manifestCache = new Map<string, { manifest: any; expiry: number }>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const sanitizedFilename = path.basename(filename);
    const cleanId = sanitizedFilename.replace(/\.[^/.]+$/, '');
    const range = request.headers.get('range');

    // =========================================================================
    // 1. PRIMARY: DIRECT HOSTINGER LOCAL DISK LOOKUP (High-Speed & 720p Ready)
    // =========================================================================
    const candidatePaths = [
      path.join(process.cwd(), 'public', 'uploads', 'videos', sanitizedFilename),
      path.join(process.cwd(), 'public', 'uploads', 'videos', `${cleanId}.mp4`),
      path.join(process.cwd(), 'public', 'uploads', 'videos', `${cleanId}.webm`),
      path.join(process.cwd(), 'public', 'uploads', 'videos', `${cleanId}.mov`),
      path.join(os.tmpdir(), 'ecom_videos', sanitizedFilename),
      path.join(os.tmpdir(), sanitizedFilename)
    ];

    const filePath = candidatePaths.find(p => fs.existsSync(p));

    if (filePath) {
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;

      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes: Record<string, string> = {
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mov': 'video/quicktime',
        '.m4v': 'video/x-m4v',
        '.mkv': 'video/x-matroska'
      };
      const contentType = mimeTypes[ext] || 'video/mp4';

      if (range && range.startsWith('bytes=')) {
        const rangeVal = range.replace('bytes=', '').trim();
        let start: number;
        let end: number;

        if (rangeVal.startsWith('-')) {
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
          start = parseInt(rangeVal.replace('-', ''), 10);
          if (isNaN(start) || start >= fileSize) {
            return new NextResponse('Range Not Satisfiable', {
              status: 416,
              headers: { 'Content-Range': `bytes */${fileSize}` }
            });
          }
          // 2MB to 4MB chunk allows instant start without loading full 500MB
          const MAX_CHUNK = start === 0 ? 2 * 1024 * 1024 : 4 * 1024 * 1024;
          end = Math.min(start + MAX_CHUNK - 1, fileSize - 1);
        } else {
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
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Video-Quality': '720p-Optimized'
          }
        });
      } else {
        const fileStream = fs.createReadStream(filePath);
        const webStream = Readable.toWeb(fileStream);

        return new NextResponse(webStream as any, {
          status: 200,
          headers: {
            'Content-Length': String(fileSize),
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'public, max-age=31536000, immutable',
            'X-Video-Quality': '720p-Optimized'
          }
        });
      }
    }

    // =========================================================================
    // 2. BACKWARD COMPATIBILITY: LEGACY SUPABASE MANIFEST / DIRECT STORAGE
    // =========================================================================
    if (supabase) {
      let manifest = null;
      const cached = manifestCache.get(cleanId);
      if (cached && cached.expiry > Date.now()) {
        manifest = cached.manifest;
      } else {
        try {
          const { data: mBlob, error: mErr } = await supabase.storage
            .from('videos')
            .download(`manifests/${cleanId}.json`);

          if (!mErr && mBlob) {
            manifest = JSON.parse(await mBlob.text());
            manifestCache.set(cleanId, { manifest, expiry: Date.now() + 10 * 60 * 1000 });
          }
        } catch {}
      }

      if (manifest && manifest.totalSize && manifest.partSize) {
        const fileSize = Number(manifest.totalSize);
        const partSize = Number(manifest.partSize);
        const contentType = manifest.contentType || 'video/mp4';

        let start = 0;
        let end = fileSize - 1;

        if (range && range.startsWith('bytes=')) {
          const rangeVal = range.replace('bytes=', '').trim();
          if (rangeVal.startsWith('-')) {
            const suffixLength = parseInt(rangeVal.substring(1), 10);
            if (!isNaN(suffixLength) && suffixLength > 0) {
              start = Math.max(fileSize - suffixLength, 0);
              end = fileSize - 1;
            }
          } else if (rangeVal.endsWith('-')) {
            const parsedStart = parseInt(rangeVal.replace('-', ''), 10);
            if (!isNaN(parsedStart) && parsedStart < fileSize) {
              start = parsedStart;
              const MAX_CHUNK = start === 0 ? 1024 * 1024 : 4 * 1024 * 1024;
              end = Math.min(start + MAX_CHUNK - 1, fileSize - 1);
            }
          } else {
            const parts = rangeVal.split('-');
            const pStart = parseInt(parts[0], 10);
            const pEnd = parseInt(parts[1], 10);
            if (!isNaN(pStart) && !isNaN(pEnd) && pStart <= pEnd && pStart < fileSize) {
              start = pStart;
              end = Math.min(pEnd, fileSize - 1);
            }
          }
        } else {
          end = Math.min(1024 * 1024 - 1, fileSize - 1);
        }

        const partIndex = Math.floor(start / partSize);
        const partGlobalStart = partIndex * partSize;
        const partGlobalEnd = Math.min(partGlobalStart + partSize - 1, fileSize - 1);

        const clampedEnd = Math.min(end, partGlobalEnd);
        const localStart = start - partGlobalStart;
        const localEnd = clampedEnd - partGlobalStart;
        const chunkSize = clampedEnd - start + 1;

        const partPath = manifest.parts?.[partIndex] || `parts/${cleanId}_part_${partIndex}.bin`;
        const { data: pUrl } = supabase.storage.from('videos').getPublicUrl(partPath);

        if (pUrl?.publicUrl) {
          const rangeRes = await fetch(pUrl.publicUrl, {
            headers: {
              'Range': `bytes=${localStart}-${localEnd}`
            }
          });

          if (rangeRes.ok || rangeRes.status === 206) {
            return new NextResponse(rangeRes.body, {
              status: 206,
              headers: {
                'Content-Range': `bytes ${start}-${clampedEnd}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': String(chunkSize),
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'CDN-Cache-Control': 'public, max-age=31536000',
                'Vary': 'Range'
              }
            });
          }
        }
      }
    }

    return new NextResponse('Video not found', { status: 404 });
  } catch (error: any) {
    console.error('Video streaming error:', error);
    return new NextResponse(error.message || 'Stream error', { status: 500 });
  }
}
