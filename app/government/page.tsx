"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/auth";
import GovernmentLayout from "@/components/GovernmentLayout";

const examTypes = [
  { id: 'tnpsc', name: 'TNPSC', icon: 'account_balance', color: 'from-blue-500 to-cyan-500', count: 45 },
  { id: 'ssc', name: 'SSC', icon: 'work', color: 'from-purple-500 to-pink-500', count: 38 },
  { id: 'rrb', name: 'RRB', icon: 'train', color: 'from-green-500 to-emerald-500', count: 32 },
  { id: 'tnusrb', name: 'TNUSRB', icon: 'security', color: 'from-orange-500 to-red-500', count: 28 },
  { id: 'banking', name: 'Banking', icon: 'account_balance_wallet', color: 'from-indigo-500 to-purple-500', count: 52 },
  { id: 'upsc', name: 'UPSC', icon: 'school', color: 'from-amber-500 to-yellow-500', count: 67 },
];

export default function GovernmentDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [plan, setPlan] = useState('free');

  useEffect(() => {
    getUser()
      .then((userData) => {
        setUser(userData);
        setPlan(userData.subscription_plan || 'free');
      })
      .catch(() => setPlan('free'));
  }, []);

  const isPro = plan?.toLowerCase() === 'pro';

  return (
    <GovernmentLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Hero Section */}
        <section className="rounded-3xl border border-blue-200/50 bg-gradient-to-br from-white to-blue-50/50 p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-600/70 font-semibold">Government Exam Preparation</p>
              <h1 className="mt-3 text-4xl font-black text-slate-800">
                Ace Your Competitive Exams
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600">
                Practice with previous year papers, model tests, and current affairs quizzes for TNPSC, SSC, RRB, Banking, and more.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-3xl border border-blue-200/50 bg-white/80 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Active Plan</p>
                <p className="text-xl font-bold text-slate-800">{plan === 'pro' ? 'Pro' : 'Free'}</p>
              </div>
              <div className="h-12 w-px bg-blue-200/50" />
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Papers Attempted</p>
                <p className="text-xl font-bold text-slate-800">0</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid gap-6 lg:grid-cols-4">
          {[
            { label: "Available Exams", value: "6", delta: "TNPSC, SSC, RRB, etc.", icon: "school" },
            { label: "Previous Papers", value: isPro ? "Unlimited" : "10", delta: isPro ? "Full access" : "Limited", icon: "description" },
            { label: "Model Tests", value: isPro ? "50+" : "5", delta: isPro ? "All available" : "Limited", icon: "quiz" },
            { label: "My Rank", value: "—", delta: "Complete a test", icon: "leaderboard" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <span className="material-symbols-outlined text-slate-400">{stat.icon}</span>
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-800">{stat.value}</p>
              <p className="text-xs font-medium text-blue-600">{stat.delta}</p>
            </div>
          ))}
        </section>

        {/* Exam Types Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Select Your Exam</h2>
              <p className="text-sm text-slate-600 mt-1">Choose from various government exams</p>
            </div>
            <Link
              href="/government/exams"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examTypes.map((exam) => (
              <Link
                key={exam.id}
                href={`/government/exams/${exam.id}`}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${exam.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="material-symbols-outlined text-white text-2xl">{exam.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {exam.name}
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {exam.count} previous year papers available
                  </p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                    <span>Start Practice</span>
                    <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Pro Plan Upgrade Banner */}
        {!isPro && (
          <section className="rounded-3xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-2xl">workspace_premium</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">Upgrade to Pro for Unlimited Access</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Get unlimited previous papers, AI explanations, detailed analytics, and more.
                </p>
              </div>
              <Link
                href="/government/subscription"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Upgrade Now
              </Link>
            </div>
          </section>
        )}

        {/* Recent Activity */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h3>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-slate-400">inbox</span>
            </div>
            <p className="text-slate-600 font-medium mb-1">No recent activity</p>
            <p className="text-sm text-slate-500">Start practicing to see your activity here!</p>
          </div>
        </section>
      </div>
    </GovernmentLayout>
  );
}

