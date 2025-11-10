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
    // ✅ Step 1: Check if user is admin
    const storedUser = localStorage.getItem("user");
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
    
    console.log('Admin page - User check:', user);
    console.log('Admin page - is_admin:', user?.is_admin, 'Type:', typeof user?.is_admin);
    console.log('Admin page - Is admin?', isAdmin);
    
    if (!isAdmin) {
      console.log('Admin page - User is not admin, redirecting to dashboard');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-secondary';
      case 'failed':
        return 'text-error';
      case 'parsing':
        return 'text-primary';
      default:
        return 'text-text-light/70';
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-light mb-2">
            Admin Dashboard
          </h1>
          <p className="text-base text-text-light/70">
            Manage exams, question papers, and imports
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card-light p-6 rounded-xl border border-border-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light/70 mb-1">Total Exams</p>
                <p className="text-3xl font-bold text-text-light">{stats.totalExams}</p>
              </div>
              <div className="text-primary">
                <span className="material-symbols-outlined text-4xl">school</span>
              </div>
            </div>
          </div>

          <div className="bg-card-light p-6 rounded-xl border border-border-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light/70 mb-1">Question Papers</p>
                <p className="text-3xl font-bold text-text-light">{stats.totalPapers}</p>
              </div>
              <div className="text-secondary">
                <span className="material-symbols-outlined text-4xl">description</span>
              </div>
            </div>
          </div>

          <div className="bg-card-light p-6 rounded-xl border border-border-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light/70 mb-1">Total Questions</p>
                <p className="text-3xl font-bold text-text-light">{stats.totalQuestions}</p>
              </div>
              <div className="text-review">
                <span className="material-symbols-outlined text-4xl">quiz</span>
              </div>
            </div>
          </div>

          <div className="bg-card-light p-6 rounded-xl border border-border-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-light/70 mb-1">Recent Imports</p>
                <p className="text-3xl font-bold text-text-light">{stats.recentImports}</p>
              </div>
              <div className="text-primary">
                <span className="material-symbols-outlined text-4xl">upload_file</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-text-light mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="bg-card-light p-6 rounded-xl border border-border-light hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`text-${action.color} bg-${action.color}/10 p-3 rounded-lg`}>
                    <span className="material-symbols-outlined text-3xl">{action.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-light mb-2">{action.title}</h3>
                    <p className="text-sm text-text-light/70">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Imports */}
        <div className="bg-card-light p-6 rounded-xl border border-border-light">
          <h2 className="text-xl font-bold text-text-light mb-4">Recent Imports</h2>
          {loading ? (
            <div className="text-text-light/70">Loading...</div>
          ) : recentImports.length === 0 ? (
            <div className="text-text-light/70">No imports yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-light">
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-light">File Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-light">Paper</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-light">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-text-light">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentImports.map((importItem: any) => (
                    <tr key={importItem.id} className="border-b border-border-light">
                      <td className="py-3 px-4 text-sm text-text-light">{importItem.file_name}</td>
                      <td className="py-3 px-4 text-sm text-text-light">{importItem.paper?.title || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${getStatusColor(importItem.status)}`}>
                          {importItem.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-text-light/70">
                        {new Date(importItem.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

