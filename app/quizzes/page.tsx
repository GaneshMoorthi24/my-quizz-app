"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getAllPapers } from '@/lib/api';
import { getUser } from '@/lib/auth';
import "../dashboard/style.css";

type Paper = {
  id: number;
  title: string;
  year: string | null;
  exam_name: string | null;
  exam_access_type?: string;
  questions_count: number;
  created_at: string;
};

export default function AllQuizzesPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [allPapers, setAllPapers] = useState<Paper[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterExam, setFilterExam] = useState<string>("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  useEffect(() => {
    fetchUser();
    fetchPapers();
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

  // Get unique exams and years for filters (include both free and paid papers)
  const allPapersForFilters = [...papers, ...paidPapers];
  const uniqueExams = Array.from(new Set(allPapersForFilters.map(p => p.exam_name).filter(Boolean)));
  const uniqueYears = Array.from(new Set(allPapersForFilters.map(p => p.year).filter(Boolean))).sort((a, b) => {
    const yearA = parseInt(a || '0');
    const yearB = parseInt(b || '0');
    return yearB - yearA;
  });

  // Filter function for papers
  const filterPaper = (paper: Paper) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        paper.title.toLowerCase().includes(query) ||
        (paper.exam_name && paper.exam_name.toLowerCase().includes(query)) ||
        (paper.year && paper.year.toString().includes(query));
      if (!matchesSearch) return false;
    }

    // Exam filter
    if (filterExam !== "all" && paper.exam_name !== filterExam) {
      return false;
    }

    // Year filter
    if (filterYear !== "all" && paper.year !== filterYear) {
      return false;
    }

    return true;
  };

  // Filter and sort free papers
  const filteredPapers = papers
    .filter(filterPaper)
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === "questions") {
        return b.questions_count - a.questions_count;
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // Filter paid papers (same filters as free papers)
  const filteredPaidPapers = paidPapers.filter(filterPaper);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1600px] w-full px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-10 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-200 mb-2">
                All Quizzes
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Browse and attempt all available question papers
              </p>
            </div>
            {(filteredPapers.length > 0 || filteredPaidPapers.length > 0) && (
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
                {filteredPapers.length + filteredPaidPapers.length} {(filteredPapers.length + filteredPaidPapers.length) === 1 ? 'quiz' : 'quizzes'}
              </div>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 dark:text-slate-500">search</span>
            </div>
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="Search quizzes by name, exam, or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-3">
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="flex h-11 items-center justify-center gap-x-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 text-slate-700 dark:text-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow transition-all"
            >
              <option value="all">All Exams</option>
              {uniqueExams.map((exam) => (
                <option key={exam} value={exam || ''}>
                  {exam}
                </option>
              ))}
            </select>

            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="flex h-11 items-center justify-center gap-x-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 text-slate-700 dark:text-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow transition-all"
            >
              <option value="all">All Years</option>
              {uniqueYears.map((year) => (
                <option key={year} value={year || ''}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex h-11 items-center justify-center gap-x-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 text-slate-700 dark:text-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm hover:shadow transition-all"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="questions">Most Questions</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Quiz Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 dark:text-slate-400">Loading quizzes...</p>
            </div>
          </div>
        ) : filteredPapers.length === 0 && filteredPaidPapers.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl text-slate-400 dark:text-slate-500">quiz</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">
              {searchQuery || filterExam !== "all" || filterYear !== "all"
                ? "No quizzes found matching your filters."
                : "No question papers available yet."}
            </p>
            {(searchQuery || filterExam !== "all" || filterYear !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterExam("all");
                  setFilterYear("all");
                }}
                className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-2"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Free/Available Papers */}
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    {paper.exam_name && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
                        {paper.exam_name}
                      </span>
                    )}
                    {paper.year && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {paper.year}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {paper.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm">list_alt</span>
                      </div>
                      <span className="font-medium">{paper.questions_count} Questions</span>
                    </div>
                    {paper.questions_count > 0 && (
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-sm">timer</span>
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
                        : "bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
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
            {filteredPaidPapers.length > 0 && (!user || user.subscription_plan !== 'pro') && (
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
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            {paper.exam_name}
                          </span>
                        )}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-600 dark:bg-slate-700 text-white shadow-lg">
                          Premium
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {paper.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-sm">lock</span>
                          </div>
                          <span className="font-medium">{paper.questions_count} Questions</span>
                        </div>
                        {paper.questions_count > 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                              <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-sm">timer</span>
                            </div>
                            <span className="font-medium">~{Math.ceil(paper.questions_count * 1.5)} mins</span>
                          </div>
                        )}
                      </div>
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl h-11 px-4 text-sm font-bold bg-slate-600 dark:bg-slate-700 text-white hover:bg-slate-700 dark:hover:bg-slate-600 shadow-lg transition-all">
                        <span>Upgrade to Pro</span>
                        <span className="material-symbols-outlined text-lg">arrow_forward</span>
                      </div>
                      <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-3">
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
    </DashboardLayout>
  );
}

