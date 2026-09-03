'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export function TopMarquee() {
  const [items, setItems] = useState<string[]>([
    '🔥 RAMADAN MEGA DISCOUNT &bull; PKR 3,900 ONLY FOR LIFETIME ACCESS',
    '⚡ 9,700+ SUCCESSFUL STUDENTS TRAINED IN PAKISTAN, UAE & SAUDI ARABIA',
    '🚀 2026 UPDATED GCC DROPSHIPPING BLUEPRINT WITH DIRECT DUBAI SUPPLIERS',
    '💬 DIRECT 1-ON-1 WHATSAPP MENTORSHIP WITH MENTOR SAMI INCLUDED',
    '🎁 6 POWER BONUSES WORTH RS 30,000+ INCLUDED 100% FREE TODAY'
  ]);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/public/cms-content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.sections?.marquee) {
          const m = data.sections.marquee;
          if (m.items && Array.isArray(m.items) && m.items.length > 0) {
            setItems(m.items);
          }
          if (m.is_active !== undefined) {
            setIsVisible(Boolean(m.is_active));
          }
        }
      })
      .catch(() => {});
  }, []);

  if (!isVisible || items.length === 0) return null;

  return (
    <div className="relative bg-[#070A12] text-white overflow-hidden py-2 sm:py-2.5 border-b border-[#00A0DF]/30 text-xs sm:text-[13px] font-bold select-none z-40">
      {/* Left/Right Gradient Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#070A12] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#070A12] to-transparent z-10 pointer-events-none" />

      <div className="animate-marquee flex items-center gap-8 sm:gap-12 whitespace-nowrap">
        {[...items, ...items].map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-3">
            <span 
              className="text-slate-200 hover:text-white transition-colors"
              dangerouslySetInnerHTML={{ __html: item }}
            />
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A0DF] shadow-[0_0_8px_#00A0DF]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopMarquee;
