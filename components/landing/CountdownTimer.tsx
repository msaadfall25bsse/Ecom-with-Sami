'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Flame, ShieldCheck, Zap, Users } from 'lucide-react';

export function CountdownTimer({
  initialHours = 2,
  initialMinutes = 27,
  initialSeconds = 38
}: {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}) {
  const [totalSeconds, setTotalSeconds] = useState(initialHours * 3600 + initialMinutes * 60 + initialSeconds);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTotalSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border-2 border-[#00A0DF]/30 shadow-xl shadow-[#00A0DF]/10 p-4 sm:p-6 md:p-7 mb-8">
      {/* Clock Header Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-5">
        <div className="flex items-center gap-2 text-red-600 font-extrabold text-sm sm:text-base">
          <Clock size={20} className="animate-pulse flex-shrink-0" />
          <span>Discount Offer Ends In:</span>
        </div>

        {/* 3 Box Digital Countdown Timer */}
        <div className="flex items-center gap-1.5 xs:gap-2">
          {[
            { val: mounted ? pad(hours) : pad(initialHours), lbl: 'HOURS' },
            { val: mounted ? pad(minutes) : pad(initialMinutes), lbl: 'MINS' },
            { val: mounted ? pad(seconds) : pad(initialSeconds), lbl: 'SECS' }
          ].map((unit, idx) => (
            <div
              key={idx}
              className="bg-slate-950 text-white rounded-xl py-1.5 xs:py-2 px-2.5 xs:px-3.5 sm:px-4 text-center min-w-[52px] xs:min-w-[60px] sm:min-w-[68px] border border-[#00A0DF]/30 shadow-inner"
            >
              <div className="text-lg xs:text-xl sm:text-2xl font-black font-mono text-[#00A0DF] leading-none">
                {unit.val}
              </div>
              <div className="text-[8px] xs:text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider mt-1">
                {unit.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Seats Left Progress Bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
          <span className="flex items-center gap-1.5 text-red-600">
            <Flame size={16} className="text-red-500 flex-shrink-0" />
            <span>Only 12 seats left at this price</span>
          </span>
          <span className="text-[#00A0DF]">88% Filled</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div className="h-full w-[88%] bg-gradient-to-r from-[#00A0DF] to-red-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* 3 Trust Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 text-xs sm:text-sm font-bold text-slate-700 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0" />
          <span>Lifetime Access</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Zap size={18} className="text-[#00A0DF] flex-shrink-0" />
          <span>Instant LMS Activation</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Users size={18} className="text-amber-500 flex-shrink-0" />
          <span>9,700+ Students</span>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
