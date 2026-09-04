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
    const { manifestId, partIndex } = body;

    if (!manifestId || partIndex === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing manifestId or partIndex' },
        { status: 400 }
      );
    }

    const cleanManifestId = String(manifestId).replace(/[^a-zA-Z0-9_-]/g, '_');
    const safePartPath = `parts/${cleanManifestId}_part_${partIndex}.bin`;

    // Create a 2-hour valid signed upload URL for this 40MB slice
    const { data: signedData, error: signError } = await supabase.storage
      .from('videos')
      .createSignedUploadUrl(safePartPath, {
        upsert: true
      });

    if (signError || !signedData?.signedUrl) {
      console.error('Supabase signed URL error:', signError);
      return NextResponse.json(
        { success: false, message: signError?.message || 'Failed to authorize part upload' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      signedUrl: signedData.signedUrl,
      token: signedData.token,
      partPath: safePartPath
    });
  } catch (error: any) {
    console.error('Get part upload URL exception:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error while preparing part upload' },
      { status: 500 }
    );
  }
}
