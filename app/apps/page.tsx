'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { 
  Laptop, 
  Smartphone, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#00A0DF] selection:text-white">
      <TopMarquee />
      <Navbar />

      {/* Header Banner */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              DESKTOP &amp; MOBILE APPLICATIONS
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              Download WithSami LMS Apps
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
              Watch your 36 HD masterclass lectures, download templates, and connect with mentor Sami right from your Windows laptop or Android mobile.
            </p>
          </div>
        </div>
      </section>

      {/* App Cards */}
      <section className="py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Windows Desktop App */}
            <div className="bg-white border-2 border-slate-200 hover:border-[#00A0DF] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center mb-6">
                  <Laptop size={30} />
                </div>
                <span className="text-xs font-bold text-[#00A0DF] uppercase tracking-wider block mb-1">FOR WINDOWS 10 / 11</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">WithSami LMS Desktop</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Full widescreen HD video player, offline study support, automatic lecture progress tracking, and instant keyboard shortcuts.
                </p>

                <div className="space-y-2.5 text-xs font-bold text-slate-700 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Version 1.0.13 (Stable Release)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Safe &amp; Verified Windows Installer</span>
                  </div>
                </div>
              </div>

              <a
                href="/apps/WithSamiLMS_Windows_1.0.13.exe"
                download
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-black text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-lg shadow-[#00A0DF]/30 transition-all"
              >
                <Download size={18} />
                <span>Download Windows .EXE</span>
              </a>
            </div>

            {/* Android Mobile App */}
            <div className="bg-white border-2 border-slate-200 hover:border-emerald-500 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-6">
                  <Smartphone size={30} />
                </div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">FOR ANDROID MOBILE</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">WithSami LMS Android</h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Learn on the go during your commute or free evening hours. Fast background video streaming and WhatsApp support integration.
                </p>

                <div className="space-y-2.5 text-xs font-bold text-slate-700 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Version 1.0 APK Build</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Compatible with Android 8.0+</span>
                  </div>
                </div>
              </div>

              <a
                href="/apps/WithSamiLMS_v10.apk"
                download
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-all"
              >
                <Download size={18} />
                <span>Download Android .APK</span>
              </a>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
