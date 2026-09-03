'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';

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
    }
  ];

  const [testimonials, setTestimonials] = useState<any[]>(customTestimonials || defaultList);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="group relative bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 hover:border-[#00A0DF]/60 shadow-xl hover:shadow-2xl hover:shadow-[#00A0DF]/15 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Stars & Market */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                  {t.market || 'Verified Student'}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Student Details & Revenue Pill */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00A0DF] to-emerald-400 p-0.5 shadow-md">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-black text-xs text-white">
                    {t.initials || t.name?.substring(0, 2).toUpperCase() || 'ST'}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                    <span>{t.name}</span>
                    <ShieldCheck size={14} className="text-[#00A0DF]" />
                  </h4>
                  <p className="text-[11px] text-slate-400">{t.city}</p>
                </div>
              </div>

              {t.sales && (
                <div className="text-right">
                  <span className="inline-block text-[11px] sm:text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-lg">
                    {t.sales}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
