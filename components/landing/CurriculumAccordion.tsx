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
    <div className="space-y-3">
      {moduleList.map((module, index) => {
        const isOpen = openIndex === index;
        const moduleNumber = String(index + 1).padStart(2, '0');
        const lessons = module.lessons || [];

        return (
          <div
            key={module.id || index}
            className={`rounded-2xl transition-all duration-200 overflow-hidden ${
              isOpen
                ? 'bg-white border-2 border-[#00A0DF] shadow-md'
                : 'bg-white border border-gray-200 hover:border-gray-300'
            }`}
          >
            {/* Accordion Summary / Header */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer select-none"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-[#00A0DF]/10 text-[#00A0DF] font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0">
                  {moduleNumber}
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
                    {module.title}
                  </h3>
                  {lessons.length > 0 && (
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 mt-0.5">
                      <span>{lessons.length} Lessons</span>
                      {module.duration && (
                        <>
                          <span>&bull;</span>
                          <span>{module.duration}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-bold text-[#00A0DF] hidden sm:inline">
                  {isOpen ? 'Close' : 'View'}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                    isOpen
                      ? 'bg-[#00A0DF]/15 text-[#00A0DF] rotate-180'
                      : 'bg-gray-100 text-slate-600'
                  }`}
                >
                  <ChevronDown size={15} />
                </div>
              </div>
            </button>

            {/* Accordion Body */}
            {isOpen && (
              <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-gray-100 space-y-3 animate-in fade-in-50 duration-150">
                {module.description && (
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-3.5 rounded-xl border border-gray-100">
                    {module.description}
                  </p>
                )}

                {lessons.length > 0 && (
                  <ul className="space-y-2 pt-1">
                    {lessons.map((lesson: any, lIdx: number) => (
                      <li
                        key={lesson.id || lIdx}
                        className="p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-center justify-between gap-3 text-xs sm:text-sm hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <PlayCircle size={16} className="text-[#00A0DF] flex-shrink-0" />
                          <span className="text-slate-800 font-bold truncate">
                            {lesson.title}
                          </span>
                        </div>
                        {lesson.duration && (
                          <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-gray-200 flex-shrink-0">
                            {lesson.duration}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default CurriculumAccordion;
