'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, ArrowRight, GraduationCap } from 'lucide-react';

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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-[#00A0DF] to-[#0077B6] flex items-center justify-center text-white shadow-md shadow-[#00A0DF]/30 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag size={20} className="stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
                Ecom <span className="text-[#00A0DF]">With Sami</span>
              </span>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Dropshipping Academy</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((item, idx) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors duration-150 ${
                    isActive
                      ? 'text-[#00A0DF] bg-[#00A0DF]/10'
                      : 'text-slate-700 hover:text-[#00A0DF] hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Student LMS Login Link */}
            <Link
              href="/login"
              className="ml-2 flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-bold text-[#00A0DF] bg-[#00A0DF]/10 hover:bg-[#00A0DF]/20 border border-[#00A0DF]/30 transition-colors duration-150"
            >
              <GraduationCap size={16} />
              <span>Student LMS</span>
            </Link>
          </nav>

          {/* Right Action & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Header Enrollment CTA */}
            <Link
              href="/enrollment"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#00A0DF] to-[#0084BA] hover:from-[#008ec7] hover:to-[#0073a3] shadow-md shadow-[#00A0DF]/30 transition-all duration-200"
            >
              <span>Enroll</span>
              <span className="hidden sm:inline bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold">
                PKR 3,900
              </span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:text-[#00A0DF] hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X size={22} className="text-[#00A0DF]" /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 sm:px-6 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between py-3 px-3 rounded-lg text-sm sm:text-base font-bold text-slate-800 hover:text-[#00A0DF] hover:bg-slate-50 transition-colors border-b border-slate-100"
              >
                <span>{item.label}</span>
                <ArrowRight size={16} className="text-slate-400" />
              </Link>
            ))}

            {/* Student LMS Mobile Link */}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 mt-2 py-3 px-3 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] font-bold text-sm sm:text-base"
            >
              <GraduationCap size={20} />
              <span>Student LMS Portal Login</span>
            </Link>

            {/* Full Width Mobile CTA */}
            <Link
              href="/enrollment"
              onClick={() => setMobileOpen(false)}
              className="mt-3 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white bg-[#00A0DF] font-extrabold text-sm sm:text-base shadow-lg shadow-[#00A0DF]/30"
            >
              <span>Enroll in Mentorship &bull; PKR 3,900</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
