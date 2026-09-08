'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, AlertTriangle } from 'lucide-react';

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global application error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#0B0F19] border border-white/10 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-[#00A0DF]/10 border border-[#00A0DF]/30 flex items-center justify-center mx-auto text-[#00A0DF]">
          <AlertTriangle size={32} />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Ecom With Sami
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            A temporary display issue occurred while loading this page. Click below to refresh.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full lwa-btn py-3.5 px-6 rounded-xl font-black text-sm flex items-center justify-center gap-2"
          >
            <RefreshCw size={16} />
            <span>Reload Page</span>
          </button>

          <Link
            href="/"
            className="w-full block py-3 px-6 rounded-xl font-bold text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <span className="flex items-center justify-center gap-1.5">
              <ArrowLeft size={14} />
              <span>Back to Homepage</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
