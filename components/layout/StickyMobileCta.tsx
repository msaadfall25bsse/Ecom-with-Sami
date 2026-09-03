'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function StickyMobileCta() {
  const pathname = usePathname() || '/';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past 300px
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide on admin and checkout/enrollment pages
  if (pathname.startsWith('/admin') || pathname === '/enrollment' || pathname === '/checkout') {
    return null;
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl px-4 py-2.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] transition-all animate-in slide-in-from-bottom duration-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        
        {/* Price & Benefits */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <div className="flex items-baseline gap-2">
            <span className="text-xs line-through text-red-500 font-semibold">32,500</span>
            <span className="text-base sm:text-lg font-black text-slate-900">PKR 3,900/- Only</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-[#00A0DF]" /> Practical on Mobile
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-[#00A0DF]" /> Lifetime Access of Course
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 size={13} className="text-[#00A0DF]" /> Lifetime Support
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/enrollment"
          className="bg-[#00A0DF] hover:bg-[#008ac2] text-white px-5 sm:px-8 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all inline-flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>GET ACCESS NOW</span>
          <ArrowRight size={14} className="stroke-[3]" />
        </Link>

      </div>
    </div>
  );
}

export default StickyMobileCta;
