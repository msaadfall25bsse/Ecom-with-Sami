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
  X
} from 'lucide-react';
import { defaultCmsContent, CmsContentSchema } from '@/utils/cmsStore';
import { Module, Supplier, initialModules, initialSuppliers } from '@/utils/db';

import { supabase } from '@/lib/supabase';

export default function AdminCmsPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<'lms' | 'hero' | 'stats' | 'bonuses' | 'reviews' | 'faqs' | 'payments' | 'contact' | 'pixels' | 'themes'>('lms');
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
          if (data.content.theme?.active_theme) {
            document.documentElement.setAttribute('data-theme', data.content.theme.active_theme);
            try {
              localStorage.setItem('sami_active_theme', data.content.theme.active_theme);
            } catch (e) {}
          }
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
            if (parsed.theme?.active_theme) {
              document.documentElement.setAttribute('data-theme', parsed.theme.active_theme);
              try {
                localStorage.setItem('sami_active_theme', parsed.theme.active_theme);
              } catch (e) {}
            }
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

    if (cmsData.theme?.active_theme) {
      document.documentElement.setAttribute('data-theme', cmsData.theme.active_theme);
      try {
        localStorage.setItem('sami_active_theme', cmsData.theme.active_theme);
        document.cookie = `sami_active_theme=${cmsData.theme.active_theme}; path=/; max-age=31536000; SameSite=Lax`;
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
    setUploadStatusText('Preparing video for persistent cloud storage...');

    const cleanBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
    const manifestId = `vid_${Date.now()}_${cleanBase}`;

    const PART_SIZE = 40 * 1024 * 1024; // 40MB safe cloud parts (under 50MB Supabase limit)
    const totalParts = Math.ceil(file.size / PART_SIZE);

    try {
      for (let p = 0; p < totalParts; p++) {
        const start = p * PART_SIZE;
        const end = Math.min(start + PART_SIZE, file.size);
        const partBlob = file.slice(start, end);

        setUploadStatusText(`Authorizing cloud part ${p + 1}/${totalParts}...`);

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

        // 2. Direct PUT upload to Supabase Storage with progress tracking
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          uploadXhrRef.current = xhr;

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const overallLoaded = start + e.loaded;
              const percent = Math.min(Math.round((overallLoaded / file.size) * 100), 99);
              setUploadProgress(percent);
              const loadedMB = (overallLoaded / (1024 * 1024)).toFixed(1);
              const totalMB = (file.size / (1024 * 1024)).toFixed(1);
              setUploadStatusText(`${loadedMB} MB / ${totalMB} MB (${percent}%) - Part ${p + 1}/${totalParts}`);
            }
          };

          xhr.onload = () => {
            uploadXhrRef.current = null;
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Part ${p + 1} upload failed with status ${xhr.status}`));
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

      setUploadStatusText('Finalizing video manifest on cloud storage...');

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
        throw new Error(finData.message || 'Failed to finalize video on server');
      }

      setNewLessonUrl(finData.url);
      setUploadProgress(100);
      setUploadingVideo(false);
      setVideoUploadSuccess(true);
      const totalMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadStatusText(`Upload complete 100%! (${totalMB} MB permanently stored)`);

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
            { id: 'themes', label: '🎨 Themes', icon: Palette },
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
                    value={cmsData.hero?.badge ?? ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, badge: e.target.value } })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Highlighted Text (Blue)</label>
                  <input
                    type="text"
                    value={cmsData.hero?.title_highlight ?? ''}
                    onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, title_highlight: e.target.value } })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Main Headline</label>
                <input
                  type="text"
                  value={cmsData.hero?.title_line1 ?? ''}
                  onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, title_line1: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Sub-headline Description</label>
                <textarea
                  rows={2}
                  value={cmsData.hero?.subtitle ?? ''}
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
                      value={cmsData.hero?.video_url ?? ''}
                      onChange={(e) => setCmsData({ ...cmsData, hero: { ...cmsData.hero, video_url: e.target.value } })}
                      className="w-full px-3 py-2 rounded-xl bg-[#111827] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Overlay Title</label>
                    <input
                      type="text"
                      value={cmsData.hero?.video_title ?? ''}
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
                  value={cmsData.contact?.phone ?? ''}
                  onChange={(e) => setCmsData({ ...cmsData, contact: { ...cmsData.contact, phone: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs sm:text-sm text-emerald-400 font-bold focus:outline-none focus:border-[#00A0DF]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Support Email</label>
                <input
                  type="email"
                  value={cmsData.contact?.email ?? ''}
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
        {/* TAB 9: THEMES (MULTI-THEME VISUAL SYSTEM) */}
        {/* ========================================================================= */}
        {activeTab === 'themes' && (
          <div className="space-y-6 sm:space-y-8">
            {/* Top Themes Action Bar */}
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#00A0DF]/15 text-[#00A0DF] flex items-center justify-center border border-[#00A0DF]/30 shadow-md flex-shrink-0">
                    <Palette size={20} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-2xl font-black text-white">
                      Website Theme &amp; Color Palette Selector
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Select and save from 3 curated themes. All styles are powered by frontend CSS variables and Tailwind — <strong>zero database schema impact</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end bg-[#0B0F19] p-2.5 sm:p-3 rounded-2xl border border-white/10">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Live Website Theme:</span>
                  <span className="text-xs sm:text-sm font-black text-white capitalize flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      (cmsData.theme?.active_theme || 'default') === 'sunset-orange'
                        ? 'bg-[#FF6B00] shadow-sm shadow-[#FF6B00]'
                        : (cmsData.theme?.active_theme || 'default') === 'emerald-luxury'
                        ? 'bg-[#10B981] shadow-sm shadow-[#10B981]'
                        : 'bg-[#00A0DF] shadow-sm shadow-[#00A0DF]'
                    }`} />
                    <span>
                      {(cmsData.theme?.active_theme || 'default') === 'sunset-orange'
                        ? 'Royal Sunset Orange'
                        : (cmsData.theme?.active_theme || 'default') === 'emerald-luxury'
                        ? 'Dubai Emerald & Gold'
                        : 'Default Tech Cyan'}
                    </span>
                  </span>
                </div>
                <button
                  onClick={handleSaveAll}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-white text-xs font-black shadow-lg shadow-[#00A0DF]/20 transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  <Save size={14} />
                  <span>{loading ? 'Saving...' : 'Save Theme'}</span>
                </button>
              </div>
            </div>

            {/* 3 Themes Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
              
              {/* THEME 1: Default Tech Cyan */}
              {(() => {
                const isSelected = (cmsData.theme?.active_theme || 'default') === 'default';
                return (
                  <div className={`bg-[#111827] rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col overflow-hidden shadow-2xl ${
                    isSelected ? 'border-[#00A0DF] ring-4 ring-[#00A0DF]/15 shadow-[#00A0DF]/10' : 'border-white/10 hover:border-white/20'
                  }`}>
                    {/* Visual Theme Banner */}
                    <div className="h-28 bg-gradient-to-r from-[#00A0DF] via-[#0074A6] to-[#0B0F19] p-4 flex items-start justify-between relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/15">
                        <Sparkles size={11} className="text-[#00A0DF]" />
                        <span>Original Signature</span>
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-md">
                          <Check size={12} />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <span>Default Tech Cyan</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Signature high-tech dropshipping brand look with vibrant electric cyan blue, deep obsidian black, and high-visibility action elements.
                        </p>

                        {/* Color Chips Palette */}
                        <div className="mt-3.5 pt-3 border-t border-white/5 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Color Palette:</span>
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                            <div className="p-2 rounded-xl bg-[#0B0F19] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-[#00A0DF] shadow-sm" />
                              <span className="text-slate-300">#00A0DF</span>
                            </div>
                            <div className="p-2 rounded-xl bg-[#0B0F19] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-[#008AC2] shadow-sm" />
                              <span className="text-slate-300">#008AC2</span>
                            </div>
                            <div className="p-2 rounded-xl bg-[#111827] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-[#111827] shadow-sm border border-white/20" />
                              <span className="text-slate-300">#111827</span>
                            </div>
                            <div className="p-2 rounded-xl bg-[#0B0F19] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-white shadow-sm" />
                              <span className="text-slate-300">#FFFFFF</span>
                            </div>
                          </div>
                        </div>

                        {/* Live Mini Preview Box */}
                        <div className="mt-4 p-3.5 rounded-2xl bg-[#0B0F19] border border-white/10 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">UI Preview</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#00A0DF]/15 text-[#00A0DF] border border-[#00A0DF]/30 font-bold">
                              88% Off Special
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white leading-tight">
                            Shopify Dropshipping in <span className="text-[#00A0DF]">UAE &amp; KSA</span>
                          </div>
                          <div className="w-full py-1.5 rounded-lg bg-[#00A0DF] text-white text-[10px] font-black text-center uppercase tracking-wider shadow-sm">
                            Enroll Now • PKR 3,799
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setCmsData(prev => ({ ...prev, theme: { active_theme: 'default' } }));
                          document.documentElement.setAttribute('data-theme', 'default');
                          try {
                            localStorage.setItem('sami_active_theme', 'default');
                            document.cookie = 'sami_active_theme=default; path=/; max-age=31536000; SameSite=Lax';
                          } catch (e) {}
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                            : 'bg-[#1E293B] hover:bg-[#00A0DF] text-slate-200 hover:text-white border border-white/10'
                        }`}
                      >
                        {isSelected ? <><Check size={14} /> Current Active Theme</> : 'Select & Apply Theme'}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* THEME 2: Royal Sunset Orange (Requested: Orange, White & Black) */}
              {(() => {
                const isSelected = cmsData.theme?.active_theme === 'sunset-orange';
                return (
                  <div className={`bg-[#111827] rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col overflow-hidden shadow-2xl ${
                    isSelected ? 'border-[#FF6B00] ring-4 ring-[#FF6B00]/15 shadow-[#FF6B00]/10' : 'border-white/10 hover:border-white/20'
                  }`}>
                    {/* Visual Theme Banner */}
                    <div className="h-28 bg-gradient-to-r from-[#FF6B00] via-[#FFA043] to-[#08090C] p-4 flex items-start justify-between relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-6 w-24 h-24 rounded-full bg-white/15 blur-xl pointer-events-none" />
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/15">
                        <Sparkles size={11} className="text-[#FF6B00]" />
                        <span>High-Conversion Ecom</span>
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-md">
                          <Check size={12} />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <span>Royal Sunset Orange</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Vibrant electric sunset orange with crisp white text and deep obsidian black contrast. Super punchy, modern high-converting Shopify aesthetic.
                        </p>

                        {/* Color Chips Palette */}
                        <div className="mt-3.5 pt-3 border-t border-white/5 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Color Palette:</span>
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                            <div className="p-2 rounded-xl bg-[#0B0F19] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-[#FF6B00] shadow-sm" />
                              <span className="text-slate-300">#FF6B00</span>
                            </div>
                            <div className="p-2 rounded-xl bg-[#0B0F19] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-[#FFA043] shadow-sm" />
                              <span className="text-slate-300">#FFA043</span>
                            </div>
                            <div className="p-2 rounded-xl bg-[#0B0F19] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-[#121318] shadow-sm border border-white/20" />
                              <span className="text-slate-300">#121318</span>
                            </div>
                            <div className="p-2 rounded-xl bg-[#0B0F19] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-white shadow-sm" />
                              <span className="text-slate-300">#FFFFFF</span>
                            </div>
                          </div>
                        </div>

                        {/* Live Mini Preview Box */}
                        <div className="mt-4 p-3.5 rounded-2xl bg-[#08090C] border border-[#FF6B00]/25 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">UI Preview</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 font-bold">
                              88% Off Special
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white leading-tight">
                            Shopify Dropshipping in <span className="text-[#FF6B00]">UAE &amp; KSA</span>
                          </div>
                          <div className="w-full py-1.5 rounded-lg bg-[#FF6B00] text-white text-[10px] font-black text-center uppercase tracking-wider shadow-sm shadow-[#FF6B00]/30">
                            Enroll Now • PKR 3,799
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setCmsData(prev => ({ ...prev, theme: { active_theme: 'sunset-orange' } }));
                          document.documentElement.setAttribute('data-theme', 'sunset-orange');
                          try {
                            localStorage.setItem('sami_active_theme', 'sunset-orange');
                            document.cookie = 'sami_active_theme=sunset-orange; path=/; max-age=31536000; SameSite=Lax';
                          } catch (e) {}
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                            : 'bg-[#1E293B] hover:bg-[#FF6B00] text-slate-200 hover:text-white border border-white/10'
                        }`}
                      >
                        {isSelected ? <><Check size={14} /> Current Active Theme</> : 'Select & Apply Theme'}
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* THEME 3: Dubai Emerald & Gold */}
              {(() => {
                const isSelected = cmsData.theme?.active_theme === 'emerald-luxury';
                return (
                  <div className={`bg-[#111827] rounded-2xl sm:rounded-3xl border-2 transition-all flex flex-col overflow-hidden shadow-2xl ${
                    isSelected ? 'border-[#10B981] ring-4 ring-[#10B981]/15 shadow-[#10B981]/10' : 'border-white/10 hover:border-white/20'
                  }`}>
                    {/* Visual Theme Banner */}
                    <div className="h-28 bg-gradient-to-r from-[#10B981] via-[#059669] to-[#F59E0B] p-4 flex items-start justify-between relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-6 w-24 h-24 rounded-full bg-white/15 blur-xl pointer-events-none" />
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm border border-white/15">
                        <Sparkles size={11} className="text-[#F59E0B]" />
                        <span>GCC Wealth &amp; Luxury</span>
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-md">
                          <Check size={12} />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <span>Dubai Emerald &amp; Gold</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Prestige GCC wealth aesthetic featuring vibrant mint emerald green, warm Dubai gold badges, and midnight charcoal background tones.
                        </p>

                        {/* Color Chips Palette */}
                        <div className="mt-3.5 pt-3 border-t border-white/5 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Color Palette:</span>
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                            <div className="p-2 rounded-xl bg-[#0B0F19] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-[#10B981] shadow-sm" />
                              <span className="text-slate-300">#10B981</span>
                            </div>
                            <div className="p-2 rounded-xl bg-[#0B0F19] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-[#F59E0B] shadow-sm" />
                              <span className="text-slate-300">#F59E0B</span>
                            </div>
                            <div className="p-2 rounded-xl bg-[#0B0F19] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-[#0C1A14] shadow-sm border border-white/20" />
                              <span className="text-slate-300">#0C1A14</span>
                            </div>
                            <div className="p-2 rounded-xl bg-[#0B0F19] border border-white/10 flex flex-col items-center gap-1">
                              <span className="w-5 h-5 rounded-lg bg-white shadow-sm" />
                              <span className="text-slate-300">#FFFFFF</span>
                            </div>
                          </div>
                        </div>

                        {/* Live Mini Preview Box */}
                        <div className="mt-4 p-3.5 rounded-2xl bg-[#06120E] border border-[#10B981]/25 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider">UI Preview</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 font-bold">
                              88% Off Special
                            </span>
                          </div>
                          <div className="text-xs font-bold text-white leading-tight">
                            Shopify Dropshipping in <span className="text-[#10B981]">UAE &amp; KSA</span>
                          </div>
                          <div className="w-full py-1.5 rounded-lg bg-[#10B981] text-white text-[10px] font-black text-center uppercase tracking-wider shadow-sm shadow-[#10B981]/30">
                            Enroll Now • PKR 3,799
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setCmsData(prev => ({ ...prev, theme: { active_theme: 'emerald-luxury' } }));
                          document.documentElement.setAttribute('data-theme', 'emerald-luxury');
                          try {
                            localStorage.setItem('sami_active_theme', 'emerald-luxury');
                            document.cookie = 'sami_active_theme=emerald-luxury; path=/; max-age=31536000; SameSite=Lax';
                          } catch (e) {}
                        }}
                        className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                            : 'bg-[#1E293B] hover:bg-[#10B981] text-slate-200 hover:text-white border border-white/10'
                        }`}
                      >
                        {isSelected ? <><Check size={14} /> Current Active Theme</> : 'Select & Apply Theme'}
                      </button>
                    </div>
                  </div>
                );
              })()}

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
