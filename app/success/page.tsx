'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { ProofWall } from '@/components/landing';
import { 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  ShoppingBag, 
  Star, 
  Award,
  CheckCircle2,
  Users
} from 'lucide-react';

export default function SuccessPage() {
  const caseStudies = [
    {
      title: 'How Raza Scaled From 0 to AED 14,800 in First Month',
      student: 'Raza Ali (Lahore)',
      niche: 'Home & Kitchen Essentials',
      market: 'UAE Market',
      adSpend: 'AED 1,200',
      revenue: 'AED 14,800',
      profit: 'AED 6,100 Net Profit',
      quote: 'Using the 3-second TikTok hook strategy, my second video ad reached 45k organic views. Orders started pouring in within 48 hours.'
    },
    {
      title: 'Hamza’s 56 Orders in Week 1 with Dubai Verified Supplier',
      student: 'Hamza Tariq (Islamabad)',
      niche: 'Car Accessories & Gadgets',
      market: 'UAE & KSA',
      adSpend: 'AED 950',
      revenue: 'AED 8,600',
      profit: 'AED 3,850 Net Profit',
      quote: 'The direct warehouse WhatsApp contact delivered items across UAE in 2 days. Fast delivery meant almost zero return rate.'
    },
    {
      title: 'Beginner to SAR 18,500/Mo While Working 9-5 Job',
      student: 'Usman Ghani (Rawalpindi)',
      niche: 'Beauty & Personal Care',
      market: 'Saudi Arabia',
      adSpend: 'SAR 2,100',
      revenue: 'SAR 18,500',
      profit: 'SAR 7,900 Net Profit',
      quote: 'I only spend 1 hour every evening fulfilling orders and monitoring ads. Everything is automated via WhatsApp scripts.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#00A0DF] selection:text-white">
      <TopMarquee />
      <Navbar />

      {/* Header Banner */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              VERIFIED STUDENT PROOF
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 sm:mb-6">
              Real Students. Real Stores. <span className="text-[#00A0DF]">Real Results.</span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-slate-300 leading-relaxed">
              Explore real earnings screenshots, case studies, and reviews from over 9,700 students who joined the Ecom With Sami mentorship.
            </p>
          </div>
        </div>
      </section>

      {/* Key Metric Highlights */}
      <section className="py-8 bg-slate-900 border-y border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-black text-[#00A0DF]">9,700+</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">Total Students</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">89%</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">First Sale in 14 Days</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">4.9 / 5.0</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">Student Rating</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">PKR 3,799</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">One-Time Fee</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured In-Depth Case Studies */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
              Featured Case Studies
            </h2>
            <p className="text-slate-600 text-xs sm:text-base">
              Step-by-step breakdowns of how students launched and scaled their stores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {caseStudies.map((cs, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-[#00A0DF]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-3">
                    <span className="text-[#00A0DF] uppercase">{cs.market}</span>
                    <span>{cs.niche}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3 leading-snug">
                    {cs.title}
                  </h3>
                  
                  {/* Earnings Grid */}
                  <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block">Total Revenue</span>
                      <strong className="text-slate-900 font-black text-sm">{cs.revenue}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Net Profit</span>
                      <strong className="text-emerald-600 font-black text-sm">{cs.profit}</strong>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed mb-6">
                    &ldquo;{cs.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <ShieldCheck size={16} /> Verified Result
                  </span>
                  <span className="text-slate-500">{cs.student}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Full Proof Wall Reviews */}
          <div className="bg-slate-950 rounded-3xl p-6 sm:p-10 text-white">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-black text-[#00A0DF] uppercase tracking-wider block mb-1">
                COMMUNITY REVIEWS
              </span>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                More Student Testimonials &amp; Store Reviews
              </h3>
            </div>
            <ProofWall />
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <Link
              href="/enrollment"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 text-base sm:text-lg font-black uppercase rounded-2xl text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-xl shadow-[#00A0DF]/30 transition-all"
            >
              <span>Join Them &bull; Enroll Now for PKR 3,799</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
