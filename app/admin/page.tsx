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
  RotateCcw
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
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-[#00A0DF] flex items-center justify-center font-black text-white">
              S
            </div>
            <div>
              <span className="font-bold text-sm block">Admin Portal</span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Online &bull; Live</span>
            </div>
          </div>

          <nav className="space-y-1.5 text-xs font-bold text-slate-400">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'overview' ? 'bg-[#00A0DF] text-white' : 'hover:bg-slate-800 hover:text-white'
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
                activeTab === 'enrollments' ? 'bg-[#00A0DF] text-white' : 'hover:bg-slate-800 hover:text-white'
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
                activeTab === 'students' ? 'bg-[#00A0DF] text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users size={16} />
              <span>Students Directory</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6 flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <Eye size={14} />
            <span>View Public Store</span>
          </Link>
          <Link
            href="/admin/login"
            className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Control Panel</h1>
              <p className="text-xs text-slate-400 mt-1">Real-time statistics &bull; Ecom With Sami Mentorship</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchDashboardData}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
                title="Refresh Live Data"
              >
                <RotateCcw size={15} />
              </button>
              <Link
                href="/admin/cms"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A0DF] hover:bg-[#008ec7] text-xs font-black text-white shadow-lg shadow-[#00A0DF]/30 transition-all"
              >
                <Sparkles size={15} />
                <span>Open Website CMS Manager</span>
              </Link>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Total Students</span>
                <Users size={16} className="text-[#00A0DF]" />
              </div>
              <div className="text-2xl font-black text-white">{stats.totalStudents}</div>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Active Learners</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Pending Approvals</span>
                <Clock size={16} className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">{stats.pendingApprovals}</div>
              <span className="text-[10px] text-slate-400 font-bold mt-1 block">Requires 1-click verification</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Active LMS Users</span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">{stats.approvedEnrollments}</div>
              <span className="text-[10px] text-slate-400 font-bold mt-1 block">Full Classroom Access</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Total Revenue</span>
                <TrendingUp size={16} className="text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{stats.totalRevenueFormatted}</div>
              <span className="text-[10px] text-indigo-400 font-bold mt-1 block">Course Fee: PKR 3,900</span>
            </div>
          </div>

          {/* TAB 1: OVERVIEW & RECENT ENROLLMENTS */}
          {activeTab === 'overview' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Live Student Enrollment Queue</h3>
                <button
                  onClick={() => setActiveTab('enrollments')}
                  className="text-xs text-[#00A0DF] font-bold hover:underline"
                >
                  View All Enrollments &rarr;
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">Tracking Code</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">WhatsApp / Phone</th>
                      <th className="pb-3">Payment Method</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {enrollments.map((r) => (
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
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1"
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

          {/* TAB 2: FULL ENROLLMENTS */}
          {activeTab === 'enrollments' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-base font-bold text-white mb-4">All Applications &amp; Payment Receipts</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">Tracking Code</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Method &amp; TID</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {enrollments.map((r) => (
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="text-base font-bold text-white mb-4">Registered Students Directory</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Email (Login ID)</th>
                      <th className="pb-3">WhatsApp</th>
                      <th className="pb-3">City</th>
                      <th className="pb-3">LMS Access</th>
                      <th className="pb-3">Lectures Completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {students.map((s) => (
                      <tr key={s.id}>
                        <td className="py-3.5 font-bold text-white">{s.name}</td>
                        <td className="py-3.5 text-[#00A0DF]">{s.email}</td>
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

    </div>
  );
}
