'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, ShieldCheck, ArrowUp } from 'lucide-react';
import { useContactConfig } from '@/utils/contactConfig';

export function Footer() {
  const { email, displayPhone, headOffice, regionalOffice, getWhatsAppUrl } = useContactConfig();
  const whatsappUrl = getWhatsAppUrl('Hi Sami! I want to enroll in the UAE & KSA Dropshipping Course (PKR 3,900). Can you help me?');

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#0B0F19] text-white pt-14 sm:pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Contact Info */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              Contact Info
            </h4>
            <div className="flex flex-col gap-3 text-xs sm:text-sm">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-[#00A0DF] transition-colors font-medium"
              >
                <div className="w-7 h-7 rounded-lg bg-[#00A0DF]/15 text-[#00A0DF] flex items-center justify-center flex-shrink-0">
                  <Mail size={14} />
                </div>
                <span className="truncate">{email}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-[#00A0DF] transition-colors font-medium"
              >
                <div className="w-7 h-7 rounded-lg bg-[#25D366]/15 text-[#25D366] flex items-center justify-center flex-shrink-0">
                  <Phone size={14} />
                </div>
                <span>{displayPhone}</span>
              </a>
            </div>
          </div>

          {/* Column 2: Head Office */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              Head Office
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              {headOffice}
            </p>
          </div>

          {/* Column 3: Regional Presence */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              Regional Presence
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
              Dubai, UAE<br />
              Riyadh, Saudi Arabia
            </p>
          </div>

          {/* Column 4: Legal & Navigation */}
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">
              Legal &amp; Support
            </h4>
            <div className="flex flex-col gap-2 text-xs sm:text-sm text-slate-400 font-medium">
              <Link href="/privacy" className="hover:text-[#00A0DF] transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-[#00A0DF] transition-colors">Terms &amp; Conditions</Link>
              <Link href="/refund" className="hover:text-[#00A0DF] transition-colors">Refund Policy</Link>
              <Link href="/login" className="text-[#00A0DF] font-bold hover:underline mt-1">Student LMS Portal</Link>
            </div>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p className="max-w-3xl leading-relaxed font-medium">
            Results are not guaranteed and will vary based on individual effort, market conditions, and other factors. Every person is different, and your level of success depends on your experience, dedication, and hard work.
          </p>
          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center gap-1 flex-shrink-0"
            title="Scroll to top"
          >
            <ArrowUp size={14} />
            <span className="text-[11px] font-bold">Top</span>
          </button>
        </div>

        <div className="text-center text-xs text-slate-600 mt-6">
          &copy; {new Date().getFullYear()} Ecom With Sami. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;
