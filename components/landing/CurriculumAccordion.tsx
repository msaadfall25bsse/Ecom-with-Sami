'use client';

import React, { useState } from 'react';
import { ChevronDown, PlayCircle, Clock } from 'lucide-react';

export interface ModuleItem {
  id?: number;
  module_number: string;
  title: string;
  description: string;
  lesson_count?: number;
  lessons?: { title: string; duration?: string }[];
}

export function CurriculumAccordion({ modules }: { modules?: ModuleItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultModules: ModuleItem[] = [
    {
      module_number: '01',
      title: 'The Right Mindset to Actually Succeed',
      description: 'The common beginner mistakes that make most people quit, business fundamentals, mental resilience, and daily routine.',
      lessons: [
        { title: 'The common mistakes that make beginners quit early', duration: '12:40' },
        { title: 'Treating your store like a real cash-flow business', duration: '18:15' },
        { title: 'Staying consistent and focused through your first week', duration: '14:20' }
      ]
    },
    {
      module_number: '02',
      title: 'Set Up Your High-Converting Shopify Store (Paid Theme Free)',
      description: 'Theme customization, premium layout, ChatGPT product description prompts, and essential trust elements.',
      lessons: [
        { title: 'Picking a brand name that customers instantly trust', duration: '15:10' },
        { title: 'Installing and customizing your premium Shopify theme', duration: '24:35' },
        { title: 'High-converting product page layout blueprint', duration: '21:50' },
        { title: 'ChatGPT prompts to write persuasive product descriptions', duration: '16:40' }
      ]
    },
    {
      module_number: '03',
      title: 'Finding Winning Products (No Paid Tools Needed)',
      description: 'TikTok Creative Center, Facebook Ad Library, organic spy methods, and viral testing criteria.',
      lessons: [
        { title: 'The 3-point winning product criteria for UAE & KSA', duration: '19:45' },
        { title: 'Spying on profitable ads using TikTok Ad Library', duration: '22:15' },
        { title: 'Finding viral products on Instagram Reels and Pinterest', duration: '17:30' }
      ]
    },
    {
      module_number: '04',
      title: 'Testing Products the Smart Way (Low Budget)',
      description: '3-step validation framework, testing spreadsheets, knowing when to kill or push a product harder.',
      lessons: [
        { title: 'Setting up low-budget product validation campaigns', duration: '18:50' },
        { title: 'Reading initial metrics: CPC, CTR, and Add-to-Carts', duration: '20:10' },
        { title: 'Product validation tracking sheet walkthrough', duration: '14:05' }
      ]
    },
    {
      module_number: '05',
      title: 'Mastering Ads - Facebook & TikTok (Beginner to Pro)',
      description: 'The 3-second hook framework, CBO scaling, Advantage+ campaigns, pixel tracking, and avoiding bans.',
      lessons: [
        { title: 'Setting up Facebook Pixel & TikTok Events API correctly', duration: '26:40' },
        { title: 'The 3-second hook formula for viral video ads', duration: '22:10' },
        { title: 'Scaling profitable ad sets with CBO & ABO budgets', duration: '31:15' }
      ]
    },
    {
      module_number: '06',
      title: 'Order Fulfillment & Local Delivery Setup',
      description: 'Managing Cash on Delivery (COD), order confirmation WhatsApp scripts, reducing returns & RTO rate.',
      lessons: [
        { title: 'Handling Cash on Delivery without cash flow leaks', duration: '16:30' },
        { title: 'WhatsApp order confirmation scripts to cut cancellations', duration: '19:40' },
        { title: 'Packaging, tracking numbers, and fast dispatch setup', duration: '15:20' }
      ]
    },
    {
      module_number: '07',
      title: 'Customer Service & Building Real Brand Loyalty',
      description: 'WhatsApp autoresponders, complaint resolution scripts, and getting 5-star reviews.',
      lessons: [
        { title: 'Setting up automated WhatsApp customer greetings', duration: '13:50' },
        { title: 'Turning an unhappy customer into a repeat buyer', duration: '17:15' }
      ]
    },
    {
      module_number: '08',
      title: 'Scaling from First 10 Orders to 100+ Orders/Day',
      description: 'Horizontal vs vertical scaling, retargeting funnels, bulk supplier inventory negotiations.',
      lessons: [
        { title: 'Horizontal ad scaling without spiking CPA', duration: '25:10' },
        { title: 'Setting up retargeting ads for cart abandoners', duration: '20:45' }
      ]
    },
    {
      module_number: '09',
      title: 'Money Management & Bank Setup',
      description: 'Managing cash flow cycles, currency exchange, tracking net profit in Excel, withdrawing to Pakistan.',
      lessons: [
        { title: 'Withdrawing UAE/KSA profits into Pakistani bank accounts', duration: '18:20' },
        { title: 'Mastering the Cash-on-Delivery cash cycle', duration: '21:00' }
      ]
    },
    {
      module_number: '10',
      title: 'Direct Verified Suppliers Directory (UAE, KSA & Pakistan)',
      description: 'Direct contact phone numbers, warehouse addresses, WhatsApp groups, and zero-risk supplier terms.',
      lessons: [
        { title: 'Verified UAE warehouse suppliers & 2-day delivery contacts', duration: '23:15' },
        { title: 'Verified Saudi Arabia COD supplier directory', duration: '27:40' },
        { title: 'Pakistan local dropshipping supplier contacts', duration: '19:50' }
      ]
    },
    {
      module_number: '11',
      title: 'Scaling to $10k-$50k/Month & Long-Term Brand Building',
      description: 'Transitioning from generic dropshipping to private labeling, custom packaging, and automated teams.',
      lessons: [
        { title: 'Private labeling your winning product with custom boxes', duration: '26:10' },
        { title: 'Hiring virtual assistants (VAs) for order management', duration: '21:30' }
      ]
    }
  ];

  const list = modules && modules.length > 0 ? modules : defaultModules;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3 sm:gap-4">
      {list.map((m, idx) => {
        const isOpen = openIndex === idx;
        const lessonItems = m.lessons && m.lessons.length > 0
          ? m.lessons
          : [
              { title: `${m.title} - Full Masterclass Lecture`, duration: '24:10' },
              { title: 'Practical Screen Walkthrough & Action Steps', duration: '18:35' }
            ];

        return (
          <div
            key={idx}
            className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
              isOpen
                ? 'border-[#00A0DF] bg-white shadow-md'
                : 'border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300'
            }`}
          >
            {/* Accordion Toggle Header */}
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 focus:outline-none"
              aria-expanded={isOpen}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0 transition-colors ${
                    isOpen
                      ? 'bg-[#00A0DF] text-white shadow-md shadow-[#00A0DF]/30'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {m.module_number || String(idx + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-snug mb-1">
                    {m.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>

              <div
                className={`p-1.5 rounded-full flex-shrink-0 transition-transform duration-200 ${
                  isOpen ? 'text-[#00A0DF] rotate-180 bg-[#00A0DF]/10' : 'text-slate-400'
                }`}
              >
                <ChevronDown size={20} />
              </div>
            </button>

            {/* Accordion Content Panel */}
            {isOpen && (
              <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/50">
                <div className="flex flex-col gap-2 pt-2">
                  {lessonItems.map((les, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200/80 text-xs sm:text-sm shadow-sm"
                    >
                      <div className="flex items-center gap-2.5 text-slate-900 font-medium truncate">
                        <PlayCircle size={18} className="text-[#00A0DF] flex-shrink-0" />
                        <span className="truncate">{les.title}</span>
                      </div>
                      {les.duration && (
                        <span className="flex items-center gap-1.5 text-slate-500 text-[11px] sm:text-xs font-semibold flex-shrink-0">
                          <Clock size={13} />
                          <span>{les.duration}</span>
                        </span>
                      )}
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

export default CurriculumAccordion;
