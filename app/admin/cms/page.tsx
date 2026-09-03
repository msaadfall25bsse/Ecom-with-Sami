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
  ShieldCheck,
  BookOpen,
  Edit,
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { defaultCmsContent, CmsContentSchema } from '@/utils/cmsStore';
import { Module, Supplier } from '@/utils/db';

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<'lms' | 'hero' | 'stats' | 'bonuses' | 'reviews' | 'faqs' | 'payments' | 'contact' | 'pixels'>('lms');
  const [cmsData, setCmsData] = useState<CmsContentSchema>(defaultCmsContent);
  const [modules, setModules] = useState<Module[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [openModuleId, setOpenModuleId] = useState<number>(1);

  // New Module modal/form state
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [newModTitle, setNewModTitle] = useState('');
  const [newModDuration, setNewModDuration] = useState('45 mins');
  const [newModDesc, setNewModDesc] = useState('');

  // New Lesson form state
  const [addingLessonForModuleId, setAddingLessonForModuleId] = useState<number | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonDuration, setNewLessonDuration] = useState('15:00');
  const [newLessonUrl, setNewLessonUrl] = useState('https://www.youtube.com/embed/dQw4w9WgXcQ');

  // New Supplier form state
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [newSup, setNewSup] = useState({
    name: '',
    category: 'General Wholesale',
    country: 'UAE',
    city: 'Dubai',
    phone: '+971501234567',
    minOrder: '1 Piece',
    deliveryTime: '24-48 Hours',
    notes: 'Verified local supplier.'
  });

  // Review & FAQ form states
  const [newReview, setNewReview] = useState({
    name: '',
    city: '',
    sales: 'AED 3,500',
    orders: '18 Orders',
    quote: '',
    market: 'UAE Market',
    initials: ''
  });
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });

  const fetchAllData = () => {
    // Immediate hydrate from localStorage for fastest render
    try {
      const cached = localStorage.getItem('sami_cms_content');
      if (cached) setCmsData(JSON.parse(cached));
    } catch (e) {}

    const timestamp = Date.now();

    // Dynamic fetch CMS directly from DB with zero cache
    fetch(`/api/cms/content?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.content) {
          setCmsData(res.content);
          try {
            localStorage.setItem('sami_cms_content', JSON.stringify(res.content));
          } catch (e) {}
        }
      })
      .catch((err) => console.error('CMS fetch notice:', err));

    // Dynamic fetch LMS Modules with zero cache
    fetch(`/api/lms/modules?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.modules) setModules(res.modules);
      })
      .catch((err) => console.error('Modules fetch notice:', err));

    // Dynamic fetch Suppliers with zero cache
    fetch(`/api/lms/suppliers?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.suppliers) setSuppliers(res.suppliers);
      })
      .catch((err) => console.error('Suppliers fetch notice:', err));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleSaveAll = async () => {
    setLoading(true);
    setSavedSuccess(false);
    try {
      // 1. Immediately persist to localStorage for instant reflection
      try {
        localStorage.setItem('sami_cms_content', JSON.stringify(cmsData));
        window.dispatchEvent(new Event('sami_cms_updated'));
      } catch (e) {}

      // 2. Persist to server API & trigger revalidation across entire site
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify(cmsData)
      });
      const json = await res.json();
      if (json.success) {
        setSavedSuccess(true);
        if (json.content) {
          setCmsData(json.content);
          try {
            localStorage.setItem('sami_cms_content', JSON.stringify(json.content));
            window.dispatchEvent(new Event('sami_cms_updated'));
          } catch (e) {}
        }
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Save error:', e);
    } finally {
      setLoading(false);
    }
  };

  // --- LMS MODULE ACTIONS ---
  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModTitle) return;

    try {
      const res = await fetch('/api/lms/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_MODULE',
          module: {
            title: newModTitle,
            duration: newModDuration,
            description: newModDesc,
            lessons: []
          }
        })
      });
      const data = await res.json();
      if (data.success && data.modules) {
        setModules(data.modules);
        setShowAddModuleModal(false);
        setNewModTitle('');
        setNewModDesc('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (!confirm('Are you sure you want to delete this module and all its lectures?')) return;
    try {
      const res = await fetch(`/api/lms/modules?moduleId=${moduleId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.modules) setModules(data.modules);
    } catch (e) {
      console.error(e);
    }
  };

  // --- LMS LESSON ACTIONS ---
  const handleAddLesson = async (moduleId: number) => {
    if (!newLessonTitle) return;

    try {
      const res = await fetch('/api/lms/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_LESSON',
          moduleId,
          lesson: {
            title: newLessonTitle,
            duration: newLessonDuration,
            videoUrl: newLessonUrl
          }
        })
      });
      const data = await res.json();
      if (data.success && data.modules) {
        setModules(data.modules);
        setAddingLessonForModuleId(null);
        setNewLessonTitle('');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLesson = async (moduleId: number, lessonId: string) => {
    try {
      const res = await fetch(`/api/lms/modules?moduleId=${moduleId}&lessonId=${lessonId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.modules) setModules(data.modules);
    } catch (e) {
      console.error(e);
    }
  };

  // --- SUPPLIER ACTIONS ---
  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSup.name) return;

    try {
      const res = await fetch('/api/lms/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSup)
      });
      const data = await res.json();
      if (data.success && data.suppliers) {
        setSuppliers(data.suppliers);
        setShowAddSupplierModal(false);
        setNewSup({ name: '', category: 'General Wholesale', country: 'UAE', city: 'Dubai', phone: '+971501234567', minOrder: '1 Piece', deliveryTime: '24-48 Hours', notes: 'Verified local supplier.' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      const res = await fetch(`/api/lms/suppliers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success && data.suppliers) setSuppliers(data.suppliers);
    } catch (e) {
      console.error(e);
    }
  };

  // --- REVIEWS & FAQS ACTIONS ---
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

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white pb-20 font-sans selection:bg-[#00A0DF] selection:text-white">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-[#111827] border-b border-white/10 px-3 sm:px-8 py-3 sm:py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-300 transition-colors border border-white/5"
              title="Back to Admin Dashboard"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-sm sm:text-lg font-black text-white flex items-center gap-1.5 sm:gap-2">
                <span>Website &amp; LMS CMS</span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold bg-[#00A0DF]/20 text-[#00A0DF] px-2 py-0.5 rounded-full border border-[#00A0DF]/40">
                  Live
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden xs:block">Add modules, upload videos &amp; edit prices</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/lms"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors border border-white/5"
            >
              <Eye size={14} />
              <span>Preview LMS</span>
            </Link>

            <button
              onClick={handleSaveAll}
              disabled={loading}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] disabled:opacity-50 text-white text-xs sm:text-sm font-black shadow-lg shadow-[#00A0DF]/30 transition-all active:scale-95"
            >
              <Save size={15} />
              <span>{loading ? 'Saving...' : 'Save All'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Save Success Toast */}
      {savedSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-bottom">
          <CheckCircle2 size={16} />
          <span>Website &amp; LMS content updated!</span>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="bg-[#111827] border-b border-white/10 px-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-bold">
          {[
            { id: 'lms', label: '📚 LMS Modules', icon: BookOpen },
            { id: 'hero', label: '📣 Hero Section', icon: Sparkles },
            { id: 'stats', label: '⏱ Urgency Stats', icon: Clock },
            { id: 'bonuses', label: '🎁 6 Bonuses', icon: Gift },
            { id: 'reviews', label: '🏆 Reviews', icon: Award },
            { id: 'faqs', label: '❓ FAQs', icon: HelpCircle },
            { id: 'payments', label: '💳 Accounts', icon: CreditCard },
            { id: 'contact', label: '📱 Contact', icon: Globe2 },
            { id: 'pixels', label: '🎯 Pixels', icon: Settings }
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl whitespace-nowrap text-xs transition-colors ${
                  activeTab === t.id
                    ? 'bg-[#00A0DF] text-white shadow-md shadow-[#00A0DF]/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon size={14} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main CMS Tab Views */}
      <main className="max-w-7xl mx-auto px-3 sm:px-8 pt-6 sm:pt-8">
        
        {/* ========================================================================= */}
        {/* TAB 0: LMS COURSE & CURRICULUM MANAGER */}
        {/* ========================================================================= */}
        {activeTab === 'lms' && (
          <div className="space-y-6 sm:space-y-8">
            
            {/* Top LMS Action Bar */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
              <div>
                <h2 className="text-base sm:text-2xl font-black text-white flex items-center gap-2">
                  <BookOpen size={20} className="text-[#00A0DF]" />
                  <span>LMS Course &amp; Video Lectures Manager</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add new modules, attach video URLs (YouTube / MP4), reorder, and manage wholesale suppliers.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowAddModuleModal(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-black text-white shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                >
                  <Plus size={15} />
                  <span>Add Module</span>
                </button>
                <button
                  onClick={() => setShowAddSupplierModal(true)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 sm:py-2.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-xs font-black text-white shadow-lg shadow-[#00A0DF]/20 transition-all active:scale-95"
                >
                  <Plus size={15} />
                  <span>Add Supplier</span>
                </button>
              </div>
            </div>

            {/* Modules Accordion List */}
            <div className="space-y-3 sm:space-y-4">
              {modules.map((m) => {
                const isOpen = openModuleId === m.id;

                return (
                  <div key={m.id} className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl">
                    {/* Module Header Bar */}
                    <div className="p-3.5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 bg-[#111827]">
                      <button
                        onClick={() => setOpenModuleId(isOpen ? 0 : m.id)}
                        className="flex-1 flex items-center gap-2.5 sm:gap-3 text-left w-full"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#00A0DF]/20 text-[#00A0DF] flex items-center justify-center font-black text-xs sm:text-sm flex-shrink-0 border border-[#00A0DF]/30">
                          {m.id}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-base font-bold text-white truncate">{m.title}</h3>
                          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">{m.duration} &bull; {m.lessons.length} Lectures</p>
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-center">
                        <button
                          onClick={() => setAddingLessonForModuleId(m.id)}
                          className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#00A0DF] text-slate-200 hover:text-white text-xs font-bold transition-colors flex items-center gap-1 border border-white/5 active:scale-95"
                        >
                          <Plus size={12} />
                          <span>Add Lecture</span>
                        </button>
                        <button
                          onClick={() => handleDeleteModule(m.id)}
                          className="p-1.5 sm:p-2 rounded-xl bg-red-500/10 hover:bg-red-500/30 text-red-400 transition-colors"
                          title="Delete Module"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => setOpenModuleId(isOpen ? 0 : m.id)}
                          className="p-1.5 text-slate-400 hover:text-white"
                        >
                          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Module Expanded Content */}
                    {isOpen && (
                      <div className="p-3.5 sm:p-6 bg-[#0B0F19] border-t border-white/10 space-y-3 sm:space-y-4">
                        
                        {/* Add Lecture Sub-Form */}
                        {addingLessonForModuleId === m.id && (
                          <div className="bg-[#111827] border border-[#00A0DF]/40 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
                            <h4 className="text-xs font-bold text-[#00A0DF] uppercase">Add New Lecture to {m.title}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              <input
                                type="text"
                                placeholder="Lecture Title (e.g. 1.4 Setting Up Business Manager)"
                                value={newLessonTitle}
                                onChange={(e) => setNewLessonTitle(e.target.value)}
                                className="sm:col-span-2 px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                              />
                              <input
                                type="text"
                                placeholder="Duration (e.g. 18:30)"
                                value={newLessonDuration}
                                onChange={(e) => setNewLessonDuration(e.target.value)}
                                className="px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                              />
                            </div>
                            <input
                              type="text"
                              placeholder="Video Embed URL (YouTube embed or direct MP4 URL)"
                              value={newLessonUrl}
                              onChange={(e) => setNewLessonUrl(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                            />
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => setAddingLessonForModuleId(null)}
                                className="px-3 py-1.5 rounded-xl bg-slate-800 text-xs text-slate-400"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleAddLesson(m.id)}
                                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-black text-white active:scale-95"
                              >
                                Save Lecture Video
                              </button>
                            </div>
                          </div>
                        )}

                        {/* List of Lectures */}
                        <div className="space-y-2">
                          {m.lessons.map((l) => (
                            <div
                              key={l.id}
                              className="bg-[#111827] border border-white/5 rounded-xl sm:rounded-2xl p-3 flex items-center justify-between gap-2.5 text-xs"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                                  <Video size={14} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-bold text-white truncate">{l.title}</div>
                                  <div className="text-[10px] text-slate-400 font-mono truncate">{l.videoUrl}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-slate-400 text-[11px]">{l.duration}</span>
                                <button
                                  onClick={() => handleDeleteLesson(m.id, l.id)}
                                  className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                                  title="Delete Lecture"
                                >
                                  <Trash2 size={13} />
                                </button>
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

            {/* Wholesale Suppliers Management Box */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-lg font-bold text-white">Verified GCC Wholesale Suppliers</h3>
                  <p className="text-xs text-slate-400">Manage supplier cards shown to active LMS students</p>
                </div>
                <button
                  onClick={() => setShowAddSupplierModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-xs font-black text-white active:scale-95"
                >
                  + Add Supplier
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {suppliers.map((s) => (
                  <div key={s.id} className="bg-[#0B0F19] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#00A0DF]">{s.country} &bull; {s.city}</span>
                        <button
                          onClick={() => handleDeleteSupplier(s.id)}
                          className="text-slate-500 hover:text-red-400 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{s.name}</h4>
                      <p className="text-xs text-slate-400 mb-2">{s.category}</p>
                      <div className="text-[11px] text-slate-300 font-mono">Phone: {s.phone}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: ANNOUNCEMENTS & HERO SECTION */}
        {/* ========================================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 sm:space-y-6">
              <h3 className="text-sm sm:text-lg font-bold text-white">Hero Headings &amp; Video</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Top Badge Text</label>
                  <input
                    type="text"
                    value={cmsData.hero.badge}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, badge: e.target.value } })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Highlighted Text (Blue)</label>
                  <input
                    type="text"
                    value={cmsData.hero.title_highlight}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, title_highlight: e.target.value } })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Main Headline</label>
                <input
                  type="text"
                  value={cmsData.hero.title_line1}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, title_line1: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Sub-headline Description</label>
                <textarea
                  rows={2}
                  value={cmsData.hero.subtitle}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, subtitle: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none"
                />
              </div>

              <div className="bg-[#0B0F19] border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#00A0DF] mb-2.5">
                  <Video size={16} />
                  <span>Preview Video Settings</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Video Embed URL</label>
                    <input
                      type="text"
                      value={cmsData.hero.video_url}
                      onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, video_url: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Overlay Title</label>
                    <input
                      type="text"
                      value={cmsData.hero.video_title}
                      onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, video_title: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Discount Price</label>
                  <input
                    type="text"
                    value={cmsData.hero.current_price}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, current_price: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm font-black text-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Original Price</label>
                  <input
                    type="text"
                    value={cmsData.hero.original_price}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, original_price: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-red-400 line-through focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={cmsData.hero.cta_text}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, cta_text: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: STATS */}
        {/* ========================================================================= */}
        {activeTab === 'stats' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4">
            <h3 className="text-sm sm:text-lg font-bold text-white">4 Platform Stats Row</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Box 1: Training Hours</label>
                <input
                  type="text"
                  value={cmsData.stats.training_hours}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, training_hours: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Box 2: Lectures Count</label>
                <input
                  type="text"
                  value={cmsData.stats.lectures_count}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, lectures_count: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Box 3: Access Type</label>
                <input
                  type="text"
                  value={cmsData.stats.access_type}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, access_type: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Box 4: Mentorship Type</label>
                <input
                  type="text"
                  value={cmsData.stats.mentorship_type}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, mentorship_type: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BONUSES */}
        {/* ========================================================================= */}
        {activeTab === 'bonuses' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4">
            <h3 className="text-sm sm:text-lg font-bold text-white">6 Power Bonuses Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {cmsData.bonuses.items.map((b, idx) => (
                <div key={idx} className="bg-[#0B0F19] border border-white/5 rounded-2xl p-3.5 sm:p-4 space-y-2.5">
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
                      className="px-2.5 py-1 rounded-lg bg-[#111827] border border-white/10 text-xs font-bold text-amber-400 focus:outline-none"
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
                    className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                  <textarea
                    rows={2}
                    value={b.desc}
                    onChange={(e) => {
                      const updated = [...cmsData.bonuses.items];
                      updated[idx].desc = e.target.value;
                      setCmsData({ ...cmsData, bonuses: { ...cmsData.bonuses, items: updated } });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-[#00A0DF] resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: REVIEWS */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-3">
              <h3 className="text-sm sm:text-lg font-bold text-white">Add New Student Review</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Name (e.g. Raza Ali)"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                />
                <input
                  type="text"
                  placeholder="City (e.g. Lahore)"
                  value={newReview.city}
                  onChange={(e) => setNewReview({ ...newReview, city: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                />
                <input
                  type="text"
                  placeholder="Sales (e.g. AED 4,850)"
                  value={newReview.sales}
                  onChange={(e) => setNewReview({ ...newReview, sales: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-emerald-400 font-bold focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Review quote..."
                value={newReview.quote}
                onChange={(e) => setNewReview({ ...newReview, quote: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF] resize-none"
              />
              <button
                onClick={handleAddReview}
                className="px-4 py-2 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-white text-xs font-bold active:scale-95"
              >
                + Add Testimonial
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cmsData.testimonials.map((t, idx) => (
                <div key={idx} className="bg-[#111827] border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <strong className="text-xs sm:text-sm text-white font-bold">{t.name}</strong>
                      <button onClick={() => handleDeleteReview(idx)} className="text-slate-500 hover:text-red-400 p-1">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="text-xs text-emerald-400 font-bold mb-1.5">{t.sales} &bull; {t.orders}</div>
                    <p className="text-xs text-slate-300 italic">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: FAQS */}
        {/* ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-3">
              <h3 className="text-sm sm:text-lg font-bold text-white">Add New FAQ</h3>
              <input
                type="text"
                placeholder="Question..."
                value={newFaq.q}
                onChange={(e) => setNewFaq({ ...newFaq, q: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
              />
              <textarea
                rows={2}
                placeholder="Answer..."
                value={newFaq.a}
                onChange={(e) => setNewFaq({ ...newFaq, a: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF] resize-none"
              />
              <button
                onClick={handleAddFaq}
                className="px-4 py-2 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-white text-xs font-bold active:scale-95"
              >
                + Add FAQ
              </button>
            </div>

            <div className="space-y-2.5">
              {cmsData.faqs.map((f, idx) => (
                <div key={idx} className="bg-[#111827] border border-white/10 rounded-2xl p-3.5 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white mb-1">{f.q}</h4>
                    <p className="text-xs text-slate-400">{f.a}</p>
                  </div>
                  <button onClick={() => handleDeleteFaq(idx)} className="text-slate-500 hover:text-red-400 p-1.5">
                    <Trash2 size={15} />
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
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4">
            <h3 className="text-sm sm:text-lg font-bold text-white">Enrollment Payment Accounts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cmsData.payment_methods.map((pm, idx) => (
                <div key={pm.id} className="bg-[#0B0F19] border border-white/10 rounded-2xl p-4 space-y-2.5">
                  <span className="text-xs sm:text-sm font-bold text-white">{pm.name}</span>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Account Title</label>
                    <input
                      type="text"
                      value={pm.accountTitle}
                      onChange={(e) => {
                        const updated = [...cmsData.payment_methods];
                        updated[idx].accountTitle = e.target.value;
                        setCmsData({ ...cmsData, payment_methods: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={pm.accountNumber}
                      onChange={(e) => {
                        const updated = [...cmsData.payment_methods];
                        updated[idx].accountNumber = e.target.value;
                        setCmsData({ ...cmsData, payment_methods: updated });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs font-mono font-black text-[#00A0DF] focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: CONTACT */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4">
            <h3 className="text-sm sm:text-lg font-bold text-white">Contact &amp; WhatsApp</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">WhatsApp Phone</label>
                <input
                  type="text"
                  value={cmsData.contact.phone}
                  onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, phone: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-emerald-400 font-bold focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Support Email</label>
                <input
                  type="email"
                  value={cmsData.contact.email}
                  onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, email: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: PIXELS */}
        {/* ========================================================================= */}
        {activeTab === 'pixels' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4">
            <h3 className="text-sm sm:text-lg font-bold text-white">Tracking Pixels</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Meta Pixel ID</label>
                <input
                  type="text"
                  value={cmsData.pixels.meta_pixel_id}
                  onChange={(e) => setCmsData({ ...cmsData, pixels: { ...cmsData.pixels, meta_pixel_id: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={cmsData.pixels.tiktok_pixel_id}
                  onChange={(e) => setCmsData({ ...cmsData, pixels: { ...cmsData.pixels, tiktok_pixel_id: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Add Module Modal */}
      {showAddModuleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold text-white">Create Course Module</h3>
            <form onSubmit={handleAddModule} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Module Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 12: Snapchat Ads Mastery"
                  value={newModTitle}
                  onChange={(e) => setNewModTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Duration</label>
                <input
                  type="text"
                  placeholder="e.g. 50 mins"
                  value={newModDuration}
                  onChange={(e) => setNewModDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="What will students learn?"
                  value={newModDesc}
                  onChange={(e) => setNewModDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModuleModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-black text-white active:scale-95"
                >
                  Create Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto">
            <h3 className="text-base sm:text-lg font-bold text-white">Add Wholesale Supplier</h3>
            <form onSubmit={handleAddSupplier} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Supplier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dubai Watches Hub"
                  value={newSup.name}
                  onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Country</label>
                  <select
                    value={newSup.country}
                    onChange={(e) => setNewSup({ ...newSup, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="UAE">UAE</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Dubai / Riyadh"
                    value={newSup.city}
                    onChange={(e) => setNewSup({ ...newSup, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">WhatsApp Phone</label>
                <input
                  type="text"
                  placeholder="+971501234567"
                  value={newSup.phone}
                  onChange={(e) => setNewSup({ ...newSup, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-xs font-black text-white active:scale-95"
                >
                  Add Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
