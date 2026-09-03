'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Users, 
  Globe2, 
  TrendingUp, 
  ShieldCheck, 
  Star,
  Sparkles,
  Phone
} from 'lucide-react';
import { useContactConfig } from '@/utils/contactConfig';

export default function AboutPage() {
  const { displayPhone, getWhatsAppUrl } = useContactConfig();
  const whatsappUrl = getWhatsAppUrl('Hi Sami! I want to ask some questions before enrolling.');

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#00A0DF] selection:text-white">
      <TopMarquee />
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              MEET YOUR MENTOR
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 sm:mb-6">
              Empowering 9,700+ Pakistani Students to Build <span className="text-[#00A0DF]">Real Online Stores</span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
              From absolute zero to multi-million revenue in UAE &amp; Saudi Arabia markets. Learn the exact framework from someone who does it daily.
            </p>
          </div>
        </div>
      </section>

      {/* Main Mentor Profile Section */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Photo & Stats Card */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="w-full max-w-sm bg-slate-950 rounded-3xl p-6 border-2 border-[#00A0DF]/30 shadow-2xl text-center">
                <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full bg-gradient-to-tr from-[#00A0DF] to-emerald-400 p-1.5 mb-6 shadow-xl shadow-[#00A0DF]/30">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-5xl font-black text-[#00A0DF]">
                    SAMI
                  </div>
                </div>
                <h2 className="text-2xl font-black text-white mb-1">Muhammad Sami</h2>
                <p className="text-xs font-bold text-[#00A0DF] uppercase tracking-wider mb-4">
                  Founder &bull; Lead eCommerce Mentor
                </p>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-left">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block">Total Students</span>
                    <strong className="text-base sm:text-lg font-black text-white">9,700+</strong>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs text-slate-400 block">Active Focus</span>
                    <strong className="text-base sm:text-lg font-black text-emerald-400">UAE &amp; KSA</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Story & Vision */}
            <div className="lg:col-span-7">
              <span className="text-xs font-black uppercase tracking-widest text-[#00A0DF] block mb-2">MY STORY &amp; PHILOSOPHY</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
                &ldquo;You Don&rsquo;t Need Millions To Start. You Just Need A Proven Step-by-Step Blueprint.&rdquo;
              </h2>
              <div className="space-y-4 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed mb-8">
                <p>
                  When I started dropshipping, the biggest hurdle wasn&rsquo;t the technical setup &mdash; it was the lack of reliable local supplier contacts in the GCC and constant trial-and-error wasting hard-earned ad spend.
                </p>
                <p>
                  After years of testing, scaling, and establishing direct relationships with verified warehouses across Dubai, Sharjah, and Riyadh, I designed this training specifically for beginners in Pakistan who want to earn in Dirhams and Riyals from home.
                </p>
                <p>
                  Our goal is simple: eliminate the guesswork, give you direct phone numbers to real suppliers, teach you high-converting TikTok &amp; Facebook media buying, and provide live mentorship whenever you get stuck.
                </p>
              </div>

              {/* Core Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <span>100% Practical Screen Walkthroughs</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <span>Direct Verified GCC Warehouse Lists</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <span>Lifetime WhatsApp Mentorship (9AM-5PM)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold text-slate-800">
                  <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                  <span>Weekly Live Campaign &amp; Pixel Audits</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link
                  href="/enrollment"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm sm:text-base font-black text-white bg-[#00A0DF] hover:bg-[#008ec7] rounded-xl shadow-lg shadow-[#00A0DF]/30 transition-all"
                >
                  <span>Enroll in Mentorship (PKR 3,900)</span>
                  <ArrowRight size={18} />
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm sm:text-base font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  <Phone size={16} className="text-emerald-600" />
                  <span>Ask Question on WhatsApp</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Learn With Us Grid */}
      <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Why Learn With Ecom With Sami?
            </h2>
            <p className="text-slate-600 text-xs sm:text-base">
              Here is what sets our training apart from generic online courses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Zero Fluff, 100% Practical</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Every lecture is recorded with live store setups, real ad accounts, and actual campaigns spending budget.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <Globe2 size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Local &amp; GCC Market Focus</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Unlike US dropshipping which takes 20-day shipping, UAE &amp; KSA offers 2-day delivery with cash on delivery payouts.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Dedicated Student Community</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect with thousands of students, share winning creatives, and solve challenges together in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
