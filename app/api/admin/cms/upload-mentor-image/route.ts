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

    const originalName = file.name || 'mentor.jpg';
    const ext = (path.extname(originalName) || '.jpg').toLowerCase();
    const cleanId = `mentor_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const contentType = file.type || 'image/jpeg';

    // 1. Upload to Supabase Storage (Persistent Cloud Storage)
    if (supabase) {
      try {
        const storagePath = `mentor/${cleanId}`;
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
        console.warn('Supabase cloud storage mentor upload fallback:', cloudErr?.message);
      }
    }

    // 2. Local fallback storage
    try {
      const publicUploadsDir = path.join(process.cwd(), 'public', 'uploads', 'mentor');
      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }

      const filePath = path.join(publicUploadsDir, cleanId);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/mentor/${cleanId}`,
        filename: cleanId
      });
    } catch (localErr: any) {
      console.warn('Local mentor file upload error:', localErr?.message);
    }

    // 3. Base64 inline fallback if both cloud and local writes fail
    const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
    return NextResponse.json({
      success: true,
      url: base64Data,
      filename: cleanId
    });

  } catch (error: any) {
    console.error('Mentor image upload error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}
