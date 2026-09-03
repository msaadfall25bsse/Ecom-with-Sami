'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, ArrowRight, Sparkles } from 'lucide-react';

export function BonusStack({ customData }: { customData?: any }) {
  const [bonusData, setBonusData] = useState<any>(customData || {
    tag: 'FREE POWER BONUSES',
    title: 'Exclusive Free Bonuses Worth',
    highlight_value: 'Rs 30,000+',
    subtitle: 'Enroll in the course today and get these 6 exclusive power resources 100% FREE with your enrollment.',
    items: [
      { title: 'Weekly 2-Hour Live Class', desc: 'Join live coaching sessions every week with Sami to review ads, solve problems & stay on track.', value: 'Rs 10,000' },
      { title: 'Live Campaign & Pixel Audits', desc: 'Get your live ad campaigns and TikTok/Facebook pixels audited so you know exactly what to scale.', value: 'Rs 7,500' },
      { title: 'Facebook Zero to Hero E-Book', desc: 'A complete step-by-step PDF manual taking you from total beginner to confident advertiser.', value: 'Rs 3,500' },
      { title: 'Dropshipping P&L Margin Calculator', desc: 'Know your exact profit margins, product costs, ad budgets, and COD delivery returns in Excel.', value: 'Rs 3,000' },
      { title: 'Ultra-Fast Premium Shopify Themes', desc: 'Ready-to-use premium store themes optimized for mobile conversions and Arabic RTL layout.', value: 'Rs 4,000' },
      { title: '30+ High-Converting ChatGPT Prompts Pack', desc: 'Instant AI prompts to write compelling product descriptions, viral video hooks, and ad copy.', value: 'Rs 2,500' }
    ]
  });

  useEffect(() => {
    if (customData) {
      setBonusData(customData);
      return;
    }
    fetch('/api/public/cms-content')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.sections?.bonuses) {
          setBonusData(data.sections.bonuses);
        }
      })
      .catch(() => {});
  }, [customData]);

  const items = bonusData.items || [];

  return (
    <div className="relative bg-slate-900 border-2 border-[#00A0DF]/40 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
      {/* Top Gradient Stripe */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#00A0DF] via-emerald-400 to-amber-400" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
        <span className="inline-flex items-center gap-1.5 bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
          <Gift size={14} className="text-[#00A0DF]" />
          <span>{bonusData.tag || 'FREE POWER BONUSES'}</span>
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
          {bonusData.title || 'Exclusive Free Bonuses Worth'}{' '}
          <span className="text-[#00A0DF]">{bonusData.highlight_value || 'Rs 30,000+'}</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed">
          {bonusData.subtitle || 'Enroll in the course today and get these 6 exclusive power resources 100% FREE with your enrollment.'}
        </p>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-8">
        {items.map((b: any, idx: number) => (
          <div
            key={idx}
            className="bg-slate-950/80 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#00A0DF]/50 transition-colors"
          >
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#00A0DF]/15 text-[#00A0DF] flex items-center justify-center flex-shrink-0">
                <Gift size={20} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1">{b.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <span className="line-through text-slate-500 font-medium">
                Value: {b.value || b.val || 'Rs 5,000'}
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black px-2.5 py-0.5 rounded-full text-[11px]">
                FREE TODAY
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Value Summary Bar */}
      <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left mb-6">
        <div className="flex items-center gap-2 text-white font-extrabold text-xs sm:text-sm">
          <Sparkles size={16} className="text-amber-400 flex-shrink-0" />
          <span>TOTAL BONUS VALUE: <span className="text-[#00A0DF]">Rs 30,000+</span></span>
        </div>
        <div className="text-xs font-bold text-emerald-400">
          Included 100% FREE with your PKR 3,900 enrollment
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Link
          href="/enrollment"
          className="btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm sm:text-base font-black uppercase rounded-xl shadow-xl shadow-[#00A0DF]/30"
        >
          <span>Claim All 6 Free Bonuses (PKR 3,900)</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

export default BonusStack;
