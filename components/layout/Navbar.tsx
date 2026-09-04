'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname() || '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Curriculum', href: '/#curriculum' },
    { label: 'Success Stories', href: '/success' },
    { label: 'About Sami', href: '/about' },
    { label: 'Guides & Blog', href: '/blogs' },
    { label: 'Support', href: '/support' }
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-gray-200 py-2 sm:py-2.5'
          : 'bg-white border-b border-gray-100 py-2.5 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11 sm:h-14">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 group flex-shrink-0 min-w-0">
            <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 rounded-lg bg-[#00A0DF] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <ShoppingBag size={13} className="stroke-[2.5] xs:hidden" />
              <ShoppingBag size={16} className="stroke-[2.5] hidden xs:block" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] xs:text-[13px] sm:text-base font-black text-slate-900 tracking-tight leading-none truncate">
                Ecom <span className="text-[#00A0DF]">With Sami</span>
              </span>
              <span className="text-[8px] xs:text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 hidden sm:block truncate">
                GCC Dropshipping Academy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item, idx) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? 'text-[#00A0DF] bg-[#00A0DF]/10'
                      : 'text-slate-700 hover:text-[#00A0DF] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Student LMS Portal Link */}
            <Link
              href="/login"
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold text-[#00A0DF] bg-[#00A0DF]/10 hover:bg-[#00A0DF]/20 border border-[#00A0DF]/25 transition-colors"
            >
              <GraduationCap size={14} />
              <span>Student LMS</span>
            </Link>
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 flex-shrink-0">
            {/* Header Enrollment CTA */}
            <Link
              href="/enrollment"
              className="bg-[#00A0DF] hover:bg-[#008ac2] text-white px-2.5 xs:px-3 sm:px-5 py-1.5 xs:py-2 sm:py-2 rounded-lg text-[10px] xs:text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-all inline-flex items-center gap-1 sm:gap-2 flex-shrink-0 active:scale-95"
            >
              <span className="hidden sm:inline">YES! I WANT TO LEARN</span>
              <span className="sm:hidden">ENROLL</span>
              <ArrowRight size={10} className="stroke-[3]" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 xs:p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors active:scale-95 flex items-center justify-center flex-shrink-0 border border-slate-200/60"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-150">
          {navLinks.map((item, idx) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3.5 py-2.5 rounded-lg text-sm font-bold transition-colors ${
                  isActive
                    ? 'text-[#00A0DF] bg-[#00A0DF]/10'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-bold text-[#00A0DF] bg-[#00A0DF]/10 border border-[#00A0DF]/30"
            >
              <GraduationCap size={16} />
              <span>Student LMS Portal</span>
            </Link>

            <Link
              href="/enrollment"
              onClick={() => setMobileOpen(false)}
              className="bg-[#00A0DF] hover:bg-[#008ac2] text-white flex items-center justify-center gap-2 w-full py-3 rounded-lg text-xs font-black uppercase tracking-wider shadow-md"
            >
              <span>YES! I WANT TO LEARN THIS</span>
              <ArrowRight size={14} className="stroke-[3]" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
