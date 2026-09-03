'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, PlayCircle, Clock, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { initialModules } from '@/utils/db';

export interface ModuleItem {
  id?: number;
  module_number?: string;
  title: string;
  duration?: string;
  description: string;
  lesson_count?: number;
  lessons?: { id?: string; title: string; duration?: string; videoUrl?: string }[];
}

export function CurriculumAccordion({ modules: initialCustomModules }: { modules?: any[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [moduleList, setModuleList] = useState<any[]>(initialCustomModules || initialModules);

  useEffect(() => {
    if (initialCustomModules && initialCustomModules.length > 0) {
      setModuleList(initialCustomModules);
      return;
    }
    const timestamp = Date.now();
    fetch(`/api/lms/modules?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.modules && res.modules.length > 0) {
          setModuleList(res.modules);
        }
      })
      .catch(() => {});
  }, [initialCustomModules]);

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {moduleList.map((module, index) => {
        const isOpen = openIndex === index;
        const moduleNumber = String(index + 1).padStart(2, '0');
        const lessons = module.lessons || [];

        return (
          <div
            key={module.id || index}
            className={`rounded-2xl sm:rounded-3xl transition-all duration-300 overflow-hidden ${
              isOpen
                ? 'bg-slate-900/95 border-2 border-[#00A0DF] shadow-2xl shadow-[#00A0DF]/15'
                : 'bg-white border border-slate-200/80 hover:border-[#00A0DF]/50 hover:shadow-lg shadow-sm'
            }`}
          >
            {/* Accordion Header */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full p-4 sm:p-5 md:p-6 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
            >
              <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0 transition-colors ${
                  isOpen
                    ? 'bg-[#00A0DF] text-white shadow-lg shadow-[#00A0DF]/40'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}>
                  {moduleNumber}
                </div>
                <div className="min-w-0">
                  <h3 className={`text-sm sm:text-base md:text-lg font-black truncate transition-colors ${
                    isOpen ? 'text-white' : 'text-slate-900'
                  }`}>
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-2.5 text-[11px] sm:text-xs font-semibold mt-1">
                    <span className={isOpen ? 'text-[#00A0DF]' : 'text-slate-500'}>
                      {lessons.length} Lectures
                    </span>
                    <span className={isOpen ? 'text-slate-600' : 'text-slate-300'}>&bull;</span>
                    <span className={`flex items-center gap-1 ${isOpen ? 'text-slate-300' : 'text-slate-500'}`}>
                      <Clock size={12} className={isOpen ? 'text-[#00A0DF]' : 'text-slate-400'} />
                      {module.duration || '45 mins'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span className={`hidden sm:inline-block text-xs font-black tracking-wide ${
                  isOpen ? 'text-[#00A0DF]' : 'text-slate-400'
                }`}>
                  {isOpen ? 'Close Lessons' : 'View Lessons'}
                </span>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isOpen
                      ? 'bg-[#00A0DF]/20 text-[#00A0DF] rotate-180 border border-[#00A0DF]/40'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  <ChevronDown size={16} />
                </div>
              </div>
            </button>

            {/* Accordion Body */}
            {isOpen && (
              <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-slate-800/80 space-y-3.5 animate-in fade-in-50 duration-200">
                {module.description && (
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/70 p-3.5 sm:p-4 rounded-2xl border border-white/5">
                    {module.description}
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  {lessons.map((lesson: any, lIdx: number) => (
                    <div
                      key={lesson.id || lIdx}
                      className="p-3 sm:p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-[#00A0DF]/40 flex items-center justify-between gap-3 text-xs sm:text-sm transition-all"
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <PlayCircle size={17} className="text-[#00A0DF] flex-shrink-0" />
                        <span className="text-slate-200 font-bold truncate">
                          Lesson {lIdx + 1}: {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-md">
                          {lesson.duration || '12:00'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
