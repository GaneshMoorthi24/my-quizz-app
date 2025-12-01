"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { examsApi, importsApi } from "@/lib/admin";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalExams: 0,
    totalPapers: 0,
    totalQuestions: 0,
    recentImports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentImports, setRecentImports] = useState<any[]>([]);

  useEffect(() => {
    // ✅ Step 1: Check if user is admin (check both storages)
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    // Check for admin status - handle both is_admin (1, true, '1') and role === 'admin'
    const isAdmin = user?.is_admin === 1 || 
                   user?.is_admin === true || 
                   user?.is_admin === '1' ||
                   user?.role === 'admin';
    
    if (!isAdmin) {
      router.push("/dashboard"); // redirect students
      return;
    }

    // ✅ Step 2: Fetch admin dashboard stats
    async function fetchStats() {
      try {
        const [exams, imports] = await Promise.all([
          examsApi.getAll().catch(() => []),
          importsApi.getAll().catch(() => []),
        ]);

        const totalPapers = exams.reduce(
          (sum: number, exam: any) => sum + (exam.papers_count || 0),
          0
        );

        const totalQuestions = exams.reduce(
          (sum: number, exam: any) =>
            sum +
              (exam.papers?.reduce(
                (pSum: number, paper: any) =>
                  pSum + (paper.questions_count || 0),
                0
              ) || 0),
          0
        );

        setStats({
          totalExams: exams.length,
          totalPapers,
          totalQuestions,
          recentImports: imports.length,
        });

        setRecentImports(imports.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [router]);

  const quickActions = [
    {
      title: "Create New Exam",
      description: "Add a new exam (LDC, UDC, etc.)",
      icon: "add_circle",
      href: "/admin/exams?action=create",
      color: "primary",
    },
    {
      title: "View All Exams",
      description: "Manage existing exams",
      icon: "school",
      href: "/admin/exams",
      color: "secondary",
    },
    {
      title: "Import History",
      description: "View PDF import logs",
      icon: "history",
      href: "/admin/imports",
      color: "review",
    },
  ];


  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-base text-slate-600">
                Manage exams, question papers, and imports with ease
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Exams Card */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="material-symbols-outlined text-white text-2xl">school</span>
                </div>
                <div className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Active
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Exams</p>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.totalExams}</p>
                <p className="text-xs text-slate-400">Exams created</p>
              </div>
            </div>
          </div>

          {/* Question Papers Card */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <span className="material-symbols-outlined text-white text-2xl">description</span>
                </div>
                <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Papers
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Question Papers</p>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.totalPapers}</p>
                <p className="text-xs text-slate-400">Available papers</p>
              </div>
            </div>
          </div>

          {/* Total Questions Card */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <span className="material-symbols-outlined text-white text-2xl">quiz</span>
                </div>
                <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  Questions
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.totalQuestions}</p>
                <p className="text-xs text-slate-400">In database</p>
              </div>
            </div>
          </div>

          {/* Recent Imports Card */}
          <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <span className="material-symbols-outlined text-white text-2xl">upload_file</span>
                </div>
                <div className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  Imports
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Recent Imports</p>
                <p className="text-3xl font-bold text-slate-800 mb-1">{stats.recentImports}</p>
                <p className="text-xs text-slate-400">PDF uploads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${
                      action.color === 'primary' ? 'from-blue-500 to-indigo-600' :
                      action.color === 'secondary' ? 'from-purple-500 to-pink-600' :
                      'from-emerald-500 to-teal-600'
                    } flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <span className="material-symbols-outlined text-white text-2xl">{action.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{action.description}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Imports Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">Recent Imports</h2>
                <p className="text-sm text-slate-500">Latest PDF upload and parsing activities</p>
              </div>
              <Link
                href="/admin/imports"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                View All
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-500">Loading imports...</p>
                </div>
              </div>
            ) : recentImports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-3xl text-slate-400">history</span>
                </div>
                <p className="text-slate-500 font-medium mb-1">No imports yet</p>
                <p className="text-sm text-slate-400">Start by uploading your first PDF</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">File Name</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Paper</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentImports.map((importItem: any) => (
                      <tr key={importItem.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <span className="material-symbols-outlined text-blue-600 text-sm">description</span>
                            </div>
                            <span className="text-sm font-medium text-slate-800">{importItem.file_name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-700">{importItem.paper?.title || 'N/A'}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            importItem.status === 'completed' ? 'bg-green-100 text-green-700' :
                            importItem.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {importItem.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-600">
                            {new Date(importItem.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

