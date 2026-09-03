'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Filter
} from 'lucide-react';
import { Enrollment, Student } from '@/utils/db';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'enrollments' | 'students'>('overview');
  const [stats, setStats] = useState({
    totalStudents: 9742,
    pendingApprovals: 1,
    approvedEnrollments: 9741,
    totalRevenueFormatted: 'PKR 37.9M'
  });
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchEnrollment, setSearchEnrollment] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'pending' | 'approved' | 'rejected'>('ALL');
  const [searchStudent, setSearchStudent] = useState('');
  const [loading, setLoading] = useState(true);

  // New Student Modal state
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Lahore',
    password: 'studentpass2026'
  });

  const fetchDashboardData = () => {
    setLoading(true);
    // Overview
    fetch('/api/admin/overview')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      })
      .catch(() => {});

    // Enrollments
    fetch('/api/admin/enrollments')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.enrollments) {
          setEnrollments(res.enrollments);
        }
      })
      .catch(() => {});

    // Students
    fetch('/api/admin/students')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.students) {
          setStudents(res.students);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/admin/enrollments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
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
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#111827] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00A0DF] to-[#0077aa] flex items-center justify-center font-black text-white shadow-lg shadow-[#00A0DF]/30">
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

          <nav className="space-y-1.5 text-xs font-bold text-slate-400">
            <button
              onClick={() => setActiveTab('overview')}
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
                <span>Website CMS Editor</span>
              </div>
              <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setActiveTab('enrollments')}
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
              onClick={() => setActiveTab('students')}
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
            href="/admin/login"
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out Admin</span>
          </Link>
        </div>
      </aside>

      {/* Main Stage */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Control Panel</h1>
              <p className="text-xs text-slate-400 mt-1">Ecom With Sami Mentorship &bull; Real-time Operations</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchDashboardData}
                className="p-2.5 rounded-xl bg-[#111827] border border-white/10 hover:bg-slate-800 text-slate-300 transition-colors"
                title="Refresh Live Data"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setShowAddStudent(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-black text-white shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Plus size={15} />
                <span>Add Student Manually</span>
              </button>
              <Link
                href="/admin/cms"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-xs font-black text-white shadow-lg shadow-[#00A0DF]/30 transition-all"
              >
                <Sparkles size={15} />
                <span>Open Website CMS</span>
              </Link>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Total Students</span>
                <Users size={16} className="text-[#00A0DF]" />
              </div>
              <div className="text-2xl font-black text-white">{stats.totalStudents}</div>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Trained &amp; Active</span>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Pending Approvals</span>
                <Clock size={16} className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{stats.pendingApprovals}</div>
              <span className="text-[10px] text-slate-400 font-bold mt-1 block">1-click LMS activation</span>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Active LMS Users</span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">{stats.approvedEnrollments}</div>
              <span className="text-[10px] text-slate-400 font-bold mt-1 block">Classroom Access Enabled</span>
            </div>

            <div className="bg-[#111827] border border-white/10 rounded-2xl p-5 shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Total Revenue</span>
                <TrendingUp size={16} className="text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{stats.totalRevenueFormatted}</div>
              <span className="text-[10px] text-indigo-400 font-bold mt-1 block">Fee: PKR 3,900</span>
            </div>
          </div>

          {/* TAB 1: OVERVIEW QUEUE */}
          {activeTab === 'overview' && (
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Live Student Enrollment Requests</h3>
                <button
                  onClick={() => setActiveTab('enrollments')}
                  className="text-xs text-[#00A0DF] font-bold hover:underline"
                >
                  View All ({enrollments.length}) &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-3">Tracking Code</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">WhatsApp</th>
                      <th className="pb-3">Payment Method</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {enrollments.slice(0, 6).map((r) => (
                      <tr key={r.id}>
                        <td className="py-3.5 font-mono text-[11px] text-[#00A0DF] font-bold">{r.trackingCode}</td>
                        <td className="py-3.5 font-bold text-white">{r.name}</td>
                        <td className="py-3.5 text-slate-400">{r.phone}</td>
                        <td className="py-3.5">{r.paymentMethod}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
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
                        <td className="py-3.5 text-right">
                          {r.status === 'pending' ? (
                            <div className="inline-flex gap-1.5">
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'approved')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm"
                              >
                                <Check size={12} /> Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'rejected')}
                                className="px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg font-bold text-[11px]"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500">Processed</span>
                          )}
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
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white">Enrollments &amp; Receipt Records</h3>
                
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
                    className="px-3 py-1.5 rounded-xl bg-[#0B0F19] border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-3">Tracking Code</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Method &amp; TID</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {filteredEnrollments.map((r) => (
                      <tr key={r.id}>
                        <td className="py-3.5 font-mono text-[11px] text-[#00A0DF] font-bold">{r.trackingCode}</td>
                        <td className="py-3.5 font-bold text-white">{r.name}</td>
                        <td className="py-3.5 text-slate-400">{r.email}</td>
                        <td className="py-3.5">{r.phone}</td>
                        <td className="py-3.5">
                          <div>{r.paymentMethod}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{r.transactionId}</div>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
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
                        <td className="py-3.5 text-right">
                          <div className="inline-flex gap-1.5">
                            {r.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'approved')}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                              >
                                Activate
                              </button>
                            )}
                            {r.status !== 'rejected' && (
                              <button
                                onClick={() => handleUpdateStatus(r.id, 'rejected')}
                                className="px-2 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg font-bold text-[11px]"
                              >
                                Revoke
                              </button>
                            )}
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
            <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <h3 className="text-base font-bold text-white">Registered Students ({students.length})</h3>
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

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Login Email</th>
                      <th className="pb-3">WhatsApp</th>
                      <th className="pb-3">City</th>
                      <th className="pb-3">LMS Access</th>
                      <th className="pb-3">Lectures Completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    {filteredStudents.map((s) => (
                      <tr key={s.id}>
                        <td className="py-3.5 font-bold text-white">{s.name}</td>
                        <td className="py-3.5 text-[#00A0DF] font-mono">{s.email}</td>
                        <td className="py-3.5">{s.phone}</td>
                        <td className="py-3.5">{s.city}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              s.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {s.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="py-3.5 text-slate-400">
                          {s.completedLessons?.length || 0} / 36 Lectures
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

      {/* Manual Student Add Modal */}
      {showAddStudent && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111827] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-lg font-bold text-white">Add Student Manually</h3>
              <button onClick={() => setShowAddStudent(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
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
                className="w-full py-3 px-4 rounded-xl text-xs font-black text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 mt-4"
              >
                Grant Instant LMS Access
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
