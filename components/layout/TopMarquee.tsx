'use client';

import React, { useState, useEffect } from 'react';

export function TopMarquee() {
  const [items, setItems] = useState<string[]>([
    '🔥 Shopify Dropshipping Course',
    '88% OFF',
    'PKR 3,900',
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

  if (!isVisible || items.length === 0) return null;

  return (
    <div className="relative bg-[#0B0F19] text-white overflow-hidden py-2 border-b border-slate-800 text-xs font-extrabold select-none z-40">
      <div className="animate-marquee flex items-center gap-8 sm:gap-10 whitespace-nowrap">
        {[...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="inline-flex items-center gap-2">
            <span 
              className={item.includes('88%') || item.includes('PKR') ? 'text-[#00A0DF]' : 'text-slate-200'}
              dangerouslySetInnerHTML={{ __html: item }}
            />
            <span className="w-1 h-1 rounded-full bg-slate-600" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TopMarquee;
