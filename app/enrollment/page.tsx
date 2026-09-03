'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { CountdownTimer } from '@/components/landing';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Copy, 
  Upload, 
  AlertCircle,
  CreditCard,
  Camera,
  FileCheck2,
  Lock,
  MessageSquare,
  Sparkles,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { useContactConfig } from '@/utils/contactConfig';

export default function EnrollmentPage() {
  const { displayPhone } = useContactConfig();

  const [selectedMethod, setSelectedMethod] = useState<'easypaisa' | 'jazzcash' | 'meezan' | 'sadapay'>('easypaisa');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [receiptBase64, setReceiptBase64] = useState<string>('');
  const [receiptFileName, setReceiptFileName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    whereHeard: 'TikTok',
    transactionId: ''
  });

  const paymentMethods = [
    {
      id: 'easypaisa',
      name: 'Easypaisa',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '03158960026',
      badge: 'Instant Transfer',
      themeColor: 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '03158960026',
      badge: 'Instant Transfer',
      themeColor: 'border-amber-500 bg-amber-500/10 text-amber-400'
    },
    {
      id: 'meezan',
      name: 'Meezan Bank Ltd',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '01010101010101',
      iban: 'PK00MEZN0001010101010101',
      badge: 'Direct Bank Transfer',
      themeColor: 'border-blue-500 bg-blue-500/10 text-blue-400'
    },
    {
      id: 'sadapay',
      name: 'SadaPay / NayaPay',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '03158960026',
      badge: 'Fast & Zero Fees',
      themeColor: 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
    }
  ];

  const currentPayment = paymentMethods.find(p => p.id === selectedMethod) || paymentMethods[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        paymentMethod: currentPayment.name,
        receiptUrl: receiptBase64
      };

      const res = await fetch('/api/enrollment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success && data.enrollment) {
        setSuccessData(data.enrollment);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setErrorMsg(data.message || 'Failed to submit enrollment.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-[#00A0DF] selection:text-white">
      <TopMarquee />
      <Navbar />

      {/* Top Header Banner */}
      <section className="pt-8 pb-10 sm:pt-12 sm:pb-14 bg-gradient-to-b from-[#111827] to-[#0B0F19] text-white text-center border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <span className="inline-block bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full mb-3 shadow-md shadow-[#00A0DF]/10">
            OFFICIAL ENROLLMENT &bull; 88% DISCOUNT APPLIED
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2">
            UAE &amp; KSA Shopify Dropshipping Mentorship
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mb-6">
            Get lifetime access to 11 video modules, verified GCC suppliers directory &amp; WhatsApp ad mentorship.
          </p>

          {/* Moved Urgency Countdown Timer Here */}
          <div className="w-full max-w-xl mx-auto">
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* Main Form & Steps Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* ========================================================================= */}
        {/* SUCCESS STATE */}
        {/* ========================================================================= */}
        {successData ? (
          <div className="bg-[#111827] border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl text-center animate-in fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5 border-2 border-emerald-500/40 shadow-xl shadow-emerald-500/30">
              <CheckCircle2 size={42} />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
              Thank you, <strong className="text-white">{successData.name}</strong>. Your payment proof has been sent to mentor Sami&rsquo;s team for instant LMS activation.
            </p>

            <div className="bg-[#0B0F19] border border-white/10 rounded-2xl p-5 max-w-md mx-auto text-left text-xs text-slate-300 mb-8 space-y-2.5">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <span className="text-slate-400">Tracking Code:</span>
                <strong className="font-mono text-sm text-[#00A0DF] font-black">{successData.trackingCode}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Student Name:</span>
                <span className="font-bold text-white">{successData.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Login Email:</span>
                <span className="text-[#00A0DF]">{successData.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Course Fee:</span>
                <span className="font-black text-emerald-400">{successData.amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Portal Status:</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {successData.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={successData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm sm:text-base font-black text-white bg-[#25D366] hover:bg-[#1faa53] shadow-xl shadow-emerald-500/30 transition-all"
              >
                <MessageSquare size={18} />
                <span>Notify Sami on WhatsApp for Fast Track</span>
                <ArrowRight size={18} />
              </a>
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-xs sm:text-sm font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <span>Go to Student Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* ========================================================================= */}
            {/* 3 SIMPLE STEPS GUIDE */}
            {/* ========================================================================= */}
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="text-center max-w-xl mx-auto mb-6">
                <span className="text-xs font-black uppercase tracking-wider text-[#00A0DF] block mb-1">
                  QUICK &amp; EASY ENROLLMENT
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  Follow 3 Simple Steps to Get Instant Access
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0B0F19] border border-white/5 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#00A0DF]/15 text-[#00A0DF] flex items-center justify-center font-black text-base flex-shrink-0 border border-[#00A0DF]/30">
                    1
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-white block mb-1">Deposit the Fees</strong>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      Transfer <strong>PKR 3,900</strong> via Easypaisa, JazzCash, Meezan Bank or SadaPay.
                    </p>
                  </div>
                </div>

                <div className="bg-[#0B0F19] border border-white/5 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-black text-base flex-shrink-0 border border-amber-500/30">
                    2
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-white block mb-1">Take a Screenshot</strong>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      Save the payment receipt confirmation screenshot in your gallery.
                    </p>
                  </div>
                </div>

                <div className="bg-[#0B0F19] border border-white/5 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-black text-base flex-shrink-0 border border-emerald-500/30">
                    3
                  </div>
                  <div>
                    <strong className="text-xs sm:text-sm font-bold text-white block mb-1">Fill Form &amp; Submit</strong>
                    <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                      Enter your details below &amp; upload proof for instant LMS credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* STEP 1: CHOOSE PAYMENT METHOD */}
            {/* ========================================================================= */}
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <CreditCard size={18} className="text-[#00A0DF]" />
                    <span>Choose Payment Account (PKR 3,900)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Select your preferred app to view account details and copy number</p>
                </div>
                <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Fee: PKR 3,900
                </span>
              </div>

              {/* Compact Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {paymentMethods.map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedMethod(pm.id as any)}
                    className={`py-3 px-3 rounded-2xl border text-xs font-black transition-all flex flex-col items-center gap-1 ${
                      selectedMethod === pm.id
                        ? 'bg-[#00A0DF] text-white border-[#00A0DF] shadow-lg shadow-[#00A0DF]/30 scale-[1.02]'
                        : 'bg-[#0B0F19] text-slate-300 border-white/10 hover:border-slate-600'
                    }`}
                  >
                    <span>{pm.name}</span>
                    <span className="text-[9px] opacity-80 font-normal">{pm.badge}</span>
                  </button>
                ))}
              </div>

              {/* Selected Payment Card Box */}
              <div className="bg-[#0B0F19] border-2 border-[#00A0DF]/40 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-[#00A0DF] uppercase">{currentPayment.name} Official Details</div>
                  <div className="text-xs text-slate-400">Account Title: <strong className="text-white">{currentPayment.accountTitle}</strong></div>
                  <div className="text-xs text-slate-400">Account Number: <strong className="text-lg sm:text-xl font-mono text-[#00A0DF] font-black block sm:inline sm:ml-1">{currentPayment.accountNumber}</strong></div>
                  {currentPayment.iban && (
                    <div className="text-[11px] text-slate-400 font-mono">IBAN: {currentPayment.iban}</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(currentPayment.accountNumber, currentPayment.id)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-md flex-shrink-0"
                >
                  <Copy size={14} className="text-[#00A0DF]" />
                  <span>{copiedId === currentPayment.id ? 'Copied to Clipboard!' : 'Copy Account Number'}</span>
                </button>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* STEP 2 & 3: FORM & SCREENSHOT UPLOAD */}
            {/* ========================================================================= */}
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                <FileCheck2 size={18} className="text-emerald-400" />
                <span>Fill Details &amp; Upload Payment Proof</span>
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Your login credentials will be generated and sent to this email address automatically.
              </p>

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl p-3.5 mb-6 flex items-center gap-2">
                  <AlertCircle size={16} className="flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Ali"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address (For LMS Login) *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. student@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">WhatsApp / Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 03001234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Your City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lahore / Karachi / Islamabad"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Where did you hear about me? *</label>
                    <select
                      value={formData.whereHeard}
                      onChange={(e) => setFormData({ ...formData, whereHeard: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                    >
                      <option value="TikTok">TikTok Video / Ad</option>
                      <option value="Instagram">Instagram Reels / Post</option>
                      <option value="Facebook">Facebook Ad / Group</option>
                      <option value="YouTube">YouTube Tutorial</option>
                      <option value="Friend">Friend / Family Recommendation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Transaction ID (TID / Ref #) (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 19283746501"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                </div>

                {/* File Upload Box */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Upload Payment Screenshot / Receipt (PNG, JPG) *
                  </label>
                  <label className="border-2 border-dashed border-white/15 hover:border-[#00A0DF] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-[#0B0F19] transition-all group">
                    <Camera size={26} className="text-slate-400 group-hover:text-[#00A0DF] mb-2 transition-colors" />
                    <span className="text-xs font-bold text-slate-300 text-center">
                      {receiptFileName ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 size={15} /> {receiptFileName}
                        </span>
                      ) : (
                        'Click to choose receipt screenshot image from gallery'
                      )}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1">Supports Mobile Screenshots, Bank Slips &amp; Receipts</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl text-sm sm:text-base font-black uppercase text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all mt-4"
                >
                  <ShieldCheck size={20} />
                  <span>{submitting ? 'Submitting Application...' : 'SUBMIT APPLICATION & GET INSTANT LMS ACCESS'}</span>
                  <ArrowRight size={20} />
                </button>

                <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5 pt-2">
                  <Lock size={12} className="text-emerald-400" />
                  <span>100% Secure &bull; Verified Pakistani Banks &bull; Instant Confirmation</span>
                </p>
              </form>
            </div>

          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}
