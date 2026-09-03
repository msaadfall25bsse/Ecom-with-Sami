'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export function BonusStack({ customData }: { customData?: any }) {
  const [bonusData, setBonusData] = useState<any>(customData || {
    tag: '🎁 FREE BONUSES',
    title: 'Free Bonuses Worth',
    highlight_value: 'Rs 30,000+',
    subtitle: 'Get these exclusive tools and resources absolutely FREE with your enrollment.',
    items: [
      { title: 'Weekly 2-Hour Live Class', desc: 'Join live training sessions every week to learn, ask questions & stay on track.', value: 'FREE' },
      { title: 'Live Campaign Checking', desc: 'Get your live ad campaigns reviewed so you know exactly what to fix and scale.', value: 'FREE' },
      { title: 'Facebook Zero to Hero E-Book', desc: 'A complete guide that takes you from total beginner to confident Facebook advertiser.', value: 'FREE' },
      { title: 'Dropshipping Profit & Loss Calculator', desc: 'Know your real numbers — calculate profit, cost & margins before you spend.', value: 'FREE' },
      { title: 'Premium Shopify Themes', desc: 'Ready-to-use premium store themes so your shop looks professional from day one.', value: 'FREE' },
      { title: 'ChatGPT Prompts Pack', desc: '30+ ready prompts to instantly write product descriptions, ad copy & emails with AI.', value: 'FREE' }
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
    <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden">
      {/* Top Cyan Neon Line */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00A0DF] via-emerald-400 to-[#00A0DF]" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <span className="section-tag-pill mb-3">
          {bonusData.tag || '🎁 FREE BONUSES'}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
          {bonusData.title || 'Free Bonuses Worth'}{' '}
          <span className="text-[#00A0DF]">{bonusData.highlight_value || 'Rs 30,000+'}</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-medium">
          {bonusData.subtitle || 'Get these exclusive tools and resources absolutely FREE with your enrollment.'}
        </p>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {items.map((b: any, idx: number) => (
          <div
            key={idx}
            className="bg-slate-950/80 border border-slate-800/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#00A0DF]/60 transition-colors"
          >
            <div className="flex items-start gap-4 mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#00A0DF]/15 text-[#00A0DF] flex items-center justify-center flex-shrink-0 border border-[#00A0DF]/30">
                <Gift size={20} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white mb-1">{b.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{b.desc}</p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-800/80">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black px-3 py-0.5 rounded-full text-[11px] uppercase tracking-wider">
                {b.value || 'FREE'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Bonus Value Bar */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mb-6">
        <div className="text-white font-extrabold text-sm sm:text-base">
          🎁 Total Bonus Value: <span className="line-through text-slate-500">Rs 30,000</span>
        </div>
        <div className="text-sm sm:text-base font-black text-emerald-400">
          Yours FREE Today
        </div>
      </div>

      <div className="text-center">
        <Link
          href="/enrollment"
          className="lwa-btn px-10 py-4 text-sm sm:text-base font-black rounded-xl"
        >
          YES! I WANT TO LEARN THIS
        </Link>
      </div>
    </div>
  );
}

export default BonusStack;
