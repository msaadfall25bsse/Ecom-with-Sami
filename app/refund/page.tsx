'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { 
  RotateCcw, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  BadgePercent, 
  HelpCircle, 
  ArrowRight,
  Phone,
  Mail,
  Zap,
  Check
} from 'lucide-react';
import { useContactConfig } from '@/utils/contactConfig';

export default function RefundPolicyPage() {
  const { email, displayPhone, getWhatsAppUrl } = useContactConfig();
  const refundWhatsAppUrl = getWhatsAppUrl('Hi Sami Team! I would like to inquire regarding the 10-Day Money-Back Guarantee / refund process.');

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 selection:bg-[#00A0DF] selection:text-white font-sans antialiased">
      <TopMarquee />
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-40px] left-[20%] w-[350px] h-[350px] bg-emerald-500/15 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-[-40px] right-[20%] w-[300px] h-[300px] bg-[#00A0DF]/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <ShieldCheck size={14} />
            100% PEACE OF MIND GUARANTEE
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            10-Day Money-Back <span className="text-emerald-400">Refund Policy</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            We are confident in our step-by-step dropshipping mentorship. If you feel it is not right for you within 10 days, we honor your refund promptly with zero hassle.
          </p>
          <div className="mt-4 text-xs font-bold text-slate-400">
            Effective Date: January 1, 2026 &bull; Last Updated: September 2026
          </div>
        </div>
      </section>

      {/* Main Refund Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl p-6 sm:p-10 md:p-12 space-y-10">

          {/* Guarantee Highlight Card */}
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-50 to-white border-2 border-emerald-500/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500 text-white flex flex-col items-center justify-center font-black shadow-lg shadow-emerald-500/30 flex-shrink-0">
              <span className="text-2xl sm:text-3xl leading-none">10</span>
              <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">DAYS</span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-1.5">
                Our 100% Risk-Free Satisfaction Guarantee
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                Enroll today for just <strong>3,799 PKR</strong>. Watch the curriculum, review our supplier sourcing blueprints, and interact with the team. If within <strong>10 calendar days</strong> you decide it is not for you, request your refund and we will return your payment.
              </p>
            </div>
          </div>

          {/* Section 1: Conditions */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-black flex-shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                1. Eligibility Conditions
              </h3>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>To qualify for a 100% full refund, please ensure the following conditions are met:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                  <Check size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    Request submitted within <strong>10 days</strong> of initial enrollment timestamp.
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                  <Check size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    Valid payment receipt or Bank / JazzCash / EasyPaisa TRX ID provided.
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                  <Check size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    No violation of intellectual property (no reselling or pirating materials).
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                  <Check size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-700">
                    Single-account owner verification matching WhatsApp contact number.
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: How to Claim */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <RotateCcw size={18} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                2. How to Claim Your Refund (4 Simple Steps)
              </h3>
            </div>
            
            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-lg bg-[#00A0DF] text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                  1
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">Send a Message to Our Support Desk</strong>
                  <span className="text-slate-600">Reach out to our official WhatsApp support number ({displayPhone}) or email ({email}).</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-lg bg-[#00A0DF] text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                  2
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">Provide Enrollment Details</strong>
                  <span className="text-slate-600">State your registered full name, phone number, and payment TRX ID screenshot.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-lg bg-[#00A0DF] text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                  3
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">Rapid Request Audit</strong>
                  <span className="text-slate-600">Our billing coordinator confirms your enrollment timestamp within 24 business hours.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                  4
                </div>
                <div>
                  <strong className="text-slate-900 block font-bold mb-0.5">Direct Payout Transfer</strong>
                  <span className="text-slate-600">Your 3,799 PKR payment is directly refunded to your nominated JazzCash, EasyPaisa, Raast, or Bank account within 2-3 business days.</span>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: After Refund */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black flex-shrink-0">
                <Clock size={18} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                3. LMS Access Deactivation
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Upon successful processing of your refund, your <strong>Student LMS Portal credentials</strong> and access to the 1-on-1 WhatsApp mentorship will be deactivated. You are always welcome to rejoin in the future should you decide to build your dropshipping business.
            </p>
          </section>

          {/* Contact Actions */}
          <section className="pt-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mb-4">
              Need Help With a Refund or Question?
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={refundWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors font-bold text-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs text-emerald-600 font-semibold uppercase">Claim via WhatsApp</div>
                  <div className="text-sm font-black">{displayPhone}</div>
                </div>
              </a>

              <a
                href={`mailto:${email}?subject=Refund%20Request%20-%20Ecom%20With%20Sami`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 hover:bg-sky-100 transition-colors font-bold text-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00A0DF] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs text-sky-600 font-semibold uppercase">Claim via Email</div>
                  <div className="text-sm font-black">{email}</div>
                </div>
              </a>
            </div>
          </section>

          {/* Bottom Back CTA */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-[#00A0DF] transition-colors inline-flex items-center gap-1.5"
            >
              &larr; Back to Home
            </Link>
            <Link
              href="/enrollment"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00A0DF] hover:bg-[#008ac2] text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
            >
              <span>Enroll With Confidence</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
