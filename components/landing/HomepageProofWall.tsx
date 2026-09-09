'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { defaultCmsContent } from '@/utils/cmsStore';

interface HomepageProofWallProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    images?: string[];
  };
}

export function HomepageProofWall({ data }: HomepageProofWallProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // CRITICAL: Guarantee 0 hydration mismatches by returning null until client mount
  if (!mounted) {
    return null;
  }

  const fallback = defaultCmsContent.homepage_proof_wall || {
    badge: 'STUDENT RESULTS',
    title: 'Students Success',
    subtitle: 'Real screenshots and verified reviews shared by our students — unedited and unfiltered.',
    images: ['/uploads/reviews/whatsapp_review_sample.jpg']
  };

  const badge = data?.badge || fallback.badge || 'STUDENT RESULTS';
  const title = data?.title || fallback.title || 'Students Success';
  const subtitle = data?.subtitle || fallback.subtitle || 'Real screenshots and verified reviews shared by our students — unedited and unfiltered.';

  // Safely extract and sanitize image URLs
  const rawImages: string[] = (Array.isArray(data?.images) && data!.images.length > 0)
    ? data!.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
    : (Array.isArray(fallback.images) && fallback.images.length > 0
        ? fallback.images.filter((img): img is string => typeof img === 'string' && img.trim().length > 0)
        : ['/uploads/reviews/whatsapp_review_sample.jpg']);

  // Split images into two columns for natural vertical parallax
  const col1Images: string[] = [];
  const col2Images: string[] = [];

  rawImages.forEach((img, idx) => {
    if (idx % 2 === 0) {
      col1Images.push(img);
    } else {
      col2Images.push(img);
    }
  });

  // If one column is empty (e.g. only 1 image provided), share evenly
  if (col1Images.length === 0 && col2Images.length > 0) {
    col1Images.push(...col2Images);
  } else if (col2Images.length === 0 && col1Images.length > 0) {
    col2Images.push(...col1Images);
  }

  // Cap unique items per column to 4 (duplicated once = 8 items total)
  // With cards at ~240px, total height is ~2,050px — perfectly filling viewport and well under iOS Safari's 4,096px GPU limit
  const col1Slice = col1Images.slice(0, 4);
  const col2Slice = col2Images.slice(0, 4);

  let baseCol1: string[] = [...col1Slice];
  while (baseCol1.length < 4 && col1Slice.length > 0) {
    baseCol1 = baseCol1.concat(col1Slice);
  }
  let baseCol2: string[] = [...col2Slice];
  while (baseCol2.length < 4 && col2Slice.length > 0) {
    baseCol2 = baseCol2.concat(col2Slice);
  }

  const loopCol1 = [...baseCol1, ...baseCol1];
  const loopCol2 = [...baseCol2, ...baseCol2];

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00A0DF]/10 border border-[#00A0DF]/30 text-[#00A0DF] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
          <Sparkles size={14} className="animate-pulse" />
          <span>{badge}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
          {title.includes('Success') ? (
            <>
              {title.split('Success')[0]}
              <span className="text-[#00A0DF]">Success</span>
              {title.split('Success')[1]}
            </>
          ) : (
            title
          )}
        </h2>

        <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Viewport Frame: 100% Non-clickable, Pure Display, Touch-Safe for iPhone Safari & All Devices */}
      <div className="relative h-[560px] xs:h-[620px] sm:h-[680px] w-full max-w-3xl mx-auto overflow-hidden rounded-3xl border border-white/10 bg-[#070B14]/80 shadow-2xl pointer-events-none select-none">
        
        {/* Top Soft Gradient Fade Mask */}
        <div className="absolute top-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-b from-[#070B14] via-[#070B14]/80 to-transparent z-20 pointer-events-none" />
        
        {/* Bottom Soft Gradient Fade Mask */}
        <div className="absolute bottom-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent z-20 pointer-events-none" />

        {/* 2-Column Continuous Infinite Vertical Marquee */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 h-full pointer-events-none">
          
          {/* Column 1 (Slow Continuous Infinite Vertical Scroll 65s) */}
          <div className="overflow-hidden relative h-full">
            <div className="flex flex-col gap-3 sm:gap-4 animate-proofwall-col1">
              {loopCol1.map((src, i) => (
                <div
                  key={`home-col1-${i}`}
                  className="relative w-full h-[220px] xs:h-[240px] sm:h-[270px] rounded-2xl overflow-hidden border border-white/10 bg-[#111827] shadow-lg flex-shrink-0"
                >
                  <img
                    src={src}
                    alt="Student Result Review"
                    loading="eager"
                    decoding="auto"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover object-top rounded-2xl block pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 (Slow Continuous Infinite Vertical Scroll 55s - Parallax) */}
          <div className="overflow-hidden relative h-full">
            <div className="flex flex-col gap-3 sm:gap-4 animate-proofwall-col2">
              {loopCol2.map((src, i) => (
                <div
                  key={`home-col2-${i}`}
                  className="relative w-full h-[220px] xs:h-[240px] sm:h-[270px] rounded-2xl overflow-hidden border border-white/10 bg-[#111827] shadow-lg flex-shrink-0"
                >
                  <img
                    src={src}
                    alt="Student Result Review"
                    loading="eager"
                    decoding="auto"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover object-top rounded-2xl block pointer-events-none"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HomepageProofWall;


