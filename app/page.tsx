'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Navbar, 
  Footer, 
  TopMarquee 
} from '@/components/layout';
import { 
  BonusStack, 
  CountdownTimer, 
  CurriculumAccordion, 
  ProofWall, 
  VideoModal 
} from '@/components/landing';
import { 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Globe2, 
  Building2, 
  TrendingUp, 
  WalletCards,
  XCircle
} from 'lucide-react';
import { defaultCmsContent, CmsContentSchema } from '@/utils/cmsStore';

export default function HomePage() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [content, setContent] = useState<CmsContentSchema>(defaultCmsContent);

  useEffect(() => {
    const syncData = () => {
      try {
        const cached = localStorage.getItem('sami_cms_content');
        if (cached) {
          setContent(JSON.parse(cached));
        }
      } catch (e) {}

      const timestamp = Date.now();
      fetch(`/api/public/cms-content?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
        .then((r) => r.json())
        .then((res) => {
          if (res.success && res.sections) {
            setContent(res.sections);
            try {
              localStorage.setItem('sami_cms_content', JSON.stringify(res.sections));
            } catch (e) {}
          }
        })
        .catch(() => {});
    };

    syncData();

    // Listen for instant updates across tabs or windows
    window.addEventListener('sami_cms_updated', syncData);
    window.addEventListener('storage', syncData);

    return () => {
      window.removeEventListener('sami_cms_updated', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, []);

  const hero = content.hero || defaultCmsContent.hero;
  const stats = content.stats || defaultCmsContent.stats;
  const mentor = content.mentor || defaultCmsContent.mentor;
  const faqs = content.faqs || defaultCmsContent.faqs;

  return (
    <div className="relative min-h-screen bg-white text-slate-900 selection:bg-[#00A0DF] selection:text-white">
      {/* Top Promotional Ticker */}
      <TopMarquee />

      {/* Main Navigation Header */}
      <Navbar />

      {/* Video Modal Popup */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title={hero.video_title || '128-Second Dropshipping Blueprint Overview'}
        videoUrl={hero.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-8 pb-14 sm:pt-14 sm:pb-20 md:pt-16 md:pb-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-full p-1 pr-3 sm:pr-4 mb-4 sm:mb-6 shadow-md border border-slate-700 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-[#00A0DF] animate-pulse ml-2" />
              <span className="text-[#00A0DF] font-black">{hero.badge || "PAKISTAN'S #1"}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.18] mb-4 sm:mb-6">
              {hero.title_line1 || 'Learn How to Start Online Dropshipping Store in UAE & KSA'}{' '}
              <span className="text-[#00A0DF]">{hero.title_highlight || 'Step-by-Step Training'}</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base md:text-xl text-slate-600 font-medium max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              {hero.subtitle}
            </p>

            {/* Video Preview Card */}
            <div className="w-full max-w-2xl mb-6 sm:mb-8 relative group">
              <div 
                onClick={() => setIsVideoOpen(true)}
                className="relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#00A0DF]/30 bg-slate-950 aspect-video flex items-center justify-center transition-all duration-300 group-hover:border-[#00A0DF] group-hover:scale-[1.01]"
              >
                {/* Overlay Poster Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 flex flex-col justify-end p-4 sm:p-6 text-left">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00A0DF] mb-1">Preview Video</span>
                  <h3 className="text-white text-xs sm:text-base md:text-lg font-bold line-clamp-2">
                    {hero.video_title}
                  </h3>
                </div>

                {/* Big Animated Play Button */}
                <div className="relative z-20 w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-full bg-[#00A0DF] text-white flex items-center justify-center shadow-lg shadow-[#00A0DF]/50 group-hover:scale-110 transition-transform duration-300">
                  <Play size={24} className="sm:w-8 sm:h-8 fill-white translate-x-0.5" />
                </div>
              </div>
            </div>

            {/* Call to Action Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto mb-4 sm:mb-6">
              <Link 
                href="/enrollment" 
                className="w-full py-3.5 sm:py-4 px-6 text-sm sm:text-base md:text-lg font-black uppercase tracking-wide rounded-xl sm:rounded-2xl text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-xl shadow-[#00A0DF]/30 flex items-center justify-center gap-2 transition-all duration-200"
              >
                <span>{hero.cta_text || 'YES! I WANT TO LEARN THIS'}</span>
                <ArrowRight size={20} />
              </Link>
            </div>

            {/* Pricing Comparison Tag */}
            <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-semibold text-slate-800 shadow-sm">
              <span>Originally <span className="line-through text-red-500 font-bold">{hero.original_price}</span></span>
              <span>&mdash;</span>
              <span>Get Instant Access Today for Just <span className="text-[#00A0DF] font-black">{hero.current_price}</span></span>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS BAR */}
      {/* ========================================================================= */}
      <section className="py-8 sm:py-10 bg-slate-950 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center">
              <div className="text-xl sm:text-2xl mb-1 text-[#00A0DF]">⏱</div>
              <div className="text-lg sm:text-2xl font-black text-white">{stats.training_hours}</div>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Practical Training</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center">
              <div className="text-xl sm:text-2xl mb-1 text-emerald-400">▶</div>
              <div className="text-lg sm:text-2xl font-black text-white">{stats.lectures_count}</div>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Full HD Video Portal</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center">
              <div className="text-xl sm:text-2xl mb-1 text-amber-400">🔒</div>
              <div className="text-lg sm:text-2xl font-black text-white">{stats.access_type}</div>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Dedicated Student LMS</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center">
              <div className="text-xl sm:text-2xl mb-1 text-[#00A0DF]">👥</div>
              <div className="text-lg sm:text-2xl font-black text-white">{stats.mentorship_type}</div>
              <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">Direct WhatsApp Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY DROPSHIPPING */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="inline-block bg-[#00A0DF]/10 text-[#00A0DF] font-black text-xs tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#00A0DF]/20 mb-3">
              THE BEST OPPORTUNITY IN 2026
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3 sm:mb-4">
              Why Dropshipping Is the <span className="text-[#00A0DF]">Smartest</span> Online Business Right Now
            </h2>
            <p className="text-slate-600 text-xs sm:text-base md:text-lg leading-relaxed">
              No big investment, no office, no inventory risk. Start with just <strong>PKR 15,000</strong> &mdash; from home, right on your phone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-[#00A0DF]/50 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center mb-4">
                <Globe2 size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Work From Anywhere</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Run your high-converting Shopify store from your home, a cafe, or even while traveling.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-[#00A0DF]/50 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center mb-4">
                <Building2 size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">No Company Registration</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                No complex paperwork, licenses, or legal setup required &mdash; just a smartphone/laptop and internet.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-[#00A0DF]/50 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Zero Inventory, Zero Risk</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You never buy stock upfront. Your supplier ships the item only after a customer places an order.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-[#00A0DF]/50 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center mb-4">
                <WalletCards size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">Get Paid in Your Local Bank</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Withdraw your cash on delivery (COD) profits directly to your Pakistani bank account effortlessly.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link href="/enrollment" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-sm sm:text-base font-extrabold text-white bg-[#00A0DF] hover:bg-[#008ec7] rounded-xl shadow-lg shadow-[#00A0DF]/30 transition-all">
              YES! I WANT TO LEARN THIS
            </Link>
            <p className="text-xs text-slate-500 font-medium mt-3">Join 9,700+ students already building profitable stores</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHAT YOU GET ACCESS TO */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="inline-block bg-[#00A0DF]/10 text-[#00A0DF] font-black text-xs tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#00A0DF]/20 mb-3">
              WHAT YOU GET
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3 sm:mb-4">
              Here&rsquo;s What You&rsquo;ll Get Access To
            </h2>
            <p className="text-slate-600 text-xs sm:text-base md:text-lg">
              No prior experience required &mdash; learn step by step how to build and scale your own online store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex gap-4 sm:gap-5 items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center flex-shrink-0 font-black text-base sm:text-xl">
                01
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Start &amp; Manage Your Own Store</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Build and scale your brand in UAE &amp; Saudi Arabia using our tested framework. Total beginner friendly.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex gap-4 sm:gap-5 items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 font-black text-base sm:text-xl">
                02
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Develop 8 High-Income Skills</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Design Shopify pages, find winning viral products, connect verified suppliers, and master TikTok &amp; Facebook ads.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex gap-4 sm:gap-5 items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0 font-black text-base sm:text-xl">
                03
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Lifetime WhatsApp Support</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Stuck with ad account restrictions or pixel setup? Ask questions directly on WhatsApp with lifetime assistance.
                </p>
              </div>
            </div>

            <div className="bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-sm flex gap-4 sm:gap-5 items-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center flex-shrink-0 font-black text-base sm:text-xl">
                04
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Private VIP Mastermind Community</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Network with active 6-figure dropshippers, share daily winning products, and solve problems together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. MENTOR SPOTLIGHT */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto bg-slate-900 border-2 border-[#00A0DF]/30 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Mentor Avatar */}
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-tr from-[#00A0DF] to-emerald-400 p-1 mb-4 shadow-xl shadow-[#00A0DF]/30">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl sm:text-4xl font-black text-[#00A0DF]">
                    SAMI
                  </div>
                </div>
                <span className="bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  {mentor.title}
                </span>
              </div>

              {/* Mentor Bio */}
              <div className="md:col-span-8">
                <span className="text-xs font-black uppercase tracking-widest text-[#00A0DF]">YOUR MENTOR</span>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mt-1 mb-3">{mentor.name}</h2>
                <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6">
                  {mentor.bio}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 mb-6">
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    <span>Lifetime WhatsApp Support (9AM–5PM)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    <span>Weekly Live Ad Audits with Sami</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    <span>UAE &amp; Saudi Verified Supplier Contacts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    <span>Private Mastermind Community</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-slate-800 text-center">
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-[#00A0DF]">{mentor.students_count}</div>
                    <div className="text-[10px] sm:text-xs text-slate-400">Students Mentored</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-emerald-400">{mentor.primary_markets}</div>
                    <div className="text-[10px] sm:text-xs text-slate-400">Primary Markets</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-amber-400">{mentor.access_badge}</div>
                    <div className="text-[10px] sm:text-xs text-slate-400">Access &amp; Updates</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PROOF WALL & STUDENT REVIEWS */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="inline-block bg-emerald-500/15 text-emerald-400 font-black text-xs tracking-wider uppercase px-4 py-1.5 rounded-full border border-emerald-500/30 mb-3">
              REAL STUDENT RESULTS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
              Hear What Our Students Are Saying
            </h2>
            <p className="text-slate-400 text-xs sm:text-base md:text-lg">
              Real screenshots and testimonials from students running live Shopify stores in UAE &amp; KSA.
            </p>
          </div>

          <ProofWall customTestimonials={content.testimonials} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WHO IS THIS COURSE FOR? */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="inline-block bg-[#00A0DF]/10 text-[#00A0DF] font-black text-xs tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#00A0DF]/20 mb-3">
              PERFECT FOR YOU IF...
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3 sm:mb-4">
              Who Is This Program For?
            </h2>
            <p className="text-slate-600 text-xs sm:text-base md:text-lg">
              No matter where you&rsquo;re starting from, this curriculum gives you a clear actionable roadmap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-lg mb-3">🌱</div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Complete Beginners</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Zero previous experience? We guide you step by step to build your live Shopify store and launch your first ad.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg mb-3">📣</div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Struggling with Facebook &amp; TikTok Ads</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Wasting budget on unoptimized ads? Learn the 3-second hook formula, CBO scaling, and pixel tracking that converts.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-lg mb-3">💼</div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Business Owners &amp; Shopkeepers</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Expand beyond physical retail into high-margin GCC dropshipping with local fast shipping suppliers.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-lg mb-3">🚀</div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Job Holders &amp; Side Hustlers</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Build a secondary income stream in Dirhams &amp; Riyals in your free evening hours right from your smartphone.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-lg mb-3">📈</div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Already Running a Store</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Scale your store from 10 orders to 100+ orders per day with WhatsApp automated order confirmations.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-lg mb-3">💡</div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">Freelancers</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Offer Shopify store setup, product research, and TikTok media buying services to international clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. 11 COMPLETE MODULES CURRICULUM */}
      {/* ========================================================================= */}
      <section id="curriculum" className="py-12 sm:py-16 md:py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="inline-block bg-[#00A0DF]/10 text-[#00A0DF] font-black text-xs tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#00A0DF]/20 mb-3">
              11 COMPLETE MODULES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3 sm:mb-4">
              Everything You Get Inside the Course
            </h2>
            <p className="text-slate-600 text-xs sm:text-base md:text-lg">
              Start from zero and build your own profitable UAE &amp; KSA Shopify store, step by step.
            </p>
          </div>

          <CurriculumAccordion />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FREE BONUSES STACK */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BonusStack customData={content.bonuses} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. 2 OPTIONS COMPARISON */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="inline-block bg-[#00A0DF]/10 text-[#00A0DF] font-black text-xs tracking-wider uppercase px-4 py-1.5 rounded-full border border-[#00A0DF]/20 mb-3">
              YOUR CHOICE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Now You Have 2 Options Left
            </h2>
            <p className="text-slate-600 text-xs sm:text-base md:text-lg">
              One keeps you stuck in confusion. The other moves you forward with a proven blueprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Option 1: DIY */}
            <div className="bg-slate-900 border border-red-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <span className="inline-block bg-red-500/20 text-red-400 font-black text-xs uppercase px-3 py-1 rounded-full mb-4 border border-red-500/30">
                  OPTION 01
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mb-1.5">Do It Yourself</h3>
                <p className="text-xs sm:text-sm text-slate-400 mb-6">The slow, expensive, and frustrating road</p>
                
                <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Keep guessing which products work and which burn ad spend</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Face repeated Facebook ad account restrictions without guidance</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Waste months and 50,000+ PKR on trial-and-error tests</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Lose motivation and quit before seeing your first real order</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: Ecom With Sami */}
            <div className="relative bg-slate-900 border-2 border-[#00A0DF] rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-[#00A0DF]/20">
              <span className="absolute -top-3.5 right-6 bg-emerald-500 text-white font-black text-[11px] sm:text-xs uppercase px-3 py-1 rounded-full shadow-lg">
                RECOMMENDED
              </span>
              <div>
                <span className="inline-block bg-[#00A0DF]/20 text-[#00A0DF] font-black text-xs uppercase px-3 py-1 rounded-full mb-4 border border-[#00A0DF]/40">
                  OPTION 02
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mb-1.5">Join Ecom With Sami Program</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6">The proven, guided, step-by-step shortcut</p>
                
                <div className="flex flex-col gap-3 text-xs sm:text-sm text-slate-200 mb-8">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Follow a tested 11-module framework from product hunting to scaling</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Get direct verified UAE &amp; Saudi supplier phone numbers and rates</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Lifetime WhatsApp mentorship from 9AM to 5PM daily</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Get 6 free power bonus tools worth Rs 30,000+ included</span>
                  </div>
                </div>
              </div>

              <Link href="/enrollment" className="w-full text-center py-3.5 px-6 rounded-xl text-sm sm:text-base font-black text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-lg shadow-[#00A0DF]/30 transition-all">
                YES! I WANT TO LEARN THIS
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. COST OF WAITING */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="inline-block bg-amber-500/15 text-amber-400 font-black text-xs tracking-wider uppercase px-4 py-1.5 rounded-full border border-amber-500/30 mb-3">
              ⏳ BEFORE YOU CLOSE THIS PAGE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-3">
              What Does Waiting <span className="text-[#00A0DF]">Really Cost</span> You?
            </h2>
            <p className="text-slate-400 text-xs sm:text-base md:text-lg">
              The cost isn&rsquo;t just PKR 3,900. It&rsquo;s everything that stays exactly the same if nothing changes today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-10 sm:mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
              <span className="text-[11px] sm:text-xs font-bold text-[#00A0DF] uppercase tracking-wider block mb-2">3 MONTHS FROM NOW</span>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">Still Stuck at &ldquo;Someday&rdquo;</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Still watching free YouTube videos with missing steps, still confused about pixels, same questions, zero progress.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">1 YEAR FROM NOW</span>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">Watching Others Move Ahead</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                People who enrolled today will already have a live profitable store. You will look back wishing you had started now.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
              <span className="text-[11px] sm:text-xs font-bold text-red-400 uppercase tracking-wider block mb-2">EXPENSIVE GUESSING</span>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">Money Lost to Trial &amp; Error</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Most beginners burn 40,000+ PKR testing blindly on TikTok/Facebook ads. A proven blueprint saves you that wasted money.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
              <span className="text-[11px] sm:text-xs font-bold text-amber-400 uppercase tracking-wider block mb-2">RISING COMPETITION</span>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">Late Entry = Harder Game</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                GCC e-commerce is booming right now. The longer you delay, the more crowded it becomes for new entrants.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
              <span className="text-[11px] sm:text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">WASTED MONTHS</span>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">The Slow, Lonely Route</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Figuring everything out alone takes 6 to 12 months. With mentor Sami&rsquo;s roadmap, you launch in days.
              </p>
            </div>

            <div className="bg-[#00A0DF]/10 border border-[#00A0DF]/40 rounded-2xl p-5 sm:p-6">
              <span className="text-[11px] sm:text-xs font-bold text-[#00A0DF] uppercase tracking-wider block mb-2">THE REAL MATH</span>
              <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">Course Fee vs. Delay Cost</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                PKR 3,900 is less than what most waste on a single failed ad test. Invest in your business skills today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. FAQ SECTION */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2 sm:mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 text-xs sm:text-base">
              Everything you need to know before joining the program.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            {faqs.map((f, idx) => (
              <details
                key={idx}
                className="group border border-slate-200 rounded-2xl bg-slate-50/70 overflow-hidden transition-all duration-200 open:bg-white open:border-[#00A0DF] open:shadow-md"
              >
                <summary className="flex items-center justify-between p-4 sm:p-5 font-bold text-xs sm:text-sm md:text-base text-slate-900 cursor-pointer list-none select-none">
                  <span>{f.q}</span>
                  <span className="text-[#00A0DF] text-lg sm:text-xl font-bold group-open:rotate-180 transition-transform flex-shrink-0 ml-2">
                    ▾
                  </span>
                </summary>
                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {f.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13. FINAL CALL TO ACTION CARD */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-2 border-[#00A0DF]/40 rounded-3xl p-6 sm:p-10 md:p-14 text-center shadow-2xl relative overflow-hidden">
            <span className="inline-block bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-3 sm:mb-4">
              JOIN 9,700+ STUDENTS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight mb-3 sm:mb-4">
              Take the First Step Toward a <span className="text-[#00A0DF]">Profitable Store</span>
            </h2>
            <p className="text-slate-300 text-xs sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              Thousands of beginners across UAE &amp; Saudi Arabia markets have already started. Today it&rsquo;s your turn.
            </p>

            <Link
              href="/enrollment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 text-base sm:text-lg font-black uppercase rounded-xl sm:rounded-2xl text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-xl shadow-[#00A0DF]/40 transition-all duration-200"
            >
              <span>{hero.cta_text || 'YES! I WANT TO LEARN THIS'} &bull; {hero.current_price || 'PKR 3,900'}</span>
              <ArrowRight size={20} />
            </Link>

            <p className="text-[11px] sm:text-xs text-slate-400 mt-4">
              14-Day Money-Back Guarantee &bull; Instant LMS Activation &bull; Lifetime Mentorship Support
            </p>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
