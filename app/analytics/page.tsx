"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getDetailedAnalytics, getAllAttempts } from '@/lib/api';
import "../dashboard/style.css";

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [analyticsData, attemptsData] = await Promise.all([
        getDetailedAnalytics(),
        getAllAttempts(),
      ]);
      // Ensure data structure is correct and normalize arrays
      setAnalytics({
        overall_stats: analyticsData?.overall_stats || {},
        subject_wise: Array.isArray(analyticsData?.subject_wise) 
          ? analyticsData.subject_wise 
          : analyticsData?.subject_wise && typeof analyticsData.subject_wise === 'object'
            ? Object.values(analyticsData.subject_wise) 
            : [],
        recent_trends: Array.isArray(analyticsData?.recent_trends) 
          ? analyticsData.recent_trends 
          : [],
      });
      setAttempts(attemptsData?.attempts || []);
    } catch (error: any) {
      console.error("Failed to fetch analytics:", error);
      // Ensure we always have valid data structure
      setAnalytics({
        overall_stats: {},
        subject_wise: [],
        recent_trends: [],
      });
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  }

  const stats = analytics?.overall_stats || {};
  // Ensure subjectWise is always an array
  const subjectWise = Array.isArray(analytics?.subject_wise) 
    ? analytics.subject_wise 
    : analytics?.subject_wise 
      ? Object.values(analytics.subject_wise) 
      : [];
  const recentTrends = Array.isArray(analytics?.recent_trends) 
    ? analytics.recent_trends 
    : [];

  // Calculate max score for trend visualization
  const maxTrendScore = recentTrends.length > 0 
    ? Math.max(...recentTrends.map((t: any) => t.score), 100) 
    : 100;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-text-light">
            Performance Analytics
          </h1>
          <p className="text-base text-text-light">
            Track your progress and identify areas for improvement
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Overall Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card-light p-6 rounded-xl border border-border-light">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-text-light/70">Total Attempts</p>
                  <span className="material-symbols-outlined text-primary text-2xl">fact_check</span>
                </div>
                <p className="text-3xl font-bold text-text-light">{stats.total_attempts || 0}</p>
              </div>

              <div className="bg-card-light p-6 rounded-xl border border-border-light">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-text-light/70">Overall Accuracy</p>
                  <span className="material-symbols-outlined text-secondary text-2xl">verified</span>
                </div>
                <p className="text-3xl font-bold text-secondary">{stats.overall_accuracy || 0}%</p>
              </div>

              <div className="bg-card-light p-6 rounded-xl border border-border-light">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-text-light/70">Average Score</p>
                  <span className="material-symbols-outlined text-primary text-2xl">trending_up</span>
                </div>
                <p className="text-3xl font-bold text-text-light">{stats.average_score || 0}%</p>
              </div>

              <div className="bg-card-light p-6 rounded-xl border border-border-light">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-text-light/70">Best Score</p>
                  <span className="material-symbols-outlined text-secondary text-2xl">workspace_premium</span>
                </div>
                <p className="text-3xl font-bold text-secondary">{stats.best_score || 0}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Subject-wise Performance */}
              <div className="bg-card-light p-6 rounded-xl border border-border-light">
                <h2 className="text-xl font-bold text-text-light mb-6">Subject-wise Performance</h2>
                {!Array.isArray(subjectWise) || subjectWise.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-4xl text-text-light/30 mb-2">bar_chart</span>
                    <p className="text-sm text-text-light/70">No subject data available yet.</p>
                    <p className="text-xs text-text-light/50 mt-1">Complete quizzes to see your performance by subject.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(subjectWise) && subjectWise.map((subject: any, index: number) => (
                      <div key={index} className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">subject</span>
                            <p className="font-medium text-text-light">{subject.subject}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-text-light">{subject.average_score}%</p>
                            <p className="text-xs text-text-light/70">{subject.attempts} attempt{subject.attempts !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="w-full bg-background-light rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${subject.average_score}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-text-light/70">
                          <span>Accuracy: {subject.accuracy}%</span>
                          <span>{subject.obtained_marks}/{subject.total_marks} marks</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Trends */}
              <div className="bg-card-light p-6 rounded-xl border border-border-light">
                <h2 className="text-xl font-bold text-text-light mb-6">Recent Performance Trends</h2>
                {recentTrends.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-symbols-outlined text-4xl text-text-light/30 mb-2">show_chart</span>
                    <p className="text-sm text-text-light/70">No recent attempts to display.</p>
                    <p className="text-xs text-text-light/50 mt-1">Complete quizzes to see your performance trends.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentTrends.map((trend: any, index: number) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-text-light">{trend.paper_title}</p>
                            <p className="text-sm font-bold text-primary">{trend.score}%</p>
                          </div>
                          <div className="w-full bg-background-light rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                trend.score >= 80 ? 'bg-secondary' :
                                trend.score >= 60 ? 'bg-primary' : 'bg-error'
                              }`}
                              style={{ width: `${(trend.score / maxTrendScore) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-text-light/70 mt-1">{trend.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* All Attempts Table */}
            <div className="bg-card-light p-6 rounded-xl border border-border-light">
              <h2 className="text-xl font-bold text-text-light mb-6">All Quiz Attempts</h2>
              {attempts.length === 0 ? (
                <div className="text-center py-8">
                  <span className="material-symbols-outlined text-4xl text-text-light/30 mb-2">quiz</span>
                  <p className="text-sm text-text-light/70">No quiz attempts yet.</p>
                  <p className="text-xs text-text-light/50 mt-1">Start taking quizzes to see your attempts here.</p>
                  <Link
                    href="/quizzes"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    <span className="material-symbols-outlined text-base">quiz</span>
                    Browse Quizzes
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-light">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-light">Quiz</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-light">Exam</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-text-light">Score</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-text-light">Correct</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-text-light">Wrong</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-text-light">Marks</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-light">Date</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-text-light">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map((attempt: any) => {
                        // Safely convert percentage to number
                        const percentage = typeof attempt.percentage === 'number' 
                          ? attempt.percentage 
                          : typeof attempt.percentage === 'string' 
                            ? parseFloat(attempt.percentage) || 0
                            : 0;
                        
                        return (
                        <tr key={attempt.id} className="border-b border-border-light hover:bg-background-light transition-colors">
                          <td className="py-3 px-4">
                            <p className="text-sm font-medium text-text-light">{attempt.paper_title}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-text-light/70">{attempt.exam_name || 'N/A'}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-bold ${
                              percentage >= 80 ? 'bg-secondary/20 text-secondary' :
                              percentage >= 60 ? 'bg-primary/20 text-primary' :
                              'bg-error/20 text-error'
                            }`}>
                              {percentage.toFixed(0)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <p className="text-sm text-text-light">{attempt.correct_answers}/{attempt.total_questions}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <p className="text-sm text-text-light">{attempt.wrong_answers}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <p className="text-sm text-text-light">{attempt.obtained_marks}/{attempt.total_marks}</p>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-text-light/70">{attempt.completed_at_formatted || 'N/A'}</p>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Link
                              href={`/attempt_questions?paperId=${attempt.paper_id}`}
                              className="text-primary hover:text-primary/80 text-sm font-medium"
                            >
                              Retry
                            </Link>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

