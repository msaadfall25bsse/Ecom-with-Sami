'use client';

import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Sparkles } from 'lucide-react';
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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

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

  // Multiply items safely so height fills the container without any gaps
  let baseCol1: string[] = [];
  while (baseCol1.length < 6 && col1Images.length > 0) {
    baseCol1 = baseCol1.concat(col1Images);
  }
  let baseCol2: string[] = [];
  while (baseCol2.length < 6 && col2Images.length > 0) {
    baseCol2 = baseCol2.concat(col2Images);
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

      {/* Viewport Frame with Gradient Fading Masks (Top & Bottom) */}
      <div className="relative h-[640px] xs:h-[700px] sm:h-[760px] w-full max-w-3xl mx-auto overflow-hidden rounded-3xl border border-slate-800 bg-[#070B14] shadow-2xl group-scroll">
        
        {/* Top Soft Gradient Fade Mask */}
        <div className="absolute top-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-b from-[#070B14] via-[#070B14]/85 to-transparent pointer-events-none z-20" />
        
        {/* Bottom Soft Gradient Fade Mask */}
        <div className="absolute bottom-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-t from-[#070B14] via-[#070B14]/85 to-transparent pointer-events-none z-20" />

        {/* 2-Column Marquee Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-5 p-3.5 sm:p-5 h-full">
          
          {/* Column 1 (Slower vertical scroll) */}
          <div className="overflow-hidden relative h-full">
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-homepage-proof-col1">
              {loopCol1.map((src, i) => (
                <div
                  key={`home-col1-${i}`}
                  role="button"
                  tabIndex={0}
                  style={{ touchAction: 'manipulation' }}
                  onClick={() => setSelectedImage(src)}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    setSelectedImage(src);
                  }}
                  className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-[#00A0DF]/70 bg-[#111827] shadow-lg cursor-pointer transition-transform duration-200 active:scale-[0.98] flex-shrink-0 select-none"
                >
                  <img
                    src={src}
                    alt="Student Result Review"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-auto object-cover rounded-2xl block pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold pointer-events-none">
                    <ZoomIn size={18} className="text-[#00A0DF]" />
                    <span>Click to Zoom</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2 (Parallax vertical scroll) */}
          <div className="overflow-hidden relative h-full">
            <div className="flex flex-col gap-3.5 sm:gap-5 animate-homepage-proof-col2">
              {loopCol2.map((src, i) => (
                <div
                  key={`home-col2-${i}`}
                  role="button"
                  tabIndex={0}
                  style={{ touchAction: 'manipulation' }}
                  onClick={() => setSelectedImage(src)}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    setSelectedImage(src);
                  }}
                  className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-[#00A0DF]/70 bg-[#111827] shadow-lg cursor-pointer transition-transform duration-200 active:scale-[0.98] flex-shrink-0 select-none"
                >
                  <img
                    src={src}
                    alt="Student Result Review"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                    className="w-full h-auto object-cover rounded-2xl block pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold pointer-events-none">
                    <ZoomIn size={18} className="text-[#00A0DF]" />
                    <span>Click to Zoom</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Caption Hint below reviews */}
      <p className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1.5 font-medium">
        <span>👆 Click any screenshot to view full-size earnings proof &amp; WhatsApp chat</span>
      </p>

      {/* Lightbox Modal for Full-Size Enlarged View */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl max-h-[90vh] bg-[#111827] border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center"
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/75 hover:bg-black text-white hover:text-[#00A0DF] transition-colors border border-white/20 shadow-lg"
              title="Close Preview (Esc)"
            >
              <X size={20} />
            </button>

            {/* Enlarged Image */}
            <div className="overflow-y-auto max-h-[85vh] p-2 sm:p-4">
              <img
                src={selectedImage}
                alt="Enlarged Student Review"
                className="max-w-full h-auto rounded-2xl shadow-2xl mx-auto block"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomepageProofWall;
