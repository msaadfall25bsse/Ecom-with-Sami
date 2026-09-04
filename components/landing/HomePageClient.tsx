'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  XCircle,
  Sparkles,
  ShieldCheck,
  Star,
  Zap,
  Clock,
  Video,
  Lock,
  Users,
  ChevronRight,
  ChevronLeft,
  Gift,
  HelpCircle,
  Check,
  Award,
  DollarSign,
  MoveHorizontal,
  LayoutGrid
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
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [activeVideoTitle, setActiveVideoTitle] = useState('');
  const [content, setContent] = useState<CmsContentSchema>(initialContent || defaultCmsContent);
  const [videoReviewMode, setVideoReviewMode] = useState<'moving' | 'grid'>('moving');

  useEffect(() => {
    const syncData = async () => {
      try {
        localStorage.removeItem('sami_cms_content');
      } catch (e) {}

      // 1. Local API Route
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

      // 2. Direct Supabase Cloud Fetch fallback
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

  const openMainVideo = () => {
    setActiveVideoTitle(hero.video_title || '128-Second Dropshipping Blueprint Overview');
    setActiveVideoUrl(hero.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ');
    setIsVideoOpen(true);
  };

  const openReviewVideo = (title: string, url: string) => {
    setActiveVideoTitle(title);
    setActiveVideoUrl(url);
    setIsVideoOpen(true);
  };

  const videoReviews = [
    {
      stars: 5,
      headline: '“Total beginners are now getting AED 1,000–1,500 in daily sales.”',
      author: 'Ali Raza — Lahore',
      result: 'AED 1,500 / Day',
      market: 'UAE Market',
      videoUrl: hero.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      stars: 5,
      headline: '“After getting mentorship and watching the course, I made €662 in sales within 6 days.”',
      author: 'Raza Ali — Karachi',
      result: '€662 in 6 Days',
      market: 'GCC & Global',
      videoUrl: hero.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      stars: 5,
      headline: '“AED 5,000 in sales and 56 orders within 5 days with supplier help.”',
      author: 'Hamza Tariq — Islamabad',
      result: 'AED 5,000 / Week',
      market: 'UAE Dropship',
      videoUrl: hero.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      stars: 5,
      headline: '“Students say the course is very easy to understand and follow on mobile.”',
      author: 'Zainab Bibi — Faisalabad',
      result: 'PKR 480,000 / Mo',
      market: 'Saudi & UAE',
      videoUrl: hero.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      stars: 5,
      headline: '“26 orders and AED 2,500 in sales with the direct help of Mentor Sami.”',
      author: 'Usman Ghani — Rawalpindi',
      result: 'AED 2,500 Sales',
      market: 'UAE Market',
      videoUrl: hero.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      stars: 5,
      headline: '“AED 1,485 in sales in just 3 days while working from home.”',
      author: 'Bilal Farooq — Multan',
      result: 'SAR 3,485 Profit',
      market: 'Saudi Market',
      videoUrl: hero.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      stars: 5,
      headline: '“I tried many courses before, but Sami’s practical GCC supplier list made all the difference.”',
      author: 'Farhan Sheikh — Peshawar',
      result: 'SAR 6,100 / 10 Days',
      market: 'KSA Market',
      videoUrl: hero.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  const studentEarningsScreenshots = [
    { name: 'Store #1 Dubai', profit: 'AED 14,850', orders: '124 Orders', label: 'UAE Shopify Store' },
    { name: 'Store #2 Riyadh', profit: 'SAR 22,400', orders: '186 Orders', label: 'KSA COD Store' },
    { name: 'Store #3 Sharjah', profit: 'AED 8,620', orders: '72 Orders', label: 'TikTok Ads Campaign' },
    { name: 'Store #4 Jeddah', profit: 'SAR 31,900', orders: '240 Orders', label: 'Winning Beauty Product' },
    { name: 'Store #5 Abu Dhabi', profit: 'AED 19,500', orders: '158 Orders', label: 'Meta Advantage+ Scaling' },
    { name: 'Store #6 Dammam', profit: 'SAR 17,200', orders: '135 Orders', label: 'Direct Supplier Delivery' }
  ];

  return (
    <div className="relative min-h-screen bg-[#FAFCFF] text-slate-900 selection:bg-[#00A0DF] selection:text-white font-sans antialiased">
      {/* Top Marquee Bar */}
      <TopMarquee />

      {/* Main Sticky Navbar */}
      <Navbar />

      {/* Interactive Video Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        title={activeVideoTitle || hero.video_title || 'Dropshipping Overview'}
        videoUrl={activeVideoUrl || hero.video_url || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (LEARNWITHAFAQ STYLE) */}
      {/* ========================================================================= */}
      <section className="relative pt-6 pb-12 sm:pt-14 sm:pb-20 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-[#f0f9ff]/40 via-white to-white">
        {/* Soft Background Blur Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-80px] left-[15%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-[#00A0DF]/12 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-[40px] right-[10%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-emerald-400/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2.5s' }} />
        </div>

        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* Top Pill Badge */}
            <div className="dropshipping-badge mb-4 sm:mb-5 cursor-pointer animate-float">
              <span className="badge-dot" />
              <span className="badge-blue">PAKISTAN’S #1</span>
              <span className="badge-dark">{hero.badge || "UAE/KSA DROPSHIPPING TRAINING"}</span>
            </div>

            {/* Main Bold Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.18] sm:leading-[1.15] mb-3.5 sm:mb-4 px-1">
              {hero.title_line1 || 'Learn How to Start Online Dropshipping Store in UAE & KSA'}{' '}
              <span className="text-[#00A0DF] drop-shadow-xs">
                {hero.title_highlight || 'Step-by-Step Training'}
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xs xs:text-sm sm:text-lg md:text-xl text-slate-600 font-semibold max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
              {hero.subtitle || 'Beginner Friendly Training from Basics — Zero Experience Required'}
            </p>

            {/* Video Preview Card Container */}
            <div className="w-full max-w-3xl relative">
              {/* Mini Pill Tag over Video */}
              <div className="inline-flex items-center gap-1.5 bg-[#00A0DF] text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider mb-2.5 sm:mb-3 shadow-md">
                <Sparkles size={12} className="text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Ecommstory Masterclass</span>
              </div>

              <h2 className="text-xs sm:text-base font-bold text-slate-700 mb-2.5 sm:mb-3">
                Watch this 128 seconds of video to learn how easy it is
              </h2>

              {/* Video Player Card with Glowing Radar Pulse */}
              <div 
                onClick={openMainVideo}
                className="relative cursor-pointer rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#00A0DF]/40 bg-slate-950 aspect-video flex items-center justify-center group transition-all duration-300 hover:border-[#00A0DF] hover:scale-[1.01]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Radiant Play Button */}
                <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3 p-2 text-center">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#00A0DF] text-white flex items-center justify-center shadow-2xl shadow-[#00A0DF]/70 group-hover:scale-115 transition-transform duration-300 animate-radar">
                    <Play className="fill-current ml-1" size={22} />
                  </div>
                  <span className="text-white font-extrabold text-[10px] xs:text-xs sm:text-sm tracking-wide bg-black/75 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-white/20 backdrop-blur-md max-w-[90%] truncate">
                    {hero.video_title || 'Click to Watch Free Blueprint Overview'}
                  </span>
                </div>
              </div>

              {/* Strikethrough Pricing Box */}
              <div className="mt-5 sm:mt-6 bg-white border border-gray-200 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 shadow-sm inline-block card-hover-lift max-w-full">
                <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-800 leading-snug">
                  Originally{' '}
                  <span className="line-through font-extrabold text-red-500">
                    {hero.original_price || '32,500 PKR'}
                  </span>{' '}
                  — Get Instant Access Today for Just{' '}
                  <span className="font-extrabold text-[#00A0DF] block xs:inline">
                    {hero.current_price || '3,900 PKR'}
                  </span>
                </p>
              </div>

              {/* Quick CTA & Social Proof (Placed Under Demo Video) */}
              <div className="flex flex-col items-center gap-3 mt-5 sm:mt-6 w-full xs:w-auto px-2">
                <Link
                  href="/enrollment"
                  className="lwa-btn w-full xs:w-auto px-8 sm:px-10 py-3.5 sm:py-4 text-xs xs:text-sm sm:text-base font-black rounded-xl hover:bg-[#008ac2] transition-all shadow-xl"
                >
                  {hero.cta_text || 'YES! I WANT TO LEARN THIS'}
                </Link>
                <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-slate-500">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400 text-amber-400 animate-star-twinkle" />
                    ))}
                  </div>
                  <span>Trusted by 350+ Students</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS LITE BAR (LEARNWITHAFAQ STYLE) */}
      {/* ========================================================================= */}
      <section className="py-6 sm:py-8 bg-[#0B0F19] text-white border-y border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center hover:border-[#00A0DF]/60 transition-colors card-hover-lift">
              <div className="text-xl sm:text-2xl mb-1">⏱</div>
              <div className="text-lg sm:text-xl font-black text-white">{stats.training_hours || '8 Hours'}</div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-semibold">Of training</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center hover:border-emerald-500/60 transition-colors card-hover-lift">
              <div className="text-xl sm:text-2xl mb-1">▶</div>
              <div className="text-lg sm:text-xl font-black text-white">{stats.lectures_count || '36 Lectures'}</div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-semibold">HD video</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center hover:border-amber-500/60 transition-colors card-hover-lift">
              <div className="text-xl sm:text-2xl mb-1">🔒</div>
              <div className="text-lg sm:text-xl font-black text-white">{stats.access_type || 'Lifetime Access'}</div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-semibold">LMS portal</div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl text-center hover:border-purple-500/60 transition-colors card-hover-lift">
              <div className="text-xl sm:text-2xl mb-1">👥</div>
              <div className="text-lg sm:text-xl font-black text-white">{stats.mentorship_type || 'Mentorship'}</div>
              <div className="text-[11px] sm:text-xs text-slate-400 font-semibold">Included</div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY DROPSHIPPING IS THE SMARTEST BUSINESS (LEARNWITHAFAQ STYLE) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="section-tag-pill">THE BEST OPPORTUNITY IN 2026</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Why Dropshipping Is the <span className="text-[#00A0DF]">Smartest</span> Online Business Right Now
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              No big investment, no office, no risk. Start with just <strong>PKR 15,000</strong> — from home, right on your phone.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
            
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 card-hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00A0DF] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Globe2 size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1.5">
                    Work From Anywhere
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Run your store from your bedroom, a cafe, or even another country with just internet and mobile.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 card-hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00A0DF] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <Building2 size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1.5">
                    No Company or Registration
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    No paperwork, trade licenses, or legal setup needed — just a laptop and internet to start selling.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 card-hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00A0DF] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1.5">
                    Zero Inventory, Zero Risk
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    You never buy stock upfront. Your supplier ships only after a customer places an order on your store.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 card-hover-lift">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#00A0DF] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                  <WalletCards size={22} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1.5">
                    Get Paid in Your Local Bank
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    Withdraw your Dirhams and Riyals earnings straight to your Pakistani bank account — simple and direct.
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="text-center">
            <Link
              href="/enrollment"
              className="lwa-btn px-10 py-4 text-sm sm:text-base font-black rounded-xl"
            >
              YES! I WANT TO LEARN THIS
            </Link>
            <p className="text-xs text-slate-500 font-semibold mt-3">
              Join 9,700+ students already building their stores
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. HERE'S WHAT YOU'LL GET ACCESS TO (LEARNWITHAFAQ STYLE) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="section-tag-pill">WHAT YOU GET</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Here’s What You’ll Get Access To
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              No prior experience required — learn step by step how to build and manage your own online store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
            
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm card-hover-lift">
              <div className="w-10 h-10 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center mb-4">
                <Globe2 size={20} />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2">
                Start &amp; Manage Your Own Store
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Using the Ecommestry Program framework, build and grow your own dropshipping business. Student, job holder, or beginner — all you need is a mobile or laptop.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm card-hover-lift">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4">
                <Sparkles size={20} />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2">
                Develop 8 Practical Skills
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Design stunning Shopify stores, find winning products, and source top UAE &amp; KSA suppliers. Master Facebook and TikTok ads — from pixel to scaling.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm card-hover-lift">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-4">
                <Zap size={20} />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2">
                Lifetime WhatsApp Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Stuck during the course? Ask your questions directly on WhatsApp from 9AM to 5PM. We make sure your learning journey stays smooth with lifetime support.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm card-hover-lift">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-4">
                <Users size={20} />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2">
                Private Community Access
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Get into private Facebook and WhatsApp communities. Network with like-minded people, share wins, and solve problems by learning from active dropshippers.
              </p>
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
      </section>

      {/* ========================================================================= */}
      {/* 5. MEET YOUR MENTOR (LEARNWITHAFAQ STYLE CARD) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#0B0F19] text-white relative overflow-hidden">
        {/* Glow ambient spots */}
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-[#00A0DF]/15 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Top Cyan Neon Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#00A0DF] via-emerald-400 to-[#00A0DF]" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Mentor Avatar */}
              <div className="lg:col-span-5 flex flex-col items-center text-center">
                <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-tr from-[#00A0DF] to-emerald-400 p-1.5 shadow-2xl mb-4 animate-float overflow-hidden">
                  <Image
                    src="/images/sami-logo.jpg"
                    alt={mentor.name || 'Mentor Muhammad Sami'}
                    width={224}
                    height={224}
                    className="w-full h-full rounded-2xl object-cover"
                    priority
                  />
                </div>
                <span className="inline-flex items-center gap-1.5 bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/30 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                  <Star size={12} className="fill-[#00A0DF]" />
                  Digital Marketing Expert
                </span>
              </div>

              {/* Mentor Details */}
              <div className="lg:col-span-7">
                <span className="section-tag-pill">YOUR MENTOR</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mt-2 mb-3">
                  {mentor.name || 'Muhammad Sami'}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium leading-relaxed mb-6">
                  You don’t just need the right mentor — you need the right community too. <strong>Both are included in your purchase today.</strong>
                </p>

                {/* Benefits List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Check size={13} className="stroke-[3]" />
                    </span>
                    <span>Lifetime WhatsApp support</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Check size={13} className="stroke-[3]" />
                    </span>
                    <span>Private Facebook community</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Check size={13} className="stroke-[3]" />
                    </span>
                    <span>Private WhatsApp community</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-semibold">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                      <Check size={13} className="stroke-[3]" />
                    </span>
                    <span>Smooth, guided journey</span>
                  </div>
                </div>

                {/* Stat Counters */}
                <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-800 text-center">
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-[#00A0DF]">{mentor.students_count || '9,700+'}</div>
                    <div className="text-[11px] text-slate-400 font-semibold">Students mentored</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-emerald-400">UAE &amp; KSA</div>
                    <div className="text-[11px] text-slate-400 font-semibold">Market focus</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-amber-400">Lifetime</div>
                    <div className="text-[11px] text-slate-400 font-semibold">Access &amp; support</div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. REAL STUDENT VIDEO REVIEWS WITH CONTINUOUS MOVING STREAM */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-20 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10">
            <span className="section-tag-pill">REAL STUDENT RESULTS</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 sm:mb-3">
              Hear What Our Students Are Saying
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium px-2">
              Real student video reviews sharing their experience, support, and results after joining Ecom With Sami.
            </p>
          </div>

          {/* Interactive Mode Switcher & Status Indicator */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-5xl mx-auto mb-5 px-2">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-bold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00A0DF] animate-ping flex-shrink-0" />
              <span>Auto-moving video reviews &bull; Hover or tap to pause &amp; watch</span>
            </div>

            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-bold shadow-inner">
              <button
                onClick={() => setVideoReviewMode('moving')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs ${
                  videoReviewMode === 'moving'
                    ? 'bg-white text-[#00A0DF] shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MoveHorizontal size={14} />
                <span>Moving Stream</span>
              </button>
              <button
                onClick={() => setVideoReviewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all text-xs ${
                  videoReviewMode === 'grid'
                    ? 'bg-white text-[#00A0DF] shadow-sm font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutGrid size={14} />
                <span>Grid View</span>
              </button>
            </div>
          </div>

          {/* 1. CONTINUOUS MOVING STREAM (HARDWARE ACCELERATED MARQUEE) */}
          {videoReviewMode === 'moving' ? (
            <div className="space-y-4 overflow-hidden py-2 marquee-fade-mask relative touch-pan-x">
              <div className="animate-marquee-slow flex items-stretch gap-3.5 sm:gap-5">
                {[...videoReviews, ...videoReviews, ...videoReviews, ...videoReviews].map((rev, idx) => (
                  <div
                    key={idx}
                    onClick={() => openReviewVideo(rev.headline, rev.videoUrl)}
                    className="w-[265px] xs:w-[295px] sm:w-[340px] bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-2xl hover:border-[#00A0DF] transition-all flex flex-col justify-between flex-shrink-0 cursor-pointer card-hover-lift group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-0.5 sm:gap-1 text-amber-400">
                          {[...Array(rev.stars)].map((_, i) => (
                            <Star key={i} size={13} className="fill-amber-400 text-amber-400 animate-star-twinkle" />
                          ))}
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {rev.result}
                        </span>
                      </div>

                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 mb-3 min-h-[44px] leading-snug group-hover:text-[#00A0DF] transition-colors">
                        {rev.headline}
                      </h3>
                    </div>

                    <div>
                      <div className="relative cursor-pointer rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center group-hover:border-[#00A0DF] mb-2.5 shadow-inner">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#00A0DF] text-white flex items-center justify-center group-hover:scale-115 transition-transform shadow-lg shadow-[#00A0DF]/50">
                          <Play size={18} className="fill-current ml-0.5" />
                        </div>
                        <span className="absolute bottom-2 left-2 text-[9px] sm:text-[10px] font-bold text-white bg-black/75 px-2 py-0.5 rounded backdrop-blur-sm">
                          ▶ Watch Video
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-semibold">
                        <span>{rev.author}</span>
                        <span className="text-[#00A0DF] font-bold">{rev.market}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* 2. GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-6xl mx-auto px-2">
              {videoReviews.map((rev, idx) => (
                <div
                  key={idx}
                  onClick={() => openReviewVideo(rev.headline, rev.videoUrl)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-[#00A0DF] transition-all flex flex-col justify-between cursor-pointer card-hover-lift group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-0.5 sm:gap-1 text-amber-400">
                        {[...Array(rev.stars)].map((_, i) => (
                          <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[9px] sm:text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {rev.result}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 min-h-[44px] leading-snug group-hover:text-[#00A0DF] transition-colors">
                      {rev.headline}
                    </h3>
                  </div>

                  <div>
                    <div className="relative rounded-xl overflow-hidden bg-slate-950 aspect-video flex items-center justify-center mb-2.5 shadow-inner">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#00A0DF] text-white flex items-center justify-center group-hover:scale-115 transition-transform shadow-lg shadow-[#00A0DF]/50">
                        <Play size={18} className="fill-current ml-0.5" />
                      </div>
                      <span className="absolute bottom-2 left-2 text-[9px] sm:text-[10px] font-bold text-white bg-black/75 px-2 py-0.5 rounded backdrop-blur-sm">
                        ▶ Watch Video
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-semibold">
                      <span>{rev.author}</span>
                      <span className="text-[#00A0DF] font-bold">{rev.market}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/enrollment"
              className="lwa-btn px-8 sm:px-10 py-3.5 sm:py-4 text-xs xs:text-sm sm:text-base font-black rounded-xl"
            >
              YES! I WANT TO LEARN THIS
            </Link>
            <p className="text-[11px] sm:text-xs text-slate-500 font-semibold mt-2.5">
              Learn step-by-step with lifetime mentorship support.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. WHO IS THIS FOR? (6-PASTEL CARD GRID) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="section-tag-pill">PERFECT FOR YOU IF…</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Who Is This For?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              No matter where you’re starting from, this program meets you there.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            
            <div className="bg-[#FFF4E0] border border-amber-200/80 rounded-2xl p-6 shadow-sm card-hover-lift">
              <div className="text-3xl mb-3">🌱</div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                If You’re a Complete <span className="text-amber-700">Beginner</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                No idea how to start? I’ll guide you step by step. By the end, you’ll have a fully working Shopify store and a clear roadmap to your first sale.
              </p>
            </div>

            <div className="bg-[#E7F0FF] border border-blue-200/80 rounded-2xl p-6 shadow-sm card-hover-lift">
              <div className="text-3xl mb-3">📣</div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                If You’re <span className="text-[#00A0DF]">Struggling With Ads</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Confused by Facebook or TikTok ads? Learn to create high-converting campaigns, target the right audience, and scale your sales the right way.
              </p>
            </div>

            <div className="bg-[#EAF9EF] border border-emerald-200/80 rounded-2xl p-6 shadow-sm card-hover-lift">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                If You’re a <span className="text-emerald-700">Business Owner</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Want to add a profitable eCommerce stream? Learn to find winning products, source reliable UAE &amp; KSA suppliers, and automate your store.
              </p>
            </div>

            <div className="bg-[#FDEAF1] border border-rose-200/80 rounded-2xl p-6 shadow-sm card-hover-lift">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                Ready to <span className="text-rose-700">Master Store Management</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Start dropshipping with minimal investment while getting lifetime mentorship and proven strategies to grow your online business skills.
              </p>
            </div>

            <div className="bg-[#EDEAFE] border border-purple-200/80 rounded-2xl p-6 shadow-sm card-hover-lift">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                If You’re Already <span className="text-purple-700">Running a Store</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Struggling to scale or manage campaigns? Learn advanced scaling techniques, automation tools, and ad strategies to reach the next level.
              </p>
            </div>

            <div className="bg-[#E0F7F6] border border-teal-200/80 rounded-2xl p-6 shadow-sm card-hover-lift">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-base font-black text-slate-900 mb-2">
                If You’re a <span className="text-teal-700">Freelancer or Side Hustler</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Add dropshipping to your skillset and earn extra income online. Learn product research, ad mastery, and store management to start fast.
              </p>
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
      </section>

      {/* ========================================================================= */}
      {/* 8. COMPLETE COURSE CURRICULUM (11 MODULES) */}
      {/* ========================================================================= */}
      <section id="curriculum" className="py-14 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="section-tag-pill">11 COMPLETE MODULES</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Everything You Get Inside the Course
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              Start from zero and build your own UAE &amp; KSA store, step by step.
            </p>
          </div>

          <CurriculumAccordion modules={initialModules} />

          <div className="text-center mt-10">
            <Link
              href="/enrollment"
              className="lwa-btn px-10 py-4 text-sm sm:text-base font-black rounded-xl"
            >
              YES! I WANT TO LEARN THIS
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FREE BONUSES STACK WORTH RS 30,000+ */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-[#0B0F19] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <BonusStack customData={content.bonuses} />
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. REAL STUDENT SUCCESS & MOVING REVIEWS STREAM */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
            <span className="section-tag-pill">STUDENT RESULTS</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Students <span className="text-[#00A0DF]">Success</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              Real screenshots and verified reviews shared by our students — unedited and unfiltered.
            </p>
          </div>

          {/* Continuous Moving Proof Wall Component */}
          <ProofWall customTestimonials={content.testimonials} />

          {/* Continuous Moving Live Profit Dashboard Streams */}
          <div className="mt-12 pt-10 border-t border-gray-200">
            <div className="text-center mb-6">
              <span className="text-xs font-black uppercase tracking-wider text-[#00A0DF] bg-[#00A0DF]/10 px-3.5 py-1 rounded-full border border-[#00A0DF]/20 shadow-xs">
                ⚡ LIVE STORE DASHBOARD WINS
              </span>
            </div>

            <div className="overflow-hidden py-3 marquee-fade-mask touch-pan-x">
              <div className="animate-marquee flex items-center gap-3 sm:gap-6">
                {[...studentEarningsScreenshots, ...studentEarningsScreenshots, ...studentEarningsScreenshots, ...studentEarningsScreenshots].map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0B0F19] text-white border border-slate-800 rounded-2xl p-3.5 sm:p-5 w-[215px] xs:w-[240px] sm:w-[270px] flex-shrink-0 shadow-lg hover:border-[#00A0DF] transition-colors card-hover-lift cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">{s.label}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    </div>
                    <div className="text-base sm:text-xl font-black text-emerald-400 mb-1">
                      {s.profit}
                    </div>
                    <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-300 font-semibold">
                      <span>{s.name}</span>
                      <span className="text-[#00A0DF] font-bold">{s.orders}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/enrollment"
              className="lwa-btn px-10 py-4 text-sm sm:text-base font-black rounded-xl"
            >
              YES! I WANT TO LEARN THIS
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. 2 OPTIONS LEFT COMPARISON (LEARNWITHAFAQ STYLE) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="section-tag-pill">YOUR CHOICE</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              Now You Have 2 Options Left
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              One keeps you stuck. The other moves you forward.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Option 01: The Hard Way */}
            <div className="bg-white border-2 border-red-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm card-hover-lift">
              <div>
                <span className="inline-block bg-red-100 text-red-700 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 border border-red-200">
                  OPTION 01
                </span>
                <h3 className="text-xl font-black text-slate-900 mb-1">
                  Do It Yourself
                </h3>
                <p className="text-xs text-slate-500 font-semibold mb-6">
                  The slow, frustrating road
                </p>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-medium">
                  <div className="flex items-start gap-3">
                    <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Keep guessing what works and what doesn’t</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Watch others grow while you’re still “figuring it out”</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Waste months testing random tips</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <span>Lose motivation before you see any results</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Option 02: The Proven Blueprint */}
            <div className="bg-[#0B0F19] text-white border-2 border-[#00A0DF] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative card-hover-lift">
              {/* Recommended Badge */}
              <div className="absolute -top-3.5 right-6 bg-amber-400 text-slate-950 font-black text-[11px] px-3.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                RECOMMENDED
              </div>

              <div>
                <span className="inline-block bg-[#00A0DF]/20 text-[#00A0DF] text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 border border-[#00A0DF]/40">
                  OPTION 02
                </span>
                <h3 className="text-xl font-black text-white mb-1">
                  Join the Ecommestry Program
                </h3>
                <p className="text-xs text-slate-400 font-semibold mb-6">
                  The proven, guided shortcut
                </p>

                <div className="space-y-4 text-xs sm:text-sm text-slate-200 font-medium mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Learn what truly drives profitable stores — step by step</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Follow a tested system instead of guesswork</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Get structured guidance that reduces costly mistakes</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>Lifetime support to guide you the whole journey</span>
                  </div>
                </div>
              </div>

              <Link
                href="/enrollment"
                className="lwa-btn w-full py-3.5 text-xs sm:text-sm font-black rounded-xl"
              >
                YES! I WANT TO LEARN THIS
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 12. BEFORE YOU CLOSE THIS PAGE: WHAT DOES WAITING COST YOU? */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="section-tag-pill">⏳ BEFORE YOU CLOSE THIS PAGE</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              What Does Waiting <span className="text-[#00A0DF]">Really Cost</span> You?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              The price isn&apos;t just the course fee. It&apos;s everything that stays exactly the same if nothing changes today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 card-hover-lift">
              <span className="text-[11px] font-black uppercase text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-md inline-block mb-3">
                3 MONTHS FROM NOW
              </span>
              <h3 className="text-base font-black text-slate-900 mb-2">Still Stuck at &ldquo;Someday&rdquo;</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                You&apos;re still watching free videos, still saving posts, still telling yourself you&apos;ll start next month. Same questions, zero progress.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 card-hover-lift">
              <span className="text-[11px] font-black uppercase text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-md inline-block mb-3">
                1 YEAR FROM NOW
              </span>
              <h3 className="text-base font-black text-slate-900 mb-2">Watching Others Move Ahead</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                People who started today will already have a live store and real experience. You&apos;ll be watching their wins thinking <strong>&ldquo;I could have done that too.&rdquo;</strong>
              </p>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 card-hover-lift">
              <span className="text-[11px] font-black uppercase text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-md inline-block mb-3">
                EXPENSIVE GUESSING
              </span>
              <h3 className="text-base font-black text-slate-900 mb-2">Money Lost to Trial &amp; Error</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                Most beginners burn a big chunk of ad budget testing blindly — with little to show for it. A proven system saves you from paying that &ldquo;tuition&rdquo;.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 card-hover-lift">
              <span className="text-[11px] font-black uppercase text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-md inline-block mb-3">
                RISING COMPETITION
              </span>
              <h3 className="text-base font-black text-slate-900 mb-2">Late Entry = Harder Game</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                E-commerce grows every year. The longer you wait, the more crowded the market gets — and the harder it is to stand out as a beginner.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 card-hover-lift">
              <span className="text-[11px] font-black uppercase text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-md inline-block mb-3">
                WASTED MONTHS
              </span>
              <h3 className="text-base font-black text-slate-900 mb-2">The Slow, Lonely Route</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Figuring it all out alone can take 6–12 months of confusion. With a clear step-by-step roadmap, you skip the guesswork and move with confidence.
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 card-hover-lift">
              <span className="text-[11px] font-black uppercase text-emerald-800 bg-emerald-200/80 px-2.5 py-1 rounded-md inline-block mb-3">
                THE REAL MATH
              </span>
              <h3 className="text-base font-black text-slate-900 mb-2">Course Fee vs. The Cost</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                The course costs less than what most beginners waste on a single failed ad test. The real question isn&apos;t &ldquo;can I afford it?&rdquo; — it&apos;s &ldquo;can I afford another year of standing still?&rdquo;
              </p>
            </div>

          </div>

          {/* Decision Banner */}
          <div className="bg-[#0B0F19] text-white rounded-2xl p-5 text-center mb-8 border border-slate-800 card-hover-lift">
            <span className="text-sm sm:text-base font-bold">
              🎯 This isn&apos;t just a course decision. <strong>It&apos;s a decision about where you&apos;ll be 6 months from now.</strong>
            </span>
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
      </section>

      {/* ========================================================================= */}
      {/* 13. FREQUENTLY ASKED QUESTIONS (FAQS) */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">
              Here’s What Most People Ask Before Joining
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              Everything you need to know before enrolling.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 transition-all duration-200 open:border-[#00A0DF] open:shadow-md card-hover-lift"
              >
                <summary className="font-extrabold text-sm sm:text-base text-slate-900 cursor-pointer list-none flex justify-between items-center select-none">
                  <span>{faq.q}</span>
                  <span className="text-[#00A0DF] font-black text-xl transition-transform group-open:rotate-45 ml-2">
                    +
                  </span>
                </summary>
                <p className="mt-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-3 border-t border-gray-100">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 14. FINAL BOTTOM CTA BANNER (LEARNWITHAFAQ STYLE) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-[#0B0F19] text-white text-center relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,160,223,0.18)_0,transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <span className="inline-block bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/30 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4 animate-float">
            JOIN 9,700+ STUDENTS
          </span>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            Take the First Step Toward a <span className="text-[#00A0DF]">Profitable Dropshipping Business</span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto mb-8 font-medium">
            Thousands of beginners across UAE &amp; KSA markets have already started. Today it&apos;s your turn.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <Link
              href="/enrollment"
              className="lwa-btn px-12 py-4.5 text-base sm:text-lg font-black rounded-xl shadow-2xl"
            >
              YES! I WANT TO LEARN THIS
            </Link>
            <p className="text-xs text-slate-400 font-semibold">
              14-day money-back guarantee &bull; Lifetime access &amp; support
            </p>
          </div>

          <div className="mt-8 max-w-lg mx-auto">
            <CountdownTimer />
          </div>

        </div>
      </section>

      {/* Main Footer */}
      <Footer />
    </div>
  );
}

export default HomePageClient;
