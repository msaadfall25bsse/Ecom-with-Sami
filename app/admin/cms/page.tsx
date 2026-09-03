'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Save, 
  Sparkles, 
  CheckCircle2, 
  Video, 
  Tag, 
  Clock, 
  HelpCircle, 
  CreditCard, 
  Gift, 
  Globe2, 
  Award, 
  Trash2, 
  Plus, 
  ArrowLeft,
  Eye,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { defaultCmsContent, CmsContentSchema } from '@/utils/cmsStore';

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'stats' | 'bonuses' | 'reviews' | 'faqs' | 'payments' | 'contact' | 'pixels'>('hero');
  const [cmsData, setCmsData] = useState<CmsContentSchema>(defaultCmsContent);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New review input state
  const [newReview, setNewReview] = useState({
    name: '',
    city: '',
    sales: 'AED 3,500',
    orders: '18 Orders',
    quote: '',
    market: 'UAE Market',
    initials: ''
  });

  // New FAQ input state
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });

  useEffect(() => {
    fetch('/api/cms/content')
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.content) {
          setCmsData(res.content);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveAll = async () => {
    setLoading(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cmsData)
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = () => {
    if (!newReview.name || !newReview.quote) return;
    const initials = newReview.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST';
    const updated = [{ ...newReview, initials }, ...cmsData.testimonials];
    setCmsData({ ...cmsData, testimonials: updated });
    setNewReview({ name: '', city: '', sales: 'AED 3,500', orders: '18 Orders', quote: '', market: 'UAE Market', initials: '' });
  };

  const handleDeleteReview = (index: number) => {
    const updated = cmsData.testimonials.filter((_, i) => i !== index);
    setCmsData({ ...cmsData, testimonials: updated });
  };

  const handleAddFaq = () => {
    if (!newFaq.q || !newFaq.a) return;
    const updated = [...cmsData.faqs, newFaq];
    setCmsData({ ...cmsData, faqs: updated });
    setNewFaq({ q: '', a: '' });
  };

  const handleDeleteFaq = (index: number) => {
    const updated = cmsData.faqs.filter((_, i) => i !== index);
    setCmsData({ ...cmsData, faqs: updated });
  };

  const handleAddMarqueeItem = () => {
    const updated = [...cmsData.marquee.items, '🔥 New Promotional Announcement'];
    setCmsData({ ...cmsData, marquee: { ...cmsData.marquee, items: updated } });
  };

  const handleRemoveMarqueeItem = (idx: number) => {
    const updated = cmsData.marquee.items.filter((_, i) => i !== idx);
    setCmsData({ ...cmsData, marquee: { ...cmsData.marquee, items: updated } });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Back to Admin Dashboard"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>Website Content &amp; Media CMS</span>
                <span className="text-[10px] uppercase font-bold bg-[#00A0DF]/20 text-[#00A0DF] px-2 py-0.5 rounded-full border border-[#00A0DF]/40">
                  Live Control
                </span>
              </h1>
              <p className="text-xs text-slate-400">Edit every section, text, video, and price dynamically with zero errors</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
            >
              <Eye size={14} />
              <span>Preview Storefront</span>
            </Link>

            <button
              onClick={handleSaveAll}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] disabled:opacity-50 text-white text-xs sm:text-sm font-black shadow-lg shadow-[#00A0DF]/30 transition-all"
            >
              <Save size={16} />
              <span>{loading ? 'Saving...' : 'Save All Changes'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Save Success Toast */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-bottom">
          <CheckCircle2 size={18} />
          <span>Website content updated successfully!</span>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-bold">
          {[
            { id: 'hero', label: '📣 Announcements & Hero', icon: Sparkles },
            { id: 'stats', label: '⏱ Urgency & Stats', icon: Clock },
            { id: 'bonuses', label: '🎁 6 Power Bonuses', icon: Gift },
            { id: 'reviews', label: '🏆 Reviews & Proof', icon: Award },
            { id: 'faqs', label: '❓ FAQs Manager', icon: HelpCircle },
            { id: 'payments', label: '💳 Payment Accounts', icon: CreditCard },
            { id: 'contact', label: '📱 Contact & WhatsApp', icon: Globe2 },
            { id: 'pixels', label: '🎯 Tracking Pixels', icon: Settings }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                  activeTab === t.id
                    ? 'bg-[#00A0DF] text-white shadow-md shadow-[#00A0DF]/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={15} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main CMS Tab Views */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: ANNOUNCEMENTS & HERO SECTION */}
        {/* ========================================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-8">
            
            {/* Marquee Ticker Manager */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Top Promotional Marquee Ticker</h3>
                  <p className="text-xs text-slate-400">Rotating announcement bar shown at the very top of the website</p>
                </div>
                <button
                  onClick={handleAddMarqueeItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-[#00A0DF] border border-slate-700"
                >
                  <Plus size={14} />
                  <span>Add Announcement</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {cmsData.marquee.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => {
                        const updated = [...cmsData.marquee.items];
                        updated[idx] = e.target.value;
                        setCmsData({ ...cmsData, marquee: { ...cmsData.marquee, items: updated } });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                    <button
                      onClick={() => handleRemoveMarqueeItem(idx)}
                      className="p-2.5 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Section Content */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-bold text-white mb-6">Hero Section Headings &amp; Video Embed</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Top Badge Text</label>
                  <input
                    type="text"
                    value={cmsData.hero.badge}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, badge: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Highlighted Text (Blue Color)</label>
                  <input
                    type="text"
                    value={cmsData.hero.title_highlight}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, title_highlight: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Main Headline</label>
                <input
                  type="text"
                  value={cmsData.hero.title_line1}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, title_line1: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Sub-headline Description</label>
                <textarea
                  rows={2}
                  value={cmsData.hero.subtitle}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, subtitle: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none"
                />
              </div>

              {/* Video Embed URL Settings */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 text-sm font-bold text-[#00A0DF] mb-3">
                  <Video size={18} />
                  <span>Preview Video Settings</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Video Embed URL (YouTube / MP4)</label>
                    <input
                      type="text"
                      value={cmsData.hero.video_url}
                      onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, video_url: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Video Card Overlay Title</label>
                    <input
                      type="text"
                      value={cmsData.hero.video_title}
                      onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, video_title: e.target.value } })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & CTA Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Current Discount Price</label>
                  <input
                    type="text"
                    value={cmsData.hero.current_price}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, current_price: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-black text-emerald-400 focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Original / Strike Price</label>
                  <input
                    type="text"
                    value={cmsData.hero.original_price}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, original_price: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-red-400 line-through focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Button CTA Text</label>
                  <input
                    type="text"
                    value={cmsData.hero.cta_text}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, cta_text: e.target.value } })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: URGENCY & STATS ROW */}
        {/* ========================================================================= */}
        {activeTab === 'stats' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-white">4 Platform Stats Row &amp; Urgency Counters</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Box 1: Training Hours</label>
                <input
                  type="text"
                  value={cmsData.stats.training_hours}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, training_hours: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Box 2: Lectures Count</label>
                <input
                  type="text"
                  value={cmsData.stats.lectures_count}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, lectures_count: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Box 3: Access Type</label>
                <input
                  type="text"
                  value={cmsData.stats.access_type}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, access_type: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Box 4: Mentorship Type</label>
                <input
                  type="text"
                  value={cmsData.stats.mentorship_type}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, mentorship_type: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Urgency Seats Left Count</label>
              <input
                type="number"
                value={cmsData.hero.seats_left}
                onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, seats_left: parseInt(e.target.value, 10) || 12 } })}
                className="w-full max-w-xs px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-amber-400 font-bold focus:outline-none focus:border-[#00A0DF]"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: 6 FREE BONUSES STACK */}
        {/* ========================================================================= */}
        {activeTab === 'bonuses' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">6 Power Bonuses Management</h3>
                <p className="text-xs text-slate-400">Manage titles, descriptions, and estimated Rs value for each free bonus</p>
              </div>
              <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                Total Value: {cmsData.bonuses.highlight_value}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cmsData.bonuses.items.map((b, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00A0DF]">Bonus #{idx + 1}</span>
                    <input
                      type="text"
                      value={b.value}
                      onChange={(e) => {
                        const updated = [...cmsData.bonuses.items];
                        updated[idx].value = e.target.value;
                        setCmsData({ ...cmsData, bonuses: { ...cmsData.bonuses, items: updated } });
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-bold text-amber-400 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    value={b.title}
                    onChange={(e) => {
                      const updated = [...cmsData.bonuses.items];
                      updated[idx].title = e.target.value;
                      setCmsData({ ...cmsData, bonuses: { ...cmsData.bonuses, items: updated } });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm font-bold text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                  <textarea
                    rows={2}
                    value={b.desc}
                    onChange={(e) => {
                      const updated = [...cmsData.bonuses.items];
                      updated[idx].desc = e.target.value;
                      setCmsData({ ...cmsData, bonuses: { ...cmsData.bonuses, items: updated } });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-[#00A0DF] resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: REVIEWS & STUDENT PROOF */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            
            {/* Add New Review Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4">Add New Student Testimonial Proof</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Student Name (e.g. Raza Ali)"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
                <input
                  type="text"
                  placeholder="City (e.g. Lahore)"
                  value={newReview.city}
                  onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
                <input
                  type="text"
                  placeholder="Earnings Proof (e.g. AED 4,850 in 6 Days)"
                  value={newReview.sales}
                  onChange={(e) => setNewReview({ ...newReview, sales: e.target.value })}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-emerald-400 font-bold focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Student quote / review message..."
                value={newReview.quote}
                onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] mb-4 resize-none"
              />
              <button
                onClick={handleAddReview}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-white text-xs font-bold shadow-md"
              >
                <Plus size={16} />
                <span>Add Testimonial to Wall</span>
              </button>
            </div>

            {/* List of Active Reviews */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cmsData.testimonials.map((t, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <strong className="text-sm text-white font-bold">{t.name}</strong>
                      <button
                        onClick={() => handleDeleteReview(idx)}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="text-xs text-emerald-400 font-bold mb-2">{t.sales} &bull; {t.orders}</div>
                    <p className="text-xs text-slate-300 italic leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-3 pt-3 border-t border-slate-800">{t.city} &bull; {t.market}</div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: FAQS MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            
            {/* Add FAQ Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4">Add New FAQ Accordion</h3>
              <input
                type="text"
                placeholder="Question (e.g. Is this suitable for beginners?)"
                value={newFaq.q}
                onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] mb-3"
              />
              <textarea
                rows={2}
                placeholder="Detailed Answer..."
                value={newFaq.a}
                onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] mb-4 resize-none"
              />
              <button
                onClick={handleAddFaq}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-white text-xs font-bold"
              >
                <Plus size={16} />
                <span>Add FAQ</span>
              </button>
            </div>

            {/* List of FAQs */}
            <div className="space-y-3">
              {cmsData.faqs.map((f, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1.5">{f.q}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{f.a}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFaq(idx)}
                    className="text-slate-500 hover:text-red-400 p-2 rounded-lg bg-slate-950"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: PAYMENT ACCOUNTS */}
        {/* ========================================================================= */}
        {activeTab === 'payments' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Enrollment Payment Accounts</h3>
              <p className="text-xs text-slate-400">Update Easypaisa, JazzCash, Meezan Bank, and SadaPay account details shown on checkout</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cmsData.payment_methods.map((pm, idx) => (
                <div key={pm.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{pm.name}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {pm.badge}
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Account Title</label>
                    <input
                      type="text"
                      value={pm.accountTitle}
                      onChange={(e) => {
                        const updated = [...cmsData.payment_methods];
                        updated[idx].accountTitle = e.target.value;
                        setCmsData({ ...cmsData, payment_methods: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Account Number / Phone</label>
                    <input
                      type="text"
                      value={pm.accountNumber}
                      onChange={(e) => {
                        const updated = [...cmsData.payment_methods];
                        updated[idx].accountNumber = e.target.value;
                        setCmsData({ ...cmsData, payment_methods: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-black text-[#00A0DF] focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: CONTACT & WHATSAPP */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Contact &amp; WhatsApp Settings</h3>
              <p className="text-xs text-slate-400">Phone numbers, support email, and office address shown across header, footer, and widget</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Official WhatsApp Number</label>
                <input
                  type="text"
                  value={cmsData.contact.phone}
                  onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, phone: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-emerald-400 focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Support Email Address</label>
                <input
                  type="email"
                  value={cmsData.contact.email}
                  onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, email: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Head Office Address</label>
              <input
                type="text"
                value={cmsData.contact.headOffice}
                onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, headOffice: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Regional Office Address</label>
              <input
                type="text"
                value={cmsData.contact.regionalOffice}
                onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, regionalOffice: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
              />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: TRACKING PIXELS */}
        {/* ========================================================================= */}
        {activeTab === 'pixels' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">Tracking Pixels &amp; Analytics</h3>
              <p className="text-xs text-slate-400">Configure Meta (Facebook), TikTok, and Google Analytics tracking codes without editing code</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Meta Pixel ID (Facebook)</label>
                <input
                  type="text"
                  placeholder="e.g. 192837465019283"
                  value={cmsData.pixels.meta_pixel_id}
                  onChange={(e) => setCmsData({ ...cmsData, pixels: { ...cmsData.pixels, meta_pixel_id: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">TikTok Pixel ID</label>
                <input
                  type="text"
                  placeholder="e.g. C8X9Y7Z6W5V4"
                  value={cmsData.pixels.tiktok_pixel_id}
                  onChange={(e) => setCmsData({ ...cmsData, pixels: { ...cmsData.pixels, tiktok_pixel_id: e.target.value } })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">Google Analytics 4 (GA4 ID)</label>
              <input
                type="text"
                placeholder="e.g. G-XXXXXXXXXX"
                value={cmsData.pixels.ga4_measurement_id}
                onChange={(e) => setCmsData({ ...cmsData, pixels: { ...cmsData.pixels, ga4_measurement_id: e.target.value } })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-[#00A0DF]"
              />
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
