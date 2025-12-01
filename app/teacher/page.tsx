"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";

type UpcomingTest = {
  id: number;
  title: string;
  group: string;
  date: string;
  status: "Scheduled" | "Draft" | "Live";
  students: number;
};

type Activity = {
  id: number;
  type: "quiz_created" | "quiz_assigned" | "result_published" | "student_joined" | "group_created";
  title: string;
  description: string;
  time: string;
  icon: string;
};

type StudentPerformance = {
  group: string;
  totalStudents: number;
  avgScore: number;
  completed: number;
  pending: number;
  trend: "up" | "down" | "stable";
  trendValue: string;
};

export default function TeacherOverviewPage() {
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState("Standard");
  const [upcomingTests] = useState<UpcomingTest[]>([
    { id: 1, title: "Physics Chapter 5 Quiz", group: "XI - Elite Batch", date: "Thu, 28 Nov • 09:00 AM", status: "Scheduled", students: 45 },
    { id: 2, title: "Maths Weekly Challenge", group: "X - Section A", date: "Fri, 29 Nov • 08:00 AM", status: "Live", students: 32 },
    { id: 3, title: "Mock Test - SSC CGL", group: "Aspirants Club", date: "Sun, 1 Dec • 10:00 AM", status: "Draft", students: 28 },
    { id: 4, title: "Chemistry Periodic Table", group: "XII Science", date: "Mon, 2 Dec • 11:00 AM", status: "Scheduled", students: 38 },
  ]);

  const [recentActivity] = useState<Activity[]>([
    { id: 1, type: "quiz_created", title: "Created new quiz", description: "Physics Chapter 5 Quiz", time: "2 hours ago", icon: "edit_square" },
    { id: 2, type: "quiz_assigned", title: "Assigned quiz to group", description: "Maths Weekly Challenge → X - Section A", time: "5 hours ago", icon: "send" },
    { id: 3, type: "result_published", title: "Published results", description: "Chemistry Periodic Table - 38 students completed", time: "1 day ago", icon: "insights" },
    { id: 4, type: "student_joined", title: "New students joined", description: "12 students added to XI - Elite Batch", time: "2 days ago", icon: "group_add" },
    { id: 5, type: "group_created", title: "Created student group", description: "Aspirants Club - 28 students", time: "3 days ago", icon: "diversity_3" },
  ]);

  const [studentPerformance] = useState<StudentPerformance[]>([
    { group: "XI - Elite Batch", totalStudents: 45, avgScore: 87, completed: 42, pending: 3, trend: "up", trendValue: "+5%" },
    { group: "X - Section A", totalStudents: 32, avgScore: 82, completed: 30, pending: 2, trend: "up", trendValue: "+3%" },
    { group: "XII Science", totalStudents: 38, avgScore: 79, completed: 35, pending: 3, trend: "down", trendValue: "-2%" },
    { group: "Aspirants Club", totalStudents: 28, avgScore: 91, completed: 25, pending: 3, trend: "up", trendValue: "+7%" },
  ]);

  useEffect(() => {
    getUser()
      .then((data) => {
        setUser(data);
        setPlan(data.subscription_plan || "Standard");
      })
      .catch(() => setPlan("Standard"));
  }, []);

  const isStandard = plan?.toLowerCase() === "standard";

  const stats = [
    { label: "Total Quizzes", value: "42", delta: "+3 this week", icon: "quiz", color: "text-blue-400" },
    { label: "Total Students", value: "356", delta: "+24 this month", icon: "group", color: "text-emerald-400" },
    { label: "Active Tests", value: "8", delta: "3 live now", icon: "monitoring", color: "text-amber-400" },
    { label: "Avg Performance", value: "82%", delta: "↑ 4% vs last week", icon: "trending_up", color: "text-purple-400" },
  ];

  const quickActions = [
    { href: "/teacher/quizzes", title: "Create Quiz", description: "Manual builder with AI co-pilot", icon: "add_circle", gradient: "from-blue-500 to-indigo-500" },
    { href: "/teacher/pdf-upload", title: "Upload PDF", description: "Auto convert papers to quizzes", icon: "picture_as_pdf", gradient: "from-rose-500 to-orange-500" },
    { href: "/teacher/groups", title: "Student Group", description: "Organize batches & cohorts", icon: "diversity_3", gradient: "from-emerald-500 to-teal-500" },
    { href: "/teacher/assignments", title: "Assign Quiz", description: "Send to students or groups", icon: "send", gradient: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header with Stats */}
      <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-indigo-900/60 p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">Welcome Back, {user?.name || "Teacher"}</p>
            <h1 className="mt-3 text-4xl font-black text-white">Teacher Overview Dashboard</h1>
            <p className="mt-3 max-w-2xl text-lg text-white/60">
              Complete summary of your activity, upcoming tests, student performance, and subscription details.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">Active Plan</p>
              <p className="text-xl font-bold text-white">{plan}</p>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">Students</p>
              <p className="text-xl font-bold text-white">356</p>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60">Quizzes</p>
              <p className="text-xl font-bold text-white">42</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="grid gap-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-3xl border border-white/5 bg-white/5 p-6 shadow-lg shadow-black/20 backdrop-blur transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-wide text-white/50">{stat.label}</p>
              <span className={`material-symbols-outlined ${stat.color} transition-transform group-hover:scale-110`}>
                {stat.icon}
              </span>
            </div>
            <p className="mt-4 text-3xl font-black text-white">{stat.value}</p>
            <p className="mt-1 text-xs font-semibold text-emerald-300/80">{stat.delta}</p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Quick Actions</h2>
          <Link href="/teacher/quizzes" className="text-sm font-semibold text-white/60 hover:text-white">
            View all →
          </Link>
        </div>
        <div className="grid gap-6 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br ${action.gradient} p-6 shadow-xl shadow-black/30 transition hover:-translate-y-1 hover:shadow-2xl`}
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 transition group-hover:opacity-100" />
              <div className="relative">
                <div className="mb-4 rounded-2xl bg-white/20 p-3 backdrop-blur w-fit">
                  <span className="material-symbols-outlined text-2xl text-white">{action.icon}</span>
                </div>
                <p className="text-sm uppercase tracking-wide text-white/70">{action.description}</p>
                <h3 className="mt-1 text-xl font-bold text-white">{action.title}</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90">
                  Get started
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Tests */}
        <section className="lg:col-span-2 rounded-3xl border border-white/5 bg-white/5 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Upcoming Tests</h2>
              <p className="text-sm text-white/60 mt-1">Manage your scheduled assessments</p>
            </div>
            <Link href="/teacher/assignments" className="text-sm font-semibold text-white/60 hover:text-white">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingTests.map((test) => (
              <div
                key={test.id}
                className="group flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-white/20 hover:bg-white/10"
              >
                <div className="flex-1 min-w-[200px]">
                  <p className="text-lg font-semibold text-white">{test.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-white/60">{test.group}</p>
                    <span className="text-white/40">•</span>
                    <p className="text-sm text-white/60">{test.students} students</p>
                  </div>
                </div>
                <p className="text-sm text-white/70 font-medium">{test.date}</p>
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    test.status === "Live"
                      ? "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                      : test.status === "Scheduled"
                        ? "bg-blue-400/20 text-blue-200 border border-blue-400/30"
                        : "bg-white/10 text-white/70 border border-white/20"
                  }`}
                >
                  {test.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Subscription Details */}
        <section className="rounded-3xl border border-white/5 bg-gradient-to-br from-amber-900/20 to-orange-900/20 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-amber-300">workspace_premium</span>
            <h2 className="text-xl font-bold text-white">Subscription</h2>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-black text-white mb-1">{plan}</p>
            <p className="text-sm text-white/60">Current Plan</p>
          </div>
          {isStandard ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-200/30 bg-amber-50/10 p-4">
                <p className="text-sm font-semibold text-amber-200 mb-2">Upgrade Benefits</p>
                <ul className="space-y-1.5 text-xs text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-amber-300">check_circle</span>
                    Unlimited PDF conversions
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-amber-300">check_circle</span>
                    AI question generation
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xs text-amber-300">check_circle</span>
                    Live proctoring
                  </li>
                </ul>
              </div>
              <Link
                href="/teacher/billing"
                className="block w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-amber-900/40 transition hover:shadow-xl"
              >
                Upgrade Plan
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-200/30 bg-emerald-50/10 p-4">
              <p className="text-sm font-semibold text-emerald-200 mb-2">Premium Features Active</p>
              <p className="text-xs text-white/70">You have access to all premium features</p>
            </div>
          )}
        </section>
      </div>

      {/* Student Performance & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student Performance by Group */}
        <section className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Student Performance</h2>
              <p className="text-sm text-white/60 mt-1">Average scores by group</p>
            </div>
            <Link href="/teacher/performance" className="text-sm font-semibold text-white/60 hover:text-white">
              View details →
            </Link>
          </div>
          <div className="space-y-4">
            {studentPerformance.map((perf) => (
              <div key={perf.group} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-white">{perf.group}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        perf.trend === "up" ? "text-emerald-300" : perf.trend === "down" ? "text-red-300" : "text-white/60"
                      }`}
                    >
                      {perf.trend === "up" ? "↑" : perf.trend === "down" ? "↓" : "→"} {perf.trendValue}
                    </span>
                  </div>
                </div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-white/60">Average Score</span>
                  <span className="font-bold text-white">{perf.avgScore}%</span>
                </div>
                <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${perf.avgScore}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-white/60">
                  <span>{perf.completed} completed</span>
                  <span>{perf.pending} pending</span>
                  <span>{perf.totalStudents} total</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="rounded-3xl border border-white/5 bg-white/5 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
              <p className="text-sm text-white/60 mt-1">Your latest actions and updates</p>
            </div>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <span className="material-symbols-outlined text-white">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{activity.title}</p>
                  <p className="text-sm text-white/60 mt-0.5">{activity.description}</p>
                  <p className="text-xs text-white/40 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
