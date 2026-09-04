'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  UserCheck, 
  Server, 
  Cookie, 
  HelpCircle,
  ArrowRight,
  Phone,
  Mail
} from 'lucide-react';
import { useContactConfig } from '@/utils/contactConfig';

export default function PrivacyPolicyPage() {
  const { email, displayPhone, getWhatsAppUrl } = useContactConfig();
  const whatsappUrl = getWhatsAppUrl('Hi Sami Team! I have a question regarding the Privacy Policy.');

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
            <ShieldCheck size={14} />
            LEGAL &amp; COMPLIANCE
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Privacy <span className="text-[#00A0DF]">Policy</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Your privacy and personal data security are our top priorities. Learn how Ecom With Sami collects, uses, and safeguards your information.
          </p>
          <div className="mt-4 text-xs font-bold text-slate-400">
            Effective Date: January 1, 2026 &bull; Last Updated: September 2026
          </div>
        </div>
      </section>

      {/* Main Policy Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xl p-6 sm:p-10 md:p-12 space-y-10">

          {/* Section 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <FileText size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                1. Introduction &amp; Scope
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Welcome to <strong>Ecom With Sami</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We are committed to protecting the privacy of our students, prospective trainees, and website visitors across Pakistan, UAE, Saudi Arabia, and internationally. This Privacy Policy details how we handle information collected through our website, student LMS portal, and WhatsApp mentorship channels.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <UserCheck size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                2. Information We Collect
              </h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>When you enroll in our training or contact us, we may collect the following details:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-slate-700 font-medium">
                <li><strong>Personal Identity:</strong> Your full name and location/city.</li>
                <li><strong>Contact Details:</strong> Your active WhatsApp phone number and email address.</li>
                <li><strong>Enrollment &amp; Payment Proof:</strong> Payment transaction screenshots, transaction reference IDs (TRX ID), sender account name, and payment method used (Bank Transfer, JazzCash, EasyPaisa, Raast).</li>
                <li><strong>Student LMS Activity:</strong> Course progress, module completion timestamps, and LMS login timestamps to ensure secure access.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <Eye size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                3. How We Use Your Information
              </h2>
            </div>
            <div className="space-y-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              <p>We use your information exclusively for legitimate educational and service purposes, including:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-slate-700 font-medium">
                <li>Verifying your enrollment payment proof and activating your Student LMS Portal credentials.</li>
                <li>Providing direct 1-on-1 WhatsApp mentorship, support, and access to the verified GCC supplier directory.</li>
                <li>Sending critical course updates, new module additions, and live Q&amp;A session notifications.</li>
                <li>Preventing unauthorized account sharing, piracy, or malicious activities on the platform.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <Lock size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                4. Data Protection &amp; LMS Security
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
              We implement industry-standard encryption protocols (SSL/TLS) and strict access controls. All student credentials are encrypted. To safeguard proprietary dropshipping blueprints, suppliers, and intellectual property, student sessions in the <strong>Ecom With Sami VIP Classroom</strong> are monitored for session integrity.
            </p>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs sm:text-sm font-semibold">
              ⚠️ <strong>Single-Student Policy:</strong> Student LMS access is strictly non-transferable. Attempting to resell credentials or distribute proprietary video recordings results in immediate account suspension.
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <Server size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                5. Zero Data Selling Policy
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We have a strict <strong>Zero Third-Party Data Sharing Policy</strong>. We do <strong>NOT</strong> sell, rent, monetize, or lease your phone number, email address, or personal data to advertising brokers, spam networks, or outside third parties under any circumstances.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <Cookie size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                6. Cookies &amp; Tracking Pixels
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Our website may utilize essential cookies and marketing analytics pixels (such as Meta Pixel and Google Analytics) to assess page load speeds, improve user interface experiences, and measure marketing campaign efficiency. You can disable cookies via your web browser settings at any time.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center font-black flex-shrink-0">
                <HelpCircle size={18} />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                7. Contact Us About Your Privacy
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
              If you have any questions or concerns regarding this Privacy Policy or wish to request data updates, please contact our support desk directly:
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
