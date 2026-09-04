'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, Sparkles, LayoutGrid, MoveHorizontal, CheckCircle2 } from 'lucide-react';

export function ProofWall({ customTestimonials }: { customTestimonials?: any[] }) {
  const defaultList = [
    {
      name: 'Raza Ali',
      city: 'Lahore',
      sales: 'AED 4,850 in 6 Days',
      orders: '24 Orders',
      quote: 'Launched my first TikTok test ad campaign following Sami’s hook formula. First sale within 18 hours!',
      market: 'UAE Market',
      initials: 'RA'
    },
    {
      name: 'Hamza Tariq',
      city: 'Islamabad',
      sales: 'AED 5,000 / Week',
      orders: '56 Orders',
      quote: 'The direct supplier contacts in Dubai changed everything. Fast 2-day delivery and COD payout on time.',
      market: 'UAE Market',
      initials: 'HT'
    },
    {
      name: 'Bilal Farooq',
      city: 'Karachi',
      sales: 'SAR 3,485 in 3 Days',
      orders: '19 Orders',
      quote: 'Started as a total beginner with zero Shopify knowledge. The 11 modules are so easy and step-by-step.',
      market: 'Saudi Arabia',
      initials: 'BF'
    },
    {
      name: 'Zainab Bibi',
      city: 'Faisalabad',
      sales: 'PKR 480,000 / Mo',
      orders: '110+ Orders',
      quote: 'The WhatsApp mentorship answered every question I had during my ad setup. Never felt alone.',
      market: 'UAE & KSA',
      initials: 'ZB'
    },
    {
      name: 'Usman Ghani',
      city: 'Rawalpindi',
      sales: 'SAR 8,200',
      orders: '78 Orders',
      quote: 'Scaled my product using Advantage+ CBO scaling taught in Module 8. Best investment of my life.',
      market: 'Saudi Market',
      initials: 'UG'
    },
    {
      name: 'Saad Ahmed',
      city: 'Multan',
      sales: 'PKR 320,000 Profit',
      orders: '42 Orders',
      quote: 'Verified suppliers with Arabic packaging makes local buyers trust the store. Return rate dropped to 11%.',
      market: 'UAE Market',
      initials: 'SA'
    },
    {
      name: 'Muhammad Asif',
      city: 'Gujranwala',
      sales: 'AED 6,200 / 10 Days',
      orders: '38 Orders',
      quote: 'The Shopify theme and ChatGPT ad scripts saved me days of work. Real results from week 1!',
      market: 'UAE Market',
      initials: 'MA'
    },
    {
      name: 'Farhan Sheikh',
      city: 'Peshawar',
      sales: 'SAR 5,150',
      orders: '31 Orders',
      quote: 'From zero experience to profitable dropshipping store in KSA. Sami’s guidance is unmatched.',
      market: 'KSA Market',
      initials: 'FS'
    }
  ];

  const [testimonials, setTestimonials] = useState<any[]>(customTestimonials || defaultList);
  const [viewMode, setViewMode] = useState<'moving' | 'grid'>('moving');

  useEffect(() => {
    if (customTestimonials && customTestimonials.length > 0) {
      setTestimonials(customTestimonials);
      return;
    }
    fetch('/api/public/cms-content')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.sections?.testimonials && res.sections.testimonials.length > 0) {
          setTestimonials(res.sections.testimonials);
        }
      })
      .catch(() => {});
  }, [customTestimonials]);

  return (
    <div className="space-y-6">
      
      {/* Interactive Mode Switcher & Status Indicator */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Real-time Moving Student Feedbacks (Hover over any review to pause)</span>
        </div>

        <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold shadow-inner">
          <button
            onClick={() => setViewMode('moving')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              viewMode === 'moving'
                ? 'bg-white text-[#00A0DF] shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MoveHorizontal size={14} />
            <span>Continuous Moving Stream</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-[#00A0DF] shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid size={14} />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* 1. AUTO MOVING HORIZONTAL MARQUEE STREAMS */}
      {viewMode === 'moving' ? (
        <div className="space-y-4 overflow-hidden py-3 marquee-fade-mask relative">
          
          {/* Row 1: Smooth Leftward Moving Track */}
          <div className="animate-marquee-slow flex items-stretch gap-4 sm:gap-5">
            {[...testimonials, ...testimonials, ...testimonials, ...testimonials].map((t, idx) => (
              <div
                key={`r1-${idx}`}
                className="w-[300px] sm:w-[350px] bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-2xl hover:border-[#00A0DF] transition-all flex flex-col justify-between flex-shrink-0 cursor-pointer card-hover-lift"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-400 text-amber-400 drop-shadow-sm" />
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-[#00A0DF]/10 text-[#00A0DF] px-2.5 py-0.5 rounded-full border border-[#00A0DF]/20">
                      {t.market || 'Verified Student'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00A0DF] to-emerald-400 text-white flex items-center justify-center font-black text-xs shadow-sm">
                      {t.initials || t.name?.substring(0, 2).toUpperCase() || 'ST'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                        <span>{t.name}</span>
                        <ShieldCheck size={13} className="text-[#00A0DF]" />
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold">{t.city}</p>
                    </div>
                  </div>

                  {t.sales && (
                    <span className="inline-block text-[10px] sm:text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md shadow-xs">
                      {t.sales}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: Smooth Reverse Moving Track */}
          <div className="animate-marquee-reverse flex items-stretch gap-4 sm:gap-5">
            {[...testimonials, ...testimonials, ...testimonials, ...testimonials].reverse().map((t, idx) => (
              <div
                key={`r2-${idx}`}
                className="w-[300px] sm:w-[350px] bg-[#0B0F19] text-white border border-slate-800 rounded-2xl p-5 shadow-md hover:shadow-2xl hover:border-emerald-400 transition-all flex flex-col justify-between flex-shrink-0 cursor-pointer card-hover-lift"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-400 text-amber-400 drop-shadow-sm" />
                      ))}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                      {t.market || 'Verified Student'}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
                      {t.initials || t.name?.substring(0, 2).toUpperCase() || 'ST'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{t.name}</span>
                        <ShieldCheck size={13} className="text-emerald-400" />
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{t.city}</p>
                    </div>
                  </div>

                  {t.sales && (
                    <span className="inline-block text-[10px] sm:text-[11px] font-extrabold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-md shadow-xs">
                      {t.sales}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* 2. GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto px-4">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-[#00A0DF] transition-all flex flex-col justify-between card-hover-lift"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-[#00A0DF]/10 text-[#00A0DF] px-2.5 py-0.5 rounded-full border border-[#00A0DF]/20">
                    {t.market || 'Verified Student'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00A0DF] text-white flex items-center justify-center font-black text-xs">
                    {t.initials || t.name?.substring(0, 2).toUpperCase() || 'ST'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{t.name}</span>
                      <ShieldCheck size={12} className="text-[#00A0DF]" />
                    </h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{t.city}</p>
                  </div>
                </div>

                {t.sales && (
                  <span className="inline-block text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {t.sales}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default ProofWall;
