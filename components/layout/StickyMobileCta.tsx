'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function StickyMobileCta() {
  const pathname = usePathname() || '/';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past 260px on mobile
      setVisible(window.scrollY > 260);
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
    <div className="fixed bottom-0 inset-x-0 md:hidden z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-2xl px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-lg font-black text-slate-900">PKR 3,900</span>
          <span className="text-xs line-through text-red-500 font-semibold">PKR 32,500</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
          <Zap size={12} className="fill-emerald-600" />
          <span>88% OFF &bull; Lifetime Access</span>
        </div>
      </div>

      <Link
        href="/enrollment"
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-black text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-lg shadow-[#00A0DF]/30 whitespace-nowrap"
      >
        <span>Enroll Now</span>
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default StickyMobileCta;
