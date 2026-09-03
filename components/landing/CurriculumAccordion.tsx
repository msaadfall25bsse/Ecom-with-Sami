'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, PlayCircle, Clock } from 'lucide-react';
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
    <div className="space-y-3 sm:space-y-4">
      {moduleList.map((module, index) => {
        const isOpen = openIndex === index;
        const moduleNumber = String(index + 1).padStart(2, '0');
        const lessons = module.lessons || [];

        return (
          <div
            key={module.id || index}
            className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'border-[#00A0DF] bg-slate-900 shadow-xl shadow-[#00A0DF]/10'
                : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
            }`}
          >
            {/* Accordion Header */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#00A0DF]/15 text-[#00A0DF] flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0 border border-[#00A0DF]/30">
                  {moduleNumber}
                </span>
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-white truncate">
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] sm:text-xs text-slate-400 mt-0.5">
                    <span>{lessons.length} Lectures</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {module.duration || '45 mins'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="hidden sm:inline-block text-[11px] font-bold text-[#00A0DF]">
                  {isOpen ? 'Hide Lessons' : 'View Lessons'}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#00A0DF]' : ''
                  }`}
                >
                  <ChevronDown size={15} />
                </div>
              </div>
            </button>

            {/* Accordion Body */}
            {isOpen && (
              <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-2 border-t border-slate-800/80 space-y-3">
                {module.description && (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {module.description}
                  </p>
                )}

                <div className="space-y-1.5 pt-1">
                  {lessons.map((lesson: any, lIndex: number) => (
                    <div
                      key={lesson.id || lIndex}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <PlayCircle size={15} className="text-[#00A0DF] flex-shrink-0" />
                        <span className="truncate font-medium">{lesson.title}</span>
                      </div>
                      <span className="text-[10px] sm:text-xs text-slate-400 font-mono flex-shrink-0 pl-2">
                        {lesson.duration || '12:00'}
                      </span>
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
