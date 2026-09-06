import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No image file provided' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const originalName = file.name || 'review.jpg';
    const ext = (path.extname(originalName) || '.jpg').toLowerCase();
    const cleanId = `review_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const contentType = file.type || 'image/jpeg';

    // 1. Upload to Supabase Storage (Persistent Cloud Storage)
    if (supabase) {
      try {
        const storagePath = `reviews/${cleanId}`;
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(storagePath, buffer, {
            contentType,
            upsert: true
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from('videos')
            .getPublicUrl(storagePath);

          if (urlData?.publicUrl) {
            return NextResponse.json({
              success: true,
              url: urlData.publicUrl,
              filename: cleanId
            });
          }
        }
      } catch (cloudErr: any) {
        console.warn('Supabase cloud storage review upload fallback:', cloudErr?.message);
      }
    }

    // 2. Local fallback storage
    try {
      const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads', 'reviews');
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }

      const filePath = path.join(publicUploadsDir, cleanId);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/reviews/${cleanId}`,
        filename: cleanId
      });
    } catch (localErr: any) {
      // 3. Ultra fallback: base64 data URI
      const base64 = `data:${contentType};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64,
        filename: cleanId
      });
    }

  } catch (error: any) {
    console.error('Failed to upload review image:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to upload review image' },
      { status: 500 }
    );
  }
}
