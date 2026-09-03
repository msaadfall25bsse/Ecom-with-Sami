'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Copy, 
  Upload, 
  AlertCircle
} from 'lucide-react';
import { useContactConfig } from '@/utils/contactConfig';

export default function EnrollmentPage() {
  const { displayPhone } = useContactConfig();

  const [step, setStep] = useState(1);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    paymentMethod: 'Easypaisa',
    transactionId: ''
  });

  const paymentMethods = [
    {
      id: 'easypaisa',
      name: 'Easypaisa',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '03158960026',
      badge: 'Instant Transfer'
    },
    {
      id: 'jazzcash',
      name: 'JazzCash',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '03158960026',
      badge: 'Instant Transfer'
    },
    {
      id: 'meezan',
      name: 'Meezan Bank Ltd',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '01010101010101',
      badge: 'Direct Bank Transfer'
    },
    {
      id: 'sadapay',
      name: 'SadaPay / NayaPay',
      accountTitle: 'SARDAR SAMIULLAH',
      accountNumber: '03158960026',
      badge: 'Fast & Zero Fees'
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/enrollment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success && data.enrollment) {
        setSuccessData(data.enrollment);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#00A0DF] selection:text-white">
      <TopMarquee />
      <Navbar />

      {/* Header */}
      <section className="pt-8 pb-10 sm:pt-12 sm:pb-14 bg-slate-900 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-block bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full mb-2">
            SECURE 3-STEP ENROLLMENT
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white">
            UAE &amp; KSA Shopify Dropshipping Mentorship
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            One-Time Fee: <strong className="text-[#00A0DF] font-black text-base">PKR 3,900</strong> &bull; Lifetime LMS Access Included
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 max-w-xl mx-auto">
          {[
            { num: 1, label: 'Your Details' },
            { num: 2, label: 'Payment Account' },
            { num: 3, label: 'Proof & Activation' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                  step === s.num
                    ? 'bg-[#00A0DF] text-white shadow-md shadow-[#00A0DF]/30'
                    : step > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Content Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold rounded-xl p-3 mb-6 flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successData ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Enrollment Submitted!</h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-4 leading-relaxed">
                Thank you, <strong>{successData.name}</strong>. Your application has been logged with Tracking Code: <strong className="text-[#00A0DF] font-mono">{successData.trackingCode}</strong>.
              </p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs text-slate-700 mb-6 space-y-1.5">
                <div><strong>Student Name:</strong> {successData.name}</div>
                <div><strong>Registered Email:</strong> {successData.email}</div>
                <div><strong>Tracking Code:</strong> <span className="font-mono text-emerald-600 font-bold">{successData.trackingCode}</span></div>
                <div><strong>Amount:</strong> {successData.amount}</div>
                <div><strong>Status:</strong> <span className="text-amber-600 font-bold uppercase">{successData.status}</span></div>
              </div>

              <a
                href={successData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm sm:text-base font-black text-white bg-[#25D366] hover:bg-[#1faa53] rounded-xl shadow-lg shadow-emerald-500/30 transition-all"
              >
                <span>Notify Sami on WhatsApp for Fast Track Activation</span>
                <ArrowRight size={18} />
              </a>
            </div>
          ) : (
            <>
              {/* STEP 1: Student Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
                    Step 1: Enter Your Student Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Muhammad Ali"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email (For LMS Login) *</label>
                      <input
                        type="email"
                        required
                        placeholder="student@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp Number (For Mentorship) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="03001234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Your City *</label>
                      <input
                        type="text"
                        required
                        placeholder="Lahore / Karachi / Islamabad"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="button"
                      disabled={!formData.fullName || !formData.email || !formData.phone}
                      onClick={() => setStep(2)}
                      className="w-full py-3.5 px-6 rounded-xl text-sm font-black text-white bg-[#00A0DF] hover:bg-[#008ec7] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <span>Continue to Payment Options</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Payment Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      Step 2: Transfer PKR 3,900 to Official Account
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-[#00A0DF] font-bold hover:underline"
                    >
                      &larr; Back
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paymentMethods.map((pm) => (
                      <div
                        key={pm.id}
                        className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#00A0DF] transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-extrabold text-sm text-slate-900">{pm.name}</span>
                            <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-200">
                              {pm.badge}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mb-1">Account Title:</div>
                          <div className="text-xs sm:text-sm font-bold text-slate-800 mb-3">{pm.accountTitle}</div>
                          <div className="text-xs text-slate-500 mb-1">Account Number:</div>
                          <div className="font-mono text-sm sm:text-base font-black text-[#00A0DF] tracking-wider mb-2">
                            {pm.accountNumber}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(pm.accountNumber, pm.id)}
                          className="mt-3 w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:border-[#00A0DF] text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Copy size={13} />
                          <span>{copiedAccount === pm.id ? 'Copied Number!' : 'Copy Account Number'}</span>
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2.5">
                    <Clock size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Note:</strong> After transferring PKR 3,900 from your Easypaisa/JazzCash/Bank app, take a screenshot of the payment receipt and click continue.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="w-full py-3.5 px-6 rounded-xl text-sm font-black text-white bg-[#00A0DF] hover:bg-[#008ec7] flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <span>I Have Paid &bull; Upload Proof</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              )}

              {/* STEP 3: Proof Submission */}
              {step === 3 && (
                <form onSubmit={handleFinalSubmit} className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                      Step 3: Upload Receipt &amp; Activate
                    </h3>
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="text-xs text-[#00A0DF] font-bold hover:underline"
                    >
                      &larr; Back
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Payment Method Used *</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF]"
                    >
                      <option>Easypaisa</option>
                      <option>JazzCash</option>
                      <option>Meezan Bank Ltd</option>
                      <option>SadaPay / NayaPay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Transaction ID (TID / Ref #) (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 19283746501"
                      value={formData.transactionId}
                      onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Payment Screenshot / Receipt Image (Optional)
                    </label>
                    <label className="border-2 border-dashed border-slate-300 hover:border-[#00A0DF] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 transition-colors">
                      <Upload size={24} className="text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-slate-700">
                        {receiptFile ? receiptFile.name : 'Click to select screenshot image (PNG, JPG)'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && setReceiptFile(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-xl text-sm sm:text-base font-black text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all"
                  >
                    <ShieldCheck size={18} />
                    <span>{submitting ? 'Submitting to Backend...' : 'Submit Application & Activate LMS'}</span>
                  </button>
                </form>
              )}
            </>
          )}

        </div>

      </div>

      <Footer />
    </div>
  );
}
