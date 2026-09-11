'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Flame, ShieldCheck, Zap, Users } from 'lucide-react';

export interface CountdownTimerProps {
  timerAnchorTime?: number;
  serverRemainingSeconds?: number;
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
  timerHeading?: string;
  seatsLeftText?: string;
  seatsFilledPercent?: number;
  trustBadge1?: string;
  trustBadge2?: string;
  trustBadge3?: string;
}

export function CountdownTimer({
  timerAnchorTime,
  serverRemainingSeconds,
  initialHours = 2,
  initialMinutes = 27,
  initialSeconds = 38,
  timerHeading = 'Discount Offer Ends In:',
  seatsLeftText = 'Only 12 seats left at this price',
  seatsFilledPercent = 88,
  trustBadge1 = 'Lifetime Access',
  trustBadge2 = 'Instant LMS Activation',
  trustBadge3 = '1,200+ Students'
}: CountdownTimerProps) {
  const configuredDuration = Math.max(
    1,
    Number(initialHours || 0) * 3600 + Number(initialMinutes || 0) * 60 + Number(initialSeconds || 0)
  );

  const calculateGlobalRemaining = () => {
    const anchor = Number(timerAnchorTime) || 1773100000000;
    const now = Date.now();
    const elapsed = Math.max(0, Math.floor((now - anchor) / 1000)) % configuredDuration;
    return Math.max(0, configuredDuration - elapsed);
  };

  const baseRemaining = typeof serverRemainingSeconds === 'number' && serverRemainingSeconds >= 0
    ? serverRemainingSeconds
    : calculateGlobalRemaining();

  const [totalSeconds, setTotalSeconds] = useState<number>(baseRemaining);

  useEffect(() => {
    // Record mount moment via high-resolution monotonic timer (100% immune to phone clock differences!)
    const mountTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const startSeconds = baseRemaining;

    const tick = () => {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const elapsedSinceMount = Math.floor((now - mountTime) / 1000);
      let remaining = startSeconds - elapsedSinceMount;

      // Auto-restart loop when reaching 00:00:00
      if (remaining <= 0) {
        const overtime = Math.abs(remaining);
        remaining = configuredDuration - (overtime % configuredDuration);
      }

      setTotalSeconds(Math.max(0, remaining));
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [baseRemaining, configuredDuration]);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  const fillPercent = Math.min(100, Math.max(0, Number(seatsFilledPercent) || 88));

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl border-2 border-[#00A0DF]/30 shadow-xl shadow-[#00A0DF]/10 p-4 sm:p-6 md:p-7 mb-8">
      {/* Clock Header Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-5">
        <div className="flex items-center gap-2 text-red-600 font-extrabold text-sm sm:text-base">
          <Clock size={20} className="animate-pulse flex-shrink-0" />
          <span>{timerHeading}</span>
        </div>

        {/* 3 Box Digital Countdown Timer */}
        <div className="flex items-center gap-1.5 xs:gap-2">
          {[
            { val: pad(hours), lbl: 'HOURS' },
            { val: pad(minutes), lbl: 'MINS' },
            { val: pad(seconds), lbl: 'SECS' }
          ].map((unit, idx) => (
            <div
              key={idx}
              className="bg-slate-950 text-white rounded-xl py-1.5 xs:py-2 px-2.5 xs:px-3.5 sm:px-4 text-center min-w-[52px] xs:min-w-[60px] sm:min-w-[68px] border border-[#00A0DF]/30 shadow-inner"
            >
              <div 
                className="text-lg xs:text-xl sm:text-2xl font-black font-mono text-[#00A0DF] leading-none"
                suppressHydrationWarning
              >
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
            <span>{seatsLeftText}</span>
          </span>
          <span className="text-[#00A0DF] font-black">{fillPercent}% Filled</span>
        </div>
        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            style={{ width: `${fillPercent}%` }}
            className="h-full bg-gradient-to-r from-[#00A0DF] to-red-500 rounded-full animate-pulse transition-all duration-500"
          />
        </div>
      </div>

      {/* 3 Trust Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 text-xs sm:text-sm font-bold text-slate-700 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <ShieldCheck size={18} className="text-emerald-500 flex-shrink-0" />
          <span>{trustBadge1}</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Zap size={18} className="text-[#00A0DF] flex-shrink-0" />
          <span>{trustBadge2}</span>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <Users size={18} className="text-amber-500 flex-shrink-0" />
          <span>{trustBadge3}</span>
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
