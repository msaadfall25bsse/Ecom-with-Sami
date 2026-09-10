'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, PlayCircle } from 'lucide-react';
import { defaultCmsContent } from '@/utils/cmsStore';

export interface CurriculumLessonItem {
  id?: string;
  title: string;
}

export interface CurriculumModuleItem {
  id?: string | number;
  title: string;
  lessons?: (string | CurriculumLessonItem)[];
}

export type ModuleItem = CurriculumModuleItem;

export function CurriculumAccordion({ modules: customModules }: { modules?: CurriculumModuleItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [moduleList, setModuleList] = useState<CurriculumModuleItem[]>(
    Array.isArray(customModules)
      ? customModules
      : defaultCmsContent.homepage_curriculum?.modules || []
  );

  useEffect(() => {
    if (Array.isArray(customModules)) {
      setModuleList(customModules);
    }
  }, [customModules]);

  // Also listen to local CMS update event
  useEffect(() => {
    const handleCmsUpdate = () => {
      try {
        const stored = localStorage.getItem('sami_cms_content');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed?.homepage_curriculum?.modules)) {
            setModuleList(parsed.homepage_curriculum.modules);
          }
        }
      } catch {}
    };
    window.addEventListener('sami_cms_updated', handleCmsUpdate);
    return () => window.removeEventListener('sami_cms_updated', handleCmsUpdate);
  }, []);

  if (!moduleList || moduleList.length === 0) {
    return null;
  }

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
            {/* Accordion Summary / Header (FAQ style) */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer select-none"
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 flex-1 pr-1">
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#00A0DF]/10 text-[#00A0DF] font-black text-xs sm:text-sm flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                  {moduleNumber}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-[13px] sm:text-base font-bold sm:font-black text-slate-900 leading-snug break-words">
                    {module.title}
                  </h3>
                  {lessons.length > 0 && (
                    <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                      <span>{lessons.length} Lectures Included</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 self-center">
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

            {/* Accordion Body (Only Lectures, No Descriptions, No Timers) */}
            {isOpen && (
              <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-gray-100 space-y-2 animate-in fade-in-50 duration-150">
                {lessons.length > 0 ? (
                  <ul className="space-y-2 pt-1">
                    {lessons.map((lesson: any, lIdx: number) => {
                      const lessonTitle = typeof lesson === 'string' ? lesson : (lesson.title || String(lesson));
                      return (
                        <li
                          key={lIdx}
                          className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-gray-100 flex items-start sm:items-center gap-2.5 text-xs sm:text-sm hover:bg-slate-100/80 transition-colors"
                        >
                          <PlayCircle size={16} className="text-[#00A0DF] flex-shrink-0 mt-0.5 sm:mt-0" />
                          <span className="text-slate-800 font-bold leading-snug break-words flex-1">
                            {lessonTitle}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">
                    Lectures will be uploaded soon.
                  </p>
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
