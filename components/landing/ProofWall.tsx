'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck } from 'lucide-react';

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
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#00A0DF]/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Stars & Market */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#00A0DF]/10 text-[#00A0DF] px-2.5 py-0.5 rounded-full border border-[#00A0DF]/20">
                  {t.market || 'Verified Student'}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            {/* Student Details & Revenue Pill */}
            <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#00A0DF] text-white flex items-center justify-center font-black text-xs">
                  {t.initials || t.name?.substring(0, 2).toUpperCase() || 'ST'}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1">
                    <span>{t.name}</span>
                    <ShieldCheck size={13} className="text-[#00A0DF]" />
                  </h4>
                  <p className="text-[11px] text-slate-500 font-semibold">{t.city}</p>
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
    </div>
  );
}

export default ProofWall;
