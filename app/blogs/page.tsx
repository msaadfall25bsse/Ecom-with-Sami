'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { 
  ArrowRight, 
  BookOpen, 
  Clock, 
  Calendar, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function BlogsPage() {
  const blogs = [
    {
      title: 'How to Start Shopify Dropshipping in UAE from Pakistan (2026 Complete Guide)',
      excerpt: 'Learn the exact legal, financial, and operational steps to sell products in Dubai, Abu Dhabi, and Sharjah with fast 2-day delivery.',
      category: 'Beginner Guide',
      readTime: '8 min read',
      date: 'Sept 2026',
      badgeColor: 'bg-[#00A0DF]/10 text-[#00A0DF]'
    },
    {
      title: 'Top 7 Winning Product Hunting Strategies for Saudi Arabia Market',
      excerpt: 'Discover high-demand niches with low return rates in Riyadh & Jeddah using TikTok Creative Center and organic Facebook Ad Library methods.',
      category: 'Product Research',
      readTime: '6 min read',
      date: 'Sept 2026',
      badgeColor: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      title: 'Mastering TikTok Video Ads: The 3-Second Hook Formula That Converts',
      excerpt: 'How to structure your viral video creatives to stop the scroll, lower your cost per purchase (CPA), and scale to 50+ orders per day.',
      category: 'Media Buying',
      readTime: '7 min read',
      date: 'Sept 2026',
      badgeColor: 'bg-indigo-500/10 text-indigo-600'
    },
    {
      title: 'Cash on Delivery (COD) Blueprint: How to Reduce Return/RTO Rates Below 12%',
      excerpt: 'Automated WhatsApp confirmation scripts and customer verification workflows to ensure orders get delivered and paid successfully.',
      category: 'Operations',
      readTime: '5 min read',
      date: 'Sept 2026',
      badgeColor: 'bg-amber-500/10 text-amber-600'
    },
    {
      title: 'How to Withdraw UAE & Saudi Dropshipping Profits into Pakistani Bank Accounts',
      excerpt: 'Step-by-step payout walkthrough for Easypaisa, JazzCash, Meezan Bank, and SadaPay with zero international transaction blocks.',
      category: 'Finance & Banking',
      readTime: '6 min read',
      date: 'Sept 2026',
      badgeColor: 'bg-purple-500/10 text-purple-600'
    },
    {
      title: 'Direct Verified GCC Suppliers: Where to Find Real Wholesale Contacts',
      excerpt: 'Why AliExpress shipping takes too long and how to partner with local UAE & KSA warehouses offering fast dispatch and COD terms.',
      category: 'Suppliers',
      readTime: '9 min read',
      date: 'Sept 2026',
      badgeColor: 'bg-pink-500/10 text-pink-600'
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
            <span className="inline-block bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              KNOWLEDGE HUB &bull; GUIDES &amp; TUTORIALS
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 sm:mb-6">
              eCommerce &amp; Dropshipping <span className="text-[#00A0DF]">Guides</span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-slate-300 leading-relaxed">
              Actionable tutorials, product research frameworks, and ad strategies to help you scale your online store.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="py-12 sm:py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {blogs.map((b, idx) => (
              <article
                key={idx}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-xl hover:border-[#00A0DF]/50 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${b.badgeColor}`}>
                      {b.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <Clock size={13} />
                      <span>{b.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#00A0DF] transition-colors mb-3 leading-snug">
                    {b.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {b.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="text-slate-400">{b.date}</span>
                  <Link
                    href="/enrollment"
                    className="inline-flex items-center gap-1 text-[#00A0DF] font-bold group-hover:underline"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Banner inside Blog */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 border-2 border-[#00A0DF]/40 rounded-3xl p-8 sm:p-12 text-center text-white max-w-4xl mx-auto shadow-2xl">
            <span className="text-xs font-black uppercase tracking-wider text-[#00A0DF] block mb-2">
              WANT THE FULL STEP-BY-STEP SYSTEM?
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-4">
              Get Lifetime Access to 11 HD Video Modules + Supplier Directory
            </h3>
            <p className="text-slate-300 text-xs sm:text-base max-w-xl mx-auto mb-8">
              Join 9,700+ students and get everything you need from product hunting to live campaign scaling for just PKR 3,799.
            </p>
            <Link
              href="/enrollment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-black uppercase rounded-xl text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-lg shadow-[#00A0DF]/30 transition-all"
            >
              <span>Enroll Now &bull; PKR 3,799</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
