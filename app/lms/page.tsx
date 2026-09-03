'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ShieldCheck,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { Module, Supplier, ResourceItem } from '@/utils/db';

export default function LmsClassroomPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [openModuleId, setOpenModuleId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'video' | 'suppliers' | 'resources' | 'mentorship'>('video');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(res => {
        if (res.authenticated && res.user) {
          setUser(res.user);
          setCompletedLessons(res.user.completedLessons || []);
        } else {
          // Allow demo viewing
          setUser({ name: 'Sami Student', email: 'student@samiecom.com' });
        }
      })
      .catch(() => {
        setUser({ name: 'Sami Student', email: 'student@samiecom.com' });
      });

    // Fetch modules
    fetch('/api/lms/modules')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.modules) {
          setModules(res.modules);
          if (res.modules[0]?.lessons[0]) {
            setActiveLesson(res.modules[0].lessons[0]);
          }
        }
      })
      .finally(() => setLoading(false));

    // Fetch suppliers
    fetch('/api/lms/suppliers')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.suppliers) setSuppliers(res.suppliers);
      });

    // Fetch resources
    fetch('/api/lms/resources')
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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  };

  const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0) || 36;
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      
      {/* Top LMS Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#00A0DF] flex items-center justify-center font-black text-white text-base">
              S
            </div>
            <span className="font-extrabold text-sm sm:text-base text-white tracking-tight hidden sm:inline">
              Ecom With Sami <span className="text-[#00A0DF]">LMS</span>
            </span>
          </Link>
          <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full hidden md:inline">
            Active Student Portal
          </span>
        </div>

        {/* Course Progress Counter */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl px-4 py-1.5 text-xs">
          <span className="text-slate-400">Course Progress:</span>
          <div className="w-28 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#00A0DF] to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <strong className="text-[#00A0DF] font-bold">{progressPercent}%</strong>
          <span className="text-slate-500 text-[11px]">({completedLessons.length}/{totalLessons})</span>
        </div>

        {/* User Account & Logout */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white">{user?.name || 'Student'}</div>
            <div className="text-[10px] text-slate-400">{user?.email || 'student@samiecom.com'}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main LMS Grid */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Side: 11 Modules Curriculum Accordion */}
        <aside className="w-full lg:w-96 bg-slate-900/70 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col overflow-y-auto max-h-[350px] lg:max-h-[calc(100vh-61px)]">
          <div className="p-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10 flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
              <BookOpen size={16} className="text-[#00A0DF]" />
              <span>11 HD Video Modules (36 Lectures)</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-bold">{completedLessons.length} Completed</span>
          </div>

          <div className="p-3 space-y-2">
            {modules.map((m) => {
              const isOpen = openModuleId === m.id;
              const moduleCompletedCount = m.lessons.filter(l => completedLessons.includes(l.id)).length;
              const isAllCompleted = moduleCompletedCount === m.lessons.length && m.lessons.length > 0;

              return (
                <div key={m.id} className="border border-slate-800/80 rounded-2xl bg-slate-950/40 overflow-hidden">
                  <button
                    onClick={() => setOpenModuleId(isOpen ? 0 : m.id)}
                    className="w-full p-3 text-left flex items-center justify-between gap-2 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      {isAllCompleted ? (
                        <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] text-slate-400">
                          {m.id}
                        </div>
                      )}
                      <span className="line-clamp-1">{m.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 flex-shrink-0">
                      <span>{moduleCompletedCount}/{m.lessons.length}</span>
                      {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="p-2 space-y-1 bg-slate-950/90 border-t border-slate-800/60">
                      {m.lessons.map((lesson) => {
                        const isDone = completedLessons.includes(lesson.id);
                        const isCurrent = activeLesson?.id === lesson.id;

                        return (
                          <div
                            key={lesson.id}
                            onClick={() => {
                              setActiveLesson(lesson);
                              setActiveTab('video');
                            }}
                            className={`p-2.5 rounded-xl cursor-pointer flex items-center justify-between gap-2 text-xs transition-colors ${
                              isCurrent
                                ? 'bg-[#00A0DF] text-white font-bold'
                                : 'text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLessonComplete(lesson.id);
                                }}
                                className="flex-shrink-0 text-slate-400 hover:text-emerald-400"
                              >
                                {isDone ? (
                                  <CheckCircle2 size={15} className="text-emerald-400" />
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

        {/* Right Stage: Video Player & Tabs */}
        <main className="flex-1 flex flex-col overflow-y-auto max-h-[calc(100vh-61px)]">
          
          {/* LMS Tab Navigation */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto text-xs font-bold no-scrollbar">
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'video' ? 'bg-[#00A0DF] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Play size={14} />
              <span>Video Classroom</span>
            </button>
            <button
              onClick={() => setActiveTab('suppliers')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'suppliers' ? 'bg-[#00A0DF] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShoppingBag size={14} />
              <span>Verified GCC Suppliers</span>
            </button>
            <button
              onClick={() => setActiveTab('resources')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'resources' ? 'bg-[#00A0DF] text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Download size={14} />
              <span>Bonus Downloads</span>
            </button>
            <button
              onClick={() => setActiveTab('mentorship')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'mentorship' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:bg-slate-800'
              }`}
            >
              <MessageSquare size={14} />
              <span>Ask Sami on WhatsApp</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            
            {/* TAB 1: VIDEO PLAYER */}
            {activeTab === 'video' && (
              <div className="max-w-5xl mx-auto space-y-6">
                
                {/* Responsive HD Video Container */}
                <div className="relative bg-black rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl aspect-video">
                  <iframe
                    src={activeLesson?.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                    title={activeLesson?.title || 'Lesson Video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                {/* Lesson Header Row */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#00A0DF] block mb-1">
                      CURRENT LESSON
                    </span>
                    <h1 className="text-base sm:text-xl md:text-2xl font-black text-white">
                      {activeLesson?.title || '1.1 GCC Dropshipping Overview'}
                    </h1>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1"><Clock size={13} /> {activeLesson?.duration || '12 mins'}</span>
                      <span>&bull;</span>
                      <span>1080p Full HD</span>
                    </div>
                  </div>

                  <button
                    onClick={() => activeLesson && toggleLessonComplete(activeLesson.id)}
                    className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all shadow-lg ${
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

                {/* Lesson Action Notes */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 text-xs sm:text-sm text-slate-300 space-y-3">
                  <h3 className="font-bold text-white text-sm">Key Action Items for this Lecture:</h3>
                  <ul className="list-disc list-inside space-y-1.5 text-slate-400">
                    <li>Take notes in your dropshipping ledger on winning criteria.</li>
                    <li>Follow the screen clicks in real-time on your own Shopify store / TikTok Ads manager.</li>
                    <li>If you encounter ad account verification questions, use the direct WhatsApp link above.</li>
                  </ul>
                </div>

              </div>
            )}

            {/* TAB 2: SUPPLIERS DIRECTORY */}
            {activeTab === 'suppliers' && (
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">Direct Verified GCC Suppliers</h2>
                    <p className="text-xs text-slate-400">Direct wholesale warehouse contacts in Dubai, Sharjah, Riyadh &amp; Jeddah</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                    4 Verified Warehouses
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {suppliers.map((s) => (
                    <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#00A0DF] transition-all">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-[#00A0DF]">{s.country} &bull; {s.city}</span>
                          <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            COD Enabled
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mb-2">{s.name}</h3>
                        <p className="text-xs text-slate-400 mb-4">{s.category} &bull; {s.notes}</p>
                        
                        <div className="space-y-1.5 text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
                          <div><strong>Min Order:</strong> {s.minOrder}</div>
                          <div><strong>Delivery:</strong> {s.deliveryTime}</div>
                          <div><strong>Phone:</strong> <span className="font-mono text-[#00A0DF]">{s.phone}</span></div>
                        </div>
                      </div>

                      <a
                        href={s.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-[#25D366] hover:bg-[#1faa53] flex items-center justify-center gap-2 transition-all"
                      >
                        <MessageSquare size={14} />
                        <span>Chat on WhatsApp with Supplier</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: BONUS DOWNLOADS */}
            {activeTab === 'resources' && (
              <div className="max-w-5xl mx-auto space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">6 Power Bonus Resources Hub</h2>
                  <p className="text-xs text-slate-400">Download your free tools, templates, themes, and calculators</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resources.map((r) => (
                    <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold bg-[#00A0DF]/10 text-[#00A0DF] px-2.5 py-0.5 rounded-full border border-[#00A0DF]/30">
                            {r.type} &bull; {r.size}
                          </span>
                          <span className="text-xs font-bold text-amber-400">Value: {r.value}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white mb-2">{r.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">{r.description}</p>
                      </div>

                      <a
                        href="/apps/WithSamiLMS_Windows_1.0.13.exe"
                        download
                        className="py-2.5 px-4 rounded-xl text-xs font-black text-white bg-slate-800 hover:bg-[#00A0DF] flex items-center justify-center gap-2 transition-colors border border-slate-700"
                      >
                        <Download size={14} />
                        <span>Download Resource File</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: WHATSAPP MENTORSHIP */}
            {activeTab === 'mentorship' && (
              <div className="max-w-2xl mx-auto bg-gradient-to-br from-emerald-950 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 text-center text-white shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                  <Phone size={30} />
                </div>
                <h2 className="text-2xl font-black mb-2">Direct WhatsApp Mentorship Desk</h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
                  Have questions about ad accounts, pixel verification, or supplier negotiations? Mentor Sami is available daily from 9:00 AM to 5:00 PM.
                </p>
                <div className="bg-slate-900/90 rounded-2xl p-4 max-w-sm mx-auto mb-6 text-xs text-slate-300 border border-slate-800">
                  <div>Official Support Line: <strong className="text-emerald-400">03158960026</strong></div>
                  <div className="text-[11px] text-slate-400 mt-1">Average response time: 5–15 minutes</div>
                </div>
                <a
                  href="https://wa.me/923158960026?text=Assalam%20o%20Alaikum%20Sami!%20I%20am%20enrolled%20in%20your%20LMS%20course%20and%20need%20mentorship%20help."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-black text-white bg-[#25D366] hover:bg-[#1faa53] shadow-lg shadow-emerald-500/30 transition-all"
                >
                  <MessageSquare size={18} />
                  <span>Open WhatsApp Direct Chat</span>
                </a>
              </div>
            )}

          </div>
        </main>

      </div>
    </div>
  );
}
