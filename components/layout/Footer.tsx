'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Globe, ShieldCheck } from 'lucide-react';
import { useContactConfig } from '@/utils/contactConfig';

export function Footer() {
  const { email, displayPhone, headOffice, regionalOffice, getWhatsAppUrl } = useContactConfig();
  const whatsappUrl = getWhatsAppUrl('Hi Sami! I want to enroll in the UAE & KSA Dropshipping Course (PKR 3,900). Can you help me?');

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
          
          {/* Column 1: Brand & Contact */}
          <div className="flex flex-col">
            <div className="text-xl sm:text-2xl font-black mb-3">
              Ecom <span className="text-[#00A0DF]">With Sami</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Pakistan’s premier practical e-commerce academy helping students build profitable dropshipping stores in UAE and Saudi Arabia.
            </p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 text-slate-300 hover:text-[#00A0DF] transition-colors"
              >
                <Mail size={16} className="text-[#00A0DF] flex-shrink-0" />
                <span className="truncate">{email}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-[#00A0DF] transition-colors"
              >
                <Phone size={16} className="text-[#00A0DF] flex-shrink-0" />
                <span>{displayPhone} (WhatsApp)</span>
              </a>
            </div>
          </div>

          {/* Column 2: Offices & Locations */}
          <div className="flex flex-col">
            <h4 className="text-base font-extrabold text-white mb-4 uppercase tracking-wider text-xs text-[#00A0DF]">
              Offices &amp; Locations
            </h4>
            <div className="flex items-start gap-3 mb-4">
              <MapPin size={18} className="text-[#00A0DF] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm text-slate-200">Head Office:</strong>
                <span className="text-xs sm:text-sm text-slate-400 leading-relaxed">{headOffice}</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe size={18} className="text-[#00A0DF] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm text-slate-200">Regional Presence:</strong>
                <span className="text-xs sm:text-sm text-slate-400 leading-relaxed">{regionalOffice}</span>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex flex-col">
            <h4 className="text-base font-extrabold text-white mb-4 uppercase tracking-wider text-xs text-[#00A0DF]">
              Quick Navigation
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-white transition-colors">Home &amp; Overview</Link></li>
              <li><Link href="/#curriculum" className="hover:text-white transition-colors">11-Module Curriculum</Link></li>
              <li><Link href="/success" className="hover:text-white transition-colors">Student Success &amp; Proof</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Mentor Sami</Link></li>
              <li><Link href="/blogs" className="hover:text-white transition-colors">Dropshipping Guides &amp; Blog</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Student Support Help Desk</Link></li>
              <li>
                <Link href="/login" className="text-[#00A0DF] font-bold hover:underline inline-flex items-center gap-1.5">
                  🎓 Student LMS Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Trust & Guarantee */}
          <div className="flex flex-col">
            <h4 className="text-base font-extrabold text-white mb-4 uppercase tracking-wider text-xs text-[#00A0DF]">
              Verified Mentorship
            </h4>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1.5">
                <ShieldCheck size={18} /> Verified Program
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Lifetime access to curriculum updates, supplier lists, and direct WhatsApp troubleshooting.
              </p>
            </div>
            <Link
              href="/enrollment"
              className="w-full text-center py-3 px-4 rounded-xl text-sm font-extrabold text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-lg shadow-[#00A0DF]/30 transition-all duration-200"
            >
              Enroll for PKR 3,900
            </Link>
          </div>

        </div>

        {/* Legal Disclaimer & Agency Tag */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col gap-4 text-xs text-slate-500 text-center">
          <p className="max-w-4xl mx-auto leading-relaxed">
            <strong>Earnings &amp; Results Disclaimer:</strong> Results presented in student case studies and testimonials are individual results and will vary based on effort, budget, consistency, and market execution.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap text-slate-400">
            <span>&copy; {new Date().getFullYear()} Ecom With Sami. All rights reserved.</span>
            <span>&bull;</span>
            <span>Pakistan’s #1 GCC Dropshipping Training.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
