'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export function BonusStack({ customData }: { customData?: any }) {
  const [bonusData, setBonusData] = useState<any>(customData || {
    tag: 'EXCLUSIVE POWER BONUSES',
    title: 'Get 6 Game-Changing Bonuses Worth Over',
    highlight_value: 'Rs 30,000 Free',
    subtitle: 'When you enroll today for PKR 3,900, you get all software tools, supplier contacts, and ad blueprints completely free of charge.',
    items: [
      { title: 'Verified UAE & Saudi Arabia Suppliers Directory', desc: 'Direct WhatsApp contacts of trusted wholesale suppliers in Dubai (Deira), Sharjah, and Riyadh with 24-48 hours COD delivery.', value: 'Rs 10,000 Value' },
      { title: 'High-Converting Premium Shopify Theme (ZIP)', desc: 'The exact custom-coded, ultra-fast converting theme used on our 7-figure stores. Clean, mobile-first design with 1-click upsells.', value: 'Rs 8,500 Value' },
      { title: 'Ready-to-Use Facebook & TikTok Ads Blueprint', desc: 'Pre-written ad copy templates, campaign testing structures, targeting setups, and hook scripts in Arabic & English.', value: 'Rs 5,000 Value' },
      { title: 'E-Commerce P&L Margin & Profit Calculator (Excel)', desc: 'Track advertising spend, product cost, shipping courier fees, COD delivery rates, and net profit margins automatically.', value: 'Rs 3,000 Value' },
      { title: 'Winning Product Hunt Checklist & Spy Prompts', desc: '15-point criteria checklist to discover untapped winning products with high profit margins before your competitors do.', value: 'Rs 2,500 Value' },
      { title: 'Direct WhatsApp Mentorship Desk Access', desc: 'Private direct WhatsApp assistance for account verification, ad troubleshooting, pixel errors, and scaling questions.', value: 'Priceless' }
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
    <div className="relative bg-gradient-to-b from-slate-900 to-[#070A12] border-2 border-[#00A0DF]/40 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden">
      {/* Top Radiant Gradient Line */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#00A0DF] via-emerald-400 to-amber-400" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
        <span className="inline-flex items-center gap-2 bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 shadow-inner">
          <Gift size={15} className="text-[#00A0DF] animate-bounce" />
          <span>{bonusData.tag || 'EXCLUSIVE POWER BONUSES'}</span>
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          {bonusData.title || 'Get 6 Game-Changing Bonuses Worth Over'}{' '}
          <span className="text-emerald-400">{bonusData.highlight_value || 'Rs 30,000 Free'}</span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          {bonusData.subtitle || 'When you enroll today for PKR 3,900, you get all software tools, supplier contacts, and ad blueprints completely free of charge.'}
        </p>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {items.map((b: any, idx: number) => (
          <div
            key={idx}
            className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#00A0DF]/60 hover:shadow-xl hover:shadow-[#00A0DF]/10 transition-all duration-300"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#00A0DF]/20 to-emerald-400/10 text-[#00A0DF] flex items-center justify-center flex-shrink-0 border border-[#00A0DF]/30">
                <Gift size={22} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white mb-1.5">{b.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-medium">{b.desc}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3.5 border-t border-slate-800/80 text-xs">
              <span className="line-through text-slate-500 font-semibold">
                {b.value || b.val || 'Rs 5,000 Value'}
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black px-3 py-1 rounded-full text-[11px] uppercase tracking-wider">
                100% Free With Enrollment
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Value Summary Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left mb-6">
        <div className="flex items-center gap-2.5 text-white font-extrabold text-sm sm:text-base">
          <Sparkles size={18} className="text-amber-400 flex-shrink-0 animate-spin" style={{ animationDuration: '6s' }} />
          <span>TOTAL POWER BONUS VALUE: <span className="text-[#00A0DF]">Rs 30,000+ FREE</span></span>
        </div>
        <div className="text-xs sm:text-sm font-bold text-emerald-400">
          Included 100% FREE with your PKR 3,900 enrollment
        </div>
      </div>
    </div>
  );
}
