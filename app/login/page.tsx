'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer, TopMarquee } from '@/components/layout';
import { 
  GraduationCap, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle,
  Laptop, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { useContactConfig } from '@/utils/contactConfig';

export default function LoginPage() {
  const { getWhatsAppUrl } = useContactConfig();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = '/lms';
      } else {
        setError(data.message || 'Invalid credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Server connection error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-[#00A0DF] selection:text-white">
      <TopMarquee />
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="max-w-md mx-auto">
          
          {/* Main Login Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl mb-8">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#00A0DF]/10 text-[#00A0DF] flex items-center justify-center mx-auto mb-3">
                <GraduationCap size={28} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Student LMS Login</h1>
              <p className="text-xs text-slate-500 mt-1">Access your 11 video modules &amp; supplier directory</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-xl p-3 mb-4 text-center flex items-center justify-center gap-2">
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="student@samiecom.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Portal Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#00A0DF]" />
                  <span>Remember me</span>
                </label>
                <a
                  href={getWhatsAppUrl('Hi Sami! I forgot my LMS password. Can you please reset it for me?')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00A0DF] font-bold hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl text-sm font-black text-white bg-[#00A0DF] hover:bg-[#008ec7] disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#00A0DF]/30 transition-all"
              >
                <span>{loading ? 'Authenticating with Backend...' : 'Access My Classroom'}</span>
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-600">
              Not enrolled yet?{' '}
              <Link href="/enrollment" className="text-[#00A0DF] font-bold hover:underline">
                Enroll Today for PKR 3,900
              </Link>
            </div>
          </div>

          {/* Download Native Apps Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-white text-center">
            <h3 className="text-sm sm:text-base font-bold mb-1">Download Dedicated LMS Applications</h3>
            <p className="text-xs text-slate-400 mb-4">Learn on your Windows Desktop or Android Mobile phone</p>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/apps/WithSamiLMS_Windows_1.0.13.exe"
                download
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-slate-700 transition-colors"
              >
                <Laptop size={14} className="text-[#00A0DF]" />
                <span>Windows .EXE</span>
              </a>
              <a
                href="/apps/WithSamiLMS_v10.apk"
                download
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold border border-slate-700 transition-colors"
              >
                <Smartphone size={14} className="text-emerald-400" />
                <span>Android .APK</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
