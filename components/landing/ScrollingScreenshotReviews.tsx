'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ZoomIn, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';
import { defaultCmsContent } from '@/utils/cmsStore';

interface ScrollingScreenshotReviewsProps {
  data?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    images?: string[];
  };
}

export function ScrollingScreenshotReviews({ data }: ScrollingScreenshotReviewsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fallback = defaultCmsContent.screenshot_reviews || {
    badge: 'REAL STUDENT RESULTS',
    title: 'Join 9,700+ Happy Students',
    subtitle: 'Real, unedited screenshots from our students — results & feedback.',
    images: []
  };

  const badge = data?.badge || fallback.badge || 'REAL STUDENT RESULTS';
  const title = data?.title || fallback.title || 'Join 9,700+ Happy Students';
  const subtitle = data?.subtitle || fallback.subtitle || 'Real, unedited screenshots from our students — results & feedback.';
  
  const rawImages = (data?.images && data.images.length > 0) ? data.images : (fallback.images || []);

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

  // Duplicate each column array so animation repeats continuously with zero jumps
  const loopCol1 = [...col1Images, ...col1Images];
  const loopCol2 = [...col2Images, ...col2Images];

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <section className="relative w-full py-12 sm:py-16 overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#0B0F19] via-[#0D1322] to-[#0B0F19]">
      <div className="max-w-4xl mx-auto px-3.5 sm:px-6">
        
        {/* Header Section (LearnWithAfaq Style) */}
        <div className="text-center mb-8 sm:mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00A0DF]/15 border border-[#00A0DF]/40 text-[#00A0DF] text-xs font-black uppercase tracking-wider shadow-sm shadow-[#00A0DF]/10">
            <Sparkles size={14} className="animate-pulse" />
            <span>{badge}</span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-lg mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Viewport Frame with Gradient Fading Masks (Top & Bottom) */}
        <div className="relative h-[560px] xs:h-[620px] sm:h-[680px] w-full max-w-2xl mx-auto overflow-hidden rounded-3xl border border-white/10 bg-[#070B14]/80 shadow-2xl group-scroll">
          
          {/* Top Soft Gradient Fade Mask */}
          <div className="absolute top-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-b from-[#070B14] via-[#070B14]/80 to-transparent pointer-events-none z-20" />
          
          {/* Bottom Soft Gradient Fade Mask */}
          <div className="absolute bottom-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent pointer-events-none z-20" />

          {/* 2-Column Marquee Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 h-full">
            
            {/* Column 1 (Scrolling Upwards Speed A) */}
            <div className="overflow-hidden relative h-full">
              <div className="flex flex-col gap-3 sm:gap-4 animate-scroll-vertical-col1">
                {loopCol1.map((src, i) => (
                  <div
                    key={`col1-${i}`}
                    role="button"
                    tabIndex={0}
                    style={{ touchAction: 'manipulation' }}
                    onClick={() => setSelectedImage(src)}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      setSelectedImage(src);
                    }}
                    className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-[#00A0DF]/60 bg-[#111827] shadow-lg cursor-pointer transition-transform duration-200 active:opacity-90 flex-shrink-0 select-none"
                  >
                    <img
                      src={src}
                      alt="Student Result Review"
                      loading="lazy"
                      className="w-full h-auto object-cover rounded-2xl block pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-bold pointer-events-none">
                      <ZoomIn size={16} className="text-[#00A0DF]" />
                      <span>Click to Zoom</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2 (Scrolling Upwards Speed B - Parallax) */}
            <div className="overflow-hidden relative h-full">
              <div className="flex flex-col gap-3 sm:gap-4 animate-scroll-vertical-col2">
                {loopCol2.map((src, i) => (
                  <div
                    key={`col2-${i}`}
                    role="button"
                    tabIndex={0}
                    style={{ touchAction: 'manipulation' }}
                    onClick={() => setSelectedImage(src)}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                      setSelectedImage(src);
                    }}
                    className="relative group rounded-2xl overflow-hidden border border-white/10 hover:border-[#00A0DF]/60 bg-[#111827] shadow-lg cursor-pointer transition-transform duration-200 active:opacity-90 flex-shrink-0 select-none"
                  >
                    <img
                      src={src}
                      alt="Student Result Review"
                      loading="lazy"
                      className="w-full h-auto object-cover rounded-2xl block pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-[11px] font-bold pointer-events-none">
                      <ZoomIn size={16} className="text-[#00A0DF]" />
                      <span>Click to Zoom</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Caption Hint below reviews */}
        <p className="text-center text-[11px] text-slate-500 mt-4 flex items-center justify-center gap-1.5">
          <span>👆 Click any screenshot to view full-size earnings proof &amp; WhatsApp chat</span>
        </p>

      </div>

      {/* Lightbox Modal for Enlarged View */}
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
              className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/70 hover:bg-black text-white hover:text-[#00A0DF] transition-colors border border-white/20"
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
    </section>
  );
}
