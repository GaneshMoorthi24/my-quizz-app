"use client";

import { useState } from "react";
import Link from "next/link";
import "./style.css";

export default function ResultPage() {
  const [filterQuestions, setFilterQuestions] = useState("all");

  const weakAreas = [
    {
      icon: "history_edu",
      title: "Indian History: 1857-1947",
      description: "You answered 4 out of 7 questions incorrectly in this topic.",
    },
    {
      icon: "gavel",
      title: "Constitutional Law",
      description: "You answered 2 out of 4 questions incorrectly in this topic.",
    },
    {
      icon: "calculate",
      title: "Algebraic Equations",
      description: "You answered 3 out of 6 questions incorrectly in this topic.",
    },
  ];

  const questions = [
    {
      id: 1,
      question: "Who was the first Governor-General of India after the Mutiny of 1857?",
      status: "correct",
      userAnswer: "Lord Canning",
      correctAnswer: "Lord Canning",
      explanation:
        "Lord Canning was the Governor-General of India during the Indian Rebellion of 1857. After the rebellion, the administration of India was transferred from the East India Company to the British Crown, and Lord Canning became the first Viceroy and Governor-General of India. This marked a significant shift in British colonial rule.",
    },
    {
      id: 2,
      question: "The Indian National Congress was founded in which year?",
      status: "incorrect",
      userAnswer: "1895",
      correctAnswer: "1885",
      explanation:
        "The Indian National Congress was founded in 1885 by Allan Octavian Hume, a retired British civil servant. The first session was held in Bombay (now Mumbai) and was presided over by W.C. Bonnerjee. The INC played a pivotal role in the Indian independence movement.",
    },
  ];

  const filteredQuestions =
    filterQuestions === "all"
      ? questions
      : filterQuestions === "correct"
        ? questions.filter((q) => q.status === "correct")
        : questions.filter((q) => q.status === "incorrect");

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      {/* TopNavBar */}
      <header className="sticky top-0 z-10 w-full bg-surface-light/80/80 backdrop-blur-sm border-b border-border-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4 text-text-light">
              <div className="size-6 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path
                    clipRule="evenodd"
                    d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <h1 className="text-lg font-bold">QuizPlatform</h1>
            </div>
            <div className="flex items-center gap-4 sm:gap-8">
              <nav className="hidden sm:flex items-center gap-6">
                <Link
                  className="text-sm font-medium hover:text-primary dark:hover:text-primary transition-colors"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  className="text-sm font-medium text-primary dark:text-primary"
                  href="/attempt_questions"
                >
                  New Quiz
                </Link>
              </nav>
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                data-alt="User profile picture"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDFA8M102KDFXekkuFJ0hUH7MzOuXp4YeyRnsOz6U5lgfBmaoZxLhqqJMRSuKcgMvGWcqGYk0hqfObpN4R7v62GOy4jMQHNoKCSeqsTF2lCKHWRQWL1Lg2n-150cukR954fVpLoZ8Hcg8PbrUstRU0CVLr855uOlr7t3CJwihGw8rv4PpAx-3F-cNEC9_Q2wVBCnjkQdfjNgrCtQYVtI4XZupZihT7WICf8t3QxnWEwwwsmREfuuD-Htunzgdqwy-CUzvLK3GhOZoVb")',
                }}
              ></div>
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
              <div className="flex flex-col gap-1">
                <p className="text-3xl font-bold tracking-tight text-text-light">
                  Quiz Results: Modern History Basics
                </p>
                <p className="text-base text-text-secondary-light dark:text-text-secondary-dark">
                  Here&apos;s a detailed breakdown of your performance.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center justify-center gap-2 rounded-lg bg-surface-light border border-border-light px-4 py-2 text-sm font-semibold text-text-light hover:bg-background-light transition-colors">
                  <span className="material-symbols-outlined text-base">ios_share</span>
                  Export Results
                </button>
                <Link
                  href="/attempt_questions"
                  className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
                >
                  <span className="material-symbols-outlined text-base">refresh</span>
                  Retry Quiz
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light border border-border-light">
                <p className="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Final Score
                </p>
                <p className="text-3xl font-bold text-primary">85/100</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light border border-border-light">
                <p className="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Accuracy
                </p>
                <p className="text-3xl font-bold text-success">85%</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light border border-border-light">
                <p className="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Time Taken
                </p>
                <p className="text-3xl font-bold text-text-light">12:35</p>
              </div>
              <div className="flex flex-col gap-2 rounded-xl p-6 bg-surface-light border border-border-light">
                <p className="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">
                  Correct / Incorrect
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-success">85/15</p>
                </div>
              </div>
            </div>

            {/* AI Insights - Weak Areas */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold text-text-light tracking-tight">
                Your Key Areas for Improvement
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {weakAreas.map((area, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface-light p-5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-2xl">{area.icon}</span>
                      <h3 className="text-base font-bold text-text-light">{area.title}</h3>
                    </div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                      {area.description}
                    </p>
                    <Link className="text-sm font-semibold text-primary hover:underline" href="#">
                      Review Topic
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Question Review Panel */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-text-light tracking-tight">
                  Detailed Question Review
                </h2>
                <div className="flex items-center gap-2">
                  <label
                    className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark"
                    htmlFor="filter-questions"
                  >
                    Show:
                  </label>
                  <select
                    className="rounded-lg border-border-light bg-surface-light text-sm focus:border-primary focus:ring-primary"
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
              <div className="flex flex-col gap-4">
                {filteredQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-xl border border-border-light bg-surface-light p-6"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-base font-medium">{q.question}</p>
                        <span
                          className={`flex-shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                            q.status === "correct"
                              ? "bg-success/10 text-success"
                              : "bg-error/10 text-error"
                          }`}
                        >
                          {q.status === "correct" ? "Correct" : "Incorrect"}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div
                          className={`flex items-center gap-3 rounded-lg border p-3 ${
                            q.status === "correct"
                              ? "border-success bg-success/10"
                              : "border-error bg-error/10"
                          }`}
                        >
                          <span
                            className={`material-symbols-outlined ${
                              q.status === "correct" ? "text-success" : "text-error"
                            }`}
                          >
                            {q.status === "correct" ? "check_circle" : "cancel"}
                          </span>
                          <p className="text-sm">Your Answer: {q.userAnswer}</p>
                        </div>
                        {q.status === "incorrect" && (
                          <div className="flex items-center gap-3 rounded-lg border border-success bg-success/10 p-3">
                            <span className="material-symbols-outlined text-success">check_circle</span>
                            <p className="text-sm">Correct Answer: {q.correctAnswer}</p>
                          </div>
                        )}
                      </div>
                      <details>
                        <summary className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-primary hover:underline">
                          View AI Explanation
                          <span className="material-symbols-outlined text-base">expand_more</span>
                        </summary>
                        <div className="mt-3 rounded-lg bg-background-light dark:bg-background-dark p-4 text-sm text-text-secondary-light dark:text-text-secondary-dark border border-border-light">
                          <p>{q.explanation}</p>
                        </div>
                      </details>
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
