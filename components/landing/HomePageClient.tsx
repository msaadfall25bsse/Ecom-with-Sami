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
import { Module } from '@/utils/db';

import { supabase } from '@/lib/supabase';

interface HomePageClientProps {
  initialContent: CmsContentSchema;
  initialModules: Module[];
}

export function HomePageClient({ initialContent, initialModules }: HomePageClientProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [content, setContent] = useState<CmsContentSchema>(initialContent || defaultCmsContent);

  useEffect(() => {
    const syncData = async () => {
      try {
        localStorage.removeItem('sami_cms_content');
      } catch (e) {}

      // 1. Try local API route first
      try {
        const timestamp = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const res = await fetch(`/api/public/cms-content?_nocache=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.sections) {
            setContent(data.sections);
            return;
          }
        }
      } catch (e) {}

      // 2. Direct Supabase Cloud Fetch (Guaranteed fallback for static web hosts like Hostinger)
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('cms_settings')
            .select('value_json')
            .eq('key', 'main_cms')
            .maybeSingle();

          if (!error && data && data.value_json) {
            const parsed = typeof data.value_json === 'string' ? JSON.parse(data.value_json) : data.value_json;
            if (parsed && typeof parsed === 'object') {
              setContent({ ...defaultCmsContent, ...parsed });
            }
          }
        } catch (e) {}
      }
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Play Button Icon */}
                <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#00A0DF] text-white flex items-center justify-center shadow-lg shadow-[#00A0DF]/50 group-hover:scale-110 transition-transform duration-300">
                    <Play className="fill-current ml-1" size={24} />
                  </div>
                  <span className="text-white font-bold text-xs sm:text-sm tracking-wide bg-black/60 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 backdrop-blur-sm">
                    {hero.video_title || 'Click to Watch Free Overview'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Tag & Urgency Callout */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-sm sm:text-base text-slate-400 line-through font-semibold">
                  {hero.original_price || 'PKR 32,500'}
                </span>
                <span className="text-2xl sm:text-4xl font-black text-emerald-600 tracking-tight">
                  {hero.current_price || 'PKR 3,900'}
                </span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-black uppercase px-3 py-1 rounded-full border border-emerald-300">
                ⚡ 88% OFF TODAY
              </span>
            </div>

            {/* Hero CTA Button */}
            <Link
              href="/enrollment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl text-base sm:text-xl font-black text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-xl shadow-[#00A0DF]/30 hover:shadow-2xl hover:shadow-[#00A0DF]/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>{hero.cta_text || 'Start Your UAE & KSA Store Now'}</span>
              <ArrowRight size={22} className="animate-pulse" />
            </Link>

            {/* Seats Left Notification */}
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-3 sm:mt-4 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
              Only <strong className="text-slate-800 font-bold">{hero.seats_left || 12} Seats Left</strong> for this batch at this discounted price
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS & CREDIBILITY BAR */}
      {/* ========================================================================= */}
      <section className="py-6 sm:py-8 bg-slate-900 text-white border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            
            <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-xl sm:text-3xl font-black text-[#00A0DF] mb-0.5">
                {stats.training_hours || '15+ Hours'}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Recorded Video Masterclass</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-xl sm:text-3xl font-black text-emerald-400 mb-0.5">
                {stats.lectures_count || '36 Lectures'}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">11 Deep-Dive Modules</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-xl sm:text-3xl font-black text-amber-400 mb-0.5">
                {stats.access_type || 'Lifetime Access'}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">All Future Updates Free</p>
            </div>

            <div className="p-3 sm:p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <div className="text-xl sm:text-3xl font-black text-purple-400 mb-0.5">
                {stats.mentorship_type || 'Direct WhatsApp Support'}
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 font-medium">1-on-1 Help from Mentor Sami</p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY UAE & KSA DROPSHIPPING IN 2026? */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#00A0DF] bg-[#00A0DF]/10 px-3.5 py-1.5 rounded-full">
              {content.why_dropshipping?.badge || 'THE GCC OPPORTUNITY'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-3 sm:mt-4 mb-3 sm:mb-4">
              {content.why_dropshipping?.title || 'Why UAE & Saudi Arabia Dropshipping is 10x Better Than Local Pakistan Ecom'}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium max-w-2xl mx-auto">
              {content.why_dropshipping?.subtitle || 'Stop struggling with high return ratios and low profit margins in saturated markets. Earn in Dirhams (AED) and Saudi Riyals (SAR) sitting in Pakistan.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-[#00A0DF] hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-[#00A0DF]/15 text-[#00A0DF] flex items-center justify-center mb-4">
                <Globe2 size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                High Purchasing Power
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Customers in Dubai and Riyadh spend freely online. Average profit margin per order is PKR 3,000 to PKR 7,000.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-emerald-500 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center mb-4">
                <Building2 size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                Verified Local Suppliers
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Get direct access to warehouses located inside Dubai and Sharjah with ready cash-on-delivery inventory.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-purple-500 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-purple-500/15 text-purple-600 flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                Low TikTok Ad Costs
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                TikTok Ads in GCC generate ultra-cheap clicks and massive ROAS (Return On Ad Spend) compared to US/UK.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 hover:border-amber-500 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center mb-4">
                <WalletCards size={24} />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                Zero Inventory Risk
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You don&apos;t buy stock in advance. When a customer orders on your website, your courier ships it and collects cash.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. MEET YOUR MENTOR: SAMI */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Avatar & Quick Badges */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-[#00A0DF] to-emerald-400 p-1.5 mb-6 shadow-2xl shadow-[#00A0DF]/30">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-5xl sm:text-7xl font-black text-[#00A0DF]">
                  SAMI
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">{mentor.name || 'Muhammad Sami'}</h3>
              <p className="text-xs sm:text-sm text-[#00A0DF] font-bold uppercase tracking-wider mt-1">
                {mentor.title || 'Lead eCommerce Mentor & GCC Scaling Specialist'}
              </p>
            </div>

            {/* Right Column: Bio & Track Record */}
            <div className="lg:col-span-7">
              <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#00A0DF] bg-[#00A0DF]/10 px-3.5 py-1.5 rounded-full border border-[#00A0DF]/30">
                MEET YOUR INSTRUCTOR
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mt-4 mb-4">
                &ldquo;I Tested 100+ Products So You Don&apos;t Waste Your Hard-Earned Money.&rdquo;
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed mb-6">
                {mentor.bio || 'Over the last 4 years, I built multi-million rupee dropshipping stores in the United Arab Emirates and Saudi Arabia. In this training, I reveal the exact step-by-step framework, secret supplier contacts, and high-ROI TikTok ad creatives that generated real success.'}
              </p>

              {/* Stats Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
                <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-800">
                  <div className="text-lg sm:text-2xl font-black text-emerald-400">{mentor.students_count || '9,700+'}</div>
                  <div className="text-[11px] sm:text-xs text-slate-400">Students Trained</div>
                </div>
                <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-800">
                  <div className="text-lg sm:text-2xl font-black text-[#00A0DF]">7-Figure</div>
                  <div className="text-[11px] sm:text-xs text-slate-400">Store Revenues</div>
                </div>
                <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
                  <div className="text-lg sm:text-2xl font-black text-amber-400">100% Practical</div>
                  <div className="text-[11px] sm:text-xs text-slate-400">Screen Walkthrough</div>
                </div>
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#00A0DF] hover:underline"
              >
                <span>Read Sami&apos;s Full Journey &amp; Case Studies</span>
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. COMPLETE COURSE CURRICULUM (11 MODULES) */}
      {/* ========================================================================= */}
      <section id="curriculum" className="py-12 sm:py-16 md:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#00A0DF] bg-[#00A0DF]/10 px-3.5 py-1.5 rounded-full">
              STEP-BY-STEP BLUEPRINT
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-3 sm:mt-4 mb-3">
              What You Will Learn in 11 Video Modules
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
              From absolute zero — setting up your Shopify store, finding winning products, contacting UAE suppliers, to scaling profitable TikTok and Facebook campaigns.
            </p>
          </div>

          {/* Curriculum Accordion Component */}
          <CurriculumAccordion modules={initialModules} />

          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/enrollment"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-black text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-lg shadow-[#00A0DF]/20 hover:-translate-y-0.5 transition-all"
            >
              <span>Enroll Now &amp; Unlock All 11 Modules</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. PROOF WALL & REAL STUDENT REVIEWS */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200">
              REAL RESULTS &amp; REVIEWS
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-3 sm:mt-4 mb-3">
              Hear From Students Making Daily Sales in UAE &amp; Saudi Arabia
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600">
              Genuine feedback and profit milestones from Pakistanis operating their GCC stores from home.
            </p>
          </div>

          {/* Proof Wall Component */}
          <ProofWall customTestimonials={content.testimonials} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. 6 POWER BONUSES STACK */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#00A0DF] bg-[#00A0DF]/10 px-3.5 py-1.5 rounded-full border border-[#00A0DF]/30">
              {content.bonuses?.tag || 'FREE WITH ENROLLMENT'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight mt-3 sm:mt-4 mb-3">
              {content.bonuses?.title || 'Get 6 Power Bonuses Worth Over'}{' '}
              <span className="text-emerald-400">{content.bonuses?.highlight_value || 'Rs 30,000 Free'}</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-400">
              {content.bonuses?.subtitle || 'Everything you need to launch immediately without spending extra money on themes, tools, or contacts.'}
            </p>
          </div>

          {/* Bonus Stack Component */}
          <BonusStack customData={content.bonuses} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. OPTIONS COMPARISON */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              You Have Two Clear Choices Today
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600">
              Which path will you take for your financial freedom in 2026?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Option A: Hard Way */}
            <div className="bg-white border-2 border-red-200 rounded-3xl p-6 sm:p-8 shadow-sm">
              <span className="text-xs font-black uppercase text-red-600 bg-red-50 px-3 py-1 rounded-full mb-4 inline-block">
                OPTION 1 &bull; THE HARD WAY
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-4">
                Trial &amp; Error On Your Own
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 mb-6">
                <li className="flex items-start gap-2.5">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                  <span>Waste Rs 50,000+ testing untested products that never sell</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                  <span>Get scammed by fake wholesale suppliers on Facebook</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                  <span>Face sudden TikTok and Facebook ad account bans</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                  <span>Months of frustration with zero profit to show</span>
                </li>
              </ul>
            </div>

            {/* Option B: Smart Way */}
            <div className="bg-slate-900 border-2 border-[#00A0DF] rounded-3xl p-6 sm:p-8 shadow-xl text-white relative">
              <span className="text-xs font-black uppercase text-[#00A0DF] bg-[#00A0DF]/20 px-3 py-1 rounded-full mb-4 inline-block border border-[#00A0DF]/40">
                OPTION 2 &bull; THE PROVEN BLUEPRINT
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                Follow Sami&apos;s Step-by-Step Mentorship
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300 mb-6">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                  <span>Direct WhatsApp phone numbers to verified Dubai suppliers</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                  <span>High-converting premium theme &amp; ad copy templates included</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                  <span>1-on-1 mentorship whenever you need guidance</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-0.5" size={18} />
                  <span>Start with minimal budget and scale profitably</span>
                </li>
              </ul>
              
              <Link
                href="/enrollment"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-white font-black text-sm transition-colors"
              >
                <span>Choose Option 2 for PKR 3,900</span>
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FREQUENTLY ASKED QUESTIONS (FAQS) */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#00A0DF] bg-[#00A0DF]/10 px-3.5 py-1.5 rounded-full">
              GOT QUESTIONS?
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-3 sm:mt-4 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600">
              Clear answers to the most common questions from beginners.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-6 transition-all duration-200 open:bg-white open:border-[#00A0DF] open:shadow-md"
              >
                <summary className="font-bold text-sm sm:text-base text-slate-900 cursor-pointer list-none flex justify-between items-center select-none">
                  <span>{faq.q}</span>
                  <span className="text-[#00A0DF] font-black text-xl transition-transform group-open:rotate-45 ml-2">
                    +
                  </span>
                </summary>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FINAL BOTTOM CTA BANNER */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 md:py-24 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950 text-white text-center relative overflow-hidden border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <span className="inline-block bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            LIMITED TIME RAMADAN ENROLLMENT
          </span>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 sm:mb-6">
            Ready to Launch Your UAE &amp; KSA Store Today?
          </h2>

          <p className="text-xs sm:text-sm md:text-lg text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Join 9,700+ students. Get instant access to 11 video modules, 6 power bonuses, verified GCC suppliers directory &amp; direct WhatsApp mentorship.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base text-slate-500 line-through">
                {hero.original_price || 'PKR 32,500'}
              </span>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400">
                {hero.current_price || 'PKR 3,900'}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400">
              (One-time payment &bull; Lifetime access)
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/enrollment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl text-base sm:text-xl font-black text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-2xl shadow-[#00A0DF]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <span>{hero.cta_text || 'Start Your UAE & KSA Store Now'}</span>
              <ArrowRight size={22} />
            </Link>
          </div>

          <div className="mt-8 max-w-xl mx-auto">
            <CountdownTimer />
          </div>

        </div>
      </section>

      {/* Main Footer */}
      <Footer />
    </div>
  );
}
