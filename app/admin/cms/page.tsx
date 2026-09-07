'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Laptop,
  UploadCloud,
  FileVideo,
  Loader2,
  Link2,
  Code2,
  Palette,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Star,
  X
} from 'lucide-react';
import { 
  defaultCmsContent, 
  CmsContentSchema, 
  THEME_PRESETS, 
  DEFAULT_THEME_COLORS, 
  ThemeCustomColors, 
  generateThemeCss,
  updateCmsContent
} from '@/utils/cmsStore';
import { Module, Supplier, initialModules, initialSuppliers } from '@/utils/db';

import { supabase } from '@/lib/supabase';
import { optimizeVideoTo720p } from '@/utils/videoCompressor';

export default function AdminCmsPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'marquee' | 'hero' | 'stats' | 'why' | 'what' | 'mentor' | 'video_reviews' | 'who' | 'lms' | 'bonuses' | 'reviews' | 'options' | 'cost' | 'faqs' | 'cta' | 'contact' | 'payments' | 'themes' | 'pixels'
  >('hero');
  const [cmsData, setCmsData] = useState<CmsContentSchema>(defaultCmsContent);
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
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
  const [newLessonUrl, setNewLessonUrl] = useState('');
  const [lessonVideoMode, setLessonVideoMode] = useState<'upload' | 'url' | 'embed'>('upload');
  const [newLessonEmbedCode, setNewLessonEmbedCode] = useState('');
  const [editingLesson, setEditingLesson] = useState<{
    moduleId: number;
    lessonId: string;
    title: string;
    duration: string;
    videoUrl: string;
    mode: 'upload' | 'url' | 'embed';
    embedCode: string;
  } | null>(null);
  const [editLessonSaving, setEditLessonSaving] = useState(false);
  const [editLessonError, setEditLessonError] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatusText, setUploadStatusText] = useState('');
  const [selectedVideoName, setSelectedVideoName] = useState('');
  const [selectedVideoSize, setSelectedVideoSize] = useState('');
  const [videoUploadSuccess, setVideoUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const uploadXhrRef = useRef<XMLHttpRequest | null>(null);
  const uploadAbortRef = useRef<AbortController | null>(null);

  // Hero Video Upload States
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadProgress, setHeroUploadProgress] = useState(0);
  const [heroUploadStatus, setHeroUploadStatus] = useState('');
  const [heroUploadError, setHeroUploadError] = useState('');
  const [heroUploadSuccess, setHeroUploadSuccess] = useState(false);
  const heroUploadXhrRef = useRef<XMLHttpRequest | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

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

  // Screenshot Reviews State (LearnWithAfaq Style for Checkout Page)
  const [reviewSubTab, setReviewSubTab] = useState<'screenshots' | 'text'>('screenshots');
  const [screenshotUploading, setScreenshotUploading] = useState(false);
  const [screenshotUploadStatus, setScreenshotUploadStatus] = useState('');
  const [screenshotUploadError, setScreenshotUploadError] = useState('');
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const screenshotFileInputRef = useRef<HTMLInputElement>(null);

  // Mentor Profile State
  const [mentorUploading, setMentorUploading] = useState(false);
  const [mentorUploadProgress, setMentorUploadProgress] = useState(0);
  const [mentorUploadStatus, setMentorUploadStatus] = useState('');
  const [mentorUploadError, setMentorUploadError] = useState('');
  const mentorFileInputRef = useRef<HTMLInputElement>(null);
  const currentThemeColors: ThemeCustomColors = {
    ...DEFAULT_THEME_COLORS,
    ...(cmsData.theme?.custom_colors || {})
  };
  const activePresetId = cmsData.theme?.active_preset || cmsData.theme?.active_theme || 'default';

  const updateLiveCustomColor = (key: keyof ThemeCustomColors, value: string) => {
    const updatedColors: ThemeCustomColors = {
      ...currentThemeColors,
      [key]: value
    };

    setCmsData(prev => ({
      ...prev,
      theme: {
        active_preset: 'custom',
        active_theme: 'custom',
        custom_colors: updatedColors
      }
    }));

    // Update dynamic style in DOM in 0ms
    try {
      const css = generateThemeCss(updatedColors);
      let el = document.getElementById('sami-dynamic-theme');
      if (!el) {
        el = document.createElement('style');
        el.id = 'sami-dynamic-theme';
        document.head.appendChild(el);
      }
      el.innerHTML = css;
      document.documentElement.setAttribute('data-theme', 'custom');
      localStorage.setItem('sami_active_theme', 'custom');
      localStorage.setItem('sami_theme_css', css);
    } catch (e) {}
  };

  const applyPreset = (preset: (typeof THEME_PRESETS)[0]) => {
    setCmsData(prev => ({
      ...prev,
      theme: {
        active_preset: preset.id,
        active_theme: preset.id,
        custom_colors: { ...preset.colors }
      }
    }));

    try {
      const css = generateThemeCss(preset.colors);
      let el = document.getElementById('sami-dynamic-theme');
      if (!el) {
        el = document.createElement('style');
        el.id = 'sami-dynamic-theme';
        document.head.appendChild(el);
      }
      el.innerHTML = css;
      document.documentElement.setAttribute('data-theme', preset.id);
      localStorage.setItem('sami_active_theme', preset.id);
      localStorage.setItem('sami_theme_css', css);
      document.cookie = `sami_active_theme=${preset.id}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (e) {}
  };

  const resetThemeToDefault = () => {
    applyPreset(THEME_PRESETS[0]);
  };

  const fetchAllData = async () => {
    try {
      localStorage.removeItem('sami_cms_content');
    } catch (e) {}

    const cacheBuster = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // 1. Try local API route for CMS content
    try {
      const res = await fetch(`/api/cms/content?_nocache=${cacheBuster}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.content) {
          setCmsData(data.content);
          const t = data.content.theme;
          const p = t?.active_preset || t?.active_theme || 'default';
          const c: ThemeCustomColors = { ...DEFAULT_THEME_COLORS, ...(t?.custom_colors || {}) };
          document.documentElement.setAttribute('data-theme', p);
          try {
            const css = generateThemeCss(c);
            let el = document.getElementById('sami-dynamic-theme');
            if (!el) {
              el = document.createElement('style');
              el.id = 'sami-dynamic-theme';
              document.head.appendChild(el);
            }
            el.innerHTML = css;
            localStorage.setItem('sami_active_theme', p);
            localStorage.setItem('sami_theme_css', css);
          } catch (e) {}
        }
      }
    } catch (err) {}

    // 2. Fetch LMS Modules from API
    try {
      const modRes = await fetch(`/api/lms/modules?_nocache=${cacheBuster}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
      });
      if (modRes.ok) {
        const modData = await modRes.json();
        if (modData.success && Array.isArray(modData.modules) && modData.modules.length > 0) {
          setModules(modData.modules);
        }
      }
    } catch (err) {}

    // 3. Fetch Suppliers from API
    try {
      const supRes = await fetch(`/api/lms/suppliers?_nocache=${cacheBuster}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate', 'Pragma': 'no-cache' }
      });
      if (supRes.ok) {
        const supData = await supRes.json();
        if (supData.success && Array.isArray(supData.suppliers) && supData.suppliers.length > 0) {
          setSuppliers(supData.suppliers);
        }
      }
    } catch (err) {}

    // 4. Direct Supabase Cloud Fetch (Guaranteed fallback for static web hosts like Hostinger)
    if (supabase) {
      try {
        const { data, error } = await supabase.from('cms_settings').select('value_json').eq('key', 'main_cms').maybeSingle();
        if (!error && data && data.value_json) {
          const parsed = typeof data.value_json === 'string' ? JSON.parse(data.value_json) : data.value_json;
          if (parsed && typeof parsed === 'object') {
            setCmsData({ ...defaultCmsContent, ...parsed });
            const t = parsed.theme;
            const p = t?.active_preset || t?.active_theme || 'default';
            const c: ThemeCustomColors = { ...DEFAULT_THEME_COLORS, ...(t?.custom_colors || {}) };
            document.documentElement.setAttribute('data-theme', p);
            try {
              const css = generateThemeCss(c);
              let el = document.getElementById('sami-dynamic-theme');
              if (!el) {
                el = document.createElement('style');
                el.id = 'sami-dynamic-theme';
                document.head.appendChild(el);
              }
              el.innerHTML = css;
              localStorage.setItem('sami_active_theme', p);
              localStorage.setItem('sami_theme_css', css);
            } catch (e) {}
          }
        }
      } catch (e) {}

      try {
        const { data: modData } = await supabase.from('lms_modules').select('*').order('id', { ascending: true });
        if (modData && modData.length > 0) {
          setModules(modData.map((r: any) => ({
            id: Number(r.id),
            title: r.title,
            duration: r.duration,
            description: r.description,
            lessons: typeof r.lessons_json === 'string' ? JSON.parse(r.lessons_json || '[]') : (r.lessons_json || [])
          })));
        }
      } catch (e) {}

      try {
        const { data: supData } = await supabase.from('lms_suppliers').select('*').order('updated_at', { ascending: false });
        if (supData && supData.length > 0) {
          setSuppliers(supData.map((r: any) => ({
            id: r.id,
            name: r.name,
            category: r.category,
            country: r.country,
            city: r.city,
            phone: r.phone,
            whatsappLink: r.whatsapp_link,
            minOrder: r.min_order,
            deliveryTime: r.delivery_time,
            codSupported: Boolean(r.cod_supported),
            notes: r.notes
          })));
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    fetch('/api/auth/me?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated || data.role !== 'ADMIN') {
          router.replace('/admin/login?redirect=/admin/cms');
        } else {
          setAuthChecking(false);
          fetchAllData();
        }
      })
      .catch(() => {
        router.replace('/admin/login?redirect=/admin/cms');
      });
  }, []);

  const handleSaveAll = async () => {
    setLoading(true);
    setSavedSuccess(false);
    let saved = false;

    if (cmsData.theme) {
      const p = cmsData.theme.active_preset || cmsData.theme.active_theme || 'default';
      const c: ThemeCustomColors = { ...DEFAULT_THEME_COLORS, ...(cmsData.theme.custom_colors || {}) };
      document.documentElement.setAttribute('data-theme', p);
      try {
        const css = generateThemeCss(c);
        let el = document.getElementById('sami-dynamic-theme');
        if (el) el.innerHTML = css;
        localStorage.setItem('sami_active_theme', p);
        localStorage.setItem('sami_theme_css', css);
        document.cookie = `sami_active_theme=${p}; path=/; max-age=31536000; SameSite=Lax`;
      } catch (e) {}
    }

    try {
      // 1. Persist main CMS content to server API & trigger revalidation
      const res = await fetch('/api/cms/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: JSON.stringify(cmsData)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) saved = true;
      }
    } catch (e) {}

    // 1b. Also explicitly persist payment methods to /api/cms/payment-methods endpoint
    try {
      const pmRes = await fetch('/api/cms/payment-methods', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: JSON.stringify({ payment_methods: cmsData.payment_methods })
      });
      if (pmRes.ok) saved = true;
    } catch (e) {}

    // 2. Direct Supabase Cloud Save (Guaranteed fallback for static web hosts like Hostinger)
    if (supabase) {
      try {
        const { error } = await supabase.from('cms_settings').upsert({
          key: 'main_cms',
          value_json: JSON.stringify(cmsData),
          updated_at: new Date().toISOString()
        });
        if (!error) saved = true;
      } catch (e) {
        console.error('Direct Supabase save error:', e);
      }
    }

    if (saved) {
      try {
        localStorage.setItem('sami_cms_payment_methods', JSON.stringify(cmsData.payment_methods));
        localStorage.setItem('sami_cms_content', JSON.stringify(cmsData));
        updateCmsContent(cmsData);
      } catch (e) {}
      setSavedSuccess(true);
      window.dispatchEvent(new Event('sami_cms_updated'));
      setTimeout(() => setSavedSuccess(false), 3000);
    }
    setLoading(false);
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

  const parseEmbedInput = (input: string): string => {
    const trimmed = (input || '').trim();
    if (!trimmed) return '';
    const iframeMatch = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1]) {
      return iframeMatch[1];
    }
    return trimmed;
  };

  const handleEmbedCodeChange = (raw: string) => {
    setNewLessonEmbedCode(raw);
    const parsed = parseEmbedInput(raw);
    if (parsed) {
      setNewLessonUrl(parsed);
      setUploadError('');
    } else {
      setNewLessonUrl('');
    }
  };

  const openAddLesson = (moduleId: number) => {
    setAddingLessonForModuleId(moduleId);
    setOpenModuleId(moduleId);
    setNewLessonTitle('');
    setNewLessonDuration('15:00');
    setNewLessonUrl('');
    setNewLessonEmbedCode('');
    setLessonVideoMode('upload');
    setUploadingVideo(false);
    setUploadProgress(0);
    setUploadStatusText('');
    setSelectedVideoName('');
    setSelectedVideoSize('');
    setVideoUploadSuccess(false);
    setUploadError('');
  };

  const openEditLesson = (moduleId: number, lesson: any) => {
    const isEmbed = Boolean(
      lesson.videoUrl?.includes('mediadelivery.net') || 
      lesson.videoUrl?.includes('bunny') || 
      lesson.videoUrl?.includes('embed') || 
      lesson.videoUrl?.includes('<iframe')
    );
    setEditingLesson({
      moduleId,
      lessonId: lesson.id,
      title: lesson.title,
      duration: lesson.duration || '15:00',
      videoUrl: lesson.videoUrl,
      mode: isEmbed ? 'embed' : 'url',
      embedCode: isEmbed ? lesson.videoUrl : ''
    });
    setEditLessonError('');
  };

  const handleUpdateLesson = async () => {
    if (!editingLesson) return;
    if (!editingLesson.title.trim()) {
      setEditLessonError('Please enter a lecture title');
      return;
    }

    let finalVideoUrl = editingLesson.videoUrl.trim();
    if (editingLesson.mode === 'embed' && editingLesson.embedCode.trim()) {
      const parsed = parseEmbedInput(editingLesson.embedCode);
      if (parsed) finalVideoUrl = parsed;
    }

    if (!finalVideoUrl) {
      setEditLessonError('Please provide a video URL or embed code');
      return;
    }

    if (finalVideoUrl.includes('youtube.com/watch?v=')) {
      const vId = finalVideoUrl.split('v=')[1]?.split('&')[0];
      if (vId) finalVideoUrl = `https://www.youtube.com/embed/${vId}`;
    } else if (finalVideoUrl.includes('youtu.be/')) {
      const vId = finalVideoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (vId) finalVideoUrl = `https://www.youtube.com/embed/${vId}`;
    }

    setEditLessonSaving(true);
    setEditLessonError('');

    try {
      const res = await fetch('/api/lms/modules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_LESSON',
          moduleId: editingLesson.moduleId,
          lessonId: editingLesson.lessonId,
          patch: {
            title: editingLesson.title.trim(),
            duration: editingLesson.duration || '15:00',
            videoUrl: finalVideoUrl
          }
        })
      });
      const data = await res.json();
      if (data.success && data.modules) {
        setModules(data.modules);
        setEditingLesson(null);
      } else {
        setEditLessonError(data.message || 'Failed to update lecture');
      }
    } catch (e: any) {
      setEditLessonError(e.message || 'Error updating lecture');
    } finally {
      setEditLessonSaving(false);
    }
  };

  const handleVideoFileSelect = (e: React.ChangeEvent<HTMLInputElement>, moduleId: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|m4v|mkv)$/i)) {
      setUploadError('Please select a valid video file (.mp4, .webm, .mov, .m4v).');
      return;
    }

    setUploadError('');
    setSelectedVideoName(file.name);
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    setSelectedVideoSize(`${sizeInMB} MB`);

    try {
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.onloadedmetadata = () => {
        window.URL.revokeObjectURL(tempVideo.src);
        const mins = Math.floor(tempVideo.duration / 60);
        const secs = Math.floor(tempVideo.duration % 60);
        const formatted = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        if (!newLessonDuration || newLessonDuration === '15:00') {
          setNewLessonDuration(formatted);
        }
      };
      tempVideo.src = URL.createObjectURL(file);
    } catch {}

    if (!newLessonTitle) {
      const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setNewLessonTitle(cleanBase);
    }

    uploadVideoFile(file, moduleId);
  };

  const uploadVideoFile = async (file: File, moduleId: number) => {
    setUploadingVideo(true);
    setUploadProgress(0);
    setVideoUploadSuccess(false);
    setUploadError('');

    const totalMB = (file.size / (1024 * 1024)).toFixed(1);
    setUploadStatusText(`Preparing high-speed upload (${totalMB} MB)...`);

    const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
    const manifestId = `vid_${Date.now()}_${cleanBase}`;

    // 40MB cloud parts for ultra-fast upload directly to cloud storage
    const PART_SIZE = 40 * 1024 * 1024;
    const totalParts = Math.ceil(file.size / PART_SIZE);

    try {
      for (let p = 0; p < totalParts; p++) {
        const start = p * PART_SIZE;
        const end = Math.min(start + PART_SIZE, file.size);
        const partBlob = file.slice(start, end);

        setUploadStatusText(`Authorizing cloud storage (${p + 1}/${totalParts})...`);

        // 1. Get signed upload URL for this 40MB part
        const resUrl = await fetch('/api/admin/cms/get-part-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ manifestId, partIndex: p })
        });

        const urlData = await resUrl.json().catch(() => ({}));
        if (!resUrl.ok || !urlData.signedUrl) {
          throw new Error(urlData.message || `Failed to authorize cloud part ${p + 1}`);
        }

        // 2. Direct PUT upload to cloud storage with live progress
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          uploadXhrRef.current = xhr;

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const overallLoaded = start + e.loaded;
              const percent = Math.min(Math.round((overallLoaded / file.size) * 100), 99);
              setUploadProgress(percent);
              const loadedMB = (overallLoaded / (1024 * 1024)).toFixed(1);
              setUploadStatusText(`Uploading: ${percent}% (${loadedMB} MB of ${totalMB} MB)`);
            }
          };

          xhr.onload = () => {
            uploadXhrRef.current = null;
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed on part ${p + 1} with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => {
            uploadXhrRef.current = null;
            reject(new Error(`Network error uploading part ${p + 1}`));
          };

          xhr.onabort = () => {
            uploadXhrRef.current = null;
            reject(new Error('Upload cancelled'));
          };

          xhr.open('PUT', urlData.signedUrl, true);
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
          xhr.send(partBlob);
        });
      }

      setUploadStatusText('Finalizing video stream...');

      // 3. Finalize manifest on server
      const resFin = await fetch('/api/admin/cms/finalize-manifest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manifestId,
          fileName: file.name,
          totalSize: file.size,
          totalParts,
          partSize: PART_SIZE,
          contentType: file.type || 'video/mp4'
        })
      });

      const finData = await resFin.json().catch(() => ({}));
      if (!resFin.ok || !finData.success) {
        throw new Error(finData.message || 'Failed to finalize video stream');
      }

      setNewLessonUrl(finData.url);
      setUploadProgress(100);
      setUploadingVideo(false);
      setVideoUploadSuccess(true);
      setUploadStatusText(`Upload complete 100%! (${totalMB} MB saved successfully)`);

    } catch (err: any) {
      setUploadingVideo(false);
      uploadXhrRef.current = null;
      if (err.name === 'AbortError' || err.message === 'Upload cancelled') {
        setUploadError('Upload cancelled');
      } else {
        setUploadError(err.message || 'Video upload failed. Please try again.');
      }
    }
  };

  const cancelVideoUpload = () => {
    if (uploadXhrRef.current) {
      uploadXhrRef.current.abort();
      uploadXhrRef.current = null;
    }
    setUploadingVideo(false);
    setUploadProgress(0);
    setUploadStatusText('');
    setUploadError('Upload cancelled by user.');
  };

  const handleHeroVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/') && !file.name.match(/\.(mp4|webm|mov|m4v|mkv)$/i)) {
      setHeroUploadError('Please select a valid video file (MP4, WebM, MOV, M4V)');
      return;
    }

    uploadHeroVideoFile(file);
  };

  const uploadHeroVideoFile = async (file: File) => {
    setHeroUploading(true);
    setHeroUploadProgress(0);
    setHeroUploadSuccess(false);
    setHeroUploadError('');

    const totalMB = (file.size / (1024 * 1024)).toFixed(1);
    setHeroUploadStatus(`Preparing hero upload (${totalMB} MB)...`);

    const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
    const manifestId = `hero_${Date.now()}_${cleanBase}`;

    const PART_SIZE = 40 * 1024 * 1024;
    const totalParts = Math.ceil(file.size / PART_SIZE);

    try {
      for (let p = 0; p < totalParts; p++) {
        const start = p * PART_SIZE;
        const end = Math.min(start + PART_SIZE, file.size);
        const partBlob = file.slice(start, end);

        setHeroUploadStatus(`Authorizing cloud storage (${p + 1}/${totalParts})...`);

        const resUrl = await fetch('/api/admin/cms/get-part-upload-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ manifestId, partIndex: p })
        });

        const urlData = await resUrl.json().catch(() => ({}));
        if (!resUrl.ok || !urlData.signedUrl) {
          throw new Error(urlData.message || `Failed to authorize cloud part ${p + 1}`);
        }

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          heroUploadXhrRef.current = xhr;

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const overallLoaded = start + e.loaded;
              const percent = Math.min(Math.round((overallLoaded / file.size) * 100), 99);
              setHeroUploadProgress(percent);
              const loadedMB = (overallLoaded / (1024 * 1024)).toFixed(1);
              setHeroUploadStatus(`Uploading hero: ${percent}% (${loadedMB} MB of ${totalMB} MB)`);
            }
          };

          xhr.onload = () => {
            heroUploadXhrRef.current = null;
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed on hero part ${p + 1} with status ${xhr.status}`));
            }
          };

          xhr.onerror = () => {
            heroUploadXhrRef.current = null;
            reject(new Error(`Network error uploading hero part ${p + 1}`));
          };

          xhr.onabort = () => {
            heroUploadXhrRef.current = null;
            reject(new Error('Upload cancelled'));
          };

          xhr.open('PUT', urlData.signedUrl, true);
          xhr.setRequestHeader('Content-Type', 'application/octet-stream');
          xhr.send(partBlob);
        });
      }

      setHeroUploadStatus('Finalizing hero video stream...');

      const resFin = await fetch('/api/admin/cms/finalize-manifest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          manifestId,
          fileName: file.name,
          totalSize: file.size,
          totalParts,
          partSize: PART_SIZE,
          contentType: file.type || 'video/mp4'
        })
      });

      const finData = await resFin.json().catch(() => ({}));
      if (!resFin.ok || !finData.success) {
        throw new Error(finData.message || 'Failed to finalize hero video');
      }

      setCmsData(prev => ({
        ...prev,
        hero: {
          ...prev.hero,
          video_url: finData.url
        }
      }));
      setHeroUploadProgress(100);
      setHeroUploading(false);
      setHeroUploadSuccess(true);
      setHeroUploadStatus(`Upload complete 100%! (${totalMB} MB saved successfully)`);

    } catch (err: any) {
      setHeroUploading(false);
      heroUploadXhrRef.current = null;
      if (err.name === 'AbortError' || err.message === 'Upload cancelled') {
        setHeroUploadError('Upload cancelled');
      } else {
        setHeroUploadError(err.message || 'Video upload failed. Please try again.');
      }
    }
  };

  // --- LMS LESSON ACTIONS ---
  const handleAddLesson = async (moduleId: number) => {
    if (!newLessonTitle.trim()) {
      setUploadError('Please enter a lecture title');
      return;
    }

    let finalVideoUrl = newLessonUrl.trim();
    if (lessonVideoMode === 'embed' && newLessonEmbedCode.trim()) {
      const parsed = parseEmbedInput(newLessonEmbedCode);
      if (parsed) finalVideoUrl = parsed;
    }

    if (!finalVideoUrl) {
      setUploadError('Please upload a video file, paste a video URL, or paste Bunny.net embed code');
      return;
    }

    if (finalVideoUrl.includes('youtube.com/watch?v=')) {
      const vId = finalVideoUrl.split('v=')[1]?.split('&')[0];
      if (vId) finalVideoUrl = `https://www.youtube.com/embed/${vId}`;
    } else if (finalVideoUrl.includes('youtu.be/')) {
      const vId = finalVideoUrl.split('youtu.be/')[1]?.split('?')[0];
      if (vId) finalVideoUrl = `https://www.youtube.com/embed/${vId}`;
    }

    try {
      const res = await fetch('/api/lms/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_LESSON',
          moduleId,
          lesson: {
            title: newLessonTitle.trim(),
            duration: newLessonDuration || '15:00',
            videoUrl: finalVideoUrl
          }
        })
      });
      const data = await res.json();
      if (data.success && data.modules) {
        setModules(data.modules);
        setAddingLessonForModuleId(null);
        setNewLessonTitle('');
        setNewLessonUrl('');
        setNewLessonEmbedCode('');
        setVideoUploadSuccess(false);
        setUploadProgress(0);
        setSelectedVideoName('');
      } else {
        setUploadError(data.message || 'Failed to save lecture');
      }
    } catch (e: any) {
      console.error(e);
      setUploadError(e.message || 'Error saving lecture');
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

  // --- SCREENSHOT REVIEWS ACTIONS (CHECKOUT PAGE) ---
  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setScreenshotUploading(true);
    setScreenshotUploadError('');
    setScreenshotUploadStatus(`Preparing to upload ${files.length} screenshot(s)...`);

    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setScreenshotUploadStatus(`Uploading image (${i + 1}/${files.length}): ${file.name}...`);
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/admin/cms/upload-review-image', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();
        if (!res.ok || !data.success || !data.url) {
          throw new Error(data.message || `Failed to upload ${file.name}`);
        }
        uploadedUrls.push(data.url);
      }

      setCmsData(prev => {
        const current = prev.screenshot_reviews || defaultCmsContent.screenshot_reviews!;
        const existingImages = current.images || [];
        return {
          ...prev,
          screenshot_reviews: {
            ...current,
            images: [...existingImages, ...uploadedUrls]
          }
        };
      });

      setScreenshotUploadStatus(`Successfully added ${files.length} screenshot review(s)!`);
      setTimeout(() => setScreenshotUploadStatus(''), 4000);
    } catch (err: any) {
      setScreenshotUploadError(err.message || 'Failed to upload review screenshot');
    } finally {
      setScreenshotUploading(false);
      if (screenshotFileInputRef.current) {
        screenshotFileInputRef.current.value = '';
      }
    }
  };

  const handleAddScreenshotUrl = () => {
    if (!newScreenshotUrl.trim()) return;
    setCmsData(prev => {
      const current = prev.screenshot_reviews || defaultCmsContent.screenshot_reviews!;
      const existingImages = current.images || [];
      return {
        ...prev,
        screenshot_reviews: {
          ...current,
          images: [...existingImages, newScreenshotUrl.trim()]
        }
      };
    });
    setNewScreenshotUrl('');
  };

  const handleDeleteScreenshot = (idx: number) => {
    setCmsData(prev => {
      const current = prev.screenshot_reviews || defaultCmsContent.screenshot_reviews!;
      const updated = [...(current.images || [])];
      updated.splice(idx, 1);
      return {
        ...prev,
        screenshot_reviews: {
          ...current,
          images: updated
        }
      };
    });
  };

  const handleMoveScreenshot = (idx: number, direction: 'up' | 'down') => {
    setCmsData(prev => {
      const current = prev.screenshot_reviews || defaultCmsContent.screenshot_reviews!;
      const updated = [...(current.images || [])];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= updated.length) return prev;
      const temp = updated[idx];
      updated[idx] = updated[targetIdx];
      updated[targetIdx] = temp;
      return {
        ...prev,
        screenshot_reviews: {
          ...current,
          images: updated
        }
      };
    });
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

  // --- MENTOR PROFILE ACTIONS ---
  const handleMentorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMentorUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    setMentorUploading(true);
    setMentorUploadError('');
    setMentorUploadProgress(15);
    setMentorUploadStatus(`Uploading ${file.name}...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      setMentorUploadProgress(45);
      const res = await fetch('/api/admin/cms/upload-mentor-image', {
        method: 'POST',
        body: formData
      });

      setMentorUploadProgress(85);
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setMentorUploadProgress(100);
        setMentorUploadStatus('Mentor image uploaded successfully!');
        setCmsData(prev => ({
          ...prev,
          mentor: {
            ...(prev.mentor || defaultCmsContent.mentor),
            image: data.url
          }
        }));
        setTimeout(() => {
          setMentorUploading(false);
          setMentorUploadProgress(0);
        }, 1200);
      } else {
        throw new Error(data.message || 'Failed to upload mentor image');
      }
    } catch (err: any) {
      setMentorUploading(false);
      setMentorUploadError(err.message || 'Image upload failed. Please try again.');
    }
  };

  const handleAddMentorBenefit = () => {
    setCmsData(prev => {
      const current = prev.mentor || defaultCmsContent.mentor;
      return {
        ...prev,
        mentor: {
          ...current,
          benefits: [...(current.benefits || []), 'New Mentorship Benefit / Feature']
        }
      };
    });
  };

  const handleUpdateMentorBenefit = (index: number, val: string) => {
    setCmsData(prev => {
      const current = prev.mentor || defaultCmsContent.mentor;
      const updated = [...(current.benefits || [])];
      updated[index] = val;
      return {
        ...prev,
        mentor: {
          ...current,
          benefits: updated
        }
      };
    });
  };

  const handleDeleteMentorBenefit = (index: number) => {
    setCmsData(prev => {
      const current = prev.mentor || defaultCmsContent.mentor;
      const updated = (current.benefits || []).filter((_, i) => i !== index);
      return {
        ...prev,
        mentor: {
          ...current,
          benefits: updated
        }
      };
    });
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
            { id: 'marquee', label: '1. 📢 Marquee', icon: Sparkles },
            { id: 'hero', label: '2. 📣 Hero & Video', icon: Video },
            { id: 'stats', label: '3. ⏱ Stats Bar', icon: Clock },
            { id: 'why', label: '4. 💡 Why Dropship', icon: Globe2 },
            { id: 'what', label: '5. 📦 What You Get', icon: Gift },
            { id: 'mentor', label: '6. 👤 Mentor Profile', icon: Award },
            { id: 'video_reviews', label: '7. 🎥 Video Reviews', icon: FileVideo },
            { id: 'who', label: '8. 🎯 Who Is This For', icon: ShieldCheck },
            { id: 'lms', label: '9. 📚 Curriculum LMS', icon: BookOpen },
            { id: 'bonuses', label: '10. 🎁 6 Bonuses', icon: Gift },
            { id: 'reviews', label: '11. 🏆 Proof Wall', icon: Award },
            { id: 'options', label: '12. ⚖️ 2 Options Left', icon: SlidersHorizontal },
            { id: 'cost', label: '13. ⏳ Cost of Waiting', icon: Clock },
            { id: 'faqs', label: '14. ❓ FAQs', icon: HelpCircle },
            { id: 'cta', label: '15. 🚀 Final CTA', icon: Sparkles },
            { id: 'contact', label: '16. 📱 Contact & Footer', icon: Globe2 },
            { id: 'payments', label: '17. 💳 Bank Accounts', icon: CreditCard },
            { id: 'themes', label: '18. 🎨 Theme Colors', icon: Palette },
            { id: 'pixels', label: '19. 🎯 Pixels & Code', icon: Settings }
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
                          onClick={() => openAddLesson(m.id)}
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
                        
                        {/* Add Lecture Sub-Form with Laptop File Upload & Live Progress Percentage */}
                        {addingLessonForModuleId === m.id && (
                          <div className="bg-[#111827] border border-[#00A0DF]/40 rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xl">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2 border-b border-white/5">
                              <h4 className="text-xs sm:text-sm font-bold text-[#00A0DF] uppercase flex items-center gap-1.5">
                                <Video size={16} />
                                <span>Add New Lecture to {m.title}</span>
                              </h4>
                              <div className="flex items-center gap-1 bg-[#0B0F19] p-1 rounded-xl border border-white/10 text-[11px] self-stretch sm:self-auto justify-center flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => setLessonVideoMode('upload')}
                                  className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                                    lessonVideoMode === 'upload' ? 'bg-[#00A0DF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  <UploadCloud size={13} />
                                  <span>Upload from Laptop</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLessonVideoMode('url')}
                                  className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                                    lessonVideoMode === 'url' ? 'bg-[#00A0DF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  <Link2 size={13} />
                                  <span>Paste Video URL</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setLessonVideoMode('embed')}
                                  className={`px-3 py-1 rounded-lg font-bold transition-colors flex items-center gap-1.5 ${
                                    lessonVideoMode === 'embed' ? 'bg-[#00A0DF] text-white shadow-sm' : 'text-slate-400 hover:text-white'
                                  }`}
                                >
                                  <Code2 size={13} />
                                  <span>Embed Code (Bunny.net)</span>
                                </button>
                              </div>
                            </div>

                            {/* Lecture Title & Duration Inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                              <div className="sm:col-span-2">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  Lecture Title
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. 1.4 Setting Up Business Manager & Pixel"
                                  value={newLessonTitle}
                                  onChange={(e) => setNewLessonTitle(e.target.value)}
                                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                  Duration (MM:SS)
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. 18:30"
                                  value={newLessonDuration}
                                  onChange={(e) => setNewLessonDuration(e.target.value)}
                                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                                />
                              </div>
                            </div>

                            {/* SOURCE 1: UPLOAD FROM LAPTOP / COMPUTER */}
                            {lessonVideoMode === 'upload' && (
                              <div className="space-y-3">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Select Video File from Computer
                                </label>

                                <div className="relative border-2 border-dashed border-[#00A0DF]/30 hover:border-[#00A0DF] bg-[#0B0F19]/90 rounded-2xl p-5 sm:p-7 text-center transition-all group cursor-pointer">
                                  <input
                                    type="file"
                                    id={`video-upload-input-${m.id}`}
                                    accept="video/mp4,video/webm,video/quicktime,video/x-m4v,video/*,.mp4,.webm,.mov,.m4v"
                                    onChange={(e) => handleVideoFileSelect(e, m.id)}
                                    disabled={uploadingVideo}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                                  />
                                  <div className="flex flex-col items-center gap-2.5 pointer-events-none">
                                    <div className="w-12 h-12 rounded-2xl bg-[#00A0DF]/15 text-[#00A0DF] flex items-center justify-center group-hover:scale-110 transition-transform">
                                      {uploadingVideo ? (
                                        <Loader2 size={24} className="animate-spin text-[#00A0DF]" />
                                      ) : videoUploadSuccess ? (
                                        <CheckCircle2 size={24} className="text-emerald-400" />
                                      ) : (
                                        <UploadCloud size={24} />
                                      )}
                                    </div>

                                    {/* Uploading with LIVE PERCENTAGE DISPLAY */}
                                    {uploadingVideo ? (
                                      <div className="w-full max-w-md space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-bold text-white flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[#00A0DF] animate-ping" />
                                            Uploading Video from Laptop...
                                          </span>
                                          <span className="font-black text-base text-[#00A0DF]">{uploadProgress}%</span>
                                        </div>
                                        
                                        {/* Animated Progress Bar */}
                                        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/10 p-0.5">
                                          <div
                                            className="h-full bg-gradient-to-r from-[#00A0DF] via-emerald-400 to-[#00A0DF] rounded-full transition-all duration-150 shadow-[0_0_12px_#00A0DF]"
                                            style={{ width: `${uploadProgress}%` }}
                                          />
                                        </div>
                                        <div className="text-[11px] text-slate-300 font-mono">
                                          {uploadStatusText}
                                        </div>
                                      </div>
                                    ) : videoUploadSuccess ? (
                                      <div className="space-y-1">
                                        <div className="text-xs sm:text-sm font-black text-emerald-400 flex items-center justify-center gap-1.5">
                                          <CheckCircle2 size={16} />
                                          <span>Video Uploaded 100%! ({selectedVideoName})</span>
                                        </div>
                                        <div className="text-[11px] text-slate-400">
                                          File Size: {selectedVideoSize} &bull; Click to choose another video
                                        </div>
                                      </div>
                                    ) : (
                                      <div>
                                        <div className="text-xs sm:text-sm font-bold text-white mb-0.5">
                                          Click to choose lecture video from your laptop, or drag &amp; drop
                                        </div>
                                        <div className="text-[11px] text-slate-400">
                                          Supports MP4, WebM, MOV, M4V (Auto-detects duration and starts upload)
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {uploadError && (
                                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
                                    ⚠️ {uploadError}
                                  </div>
                                )}

                                {/* Attached Video Link Indicator */}
                                {newLessonUrl && (
                                  <div className="p-3 rounded-xl bg-[#0B0F19] border border-white/10 flex items-center justify-between gap-2 text-xs">
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                      <FileVideo size={15} className="text-emerald-400 flex-shrink-0" />
                                      <span className="text-[11px] text-slate-300 font-mono truncate">
                                        {newLessonUrl}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex-shrink-0 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                      ✓ Ready to Save
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* SOURCE 2: PASTE EMBED / YOUTUBE URL */}
                            {lessonVideoMode === 'url' && (
                              <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  Video Embed URL or Direct Link
                                </label>
                                <input
                                  type="text"
                                  placeholder="https://www.youtube.com/watch?v=... or direct MP4 URL"
                                  value={newLessonUrl}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    if (val.includes('<iframe')) {
                                      setNewLessonUrl(parseEmbedInput(val));
                                    } else {
                                      setNewLessonUrl(val);
                                    }
                                  }}
                                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                                />
                                {newLessonUrl && (
                                  <div className="text-[11px] text-slate-400 font-mono truncate bg-[#0B0F19] p-2 rounded-lg border border-white/5 flex items-center gap-1.5">
                                    <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                                    <span className="truncate">{newLessonUrl}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* SOURCE 3: BUNNY.NET / IFRAME EMBED CODE (101% WORKABLE) */}
                            {lessonVideoMode === 'embed' && (
                              <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    Bunny.net / Iframe Embed Code or Stream URL
                                  </label>
                                  <div className="flex items-center gap-1.5 text-[10px]">
                                    <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold flex items-center gap-1">
                                      <span>🐰</span>
                                      <span>Bunny Stream 101% Compatible</span>
                                    </span>
                                  </div>
                                </div>

                                <textarea
                                  rows={4}
                                  placeholder={`Paste your Bunny.net iframe embed code or URL here:\n<iframe src="https://iframe.mediadelivery.net/embed/..." loading="lazy" style="..." allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;" allowfullscreen="true"></iframe>\n\nOr direct embed link: https://iframe.mediadelivery.net/embed/...`}
                                  value={newLessonEmbedCode}
                                  onChange={(e) => handleEmbedCodeChange(e.target.value)}
                                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-[#00A0DF] resize-y"
                                />

                                {newLessonUrl && (
                                  <div className="p-3 rounded-xl bg-[#0B0F19] border border-emerald-500/30 space-y-2 text-xs">
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                                        <span className="text-[11px] text-slate-300 font-mono truncate">
                                          {newLessonUrl}
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex-shrink-0 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                        ✓ Stream Ready
                                      </span>
                                    </div>

                                    {/* Live Mini Preview */}
                                    {newLessonUrl.startsWith('http') && (
                                      <div className="pt-2 border-t border-white/5">
                                        <div className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 flex items-center gap-1.5">
                                          <span>Live Player Preview</span>
                                          <span className="text-[9px] text-emerald-400 font-normal">(Stream verified)</span>
                                        </div>
                                        <div className="w-full aspect-video max-w-sm rounded-xl overflow-hidden border border-white/10 bg-black">
                                          <iframe
                                            src={newLessonUrl}
                                            loading="lazy"
                                            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                            allowFullScreen
                                            className="w-full h-full border-0"
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}

                                <div className="text-[11px] text-slate-400 leading-relaxed bg-[#0B0F19]/60 p-3 rounded-xl border border-white/5 space-y-1">
                                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                                    <span>💡 Bunny.net Se Embed Code Kaise Copy Karein:</span>
                                  </div>
                                  <div>1. Bunny.net Dashboard &rarr; <strong>Stream Video Library</strong> mein jayein aur video par click karein.</div>
                                  <div>2. Video page par <strong>&ldquo;Embed Code&rdquo;</strong> se poora <code>&lt;iframe ...&gt;&lt;/iframe&gt;</code> code copy karein (ya direct iframe link).</div>
                                  <div>3. Yahan box mein paste kar dein. Video automatically configure ho jayegi!</div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 justify-end pt-2 border-t border-white/5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (uploadAbortRef.current) {
                                    uploadAbortRef.current.abort();
                                  }
                                  if (uploadXhrRef.current) {
                                    uploadXhrRef.current.abort();
                                  }
                                  setAddingLessonForModuleId(null);
                                  setUploadingVideo(false);
                                  setUploadProgress(0);
                                  setNewLessonEmbedCode('');
                                  setUploadError('');
                                }}
                                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleAddLesson(m.id)}
                                disabled={uploadingVideo || !newLessonTitle || (!newLessonUrl && !newLessonEmbedCode)}
                                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-xs font-black text-white active:scale-95 transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                              >
                                {uploadingVideo ? (
                                  <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Uploading ({uploadProgress}%)</span>
                                  </>
                                ) : (
                                  <span>Save Lecture Video</span>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* List of Lectures */}
                        <div className="space-y-2">
                          {m.lessons.map((l) => {
                            const isBunny = Boolean(l.videoUrl?.includes('mediadelivery.net') || l.videoUrl?.includes('bunny'));
                            const isYouTube = Boolean(l.videoUrl?.includes('youtube') || l.videoUrl?.includes('youtu.be'));
                            const isDirect = Boolean(
                              l.videoUrl?.match(/\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i) ||
                              l.videoUrl?.includes('supabase.co/storage') ||
                              l.videoUrl?.startsWith('/uploads/') ||
                              l.videoUrl?.startsWith('/api/videos/')
                            );

                            return (
                              <div
                                key={l.id}
                                className="bg-[#111827] border border-white/5 rounded-xl sm:rounded-2xl p-3 flex items-center justify-between gap-2.5 text-xs hover:border-white/10 transition-colors"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                    isBunny ? 'bg-orange-500/15 text-orange-400' : isYouTube ? 'bg-red-500/15 text-red-400' : 'bg-[#00A0DF]/15 text-[#00A0DF]'
                                  }`}>
                                    {isBunny ? <Code2 size={14} /> : <Video size={14} />}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-white truncate flex items-center gap-1.5 flex-wrap">
                                      <span className="truncate">{l.title}</span>
                                      {isBunny && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold flex-shrink-0">
                                          🐰 Bunny.net
                                        </span>
                                      )}
                                      {isYouTube && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-bold flex-shrink-0">
                                          YouTube
                                        </span>
                                      )}
                                      {isDirect && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#00A0DF]/10 border border-[#00A0DF]/30 text-[#00A0DF] font-bold flex-shrink-0">
                                          Direct Video
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono truncate">{l.videoUrl}</div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <span className="text-slate-400 text-[11px] hidden sm:inline">{l.duration}</span>
                                  <button
                                    onClick={() => openEditLesson(m.id, l)}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                                    title="Edit Lecture (Change Video / Title)"
                                  >
                                    <Edit size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteLesson(m.id, l.id)}
                                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    title="Delete Lecture"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Edit Lesson Modal */}
            {editingLesson && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
                <div className="bg-[#111827] border border-[#00A0DF]/40 rounded-3xl p-5 sm:p-6 w-full max-w-lg space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                      <Edit size={16} className="text-[#00A0DF]" />
                      <span>Edit Lecture</span>
                    </h3>
                    <button
                      onClick={() => setEditingLesson(null)}
                      className="text-slate-400 hover:text-white p-1 rounded-lg"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Lecture Title
                      </label>
                      <input
                        type="text"
                        value={editingLesson.title}
                        onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Duration (MM:SS)
                      </label>
                      <input
                        type="text"
                        value={editingLesson.duration}
                        onChange={(e) => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>

                    {/* Video Mode Selection */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Video Source
                        </label>
                        <div className="flex items-center gap-1 bg-[#0B0F19] p-1 rounded-xl border border-white/10 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setEditingLesson({ ...editingLesson, mode: 'embed' })}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                              editingLesson.mode === 'embed' ? 'bg-[#00A0DF] text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Code2 size={12} />
                            <span>Bunny.net / Embed</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingLesson({ ...editingLesson, mode: 'url' })}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                              editingLesson.mode === 'url' ? 'bg-[#00A0DF] text-white' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            <Link2 size={12} />
                            <span>URL</span>
                          </button>
                        </div>
                      </div>

                      {editingLesson.mode === 'embed' ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            placeholder="Paste Bunny.net iframe embed code or embed URL..."
                            value={editingLesson.embedCode}
                            onChange={(e) => {
                              const val = e.target.value;
                              const parsed = parseEmbedInput(val);
                              setEditingLesson({
                                ...editingLesson,
                                embedCode: val,
                                videoUrl: parsed || editingLesson.videoUrl
                              });
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-[#00A0DF]"
                          />
                          {editingLesson.videoUrl && (
                            <div className="text-[11px] text-slate-400 font-mono truncate bg-[#0B0F19] p-2 rounded-lg border border-white/5 flex items-center gap-1.5">
                              <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                              <span className="truncate">{editingLesson.videoUrl}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="https://www.youtube.com/embed/... or direct MP4 URL"
                          value={editingLesson.videoUrl}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingLesson({
                              ...editingLesson,
                              videoUrl: val.includes('<iframe') ? parseEmbedInput(val) : val
                            });
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                        />
                      )}
                    </div>

                    {editLessonError && (
                      <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
                        ⚠️ {editLessonError}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setEditingLesson(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateLesson}
                      disabled={editLessonSaving || !editingLesson.title || !editingLesson.videoUrl}
                      className="px-5 py-2 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] disabled:opacity-40 text-xs font-black text-white transition-all shadow-md flex items-center gap-1.5"
                    >
                      {editLessonSaving ? (
                        <>
                          <Loader2 size={13} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

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
        {/* TAB 1: 1. MARQUEE ANNOUNCEMENT TICKER */}
        {/* ========================================================================= */}
        {activeTab === 'marquee' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-[#00A0DF]" />
                  <span>Top Announcement Marquee Ticker</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Edit the moving ticker items displayed at the very top of the landing page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = cmsData.marquee?.items || defaultCmsContent.marquee.items;
                  setCmsData({
                    ...cmsData,
                    marquee: {
                      ...cmsData.marquee,
                      items: [...current, 'New Announcement Ticker Item']
                    }
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00A0DF] hover:bg-[#008ec7] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Plus size={14} />
                <span>Add Ticker Item</span>
              </button>
            </div>

            <div className="space-y-3">
              {(cmsData.marquee?.items && cmsData.marquee.items.length > 0 ? cmsData.marquee.items : defaultCmsContent.marquee.items).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#0B0F19] p-2.5 rounded-xl border border-white/5">
                  <span className="text-xs font-mono text-slate-400 w-6 text-center">{idx + 1}.</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const current = [...(cmsData.marquee?.items || defaultCmsContent.marquee.items)];
                      current[idx] = e.target.value;
                      setCmsData({
                        ...cmsData,
                        marquee: { ...cmsData.marquee, items: current }
                      });
                    }}
                    className="flex-1 px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const current = (cmsData.marquee?.items || defaultCmsContent.marquee.items).filter((_, i) => i !== idx);
                      setCmsData({
                        ...cmsData,
                        marquee: { ...cmsData.marquee, items: current }
                      });
                    }}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: HERO SECTION & VIDEO */}
        {/* ========================================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4 sm:space-y-6">
              <h3 className="text-sm sm:text-lg font-bold text-white">Hero Headings, Badges &amp; Video</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Top Pill - Left Badge (Main Text)
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero?.top_pill_badge ?? ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, top_pill_badge: e.target.value } })}
                    placeholder="e.g. Pakistan’s Premier E-commerce Mentorship"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-cyan-400 font-bold focus:outline-none focus:border-[#00A0DF]"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Main text inside the top pill badge</span>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Top Pill - Right Badge (Optional)
                  </label>
                  <input
                    type="text"
                    value={cmsData.hero?.badge ?? ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, badge: e.target.value } })}
                    placeholder="Leave blank to hide completely"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                  <span className="text-[10px] text-slate-500 block mt-1">Leave blank to hide the dot • and second badge</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Program Badge (Above Headline)</label>
                  <input
                    type="text"
                    value={cmsData.hero?.program_badge ?? defaultCmsContent.hero.program_badge}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, program_badge: e.target.value } })}
                    placeholder="e.g. Ecominion Program"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Highlighted Headline Text (Cyan Blue)</label>
                  <input
                    type="text"
                    value={cmsData.hero?.title_highlight ?? ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, title_highlight: e.target.value } })}
                    placeholder="e.g. And Grow Your Business From Pakistan"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-[#00A0DF] font-bold focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Main Headline</label>
                <input
                  type="text"
                  value={cmsData.hero?.title_line1 ?? ''}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, title_line1: e.target.value } })}
                  placeholder="e.g. Learn Local Dropshipping and Build Your Own Brand"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Sub-headline Description</label>
                <textarea
                  rows={2}
                  value={cmsData.hero?.subtitle ?? ''}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, subtitle: e.target.value } })}
                  placeholder="Type description, or leave completely blank to remove from homepage"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none"
                />
                <span className="text-[10px] text-slate-500 block mt-1">If left blank, no subtitle will appear on the homepage</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Video Box Header Label</label>
                <input
                  type="text"
                  value={cmsData.hero?.video_header ?? defaultCmsContent.hero.video_header}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, video_header: e.target.value } })}
                  placeholder="Watch Sami explain the entire 2026 dropshipping blueprint"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>

              {/* Preview Video Settings with Direct File Upload */}
              <div className="bg-[#0B0F19] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#00A0DF]">
                    <Video size={16} />
                    <span>Homepage Video Settings (Upload from Laptop or Paste Link)</span>
                  </div>
                  {cmsData.hero?.video_url && (
                    <span className="text-[10px] sm:text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                      <CheckCircle2 size={12} />
                      <span>Active Video Set</span>
                    </span>
                  )}
                </div>

                {/* Direct Upload Box from Laptop / Device */}
                <div className="p-4 rounded-xl bg-[#111827] border border-white/10 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                        <UploadCloud size={16} className="text-[#00A0DF]" />
                        <span>Upload Video File directly from Laptop</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Upload your MP4, WebM or MOV video. It will be permanently stored and streamed directly on the homepage.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input
                        ref={heroFileInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov"
                        className="hidden"
                        onChange={handleHeroVideoSelect}
                      />
                      <button
                        type="button"
                        onClick={() => heroFileInputRef.current?.click()}
                        disabled={heroUploading}
                        className="px-4 py-2 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] disabled:opacity-50 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
                      >
                        {heroUploading ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <UploadCloud size={14} />
                            <span>Select Video File</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Upload Progress Bar */}
                  {heroUploading && (
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <div className="flex justify-between text-xs text-slate-300 font-mono">
                        <span className="truncate pr-2">{heroUploadStatus}</span>
                        <span className="font-bold text-[#00A0DF]">{heroUploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#00A0DF] transition-all duration-200"
                          style={{ width: `${heroUploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {heroUploadSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={15} />
                      <span>{heroUploadStatus || 'Video file uploaded successfully and set for homepage!'}</span>
                    </div>
                  )}

                  {heroUploadError && (
                    <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
                      ⚠️ {heroUploadError}
                    </div>
                  )}
                </div>

                {/* Video URL & Overlay Title Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Video Stream URL (Auto-filled on upload or paste link)
                    </label>
                    <input
                      type="text"
                      value={cmsData.hero?.video_url ?? ''}
                      onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, video_url: e.target.value } })}
                      placeholder="e.g. /api/videos/hero_... or https://www.youtube.com/embed/..."
                      className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Overlay Title</label>
                    <input
                      type="text"
                      value={cmsData.hero?.video_title ?? ''}
                      onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, video_title: e.target.value } })}
                      placeholder="e.g. Watch Sami Explain the Entire Model..."
                      className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                </div>

                {/* Live In-CMS Video Preview Player */}
                {cmsData.hero?.video_url && (
                  <div className="p-3 rounded-xl bg-[#111827] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Eye size={12} className="text-[#00A0DF]" />
                        <span>Live Video Preview (How it will play for students)</span>
                      </span>
                      <span className="font-mono text-[10px] truncate max-w-[200px] sm:max-w-xs">{cmsData.hero.video_url}</span>
                    </div>
                    <div className="max-w-md mx-auto aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-md">
                      {cmsData.hero.video_url.includes('youtube.com') || cmsData.hero.video_url.includes('youtu.be') ? (
                        <iframe
                          src={cmsData.hero.video_url.includes('embed') ? cmsData.hero.video_url : `https://www.youtube.com/embed/${cmsData.hero.video_url.split('v=')[1]?.split('&')[0] || ''}`}
                          title="Preview"
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      ) : (
                        <video
                          src={cmsData.hero.video_url}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Discount Price</label>
                  <input
                    type="text"
                    value={cmsData.hero?.current_price ?? ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, current_price: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm font-black text-emerald-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Original Price</label>
                  <input
                    type="text"
                    value={cmsData.hero?.original_price ?? ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, original_price: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-red-400 line-through focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Button CTA Text</label>
                  <input
                    type="text"
                    value={cmsData.hero?.cta_text ?? ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, cta_text: e.target.value } })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Trusted By Social Proof Text (Under CTA Button)</label>
                <input
                  type="text"
                  value={cmsData.hero?.trusted_text ?? defaultCmsContent.hero.trusted_text}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, trusted_text: e.target.value } })}
                  placeholder="Join 2,500+ successful Pakistani students earning in PKR & USD"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB: MENTOR PROFILE MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'mentor' && (
          <div className="space-y-6 sm:space-y-8">
            
            {/* Header Card */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div>
                <h2 className="text-base sm:text-2xl font-black text-white flex items-center gap-2">
                  <Award size={22} className="text-[#00A0DF]" />
                  <span>Mentor Profile &amp; Identity Management</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Control mentor photo (upload directly or paste URL), name, badge, bio, benefits checklist, stats counters, and philosophy. Updates live across Homepage &amp; About page.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveAll}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-[#00A0DF]/30 transition-all active:scale-95 flex-shrink-0"
              >
                <Save size={14} />
                <span>{loading ? 'Saving...' : 'Save Mentor Profile'}</span>
              </button>
            </div>

            {/* Main Content Grid: Left Picture/Preview + Right Profile Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Photo & Live Preview (lg:col-span-5) */}
              <div className="lg:col-span-5 bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl flex flex-col items-center text-center">
                <div className="w-full text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00A0DF] bg-[#00A0DF]/10 px-2.5 py-1 rounded-md border border-[#00A0DF]/20">
                    Live Visual Preview
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-white mt-1.5">Mentor Avatar &amp; Card</h3>
                </div>

                {/* Visual Avatar Card Mockup (Exact Homepage Look) */}
                <div className="w-full max-w-xs bg-[#0B0F19] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-3xl bg-gradient-to-tr from-[#00A0DF] to-emerald-400 p-1.5 shadow-2xl mb-4 overflow-hidden">
                    <img
                      src={cmsData.mentor?.image || '/images/sami-logo.jpg'}
                      alt={cmsData.mentor?.name || 'Mentor Sami'}
                      className="w-full h-full rounded-2xl object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = '/images/sami-logo.jpg'; }}
                    />
                  </div>
                  <span className="inline-flex items-center gap-1.5 bg-[#00A0DF]/20 text-[#00A0DF] border border-[#00A0DF]/30 text-[11px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider mb-2">
                    <Star size={11} className="fill-[#00A0DF]" />
                    <span>{cmsData.mentor?.badge || 'Digital Marketing Expert'}</span>
                  </span>
                  <h4 className="text-base font-black text-white">
                    {cmsData.mentor?.name || 'Muhammad Sami'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {cmsData.mentor?.title || 'Top E-Commerce Mentor & GCC Dropshipping Expert'}
                  </p>
                </div>

                {/* Upload & Image URL Controls */}
                <div className="w-full space-y-3 pt-3 border-t border-white/10 text-left">
                  <label className="block text-xs font-bold text-white">
                    Upload New Mentor Picture
                  </label>
                  
                  {/* File Upload Button */}
                  <div className="flex items-center gap-2">
                    <input
                      ref={mentorFileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      className="hidden"
                      onChange={handleMentorImageUpload}
                    />
                    <button
                      type="button"
                      onClick={() => mentorFileInputRef.current?.click()}
                      disabled={mentorUploading}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] disabled:opacity-50 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#00A0DF]/20 cursor-pointer active:scale-95"
                    >
                      {mentorUploading ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          <span>Uploading Picture...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={15} />
                          <span>Choose Picture from Device</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Upload Progress */}
                  {mentorUploading && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300 font-mono">
                        <span className="truncate pr-2">{mentorUploadStatus}</span>
                        <span className="font-bold text-[#00A0DF]">{mentorUploadProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#00A0DF] to-emerald-400 transition-all duration-200"
                          style={{ width: `${mentorUploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {mentorUploadError && (
                    <p className="text-xs text-red-400 font-medium">{mentorUploadError}</p>
                  )}

                  {/* Manual Image URL Input */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Or Paste Direct Image URL:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://... or /images/sami-logo.jpg"
                      value={cmsData.mentor?.image ?? ''}
                      onChange={(e) => setCmsData({
                        ...cmsData,
                        mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), image: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>

                  {/* Reset to Default Image */}
                  <button
                    type="button"
                    onClick={() => setCmsData({
                      ...cmsData,
                      mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), image: '/images/sami-logo.jpg' }
                    })}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={11} />
                    <span>Reset to default logo photo</span>
                  </button>
                </div>

              </div>

              {/* Right Column: Identity, Bio, Stats, Benefits (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Identity Inputs */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-[#00A0DF]" />
                    <span>Identity &amp; Titles</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Mentor Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Muhammad Sami"
                        value={cmsData.mentor?.name ?? ''}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), name: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Badge Under Photo</label>
                      <input
                        type="text"
                        placeholder="e.g. Digital Marketing Expert"
                        value={cmsData.mentor?.badge ?? ''}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), badge: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Section Tag Pill</label>
                      <input
                        type="text"
                        placeholder="e.g. YOUR MENTOR"
                        value={cmsData.mentor?.tag ?? ''}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), tag: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Professional Title / Role</label>
                      <input
                        type="text"
                        placeholder="e.g. Top E-Commerce Mentor & GCC Dropshipping Expert"
                        value={cmsData.mentor?.title ?? ''}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), title: e.target.value }
                        })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Short Bio / Subtitle (Homepage Mentor Card)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. You don't just need the right mentor — you need the right community too..."
                      value={cmsData.mentor?.bio ?? ''}
                      onChange={(e) => setCmsData({
                        ...cmsData,
                        mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), bio: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">
                      Mentor Core Quote (About Page &amp; Philosophy)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. You Don't Need Millions To Start. You Just Need A Proven Step-by-Step Blueprint."
                      value={cmsData.mentor?.quote ?? ''}
                      onChange={(e) => setCmsData({
                        ...cmsData,
                        mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), quote: e.target.value }
                      })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-amber-400 font-medium focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>

                </div>

                {/* 3 Stat Counters */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <Clock size={16} className="text-[#00A0DF]" />
                    <span>3 Credibility &amp; Stat Counters</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Stat 1 */}
                    <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-white/5 space-y-2">
                      <label className="block text-[11px] font-bold text-[#00A0DF]">Stat #1 (Blue)</label>
                      <input
                        type="text"
                        placeholder="e.g. 9,700+"
                        value={cmsData.mentor?.stat1_value ?? cmsData.mentor?.students_count ?? ''}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          mentor: { 
                            ...(cmsData.mentor || defaultCmsContent.mentor), 
                            stat1_value: e.target.value,
                            students_count: e.target.value 
                          }
                        })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-white/10 text-xs font-black text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Label: Students mentored"
                        value={cmsData.mentor?.stat1_label ?? ''}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), stat1_label: e.target.value }
                        })}
                        className="w-full px-2.5 py-1 rounded-lg bg-[#111827] border border-white/5 text-[11px] text-slate-300 focus:outline-none"
                      />
                    </div>

                    {/* Stat 2 */}
                    <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-white/5 space-y-2">
                      <label className="block text-[11px] font-bold text-emerald-400">Stat #2 (Green)</label>
                      <input
                        type="text"
                        placeholder="e.g. UAE & KSA"
                        value={cmsData.mentor?.stat2_value ?? ''}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), stat2_value: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-white/10 text-xs font-black text-emerald-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Label: Market focus"
                        value={cmsData.mentor?.stat2_label ?? ''}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), stat2_label: e.target.value }
                        })}
                        className="w-full px-2.5 py-1 rounded-lg bg-[#111827] border border-white/5 text-[11px] text-slate-300 focus:outline-none"
                      />
                    </div>

                    {/* Stat 3 */}
                    <div className="bg-[#0B0F19] p-3.5 rounded-xl border border-white/5 space-y-2">
                      <label className="block text-[11px] font-bold text-amber-400">Stat #3 (Gold)</label>
                      <input
                        type="text"
                        placeholder="e.g. Lifetime"
                        value={cmsData.mentor?.stat3_value ?? ''}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), stat3_value: e.target.value }
                        })}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#111827] border border-white/10 text-xs font-black text-amber-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Label: Access & support"
                        value={cmsData.mentor?.stat3_label ?? ''}
                        onChange={(e) => setCmsData({
                          ...cmsData,
                          mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), stat3_label: e.target.value }
                        })}
                        className="w-full px-2.5 py-1 rounded-lg bg-[#111827] border border-white/5 text-[11px] text-slate-300 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits Checklist */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-400" />
                        <span>Key Mentorship Benefits Checklist</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">Green checkmark points displayed in the mentor card</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddMentorBenefit}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 active:scale-95"
                    >
                      <Plus size={13} />
                      <span>Add Benefit</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {((cmsData.mentor?.benefits && cmsData.mentor.benefits.length > 0) 
                      ? cmsData.mentor.benefits 
                      : (defaultCmsContent.mentor.benefits || [])
                    ).map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 bg-[#0B0F19] p-2 rounded-xl border border-white/5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                          ✓
                        </span>
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => handleUpdateMentorBenefit(bIdx, e.target.value)}
                          className="flex-1 bg-transparent text-xs sm:text-sm text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteMentorBenefit(bIdx)}
                          className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                          title="Delete benefit"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Story (About Page) */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-3 shadow-xl">
                  <h3 className="text-sm sm:text-base font-black text-white">
                    Detailed Story &amp; Vision (Displayed on /about page)
                  </h3>
                  <p className="text-[11px] text-slate-400">Separate paragraphs with a blank double line.</p>
                  <textarea
                    rows={5}
                    placeholder="Enter the full backstory and philosophy of mentor Sami..."
                    value={cmsData.mentor?.story ?? ''}
                    onChange={(e) => setCmsData({
                      ...cmsData,
                      mentor: { ...(cmsData.mentor || defaultCmsContent.mentor), story: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] leading-relaxed"
                  />
                </div>

              </div>

            </div>

          </div>
        )}
        {activeTab === 'stats' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-4">
            <h3 className="text-sm sm:text-lg font-bold text-white">4 Platform Stats Row</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Box 1: Training Hours</label>
                <input
                  type="text"
                  value={cmsData.stats?.training_hours ?? ''}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, training_hours: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Box 2: Lectures Count</label>
                <input
                  type="text"
                  value={cmsData.stats?.lectures_count ?? ''}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, lectures_count: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Box 3: Access Type</label>
                <input
                  type="text"
                  value={cmsData.stats?.access_type ?? ''}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, access_type: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Box 4: Mentorship Type</label>
                <input
                  type="text"
                  value={cmsData.stats?.mentorship_type ?? ''}
                  onChange={(e) => setCmsData({ ...cmsData, stats: { ...cmsData.stats, mentorship_type: e.target.value } })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: 4. WHY DROPSHIPPING 2026 */}
        {/* ========================================================================= */}
        {activeTab === 'why' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
                <Globe2 size={18} className="text-[#00A0DF]" />
                <span>Why Dropshipping in 2026 Section</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Manage header, badge, and the 3 core advantages cards.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={cmsData.why_dropshipping?.badge ?? defaultCmsContent.why_dropshipping.badge}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    why_dropshipping: { ...(cmsData.why_dropshipping || defaultCmsContent.why_dropshipping), badge: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Title</label>
                <input
                  type="text"
                  value={cmsData.why_dropshipping?.title ?? defaultCmsContent.why_dropshipping.title}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    why_dropshipping: { ...(cmsData.why_dropshipping || defaultCmsContent.why_dropshipping), title: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Section Subtitle</label>
              <textarea
                rows={2}
                value={cmsData.why_dropshipping?.subtitle ?? defaultCmsContent.why_dropshipping.subtitle}
                onChange={(e) => setCmsData({
                  ...cmsData,
                  why_dropshipping: { ...(cmsData.why_dropshipping || defaultCmsContent.why_dropshipping), subtitle: e.target.value }
                })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none"
              />
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">3 Value Cards</h4>
              {(cmsData.why_dropshipping?.items || defaultCmsContent.why_dropshipping.items).map((item, idx) => (
                <div key={idx} className="bg-[#0B0F19] p-4 rounded-xl border border-white/10 space-y-3">
                  <div className="text-xs font-bold text-[#00A0DF]">Card {idx + 1}</div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Card Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const current = [...(cmsData.why_dropshipping?.items || defaultCmsContent.why_dropshipping.items)];
                        current[idx] = { ...current[idx], title: e.target.value };
                        setCmsData({
                          ...cmsData,
                          why_dropshipping: { ...(cmsData.why_dropshipping || defaultCmsContent.why_dropshipping), items: current }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Card Description</label>
                    <textarea
                      rows={2}
                      value={item.desc}
                      onChange={(e) => {
                        const current = [...(cmsData.why_dropshipping?.items || defaultCmsContent.why_dropshipping.items)];
                        current[idx] = { ...current[idx], desc: e.target.value };
                        setCmsData({
                          ...cmsData,
                          why_dropshipping: { ...(cmsData.why_dropshipping || defaultCmsContent.why_dropshipping), items: current }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF] resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: 5. WHAT YOU GET IN THE PROGRAM */}
        {/* ========================================================================= */}
        {activeTab === 'what' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
                  <Gift size={18} className="text-[#00A0DF]" />
                  <span>What You Get in the Program</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Manage header, badge, and the core benefits/deliverables list.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = cmsData.what_you_get?.items || defaultCmsContent.what_you_get.items;
                  setCmsData({
                    ...cmsData,
                    what_you_get: {
                      ...(cmsData.what_you_get || defaultCmsContent.what_you_get),
                      items: [...current, { title: 'New Deliverable Feature', desc: 'Detailed explanation of what the student receives.' }]
                    }
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00A0DF] hover:bg-[#008ec7] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Plus size={14} />
                <span>Add Item</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={cmsData.what_you_get?.badge ?? defaultCmsContent.what_you_get.badge}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    what_you_get: { ...(cmsData.what_you_get || defaultCmsContent.what_you_get), badge: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Title</label>
                <input
                  type="text"
                  value={cmsData.what_you_get?.title ?? defaultCmsContent.what_you_get.title}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    what_you_get: { ...(cmsData.what_you_get || defaultCmsContent.what_you_get), title: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Section Subtitle</label>
              <textarea
                rows={2}
                value={cmsData.what_you_get?.subtitle ?? defaultCmsContent.what_you_get.subtitle}
                onChange={(e) => setCmsData({
                  ...cmsData,
                  what_you_get: { ...(cmsData.what_you_get || defaultCmsContent.what_you_get), subtitle: e.target.value }
                })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none"
              />
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Program Deliverables</h4>
              {(cmsData.what_you_get?.items || defaultCmsContent.what_you_get.items).map((item, idx) => (
                <div key={idx} className="bg-[#0B0F19] p-4 rounded-xl border border-white/10 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00A0DF]">Deliverable #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const current = (cmsData.what_you_get?.items || defaultCmsContent.what_you_get.items).filter((_, i) => i !== idx);
                        setCmsData({
                          ...cmsData,
                          what_you_get: { ...(cmsData.what_you_get || defaultCmsContent.what_you_get), items: current }
                        });
                      }}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Title</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const current = [...(cmsData.what_you_get?.items || defaultCmsContent.what_you_get.items)];
                        current[idx] = { ...current[idx], title: e.target.value };
                        setCmsData({
                          ...cmsData,
                          what_you_get: { ...(cmsData.what_you_get || defaultCmsContent.what_you_get), items: current }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={item.desc}
                      onChange={(e) => {
                        const current = [...(cmsData.what_you_get?.items || defaultCmsContent.what_you_get.items)];
                        current[idx] = { ...current[idx], desc: e.target.value };
                        setCmsData({
                          ...cmsData,
                          what_you_get: { ...(cmsData.what_you_get || defaultCmsContent.what_you_get), items: current }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF] resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: 7. VIDEO REVIEWS (CONTINUOUS STREAM) */}
        {/* ========================================================================= */}
        {activeTab === 'video_reviews' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
                  <FileVideo size={18} className="text-[#00A0DF]" />
                  <span>Student Video Reviews (Continuous Stream)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage the moving video review cards displayed on the landing page stream.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = cmsData.video_reviews?.items || defaultCmsContent.video_reviews.items;
                  setCmsData({
                    ...cmsData,
                    video_reviews: {
                      ...(cmsData.video_reviews || defaultCmsContent.video_reviews),
                      items: [
                        ...current,
                        {
                          headline: 'New Student Success Story',
                          author: 'Student Name',
                          result: 'Rs. 500,000+ Revenue',
                          market: '🇵🇰 Pakistan Local Dropship',
                          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                          stars: 5
                        }
                      ]
                    }
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00A0DF] hover:bg-[#008ec7] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Plus size={14} />
                <span>Add Video Review</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={cmsData.video_reviews?.badge ?? defaultCmsContent.video_reviews.badge}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    video_reviews: { ...(cmsData.video_reviews || defaultCmsContent.video_reviews), badge: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Title</label>
                <input
                  type="text"
                  value={cmsData.video_reviews?.title ?? defaultCmsContent.video_reviews.title}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    video_reviews: { ...(cmsData.video_reviews || defaultCmsContent.video_reviews), title: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Section Subtitle</label>
              <textarea
                rows={2}
                value={cmsData.video_reviews?.subtitle ?? defaultCmsContent.video_reviews.subtitle}
                onChange={(e) => setCmsData({
                  ...cmsData,
                  video_reviews: { ...(cmsData.video_reviews || defaultCmsContent.video_reviews), subtitle: e.target.value }
                })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none"
              />
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Video Review Cards</h4>
              {(cmsData.video_reviews?.items || defaultCmsContent.video_reviews.items).map((item, idx) => (
                <div key={idx} className="bg-[#0B0F19] p-4 rounded-xl border border-white/10 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00A0DF]">Video #{idx + 1} — {item.author}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const current = (cmsData.video_reviews?.items || defaultCmsContent.video_reviews.items).filter((_, i) => i !== idx);
                        setCmsData({
                          ...cmsData,
                          video_reviews: { ...(cmsData.video_reviews || defaultCmsContent.video_reviews), items: current }
                        });
                      }}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Headline Result</label>
                      <input
                        type="text"
                        value={item.headline}
                        onChange={(e) => {
                          const current = [...(cmsData.video_reviews?.items || defaultCmsContent.video_reviews.items)];
                          current[idx] = { ...current[idx], headline: e.target.value };
                          setCmsData({
                            ...cmsData,
                            video_reviews: { ...(cmsData.video_reviews || defaultCmsContent.video_reviews), items: current }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Author Name</label>
                      <input
                        type="text"
                        value={item.author}
                        onChange={(e) => {
                          const current = [...(cmsData.video_reviews?.items || defaultCmsContent.video_reviews.items)];
                          current[idx] = { ...current[idx], author: e.target.value };
                          setCmsData({
                            ...cmsData,
                            video_reviews: { ...(cmsData.video_reviews || defaultCmsContent.video_reviews), items: current }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Sales Stat / Result</label>
                      <input
                        type="text"
                        value={item.result}
                        onChange={(e) => {
                          const current = [...(cmsData.video_reviews?.items || defaultCmsContent.video_reviews.items)];
                          current[idx] = { ...current[idx], result: e.target.value };
                          setCmsData({
                            ...cmsData,
                            video_reviews: { ...(cmsData.video_reviews || defaultCmsContent.video_reviews), items: current }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-emerald-400 font-bold focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Market Tag</label>
                      <input
                        type="text"
                        value={item.market}
                        onChange={(e) => {
                          const current = [...(cmsData.video_reviews?.items || defaultCmsContent.video_reviews.items)];
                          current[idx] = { ...current[idx], market: e.target.value };
                          setCmsData({
                            ...cmsData,
                            video_reviews: { ...(cmsData.video_reviews || defaultCmsContent.video_reviews), items: current }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Embed Video URL</label>
                      <input
                        type="text"
                        value={item.videoUrl}
                        onChange={(e) => {
                          const current = [...(cmsData.video_reviews?.items || defaultCmsContent.video_reviews.items)];
                          current[idx] = { ...current[idx], videoUrl: e.target.value };
                          setCmsData({
                            ...cmsData,
                            video_reviews: { ...(cmsData.video_reviews || defaultCmsContent.video_reviews), items: current }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF] font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: 8. WHO IS THIS FOR */}
        {/* ========================================================================= */}
        {activeTab === 'who' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#00A0DF]" />
                  <span>Who Is This Program For Section</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage section header, badge, and the target audience qualification cards.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = cmsData.who_is_this_for?.items || defaultCmsContent.who_is_this_for.items;
                  setCmsData({
                    ...cmsData,
                    who_is_this_for: {
                      ...(cmsData.who_is_this_for || defaultCmsContent.who_is_this_for),
                      items: [
                        ...current,
                        {
                          title: 'New Audience Category',
                          highlight: 'Best For Ambition',
                          desc: 'Description of why this training is ideal for this specific background.'
                        }
                      ]
                    }
                  });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#00A0DF] hover:bg-[#008ec7] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                <Plus size={14} />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={cmsData.who_is_this_for?.badge ?? defaultCmsContent.who_is_this_for.badge}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    who_is_this_for: { ...(cmsData.who_is_this_for || defaultCmsContent.who_is_this_for), badge: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Title</label>
                <input
                  type="text"
                  value={cmsData.who_is_this_for?.title ?? defaultCmsContent.who_is_this_for.title}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    who_is_this_for: { ...(cmsData.who_is_this_for || defaultCmsContent.who_is_this_for), title: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Section Subtitle</label>
              <textarea
                rows={2}
                value={cmsData.who_is_this_for?.subtitle ?? defaultCmsContent.who_is_this_for.subtitle}
                onChange={(e) => setCmsData({
                  ...cmsData,
                  who_is_this_for: { ...(cmsData.who_is_this_for || defaultCmsContent.who_is_this_for), subtitle: e.target.value }
                })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none"
              />
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Audience Cards</h4>
              {(cmsData.who_is_this_for?.items || defaultCmsContent.who_is_this_for.items).map((item, idx) => (
                <div key={idx} className="bg-[#0B0F19] p-4 rounded-xl border border-white/10 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#00A0DF]">Card #{idx + 1} — {item.title}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const current = (cmsData.who_is_this_for?.items || defaultCmsContent.who_is_this_for.items).filter((_, i) => i !== idx);
                        setCmsData({
                          ...cmsData,
                          who_is_this_for: { ...(cmsData.who_is_this_for || defaultCmsContent.who_is_this_for), items: current }
                        });
                      }}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Target Title (e.g. Job Holders &amp; 9-to-5)</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const current = [...(cmsData.who_is_this_for?.items || defaultCmsContent.who_is_this_for.items)];
                          current[idx] = { ...current[idx], title: e.target.value };
                          setCmsData({
                            ...cmsData,
                            who_is_this_for: { ...(cmsData.who_is_this_for || defaultCmsContent.who_is_this_for), items: current }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Highlight Badge (e.g. Low Risk)</label>
                      <input
                        type="text"
                        value={item.highlight}
                        onChange={(e) => {
                          const current = [...(cmsData.who_is_this_for?.items || defaultCmsContent.who_is_this_for.items)];
                          current[idx] = { ...current[idx], highlight: e.target.value };
                          setCmsData({
                            ...cmsData,
                            who_is_this_for: { ...(cmsData.who_is_this_for || defaultCmsContent.who_is_this_for), items: current }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-emerald-400 font-bold focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={item.desc}
                      onChange={(e) => {
                        const current = [...(cmsData.who_is_this_for?.items || defaultCmsContent.who_is_this_for.items)];
                        current[idx] = { ...current[idx], desc: e.target.value };
                        setCmsData({
                          ...cmsData,
                          who_is_this_for: { ...(cmsData.who_is_this_for || defaultCmsContent.who_is_this_for), items: current }
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF] resize-none"
                    />
                  </div>
                </div>
              ))}
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
        {/* TAB 4: REVIEWS & SCREENSHOT RESULTS                                       */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-5 sm:space-y-6">
            
            {/* Sub-Tab Navigation Switcher */}
            <div className="flex items-center gap-2 p-1.5 bg-[#111827] border border-white/10 rounded-2xl max-w-md">
              <button
                type="button"
                onClick={() => setReviewSubTab('screenshots')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  reviewSubTab === 'screenshots'
                    ? 'bg-[#00A0DF] text-white shadow-lg shadow-[#00A0DF]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>📸 Screenshot Reviews</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded-full">
                  {(cmsData.screenshot_reviews?.images || defaultCmsContent.screenshot_reviews?.images || []).length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setReviewSubTab('text')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  reviewSubTab === 'text'
                    ? 'bg-[#00A0DF] text-white shadow-lg shadow-[#00A0DF]/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>💬 Text Testimonials</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded-full">
                  {cmsData.testimonials.length}
                </span>
              </button>
            </div>

            {/* SUB-TAB 1: SCREENSHOT REVIEWS FOR CHECKOUT / ENROLLMENT */}
            {reviewSubTab === 'screenshots' && (
              <div className="space-y-5">
                
                {/* Section Header & Settings Box */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                    <div>
                      <h3 className="text-sm sm:text-lg font-black text-white flex items-center gap-2">
                        <span>Checkout Screenshot Reviews</span>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                          LearnWithAfaq Marquee
                        </span>
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                        These real WhatsApp chats and store earning screenshots scroll vertically on the checkout page.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAll}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex-shrink-0"
                    >
                      <Save size={14} />
                      <span>{loading ? 'Saving...' : 'Save Reviews Changes'}</span>
                    </button>
                  </div>

                  {/* Title & Subtitle Config */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Pill Badge
                      </label>
                      <input
                        type="text"
                        value={cmsData.screenshot_reviews?.badge || 'REAL STUDENT RESULTS'}
                        onChange={(e) => {
                          const current = cmsData.screenshot_reviews || defaultCmsContent.screenshot_reviews!;
                          setCmsData({
                            ...cmsData,
                            screenshot_reviews: { ...current, badge: e.target.value }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Section Heading
                      </label>
                      <input
                        type="text"
                        value={cmsData.screenshot_reviews?.title || 'Join 9,700+ Happy Students'}
                        onChange={(e) => {
                          const current = cmsData.screenshot_reviews || defaultCmsContent.screenshot_reviews!;
                          setCmsData({
                            ...cmsData,
                            screenshot_reviews: { ...current, title: e.target.value }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={cmsData.screenshot_reviews?.subtitle || 'Real, unedited screenshots from our students — results & feedback.'}
                        onChange={(e) => {
                          const current = cmsData.screenshot_reviews || defaultCmsContent.screenshot_reviews!;
                          setCmsData({
                            ...cmsData,
                            screenshot_reviews: { ...current, subtitle: e.target.value }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                  </div>

                  {/* UPLOAD SCREENSHOTS FROM COMPUTER */}
                  <div className="pt-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Upload New Screenshot Reviews (From Laptop or Phone)
                    </label>

                    <div className="relative border-2 border-dashed border-[#00A0DF]/30 hover:border-[#00A0DF] bg-[#0B0F19] rounded-2xl p-5 sm:p-7 text-center transition-all group cursor-pointer">
                      <input
                        ref={screenshotFileInputRef}
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp,image/jpg"
                        onChange={handleScreenshotUpload}
                        disabled={screenshotUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                      />
                      <div className="flex flex-col items-center gap-2 pointer-events-none">
                        <div className="w-12 h-12 rounded-2xl bg-[#00A0DF]/15 text-[#00A0DF] flex items-center justify-center group-hover:scale-110 transition-transform">
                          {screenshotUploading ? (
                            <Loader2 size={24} className="animate-spin text-[#00A0DF]" />
                          ) : (
                            <UploadCloud size={24} />
                          )}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white mb-0.5">
                            {screenshotUploading ? screenshotUploadStatus : 'Click to select screenshots, or drag & drop images here'}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Supports multiple PNG, JPG, WebP (WhatsApp screenshots, store earnings proof)
                          </div>
                        </div>
                      </div>
                    </div>

                    {screenshotUploadError && (
                      <div className="p-3 mt-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
                        ⚠️ {screenshotUploadError}
                      </div>
                    )}

                    {screenshotUploadStatus && !screenshotUploading && (
                      <div className="p-3 mt-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 size={16} />
                        <span>{screenshotUploadStatus}</span>
                      </div>
                    )}

                    {/* Manual Image URL Adder */}
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Or paste direct image URL (https://...)"
                        value={newScreenshotUrl}
                        onChange={(e) => setNewScreenshotUrl(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                      <button
                        type="button"
                        onClick={handleAddScreenshotUrl}
                        className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 text-xs font-bold border border-white/10 flex-shrink-0"
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* CURRENT ACTIVE SCREENSHOTS GALLERY */}
                <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                        Active Reviews ({ (cmsData.screenshot_reviews?.images || defaultCmsContent.screenshot_reviews?.images || []).length })
                      </h4>
                      <span className="text-[10px] text-slate-400 hidden sm:inline">
                        • Recommended: 15–20 for smooth infinite looping
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSaveAll}
                      disabled={loading}
                      className="px-3.5 py-1.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-white text-xs font-bold active:scale-95"
                    >
                      {loading ? 'Saving...' : 'Save Order'}
                    </button>
                  </div>

                  {/* Grid of Screenshot Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {(cmsData.screenshot_reviews?.images || defaultCmsContent.screenshot_reviews?.images || []).map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative bg-[#0B0F19] border border-white/10 hover:border-[#00A0DF]/60 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col"
                      >
                        {/* Image Preview */}
                        <div className="relative aspect-[9/16] w-full bg-slate-950 overflow-hidden">
                          <img
                            src={imgUrl}
                            alt={`Review ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />

                          {/* Index Badge */}
                          <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-black text-white border border-white/20">
                            #{idx + 1}
                          </span>

                          {/* Top-Right Delete Action */}
                          <button
                            type="button"
                            onClick={() => handleDeleteScreenshot(idx)}
                            className="absolute top-1.5 right-1.5 p-1.5 rounded-md bg-red-600/80 hover:bg-red-600 text-white transition-colors shadow-md"
                            title="Delete this screenshot"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        {/* Card Footer with Reorder Controls */}
                        <div className="p-1.5 bg-[#111827] border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleMoveScreenshot(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-[#0B0F19] hover:bg-slate-800 disabled:opacity-30 text-slate-300 text-[10px] font-bold"
                              title="Move Left/Up"
                            >
                              ◀
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveScreenshot(idx, 'down')}
                              disabled={idx === (cmsData.screenshot_reviews?.images || []).length - 1}
                              className="p-1 rounded bg-[#0B0F19] hover:bg-slate-800 disabled:opacity-30 text-slate-300 text-[10px] font-bold"
                              title="Move Right/Down"
                            >
                              ▶
                            </button>
                          </div>

                          <a
                            href={imgUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-[#00A0DF] p-1"
                            title="View Full Size"
                          >
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveAll}
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                    >
                      <Save size={15} />
                      <span>{loading ? 'Saving...' : 'Save All Screenshot Reviews'}</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* SUB-TAB 2: ORIGINAL TEXT TESTIMONIALS */}
            {reviewSubTab === 'text' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-3">
                  <h3 className="text-sm sm:text-lg font-bold text-white">Add New Text Testimonial</h3>
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

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 12: 12. 2 OPTIONS LEFT (DIY VS SAMI SHORTCUT) */}
        {/* ========================================================================= */}
        {activeTab === 'options' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#00A0DF]" />
                <span>2 Options Comparison Section</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage the side-by-side comparison between DIY trial &amp; error and Sami's direct mentorship shortcut.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={cmsData.options_comparison?.badge ?? defaultCmsContent.options_comparison.badge}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    options_comparison: { ...(cmsData.options_comparison || defaultCmsContent.options_comparison), badge: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Title</label>
                <input
                  type="text"
                  value={cmsData.options_comparison?.title ?? defaultCmsContent.options_comparison.title}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    options_comparison: { ...(cmsData.options_comparison || defaultCmsContent.options_comparison), title: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Section Subtitle</label>
              <textarea
                rows={2}
                value={cmsData.options_comparison?.subtitle ?? defaultCmsContent.options_comparison.subtitle}
                onChange={(e) => setCmsData({
                  ...cmsData,
                  options_comparison: { ...(cmsData.options_comparison || defaultCmsContent.options_comparison), subtitle: e.target.value }
                })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none"
              />
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B0F19] border border-white/5">
              <div className="space-y-2">
                <div className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <span>❌ Column 1: DIY / Hard Road</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Badge Title</label>
                  <input
                    type="text"
                    value={cmsData.options_comparison?.diy_badge ?? defaultCmsContent.options_comparison.diy_badge}
                    onChange={(e) => setCmsData({
                      ...cmsData,
                      options_comparison: { ...(cmsData.options_comparison || defaultCmsContent.options_comparison), diy_badge: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-red-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={cmsData.options_comparison?.diy_subtitle ?? defaultCmsContent.options_comparison.diy_subtitle}
                    onChange={(e) => setCmsData({
                      ...cmsData,
                      options_comparison: { ...(cmsData.options_comparison || defaultCmsContent.options_comparison), diy_subtitle: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-red-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-bold text-[#00A0DF] flex items-center gap-1.5">
                  <span>✅ Column 2: Fast-Track / With Sami</span>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Badge Title</label>
                  <input
                    type="text"
                    value={cmsData.options_comparison?.sami_badge ?? defaultCmsContent.options_comparison.sami_badge}
                    onChange={(e) => setCmsData({
                      ...cmsData,
                      options_comparison: { ...(cmsData.options_comparison || defaultCmsContent.options_comparison), sami_badge: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={cmsData.options_comparison?.sami_subtitle ?? defaultCmsContent.options_comparison.sami_subtitle}
                    onChange={(e) => setCmsData({
                      ...cmsData,
                      options_comparison: { ...(cmsData.options_comparison || defaultCmsContent.options_comparison), sami_subtitle: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>
            </div>

            {/* Points Editors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* DIY Points */}
              <div className="space-y-3 bg-[#0B0F19] p-4 rounded-xl border border-red-500/20">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-red-400">❌ DIY Road Bullet Points</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const current = cmsData.options_comparison?.diy_points || defaultCmsContent.options_comparison.diy_points;
                      setCmsData({
                        ...cmsData,
                        options_comparison: {
                          ...(cmsData.options_comparison || defaultCmsContent.options_comparison),
                          diy_points: [...current, 'New DIY struggle point']
                        }
                      });
                    }}
                    className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs font-bold"
                  >
                    + Add Point
                  </button>
                </div>
                {(cmsData.options_comparison?.diy_points || defaultCmsContent.options_comparison.diy_points).map((pt: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={pt}
                      onChange={(e) => {
                        const current = [...(cmsData.options_comparison?.diy_points || defaultCmsContent.options_comparison.diy_points)];
                        current[idx] = e.target.value;
                        setCmsData({
                          ...cmsData,
                          options_comparison: {
                            ...(cmsData.options_comparison || defaultCmsContent.options_comparison),
                            diy_points: current
                          }
                        });
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-red-400"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const current = (cmsData.options_comparison?.diy_points || defaultCmsContent.options_comparison.diy_points).filter((_: string, i: number) => i !== idx);
                        setCmsData({
                          ...cmsData,
                          options_comparison: {
                            ...(cmsData.options_comparison || defaultCmsContent.options_comparison),
                            diy_points: current
                          }
                        });
                      }}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Sami Shortcut Points */}
              <div className="space-y-3 bg-[#0B0F19] p-4 rounded-xl border border-[#00A0DF]/30">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#00A0DF]">✅ Sami Program Shortcut Bullet Points</h4>
                  <button
                    type="button"
                    onClick={() => {
                      const current = cmsData.options_comparison?.sami_points || defaultCmsContent.options_comparison.sami_points;
                      setCmsData({
                        ...cmsData,
                        options_comparison: {
                          ...(cmsData.options_comparison || defaultCmsContent.options_comparison),
                          sami_points: [...current, 'New Sami shortcut benefit']
                        }
                      });
                    }}
                    className="px-2.5 py-1 bg-[#00A0DF]/20 hover:bg-[#008ec7] text-white rounded-lg text-xs font-bold"
                  >
                    + Add Point
                  </button>
                </div>
                {(cmsData.options_comparison?.sami_points || defaultCmsContent.options_comparison.sami_points).map((pt: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={pt}
                      onChange={(e) => {
                        const current = [...(cmsData.options_comparison?.sami_points || defaultCmsContent.options_comparison.sami_points)];
                        current[idx] = e.target.value;
                        setCmsData({
                          ...cmsData,
                          options_comparison: {
                            ...(cmsData.options_comparison || defaultCmsContent.options_comparison),
                            sami_points: current
                          }
                        });
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const current = (cmsData.options_comparison?.sami_points || defaultCmsContent.options_comparison.sami_points).filter((_: string, i: number) => i !== idx);
                        setCmsData({
                          ...cmsData,
                          options_comparison: {
                            ...(cmsData.options_comparison || defaultCmsContent.options_comparison),
                            sami_points: current
                          }
                        });
                      }}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 13: 13. COST OF WAITING */}
        {/* ========================================================================= */}
        {activeTab === 'cost' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
                <Clock size={18} className="text-[#00A0DF]" />
                <span>The Real Cost of Waiting Section</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage urgency headline, badge, bottom urgency banner, and 6 reason cards.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={cmsData.cost_of_waiting?.badge ?? defaultCmsContent.cost_of_waiting.badge}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    cost_of_waiting: { ...(cmsData.cost_of_waiting || defaultCmsContent.cost_of_waiting), badge: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Section Title</label>
                <input
                  type="text"
                  value={cmsData.cost_of_waiting?.title ?? defaultCmsContent.cost_of_waiting.title}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    cost_of_waiting: { ...(cmsData.cost_of_waiting || defaultCmsContent.cost_of_waiting), title: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Section Subtitle</label>
              <textarea
                rows={2}
                value={cmsData.cost_of_waiting?.subtitle ?? defaultCmsContent.cost_of_waiting.subtitle}
                onChange={(e) => setCmsData({
                  ...cmsData,
                  cost_of_waiting: { ...(cmsData.cost_of_waiting || defaultCmsContent.cost_of_waiting), subtitle: e.target.value }
                })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-400 mb-1">Bottom Urgent Banner Bar Text</label>
              <input
                type="text"
                value={cmsData.cost_of_waiting?.banner_text ?? defaultCmsContent.cost_of_waiting.banner_text}
                onChange={(e) => setCmsData({
                  ...cmsData,
                  cost_of_waiting: { ...(cmsData.cost_of_waiting || defaultCmsContent.cost_of_waiting), banner_text: e.target.value }
                })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-amber-500/30 text-xs sm:text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">6 Waiting Cost Cards</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {(cmsData.cost_of_waiting?.cards || defaultCmsContent.cost_of_waiting.cards).map((item, idx) => (
                  <div key={idx} className="bg-[#0B0F19] p-4 rounded-xl border border-white/10 space-y-2">
                    <span className="text-xs font-bold text-red-400">Warning #{idx + 1}</span>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const current = [...(cmsData.cost_of_waiting?.cards || defaultCmsContent.cost_of_waiting.cards)];
                          current[idx] = { ...current[idx], title: e.target.value };
                          setCmsData({
                            ...cmsData,
                            cost_of_waiting: { ...(cmsData.cost_of_waiting || defaultCmsContent.cost_of_waiting), cards: current }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={item.desc}
                        onChange={(e) => {
                          const current = [...(cmsData.cost_of_waiting?.cards || defaultCmsContent.cost_of_waiting.cards)];
                          current[idx] = { ...current[idx], desc: e.target.value };
                          setCmsData({
                            ...cmsData,
                            cost_of_waiting: { ...(cmsData.cost_of_waiting || defaultCmsContent.cost_of_waiting), cards: current }
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF] resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
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
        {/* TAB 15: 15. FINAL CALL TO ACTION (CTA) */}
        {/* ========================================================================= */}
        {activeTab === 'cta' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-[#00A0DF]" />
                <span>Final Call To Action (Bottom CTA)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize the high-converting final bottom banner shown right before the footer.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Badge Text</label>
                <input
                  type="text"
                  value={cmsData.final_cta?.badge ?? defaultCmsContent.final_cta.badge}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    final_cta: { ...(cmsData.final_cta || defaultCmsContent.final_cta), badge: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Title Highlight (Blue Text)</label>
                <input
                  type="text"
                  value={cmsData.final_cta?.title_highlight ?? defaultCmsContent.final_cta.title_highlight}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    final_cta: { ...(cmsData.final_cta || defaultCmsContent.final_cta), title_highlight: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Main Headline</label>
              <input
                type="text"
                value={cmsData.final_cta?.title ?? defaultCmsContent.final_cta.title}
                onChange={(e) => setCmsData({
                  ...cmsData,
                  final_cta: { ...(cmsData.final_cta || defaultCmsContent.final_cta), title: e.target.value }
                })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Subtitle / Urgency Text</label>
              <textarea
                rows={2}
                value={cmsData.final_cta?.subtitle ?? defaultCmsContent.final_cta.subtitle}
                onChange={(e) => setCmsData({
                  ...cmsData,
                  final_cta: { ...(cmsData.final_cta || defaultCmsContent.final_cta), subtitle: e.target.value }
                })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Button CTA Text</label>
                <input
                  type="text"
                  value={cmsData.final_cta?.cta_text ?? defaultCmsContent.final_cta.cta_text}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    final_cta: { ...(cmsData.final_cta || defaultCmsContent.final_cta), cta_text: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-emerald-400 font-bold focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Guarantee Badge Text</label>
                <input
                  type="text"
                  value={cmsData.final_cta?.guarantee_text ?? defaultCmsContent.final_cta.guarantee_text}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    final_cta: { ...(cmsData.final_cta || defaultCmsContent.final_cta), guarantee_text: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-slate-300 focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: PAYMENT ACCOUNTS */}
        {/* ========================================================================= */}
        {activeTab === 'payments' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-lg font-bold text-white">Enrollment Payment Accounts</h3>
                <p className="text-[11px] sm:text-xs text-slate-400">Edit payment receiving accounts shown on public enrollment &amp; checkout pages</p>
              </div>
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={loading}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all active:scale-95 flex-shrink-0"
              >
                <Save size={14} />
                <span>{loading ? 'Saving Accounts...' : 'Save Payment Accounts'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cmsData.payment_methods.map((pm, idx) => (
                <div key={pm.id} className="bg-[#0B0F19] border border-white/10 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-white">{pm.name}</span>
                    <span className="text-[10px] text-[#00A0DF] font-bold bg-[#00A0DF]/10 px-2 py-0.5 rounded-full border border-[#00A0DF]/20">
                      {pm.badge || 'Active'}
                    </span>
                  </div>
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
                  {pm.iban !== undefined && (
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">IBAN (Bank Transfer)</label>
                      <input
                        type="text"
                        value={pm.iban || ''}
                        onChange={(e) => {
                          const updated = [...cmsData.payment_methods];
                          updated[idx].iban = e.target.value;
                          setCmsData({ ...cmsData, payment_methods: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs font-mono text-slate-300 focus:outline-none focus:border-[#00A0DF]"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/5 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
              >
                <Save size={15} />
                <span>{loading ? 'Saving Accounts...' : 'Save Payment Accounts Changes'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 16: CONTACT & FOOTER */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
                <Globe2 size={18} className="text-[#00A0DF]" />
                <span>Contact Details, Offices &amp; Footer Disclaimer</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Manage contact WhatsApp numbers, offices, WhatsApp greeting, and bottom footer legal disclaimers.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Contact &amp; WhatsApp Support</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">WhatsApp Phone (International Format)</label>
                  <input
                    type="text"
                    value={cmsData.contact?.phone ?? ''}
                    onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, phone: e.target.value } })}
                    placeholder="+92 300 1234567"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-emerald-400 font-bold focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Official Support Email</label>
                  <input
                    type="email"
                    value={cmsData.contact?.email ?? ''}
                    onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, email: e.target.value } })}
                    placeholder="support@ecomwithsami.com"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">WhatsApp Pre-filled Greeting Message</label>
                <input
                  type="text"
                  value={cmsData.contact?.whatsappGreeting ?? 'Salam Sami! I am interested in joining the 2026 Dropshipping Masterclass. Please share details.'}
                  onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, whatsappGreeting: e.target.value } })}
                  placeholder="Salam Sami! I am interested in joining the 2026 Dropshipping Masterclass..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Head Office Location</label>
                  <input
                    type="text"
                    value={cmsData.contact?.headOffice ?? 'Office #402, 4th Floor, Executive Heights, Gulberg III, Lahore, Pakistan'}
                    onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, headOffice: e.target.value } })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Regional Office Location</label>
                  <input
                    type="text"
                    value={cmsData.contact?.regionalOffice ?? 'DHA Phase 6, Karachi, Pakistan'}
                    onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, regionalOffice: e.target.value } })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Footer Disclaimer &amp; Copyright</h4>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Legal Earnings Disclaimer</label>
                <textarea
                  rows={3}
                  value={cmsData.footer?.disclaimer ?? defaultCmsContent.footer.disclaimer}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    footer: { ...(cmsData.footer || defaultCmsContent.footer), disclaimer: e.target.value }
                  })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF] resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Copyright Notice Text</label>
                <input
                  type="text"
                  value={cmsData.footer?.copyright ?? defaultCmsContent.footer.copyright}
                  onChange={(e) => setCmsData({
                    ...cmsData,
                    footer: { ...(cmsData.footer || defaultCmsContent.footer), copyright: e.target.value }
                  })}
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
                  value={cmsData.pixels?.meta_pixel_id ?? ''}
                  onChange={(e) => setCmsData({ ...cmsData, pixels: { ...cmsData.pixels, meta_pixel_id: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">TikTok Pixel ID</label>
                <input
                  type="text"
                  value={cmsData.pixels?.tiktok_pixel_id ?? ''}
                  onChange={(e) => setCmsData({ ...cmsData, pixels: { ...cmsData.pixels, tiktok_pixel_id: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: THEMES (LIVE THEME STUDIO & FULL COLOR CUSTOMIZER)                 */}
        {/* ========================================================================= */}
        {activeTab === 'themes' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Studio Header Banner */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-10 h-10 rounded-2xl text-white flex items-center justify-center border border-white/20 shadow-lg flex-shrink-0 transition-colors"
                    style={{ backgroundColor: currentThemeColors.primary }}
                  >
                    <Palette size={22} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-2xl font-black text-white flex items-center gap-2">
                      <span>Live Theme Studio &amp; Color Customizer</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                        Live 0ms Preview
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Pick from 6 curated presets or customize every single color channel below. Changes preview in real-time — <strong>zero database schema impact</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-stretch md:self-auto justify-end flex-wrap">
                <button
                  type="button"
                  onClick={resetThemeToDefault}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 border border-white/5 cursor-pointer"
                  title="Revert back to official signature blue"
                >
                  <RotateCcw size={13} />
                  <span>Reset Default</span>
                </button>
                <button
                  onClick={handleSaveAll}
                  disabled={loading}
                  className="px-4 py-2 sm:py-2.5 rounded-xl text-white text-xs font-black shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  style={{ 
                    backgroundColor: currentThemeColors.primary,
                    boxShadow: `0 8px 20px -4px ${currentThemeColors.primary}80`
                  }}
                >
                  <Save size={14} />
                  <span>{loading ? 'Saving...' : 'Save Theme Colors'}</span>
                </button>
              </div>
            </div>

            {/* 1. Quick Presets Bar */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} style={{ color: currentThemeColors.primary }} />
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    Quick Starting Presets (Click any to auto-fill)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  Active Preset: <strong className="text-white capitalize">{activePresetId}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {THEME_PRESETS.map((p) => {
                  const isCur = activePresetId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`p-3 rounded-2xl text-left border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 relative ${
                        isCur 
                          ? 'bg-[#0B0F19] border-white/60 shadow-xl ring-2 ring-white/20' 
                          : 'bg-[#0B0F19]/60 border-white/5 hover:border-white/20 hover:bg-[#0B0F19]'
                      }`}
                    >
                      {isCur && (
                        <span className="absolute -top-2 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-md">
                          <Check size={10} />
                        </span>
                      )}
                      <div>
                        <div className="flex items-center gap-1 mb-1.5">
                          <span className="w-3.5 h-3.5 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: p.colors.primary }} />
                          <span className="w-3 h-3 rounded-full shadow-sm flex-shrink-0" style={{ backgroundColor: p.colors.secondary }} />
                          <span className="w-2.5 h-2.5 rounded-full shadow-sm flex-shrink-0 border border-white/20" style={{ backgroundColor: p.colors.dark_card }} />
                        </div>
                        <div className="text-xs font-black text-white leading-tight truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-400 truncate mt-0.5">{p.tag}</div>
                      </div>
                      <div className="text-[9.5px] font-mono text-slate-400 font-bold uppercase">
                        {p.colors.primary}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Deep Color Customizer & Live UI Mockup */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              
              {/* Left Column (7 cols): The 5 Color Channel Controllers */}
              <div className="lg:col-span-7 bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={17} style={{ color: currentThemeColors.primary }} />
                    <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                      Fine-Tune Color Codes (Custom Pickers)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 bg-black/40 px-2 py-0.5 rounded-md border border-white/5">
                    Mode: {activePresetId === 'custom' ? '🎨 Custom' : `Preset (${activePresetId})`}
                  </span>
                </div>

                <div className="space-y-3 sm:space-y-3.5">
                  {/* Channel 1: Primary Accent */}
                  <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/15 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <input
                          type="color"
                          aria-label="Pick Primary Brand Accent Color"
                          value={currentThemeColors.primary}
                          onChange={(e) => updateLiveCustomColor('primary', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 opacity-0 absolute inset-0 z-10"
                        />
                        <div 
                          className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: currentThemeColors.primary }}
                        />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-white block">Primary Brand Accent</span>
                        <span className="text-[11px] text-slate-400 leading-tight block">
                          Buttons, video play button, badges, active tabs &amp; progress bar
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs text-slate-500 font-mono">HEX</span>
                      <input
                        type="text"
                        value={currentThemeColors.primary}
                        onChange={(e) => updateLiveCustomColor('primary', e.target.value)}
                        className="w-24 px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-white/30 text-center"
                        maxLength={7}
                      />
                    </div>
                  </div>

                  {/* Channel 2: Button Hover Shade */}
                  <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/15 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <input
                          type="color"
                          aria-label="Pick Button Hover Shade Color"
                          value={currentThemeColors.primary_hover}
                          onChange={(e) => updateLiveCustomColor('primary_hover', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 opacity-0 absolute inset-0 z-10"
                        />
                        <div 
                          className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: currentThemeColors.primary_hover }}
                        />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-white block">Button Hover Shade</span>
                        <span className="text-[11px] text-slate-400 leading-tight block">
                          Hover state for CTA buttons and interactive elements
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs text-slate-500 font-mono">HEX</span>
                      <input
                        type="text"
                        value={currentThemeColors.primary_hover}
                        onChange={(e) => updateLiveCustomColor('primary_hover', e.target.value)}
                        className="w-24 px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-white/30 text-center"
                        maxLength={7}
                      />
                    </div>
                  </div>

                  {/* Channel 3: Secondary / Ambient Accent */}
                  <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/15 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <input
                          type="color"
                          aria-label="Pick Secondary Accent Color"
                          value={currentThemeColors.secondary}
                          onChange={(e) => updateLiveCustomColor('secondary', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 opacity-0 absolute inset-0 z-10"
                        />
                        <div 
                          className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: currentThemeColors.secondary }}
                        />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-white block">Secondary / Accent Shade</span>
                        <span className="text-[11px] text-slate-400 leading-tight block">
                          Ambient background blur orbs, rating stars &amp; gradient highlights
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs text-slate-500 font-mono">HEX</span>
                      <input
                        type="text"
                        value={currentThemeColors.secondary}
                        onChange={(e) => updateLiveCustomColor('secondary', e.target.value)}
                        className="w-24 px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-white/30 text-center"
                        maxLength={7}
                      />
                    </div>
                  </div>

                  {/* Channel 4: Dark Card Surface */}
                  <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/15 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <input
                          type="color"
                          aria-label="Pick Dark Card Surface Color"
                          value={currentThemeColors.dark_card}
                          onChange={(e) => updateLiveCustomColor('dark_card', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 opacity-0 absolute inset-0 z-10"
                        />
                        <div 
                          className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: currentThemeColors.dark_card }}
                        />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-white block">Dark Card Surface</span>
                        <span className="text-[11px] text-slate-400 leading-tight block">
                          Testimonials boxes, pricing containers &amp; module items
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs text-slate-500 font-mono">HEX</span>
                      <input
                        type="text"
                        value={currentThemeColors.dark_card}
                        onChange={(e) => updateLiveCustomColor('dark_card', e.target.value)}
                        className="w-24 px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-white/30 text-center"
                        maxLength={7}
                      />
                    </div>
                  </div>

                  {/* Channel 5: Base Dark Background */}
                  <div className="p-3.5 rounded-2xl bg-[#0B0F19] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/15 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <input
                          type="color"
                          aria-label="Pick Base Dark Background Color"
                          value={currentThemeColors.dark_bg}
                          onChange={(e) => updateLiveCustomColor('dark_bg', e.target.value)}
                          className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0 opacity-0 absolute inset-0 z-10"
                        />
                        <div 
                          className="w-10 h-10 rounded-xl border-2 border-white/20 shadow-md flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                          style={{ backgroundColor: currentThemeColors.dark_bg }}
                        />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-bold text-white block">Base Dark Background</span>
                        <span className="text-[11px] text-slate-400 leading-tight block">
                          Video stage canvas, footer background &amp; dark section backdrop
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="text-xs text-slate-500 font-mono">HEX</span>
                      <input
                        type="text"
                        value={currentThemeColors.dark_bg}
                        onChange={(e) => updateLiveCustomColor('dark_bg', e.target.value)}
                        className="w-24 px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-white/30 text-center"
                        maxLength={7}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (5 cols): Live Interactive UI Mockup Card */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div 
                  className="rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 shadow-2xl transition-all relative overflow-hidden flex-1 flex flex-col justify-between"
                  style={{ 
                    backgroundColor: currentThemeColors.dark_bg,
                    borderColor: currentThemeColors.primary + '33'
                  }}
                >
                  {/* Subtle Background Glow Orb */}
                  <div 
                    className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl opacity-30 pointer-events-none"
                    style={{ backgroundColor: currentThemeColors.secondary || currentThemeColors.primary }}
                  />

                  <div>
                    {/* Top Label */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 flex items-center gap-1.5">
                        <Eye size={12} style={{ color: currentThemeColors.primary }} />
                        <span>Live Real-Time UI Preview</span>
                      </span>
                      <span 
                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: currentThemeColors.primary + '26', 
                          color: currentThemeColors.primary,
                          border: `1px solid ${currentThemeColors.primary}4d`
                        }}
                      >
                        Active Colors
                      </span>
                    </div>

                    {/* Simulated Badge */}
                    <div className="mb-3">
                      <span 
                        className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm"
                        style={{ 
                          backgroundColor: currentThemeColors.primary + '26', 
                          color: currentThemeColors.primary,
                          border: `1px solid ${currentThemeColors.primary}4d`
                        }}
                      >
                        <Sparkles size={12} />
                        <span>PAKISTAN'S #1 DROPSHIPPING TRAINING</span>
                      </span>
                    </div>

                    {/* Simulated Headline with Highlight Word */}
                    <h4 className="text-base sm:text-xl font-black text-white leading-snug mb-2">
                      Learn How to Start Online Shopify Store in{' '}
                      <span style={{ color: currentThemeColors.primary }}>
                        UAE &amp; KSA
                      </span>
                    </h4>

                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                      A proven step-by-step masterclass with verified GCC local wholesale suppliers.
                    </p>

                    {/* Simulated Card Box */}
                    <div 
                      className="p-3.5 rounded-2xl border mb-4 space-y-2"
                      style={{ 
                        backgroundColor: currentThemeColors.dark_card,
                        borderColor: currentThemeColors.primary + '33'
                      }}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">Ramadan Masterclass Access</span>
                        <span 
                          className="font-black"
                          style={{ color: currentThemeColors.primary }}
                        >
                          PKR 3,799
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span style={{ color: currentThemeColors.secondary }}>★★★★★</span>
                        <span>• 9,742+ Students Enrolled</span>
                      </div>
                    </div>

                    {/* Simulated CTA Button */}
                    <button
                      type="button"
                      className="w-full py-3 rounded-xl text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      style={{ 
                        backgroundColor: currentThemeColors.primary,
                        boxShadow: `0 10px 25px -5px ${currentThemeColors.primary}66`
                      }}
                    >
                      <Sparkles size={15} />
                      <span>YES! I WANT TO LEARN THIS &bull; PKR 3,799</span>
                    </button>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Preview updates in real-time</span>
                    <span className="text-emerald-400 font-bold">✓ 0ms Delay</span>
                  </div>
                </div>

                {/* Quick Save Card */}
                <div className="p-4 rounded-2xl bg-[#111827] border border-white/10 flex items-center justify-between gap-3 shadow-lg">
                  <div>
                    <div className="text-xs font-bold text-white">Ready to publish these colors?</div>
                    <div className="text-[11px] text-slate-400">Click below to commit changes to the live site.</div>
                  </div>
                  <button
                    onClick={handleSaveAll}
                    disabled={loading}
                    className="px-4 py-2.5 rounded-xl text-white text-xs font-black shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                    style={{ 
                      backgroundColor: currentThemeColors.primary,
                      boxShadow: `0 6px 18px -3px ${currentThemeColors.primary}66`
                    }}
                  >
                    <Save size={14} />
                    <span>{loading ? 'Saving...' : 'Save Theme Colors'}</span>
                  </button>
                </div>
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
