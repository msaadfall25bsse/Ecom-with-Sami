'use client';

import React, { useState, useEffect } from 'react';
import { getCmsContent, defaultCmsContent } from '@/utils/cmsStore';

interface TopMarqueeProps {
  items?: string[];
  is_active?: boolean;
}

export function TopMarquee({ items: propItems, is_active: propIsActive }: TopMarqueeProps = {}) {
  const [items, setItems] = useState<string[]>(
    propItems && propItems.length > 0
      ? propItems
      : (getCmsContent()?.marquee?.items && getCmsContent().marquee.items!.length > 0
          ? getCmsContent().marquee.items!
          : defaultCmsContent.marquee.items)
  );
  const [isVisible, setIsVisible] = useState<boolean>(
    propIsActive !== undefined ? propIsActive : true
  );

  useEffect(() => {
    if (propItems && propItems.length > 0) {
      setItems(propItems);
    }
  }, [propItems]);

  useEffect(() => {
    if (propIsActive !== undefined) {
      setIsVisible(propIsActive);
    }
  }, [propIsActive]);

  useEffect(() => {
    const syncMarquee = () => {
      const cms = getCmsContent();
      if (cms?.marquee?.items && Array.isArray(cms.marquee.items) && cms.marquee.items.length > 0) {
        setItems(cms.marquee.items);
      }
    };

    window.addEventListener('sami_cms_updated', syncMarquee);
    return () => window.removeEventListener('sami_cms_updated', syncMarquee);
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
