'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { HomepageProofWall } from '@/components/landing';
import { ArrowRight } from 'lucide-react';
import { defaultCmsContent, getCmsContent, CmsContentSchema } from '@/utils/cmsStore';

export default function SuccessPage() {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<CmsContentSchema>(defaultCmsContent);

  useEffect(() => {
    setMounted(true);
    // 1. Instant local read
    const local = getCmsContent();
    if (local) setContent(local);

    // 2. Fresh background fetch
    fetch('/api/public/cms-content')
      .then((res) => res.json())
      .then((data) => {
        if (data?.sections) {
          setContent((prev) => ({ ...prev, ...data.sections }));
        }
      })
      .catch(() => {});
  }, []);

  if (!mounted) {
    return null;
  }

  const successCms = content.success_page || defaultCmsContent.success_page!;
  const badge = successCms.badge || 'VERIFIED STUDENT PROOF';
  const titleLine1 = successCms.title_line1 || 'Real Students. Real Stores.';
  const titleHighlight = successCms.title_highlight || 'Real Results.';
  const subtitle = successCms.subtitle || 'Explore real earnings screenshots, case studies, and reviews from over 9,700 students who joined the Ecom With Sami mentorship.';

  const stat1Val = successCms.stat1_value || '9,700+';
  const stat1Lbl = successCms.stat1_label || 'Total Students';
  const stat2Val = successCms.stat2_value || '89%';
  const stat2Lbl = successCms.stat2_label || 'First Sale in 14 Days';
  const stat3Val = successCms.stat3_value || '4.9 / 5.0';
  const stat3Lbl = successCms.stat3_label || 'Student Rating';
  const stat4Val = successCms.stat4_value || 'PKR 3,799';
  const stat4Lbl = successCms.stat4_label || 'One-Time Fee';

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#00A0DF] selection:text-white">
      <TopMarquee />
      <Navbar />

      {/* Header Banner */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              {badge}
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 sm:mb-6">
              {titleLine1} <span className="text-[#00A0DF]">{titleHighlight}</span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-slate-300 leading-relaxed">
              {subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Key Metric Highlights */}
      <section className="py-8 bg-slate-900 border-y border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-[#00A0DF]">{stat1Val}</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">{stat1Lbl}</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stat2Val}</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">{stat2Lbl}</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-amber-400">{stat3Val}</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">{stat3Lbl}</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400">{stat4Val}</div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">{stat4Lbl}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Student Proof Wall (Linked with Section 11B Proof Wall) */}
      <section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomepageProofWall
            data={{
              badge: successCms.section_badge || 'STUDENT PROOF',
              title: successCms.section_title || 'Featured Student Results',
              subtitle: successCms.section_subtitle || 'Real screenshots and verified reviews shared by our students — unedited and unfiltered.',
              images: content.homepage_proof_wall?.images
            }}
          />

          {/* Bottom CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <Link
              href="/enrollment"
              className="lwa-btn px-10 py-4 text-base sm:text-lg font-black rounded-xl inline-flex items-center justify-center gap-2"
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
