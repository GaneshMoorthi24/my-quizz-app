"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import "./style.css";
import { getPaperQuestions, submitAnswers } from "@/lib/api";

type Question = {
  id: number;
  question_text: string;
  type: string;
  marks: number;
  options: { [key: string]: string };
  correct_answer: string | null;
};

export default function AttemptQuestionsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paperId = searchParams.get("paperId");
  
  const [paper, setPaper] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [reviewed, setReviewed] = useState<{ [key: number]: boolean }>({});
  const [visited, setVisited] = useState<{ [key: number]: boolean }>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(29);
  const [seconds, setSeconds] = useState(59);
  const [submitting, setSubmitting] = useState(false);

  // Fetch questions on mount
  useEffect(() => {
    if (!paperId) {
      alert("No paper ID provided");
      router.push("/dashboard");
      return;
    }
    fetchQuestions();
  }, [paperId]);

  async function fetchQuestions() {
    try {
      setLoading(true);
      const data = await getPaperQuestions(paperId!);
      setPaper(data.paper);
      setQuestions(data.questions || []);
      
      // Initialize answers object
      const initialAnswers: { [key: number]: string } = {};
      data.questions?.forEach((q: Question) => {
        initialAnswers[q.id] = "";
      });
      setAnswers(initialAnswers);
    } catch (error: any) {
      console.error("Failed to fetch questions:", error);
      alert(error.response?.data?.message || "Failed to load questions");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  // Timer countdown
  useEffect(() => {
    if (isPaused || submitting) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev > 0) return prev - 1;
        setMinutes((prev) => {
          if (prev > 0) return prev - 1;
          setHours((prev) => (prev > 0 ? prev - 1 : 0));
          return 59;
        });
        return 59;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, submitting]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (hours === 0 && minutes === 0 && seconds === 0 && !submitting) {
      handleSubmit();
    }
  }, [hours, minutes, seconds]);

  // Load current question's answer and mark as visited
  useEffect(() => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setSelectedAnswer(answers[currentQuestion.id] || null);
      // Mark question as visited when viewing it
      setVisited((prev) => ({ ...prev, [currentQuestion.id]: true }));
    }
  }, [currentQuestionIndex, questions, answers]);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleClearSelection = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: "" }));
      setSelectedAnswer(null);
      // If cleared, it becomes not-answered (red) if already visited
      // Remove from reviewed since it's no longer answered
      setReviewed((prev) => {
        const updated = { ...prev };
        delete updated[currentQuestion.id];
        return updated;
      });
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));
      setSelectedAnswer(answer);
      // If question was marked for review but now has an answer, remove from reviewed
      // (answered takes priority over reviewed)
      if (reviewed[currentQuestion.id]) {
        setReviewed((prev) => {
          const updated = { ...prev };
          delete updated[currentQuestion.id];
          return updated;
        });
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleMarkForReview = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      setReviewed((prev) => ({ ...prev, [currentQuestion.id]: true }));
      setVisited((prev) => ({ ...prev, [currentQuestion.id]: true }));
      handleNext();
    }
  };

  const handleSaveAndNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion) {
      // Mark as visited (saved)
      setVisited((prev) => ({ ...prev, [currentQuestion.id]: true }));
      // If question has an answer, remove from reviewed (answered takes priority)
      if (answers[currentQuestion.id]) {
        setReviewed((prev) => {
          const updated = { ...prev };
          delete updated[currentQuestion.id];
          return updated;
        });
      }
    }
    handleNext();
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    
    const confirmSubmit = window.confirm(
      `Are you sure you want to submit? You have answered ${Object.values(answers).filter(a => a).length} out of ${questions.length} questions.`
    );
    
    if (!confirmSubmit) return;

    try {
      setSubmitting(true);
      
      // Format answers for API
      const formattedAnswers = Object.entries(answers)
        .filter(([_, answer]) => answer) // Only include answered questions
        .map(([questionId, selectedAnswer]) => ({
          question_id: parseInt(questionId),
          selected_answer: selectedAnswer,
        }));

      const result = await submitAnswers(paperId!, formattedAnswers);
      
      // Store result in sessionStorage and navigate to results page
      sessionStorage.setItem("quizResult", JSON.stringify(result));
      router.push(`/result?paperId=${paperId}`);
    } catch (error: any) {
      console.error("Failed to submit answers:", error);
      alert(error.response?.data?.message || "Failed to submit answers");
      setSubmitting(false);
    }
  };

  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  const getQuestionState = (index: number): string => {
    const question = questions[index];
    if (!question) return "not-visited";
    
    if (index === currentQuestionIndex) return "current";
    
    // Priority: answered > reviewed > not-answered > not-visited
    const hasAnswer = answers[question.id] && answers[question.id].trim() !== "";
    const isReviewed = reviewed[question.id];
    const isVisited = visited[question.id];
    
    if (hasAnswer) {
      return "answered"; // Green - question is answered
    }
    
    if (isReviewed) {
      return "review"; // Purple - marked for review but not answered
    }
    
    if (isVisited && !hasAnswer) {
      return "not-answered"; // Red - visited/saved but no answer (skipped)
    }
    
    return "not-visited"; // Gray - not visited yet
  };

  const getQuestionButtonClass = (state: string) => {
    const baseClass = "flex items-center justify-center h-10 w-10 rounded-lg font-bold text-sm cursor-pointer transition-all shadow-sm";
    switch (state) {
      case "answered":
        return `${baseClass} bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-md`;
      case "not-answered":
        return `${baseClass} bg-red-500 text-white hover:bg-red-600 hover:shadow-md`;
      case "review":
        return `${baseClass} bg-purple-500 text-white hover:bg-purple-600 hover:shadow-md`;
      case "current":
        return `${baseClass} border-2 border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200`;
      default:
        return `${baseClass} bg-slate-200 text-slate-600 hover:bg-slate-300`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No questions found for this paper.</p>
          <Link href="/dashboard" className="text-primary hover:underline">
            Go back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const optionKeys = Object.keys(currentQuestion.options || {}).sort();

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-slate-200 px-4 sm:px-6 py-4 bg-white/80 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white text-xl">quiz</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800">{paper?.title || "Quiz"}</h1>
            <p className="text-xs text-slate-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
            <span className="material-symbols-outlined text-red-600 text-lg">timer</span>
            <div className="flex gap-1.5 text-center">
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-red-600">{formatTime(hours)}</span>
                <span className="text-xs text-red-500">H</span>
              </div>
              <span className="text-lg font-bold text-red-400">:</span>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-red-600">{formatTime(minutes)}</span>
                <span className="text-xs text-red-500">M</span>
              </div>
              <span className="text-lg font-bold text-red-400">:</span>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-red-600">{formatTime(seconds)}</span>
                <span className="text-xs text-red-500">S</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handlePause}
            disabled={submitting}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-100 px-3 sm:px-4 text-sm font-medium hover:bg-slate-200 disabled:opacity-50 transition-all"
          >
            <span className="material-symbols-outlined text-lg">{isPaused ? "play_circle" : "pause_circle"}</span>
            <span className="hidden sm:inline">{isPaused ? "Resume" : "Pause"}</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex h-10 min-w-[100px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-4 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit</span>
                <span className="material-symbols-outlined text-lg">check_circle</span>
              </>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Question Navigation */}
        <aside className="hidden lg:block w-80 flex-shrink-0 border-r border-slate-200 bg-white/80 backdrop-blur-sm p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Question Palette</h2>
            <p className="text-xs text-slate-500">Click to navigate between questions</p>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((_, index) => {
              const state = getQuestionState(index);
              return (
                <button
                  key={index}
                  onClick={() => handleQuestionClick(index)}
                  className={getQuestionButtonClass(state)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="space-y-2 text-sm bg-slate-50 rounded-xl p-4 border border-slate-200">
            <h3 className="font-semibold mb-3 text-slate-800">Legend</h3>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="h-4 w-4 rounded bg-emerald-500"></div>
              <span className="text-xs">Answered</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="h-4 w-4 rounded bg-red-500"></div>
              <span className="text-xs">Not Answered</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="h-4 w-4 rounded bg-slate-300"></div>
              <span className="text-xs">Not Visited</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="h-4 w-4 rounded bg-purple-500"></div>
              <span className="text-xs">Marked for Review</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <div className="h-4 w-4 rounded border-2 border-blue-500 bg-blue-50"></div>
              <span className="text-xs">Current Question</span>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto">
          <div>
            <div className="max-w-4xl mx-auto">
              {/* Question Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-slate-800">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </h2>
                    <p className="text-slate-500 mt-1 text-sm">
                      {currentQuestion.marks} mark{currentQuestion.marks !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </div>

              {/* Question Body */}
              <div className="mb-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                  <p className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
                    {currentQuestion.question_text}
                  </p>
                </div>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 mb-8">
                {optionKeys.map((key) => {
                  const optionText = currentQuestion.options[key];
                  if (!optionText) return null;
                  
                  return (
                    <label
                      key={key}
                      className={`group flex items-center gap-4 rounded-xl border-2 p-4 sm:p-5 cursor-pointer transition-all ${
                        selectedAnswer === key
                          ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedAnswer === key
                          ? "border-blue-500 bg-blue-500"
                          : "border-slate-300 group-hover:border-blue-400"
                      }`}>
                        {selectedAnswer === key && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <input
                        className="sr-only"
                        name="answer-options"
                        type="radio"
                        checked={selectedAnswer === key}
                        onChange={() => handleAnswerSelect(key)}
                      />
                      <span className="text-base font-medium text-slate-800 flex-1">
                        <span className="font-bold text-blue-600 mr-2">{key}.</span>
                        {optionText}
                      </span>
                      {selectedAnswer === key && (
                        <span className="material-symbols-outlined text-blue-600">check_circle</span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="mt-8 pt-6 border-t border-slate-200 max-w-4xl mx-auto bg-white/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0 || submitting}
                  className="flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-100 px-4 text-sm font-medium hover:bg-slate-200 disabled:opacity-50 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">arrow_back</span>
                  <span className="hidden sm:inline">Previous</span>
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleClearSelection}
                  disabled={submitting || !selectedAnswer}
                  className="flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-100 px-3 sm:px-4 text-sm font-medium hover:bg-slate-200 disabled:opacity-50 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">backspace</span>
                  <span className="hidden sm:inline">Clear</span>
                </button>
                <button
                  onClick={handleMarkForReview}
                  disabled={submitting}
                  className="flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-purple-100 text-purple-700 px-3 sm:px-4 text-sm font-medium hover:bg-purple-200 disabled:opacity-50 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">bookmark</span>
                  <span className="hidden sm:inline">Mark & Next</span>
                </button>
                <button
                  onClick={handleSaveAndNext}
                  disabled={currentQuestionIndex === questions.length - 1 || submitting}
                  className="flex h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 sm:px-6 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50"
                >
                  <span>Save & Next</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
