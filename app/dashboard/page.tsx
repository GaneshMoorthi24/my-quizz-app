"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import "./style.css";
import { getAllPapers, getPerformanceSummary, getRecentActivity } from '@/lib/api';
import { getUser } from '@/lib/auth';

type Paper = {
  id: number;
  title: string;
  year: string | null;
  exam_name: string | null;
  exam_access_type?: string;
  questions_count: number;
  created_at: string;
};

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [allPapers, setAllPapers] = useState<Paper[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [performanceSummary, setPerformanceSummary] = useState({
    overall_accuracy: 0,
    quizzes_completed: 0,
    strongest_subject: null,
  });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [loadingPerformance, setLoadingPerformance] = useState(true);

  useEffect(() => {
    fetchUser();
    fetchPapers();
    fetchPerformanceData();
  }, []);

  const [paidPapers, setPaidPapers] = useState<Paper[]>([]);

  useEffect(() => {
    // Filter papers based on user's subscription plan
    if (user && allPapers.length > 0) {
      const userPlan = user.subscription_plan || 'free';
      const isPro = userPlan === 'pro' || userPlan === 'Pro';
      
      if (!isPro) {
        // Free user: separate free and paid papers
        const freePapers = allPapers.filter((paper) => {
          return paper.exam_access_type === 'free' || !paper.exam_access_type;
        });
        const paidPapersList = allPapers.filter((paper) => {
          return paper.exam_access_type === 'paid';
        });
        setPapers(freePapers);
        setPaidPapers(paidPapersList);
      } else {
        // Pro user: show all exams
        setPapers(allPapers);
        setPaidPapers([]);
      }
    } else if (allPapers.length > 0) {
      // If no user, show only free exams and paid as subscription cards
      const freePapers = allPapers.filter((paper) => {
        return paper.exam_access_type === 'free' || !paper.exam_access_type;
      });
      const paidPapersList = allPapers.filter((paper) => {
        return paper.exam_access_type === 'paid';
      });
      setPapers(freePapers);
      setPaidPapers(paidPapersList);
    }
  }, [user, allPapers]);

  async function fetchUser() {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      // Continue without user - will show only free exams
    }
  }

  async function fetchPerformanceData() {
    try {
      setLoadingPerformance(true);
      const [summary, activity] = await Promise.all([
        getPerformanceSummary(),
        getRecentActivity(),
      ]);
      setPerformanceSummary(summary);
      setRecentActivities(activity.activities || []);
    } catch (error: any) {
      console.error("Failed to fetch performance data:", error);
      // Set defaults on error
      setPerformanceSummary({
        overall_accuracy: 0,
        quizzes_completed: 0,
        strongest_subject: null,
      });
      setRecentActivities([]);
    } finally {
      setLoadingPerformance(false);
    }
  }

  async function fetchPapers() {
    try {
      setLoading(true);
      const data = await getAllPapers();
      setAllPapers(data.papers || []);
      // Filtering will happen in useEffect when user is loaded
    } catch (error: any) {
      console.error("Failed to fetch papers:", error);
      setAllPapers([]);
      setPapers([]);
    } finally {
      setLoading(false);
    }
  }

  // Filter papers based on search query
  const filteredPapers = papers.filter((paper) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      paper.title.toLowerCase().includes(query) ||
      (paper.exam_name && paper.exam_name.toLowerCase().includes(query)) ||
      (paper.year && paper.year.toString().includes(query))
    );
  });

  // Filter paid papers based on search query
  const filteredPaidPapers = paidPapers.filter((paper) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      paper.title.toLowerCase().includes(query) ||
      (paper.exam_name && paper.exam_name.toLowerCase().includes(query)) ||
      (paper.year && paper.year.toString().includes(query))
    );
  });

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] w-full px-4">
        {/* Page Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-10 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <div>
               <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-200 mb-2">
                 Welcome back!
               </h1>
               <p className="text-base text-slate-600 dark:text-slate-400">
                 Ready to ace your next exam? Let&apos;s get started.
               </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Quizzes */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">search</span>
              </div>
              <input
                type="text"
                 className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                placeholder="Search quizzes by name, exam, or year..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quiz Grid Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                   Available Quizzes
                 </h2>
                 {(papers.length > 0 || paidPapers.length > 0) && (
                   <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                    {papers.length + paidPapers.length} {(papers.length + paidPapers.length) === 1 ? 'quiz' : 'quizzes'}
                  </span>
                )}
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500">Loading quizzes...</p>
                  </div>
                </div>
              ) : filteredPapers.length === 0 && filteredPaidPapers.length === 0 ? (
                 <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                   <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                     <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-500">quiz</span>
                   </div>
                   <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">
                    {searchQuery ? "No quizzes found matching your search." : "No quizzes available yet."}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Free/Available Papers */}
                  {filteredPapers.map((paper) => (
                    <div
                      key={paper.id}
                       className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                          {paper.exam_name && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                              {paper.exam_name}
                            </span>
                          )}
                          {paper.year && (
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                              {paper.year}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                          {paper.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                              <span className="material-symbols-outlined text-purple-600 text-sm">list_alt</span>
                            </div>
                            <span className="font-medium">{paper.questions_count} Questions</span>
                          </div>
                          {paper.questions_count > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-amber-600 text-sm">timer</span>
                              </div>
                              <span className="font-medium">~{Math.ceil(paper.questions_count * 1.5)} mins</span>
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/attempt_questions?paperId=${paper.id}`}
                          className={`flex w-full items-center justify-center gap-2 rounded-xl h-11 px-4 text-sm font-bold transition-all ${
                            paper.questions_count > 0
                              ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
                              : "bg-slate-200 text-slate-500 cursor-not-allowed"
                          }`}
                        >
                          {paper.questions_count > 0 ? (
                            <>
                              <span>Start Quiz</span>
                              <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </>
                          ) : (
                            "No Questions"
                          )}
                        </Link>
                      </div>
                    </div>
                  ))}
                  
                  {/* Paid/Subscription Cards for Free Users */}
                  {filteredPaidPapers.length > 0 && (!user || user?.subscription_plan !== 'pro') && (
                    <>
                      {filteredPaidPapers.map((paper) => (
                        <Link
                          key={`paid-${paper.id}`}
                          href="/pricing"
                           className="group relative bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-300 dark:border-slate-600 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        >
                          <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                              {paper.exam_name && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                                  {paper.exam_name}
                                </span>
                              )}
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-600 text-white shadow-lg">
                                Premium
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                              {paper.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                                  <span className="material-symbols-outlined text-slate-500 text-sm">lock</span>
                                </div>
                                <span className="font-medium">{paper.questions_count} Questions</span>
                              </div>
                            </div>
                            <div className="flex w-full items-center justify-center gap-2 rounded-xl h-11 px-4 text-sm font-bold bg-slate-600 text-white hover:bg-slate-700 shadow-lg transition-all">
                              <span>Upgrade to Pro</span>
                              <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </div>
                            <p className="text-xs text-center text-slate-500 mt-3">
                              Unlock with Pro subscription
                            </p>
                          </div>
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column: Widgets */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Performance Summary Widget */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-slate-700/50">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">trending_up</span>
                  Performance Summary
                </h3>
              </div>
              <div className="p-6">
                {loadingPerformance ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                     <div className="group relative p-4 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-md transition-shadow">
                       <div className="flex items-center justify-between">
                         <div>
                           <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Overall Accuracy</p>
                          <p className="text-3xl font-bold text-emerald-600">{performanceSummary.overall_accuracy}%</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined text-white text-2xl">verified</span>
                        </div>
                      </div>
                    </div>
                    <div className="group relative p-4 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                           <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Quizzes Completed</p>
                          <p className="text-3xl font-bold text-blue-600">{performanceSummary.quizzes_completed}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined text-white text-2xl">fact_check</span>
                        </div>
                      </div>
                    </div>
                    <div className="group relative p-4 rounded-xl bg-white border border-slate-200 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div>
                           <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Strongest Subject</p>
                          <p className="text-xl font-bold text-amber-700 truncate">
                            {performanceSummary.strongest_subject || 'N/A'}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
                          <span className="material-symbols-outlined text-white text-2xl">workspace_premium</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Feed */}
             <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-purple-50 dark:bg-slate-700/50">
                 <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">history</span>
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                {loadingPerformance ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : recentActivities.length === 0 ? (
                     <div className="text-center py-8">
                     <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3">
                       <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">inbox</span>
                     </div>
                     <p className="text-sm text-slate-600 dark:text-slate-300 font-medium mb-1">No recent activity</p>
                     <p className="text-xs text-slate-500 dark:text-slate-400">Complete a quiz to see your activity here!</p>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {recentActivities.map((activity, index) => (
                      <li
                        key={index}
                         className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              activity.color === "secondary"
                                ? "bg-emerald-100 text-emerald-600"
                                : activity.color === "error"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            <span className="material-symbols-outlined text-lg">{activity.icon}</span>
                          </div>
                          <div>
                             <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{activity.title}</p>
                             <p className="text-xs text-slate-500 dark:text-slate-400">{activity.date}</p>
                          </div>
                        </div>
                        <p
                          className={`font-bold text-sm ${
                            activity.color === "secondary"
                              ? "text-emerald-600"
                              : activity.color === "error"
                                ? "text-red-600"
                                : "text-blue-600"
                          }`}
                        >
                          {activity.score}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
