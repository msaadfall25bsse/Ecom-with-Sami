'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  CreditCard, 
  BookOpen, 
  Settings, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Search,
  ShieldCheck,
  Eye
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const recentEnrollments = [
    { id: 101, name: 'Muhammad Ali', phone: '03001234567', method: 'Easypaisa', amount: 'PKR 3,900', status: 'Pending Approval', date: 'Just now' },
    { id: 102, name: 'Usman Ghani', phone: '03129876543', method: 'JazzCash', amount: 'PKR 3,900', status: 'Approved', date: '10 mins ago' },
    { id: 103, name: 'Hamza Tariq', phone: '03451122334', method: 'Meezan Bank', amount: 'PKR 3,900', status: 'Approved', date: '1 hour ago' },
    { id: 104, name: 'Zainab Bibi', phone: '03335566778', method: 'SadaPay', amount: 'PKR 3,900', status: 'Approved', date: '3 hours ago' }
  ];

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
            <button
              onClick={() => setActiveTab('enrollments')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'enrollments' ? 'bg-[#00A0DF] text-white' : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <CreditCard size={16} />
              <span>Enrollment Queue</span>
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

        <div className="pt-6 border-t border-slate-800 mt-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <LogOut size={14} />
            <span>Exit to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Dashboard</h1>
              <p className="text-xs text-slate-400 mt-1">Real-time statistics &bull; Ecom With Sami Mentorship</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-slate-300">
              Admin: <span className="text-[#00A0DF]">Muhammad Sami</span>
            </div>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Total Students</span>
                <Users size={16} className="text-[#00A0DF]" />
              </div>
              <div className="text-2xl font-black text-white">9,742</div>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block">+12 enrolled today</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Pending Approvals</span>
                <Clock size={16} className="text-amber-400" />
              </div>
              <div className="text-2xl font-black text-amber-400">1</div>
              <span className="text-[10px] text-slate-400 font-bold mt-1 block">Requires 1-click verification</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Active LMS Users</span>
                <CheckCircle2 size={16} className="text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-emerald-400">9,741</div>
              <span className="text-[10px] text-slate-400 font-bold mt-1 block">Full Classroom Access</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Total Revenue</span>
                <TrendingUp size={16} className="text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">PKR 37.9M</div>
              <span className="text-[10px] text-indigo-400 font-bold mt-1 block">Course Fee: PKR 3,900</span>
            </div>
          </div>

          {/* Recent Applications Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Recent Student Enrollment Requests</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">WhatsApp / Phone</th>
                    <th className="pb-3">Payment Method</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {recentEnrollments.map((r) => (
                    <tr key={r.id}>
                      <td className="py-3.5 font-bold text-white">{r.name}</td>
                      <td className="py-3.5 text-slate-400">{r.phone}</td>
                      <td className="py-3.5">{r.method}</td>
                      <td className="py-3.5 font-bold text-[#00A0DF]">{r.amount}</td>
                      <td className="py-3.5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            r.status === 'Approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button className="px-3 py-1 bg-[#00A0DF] hover:bg-[#008ec7] text-white rounded-lg font-bold text-[11px] transition-colors">
                          Verify
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
