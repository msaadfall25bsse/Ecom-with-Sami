'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  Check, 
  X,
  Search,
  RotateCcw,
  Plus,
  ShieldCheck,
  KeyRound,
  Filter,
  Image as ImageIcon,
  Menu,
  MessageSquare,
  Copy,
  ExternalLink,
  Send,
  Lock,
  RefreshCw,
  Trash2,
  Loader2
} from 'lucide-react';
import { Enrollment, Student } from '@/utils/db';

function formatWhatsAppPhone(phone: string): string {
  let clean = (phone || '').replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '92' + clean.slice(1);
  } else if (!clean.startsWith('92') && clean.length === 10) {
    clean = '92' + clean;
  }
  return clean;
}

function generateWhatsAppUrl(student: { name: string; email: string; phone: string }, password: string): string {
  const cleanPhone = formatWhatsAppPhone(student.phone);
  const text = encodeURIComponent(
    `🎉 *Assalam-o-Alaikum ${student.name}! Welcome to Ecom With Sami Mentorship!*\n\n` +
    `Your enrollment payment proof has been verified and your Student LMS Portal Account is now *ACTIVE*.\n\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🔐 *YOUR LMS LOGIN CREDENTIALS:*\n` +
    `🌐 *Login Portal:* https://ecomwithsami.com/login\n` +
    `📧 *Email:* ${student.email}\n` +
    `🔑 *Password:* ${password}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `✅ *Next Steps:*\n` +
    `1. Open the portal link above\n` +
    `2. Enter your Email and Password\n` +
    `3. Start watching the 11 Course Modules and access the Supplier Directory!\n\n` +
    `If you face any issues, feel free to reply directly to this message.\n\n` +
    `Best Regards,\n` +
    `*Mentor Sardar Samiullah & Support Team*`
  );
  return `https://wa.me/${cleanPhone}?text=${text}`;
}

function generateFallbackPassword(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash);
  const num = 10000000 + (positive % 90000000);
  return num.toString();
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'enrollments' | 'students'>('overview');
  const [stats, setStats] = useState({
    totalStudents: 0,
    pendingApprovals: 0,
    approvedEnrollments: 0,
    totalRevenueFormatted: 'PKR 0'
  });
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchEnrollment, setSearchEnrollment] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'pending' | 'approved' | 'rejected'>('ALL');
  const [searchStudent, setSearchStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [resetLoadingId, setResetLoadingId] = useState<string | null>(null);
  const [copiedPassId, setCopiedPassId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Password Reset Finder state
  const [quickResetInput, setQuickResetInput] = useState('');
  const [quickResetLoading, setQuickResetLoading] = useState(false);
  const [quickResetResult, setQuickResetResult] = useState<{
    email: string;
    newPassword: string;
    name?: string;
    phone?: string;
  } | null>(null);
  const [showQuickResetModal, setShowQuickResetModal] = useState(false);

  // Selected Receipt Preview modal state
  const [previewReceipt, setPreviewReceipt] = useState<Enrollment | null>(null);

  // Get Access & WhatsApp Modal state
  const [accessModalData, setAccessModalData] = useState<{
    enrollment: Enrollment;
    password: string;
    whatsappUrl: string;
    isApproved: boolean;
    granting: boolean;
    statusMsg?: string;
  } | null>(null);
  const [copiedAccessId, setCopiedAccessId] = useState<string | null>(null);

  // New Student Modal state
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Lahore',
    password: 'studentpass2026'
  });

  useEffect(() => {
    // 1. Instant Cache Hydration: If admin visited before, immediately display cached stats with 0ms delay
    try {
      const cached = localStorage.getItem('sami_admin_dashboard_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.stats) setStats(parsed.stats);
        if (parsed.enrollments && Array.isArray(parsed.enrollments)) setEnrollments(parsed.enrollments);
        if (parsed.students && Array.isArray(parsed.students)) setStudents(parsed.students);
        setLoading(false);
      }
    } catch (e) {}

    // 2. Verify admin authentication and fetch fresh live data
    fetch('/api/auth/me?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated || data.role !== 'ADMIN') {
          router.replace('/admin/login?redirect=/admin');
        } else {
          setAuthChecking(false);
          fetchDashboardData();
        }
      })
      .catch(() => {
        router.replace('/admin/login?redirect=/admin');
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    router.replace('/admin/login');
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    const timestamp = Date.now();

    try {
      // Single unified fast fetch that retrieves stats, enrollments, and students in one quick roundtrip
      const res = await fetch(`/api/admin/overview?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      const data = await res.json();
      if (data.success) {
        if (data.stats) setStats(data.stats);
        if (data.enrollments && Array.isArray(data.enrollments)) setEnrollments(data.enrollments);
        if (data.students && Array.isArray(data.students)) setStudents(data.students);

        try {
          localStorage.setItem('sami_admin_dashboard_cache', JSON.stringify({
            stats: data.stats,
            enrollments: data.enrollments,
            students: data.students
          }));
        } catch (e) {}
      }
    } catch (err) {
      console.error('Fetch dashboard overview error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (enrollment: Enrollment) => {
    setActionLoadingId(`approve-${enrollment.id}`);
    try {
      const matchingStudent = students.find(s => s.email.toLowerCase() === enrollment.email.toLowerCase());
      const passToUse = enrollment.password || matchingStudent?.password || generateFallbackPassword(enrollment.trackingCode || enrollment.id);

      const res = await fetch('/api/admin/enrollments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: enrollment.id,
          status: 'approved',
          password: passToUse
        })
      });
      const data = await res.json();
      if (data.success) {
        const finalPass = data.password || passToUse;
        setEnrollments(prev => prev.map(e => (e.id === enrollment.id || e.trackingCode === enrollment.id) ? { ...e, status: 'approved', password: finalPass } : e));
        setStudents(prev => {
          const exists = prev.some(s => s.email.toLowerCase() === enrollment.email.toLowerCase());
          if (exists) {
            return prev.map(s => s.email.toLowerCase() === enrollment.email.toLowerCase() ? { ...s, isActive: true, password: finalPass } : s);
          } else {
            return [
              {
                id: enrollment.studentId || `std_${Date.now()}`,
                name: enrollment.name,
                email: enrollment.email,
                phone: enrollment.phone,
                city: enrollment.city,
                password: finalPass,
                isActive: true,
                enrolledAt: new Date().toISOString().split('T')[0],
                completedLessons: []
              },
              ...prev
            ];
          }
        });
        setToastMessage(`✅ ${enrollment.name} Approved! Password: ${finalPass} (LMS Account ACTIVE)`);
        setTimeout(() => setToastMessage(null), 6000);
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to approve enrollment');
      }
    } catch (e: any) {
      console.error(e);
      alert('Network error while approving');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (enrollment: Enrollment) => {
    if (!confirm(`Are you sure you want to REJECT enrollment for ${enrollment.name}?`)) return;
    setActionLoadingId(`reject-${enrollment.id}`);
    try {
      const res = await fetch('/api/admin/enrollments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: enrollment.id,
          status: 'rejected'
        })
      });
      const data = await res.json();
      if (data.success) {
        setEnrollments(prev => prev.map(e => (e.id === enrollment.id || e.trackingCode === enrollment.id) ? { ...e, status: 'rejected' } : e));
        setToastMessage(`❌ Enrollment for ${enrollment.name} marked as Rejected.`);
        setTimeout(() => setToastMessage(null), 5000);
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to reject enrollment');
      }
    } catch (e: any) {
      console.error(e);
      alert('Network error while rejecting');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (enrollment: Enrollment) => {
    if (!confirm(`⚠️ PERMANENT DELETE:\nAre you sure you want to permanently delete enrollment for "${enrollment.name}" (${enrollment.trackingCode})?\n\nThis will completely remove this record from the database.`)) {
      return;
    }
    setActionLoadingId(`delete-${enrollment.id}`);
    try {
      const res = await fetch('/api/admin/enrollments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: enrollment.id })
      });
      const data = await res.json();
      if (data.success) {
        setEnrollments(prev => prev.filter(e => e.id !== enrollment.id && e.trackingCode !== enrollment.id));
        setToastMessage(`🗑️ Enrollment record for ${enrollment.name} permanently deleted.`);
        setTimeout(() => setToastMessage(null), 5000);
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to delete enrollment');
      }
    } catch (e: any) {
      console.error(e);
      alert('Network error while deleting');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    if (!confirm(`⚠️ PERMANENT DELETE:\nAre you sure you want to permanently delete student "${student.name}" (${student.email})?\n\nThis will remove their account and LMS access completely from the database.`)) {
      return;
    }
    setActionLoadingId(`del-std-${student.id}`);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: student.id, email: student.email })
      });
      const data = await res.json();
      if (data.success) {
        setStudents(prev => prev.filter(s => s.id !== student.id && s.email.toLowerCase() !== student.email.toLowerCase()));
        setStats(prev => ({
          ...prev,
          totalStudents: Math.max(0, prev.totalStudents - 1)
        }));
        setToastMessage(`🗑️ Student "${student.name}" permanently deleted.`);
        setTimeout(() => setToastMessage(null), 5000);
        fetchDashboardData();
      } else {
        alert(data.message || 'Failed to delete student');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error deleting student: ' + err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCopyPass = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedPassId(id);
      setTimeout(() => setCopiedPassId(null), 2500);
    } catch (e) {}
  };

  const handleCopyFullCredentials = (studentName: string, email: string, pass: string, id: string) => {
    const message = 
      `🎉 *Assalam-o-Alaikum ${studentName}! Welcome to Ecom With Sami Mentorship!*\n\n` +
      `Your Student LMS Portal Account is *ACTIVE*.\n\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🔐 *YOUR LMS LOGIN CREDENTIALS:*\n` +
      `🌐 *Login Portal:* https://ecomwithsami.com/login\n` +
      `📧 *Email:* ${email}\n` +
      `🔑 *Password:* ${pass}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `✅ *How to Login:*\n` +
      `1. Go to: https://ecomwithsami.com/login\n` +
      `2. Enter your Email and Password above\n` +
      `3. Start watching course lectures!\n\n` +
      `Best Regards,\n` +
      `*Mentor Sardar Samiullah*`;

    try {
      navigator.clipboard.writeText(message);
      setCopiedPassId(id);
      setToastMessage(`📋 Full Credentials copied for ${studentName}! Ready to paste in WhatsApp/SMS.`);
      setTimeout(() => setCopiedPassId(null), 2500);
      setTimeout(() => setToastMessage(null), 5000);
    } catch (e) {}
  };

  const handleResetPassword = async (identifier: string, name?: string) => {
    const confirmReset = confirm(
      `🔑 RESET PASSWORD:\nAre you sure you want to reset the LMS password for "${name || identifier}"?\n\nA new unique 8-digit numeric password will be generated, saved to database, and copied to your clipboard immediately.`
    );
    if (!confirmReset) return null;

    setResetLoadingId(identifier);
    try {
      const res = await fetch('/api/admin/enrollments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: identifier })
      });
      const data = await res.json();
      if (data.success && data.newPassword) {
        const newPass = data.newPassword;
        setEnrollments(prev => prev.map(e => 
          (e.id === identifier || e.trackingCode === identifier || e.email.toLowerCase() === identifier.toLowerCase() || (data.email && e.email.toLowerCase() === data.email.toLowerCase()))
            ? { ...e, password: newPass }
            : e
        ));
        setStudents(prev => prev.map(s => 
          (s.id === identifier || s.email.toLowerCase() === identifier.toLowerCase() || (data.email && s.email.toLowerCase() === data.email.toLowerCase()))
            ? { ...s, password: newPass }
            : s
        ));

        try {
          await navigator.clipboard.writeText(newPass);
        } catch (e) {}

        setToastMessage(`🔑 New Password for ${name || data.email || 'Student'}: ${newPass} (Saved & Copied!)`);
        setTimeout(() => setToastMessage(null), 6000);
        return newPass;
      } else {
        alert(data.message || 'Failed to reset password');
        return null;
      }
    } catch (e: any) {
      console.error(e);
      alert('Network error while resetting password');
      return null;
    } finally {
      setResetLoadingId(null);
    }
  };

  const handlePerformQuickReset = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = quickResetInput.trim();
    if (!query) return;

    setQuickResetLoading(true);
    setQuickResetResult(null);

    try {
      const res = await fetch('/api/admin/enrollments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: query })
      });
      const data = await res.json();
      if (data.success && data.newPassword) {
        const matchedEnr = enrollments.find(enr => 
          enr.trackingCode.toLowerCase() === query.toLowerCase() || 
          enr.id === query || 
          enr.email.toLowerCase() === data.email.toLowerCase()
        );
        const matchedStd = students.find(s => 
          s.email.toLowerCase() === data.email.toLowerCase() || 
          s.id === query
        );

        const studentName = matchedEnr?.name || matchedStd?.name || data.email.split('@')[0];
        const studentPhone = matchedEnr?.phone || matchedStd?.phone || '';

        setQuickResetResult({
          email: data.email,
          newPassword: data.newPassword,
          name: studentName,
          phone: studentPhone
        });

        // Update local states
        setEnrollments(prev => prev.map(enr => 
          (enr.email.toLowerCase() === data.email.toLowerCase() || enr.trackingCode.toLowerCase() === query.toLowerCase() || enr.id === query)
            ? { ...enr, password: data.newPassword }
            : enr
        ));
        setStudents(prev => prev.map(s => 
          (s.email.toLowerCase() === data.email.toLowerCase() || s.id === query)
            ? { ...s, password: data.newPassword }
            : s
        ));

        // Copy new password to clipboard
        try {
          await navigator.clipboard.writeText(data.newPassword);
        } catch (e) {}

        setToastMessage(`🔑 New Password: ${data.newPassword} for ${studentName} (Saved in Supabase & Copied!)`);
        setTimeout(() => setToastMessage(null), 6000);
      } else {
        alert(data.message || 'No student or enrollment record found for: ' + query);
      }
    } catch (err: any) {
      console.error(err);
      alert('Error during password reset: ' + err.message);
    } finally {
      setQuickResetLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const enr = enrollments.find(e => e.id === id || e.trackingCode === id);
    if (enr) {
      if (status === 'approved') return handleApprove(enr);
      if (status === 'rejected') return handleReject(enr);
    }
  };

  const handleOpenAccessModal = (enrollment: Enrollment) => {
    const matchingStudent = students.find(s => s.email.toLowerCase() === enrollment.email.toLowerCase());
    const initialPassword = enrollment.password || matchingStudent?.password || generateFallbackPassword(enrollment.trackingCode || enrollment.id);
    const waUrl = generateWhatsAppUrl(enrollment, initialPassword);

    setAccessModalData({
      enrollment,
      password: initialPassword,
      whatsappUrl: waUrl,
      isApproved: enrollment.status === 'approved',
      granting: false,
      statusMsg: enrollment.status === 'approved' ? 'Account is already verified in LMS. You can view password or resend credentials to WhatsApp.' : ''
    });
  };

  const handleRegeneratePassword = () => {
    if (!accessModalData) return;
    const newPass = Math.floor(10000000 + Math.random() * 90000000).toString();
    const newWaUrl = generateWhatsAppUrl(accessModalData.enrollment, newPass);
    setAccessModalData({
      ...accessModalData,
      password: newPass,
      whatsappUrl: newWaUrl,
      statusMsg: 'New 8-digit numeric password generated! Click "Grant Access & Send Password on WhatsApp" to save and send.'
    });
  };

  const handleGrantAccessAndSendWhatsApp = async () => {
    if (!accessModalData) return;
    const { enrollment, password } = accessModalData;
    setAccessModalData(prev => prev ? { ...prev, granting: true, statusMsg: 'Saving to Database & Activating LMS Account...' } : null);

    try {
      const res = await fetch('/api/admin/enrollments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: enrollment.id,
          status: 'approved',
          password
        })
      });
      const data = await res.json();
      if (data.success) {
        const finalPass = data.password || password;
        const waUrl = data.whatsappUrl || generateWhatsAppUrl(enrollment, finalPass);

        setAccessModalData({
          enrollment: { ...enrollment, status: 'approved' },
          password: finalPass,
          whatsappUrl: waUrl,
          isApproved: true,
          granting: false,
          statusMsg: '✅ LMS Access Granted! Password saved in database. Opening WhatsApp...'
        });

        fetchDashboardData();

        // Open WhatsApp directly for Admin
        if (typeof window !== 'undefined') {
          window.open(waUrl, '_blank');
        }
      } else {
        setAccessModalData(prev => prev ? { ...prev, granting: false, statusMsg: `❌ ${data.message || 'Failed to update'}` } : null);
      }
    } catch (err: any) {
      setAccessModalData(prev => prev ? { ...prev, granting: false, statusMsg: `❌ Error: ${err.message}` } : null);
    }
  };

  const handleCopyAccessText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccessId(id);
    setTimeout(() => setCopiedAccessId(null), 2500);
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.email) return;

    try {
      const res = await fetch('/api/enrollment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newStudent.name,
          email: newStudent.email,
          phone: newStudent.phone,
          city: newStudent.city,
          paymentMethod: 'Manual Admin Entry',
          transactionId: 'ADMIN-DIRECT-ACCESS'
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddStudent(false);
        setNewStudent({ name: '', email: '', phone: '', city: 'Lahore', password: 'studentpass2026' });
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredEnrollments = enrollments.filter(e => {
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    const matchesSearch = e.name.toLowerCase().includes(searchEnrollment.toLowerCase()) ||
                          e.email.toLowerCase().includes(searchEnrollment.toLowerCase()) ||
                          e.trackingCode.toLowerCase().includes(searchEnrollment.toLowerCase()) ||
                          e.phone.includes(searchEnrollment);
    return matchesStatus && matchesSearch;
  });

  const filteredStudents = students.filter(s => {
    return s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
           s.email.toLowerCase().includes(searchStudent.toLowerCase()) ||
           s.phone.includes(searchStudent);
  });

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col md:flex-row font-sans selection:bg-[#00A0DF] selection:text-white">
      
      {/* Mobile Top Header */}
      <header className="md:hidden bg-[#111827] border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00A0DF] to-[#0077aa] flex items-center justify-center font-black text-white text-xs">
              S
            </div>
            <span className="font-extrabold text-sm text-white">Sami Admin</span>
          </div>
        </div>

        <Link
          href="/admin/cms"
          className="px-3 py-1.5 rounded-xl bg-[#00A0DF] text-xs font-black text-white"
        >
          CMS
        </Link>
      </header>

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-[#111827] border-r border-white/10 p-5 sm:p-6 flex flex-col justify-between transition-transform duration-300 transform ${
          mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00A0DF] to-[#0077aa] flex items-center justify-center font-black text-white shadow-lg shadow-[#00A0DF]/30">
                S
              </div>
              <div>
                <span className="font-extrabold text-sm block">Sami Admin</span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Control
                </span>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="space-y-1.5 text-xs font-bold text-slate-400">
            <button
              onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'overview' ? 'bg-[#00A0DF] text-white shadow-md shadow-[#00A0DF]/20' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingUp size={16} />
              <span>Dashboard Overview</span>
            </button>
            <Link
              href="/admin/cms"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[#00A0DF] bg-[#00A0DF]/10 border border-[#00A0DF]/30 hover:bg-[#00A0DF]/20 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles size={16} />
                <span>Website &amp; LMS CMS</span>
              </div>
              <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => { setActiveTab('enrollments'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'enrollments' ? 'bg-[#00A0DF] text-white shadow-md shadow-[#00A0DF]/20' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard size={16} />
                <span>Enrollment Queue</span>
              </div>
              {stats.pendingApprovals > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px]">
                  {stats.pendingApprovals}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('students'); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'students' ? 'bg-[#00A0DF] text-white shadow-md shadow-[#00A0DF]/20' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users size={16} />
              <span>Students Directory</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-white/10 mt-6 flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Eye size={14} />
            <span>View Public Website</span>
          </Link>
          <Link
            href="/lms"
            target="_blank"
            className="flex items-center gap-2 text-xs text-[#00A0DF] hover:underline"
          >
            <ShieldCheck size={14} />
            <span>Open Student LMS</span>
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors pt-1"
          >
            <LogOut size={14} />
            <span>Sign Out Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Stage */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 relative">
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed top-5 right-4 sm:right-8 z-50 bg-[#111827] border-2 border-emerald-500/60 shadow-2xl rounded-2xl px-5 py-3.5 flex items-center gap-3 text-white text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top duration-300">
              <Sparkles size={16} className="text-emerald-400 flex-shrink-0" />
              <span>{toastMessage}</span>
              <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white p-1">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">Platform Control Panel</h1>
              <p className="text-xs text-slate-400 mt-0.5">Ecom With Sami Mentorship &bull; Real-time Operations</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="p-2 sm:p-2.5 rounded-xl bg-[#111827] border border-white/10 hover:bg-slate-800 text-slate-300 transition-colors disabled:opacity-60"
                title="Refresh Live Data"
              >
                <RotateCcw size={15} className={loading ? 'animate-spin text-[#00A0DF]' : ''} />
              </button>
              <button
                onClick={() => {
                  setQuickResetInput('');
                  setQuickResetResult(null);
                  setShowQuickResetModal(true);
                }}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-black shadow-md shadow-amber-500/10 transition-all active:scale-95"
                title="Find & Reset Student Password by Enrollment ID"
              >
                <KeyRound size={14} className="text-amber-400" />
                <span>Reset Password Tool</span>
              </button>
              <button
                onClick={() => setShowAddStudent(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-black text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Plus size={14} />
                <span>Add Student</span>
              </button>
              <Link
                href="/admin/cms"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-xs font-black text-white shadow-lg shadow-[#00A0DF]/30 transition-all active:scale-95"
              >
                <Sparkles size={14} />
                <span>Open CMS</span>
              </Link>
            </div>
          </div>

          {/* Mobile Quick-Tab Switcher Bar */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs font-bold border-b border-white/10 pb-3">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'overview' ? 'bg-[#00A0DF] text-white shadow-md shadow-[#00A0DF]/30 font-black' : 'bg-[#111827] text-slate-400'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('enrollments')}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                activeTab === 'enrollments' ? 'bg-[#00A0DF] text-white shadow-md shadow-[#00A0DF]/30 font-black' : 'bg-[#111827] text-slate-400'
              }`}
            >
              <span>Queue</span>
              {stats.pendingApprovals > 0 && (
                <span className="bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full text-[9px]">
                  {stats.pendingApprovals}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === 'students' ? 'bg-[#00A0DF] text-white shadow-md shadow-[#00A0DF]/30 font-black' : 'bg-[#111827] text-slate-400'
              }`}
            >
              Students ({students.length})
            </button>
            <Link
              href="/admin/cms"
              className="px-3.5 py-1.5 rounded-xl whitespace-nowrap bg-[#00A0DF]/15 text-[#00A0DF] border border-[#00A0DF]/30 flex items-center gap-1"
            >
              <Sparkles size={12} />
              <span>CMS</span>
            </Link>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1 sm:mb-2">
                <span className="text-[11px] sm:text-xs">Students</span>
                <Users size={15} className="text-[#00A0DF]" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-white">{stats.totalStudents}</div>
              <span className="text-[9px] sm:text-[10px] text-emerald-400 font-bold mt-1 block">Trained &amp; Active</span>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1 sm:mb-2">
                <span className="text-[11px] sm:text-xs">Pending</span>
                <Clock size={15} className="text-amber-400" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-amber-400">{stats.pendingApprovals}</div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-1 block">1-click LMS activation</span>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1 sm:mb-2">
                <span className="text-[11px] sm:text-xs">Active LMS</span>
                <CheckCircle2 size={15} className="text-emerald-400" />
              </div>
              <div className="text-lg sm:text-2xl font-black text-emerald-400">{stats.approvedEnrollments}</div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-1 block">Access Enabled</span>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1 sm:mb-2">
                <span className="text-[11px] sm:text-xs">Revenue</span>
                <TrendingUp size={15} className="text-indigo-400" />
              </div>
              <div className="text-base sm:text-2xl font-black text-white">{stats.totalRevenueFormatted}</div>
              <span className="text-[9px] sm:text-[10px] text-indigo-400 font-bold mt-1 block">Fee: PKR 3,799</span>
            </div>
          </div>

          {/* TAB 1: OVERVIEW QUEUE */}
          {activeTab === 'overview' && (
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-white">Live Student Enrollment Requests</h3>
                <button
                  onClick={() => setActiveTab('enrollments')}
                  className="text-xs text-[#00A0DF] font-bold hover:underline"
                >
                  View All ({enrollments.length}) &rarr;
                </button>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-3">Tracking Code</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">WhatsApp</th>
                      <th className="pb-3">Payment</th>
                      <th className="pb-3">Source</th>
                      <th className="pb-3">Proof Slip</th>
                      <th className="pb-3">LMS Password</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {enrollments.slice(0, 6).map((r) => (
                      <tr key={r.id}>
                        <td className="py-3 font-mono text-[11px] text-[#00A0DF] font-bold">{r.trackingCode}</td>
                        <td className="py-3 font-bold text-white">{r.name}</td>
                        <td className="py-3 text-slate-400">{r.phone}</td>
                        <td className="py-3">{r.paymentMethod}</td>
                        <td className="py-3">
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                            {r.whereHeard || 'TikTok'}
                          </span>
                        </td>
                        <td className="py-3">
                          {r.receiptUrl ? (
                            <button
                              onClick={() => setPreviewReceipt(r)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00A0DF] hover:underline"
                            >
                              <ImageIcon size={13} /> View Slip
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500">No Slip</span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-emerald-400 font-bold bg-[#0B0F19] px-2 py-0.5 rounded border border-emerald-500/20 text-[11px] tracking-wider select-all">
                              {r.password || generateFallbackPassword(r.trackingCode || r.id)}
                            </span>
                            <button
                              onClick={() => handleCopyPass(r.password || generateFallbackPassword(r.trackingCode || r.id), `ov-${r.id}`)}
                              className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded hover:bg-slate-700 transition-colors"
                              title="Copy Password"
                            >
                              {copiedPassId === `ov-${r.id}` ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                            <button
                              onClick={() => handleResetPassword(r.trackingCode || r.id, r.name)}
                              disabled={resetLoadingId === (r.trackingCode || r.id)}
                              className="p-1 text-amber-400 hover:text-amber-300 bg-amber-500/10 rounded hover:bg-amber-500/20 transition-colors"
                              title="Reset / Generate New 8-digit Password"
                            >
                              {resetLoadingId === (r.trackingCode || r.id) ? <Loader2 size={11} className="animate-spin text-amber-400" /> : <RotateCcw size={11} />}
                            </button>
                          </div>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase ${
                              r.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : r.status === 'rejected'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {r.status !== 'approved' ? (
                              <button
                                onClick={() => handleApprove(r)}
                                disabled={actionLoadingId === `approve-${r.id}`}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                                title="Approve Enrollment & Activate LMS Account"
                              >
                                {actionLoadingId === `approve-${r.id}` ? (
                                  <Loader2 size={12} className="animate-spin text-white" />
                                ) : (
                                  <Check size={12} className="text-white font-black" />
                                )}
                                <span>Approve</span>
                              </button>
                            ) : (
                              <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <CheckCircle2 size={11} /> Active
                              </span>
                            )}

                            {r.status !== 'rejected' && (
                              <button
                                onClick={() => handleReject(r)}
                                disabled={actionLoadingId === `reject-${r.id}`}
                                className="px-2 py-1.5 bg-red-600/20 hover:bg-red-600/40 disabled:opacity-50 text-red-400 rounded-lg font-bold text-[11px] flex items-center gap-1 active:scale-95 transition-all border border-red-500/20"
                                title="Reject Enrollment"
                              >
                                {actionLoadingId === `reject-${r.id}` ? (
                                  <Loader2 size={12} className="animate-spin text-red-400" />
                                ) : (
                                  <X size={11} />
                                )}
                                <span>Reject</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(r)}
                              disabled={actionLoadingId === `delete-${r.id}`}
                              className="p-1.5 bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-300 rounded-lg text-[11px] flex items-center justify-center active:scale-95 transition-all border border-white/5"
                              title="Permanently Delete Enrollment"
                            >
                              {actionLoadingId === `delete-${r.id}` ? (
                                <Loader2 size={12} className="animate-spin text-red-400" />
                              ) : (
                                <Trash2 size={12} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ENROLLMENTS */}
          {activeTab === 'enrollments' && (
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
              
              {/* Quick Password Reset / Forget Finder Box */}
              <div className="bg-[#0B0F19] border border-amber-500/30 rounded-2xl p-3.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 flex-shrink-0">
                    <KeyRound size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white flex items-center gap-1.5">
                      <span>Student Password Finder / Reset</span>
                      <span className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0.2 rounded font-mono">Live</span>
                    </div>
                    <p className="text-[11px] text-slate-400">Enter Enrollment Tracking Code (e.g. SAMI-ENR-XXXXX) or Email to regenerate a new unique numeric PIN.</p>
                  </div>
                </div>

                <form onSubmit={handlePerformQuickReset} className="flex items-center gap-2 flex-1 md:max-w-md">
                  <input
                    type="text"
                    placeholder="Paste Tracking Code or Email..."
                    value={quickResetInput}
                    onChange={(e) => setQuickResetInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#111827] border border-white/15 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={quickResetLoading || !quickResetInput.trim()}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center gap-1.5 whitespace-nowrap shadow-md shadow-amber-500/20 transition-all active:scale-95"
                  >
                    {quickResetLoading ? <Loader2 size={13} className="animate-spin" /> : <RotateCcw size={13} />}
                    <span>Reset Password</span>
                  </button>
                </form>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                <h3 className="text-sm sm:text-base font-bold text-white">Enrollments &amp; Receipt Records</h3>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search name, phone, TID..."
                      value={searchEnrollment}
                      onChange={(e) => setSearchEnrollment(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00A0DF]"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-2.5 py-1.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-3">Tracking Code</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Phone &amp; City</th>
                      <th className="pb-3">Source</th>
                      <th className="pb-3">Method &amp; TID</th>
                      <th className="pb-3">Slip Proof</th>
                      <th className="pb-3">LMS Password</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {filteredEnrollments.map((r) => (
                      <tr key={r.id}>
                        <td className="py-3 font-mono text-[11px] text-[#00A0DF] font-bold">{r.trackingCode}</td>
                        <td className="py-3 font-bold text-white">{r.name}</td>
                        <td className="py-3 text-slate-400">{r.email}</td>
                        <td className="py-3">
                          <div>{r.phone}</div>
                          <div className="text-[10px] text-slate-500">{r.city}</div>
                        </td>
                        <td className="py-3">
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                            {r.whereHeard || 'TikTok'}
                          </span>
                        </td>
                        <td className="py-3">
                          <div>{r.paymentMethod}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{r.transactionId}</div>
                        </td>
                        <td className="py-3">
                          {r.receiptUrl ? (
                            <button
                              onClick={() => setPreviewReceipt(r)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00A0DF] hover:underline"
                            >
                              <ImageIcon size={13} /> View Slip
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-500">No Slip</span>
                          )}
                        </td>
                        <td className="py-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <span className="font-mono text-emerald-400 font-bold bg-[#0B0F19] px-2 py-0.5 rounded border border-emerald-500/20 text-[11px] tracking-wider select-all">
                                {r.password || generateFallbackPassword(r.trackingCode || r.id)}
                              </span>
                              <button
                                onClick={() => handleCopyPass(r.password || generateFallbackPassword(r.trackingCode || r.id), `enr-${r.id}`)}
                                className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded hover:bg-slate-700 transition-colors"
                                title="Copy Password"
                              >
                                {copiedPassId === `enr-${r.id}` ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                              </button>
                              <button
                                onClick={() => handleResetPassword(r.trackingCode || r.id, r.name)}
                                disabled={resetLoadingId === (r.trackingCode || r.id)}
                                className="p-1 text-amber-400 hover:text-amber-300 bg-amber-500/10 rounded hover:bg-amber-500/20 transition-colors"
                                title="Regenerate New 8-digit Password"
                              >
                                {resetLoadingId === (r.trackingCode || r.id) ? <Loader2 size={11} className="animate-spin text-amber-400" /> : <RotateCcw size={11} />}
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyFullCredentials(r.name, r.email, r.password || generateFallbackPassword(r.trackingCode || r.id), `full-${r.id}`)}
                                className="text-[10px] text-[#00A0DF] hover:underline flex items-center gap-0.5"
                                title="Copy full credentials message"
                              >
                                <Copy size={10} />
                                <span>{copiedPassId === `full-${r.id}` ? 'Copied!' : 'Copy Card'}</span>
                              </button>
                              <a
                                href={generateWhatsAppUrl(r, r.password || generateFallbackPassword(r.trackingCode || r.id))}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5"
                                title="Open WhatsApp chat with pre-written login info"
                              >
                                <MessageSquare size={10} />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase ${
                              r.status === 'approved'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : r.status === 'rejected'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {r.status !== 'approved' ? (
                              <button
                                onClick={() => handleApprove(r)}
                                disabled={actionLoadingId === `approve-${r.id}`}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                                title="Approve Enrollment & Activate LMS Account"
                              >
                                {actionLoadingId === `approve-${r.id}` ? (
                                  <Loader2 size={12} className="animate-spin text-white" />
                                ) : (
                                  <Check size={12} className="text-white font-black" />
                                )}
                                <span>Approve</span>
                              </button>
                            ) : (
                              <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                                <CheckCircle2 size={11} /> Active
                              </span>
                            )}

                            {r.status !== 'rejected' && (
                              <button
                                onClick={() => handleReject(r)}
                                disabled={actionLoadingId === `reject-${r.id}`}
                                className="px-2 py-1.5 bg-red-600/20 hover:bg-red-600/40 disabled:opacity-50 text-red-400 rounded-lg font-bold text-[11px] flex items-center gap-1 active:scale-95 transition-all border border-red-500/20"
                                title="Reject Enrollment"
                              >
                                {actionLoadingId === `reject-${r.id}` ? (
                                  <Loader2 size={12} className="animate-spin text-red-400" />
                                ) : (
                                  <X size={11} />
                                )}
                                <span>Reject</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(r)}
                              disabled={actionLoadingId === `delete-${r.id}`}
                              className="p-1.5 bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-300 rounded-lg text-[11px] flex items-center justify-center active:scale-95 transition-all border border-white/5"
                              title="Permanently Delete Enrollment"
                            >
                              {actionLoadingId === `delete-${r.id}` ? (
                                <Loader2 size={12} className="animate-spin text-red-400" />
                              ) : (
                                <Trash2 size={12} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: STUDENTS DIRECTORY */}
          {activeTab === 'students' && (
            <div className="bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-sm sm:text-base font-bold text-white">Registered Students ({students.length})</h3>
                <div className="relative w-full sm:w-64">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search student email, name..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <table className="w-full text-left text-xs min-w-[750px]">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Login Email</th>
                      <th className="pb-3">WhatsApp</th>
                      <th className="pb-3">City</th>
                      <th className="pb-3">LMS Access</th>
                      <th className="pb-3">LMS Password</th>
                      <th className="pb-3">Lectures</th>
                      <th className="pb-3 text-right">Credentials Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {filteredStudents.map((s) => (
                      <tr key={s.id}>
                        <td className="py-3 font-bold text-white">{s.name}</td>
                        <td className="py-3 text-[#00A0DF] font-mono">{s.email}</td>
                        <td className="py-3">{s.phone}</td>
                        <td className="py-3">{s.city}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {s.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-emerald-400 font-bold bg-[#0B0F19] px-2 py-0.5 rounded border border-emerald-500/20 text-[11px] tracking-wider select-all">
                              {s.password || generateFallbackPassword(s.id || s.email)}
                            </span>
                            <button
                              onClick={() => handleCopyPass(s.password || generateFallbackPassword(s.id || s.email), `std-p-${s.id}`)}
                              className="p-1 text-slate-400 hover:text-white bg-slate-800 rounded hover:bg-slate-700 transition-colors"
                              title="Copy Password"
                            >
                              {copiedPassId === `std-p-${s.id}` ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-slate-400">
                          {s.completedLessons?.length || 0}/36
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => handleResetPassword(s.id, s.name)}
                              disabled={resetLoadingId === s.id}
                              className="px-2 py-1 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-amber-500/30 transition-all active:scale-95"
                              title="Generate & Save New 8-digit Password"
                            >
                              {resetLoadingId === s.id ? <Loader2 size={11} className="animate-spin text-amber-400" /> : <RotateCcw size={11} />}
                              <span>Reset PIN</span>
                            </button>
                            <button
                              onClick={() => handleCopyFullCredentials(s.name, s.email, s.password || generateFallbackPassword(s.id || s.email), `std-full-${s.id}`)}
                              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-white/5 transition-all"
                              title="Copy Full Login Card"
                            >
                              <Copy size={11} className="text-[#00A0DF]" />
                              <span>{copiedPassId === `std-full-${s.id}` ? 'Copied!' : 'Login Card'}</span>
                            </button>
                            {s.phone && (
                              <a
                                href={generateWhatsAppUrl(s, s.password || generateFallbackPassword(s.id || s.email))}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-[11px] flex items-center justify-center border border-emerald-500/20 transition-all"
                                title="Send Credentials via WhatsApp"
                              >
                                <MessageSquare size={12} />
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteStudent(s)}
                              disabled={actionLoadingId === `del-std-${s.id}`}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 hover:text-red-300 rounded-lg text-[11px] flex items-center justify-center border border-red-500/20 transition-all active:scale-95"
                              title="Delete Student from Database"
                            >
                              {actionLoadingId === `del-std-${s.id}` ? (
                                <Loader2 size={12} className="animate-spin text-red-400" />
                              ) : (
                                <Trash2 size={12} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Payment Receipt Image Preview Modal */}
      {previewReceipt && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl space-y-3 sm:space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Payment Screenshot Proof</h3>
                <p className="text-[11px] sm:text-xs text-slate-400">{previewReceipt.name} &bull; {previewReceipt.trackingCode}</p>
              </div>
              <button onClick={() => setPreviewReceipt(null)} className="text-slate-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <div className="bg-[#0B0F19] rounded-2xl p-2 border border-white/10 max-h-72 sm:max-h-80 overflow-auto flex items-center justify-center">
              {previewReceipt.receiptUrl ? (
                <img
                  src={previewReceipt.receiptUrl}
                  alt="Payment Receipt"
                  className="max-h-64 sm:max-h-72 w-auto rounded-xl object-contain shadow-md"
                />
              ) : (
                <div className="py-8 text-slate-500 text-xs">No screenshot image attached</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#0B0F19] p-3 rounded-xl border border-white/5">
              <div><span className="text-slate-400">Method:</span> <strong>{previewReceipt.paymentMethod}</strong></div>
              <div><span className="text-slate-400">TID:</span> <strong className="font-mono">{previewReceipt.transactionId}</strong></div>
              <div><span className="text-slate-400">Phone:</span> <strong>{previewReceipt.phone}</strong></div>
              <div><span className="text-slate-400">City:</span> <strong>{previewReceipt.city}</strong></div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const r = previewReceipt;
                    setPreviewReceipt(null);
                    handleReject(r);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-bold transition-colors flex items-center gap-1.5"
                >
                  <X size={14} />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => {
                    const r = previewReceipt;
                    setPreviewReceipt(null);
                    handleDelete(r);
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-300 text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/5"
                >
                  <Trash2 size={13} />
                  <span>Delete</span>
                </button>
              </div>

              <button
                onClick={() => {
                  const r = previewReceipt;
                  setPreviewReceipt(null);
                  handleApprove(r);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all active:scale-95"
              >
                <Check size={16} />
                <span>Approve &amp; Activate LMS</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Student Add Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-bold text-white">Add Student Manually</h3>
              <button onClick={() => setShowAddStudent(false)} className="text-slate-400 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Khan"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Student Login Email *</label>
                <input
                  type="email"
                  required
                  placeholder="student@gmail.com"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="03001234567"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Lahore"
                    value={newStudent.city}
                    onChange={(e) => setNewStudent({ ...newStudent, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00A0DF]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 mt-4 active:scale-95"
              >
                Grant Instant LMS Access
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Quick Password Reset & Credential Generator Modal */}
      {showQuickResetModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-lg bg-[#111827] border-2 border-amber-500/40 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <KeyRound size={18} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">Student Password Reset Tool</h3>
                  <p className="text-[11px] text-slate-400">Generate a unique numeric password &amp; save to Supabase</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowQuickResetModal(false);
                  setQuickResetResult(null);
                }} 
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePerformQuickReset} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  Student Enrollment ID (Tracking Code) or Login Email
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. SAMI-ENR-12345 or student@gmail.com"
                    value={quickResetInput}
                    onChange={(e) => setQuickResetInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/15 text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={quickResetLoading || !quickResetInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all active:scale-95 whitespace-nowrap"
                  >
                    {quickResetLoading ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />}
                    <span>Reset &amp; Generate</span>
                  </button>
                </div>
              </div>
            </form>

            {quickResetResult && (
              <div className="bg-[#0B0F19] rounded-2xl p-4 border border-emerald-500/30 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs text-slate-400">Student Name:</span>
                  <strong className="text-white text-xs font-bold">{quickResetResult.name}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <span className="text-xs text-slate-400">Login Email:</span>
                  <span className="text-[#00A0DF] font-mono text-xs font-bold">{quickResetResult.email}</span>
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-400 mb-1">New 8-digit Numeric Password:</div>
                  <div className="flex items-center gap-2 bg-[#111827] p-2.5 rounded-xl border border-white/10">
                    <span className="font-mono text-emerald-400 font-black text-lg tracking-widest flex-1">
                      {quickResetResult.newPassword}
                    </span>
                    <button
                      onClick={() => handleCopyPass(quickResetResult.newPassword, 'modal-quick-pass')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Copy size={13} className="text-[#00A0DF]" />
                      <span>{copiedPassId === 'modal-quick-pass' ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    onClick={() => handleCopyFullCredentials(quickResetResult.name || 'Student', quickResetResult.email, quickResetResult.newPassword, 'modal-quick-full')}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                  >
                    <Copy size={13} className="text-[#00A0DF]" />
                    <span>{copiedPassId === 'modal-quick-full' ? 'Credentials Copied!' : 'Copy Full Message'}</span>
                  </button>

                  {quickResetResult.phone && (
                    <a
                      href={generateWhatsAppUrl({ name: quickResetResult.name || 'Student', email: quickResetResult.email, phone: quickResetResult.phone }, quickResetResult.newPassword)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1faa53] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <MessageSquare size={14} />
                      <span>Send on WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STUDENT LMS CREDENTIALS & WHATSAPP ACCESS MODAL */}
      {/* ========================================================================= */}
      {accessModalData && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg bg-[#111827] border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4 my-auto relative animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <KeyRound size={18} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">Student LMS Access &amp; WhatsApp</h3>
                  <p className="text-[11px] text-slate-400">Generate &amp; Dispatch Student Password</p>
                </div>
              </div>
              <button
                onClick={() => setAccessModalData(null)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Student Info Card */}
            <div className="bg-[#0B0F19] rounded-2xl p-4 border border-white/10 space-y-2 text-xs text-slate-300">
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <span className="text-slate-400">Student Name:</span>
                <strong className="text-white text-sm font-bold">{accessModalData.enrollment.name}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Login Email:</span>
                <span className="text-[#00A0DF] font-mono font-bold">{accessModalData.enrollment.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">WhatsApp / Phone:</span>
                <span className="text-emerald-400 font-mono font-bold">{accessModalData.enrollment.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">City / Origin:</span>
                <span className="text-slate-200">{accessModalData.enrollment.city || 'Pakistan'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Payment &amp; TID:</span>
                <span className="text-slate-300">{accessModalData.enrollment.paymentMethod} &bull; <code className="font-mono text-slate-400">{accessModalData.enrollment.transactionId}</code></span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-white/5">
                <span className="text-slate-400">Current Status:</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  accessModalData.isApproved
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {accessModalData.isApproved ? 'Active LMS Account' : 'Pending Verification'}
                </span>
              </div>
            </div>

            {/* Password Configuration & Display Box */}
            <div className="bg-gradient-to-r from-slate-900 via-[#111827] to-slate-900 border border-[#00A0DF]/30 rounded-2xl p-4 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-[#00A0DF] uppercase flex items-center gap-1.5">
                  <Lock size={13} />
                  <span>Student LMS Password</span>
                </label>
                <button
                  type="button"
                  onClick={handleRegeneratePassword}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 hover:underline"
                  title="Generate New Random Password"
                >
                  <RefreshCw size={11} />
                  <span>Regenerate Password</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={accessModalData.password}
                    onChange={(e) => {
                      const newPass = e.target.value;
                      const newWaUrl = generateWhatsAppUrl(accessModalData.enrollment, newPass);
                      setAccessModalData({ ...accessModalData, password: newPass, whatsappUrl: newWaUrl });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F19] border border-white/15 text-sm sm:text-base font-mono font-black text-emerald-400 tracking-wider focus:outline-none focus:border-[#00A0DF]"
                    placeholder="Enter student password"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyAccessText(accessModalData.password, 'modal-pass')}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/10 flex-shrink-0"
                >
                  <Copy size={13} className="text-[#00A0DF]" />
                  <span>{copiedAccessId === 'modal-pass' ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Student will use their email <code className="text-white font-mono">{accessModalData.enrollment.email}</code> and this password to log in at <code className="text-[#00A0DF]">/login</code>.
              </p>
            </div>

            {/* Status / Feedback message */}
            {accessModalData.statusMsg && (
              <div className="bg-slate-800/80 border border-white/10 rounded-xl p-3 text-xs text-slate-200 font-bold flex items-center gap-2">
                <Sparkles size={14} className="text-[#00A0DF] flex-shrink-0" />
                <span>{accessModalData.statusMsg}</span>
              </div>
            )}

            {/* WhatsApp Actions */}
            <div className="space-y-2.5 pt-1">
              <button
                type="button"
                disabled={accessModalData.granting}
                onClick={handleGrantAccessAndSendWhatsApp}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#1faa53] disabled:opacity-50 text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/30 transition-all active:scale-98"
              >
                <MessageSquare size={17} />
                <span>{accessModalData.granting ? 'Granting LMS Access...' : 'Grant Access & Send Password on WhatsApp'}</span>
                <Send size={15} />
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const rawMsg = `🎉 Assalam-o-Alaikum ${accessModalData.enrollment.name}! Welcome to Ecom With Sami Mentorship!\n\nYour enrollment payment proof has been verified and your Student LMS Portal Account is now ACTIVE.\n\n━━━━━━━━━━━━━━━━━━━━\n🔐 YOUR LMS LOGIN CREDENTIALS:\n🌐 Login Portal: https://ecomwithsami.com/login\n📧 Email: ${accessModalData.enrollment.email}\n🔑 Password: ${accessModalData.password}\n━━━━━━━━━━━━━━━━━━━━\n\n✅ Next Steps:\n1. Open the portal link above\n2. Enter your Email and Password\n3. Start watching the 11 Course Modules and access the Supplier Directory!\n\nBest Regards,\nMentor Sardar Samiullah & Support Team`;
                    handleCopyAccessText(rawMsg, 'modal-full-msg');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                >
                  <Copy size={13} className="text-[#00A0DF]" />
                  <span>{copiedAccessId === 'modal-full-msg' ? 'Full Message Copied!' : 'Copy Credentials Message'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAccessModalData(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold transition-colors border border-white/10"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
