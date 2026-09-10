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
  HomepageProofWall, 
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
  X,
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
  LayoutGrid,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';
import { defaultCmsContent, CmsContentSchema, updateCmsContent } from '@/utils/cmsStore';
import { Module } from '@/utils/db';
import { supabase } from '@/lib/supabase';

function WhyDifferentSection({ content, defaultData }: { content: any; defaultData: any }) {
  const data = content?.why_different || defaultData;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (data?.is_active === false) return null;

  const cards = data?.cards || defaultData.cards || [];

  return (
    <section ref={sectionRef} className="py-14 sm:py-20 bg-white border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="section-tag-pill">THE ECOMINION DIFFERENCE</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3 uppercase">
            {data?.title || 'WHY ECOMINION IS DIFFERENT'}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
            {data?.subtitle || 'Because we’re not teaching you to copy a product. We’re teaching you to understand the business behind it.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card: any, idx: number) => (
            <div
              key={idx}
              className={`transition-all duration-500 motion-reduce:transition-none ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDelay: `${idx * 100}ms`
              }}
            >
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm card-hover-lift h-full flex flex-col justify-between group cursor-pointer select-none">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] font-black text-xs sm:text-sm flex items-center justify-center border border-[#00A0DF]/25 mb-4 group-hover:bg-[#00A0DF] group-hover:text-white transition-colors duration-200 shadow-sm">
                    {card.number || `0${idx + 1}`}
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2 uppercase tracking-tight leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function SignatureFrameworkTeaser({ content, defaultData }: { content: any; defaultData: any }) {
  const data = content?.signature_framework || defaultData;
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  if (data?.is_active === false) return null;

  const badge = data?.badge || data?.eyebrow || defaultData.badge || 'SIGNATURE FRAMEWORK';
  const title = data?.title || defaultData.title || 'THE 3-SHIFT SCALING FORMULA™';
  const subtitle = data?.subtitle || defaultData.subtitle || '(That Is Also Called The Order Booster System)';
  const description = data?.description || defaultData.description || 'My proprietary 24-hour marketing & campaign shift strategy designed to maximize ad efficiency, boost confirmed daily orders, and scale profitability systematically.';
  const highlightTag = data?.highlight_tag || defaultData.highlight_tag || 'PROPRIETARY 24-HOUR MARKETING STRATEGY';
  const ctaText = data?.cta_text || defaultData.cta_text || 'ENROLL NOW & GET THE 3S SYSTEM →';

  return (
    <section ref={sectionRef} className="py-8 sm:py-10 bg-slate-100/70 border-t border-slate-200/80 overflow-visible">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`transition-all duration-500 motion-reduce:transition-none ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="relative bg-[#0B0F19] text-white border-2 border-[#00A0DF] rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl card-hover-lift">
            {/* Recommended/Signature Style Floating Badge with Star (Same as Option 2) */}
            <div className="absolute -top-3.5 right-6 sm:right-8 bg-amber-400 text-slate-950 font-black text-[11px] sm:text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5 select-none">
              <Star size={12} className="fill-slate-950 text-slate-950" />
              <span>{badge}</span>
            </div>

            {/* Ambient glows inside card */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00A0DF]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              {/* Highlight Tag Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00A0DF]/15 border border-[#00A0DF]/35 text-[#00A0DF] text-[11px] sm:text-xs font-black tracking-wider uppercase mb-3.5">
                <Sparkles size={13} className="text-[#00A0DF]" />
                <span>{highlightTag}</span>
              </div>

              {/* Main Framework Heading */}
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight uppercase mb-1.5">
                {title}
              </h3>

              {/* Also Called / Subtitle */}
              <p className="text-xs sm:text-sm md:text-base font-bold text-amber-400 tracking-wide mb-3">
                {subtitle}
              </p>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-3xl mb-6">
                {description}
              </p>

              {/* Bottom CTA Area */}
              <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400 font-semibold text-center sm:text-left">
                  Included directly inside the complete Ecominion mentorship.
                </p>
                <Link
                  href="/enrollment"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-[#00A0DF] to-[#0082b4] hover:from-[#00b0f5] hover:to-[#00A0DF] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-[#00A0DF]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>{ctaText}</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface HomePageClientProps {
  initialContent: CmsContentSchema;
  initialModules: Module[];
}

export function HomePageClient({ initialContent, initialModules }: HomePageClientProps) {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState('');
  const [activeVideoTitle, setActiveVideoTitle] = useState('');
  const [content, setContent] = useState<CmsContentSchema>(initialContent || defaultCmsContent);
  const [isReviewTouchPaused, setIsReviewTouchPaused] = useState(false);

  // Hero Autoplay Video & Sound States (LearnWithAfaq Style)
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);
  const [heroCurrentTime, setHeroCurrentTime] = useState(1);
  const [heroDuration, setHeroDuration] = useState(128);
  const [isHeroControlsHovered, setIsHeroControlsHovered] = useState(false);
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const heroIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (initialContent) {
      updateCmsContent(initialContent);
    }

    const syncData = async () => {
      // 1. Local API Route (Always fetch fresh with no-store & timestamp)
      try {
        const res = await fetch('/api/public/cms-content?_t=' + Date.now(), {
          cache: 'no-store',
          headers: { 'Pragma': 'no-cache', 'Cache-Control': 'no-cache' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.sections) {
            setContent(data.sections);
            updateCmsContent(data.sections);
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
              const merged = { ...defaultCmsContent, ...parsed };
              setContent(merged);
              updateCmsContent(merged);
            }
          }
        } catch (e) {}
      }
    };

    // Only run network fetch on mount if SSR did not supply initialContent
    if (!initialContent) {
      syncData();
    }

    window.addEventListener('sami_cms_updated', syncData);
    window.addEventListener('storage', syncData);

    return () => {
      window.removeEventListener('sami_cms_updated', syncData);
      window.removeEventListener('storage', syncData);
    };
  }, [initialContent]);

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

  const handleHeroUnmute = () => {
    setIsHeroMuted(false);
    setIsHeroPlaying(true);
    if (isDirectVideo && heroVideoRef.current) {
      heroVideoRef.current.muted = false;
      heroVideoRef.current.volume = 1;
      heroVideoRef.current.play().catch(() => {});
    }
    if (heroIframeRef.current) {
      try {
        heroIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute' }),
          '*'
        );
        heroIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
          '*'
        );
        heroIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo' }),
          '*'
        );
        heroIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ method: 'unmute' }),
          '*'
        );
        heroIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({ method: 'play' }),
          '*'
        );
      } catch (e) {}
    }
  };

  const toggleHeroPlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextPlaying = !isHeroPlaying;
    setIsHeroPlaying(nextPlaying);

    if (isDirectVideo && heroVideoRef.current) {
      if (nextPlaying) {
        heroVideoRef.current.play().catch(() => {});
      } else {
        heroVideoRef.current.pause();
      }
    } else if (heroIframeRef.current) {
      try {
        // YouTube API command
        heroIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: nextPlaying ? 'playVideo' : 'pauseVideo'
          }),
          '*'
        );
        // Bunny.net PlayerJS command
        heroIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({
            method: nextPlaying ? 'play' : 'pause'
          }),
          '*'
        );
      } catch (e) {}
    }
  };

  const toggleHeroMute = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    const nextMuted = !isHeroMuted;
    setIsHeroMuted(nextMuted);

    if (isDirectVideo && heroVideoRef.current) {
      heroVideoRef.current.muted = nextMuted;
      if (!nextMuted) heroVideoRef.current.volume = 1;
    } else if (heroIframeRef.current) {
      try {
        heroIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({
            event: 'command',
            func: nextMuted ? 'mute' : 'unMute'
          }),
          '*'
        );
        if (!nextMuted) {
          heroIframeRef.current.contentWindow?.postMessage(
            JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }),
            '*'
          );
        }
        heroIframeRef.current.contentWindow?.postMessage(
          JSON.stringify({
            method: nextMuted ? 'mute' : 'unmute'
          }),
          '*'
        );
      } catch (e) {}
    }
  };

  const formatHeroTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isYouTubeVideo = Boolean(
    hero.video_url?.includes('youtube.com') || hero.video_url?.includes('youtu.be')
  );
  const isBunnyVideo = Boolean(
    hero.video_url?.includes('mediadelivery.net') || hero.video_url?.includes('bunny')
  );
  const isDirectVideo = !isYouTubeVideo && !isBunnyVideo;

  const getYouTubeId = (url?: string) => {
    if (!url) return 'dQw4w9WgXcQ';
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match && match[1] ? match[1] : 'dQw4w9WgXcQ';
  };

  // Force immediate autoplay on mount for direct videos across all devices (Safari, Chrome, Android, iOS)
  useEffect(() => {
    if (isDirectVideo && heroVideoRef.current) {
      heroVideoRef.current.defaultMuted = true;
      heroVideoRef.current.muted = true;
      const playPromise = heroVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsHeroPlaying(true);
          })
          .catch(() => {});
      }
    }
  }, [isDirectVideo, hero.video_url]);

  // Auto increment counter when playing if video is an embed iframe
  useEffect(() => {
    if (!isDirectVideo && isHeroPlaying) {
      const interval = setInterval(() => {
        setHeroCurrentTime(prev => (prev >= heroDuration ? 0 : prev + 1));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isDirectVideo, isHeroPlaying, heroDuration]);

  const getYouTubeEmbedUrl = (url: string) => {
    const vId = getYouTubeId(url);
    return `https://www.youtube.com/embed/${vId}?autoplay=1&mute=1&loop=1&playlist=${vId}&controls=0&modestbranding=1&rel=0&playsinline=1&enablejsapi=1`;
  };

  const getBunnyEmbedUrl = (url: string) => {
    const base = url.split('?')[0];
    return `${base}?autoplay=true&muted=true&loop=true&playsinline=true`;
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
      <TopMarquee items={content.marquee?.items} />

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
      {/* 1. HERO SECTION (LEARNWITHAFAQ 2-COLUMN DESKTOP + COMPACT MOBILE)        */}
      {/* ========================================================================= */}
      <section className="relative pt-4 pb-10 sm:pt-10 sm:pb-16 md:pt-14 md:pb-20 overflow-hidden bg-gradient-to-b from-[#f0f9ff]/50 via-white to-white">
        {/* Soft Background Ambient Blur Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-80px] left-[15%] w-[350px] sm:w-[450px] h-[350px] sm:h-[450px] bg-[#00A0DF]/10 rounded-full blur-3xl" />
          <div className="absolute top-[40px] right-[10%] w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-sky-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          {/* Main 2-Column Grid on Desktop, Stacked on Mobile */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-14 items-center">
            
            {/* ------------------------------------------------------------- */}
            {/* LEFT COLUMN: Headings, Subtitle, Desktop CTA & Social Proof   */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              
              {/* Top Pill Badge */}
              {(() => {
                let leftBadge = '';
                let rightBadge = '';

                if (hero.top_pill_badge && hero.top_pill_badge.includes('•')) {
                  const parts = hero.top_pill_badge.split('•');
                  leftBadge = parts[0]?.trim() || '';
                  rightBadge = parts.slice(1).join('•').trim();
                } else {
                  leftBadge = hero.top_pill_badge?.trim() || '';
                  rightBadge = hero.badge?.trim() || '';
                }

                if (!leftBadge && !rightBadge) return null;

                return (
                  <div className="dropshipping-badge mb-3.5 sm:mb-4 cursor-pointer">
                    <span className="badge-dot" />
                    {leftBadge && <span className="badge-blue">{leftBadge}</span>}
                    {rightBadge && (
                      <>
                        <span className="text-slate-400 font-bold">•</span>
                        <span className="badge-dark">{rightBadge}</span>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Main Headline (All Bold Uppercase with Italic Cyan Highlight) */}
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl xl:text-[54px] font-black text-slate-900 tracking-tight leading-[1.12] sm:leading-[1.1] mb-3 sm:mb-4">
                {hero.title_line1 || 'LEARN HOW TO START ONLINE DROPSHIPPING STORE IN UAE & KSA'}{' '}
                <span className="text-[#00A0DF] italic font-black block mt-0.5 sm:mt-1">
                  {hero.title_highlight || 'STEP-BY-STEP TRAINING'}
                </span>
              </h1>

              {/* Subtitle */}
              {hero.subtitle && hero.subtitle.trim() !== '' && (
                <p className="text-sm xs:text-base sm:text-lg md:text-xl text-slate-600 font-semibold max-w-xl mb-5 sm:mb-7 leading-relaxed">
                  {hero.subtitle}
                </p>
              )}

              {/* Desktop-Only CTA Button & Social Proof */}
              <div className="hidden lg:flex flex-col items-start gap-3.5">
                <Link
                  href="/enrollment"
                  className="lwa-btn px-8 sm:px-10 py-4 text-sm sm:text-base font-black rounded-xl hover:bg-[#008ac2] transition-all shadow-xl shadow-[#00A0DF]/30 hover:scale-[1.02] active:scale-95 uppercase tracking-wider"
                >
                  {hero.cta_text || 'YES! I WANT TO LEARN THIS'}
                </Link>
                
                {/* Social Proof with Avatar Bubbles */}
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-600 pt-1">
                  <div className="flex -space-x-2">
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop" alt="Student" />
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop" alt="Student" />
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop" alt="Student" />
                    <img className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop" alt="Student" />
                  </div>
                  <span>{hero.trusted_text || `Trusted by ${mentor.students_count || '9,700+'} Students`}</span>
                </div>
              </div>

            </div>

            {/* ------------------------------------------------------------- */}
            {/* RIGHT COLUMN: Curved Arrow, Pill & Autoplay Video Box         */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col items-center w-full max-w-lg mx-auto lg:max-w-none">
              
              {/* Hand-drawn curved arrow & Program pill (Afaq style) */}
              <div className="w-full flex items-center justify-end pr-4 sm:pr-8 mb-1.5 sm:mb-2 pointer-events-none select-none">
                <div className="flex items-center gap-2">
                  <svg 
                    className="w-10 h-8 sm:w-12 sm:h-9 text-slate-800 transform -rotate-6" 
                    viewBox="0 0 54 44" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M2 10C16 4 38 6 46 26M46 26L39 19M46 26L50 17" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                  <div className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#E0F2FE] border border-[#00A0DF]/40 text-[#00A0DF] text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
                    <span>{hero.program_badge || 'Ecommstory Program'}</span>
                  </div>
                </div>
              </div>

              {/* Video Outer Curved Container Box (Transparent/Light tinted glass) */}
              <div className="w-full rounded-2xl sm:rounded-3xl p-2.5 sm:p-3.5 bg-[#EBF7FC]/90 sm:bg-[#EBF7FC] border-2 border-[#00A0DF]/30 shadow-xl sm:shadow-2xl">
                
                {/* Header text inside video box */}
                <h2 className="text-[11px] sm:text-xs font-black text-slate-700 uppercase tracking-wider text-center mb-2 sm:mb-2.5 px-1">
                  {hero.video_header || 'Watch this 128 seconds of video to learn how easy it is'}
                </h2>

                {/* 16:9 Video Canvas Frame */}
                <div 
                  onClick={() => {
                    if (isHeroMuted) {
                      handleHeroUnmute();
                    } else {
                      toggleHeroPlay();
                    }
                  }}
                  className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-slate-900 border-2 border-[#00A0DF]/30 shadow-lg group select-none cursor-pointer"
                  onMouseEnter={() => setIsHeroControlsHovered(true)}
                  onMouseLeave={() => setIsHeroControlsHovered(false)}
                >
                  {/* Embedded / HTML5 Autoplaying Video */}
                  {isDirectVideo ? (
                    <video
                      ref={heroVideoRef}
                      src={hero.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                      autoPlay
                      muted={isHeroMuted}
                      loop
                      playsInline
                      preload="auto"
                      onLoadedMetadata={() => {
                        setIsHeroPlaying(true);
                        heroVideoRef.current?.play().catch(() => {});
                      }}
                      onLoadedData={() => {
                        setIsHeroPlaying(true);
                        heroVideoRef.current?.play().catch(() => {});
                      }}
                      onCanPlay={() => {
                        setIsHeroPlaying(true);
                        heroVideoRef.current?.play().catch(() => {});
                      }}
                      onPlay={() => {
                        setIsHeroPlaying(true);
                      }}
                      onTimeUpdate={() => {
                        if (heroVideoRef.current) {
                          setHeroCurrentTime(Math.floor(heroVideoRef.current.currentTime));
                          if (heroVideoRef.current.duration) {
                            setHeroDuration(Math.floor(heroVideoRef.current.duration));
                          }
                        }
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : isYouTubeVideo ? (
                    <iframe
                      ref={heroIframeRef}
                      src={getYouTubeEmbedUrl(hero.video_url)}
                      title="Hero Overview Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      className="w-full h-full pointer-events-none scale-[1.02]"
                    />
                  ) : (
                    <iframe
                      ref={heroIframeRef}
                      src={getBunnyEmbedUrl(hero.video_url)}
                      title="Hero Overview Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      className="w-full h-full pointer-events-none scale-[1.02]"
                    />
                  )}

                  {/* Frosted Glassmorphic "Click To Unmute" Center Overlay (Native button with instant touch for iOS 15) */}
                  {isHeroMuted && (
                    <button 
                      type="button"
                      aria-label="Click to unmute video"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleHeroUnmute();
                      }}
                      onTouchEnd={(e) => {
                        e.stopPropagation();
                        handleHeroUnmute();
                      }}
                      style={{ touchAction: 'manipulation' }}
                      className="absolute inset-0 z-20 w-full h-full flex items-center justify-center bg-black/25 backdrop-blur-[2px] cursor-pointer p-3 transition-opacity duration-300 border-none outline-none select-none"
                    >
                      <div className="bg-white/20 hover:bg-white/30 border-2 border-white/60 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-center text-white shadow-2xl transition-transform active:scale-95 max-w-[260px] sm:max-w-[290px] group/card pointer-events-none">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-2.5 rounded-full bg-white/25 flex items-center justify-center border border-white/60 shadow-inner group-hover/card:scale-110 transition-transform">
                          <Volume2 size={28} className="text-white animate-pulse" />
                        </div>
                        <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight drop-shadow-sm">
                          Your Video Is Playing
                        </h4>
                        <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-black text-white bg-[#00A0DF] hover:bg-[#008ac2] px-3.5 py-1 sm:py-1.5 rounded-full shadow-md inline-block uppercase tracking-wider">
                          Click To Unmute
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Bottom Sleek Control Bar (Afaq style - 44px touch targets for mobile) */}
                  <div className={`absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-3 py-2 flex items-center justify-between gap-2 transition-opacity duration-200 ${isHeroMuted && !isHeroControlsHovered ? 'opacity-80' : 'opacity-100'}`}>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        type="button"
                        onClick={toggleHeroPlay}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          toggleHeroPlay();
                        }}
                        style={{ touchAction: 'manipulation' }}
                        className="text-white hover:text-[#00A0DF] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer select-none"
                        title={isHeroPlaying ? 'Pause Video' : 'Play Video'}
                      >
                        {isHeroPlaying ? <Pause size={17} /> : <Play size={17} className="fill-current" />}
                      </button>
                      <button
                        type="button"
                        onClick={toggleHeroMute}
                        onTouchEnd={(e) => {
                          e.stopPropagation();
                          toggleHeroMute();
                        }}
                        style={{ touchAction: 'manipulation' }}
                        className="text-white hover:text-[#00A0DF] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center cursor-pointer select-none"
                        title={isHeroMuted ? 'Unmute Sound' : 'Mute Sound'}
                      >
                        {isHeroMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                      </button>
                      <span className="text-[10px] sm:text-xs font-mono font-bold text-white">
                        {formatHeroTime(heroCurrentTime)}
                      </span>
                    </div>

                    {/* Progress Bar Track */}
                    <div className="flex-1 ml-2 bg-white/30 rounded-full h-1 sm:h-1.5 overflow-hidden">
                      <div 
                        className="bg-[#00A0DF] h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (heroCurrentTime / Math.max(1, heroDuration)) * 100)}%` }}
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* Mobile-Only CTA Button, Strikethrough Price & Trust Badge (Directly Under Video) */}
              <div className="lg:hidden flex flex-col items-center w-full mt-4 sm:mt-5 px-1">
                <Link
                  href="/enrollment"
                  style={{ touchAction: 'manipulation' }}
                  className="lwa-btn w-full min-h-[50px] py-3.5 sm:py-4 text-xs xs:text-sm font-black rounded-xl hover:bg-[#008ac2] transition-all shadow-xl shadow-[#00A0DF]/30 text-center uppercase tracking-wider cursor-pointer select-none"
                >
                  {hero.cta_text || 'YES! I WANT TO LEARN THIS'}
                </Link>

                {/* Strikethrough Pricing line */}
                <div className="mt-3 text-center">
                  <p className="text-xs sm:text-sm font-bold text-slate-700">
                    Originally{' '}
                    <span className="line-through font-extrabold text-red-500">
                      {hero.original_price || '32,500 PKR'}
                    </span>{' '}
                    — Get Instant Access Today for Just{' '}
                    <span className="font-extrabold text-[#00A0DF]">
                      {hero.current_price || '3,799 PKR'}
                    </span>
                  </p>
                </div>

                {/* Mobile Social Proof */}
                <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs font-bold text-slate-500 mt-2.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span>{hero.trusted_text || `Trusted by ${mentor.students_count || '9,700+'} Students`}</span>
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
            <span className="section-tag-pill">{content.why_dropshipping?.badge || 'THE BEST OPPORTUNITY IN 2026'}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              {content.why_dropshipping?.title || (
                <>Why Dropshipping Is the <span className="text-[#00A0DF]">Smartest</span> Online Business Right Now</>
              )}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              {content.why_dropshipping?.subtitle || 'No big investment, no office, no risk. Start with just PKR 15,000 — from home, right on your phone.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
            {(content.why_dropshipping?.items && content.why_dropshipping.items.length > 0 ? content.why_dropshipping.items : [
              {
                title: 'Work From Anywhere',
                desc: 'Run your store from your bedroom, a cafe, or even another country with just internet and mobile.'
              },
              {
                title: 'No Company or Registration',
                desc: 'No paperwork, trade licenses, or legal setup needed — just a laptop and internet to start selling.'
              },
              {
                title: 'Zero Inventory, Zero Risk',
                desc: 'You never buy stock upfront. Your supplier ships only after a customer places an order on your store.'
              },
              {
                title: 'Get Paid in Your Local Bank',
                desc: 'Withdraw your Dirhams and Riyals earnings straight to your Pakistani bank account — simple and direct.'
              }
            ]).map((item, idx) => {
              const icons = [Globe2, Building2, TrendingUp, WalletCards];
              const IconComp = icons[idx % icons.length];
              return (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 card-hover-lift">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#00A0DF] text-white flex items-center justify-center flex-shrink-0 shadow-md">
                      <IconComp size={22} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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
      {/* 4. WHAT YOU’LL MASTER INSIDE ECOMINION */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="section-tag-pill">{content.what_you_get?.badge || 'ECOMINION MASTERY'}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3 uppercase">
              {content.what_you_get?.title || 'WHAT YOU’LL MASTER INSIDE ECOMINION'}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              {content.what_you_get?.subtitle || 'Not just videos. You’ll learn the systems behind building, testing and scaling an e-commerce business.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
            {(content.what_you_get?.items || defaultCmsContent.what_you_get!.items).map((card, idx) => {
              const styles = [
                { icon: Globe2, bg: 'bg-[#00A0DF]/10 text-[#00A0DF]' },
                { icon: Sparkles, bg: 'bg-emerald-500/10 text-emerald-600' },
                { icon: Zap, bg: 'bg-amber-500/10 text-amber-600' },
                { icon: Users, bg: 'bg-purple-500/10 text-purple-600' }
              ];
              const s = styles[idx % styles.length];
              const IconComp = s.icon;
              return (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-sm card-hover-lift">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-4`}>
                    <IconComp size={20} />
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-2 uppercase">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/enrollment"
              className="lwa-btn px-10 py-4 text-sm sm:text-base font-black rounded-xl"
            >
              {hero.cta_text || 'YES! I WANT TO LEARN THIS'}
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4A. SIGNATURE FRAMEWORK (THE 3S SCALING FORMULA™ COMPACT TEASER & MODAL) */}
      {/* ========================================================================= */}
      <SignatureFrameworkTeaser content={content} defaultData={defaultCmsContent.signature_framework!} />

      {/* ========================================================================= */}
      {/* 4B. WHY ECOMINION IS DIFFERENT (NEW STANDALONE SECTION) */}
      {/* ========================================================================= */}
      <WhyDifferentSection content={content} defaultData={defaultCmsContent.why_different!} />

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
                    src={mentor.image || '/images/sami-logo.jpg'}
                    alt={mentor.name || 'Mentor Muhammad Sami'}
                    width={224}
                    height={224}
                    className="w-full h-full rounded-2xl object-cover"
                    priority
                    unoptimized={Boolean(mentor.image && (mentor.image.startsWith('http') || mentor.image.startsWith('data:')))}
                  />
                </div>
                <span className="inline-flex items-center gap-1.5 bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/30 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
                  <Star size={12} className="fill-[#00A0DF]" />
                  {mentor.badge || 'Digital Marketing Expert'}
                </span>
              </div>

              {/* Mentor Details */}
              <div className="lg:col-span-7">
                <span className="section-tag-pill">{mentor.tag || 'YOUR MENTOR'}</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mt-2 mb-3">
                  {mentor.name || 'Muhammad Sami'}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium leading-relaxed mb-6">
                  {mentor.bio || (
                    <>You don’t just need the right mentor — you need the right community too. <strong>Both are included in your purchase today.</strong></>
                  )}
                </p>

                {/* Benefits List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {(mentor.benefits && mentor.benefits.length > 0 ? mentor.benefits : [
                    'Lifetime WhatsApp support',
                    'Private Facebook community',
                    'Private WhatsApp community',
                    'Smooth, guided journey'
                  ]).map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200 font-semibold">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                        <Check size={13} className="stroke-[3]" />
                      </span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Stat Counters */}
                <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-800 text-center">
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-[#00A0DF]">{mentor.stat1_value || mentor.students_count || '9,700+'}</div>
                    <div className="text-[11px] text-slate-400 font-semibold">{mentor.stat1_label || 'Students mentored'}</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-emerald-400">{mentor.stat2_value || 'UAE & KSA'}</div>
                    <div className="text-[11px] text-slate-400 font-semibold">{mentor.stat2_label || 'Market focus'}</div>
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-amber-400">{mentor.stat3_value || 'Lifetime'}</div>
                    <div className="text-[11px] text-slate-400 font-semibold">{mentor.stat3_label || 'Access & support'}</div>
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
            <span className="section-tag-pill">{content.video_reviews?.badge || 'REAL STUDENT RESULTS'}</span>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2 sm:mb-3">
              {content.video_reviews?.title || 'Hear What Our Students Are Saying'}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium px-2">
              {content.video_reviews?.subtitle || 'Real student video reviews sharing their experience, support, and results after joining Ecom With Sami.'}
            </p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-2 max-w-5xl mx-auto mb-5 px-2 text-[11px] sm:text-xs font-bold text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00A0DF] animate-ping flex-shrink-0" />
            <span>Continuous student review stream &bull; Hover or tap to pause &amp; watch</span>
          </div>

          {/* CONTINUOUS MOVING STREAM */}
          <div 
            className="space-y-4 overflow-hidden py-2 marquee-fade-mask relative touch-pan-x"
            onTouchStart={() => setIsReviewTouchPaused(true)}
            onTouchEnd={() => {
              setTimeout(() => setIsReviewTouchPaused(false), 1200);
            }}
          >
            <div 
              className="animate-marquee-slow flex items-stretch gap-3.5 sm:gap-5"
              style={{ animationPlayState: isReviewTouchPaused ? 'paused' : undefined }}
            >
              {[
                ...(content.video_reviews?.items && content.video_reviews.items.length > 0 ? content.video_reviews.items : videoReviews),
                ...(content.video_reviews?.items && content.video_reviews.items.length > 0 ? content.video_reviews.items : videoReviews),
                ...(content.video_reviews?.items && content.video_reviews.items.length > 0 ? content.video_reviews.items : videoReviews)
              ].map((rev, idx) => (
                <div
                  key={idx}
                  role="button"
                  tabIndex={0}
                  style={{ touchAction: 'manipulation' }}
                  onClick={() => openReviewVideo(rev.headline, rev.videoUrl || hero.video_url)}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    openReviewVideo(rev.headline, rev.videoUrl || hero.video_url);
                  }}
                  className="w-[265px] xs:w-[295px] sm:w-[340px] bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-2xl hover:border-[#00A0DF] transition-all flex flex-col justify-between flex-shrink-0 cursor-pointer card-hover-lift group select-none active:border-[#00A0DF]"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-0.5 sm:gap-1 text-amber-400">
                        {[...Array(rev.stars || 5)].map((_, i) => (
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
            <span className="section-tag-pill">{content.who_is_this_for?.badge || 'PERFECT FOR YOU IF…'}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              {content.who_is_this_for?.title || 'Who Is This For?'}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              {content.who_is_this_for?.subtitle || 'No matter where you’re starting from, this program meets you there.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {(content.who_is_this_for?.items || defaultCmsContent.who_is_this_for!.items).map((card, idx) => {
              const cardStyles = [
                { bg: 'bg-[#FFF4E0]', border: 'border-amber-200/80', emoji: '🌱', hlColor: 'text-amber-700' },
                { bg: 'bg-[#E7F0FF]', border: 'border-blue-200/80', emoji: '📣', hlColor: 'text-[#00A0DF]' },
                { bg: 'bg-[#EAF9EF]', border: 'border-emerald-200/80', emoji: '💼', hlColor: 'text-emerald-700' },
                { bg: 'bg-[#FDEAF1]', border: 'border-rose-200/80', emoji: '🚀', hlColor: 'text-rose-700' },
                { bg: 'bg-[#EDEAFE]', border: 'border-purple-200/80', emoji: '📈', hlColor: 'text-purple-700' },
                { bg: 'bg-[#E0F7F6]', border: 'border-teal-200/80', emoji: '💡', hlColor: 'text-teal-700' }
              ];
              const s = cardStyles[idx % cardStyles.length];
              return (
                <div key={idx} className={`${s.bg} border ${s.border} rounded-2xl p-6 shadow-sm card-hover-lift`}>
                  <div className="text-3xl mb-3">{s.emoji}</div>
                  <h3 className="text-base font-black text-slate-900 mb-2">
                    {card.title}{' '}
                    {card.highlight && <span className={s.hlColor}>{card.highlight}</span>}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              href="/enrollment"
              className="lwa-btn px-10 py-4 text-sm sm:text-base font-black rounded-xl"
            >
              {hero.cta_text || 'YES! I WANT TO LEARN THIS'}
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
            <span className="section-tag-pill">
              {content.homepage_curriculum?.tag || 'COMPLETE COURSE CURRICULUM'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              {content.homepage_curriculum?.title || 'Everything You Get Inside the Course'}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              {content.homepage_curriculum?.subtitle || 'Start from zero and build your own UAE & KSA store, step by step.'}
            </p>
          </div>

          <CurriculumAccordion modules={content.homepage_curriculum?.modules || defaultCmsContent.homepage_curriculum?.modules} />

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
      {/* 10. REAL STUDENT SUCCESS & HOMEPAGE PROOF WALL */}
      {/* ========================================================================= */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <HomepageProofWall data={content.homepage_proof_wall} />

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
            <span className="section-tag-pill">{content.options_comparison?.badge || 'YOUR CHOICE'}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              {content.options_comparison?.title || 'Now You Have 2 Options Left'}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              {content.options_comparison?.subtitle || 'One keeps you stuck. The other moves you forward.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Option 01: The Hard Way */}
            <div className="bg-white border-2 border-red-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm card-hover-lift">
              <div>
                <span className="inline-block bg-red-100 text-red-700 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-4 border border-red-200">
                  {content.options_comparison?.diy_badge || 'OPTION 01'}
                </span>
                <h3 className="text-xl font-black text-slate-900 mb-1">
                  {content.options_comparison?.diy_title || 'Do It Yourself'}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mb-6">
                  {content.options_comparison?.diy_subtitle || 'The slow, frustrating road'}
                </p>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-medium">
                  {(content.options_comparison?.diy_points || defaultCmsContent.options_comparison.diy_points).map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3">
                      <XCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
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
                  {content.options_comparison?.sami_badge || 'OPTION 02'}
                </span>
                <h3 className="text-xl font-black text-white mb-1">
                  {content.options_comparison?.sami_title || 'Join the Ecommestry Program'}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mb-6">
                  {content.options_comparison?.sami_subtitle || 'The proven, guided shortcut'}
                </p>

                <div className="space-y-4 text-xs sm:text-sm text-slate-200 font-medium mb-8">
                  {(content.options_comparison?.sami_points || defaultCmsContent.options_comparison.sami_points).map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/enrollment"
                className="lwa-btn w-full py-3.5 text-xs sm:text-sm font-black rounded-xl"
              >
                {hero.cta_text || 'YES! I WANT TO LEARN THIS'}
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
            <span className="section-tag-pill">{content.cost_of_waiting?.badge || '⏳ BEFORE YOU CLOSE THIS PAGE'}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
              {content.cost_of_waiting?.title || (
                <>What Does Waiting <span className="text-[#00A0DF]">Really Cost</span> You?</>
              )}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
              {content.cost_of_waiting?.subtitle || 'The price isn\'t just the course fee. It\'s everything that stays exactly the same if nothing changes today.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {(content.cost_of_waiting?.cards || defaultCmsContent.cost_of_waiting.cards).map((card, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 card-hover-lift">
                <span className="text-[11px] font-black uppercase text-slate-600 bg-slate-200/80 px-2.5 py-1 rounded-md inline-block mb-3">
                  {card.label}
                </span>
                <h3 className="text-base font-black text-slate-900 mb-2">{card.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Decision Banner */}
          <div className="bg-[#0B0F19] text-white rounded-2xl p-5 text-center mb-8 border border-slate-800 card-hover-lift">
            <span className="text-sm sm:text-base font-bold">
              {content.cost_of_waiting?.banner_text || '🎯 This isn\'t just a course decision. It\'s a decision about where you\'ll be 6 months from now.'}
            </span>
          </div>

          <div className="text-center">
            <Link
              href="/enrollment"
              className="lwa-btn px-10 py-4 text-sm sm:text-base font-black rounded-xl"
            >
              {hero.cta_text || 'YES! I WANT TO LEARN THIS'}
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
            {content.final_cta?.badge || 'JOIN 9,700+ STUDENTS'}
          </span>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
            {content.final_cta?.title || 'Take the First Step Toward a'}{' '}
            <span className="text-[#00A0DF]">
              {content.final_cta?.title_highlight || 'Profitable Dropshipping Business'}
            </span>
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto mb-8 font-medium">
            {content.final_cta?.subtitle || 'Thousands of beginners across UAE & KSA markets have already started. Today it\'s your turn.'}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <Link
              href="/enrollment"
              className="lwa-btn px-12 py-4.5 text-base sm:text-lg font-black rounded-xl shadow-2xl"
            >
              {content.final_cta?.cta_text || hero.cta_text || 'YES! I WANT TO LEARN THIS'}
            </Link>
            <p className="text-xs text-slate-400 font-semibold">
              {content.final_cta?.guarantee_text || '14-day money-back guarantee • Lifetime access & support'}
            </p>
          </div>

          <div className="mt-8 max-w-lg mx-auto">
            <CountdownTimer />
          </div>

        </div>
      </section>

      {/* Main Footer */}
      <Footer customContact={content.contact} customFooter={content.footer} />
    </div>
  );
}

export default HomePageClient;
