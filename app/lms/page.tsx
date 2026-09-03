'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  CheckCircle2, 
  BookOpen, 
  Download, 
  Phone, 
  LogOut, 
  ChevronDown, 
  ChevronRight, 
  Award, 
  Sparkles, 
  Clock, 
  FileText, 
  ShoppingBag, 
  MessageSquare, 
  Search, 
  ExternalLink, 
  ChevronLeft, 
  Menu, 
  X, 
  Zap, 
  Globe2, 
  ShieldCheck, 
  Check, 
  ListVideo 
} from 'lucide-react';
import { Module, Supplier, ResourceItem } from '@/utils/db';

export default function LmsClassroomPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [openModuleId, setOpenModuleId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'video' | 'suppliers' | 'resources' | 'mentorship'>('video');
  const [searchQuery, setSearchQuery] = useState('');
  const [supplierCountryFilter, setSupplierCountryFilter] = useState<'ALL' | 'UAE' | 'Saudi Arabia'>('ALL');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    try {
      localStorage.removeItem('sami_student_auth');
      document.cookie = 'sami_student_auth=; path=/; max-age=0';
      document.cookie = 'sami_student_session=; path=/; max-age=0';
    } catch (e) {}
    router.replace('/login');
  };

  useEffect(() => {
    const timestamp = Date.now();

    // 1. Strict Authentication Check
    fetch(`/api/auth/me?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.authenticated && res.user) {
          setUser(res.user);
          setCompletedLessons(res.user.completedLessons || []);
          setAuthChecking(false);
        } else {
          // Check cookie fallback for static hosting
          let foundUser = null;
          try {
            const cookieAuth = document.cookie
              .split('; ')
              .find(row => row.startsWith('sami_student_auth='))
              ?.split('=')[1];
            if (cookieAuth) {
              foundUser = JSON.parse(decodeURIComponent(cookieAuth));
            }
          } catch (e) {}

          if (foundUser && foundUser.email) {
            setUser(foundUser);
            setAuthChecking(false);
          } else {
            router.replace('/login?redirect=/lms');
          }
        }
      })
      .catch(() => {
        router.replace('/login?redirect=/lms');
      });

    // Fetch modules directly from DB
    fetch(`/api/lms/modules?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.modules) {
          setModules(res.modules);
          if (res.modules[0]?.lessons[0]) {
            setActiveLesson(res.modules[0].lessons[0]);
          }
        }
      });

    // Fetch suppliers directly from DB
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
      });

    // Fetch resources directly from DB
    fetch(`/api/lms/resources?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(res => {
        if (res.success && res.resources) setResources(res.resources);
      });
  }, []);

  const toggleLessonComplete = async (lessonId: string) => {
    const isCompleted = completedLessons.includes(lessonId);
    const newStatus = !isCompleted;
    
    let updated = isCompleted 
      ? completedLessons.filter(id => id !== lessonId)
      : [...completedLessons, lessonId];
    
    setCompletedLessons(updated);

    try {
      await fetch('/api/lms/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user?.id || 'demo',
          lessonId,
          completed: newStatus
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Find all lessons in flat list for next/prev navigation
  const allLessons = modules.flatMap(m => m.lessons);
  const currentLessonIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const totalLessons = allLessons.length || 36;
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  const filteredSuppliers = suppliers.filter(s => {
    const matchesCountry = supplierCountryFilter === 'ALL' || s.country === supplierCountryFilter;
    const matchesQuery = s.name.toLowerCase().includes(supplierSearch.toLowerCase()) || 
                         s.category.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                         s.city.toLowerCase().includes(supplierSearch.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col font-sans selection:bg-[#00A0DF] selection:text-white pb-16 lg:pb-0">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#111827] border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 text-[#00A0DF] hover:bg-slate-700 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            {sidebarOpen ? <X size={18} /> : <ListVideo size={18} />}
            <span className="hidden xs:inline">Lectures</span>
          </button>

          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00A0DF] to-[#0077aa] flex items-center justify-center font-black text-white text-sm shadow-md shadow-[#00A0DF]/30">
              S
            </div>
            <div>
              <span className="font-extrabold text-xs sm:text-sm text-white tracking-tight block leading-none">
                Ecom With Sami
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#00A0DF] font-bold uppercase tracking-wider">
                LMS Classroom
              </span>
            </div>
          </Link>
        </div>

        {/* Center Progress Bar */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#0B0F19] border border-white/10 rounded-xl px-2.5 sm:px-4 py-1 text-xs">
          <span className="text-slate-400 font-medium hidden sm:inline">Progress:</span>
          <div className="w-16 sm:w-28 md:w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-[#00A0DF] to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <strong className="text-[#00A0DF] font-bold text-[11px] sm:text-xs">{progressPercent}%</strong>
          <span className="text-slate-500 text-[10px] hidden md:inline">({completedLessons.length}/{totalLessons})</span>
        </div>

        {/* User Profile & Sign Out */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white flex items-center justify-end gap-1">
              <span>{user?.name || 'Student'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-400">{user?.email || 'student@samiecom.com'}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-[#1E293B] hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors border border-white/5"
            title="Log Out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Main LMS Container */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Mobile Backdrop Overlay */}
        {sidebarOpen && (
          <div 
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
          />
        )}

        {/* Left Side: 11 Modules Sidebar Drawer */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-[85vw] max-w-sm sm:w-80 md:w-96 bg-[#111827] border-r border-white/10 flex flex-col transition-transform duration-300 transform ${
            sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          } max-h-screen lg:max-h-[calc(100vh-57px)]`}
        >
          {/* Sidebar Top Search */}
          <div className="p-3 sm:p-4 border-b border-white/10 bg-[#111827] sticky top-0 z-10 space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                <BookOpen size={16} className="text-[#00A0DF]" />
                <span>11 Modules Curriculum</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/20">
                  {completedLessons.length}/{totalLessons} Done
                </span>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-slate-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00A0DF]"
              />
            </div>
          </div>

          {/* Module List Accordion */}
          <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2">
            {modules.map((m) => {
              const isOpen = openModuleId === m.id;
              const moduleCompletedCount = m.lessons.filter(l => completedLessons.includes(l.id)).length;
              const isAllCompleted = moduleCompletedCount === m.lessons.length && m.lessons.length > 0;

              return (
                <div key={m.id} className="border border-white/5 rounded-2xl bg-[#0B0F19]/60 overflow-hidden">
                  <button
                    onClick={() => setOpenModuleId(isOpen ? 0 : m.id)}
                    className="w-full p-2.5 sm:p-3 text-left flex items-center justify-between gap-2 hover:bg-[#1E293B]/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-white min-w-0">
                      {isAllCompleted ? (
                        <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] text-slate-400 flex-shrink-0">
                          {m.id}
                        </div>
                      )}
                      <span className="truncate">{m.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 flex-shrink-0">
                      <span>{moduleCompletedCount}/{m.lessons.length}</span>
                      {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-1 sm:p-1.5 space-y-1 bg-[#111827] border-t border-white/5">
                      {m.lessons
                        .filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((lesson) => {
                          const isDone = completedLessons.includes(lesson.id);
                          const isCurrent = activeLesson?.id === lesson.id;

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => {
                                setActiveLesson(lesson);
                                setActiveTab('video');
                                setSidebarOpen(false);
                              }}
                              className={`p-2 rounded-xl cursor-pointer flex items-center justify-between gap-2 text-xs transition-colors ${
                                isCurrent
                                  ? 'bg-[#00A0DF] text-white font-bold shadow-md shadow-[#00A0DF]/30'
                                  : 'text-slate-300 hover:bg-[#1E293B]'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLessonComplete(lesson.id);
                                  }}
                                  className="flex-shrink-0 text-slate-400 hover:text-emerald-400 p-0.5"
                                >
                                  {isDone ? (
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded border border-slate-500" />
                                  )}
                                </button>
                                <span className="truncate">{lesson.title}</span>
                              </div>
                              <span className="text-[10px] opacity-75 flex-shrink-0">{lesson.duration}</span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Stage: Main Classroom Area */}
        <main className="flex-1 flex flex-col overflow-y-auto max-h-screen lg:max-h-[calc(100vh-57px)]">
          
          {/* Classroom Sub-Tabs */}
          <div className="bg-[#111827] border-b border-white/10 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar sticky top-0 z-20">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-bold">
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs transition-colors ${
                  activeTab === 'video' ? 'bg-[#00A0DF] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Play size={13} />
                <span>Video Lecture</span>
              </button>
              <button
                onClick={() => setActiveTab('suppliers')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs transition-colors ${
                  activeTab === 'suppliers' ? 'bg-[#00A0DF] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ShoppingBag size={13} />
                <span>GCC Suppliers</span>
              </button>
              <button
                onClick={() => setActiveTab('resources')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs transition-colors ${
                  activeTab === 'resources' ? 'bg-[#00A0DF] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Download size={13} />
                <span>Bonuses</span>
              </button>
              <button
                onClick={() => setActiveTab('mentorship')}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl whitespace-nowrap text-xs transition-colors ${
                  activeTab === 'mentorship' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:bg-slate-800'
                }`}
              >
                <MessageSquare size={13} />
                <span>WhatsApp</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              {prevLesson && (
                <button
                  onClick={() => setActiveLesson(prevLesson)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 flex items-center gap-1"
                >
                  <ChevronLeft size={13} /> Prev
                </button>
              )}
              {nextLesson && (
                <button
                  onClick={() => setActiveLesson(nextLesson)}
                  className="px-2.5 py-1 rounded-lg bg-[#00A0DF] hover:bg-[#008ec7] text-xs font-bold text-white flex items-center gap-1"
                >
                  Next <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>

          <div className="p-3 sm:p-6 lg:p-8 flex-1">
            
            {/* ========================================================================= */}
            {/* TAB 1: VIDEO PLAYER */}
            {/* ========================================================================= */}
            {activeTab === 'video' && (
              <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                
                {/* Widescreen Responsive Video Player */}
                <div className="relative bg-black rounded-xl sm:rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl aspect-video w-full">
                  <iframe
                    src={activeLesson?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                    title={activeLesson?.title || 'Lesson Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                {/* Mobile Next / Prev Control Buttons */}
                <div className="flex sm:hidden items-center justify-between gap-2">
                  <button
                    onClick={() => prevLesson && setActiveLesson(prevLesson)}
                    disabled={!prevLesson}
                    className="flex-1 py-2 rounded-xl bg-slate-800 disabled:opacity-30 text-xs font-bold text-slate-300 flex items-center justify-center gap-1"
                  >
                    <ChevronLeft size={14} /> Prev Lecture
                  </button>
                  <button
                    onClick={() => nextLesson && setActiveLesson(nextLesson)}
                    disabled={!nextLesson}
                    className="flex-1 py-2 rounded-xl bg-[#00A0DF] disabled:opacity-30 text-xs font-black text-white flex items-center justify-center gap-1"
                  >
                    Next Lecture <ChevronRight size={14} />
                  </button>
                </div>

                {/* Lecture Control Strip */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#00A0DF] block mb-0.5">
                      CURRENT LECTURE
                    </span>
                    <h1 className="text-sm sm:text-xl md:text-2xl font-black text-white leading-snug">
                      {activeLesson?.title || '1.1 GCC Dropshipping Overview'}
                    </h1>
                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-400 mt-1.5">
                      <span className="flex items-center gap-1"><Clock size={12} /> {activeLesson?.duration || '12 mins'}</span>
                      <span>&bull;</span>
                      <span>1080p Ultra-HD Stream</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => activeLesson && toggleLessonComplete(activeLesson.id)}
                      className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                        activeLesson && completedLessons.includes(activeLesson.id)
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-[#00A0DF] hover:bg-[#008ec7] text-white shadow-[#00A0DF]/30'
                      }`}
                    >
                      <CheckCircle2 size={16} />
                      <span>
                        {activeLesson && completedLessons.includes(activeLesson.id)
                          ? 'Completed (Click to Undo)'
                          : 'Mark as Completed'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Action Blueprint Notes */}
                <div className="bg-[#111827]/80 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                      <Zap size={14} className="text-amber-400" />
                      <span>Action Items for this Lecture:</span>
                    </h3>
                  </div>
                  <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <li>Replicate the screen clicks on your own Shopify admin panel in real-time.</li>
                    <li>Always cross-check with the supplier directory before choosing a winning product.</li>
                    <li>If you encounter TikTok pixel errors or account restrictions, contact mentor Sami on WhatsApp.</li>
                  </ul>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: VERIFIED GCC SUPPLIERS */}
            {/* ========================================================================= */}
            {activeTab === 'suppliers' && (
              <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                
                {/* Header & Filter Controls */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-xl font-black text-white">Verified GCC Wholesale Suppliers</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Warehouses in Dubai, Sharjah, Riyadh &amp; Jeddah</p>
                  </div>

                  <div className="flex items-center gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => setSupplierCountryFilter('ALL')}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        supplierCountryFilter === 'ALL' ? 'bg-[#00A0DF] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      All ({suppliers.length})
                    </button>
                    <button
                      onClick={() => setSupplierCountryFilter('UAE')}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        supplierCountryFilter === 'UAE' ? 'bg-[#00A0DF] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      UAE
                    </button>
                    <button
                      onClick={() => setSupplierCountryFilter('Saudi Arabia')}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        supplierCountryFilter === 'Saudi Arabia' ? 'bg-[#00A0DF] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      KSA
                    </button>
                  </div>
                </div>

                {/* Supplier Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
                  {filteredSuppliers.map((s) => (
                    <div key={s.id} className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col justify-between hover:border-[#00A0DF] transition-all shadow-lg">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#00A0DF]">{s.country} &bull; {s.city}</span>
                          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            COD Enabled
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">{s.name}</h3>
                        <p className="text-xs text-slate-400 mb-3">{s.category} &bull; {s.notes}</p>
                        
                        <div className="space-y-1 text-xs text-slate-300 bg-[#0B0F19] p-2.5 sm:p-3 rounded-xl border border-white/5 mb-3.5">
                          <div><strong>MOQ:</strong> {s.minOrder}</div>
                          <div><strong>Speed:</strong> {s.deliveryTime}</div>
                          <div><strong>Phone:</strong> <span className="font-mono text-[#00A0DF]">{s.phone}</span></div>
                        </div>
                      </div>

                      <a
                        href={s.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 sm:py-3 px-4 rounded-xl text-xs font-black text-white bg-[#25D366] hover:bg-[#1faa53] flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                      >
                        <MessageSquare size={14} />
                        <span>Chat on WhatsApp with Warehouse</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: BONUS DOWNLOADS */}
            {/* ========================================================================= */}
            {activeTab === 'resources' && (
              <div className="max-w-5xl mx-auto space-y-4 sm:space-y-6">
                <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base sm:text-xl font-black text-white">6 Power Bonus Resources Hub</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Download free tools, themes, and calculators</p>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                    Total Value: Rs 30,000+
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {resources.map((r) => (
                    <div key={r.id} className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold bg-[#00A0DF]/10 text-[#00A0DF] px-2.5 py-0.5 rounded-full border border-[#00A0DF]/30">
                            {r.type} &bull; {r.size}
                          </span>
                          <span className="text-xs font-bold text-amber-400">{r.value}</span>
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-white mb-1.5">{r.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3.5">{r.description}</p>
                      </div>

                      <a
                        href="/apps/WithSamiLMS_Windows_1.0.13.exe"
                        download
                        className="py-2.5 px-4 rounded-xl text-xs font-black text-white bg-slate-800 hover:bg-[#00A0DF] flex items-center justify-center gap-2 transition-colors border border-slate-700 active:scale-95"
                      >
                        <Download size={14} />
                        <span>Download Resource File</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: WHATSAPP MENTORSHIP */}
            {/* ========================================================================= */}
            {activeTab === 'mentorship' && (
              <div className="max-w-2xl mx-auto bg-gradient-to-br from-emerald-950/80 to-[#111827] border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-10 text-center text-white shadow-2xl">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3.5 sm:mb-4 border border-emerald-500/40 shadow-xl shadow-emerald-500/20">
                  <Phone size={26} />
                </div>
                <h2 className="text-xl sm:text-2xl font-black mb-2">Direct WhatsApp Mentorship Desk</h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-5 sm:mb-6 leading-relaxed">
                  Have questions about ad accounts, pixel verification, or supplier negotiations? Mentor Sami is available daily from 9:00 AM to 5:00 PM.
                </p>
                <div className="bg-[#0B0F19] rounded-2xl p-3.5 sm:p-4 max-w-sm mx-auto mb-5 sm:mb-6 text-xs text-slate-300 border border-white/10">
                  <div>Official Support Line: <strong className="text-emerald-400">03158960026</strong></div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Average response time: 5–15 minutes</div>
                </div>
                <a
                  href="https://wa.me/923158960026?text=Assalam%20o%20Alaikum%20Sami!%20I%20am%20enrolled%20in%20your%20LMS%20course%20and%20need%20mentorship%20help."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl text-xs sm:text-sm font-black text-white bg-[#25D366] hover:bg-[#1faa53] shadow-lg shadow-emerald-500/30 transition-all active:scale-95"
                >
                  <MessageSquare size={16} />
                  <span>Open WhatsApp Direct Chat</span>
                </a>
              </div>
            )}

          </div>
        </main>

      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#111827] border-t border-white/10 px-2 py-1.5 flex items-center justify-around text-[10px] font-bold">
        <button
          onClick={() => { setSidebarOpen(true); }}
          className="flex flex-col items-center gap-1 p-1 text-slate-400 hover:text-white"
        >
          <BookOpen size={16} className="text-[#00A0DF]" />
          <span>Lectures</span>
        </button>
        <button
          onClick={() => { setActiveTab('video'); setSidebarOpen(false); }}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'video' ? 'text-[#00A0DF]' : 'text-slate-400'}`}
        >
          <Play size={16} />
          <span>Watch</span>
        </button>
        <button
          onClick={() => { setActiveTab('suppliers'); setSidebarOpen(false); }}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'suppliers' ? 'text-[#00A0DF]' : 'text-slate-400'}`}
        >
          <ShoppingBag size={16} />
          <span>Suppliers</span>
        </button>
        <button
          onClick={() => { setActiveTab('resources'); setSidebarOpen(false); }}
          className={`flex flex-col items-center gap-1 p-1 ${activeTab === 'resources' ? 'text-[#00A0DF]' : 'text-slate-400'}`}
        >
          <Download size={16} />
          <span>Bonuses</span>
        </button>
        <a
          href="https://wa.me/923158960026?text=Assalam%20o%20Alaikum%20Sami!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 p-1 text-emerald-400"
        >
          <MessageSquare size={16} />
          <span>WhatsApp</span>
        </a>
      </div>

    </div>
  );
}
