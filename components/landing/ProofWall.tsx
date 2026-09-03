'use client';

import React from 'react';
import { Star, ShieldCheck, TrendingUp, ShoppingBag } from 'lucide-react';

export function ProofWall() {
  const testimonials = [
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

  return (
    <div className="w-full">
      {/* 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {testimonials.map((item, idx) => (
          <div
            key={idx}
            className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-[#00A0DF]/60 transition-all duration-200 shadow-xl"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-500/30">
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white leading-tight">{item.name}</h4>
                    <p className="text-xs text-slate-400">{item.city} &bull; {item.market}</p>
                  </div>
                </div>

                {/* 5 Stars */}
                <div className="flex gap-0.5 text-amber-400 flex-shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                </div>
              </div>

              {/* Earnings & Orders Badge */}
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-3.5 py-2 mb-4 flex items-center justify-between text-xs sm:text-sm">
                <span className="text-emerald-400 font-black flex items-center gap-1.5">
                  <TrendingUp size={15} />
                  <span>{item.sales}</span>
                </span>
                <span className="text-[#00A0DF] font-bold">{item.orders}</span>
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>

            {/* Verified Student Footer */}
            <div className="pt-4 mt-4 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck size={14} />
                <span>Verified Enrollment</span>
              </span>
              <span>LMS Active</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProofWall;
