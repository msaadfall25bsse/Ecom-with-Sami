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
    const { originalName, moduleId, contentType } = body;

    const rawName = String(originalName || 'lecture.mp4');
    const ext = rawName.substring(rawName.lastIndexOf('.')) || '.mp4';
    const cleanBase = rawName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);

    const safeFileName = `mod${moduleId || '1'}_${Date.now()}_${cleanBase}${ext}`;

    // Generate signed upload URL (valid for 2 hours for large video uploads)
    const { data: signedData, error: signError } = await supabase.storage
      .from('videos')
      .createSignedUploadUrl(safeFileName, {
        upsert: true
      });

    if (signError || !signedData?.signedUrl) {
      console.error('Supabase signed URL error:', signError);
      return NextResponse.json(
        { success: false, message: signError?.message || 'Failed to generate signed upload URL' },
        { status: 500 }
      );
    }

    // Generate permanent public playback URL for LMS
    const { data: publicUrlData } = supabase.storage
      .from('videos')
      .getPublicUrl(safeFileName);

    const publicUrl = publicUrlData?.publicUrl || signedData.signedUrl.split('?')[0];

    return NextResponse.json({
      success: true,
      signedUrl: signedData.signedUrl,
      token: signedData.token,
      publicUrl,
      fileName: safeFileName,
      contentType: contentType || 'video/mp4'
    });
  } catch (error: any) {
    console.error('Get upload URL exception:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error while preparing upload' },
      { status: 500 }
    );
  }
}
