"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { getPaperQuestions, generateQuestionExplanation } from "@/lib/api";
import "./style.css";

type ResultData = {
  paper_id: number;
  paper_title: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  results: Array<{
    question_id: number;
    question_text: string;
    selected_answer: string;
    correct_answer: string;
    is_correct: boolean;
    marks: number;
    obtained_marks: number;
  }>;
};

type QuestionWithOptions = {
  id: number;
  question_text: string;
  options: { [key: string]: string }; // { A: "option text", B: "option text", ... }
  correct_answer: string;
};

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filterQuestions, setFilterQuestions] = useState("all");
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [questionsWithOptions, setQuestionsWithOptions] = useState<{ [key: number]: QuestionWithOptions }>({});
  const [loading, setLoading] = useState(true);
  const [explanations, setExplanations] = useState<{ [key: number]: string }>({});
  const [generatingExplanations, setGeneratingExplanations] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    async function fetchData() {
      // Get result from sessionStorage
      const storedResult = sessionStorage.getItem("quizResult");
      if (storedResult) {
        try {
          const data = JSON.parse(storedResult);
          setResultData(data);
          
          // Fetch questions with options to display all options
          if (data.paper_id) {
            try {
              const questionsData = await getPaperQuestions(data.paper_id);
              const questionsMap: { [key: number]: QuestionWithOptions } = {};
              
              if (questionsData.questions && Array.isArray(questionsData.questions)) {
                questionsData.questions.forEach((q: any) => {
                  questionsMap[q.id] = {
                    id: q.id,
                    question_text: q.question_text,
                    options: q.options || {},
                    correct_answer: q.correct_answer || "",
                  };
                });
              }
              
              setQuestionsWithOptions(questionsMap);
            } catch (error) {
              console.error("Failed to fetch question options:", error);
              // Continue without options - will show only selected/correct answers
            }
          }
        } catch (error) {
          console.error("Failed to parse result data:", error);
          router.push("/dashboard");
        }
      } else {
        // No result data, redirect to dashboard
        router.push("/dashboard");
      }
      setLoading(false);
    }
    
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No results found.</p>
          <Link href="/dashboard" className="text-primary hover:underline">
            Go back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const filteredQuestions =
    filterQuestions === "all"
      ? resultData.results
      : filterQuestions === "correct"
        ? resultData.results.filter((q) => q.is_correct)
        : resultData.results.filter((q) => !q.is_correct);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* TopNavBar */}
      <header className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-white text-xl">school</span>
              </div>
              <h1 className="text-lg font-bold text-slate-800">QuizPlatform</h1>
            </Link>
            <div className="flex items-center gap-4 sm:gap-6">
              <nav className="hidden sm:flex items-center gap-6">
                <Link
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  className="text-sm font-medium text-blue-600"
                  href="/quizzes"
                >
                  New Quiz
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col gap-8">
            {/* Page Heading & Actions */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-10 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      Quiz Results
                    </h1>
                    <p className="text-base text-slate-600 mt-1">{resultData.paper_title}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500 ml-4">
                  Here&apos;s a detailed breakdown of your performance.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/attempt_questions?paperId=${resultData.paper_id}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  Retry Quiz
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-white text-xl">score</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Final Score</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {resultData.obtained_marks}/{resultData.total_marks}
                  </p>
                </div>
              </div>
              <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-white text-xl">verified</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Accuracy</p>
                  <p className="text-3xl font-bold text-emerald-600">{resultData.percentage}%</p>
                </div>
              </div>
              <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-white text-xl">quiz</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Total Questions</p>
                  <p className="text-3xl font-bold text-purple-600">{resultData.total_questions}</p>
                </div>
              </div>
              <div className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-white text-xl">check_circle</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-slate-600 mb-2">Correct / Incorrect</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold text-emerald-600">{resultData.correct_answers}</p>
                    <span className="text-xl text-slate-400">/</span>
                    <p className="text-3xl font-bold text-red-600">{resultData.wrong_answers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Review Panel */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    Detailed Question Review
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <label
                    className="text-sm font-medium text-slate-600"
                    htmlFor="filter-questions"
                  >
                    Show:
                  </label>
                  <select
                    className="rounded-xl border-slate-200 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 p-2.5 shadow-sm transition-all"
                    id="filter-questions"
                    value={filterQuestions}
                    onChange={(e) => setFilterQuestions(e.target.value)}
                  >
                    <option value="all">All Questions</option>
                    <option value="correct">Correct Only</option>
                    <option value="incorrect">Incorrect Only</option>
                  </select>
                </div>
              </div>

              {/* Question List */}
              <div className="flex flex-col gap-6">
                {filteredQuestions.map((q, index) => (
                  <div
                    key={q.question_id}
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-sm">
                              Q{index + 1}
                            </span>
                            <span
                              className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                                q.is_correct
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {q.is_correct ? "✓ Correct" : "✗ Incorrect"}
                            </span>
                          </div>
                          <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
                            {q.question_text}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        {/* All Options Display */}
                        {questionsWithOptions[q.question_id]?.options ? (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-text-light mb-2">All Options:</p>
                            {Object.entries(questionsWithOptions[q.question_id].options).map(([optionKey, optionText]) => {
                              const isSelected = q.selected_answer === optionKey;
                              // Use correct answer from questionsWithOptions if available, otherwise from result data
                              const correctAnswer = questionsWithOptions[q.question_id]?.correct_answer || q.correct_answer || '';
                              const isCorrect = correctAnswer === optionKey;
                              
                              let bgColor = "bg-gray-50";
                              let borderColor = "border-gray-200";
                              let textColor = "text-text-light";
                              let icon = null;
                              
                              if (isCorrect && isSelected) {
                                // Correct answer that was selected
                                bgColor = "bg-success/10";
                                borderColor = "border-success";
                                textColor = "text-success";
                                icon = <span className="material-symbols-outlined text-success text-lg">check_circle</span>;
                              } else if (isCorrect) {
                                // Correct answer that wasn't selected
                                bgColor = "bg-success/10";
                                borderColor = "border-success";
                                textColor = "text-success";
                                icon = <span className="material-symbols-outlined text-success text-lg">check_circle</span>;
                              } else if (isSelected) {
                                // Wrong answer that was selected
                                bgColor = "bg-error/10";
                                borderColor = "border-error";
                                textColor = "text-error";
                                icon = <span className="material-symbols-outlined text-error text-lg">cancel</span>;
                              }
                              
                              return (
                                <div
                                  key={optionKey}
                                  className={`flex items-center gap-3 rounded-lg border p-3 ${bgColor} ${borderColor}`}
                                >
                                  {icon}
                                  <span className={`font-semibold ${textColor} min-w-[24px]`}>{optionKey}.</span>
                                  <span className={`text-sm ${textColor} flex-1`}>{optionText}</span>
                                  {isSelected && (
                                    <span className="text-xs font-medium text-text-secondary-light bg-white/50 px-2 py-1 rounded">
                                      Your Answer
                                    </span>
                                  )}
                                  {isCorrect && !isSelected && (
                                    <span className="text-xs font-medium text-success bg-white/50 px-2 py-1 rounded">
                                      Correct Answer
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          // Fallback: Show only selected and correct answers if options not available
                          <>
                            <div
                              className={`flex items-center gap-3 rounded-lg border p-3 ${
                                q.is_correct
                                  ? "border-success bg-success/10"
                                  : "border-error bg-error/10"
                              }`}
                            >
                              <span
                                className={`material-symbols-outlined ${
                                  q.is_correct ? "text-success" : "text-error"
                                }`}
                              >
                                {q.is_correct ? "check_circle" : "cancel"}
                              </span>
                              <p className="text-sm">Your Answer: <span className="font-semibold">{q.selected_answer}</span></p>
                              <span className="text-sm text-gray-500">({q.obtained_marks}/{q.marks} marks)</span>
                            </div>
                            {!q.is_correct && (() => {
                              const correctAnswer = questionsWithOptions[q.question_id]?.correct_answer || q.correct_answer || '';
                              return correctAnswer ? (
                                <div className="flex items-center gap-3 rounded-lg border border-success bg-success/10 p-3">
                                  <span className="material-symbols-outlined text-success">check_circle</span>
                                  <p className="text-sm">Correct Answer: <span className="font-semibold">{correctAnswer}</span></p>
                                </div>
                              ) : null;
                            })()}
                          </>
                        )}
                      </div>
                      
                      {/* Explanation Section */}
                      <div className="mt-4 pt-4 border-t border-border-light">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-semibold text-text-light">Explanation</h3>
                          {!explanations[q.question_id] && (
                            <button
                              onClick={async () => {
                                if (!questionsWithOptions[q.question_id]) return;
                                
                                setGeneratingExplanations(prev => ({ ...prev, [q.question_id]: true }));
                                try {
                                  // Get question ID from questionsWithOptions
                                  const questionId = questionsWithOptions[q.question_id].id;
                                  const result = await generateQuestionExplanation(questionId);
                                  setExplanations(prev => ({ ...prev, [q.question_id]: result.explanation }));
                                } catch (error) {
                                  console.error("Failed to generate explanation:", error);
                                  alert("Failed to generate explanation. Please try again.");
                                } finally {
                                  setGeneratingExplanations(prev => ({ ...prev, [q.question_id]: false }));
                                }
                              }}
                              disabled={generatingExplanations[q.question_id]}
                              className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {generatingExplanations[q.question_id] ? (
                                <>
                                  <span className="animate-spin">⏳</span>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                                  Generate AI Explanation
                                </>
                              )}
                            </button>
                          )}
                        </div>
                        {explanations[q.question_id] ? (
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                            <p className="text-sm text-text-light leading-relaxed whitespace-pre-wrap">
                              {explanations[q.question_id]}
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs text-text-secondary-light italic">
                            Click "Generate AI Explanation" to get an AI-powered explanation for this question.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
