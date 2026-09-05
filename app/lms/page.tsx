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
  ListVideo,
  AlertCircle,
  RotateCcw,
  Lock,
  Cloud,
  Loader2,
  Shield,
  ShieldAlert,
  AlertTriangle,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Module, Supplier, ResourceItem } from '@/utils/db';
import { supabase } from '@/lib/supabase';

export default function LmsClassroomPage() {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [accountRevoked, setAccountRevoked] = useState<string | null>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [openModuleId, setOpenModuleId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'video' | 'suppliers' | 'resources' | 'mentorship'>('video');
  const [searchQuery, setSearchQuery] = useState('');
  const [supplierCountryFilter, setSupplierCountryFilter] = useState<'ALL' | 'UAE' | 'Saudi Arabia'>('ALL');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [watchProgress, setWatchProgress] = useState<{ [lessonId: string]: number }>({});
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [syncFeedback, setSyncFeedback] = useState<string>('');

  const isLoggingOutRef = React.useRef(false);
  const tabIdRef = React.useRef(typeof window !== 'undefined' ? Math.random().toString(36).substring(2, 9) : 'tab');

  // DRM & Anti-Piracy Security System State
  const [showDrmModal, setShowDrmModal] = useState(false);
  const [strikes, setStrikes] = useState<number>(0);
  const [strikeToast, setStrikeToast] = useState<{ strikeCount: number; message: string; visible: boolean } | null>(null);
  const lastStrikeTimeRef = React.useRef<number>(0);

  // Fullscreen Watermark & Anti-Snipping Blur State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const playerContainerRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlayerFullscreen = () => {
    if (!playerContainerRef.current) return;
    const isCurrentlyFs = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
    if (!isCurrentlyFs) {
      const elem: any = playerContainerRef.current;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleSecurityStrike = async (violationType: string) => {
    // Debounce cooldown: At least 3.5 seconds between strikes
    const now = Date.now();
    if (now - lastStrikeTimeRef.current < 3500) return;
    lastStrikeTimeRef.current = now;

    // Instantly neutralize clipboard
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText('⚠️ SAMI LMS CONTENT PROTECTED: Screen capture & recording is strictly prohibited. Security strike recorded.');
      }
    } catch (e) {}

    const nextCount = strikes + 1;
    setStrikes(nextCount);

    setStrikeToast({
      strikeCount: nextCount,
      message: nextCount >= 5 
        ? 'Maximum violations reached (5/5). LMS Access Terminated.'
        : `Screen capture attempt detected (${nextCount}/5 Strikes). DRM Active.`,
      visible: true
    });

    setTimeout(() => {
      setStrikeToast(prev => prev ? { ...prev, visible: false } : null);
    }, 5000);

    // Persist strike to Supabase backend
    try {
      const res = await fetch('/api/lms/security/strike', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          violationType,
          studentId: user?.id,
          email: user?.email
        })
      });
      const data = await res.json();
      if (data && data.strikeCount !== undefined) {
        setStrikes(data.strikeCount);
      }
      if (data && (data.isBlocked || nextCount >= 5)) {
        handleImmediateForceLogout('Account permanently locked due to repeated DRM screenshot/recording violations (5/5 strikes). Contact Mentor Sardar Samiullah on WhatsApp to pay fine and request reactivation.');
      }
    } catch (e) {
      if (nextCount >= 5) {
        handleImmediateForceLogout('Account permanently locked due to repeated DRM screenshot/recording violations (5/5 strikes). Contact Mentor Sardar Samiullah on WhatsApp to pay fine and request reactivation.');
      }
    }
  };

  const getEmbedUrl = (url?: string) => {
    if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    if (url.includes('youtube.com/watch?v=')) {
      const vId = url.split('v=')[1]?.split('&')[0];
      if (vId) return `https://www.youtube.com/embed/${vId}`;
    }
    if (url.includes('youtu.be/')) {
      const vId = url.split('youtu.be/')[1]?.split('?')[0];
      if (vId) return `https://www.youtube.com/embed/${vId}`;
    }
    return url;
  };

  const handleImmediateForceLogout = (reason = 'Your student access has been suspended or rejected by the administrator.') => {
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    // 1. Immediately render Full-Screen Lockout Overlay in 0ms (works universally across iPhone, Android, Desktop)
    setAccountRevoked(reason);
    setUser(null);
    setActiveLesson(null);
    setAuthChecking(true);

    // 2. Explicitly pause & detach all HTML5 media elements (releases iOS Safari Media Session)
    try {
      const mediaElements = document.querySelectorAll('video, audio');
      mediaElements.forEach((m: any) => {
        try {
          m.pause();
          m.removeAttribute('src');
          m.load();
        } catch (e) {}
      });
    } catch (e) {}

    // 3. Clear server auth session
    try {
      fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' }).catch(() => {});
    } catch (e) {}

    // 4. Wipe all authentication cookies with explicit past expires
    try {
      const pastDate = 'Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = `sami_student_auth=; path=/; expires=${pastDate}; max-age=0;`;
      document.cookie = `sami_student_session=; path=/; expires=${pastDate}; max-age=0;`;
      document.cookie = `sami_admin_auth=; path=/; expires=${pastDate}; max-age=0;`;
    } catch (e) {}

    // 5. Wipe client storage caches
    try {
      localStorage.removeItem('sami_student_auth');
      localStorage.removeItem('sami_lms_completed_cache');
      localStorage.removeItem('sami_lms_watch_progress');
    } catch (e) {}

    // 6. Broadcast to all other open tabs (using tabId to prevent Safari loopback)
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const channel = new BroadcastChannel('sami_auth_sync');
        channel.postMessage({ type: 'FORCE_LOGOUT', reason, senderId: tabIdRef.current });
        setTimeout(() => {
          try { channel.close(); } catch (e) {}
        }, 500);
      }
      localStorage.setItem('sami_force_logout_signal', `${Date.now()}_${tabIdRef.current}`);
    } catch (e) {}

    // 7. Multi-strategy Navigation for iOS Safari, Chrome, Android, Mac, Windows
    const targetUrl = `/login?reason=rejected&msg=${encodeURIComponent(reason)}&t=${Date.now()}`;
    if (typeof window !== 'undefined') {
      try {
        window.location.href = targetUrl;
      } catch (e) {
        try {
          window.location.assign(targetUrl);
        } catch (e2) {
          window.location.replace(targetUrl);
        }
      }

      // Fallback timer for iOS Safari
      setTimeout(() => {
        try {
          window.location.href = targetUrl;
        } catch (e) {}
      }, 250);
    } else {
      router.replace('/login?reason=rejected');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    try {
      localStorage.removeItem('sami_student_auth');
      sessionStorage.removeItem('sami_lms_drm_modal_seen');
      document.cookie = 'sami_student_auth=; path=/; max-age=0';
      document.cookie = 'sami_student_session=; path=/; max-age=0';
    } catch (e) {}
    router.replace('/login');
  };

  useEffect(() => {
    // 0. Instant restore from LocalStorage so refresh has 0ms delay and no 0% reset
    try {
      const cached = localStorage.getItem('sami_lms_completed_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCompletedLessons(parsed);
        }
      }
      const watchCache = localStorage.getItem('sami_lms_watch_progress');
      if (watchCache) {
        setWatchProgress(JSON.parse(watchCache));
      }
    } catch (e) {}

    let realtimeChannel: any = null;
    let realtimeEnrChannel: any = null;
    let heartbeatInterval: any = null;
    let bc: BroadcastChannel | null = null;

    // 1. Cross-tab instant synchronization (loopback-protected)
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('sami_auth_sync');
        bc.onmessage = (event) => {
          if (event.data?.senderId === tabIdRef.current) return;
          if (event.data?.type === 'FORCE_LOGOUT') {
            handleImmediateForceLogout(event.data.reason);
          }
        };
      }
    } catch (e) {}

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'sami_force_logout_signal') {
        const sender = (e.newValue || '').split('_')[1];
        if (sender === tabIdRef.current) return;
        handleImmediateForceLogout('Session ended from another tab.');
      } else if (e.key === 'sami_student_auth' && !e.newValue) {
        handleImmediateForceLogout('Session ended from another tab.');
      }
    };
    window.addEventListener('storage', onStorage);

    const timestamp = Date.now();

    // 2. Strict Authentication Check with Supabase Realtime Hookup
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
          if (res.user.strikeCount !== undefined) {
            setStrikes(Number(res.user.strikeCount || 0));
          }
          try {
            if (sessionStorage.getItem('sami_lms_drm_modal_seen') !== 'true') {
              setShowDrmModal(true);
            }
          } catch (e) {}
          const serverLessons: string[] = Array.isArray(res.user.completedLessons) ? res.user.completedLessons : [];
          let localLessons: string[] = [];
          try {
            const userKey = `sami_lms_completed_${res.user.email}`;
            const localSaved = localStorage.getItem(userKey);
            if (localSaved) localLessons = JSON.parse(localSaved);
          } catch (e) {}

          const merged = Array.from(new Set([...serverLessons, ...localLessons]));
          setCompletedLessons(merged);
          try {
            localStorage.setItem('sami_lms_completed_cache', JSON.stringify(merged));
            if (res.user.email) {
              localStorage.setItem(`sami_lms_completed_${res.user.email}`, JSON.stringify(merged));
            }
          } catch (e) {}
          setAuthChecking(false);

          // 3. Supabase Real-Time WebSocket Push (Instant 0ms Logout on Reject/Suspend)
          if (supabase && res.user.id) {
            try {
              realtimeChannel = supabase
                .channel(`lms_auth_user_${res.user.id}`)
                .on(
                  'postgres_changes',
                  {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'students',
                    filter: `id=eq.${res.user.id}`
                  },
                  (payload: any) => {
                    if (payload.new && payload.new.is_active === false) {
                      handleImmediateForceLogout('Your enrollment has been rejected or suspended by the administrator.');
                    }
                  }
                )
                .on(
                  'postgres_changes',
                  {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'students',
                    filter: `id=eq.${res.user.id}`
                  },
                  () => {
                    handleImmediateForceLogout('Your student account has been removed by the administrator.');
                  }
                )
                .subscribe();
            } catch (err) {}
          }

          if (supabase && res.user.email) {
            try {
              const safeEmail = res.user.email.replace(/[^a-zA-Z0-9]/g, '_');
              realtimeEnrChannel = supabase
                .channel(`lms_enr_user_${safeEmail}`)
                .on(
                  'postgres_changes',
                  {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'enrollments',
                    filter: `email=eq.${res.user.email}`
                  },
                  (payload: any) => {
                    if (payload.new && payload.new.status === 'rejected') {
                      handleImmediateForceLogout('Your enrollment has been rejected by the administrator.');
                    }
                  }
                )
                .subscribe();
            } catch (err) {}
          }
        } else {
          // If unauthenticated or rejected, immediately force logout (no cookie bypass)
          handleImmediateForceLogout(res.message || 'Please log in with an active student account.');
        }
      })
      .catch(() => {
        handleImmediateForceLogout('Network connection error verifying credentials.');
      });

    // 4. Fail-Safe Heartbeat (Runs every 10 seconds in the background)
    heartbeatInterval = setInterval(() => {
      fetch(`/api/auth/me?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      })
        .then(r => r.json())
        .then(authRes => {
          if (!authRes.authenticated || !authRes.user) {
            handleImmediateForceLogout(authRes.message || 'Your session has expired or access was revoked.');
          }
        })
        .catch(() => {});
    }, 10000);

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

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('storage', onStorage);
      if (bc) bc.close();
      if (realtimeChannel && supabase) supabase.removeChannel(realtimeChannel);
      if (realtimeEnrChannel && supabase) supabase.removeChannel(realtimeEnrChannel);
    };
  }, []);

  // 1. Fullscreen Change Synchronizer (Keeps Forensic Watermark visible in fullscreen)
  useEffect(() => {
    const handleFsChange = () => {
      const fsElem = document.fullscreenElement || (document as any).webkitFullscreenElement;
      setIsFullscreen(Boolean(fsElem));

      // If native video element entered fullscreen alone, immediately transfer to the container!
      if (fsElem && fsElem === videoRef.current && playerContainerRef.current) {
        if (document.exitFullscreen) {
          document.exitFullscreen().then(() => {
            const elem: any = playerContainerRef.current;
            if (elem?.requestFullscreen) {
              elem.requestFullscreen().catch(() => {});
            } else if (elem?.webkitRequestFullscreen) {
              elem.webkitRequestFullscreen();
            }
          }).catch(() => {});
        }
      }
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  // 2. Window Blur & Anti-Snipping Protection (Pauses & protects video on window blur)
  useEffect(() => {
    const handleBlur = () => {
      if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        videoRef.current.pause();
        setIsWindowBlurred(true);
      }
    };

    const handleFocus = () => {
      // Keep paused so user clicks resume
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 3. Security Sensor: Anti-Piracy Keyboard Traps (PrintScreen, Snipping Tool, DevTools)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. PrintScreen key
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        handleSecurityStrike('PRINT_SCREEN_KEY');
        return;
      }

      // 2. Windows Snipping Tool (Meta + Shift + S or Ctrl + Shift + S)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSecurityStrike('SNIPPING_TOOL_SHORTCUT');
        return;
      }

      // 3. F12 or DevTools inspect (Ctrl + Shift + I/J/C)
      if (e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key))) {
        e.preventDefault();
        handleSecurityStrike('DEVTOOLS_INSPECT');
        return;
      }

      // 4. View Source (Ctrl + U)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
        handleSecurityStrike('VIEW_SOURCE');
        return;
      }

      // 5. Print Page (Ctrl + P)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        handleSecurityStrike('PRINT_PAGE');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [strikes, user]);

  const isAdmin = Boolean(
    user?.role === 'SUPER_ADMIN' || 
    user?.role === 'ADMIN' || 
    user?.email === 'admin@samiecom.com'
  );

  const markLessonComplete = async (lessonId: string, forceStatus?: boolean) => {
    const isCompleted = completedLessons.includes(lessonId);
    const newStatus = forceStatus !== undefined ? forceStatus : !isCompleted;
    if (isCompleted === newStatus) return;

    const updated = newStatus 
      ? Array.from(new Set([...completedLessons, lessonId]))
      : completedLessons.filter(id => id !== lessonId);
    
    setCompletedLessons(updated);
    setSyncStatus('syncing');
    setSyncFeedback('⚡ Syncing to Cloud Database...');

    // Save to localStorage immediately
    try {
      localStorage.setItem('sami_lms_completed_cache', JSON.stringify(updated));
      if (user?.email) {
        localStorage.setItem(`sami_lms_completed_${user.email}`, JSON.stringify(updated));
      }
    } catch (e) {}

    try {
      const res = await fetch('/api/lms/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user?.id || 'demo',
          email: user?.email || '',
          lessonId,
          completed: newStatus
        })
      });
      const data = await res.json();
      if (data.success) {
        setSyncStatus('synced');
        setSyncFeedback(newStatus ? '✓ Saved to Supabase Cloud' : 'Progress updated');
        setTimeout(() => setSyncFeedback(''), 4000);
      } else {
        setSyncStatus('idle');
      }
    } catch (e) {
      console.error('Progress sync error:', e);
      setSyncStatus('idle');
    }
  };

  const toggleLessonComplete = (lessonId: string) => {
    markLessonComplete(lessonId);
  };

  // Find all lessons in flat list for next/prev navigation
  const allLessons = modules.flatMap(m => m.lessons);
  const currentLessonIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const totalLessons = allLessons.length || 36;
  const progressPercent = Math.round((completedLessons.length / totalLessons) * 100);

  const isCurrentDone = activeLesson ? completedLessons.includes(activeLesson.id) : false;
  const currentLessonWatchPct = activeLesson 
    ? (isCurrentDone ? 100 : (watchProgress[activeLesson.id] || 0)) 
    : 0;

  const filteredSuppliers = suppliers.filter(s => {
    const matchesCountry = supplierCountryFilter === 'ALL' || s.country === supplierCountryFilter;
    const matchesQuery = s.name.toLowerCase().includes(supplierSearch.toLowerCase()) || 
                         s.category.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                         s.city.toLowerCase().includes(supplierSearch.toLowerCase());
    return matchesCountry && matchesQuery;
  });

  if (accountRevoked) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B0F19] text-white flex flex-col items-center justify-center p-4 sm:p-6 text-center animate-in fade-in duration-200">
        <div className="w-20 h-20 rounded-3xl bg-red-500/10 border-2 border-red-500/30 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-500/20">
          <Lock size={40} className="text-red-400" />
        </div>

        <div className="max-w-md space-y-3">
          <span className="inline-block bg-red-500/20 text-red-400 border border-red-500/30 text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full">
            LMS ACCESS SUSPENDED
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Account Revoked
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {accountRevoked}
          </p>
          <p className="text-[11px] text-slate-500">
            If you already submitted your enrollment fee, please verify your payment proof slip with Mentor Sardar Samiullah on WhatsApp.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="/login?reason=rejected"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              Go to Login Page
            </a>
            <a
              href="https://wa.me/923330093269?text=Assalam-o-Alaikum%20Mentor%20Sami!%20My%20LMS%20account%20was%20marked%20as%20suspended.%20Please%20verify%20my%20proof."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <MessageSquare size={14} />
              <span>Contact on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

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
          {syncStatus === 'syncing' && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold animate-pulse ml-0.5">
              <Loader2 size={10} className="animate-spin" />
              <span className="hidden xs:inline">Syncing...</span>
            </span>
          )}
          {syncStatus === 'synced' && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold ml-0.5" title="Permanently saved to Supabase Cloud Database">
              <Cloud size={11} />
              <span className="hidden xs:inline">Cloud Saved</span>
            </span>
          )}
        </div>

        {/* DRM Security Status Indicator Badge */}
        <button
          onClick={() => setShowDrmModal(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-[#00A0DF] hover:text-white border border-[#00A0DF]/30 text-[11px] font-bold transition-all shadow-sm"
          title="Click to view Anti-Piracy DRM Policy"
        >
          <Shield size={12} className="text-[#00A0DF]" />
          <span>DRM Active</span>
          {strikes > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
              {strikes}/5
            </span>
          )}
        </button>

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
                                    const lessonWatch = watchProgress[lesson.id] || 0;
                                    if (isAdmin || isDone || lessonWatch >= 90) {
                                      toggleLessonComplete(lesson.id);
                                    } else {
                                      setSyncFeedback('🔒 Please watch 90% of the video to complete this lecture');
                                      setTimeout(() => setSyncFeedback(''), 4000);
                                    }
                                  }}
                                  title={isDone ? 'Completed' : isAdmin ? 'Admin override toggle' : 'Watch 90% to unlock completion'}
                                  className="flex-shrink-0 text-slate-400 hover:text-emerald-400 p-0.5"
                                >
                                  {isDone ? (
                                    <CheckCircle2 size={14} className="text-emerald-400" />
                                  ) : (
                                    <div className="w-3.5 h-3.5 rounded border border-slate-500 hover:border-[#00A0DF]" />
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
          
          {/* LMS Top DRM & Anti-Piracy Announcement Bar */}
          <div className="bg-gradient-to-r from-red-950/40 via-[#111827] to-slate-900 border-b border-red-500/20 px-3 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs z-20 shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider flex-shrink-0 animate-pulse">
                <ShieldAlert size={12} />
                <span>DRM ACTIVE</span>
              </span>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate font-medium">
                <strong className="text-white">Content Protected:</strong> Lectures are watermarked with your Student ID &amp; IP. Screen recording or screenshot capture is strictly monitored. 5 strikes lead to immediate ban and reactivation fine.
              </p>
            </div>
            <button
              onClick={() => setShowDrmModal(true)}
              className="text-[10px] sm:text-[11px] font-bold text-[#00A0DF] hover:underline whitespace-nowrap flex-shrink-0 flex items-center gap-1"
            >
              <span>View Policy</span>
              <ChevronRight size={12} />
            </button>
          </div>

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
                <div
                  ref={playerContainerRef}
                  onDoubleClick={togglePlayerFullscreen}
                  className={`relative bg-black rounded-xl sm:rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl w-full flex items-center justify-center transition-all ${
                    isFullscreen 
                      ? '!fixed !inset-0 !z-[9999] !w-screen !h-screen !rounded-none !border-0 !max-w-none !aspect-auto bg-black' 
                      : 'aspect-video'
                  }`}
                >
                  {activeLesson?.videoUrl && (
                    activeLesson.videoUrl.match(/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i) ||
                    activeLesson.videoUrl.includes('supabase.co/storage') ||
                    activeLesson.videoUrl.startsWith('/uploads/') ||
                    activeLesson.videoUrl.startsWith('/api/videos/')
                  ) ? (
                    <div className="relative w-full h-full flex items-center justify-center bg-black">
                      <video
                        ref={videoRef}
                        key={activeLesson.id + activeLesson.videoUrl}
                        controls
                        controlsList="nodownload nofullscreen"
                        playsInline
                        preload="metadata"
                        onError={() => setVideoLoadError(true)}
                        onLoadedData={() => setVideoLoadError(false)}
                        onLoadedMetadata={(e) => {
                          setVideoLoadError(false);
                          try {
                            const savedPos = localStorage.getItem(`sami_lms_pos_${activeLesson.id}`);
                            if (savedPos && Number(savedPos) > 5 && Number(savedPos) < e.currentTarget.duration - 10) {
                              e.currentTarget.currentTime = Number(savedPos);
                            }
                          } catch (err) {}
                        }}
                        onTimeUpdate={(e) => {
                          const vid = e.currentTarget;
                          if (!vid.duration || !isFinite(vid.duration) || vid.duration <= 0) return;
                          const pct = Math.min(100, Math.round((vid.currentTime / vid.duration) * 100));

                          try {
                            localStorage.setItem(`sami_lms_pos_${activeLesson.id}`, String(Math.floor(vid.currentTime)));
                          } catch (err) {}

                          setWatchProgress(prev => {
                            const current = prev[activeLesson.id] || 0;
                            if (pct > current) {
                              const nextMap = { ...prev, [activeLesson.id]: pct };
                              try {
                                localStorage.setItem('sami_lms_watch_progress', JSON.stringify(nextMap));
                              } catch (err) {}
                              return nextMap;
                            }
                            return prev;
                          });

                          // Auto complete when >= 90%
                          if (pct >= 90 && activeLesson && !completedLessons.includes(activeLesson.id)) {
                            markLessonComplete(activeLesson.id, true);
                          }
                        }}
                        onEnded={() => {
                          if (activeLesson && !completedLessons.includes(activeLesson.id)) {
                            markLessonComplete(activeLesson.id, true);
                          }
                        }}
                        className="w-full h-full object-contain bg-black"
                      >
                        <source src={activeLesson.videoUrl} />
                        {activeLesson.videoUrl.startsWith('/api/videos/') && (
                          <source src={activeLesson.videoUrl.replace('/api/videos/', '/uploads/videos/')} />
                        )}
                        Your browser does not support HTML5 video streaming.
                      </video>

                      {videoLoadError && (
                        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-4 text-center z-20">
                          <AlertCircle size={32} className="text-amber-400 mb-2 animate-bounce" />
                          <p className="text-sm font-bold text-white mb-1">Video stream connection loading...</p>
                          <p className="text-xs text-slate-400 mb-4 max-w-sm">
                            Click below to refresh the video stream buffer.
                          </p>
                          <button
                            onClick={() => {
                              setVideoLoadError(false);
                              const vid = document.querySelector('video');
                              if (vid) {
                                vid.load();
                                vid.play().catch(() => {});
                              }
                            }}
                            className="px-4 py-2 rounded-xl bg-[#00A0DF] hover:bg-[#008bc2] text-xs font-bold text-white flex items-center gap-1.5 transition-colors shadow-lg shadow-[#00A0DF]/30"
                          >
                            <RotateCcw size={13} />
                            <span>Reload Video Stream</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <iframe
                      src={getEmbedUrl(activeLesson?.videoUrl)}
                      title={activeLesson?.title || 'Lesson Video'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  )}

                  {/* Anti-Snipping Blackout Protection on Window Blur */}
                  {isWindowBlurred && (
                    <div className="absolute inset-0 z-40 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center select-none animate-in fade-in duration-150">
                      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mb-3 shadow-lg shadow-red-500/20">
                        <ShieldAlert size={28} />
                      </div>
                      <span className="inline-block bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full mb-2">
                        DRM CONTENT PROTECTION ACTIVE
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-white mb-1">
                        Playback Paused &bull; Screen Capture Protected
                      </h4>
                      <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed">
                        Window focus lost or screen capture tool detected. Click below to resume your lecture.
                      </p>
                      <button
                        onClick={() => {
                          setIsWindowBlurred(false);
                          if (videoRef.current) {
                            videoRef.current.play().catch(() => {});
                          }
                        }}
                        className="px-5 py-2 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-white text-xs font-black shadow-lg shadow-[#00A0DF]/30 transition-all active:scale-95"
                      >
                        Resume Lecture
                      </button>
                    </div>
                  )}

                  {/* Floating Custom Fullscreen Toggle Button (Watermark stays visible) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayerFullscreen();
                    }}
                    className="absolute bottom-3 right-3 z-30 p-2 rounded-xl bg-black/75 hover:bg-[#00A0DF] text-white border border-white/20 transition-all shadow-lg active:scale-95 flex items-center justify-center cursor-pointer"
                    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen (Keep Watermark)'}
                  >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>

                  {/* Dynamic Forensic Watermark Overlay */}
                  <DynamicForensicWatermark user={user} isFullscreen={isFullscreen} />
                </div>

                {/* Live Watch Verification Bar & Cloud Sync Banner */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl px-4 sm:px-5 py-3 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 w-full">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <span className="w-2 h-2 rounded-full bg-[#00A0DF] animate-pulse" />
                        <span>Lecture Watch Progress:</span>
                        <span className={isCurrentDone ? 'text-emerald-400 font-black' : 'text-[#00A0DF] font-black'}>
                          {isCurrentDone ? '100% Completed' : `${currentLessonWatchPct}% Watched`}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {isCurrentDone 
                          ? '✓ Verified & Cloud Saved' 
                          : `${Math.max(0, 90 - currentLessonWatchPct)}% more needed to complete`}
                      </span>
                    </div>
                    {/* Visual Progress Track */}
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60 relative">
                      <div className="absolute top-0 bottom-0 left-[90%] w-0.5 bg-amber-400/80 z-10" title="90% Completion Unlock Target" />
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCurrentDone
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : currentLessonWatchPct >= 90
                            ? 'bg-gradient-to-r from-[#00A0DF] to-emerald-400'
                            : 'bg-gradient-to-r from-[#00A0DF] to-[#0077aa]'
                        }`}
                        style={{ width: `${isCurrentDone ? 100 : Math.min(100, currentLessonWatchPct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Cloud Database Sync Status */}
                  <div className="flex-shrink-0 flex items-center gap-2 self-end sm:self-center">
                    {syncStatus === 'syncing' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-pulse">
                        <Loader2 size={12} className="animate-spin" />
                        <span>Syncing to Supabase...</span>
                      </span>
                    ) : syncFeedback ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                        <CheckCircle2 size={12} className="text-emerald-400" />
                        <span>{syncFeedback}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-white/5 text-slate-300 text-xs">
                        <Cloud size={12} className="text-[#00A0DF]" />
                        <span>Cloud Synced</span>
                      </span>
                    )}
                  </div>
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

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
                    {/* Admin Instant Test Toggle */}
                    {isAdmin && (
                      <button
                        onClick={() => activeLesson && markLessonComplete(activeLesson.id)}
                        title="Admin Override: Test complete/uncomplete instantly without watching full video"
                        className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Zap size={14} className="text-amber-400 fill-amber-400" />
                        <span>Admin Test Bypass</span>
                      </button>
                    )}

                    {/* Main Smart Completion Button */}
                    <button
                      onClick={() => {
                        if (!activeLesson) return;
                        if (isCurrentDone) {
                          markLessonComplete(activeLesson.id, false);
                        } else if (currentLessonWatchPct >= 90 || isAdmin) {
                          markLessonComplete(activeLesson.id, true);
                        }
                      }}
                      disabled={!isCurrentDone && currentLessonWatchPct < 90 && !isAdmin}
                      className={`w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all shadow-lg ${
                        isCurrentDone
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/40 active:scale-95 cursor-pointer'
                          : currentLessonWatchPct >= 90 || isAdmin
                          ? 'bg-[#00A0DF] hover:bg-[#008ec7] text-white shadow-[#00A0DF]/30 active:scale-95 cursor-pointer'
                          : 'bg-slate-800/80 text-slate-400 border border-white/5 cursor-not-allowed opacity-80'
                      }`}
                    >
                      {isCurrentDone ? (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Completed (Click to Undo)</span>
                        </>
                      ) : currentLessonWatchPct >= 90 ? (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Mark as Completed ({currentLessonWatchPct}%)</span>
                        </>
                      ) : (
                        <>
                          <Lock size={15} className="text-slate-400" />
                          <span>Watch 90% to Complete ({currentLessonWatchPct}%)</span>
                        </>
                      )}
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
      <div 
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#111827]/95 backdrop-blur-md border-t border-white/10 px-2 py-1.5 flex items-center justify-around text-[10px] font-bold shadow-2xl"
        style={{ paddingBottom: 'max(0.4rem, env(safe-area-inset-bottom, 0px))' }}
      >
        <button
          onClick={() => { setSidebarOpen(true); }}
          className="flex flex-col items-center gap-1 p-1 text-slate-400 hover:text-white active:scale-95 transition-transform"
        >
          <BookOpen size={17} className="text-[#00A0DF]" />
          <span>Lectures</span>
        </button>
        <button
          onClick={() => { setActiveTab('video'); setSidebarOpen(false); }}
          className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition-transform ${activeTab === 'video' ? 'text-[#00A0DF]' : 'text-slate-400'}`}
        >
          <Play size={17} />
          <span>Watch</span>
        </button>
        <button
          onClick={() => { setActiveTab('suppliers'); setSidebarOpen(false); }}
          className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition-transform ${activeTab === 'suppliers' ? 'text-[#00A0DF]' : 'text-slate-400'}`}
        >
          <ShoppingBag size={17} />
          <span>Suppliers</span>
        </button>
        <button
          onClick={() => { setActiveTab('resources'); setSidebarOpen(false); }}
          className={`flex flex-col items-center gap-1 p-1 active:scale-95 transition-transform ${activeTab === 'resources' ? 'text-[#00A0DF]' : 'text-slate-400'}`}
        >
          <Download size={17} />
          <span>Bonuses</span>
        </button>
        <a
          href="https://wa.me/923158960026?text=Assalam%20o%20Alaikum%20Sami!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 p-1 text-emerald-400 active:scale-95 transition-transform"
        >
          <MessageSquare size={17} />
          <span>WhatsApp</span>
        </a>
      </div>

      {/* Piracy Strike Warning Floating Banner / Toast */}
      {strikeToast && strikeToast.visible && (
        <div className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 w-[92vw] max-w-md animate-in slide-in-from-top-4 duration-300 pointer-events-auto">
          <div className={`p-3.5 rounded-2xl border shadow-2xl flex items-center justify-between gap-3 ${
            strikeToast.strikeCount >= 4
              ? 'bg-red-950/95 border-red-500/50 text-red-200 shadow-red-950/50'
              : 'bg-[#1e1503]/95 border-amber-500/50 text-amber-200 shadow-amber-950/50'
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className={`p-2 rounded-xl flex-shrink-0 ${
                strikeToast.strikeCount >= 4 ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                <ShieldAlert size={18} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 text-white">
                  <span>PIRACY WARNING</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                    strikeToast.strikeCount >= 4 ? 'bg-red-500/30 text-red-300' : 'bg-amber-500/30 text-amber-300'
                  }`}>
                    {strikeToast.strikeCount}/5 Strikes
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs truncate font-medium text-slate-200">
                  {strikeToast.message}
                </div>
              </div>
            </div>
            <button
              onClick={() => setStrikeToast(prev => prev ? { ...prev, visible: false } : null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white flex-shrink-0"
              title="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* DRM Security Announcement Policy Modal */}
      <DrmAnnouncementModal
        isOpen={showDrmModal}
        onClose={() => {
          setShowDrmModal(false);
          try {
            sessionStorage.setItem('sami_lms_drm_modal_seen', 'true');
          } catch (e) {}
        }}
      />

    </div>
  );
}

// =============================================================================
// SUBCOMPONENT: Dynamic Moving Forensic Watermark Overlay
// =============================================================================
function DynamicForensicWatermark({ user, isFullscreen = false }: { user: any; isFullscreen?: boolean }) {
  const [sector, setSector] = useState(0);
  const [clock, setClock] = useState('');

  useEffect(() => {
    // 1. Live real-time digital clock
    const updateClock = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setClock(`${dateStr} • ${timeStr}`);
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    // 2. Randomize watermark position across 9 sectors every 5 seconds
    const moveInterval = setInterval(() => {
      setSector(prev => {
        let next = Math.floor(Math.random() * 9);
        while (next === prev) {
          next = Math.floor(Math.random() * 9);
        }
        return next;
      });
    }, 5000);

    return () => {
      clearInterval(clockInterval);
      clearInterval(moveInterval);
    };
  }, []);

  // 9 grid sectors with responsive placement
  const sectorClasses = [
    'top-2.5 left-2.5 text-left',                          // 0: Top-Left
    'top-2.5 left-1/2 -translate-x-1/2 text-center',       // 1: Top-Center
    'top-2.5 right-2.5 text-right',                        // 2: Top-Right
    'top-1/2 -translate-y-1/2 left-2.5 text-left',         // 3: Mid-Left
    'top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-center', // 4: Center
    'top-1/2 -translate-y-1/2 right-2.5 text-right',       // 5: Mid-Right
    'bottom-10 left-2.5 text-left',                        // 6: Bottom-Left
    'bottom-10 left-1/2 -translate-x-1/2 text-center',     // 7: Bottom-Center
    'bottom-10 right-2.5 text-right',                      // 8: Bottom-Right
  ];

  const studentName = user?.name || 'Authorized Student';
  const studentId = user?.id ? String(user.id).slice(-5).toUpperCase() : 'SAMI';
  const maskedPhone = user?.phone ? user.phone.replace(/(\d{4})\d{4}(\d{3})/, '$1****$2') : '';
  const ipAddress = user?.ip || 'Verified Session';

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-[999999] overflow-hidden">
      <div
        className={`absolute transition-all duration-1000 ease-in-out px-2.5 py-1.5 rounded-xl bg-black/40 backdrop-blur-[1px] border border-white/10 text-white/50 shadow-md ${
          isFullscreen ? 'max-w-[280px] sm:max-w-[340px]' : 'max-w-[200px] sm:max-w-[250px]'
        } ${sectorClasses[sector]}`}
      >
        <div className="flex items-center gap-1 text-[8px] sm:text-[9.5px] font-black tracking-wider text-[#00A0DF]/80 uppercase leading-none mb-0.5">
          <Shield size={10} className="flex-shrink-0" />
          <span>SAMI DRM PROTECTED</span>
        </div>
        <div className="text-[8.5px] sm:text-[10px] font-mono font-bold leading-tight truncate text-white/70">
          {studentName} • SAMI-{studentId}
        </div>
        <div className="text-[7.5px] sm:text-[9px] font-mono leading-tight text-white/50 truncate">
          {maskedPhone ? `${maskedPhone} • ` : ''}IP: {ipAddress}
        </div>
        <div className="text-[7px] sm:text-[8px] font-mono text-white/40 leading-none mt-0.5">
          {clock}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// SUBCOMPONENT: DRM & Anti-Piracy Security Announcement Modal
// =============================================================================
function DrmAnnouncementModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 relative">
        {/* Close Button [X] */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title="Dismiss Policy Notice"
        >
          <X size={18} />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#00A0DF]/15 border border-[#00A0DF]/30 text-[#00A0DF] flex items-center justify-center shadow-lg shadow-[#00A0DF]/20 flex-shrink-0">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="inline-block bg-[#00A0DF]/15 text-[#00A0DF] border border-[#00A0DF]/30 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md mb-0.5">
              SECURITY ADVISORY
            </span>
            <h2 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
              LMS Content Protection &amp; DRM Policy
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Welcome to Sardar Samiullah's Mentorship LMS. All course modules, wholesale supplier directories, and Shopify assets are copyright-protected.
        </p>

        {/* 3 Pillars List */}
        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-2xl bg-[#0B0F19] border border-white/5 flex items-start gap-2.5">
            <span className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 mt-0.5 flex-shrink-0">
              <Shield size={15} />
            </span>
            <div>
              <strong className="text-white block font-bold text-xs mb-0.5">Dynamic Forensic Watermarking</strong>
              <span className="text-slate-400 text-[11px] leading-tight">
                Your Student Name, ID, and IP address are dynamically embedded across all video frames to prevent unauthorized recording and content leaks.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0B0F19] border border-white/5 flex items-start gap-2.5">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 mt-0.5 flex-shrink-0">
              <AlertTriangle size={15} />
            </span>
            <div>
              <strong className="text-white block font-bold text-xs mb-0.5">5-Strike Anti-Capture Sensor</strong>
              <span className="text-slate-400 text-[11px] leading-tight">
                Screen recording software, screenshot shortcuts, and DevTools inspections are actively tracked. Each violation registers a strike on your account.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0B0F19] border border-white/5 flex items-start gap-2.5">
            <span className="p-1.5 rounded-xl bg-red-500/10 text-red-400 mt-0.5 flex-shrink-0">
              <Lock size={15} />
            </span>
            <div>
              <strong className="text-white block font-bold text-xs mb-0.5">Instant Lockout &amp; Fine Policy</strong>
              <span className="text-slate-400 text-[11px] leading-tight">
                Accumulating 5 strikes will immediately terminate your LMS portal access. Restoring access requires administrative review and payment of a reactivation fine.
              </span>
            </div>
          </div>
        </div>

        {/* Agreement Action Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#00A0DF] to-[#0077aa] hover:from-[#008ec7] hover:to-[#006699] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#00A0DF]/30 transition-all active:scale-[0.98]"
          >
            I Understand &amp; Agree
          </button>
        </div>
      </div>
    </div>
  );
}
