import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { success: false, message: 'Cloud storage is not configured on server' },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { manifestId, fileName, totalSize, totalParts, partSize, contentType } = body;

    if (!manifestId || !totalSize || !totalParts) {
      return NextResponse.json(
        { success: false, message: 'Missing required manifest parameters' },
        { status: 400 }
      );
    }

    const cleanManifestId = String(manifestId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const parts: string[] = [];
    for (let p = 0; p < totalParts; p++) {
      parts.push(`parts/${cleanManifestId}_part_${p}.bin`);
    }

    const manifestData = {
      manifestId: cleanManifestId,
      fileName: fileName || `${cleanManifestId}.mp4`,
      totalSize: Number(totalSize),
      totalParts: Number(totalParts),
      partSize: Number(partSize || 40 * 1024 * 1024),
      contentType: contentType || 'video/mp4',
      parts,
      createdAt: new Date().toISOString()
    };

    const manifestJson = JSON.stringify(manifestData);
    const manifestPath = `manifests/${cleanManifestId}.json`;

    const { error: uploadErr } = await supabase.storage
      .from('videos')
      .upload(manifestPath, Buffer.from(manifestJson), {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadErr) {
      console.error('Failed to save video manifest:', uploadErr);
      return NextResponse.json(
        { success: false, message: uploadErr.message || 'Failed to finalize video manifest' },
        { status: 500 }
      );
    }

    // Permanent public video streaming URL
    const videoStreamUrl = `/api/videos/${cleanManifestId}`;

    return NextResponse.json({
      success: true,
      url: videoStreamUrl,
      manifestId: cleanManifestId,
      totalSize: manifestData.totalSize
    });
  } catch (error: any) {
    console.error('Finalize manifest exception:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error finalizing video' },
      { status: 500 }
    );
  }
}
