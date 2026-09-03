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
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-slate-900/5 border-b border-slate-200/80 py-2 sm:py-3'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-100 py-3 sm:py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group flex-shrink-0">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#00A0DF] via-[#0084BA] to-[#005F89] flex items-center justify-center text-white shadow-lg shadow-[#00A0DF]/30 group-hover:scale-105 group-hover:rotate-1 transition-all duration-300">
              <ShoppingBag size={20} className="stroke-[2.2]" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-none group-hover:text-[#00A0DF] transition-colors">
                Ecom <span className="text-[#00A0DF]">With Sami</span>
              </span>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>GCC Dropshipping Academy</span>
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
                  className={`relative px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'text-[#00A0DF] bg-[#00A0DF]/10 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-1 left-3.5 right-3.5 h-0.5 bg-[#00A0DF] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Student LMS Login Link */}
            <Link
              href="/login"
              className="ml-2 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs xl:text-sm font-extrabold text-[#00A0DF] bg-[#00A0DF]/10 hover:bg-[#00A0DF]/20 border border-[#00A0DF]/30 shadow-sm hover:shadow transition-all duration-200"
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
              className="btn-glow inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black text-white shadow-md shadow-[#00A0DF]/30 transition-all duration-200"
            >
              <Sparkles size={15} className="animate-spin text-amber-300" style={{ animationDuration: '8s' }} />
              <span>Enroll Now</span>
              <span className="hidden sm:inline bg-black/20 px-2 py-0.5 rounded-lg text-[11px] font-bold">
                PKR 3,900
              </span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-in slide-in-from-top-3 duration-200">
          {navLinks.map((item, idx) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'text-[#00A0DF] bg-[#00A0DF]/10'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-[#00A0DF] bg-[#00A0DF]/10 border border-[#00A0DF]/30"
            >
              <GraduationCap size={18} />
              <span>Student LMS Portal</span>
            </Link>

            <Link
              href="/enrollment"
              onClick={() => setMobileOpen(false)}
              className="btn-glow flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-black text-white"
            >
              <span>Enroll in Masterclass &bull; PKR 3,900</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
