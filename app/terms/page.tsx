'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { 
  FileCheck, 
  GraduationCap, 
  ShieldAlert, 
  Scale, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';
import { useContactConfig } from '@/utils/contactConfig';

export default function TermsPage() {
  const { email, displayPhone, getWhatsAppUrl } = useContactConfig();
  const whatsappUrl = getWhatsAppUrl('Hi Sami Team! I have a question regarding the Terms & Conditions.');

  return (
    <div className="min-h-screen bg-[#FAFCFF] text-slate-900 selection:bg-[#00A0DF] selection:text-white font-sans antialiased">
      <TopMarquee />
      <Navbar />

      {/* Header Banner */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-[-40px] left-[20%] w-[350px] h-[350px] bg-[#00A0DF]/15 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-[-40px] right-[20%] w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
            <Scale size={14} />
            SERVICE AGREEMENT
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Terms &amp; <span className="text-[#00A0DF]">Conditions</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before enrolling in Ecom With Sami Mentorship or accessing the Student LMS Portal.
          </p>
          <div className="mt-4 text-xs font-bold text-slate-400">
            Effective Date: January 1, 2026 &bull; Last Updated: September 2026
          </div>
        </div>
      </section>

      {/* Main Terms Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl p-6 sm:p-10 md:p-12 space-y-10">

          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <FileCheck size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                1. Acceptance of Terms
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              By accessing the <strong>Ecom With Sami</strong> website, submitting an enrollment request, or logging into the Student LMS Portal, you legally agree to be bound by these Terms and Conditions and our Refund &amp; Privacy Policies. If you disagree with any part of these terms, you must not use our training materials or services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <GraduationCap size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                2. Mentorship &amp; Course Scope
              </h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>Enrollment in the <strong>UAE &amp; KSA Dropshipping Mentorship Program</strong> includes:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-slate-700 font-medium">
                <li>Access to the 11 comprehensive step-by-step video training modules via our Student LMS Portal.</li>
                <li>Direct contact lists for verified suppliers and private warehouses across Dubai, Sharjah, and Riyadh.</li>
                <li>Lifetime WhatsApp mentorship and guidance directly with Mentor Sardar Samiullah and the support desk during working hours (9:00 AM – 5:00 PM PKT, Mon – Sat).</li>
                <li>Future curriculum updates, case studies, and winning product frameworks at no additional charge.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <ShieldAlert size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                3. Intellectual Property &amp; Single-User License
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
              All video lessons, downloadable resources, suppliers directories, advertising blueprints, and LMS portal software are the exclusive intellectual property of <strong>Ecom With Sami</strong>.
            </p>
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm font-semibold space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle size={16} className="text-rose-600" />
                Strict Anti-Piracy Notice:
              </div>
              <p>
                Each student enrollment grants a single, revocable, non-transferable license. Recording, sharing login passwords, publicly uploading video modules, or reselling supplier contacts is strictly prohibited and subject to immediate account termination and legal action under Pakistani and international copyright laws.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <Scale size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                4. Earnings &amp; Results Disclaimer
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Dropshipping in GCC markets (UAE &amp; KSA) is a genuine e-commerce business model that involves real financial investments (such as Shopify subscription, domain registration, and Meta/TikTok advertising budgets). While we provide proven frameworks, winning product research blueprints, and direct supplier access, individual student earnings depend entirely on personal effort, budget management, testing consistency, and business acumen. <strong>We make no claims of get-rich-quick or effortless passive income.</strong>
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <UserCheck size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                5. Community Code of Conduct
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Students must maintain professional and respectful behavior in all direct WhatsApp conversations and community discussions. Abusive language, harassment of staff or fellow trainees, or spamming commercial pitches will lead to an immediate ban without entitlement to a refund.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <Clock size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                6. 10-Day Satisfaction &amp; Refund Policy
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We stand behind the quality of our mentorship with a transparent <strong>10-Day Money-Back Guarantee</strong>. For full details regarding eligibility, timelines, and refund claim procedures, please review our official{' '}
              <Link href="/refund" className="text-[#00A0DF] font-bold underline hover:text-[#008ac2]">
                Refund Policy
              </Link>.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <Phone size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                7. Questions &amp; Support
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
              For any clarifications regarding these terms, or to speak directly with our admissions team, reach out through our official channels:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 hover:bg-emerald-100 transition-colors font-bold text-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs text-emerald-600 font-semibold uppercase">Official WhatsApp</div>
                  <div className="text-sm font-black">{displayPhone}</div>
                </div>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 hover:bg-sky-100 transition-colors font-bold text-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#00A0DF] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs text-sky-600 font-semibold uppercase">Official Email</div>
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
              <span>Enroll Now</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
