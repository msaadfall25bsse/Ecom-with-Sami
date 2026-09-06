'use client';

import React, { useState, useEffect, useMemo } from 'react';

export function TopMarquee() {
  const [items, setItems] = useState<string[]>([
    '🔥 Shopify Dropshipping Course',
    '88% OFF',
    'PKR 3,799',
    'Lifetime Access',
    'WhatsApp Mentorship',
    'UAE & KSA Training',
    'Join Now'
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

  // Ensure track has adequate width so it spans nicely across all devices
  const trackItems = useMemo(() => {
    if (items.length === 0) return [];
    if (items.length < 5) {
      return [...items, ...items];
    }
    return items;
  }, [items]);

  if (!isVisible || trackItems.length === 0) return null;

  return (
    <div 
      className="safari-marquee-container bg-[#0B0F19] text-white py-2 border-b border-slate-800 text-xs font-extrabold select-none z-40"
      style={{
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      }}
    >
      <div className="flex w-fit">
        {/* Track 1 (Primary) */}
        <div className="animate-marquee-track flex shrink-0 items-center justify-around gap-8 sm:gap-10 pr-8 sm:pr-10 whitespace-nowrap">
          {trackItems.map((item, idx) => (
            <div key={`t1-${idx}`} className="inline-flex items-center gap-2">
              <span 
                className={item.includes('88%') || item.includes('PKR') ? 'text-[#00A0DF]' : 'text-slate-200'}
                dangerouslySetInnerHTML={{ __html: item }}
              />
              <span className="w-1 h-1 rounded-full bg-slate-600" />
            </div>
          ))}
        </div>

        {/* Track 2 (Clone for infinite seamless Safari & iOS safe loop) */}
        <div 
          className="animate-marquee-track flex shrink-0 items-center justify-around gap-8 sm:gap-10 pr-8 sm:pr-10 whitespace-nowrap"
          aria-hidden="true"
        >
          {trackItems.map((item, idx) => (
            <div key={`t2-${idx}`} className="inline-flex items-center gap-2">
              <span 
                className={item.includes('88%') || item.includes('PKR') ? 'text-[#00A0DF]' : 'text-slate-200'}
                dangerouslySetInnerHTML={{ __html: item }}
              />
              <span className="w-1 h-1 rounded-full bg-slate-600" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopMarquee;
