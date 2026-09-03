'use client';

import React, { useState } from 'react';
import { analytics } from '@/utils/analytics';
import { useContactConfig } from '@/utils/contactConfig';

export function WhatsAppWidget() {
  const { getWhatsAppUrl, displayPhone } = useContactConfig();
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl = getWhatsAppUrl('Hi Sami! I want to inquire about the UAE & KSA Dropshipping Course.');

  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip Pill */}
      <div
        className={`hidden sm:flex items-center gap-2 bg-slate-950 text-white px-3.5 py-2 rounded-full text-xs font-bold shadow-xl border border-emerald-500/40 transition-all duration-200 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3 pointer-events-none'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] shadow-[0_0_8px_#25D366]" />
        <span>Chat with Sami on WhatsApp</span>
      </div>

      {/* WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Mentor Sami on WhatsApp"
        title={`Direct WhatsApp Mentorship (${displayPhone})`}
        onClick={() => analytics.trackContact({ contact_channel: 'Floating WhatsApp Widget' })}
        className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-transform duration-200"
      >
        {/* Pulse ring */}
        <span className="absolute -inset-1 rounded-full border-2 border-emerald-400/60 animate-ping pointer-events-none" />

        <svg
          viewBox="0 0 32 32"
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current drop-shadow"
        >
          <path d="M16 0.5C7.44 0.5 0.5 7.44 0.5 16C0.5 18.736 1.213 21.31 2.457 23.54L0.6 30.4L7.65 28.58C9.79 29.74 12.24 30.5 16 30.5C24.56 30.5 31.5 23.56 31.5 16C31.5 7.44 24.56 0.5 16 0.5ZM16 27.95C12.65 27.95 10.45 27.16 8.52 26.02L8.06 25.75L3.88 26.84L4.99 22.77L4.7 22.31C3.45 20.32 2.79 18.21 2.79 16C2.79 8.7 8.7 2.79 16 2.79C23.3 2.79 29.21 8.7 29.21 16C29.21 23.3 23.3 27.95 16 27.95ZM22.74 19.38C22.37 19.2 20.55 18.3 20.21 18.18C19.87 18.06 19.63 18 19.38 18.37C19.14 18.74 18.45 19.55 18.24 19.79C18.03 20.03 17.82 20.06 17.45 19.88C17.08 19.7 15.89 19.31 14.48 18.05C13.38 17.07 12.64 15.86 12.43 15.49C12.22 15.12 12.41 14.92 12.59 14.74C12.76 14.57 12.96 14.31 13.14 14.1C13.32 13.89 13.38 13.74 13.5 13.5C13.62 13.26 13.56 13.05 13.47 12.87C13.38 12.69 12.65 10.89 12.35 10.16C12.06 9.45 11.76 9.55 11.54 9.54C11.33 9.53 11.09 9.53 10.85 9.53C10.61 9.53 10.22 9.62 9.89 9.98C9.56 10.34 8.62 11.22 8.62 13.02C8.62 14.82 9.93 16.56 10.11 16.8C10.29 17.04 12.68 20.73 16.34 22.31C17.21 22.69 17.89 22.91 18.42 23.08C19.29 23.36 20.08 23.32 20.71 23.23C21.41 23.13 22.87 22.35 23.17 21.5C23.47 20.65 23.47 19.92 23.38 19.77C23.29 19.62 23.08 19.53 22.74 19.38Z" />
        </svg>
      </a>
    </div>
  );
}

export default WhatsAppWidget;
