'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  ShieldCheck, 
  CheckCircle2, 
  MessageSquare,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useContactConfig } from '@/utils/contactConfig';

export default function SupportPage() {
  const { email, displayPhone, headOffice, getWhatsAppUrl } = useContactConfig();
  const whatsappUrl = getWhatsAppUrl('Hi Sami Team! I need support regarding my course access / inquiry.');
  
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Course Access / LMS Activation',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#00A0DF] selection:text-white">
      <TopMarquee />
      <Navbar />

      {/* Header Banner */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/40 text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              STUDENT HELP DESK
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 sm:mb-6">
              How Can We <span className="text-[#00A0DF]">Help You Today?</span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-slate-300 leading-relaxed">
              We provide lifetime mentorship and priority student support. Reach us directly via WhatsApp or submit a ticket.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards & Form Grid */}
      <section className="py-12 sm:py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Info Columns */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* WhatsApp Priority Card */}
              <div className="bg-gradient-to-br from-emerald-950 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
                  <Phone size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">WhatsApp Direct Support</h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
                  Fastest response time for instant LMS activation, payment receipts, or ad campaign troubleshooting.
                </p>
                <div className="bg-slate-900/90 rounded-xl p-3.5 mb-6 text-xs text-slate-300 flex items-center justify-between border border-slate-800">
                  <span className="flex items-center gap-2">
                    <Clock size={16} className="text-emerald-400" />
                    <span>Support Hours:</span>
                  </span>
                  <strong className="text-white">9:00 AM &ndash; 5:00 PM Daily</strong>
                </div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-sm font-black text-white bg-[#25D366] hover:bg-[#1faa53] shadow-lg shadow-emerald-500/30 transition-all"
                >
                  <MessageSquare size={18} />
                  <span>Chat on WhatsApp ({displayPhone})</span>
                </a>
              </div>

              {/* Email & Office Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8">
                <h4 className="text-base font-bold text-slate-900 mb-4">Official Contact Details</h4>
                <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="text-[#00A0DF] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Email Address:</strong>
                      <span>{email}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#00A0DF] flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900">Head Office:</strong>
                      <span className="leading-relaxed">{headOffice}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Contact / Ticket Form */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-2">Send Us a Message</h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  Fill out the form below and our support team will respond within 2 to 4 business hours.
                </p>

                {submitted ? (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-6 text-center text-emerald-900">
                    <CheckCircle2 size={36} className="text-emerald-600 mx-auto mb-3" />
                    <h4 className="text-lg font-bold mb-1">Message Received!</h4>
                    <p className="text-xs sm:text-sm text-emerald-700 mb-4">
                      Thank you for contacting us. We will get back to you via email or WhatsApp shortly.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Full Name</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Muhammad Ali"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF] bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">WhatsApp / Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 03001234567"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF] bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. student@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Help Topic</label>
                      <select
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF] bg-white"
                      >
                        <option>Course Access / LMS Activation</option>
                        <option>Payment Verification / Receipt Upload</option>
                        <option>Mentorship & Ad Coaching Inquiry</option>
                        <option>General Questions Before Enrolling</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Message</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Tell us how we can help you..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF] bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl text-sm sm:text-base font-black text-white bg-[#00A0DF] hover:bg-[#008ec7] shadow-lg shadow-[#00A0DF]/30 flex items-center justify-center gap-2 transition-all"
                    >
                      <Send size={16} />
                      <span>Submit Help Request</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
