'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, ShieldCheck, ArrowUp, Sparkles } from 'lucide-react';
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
    <footer className="bg-gradient-to-b from-[#070A12] via-[#05070D] to-[#030408] text-white pt-16 sm:pt-20 pb-12 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-14">
          
          {/* Column 1: Brand & Contact */}
          <div className="flex flex-col">
            <div className="text-xl sm:text-2xl font-black mb-3 text-white">
              Ecom <span className="text-[#00A0DF]">With Sami</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
              Pakistan’s premier practical e-commerce academy helping students build profitable dropshipping stores in UAE and Saudi Arabia.
            </p>
            <div className="flex flex-col gap-3 text-xs sm:text-sm">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-[#00A0DF] transition-colors font-medium"
              >
                <div className="w-8 h-8 rounded-lg bg-[#00A0DF]/15 text-[#00A0DF] flex items-center justify-center flex-shrink-0">
                  <Mail size={15} />
                </div>
                <span className="truncate">{email}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-[#00A0DF] transition-colors font-medium"
              >
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 text-[#25D366] flex items-center justify-center flex-shrink-0">
                  <Phone size={15} />
                </div>
                <span>{displayPhone} (WhatsApp)</span>
              </a>
            </div>
          </div>

          {/* Column 2: Offices & Locations */}
          <div className="flex flex-col">
            <h4 className="text-xs font-black text-[#00A0DF] uppercase tracking-widest mb-4">
              Offices &amp; Locations
            </h4>
            <div className="flex items-start gap-3 mb-4 bg-slate-900/50 p-3.5 rounded-2xl border border-white/5">
              <MapPin size={17} className="text-[#00A0DF] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-slate-200">Head Office:</strong>
                <span className="text-xs text-slate-400 leading-relaxed font-medium">{headOffice}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-slate-900/50 p-3.5 rounded-2xl border border-white/5">
              <Globe size={17} className="text-[#00A0DF] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-xs font-bold text-slate-200">Regional Office:</strong>
                <span className="text-xs text-slate-400 leading-relaxed font-medium">{regionalOffice}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-xs font-black text-[#00A0DF] uppercase tracking-widest mb-4">
              Quick Navigation
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home &amp; Overview</Link></li>
              <li><Link href="/#curriculum" className="hover:text-white transition-colors">11-Module Curriculum</Link></li>
              <li><Link href="/success" className="hover:text-white transition-colors">Student Success &amp; Proof</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Mentor Sami</Link></li>
              <li><Link href="/blogs" className="hover:text-white transition-colors">Dropshipping Guides &amp; Blog</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Student Support Help Desk</Link></li>
              <li>
                <Link href="/login" className="text-[#00A0DF] font-bold hover:underline inline-flex items-center gap-1.5 mt-1">
                  🎓 Student LMS Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Guarantee */}
          <div className="flex flex-col">
            <h4 className="text-xs font-black text-[#00A0DF] uppercase tracking-widest mb-4">
              Verified Mentorship
            </h4>
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs mb-1.5">
                <ShieldCheck size={16} /> Verified GCC Masterclass
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Lifetime access to curriculum updates, supplier directories, and direct WhatsApp troubleshooting desk.
              </p>
            </div>
            <Link
              href="/enrollment"
              className="btn-glow w-full text-center py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black text-white shadow-xl"
            >
              Enroll for PKR 3,900
            </Link>
          </div>

        </div>

        {/* Legal Disclaimer & Agency Tag */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p className="max-w-3xl leading-relaxed font-medium">
            <strong>Disclaimer:</strong> Results presented in case studies are individual achievements and may vary based on market consistency, ad budgets, and execution.
          </p>
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 flex-shrink-0"
            title="Scroll to top"
          >
            <ArrowUp size={15} />
            <span className="text-[11px] font-bold">Top</span>
          </button>
        </div>

        <div className="text-center text-xs text-slate-600 mt-6 pt-4 border-t border-slate-900">
          &copy; {new Date().getFullYear()} Ecom With Sami. All rights reserved. &bull; Pakistan&apos;s #1 GCC Dropshipping Academy.
        </div>

      </div>
    </footer>
  );
}

export default Footer;
