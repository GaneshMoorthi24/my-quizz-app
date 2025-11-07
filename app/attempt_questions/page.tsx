"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./style.css";

export default function AttemptQuestionsPage() {
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(29);
  const [seconds, setSeconds] = useState(59);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(25);
  const [isPaused, setIsPaused] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isPaused) return;

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
  }, [isPaused]);

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleClearSelection = () => {
    setSelectedAnswer(null);
  };

  const formatTime = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  // Question states: answered, not-answered, not-visited, review, current
  const questionStates = Array.from({ length: 100 }, (_, i) => {
    const num = i + 1;
    if (num === 1 || num === 2) return "answered";
    if (num === 3) return "not-answered";
    if (num === 5) return "review";
    if (num === currentQuestion) return "current";
    return "not-visited";
  });

  const getQuestionButtonClass = (state: string, num: number) => {
    const baseClass = "flex items-center justify-center h-10 w-10 rounded-lg font-bold text-sm";
    switch (state) {
      case "answered":
        return `${baseClass} bg-success text-white`;
      case "not-answered":
        return `${baseClass} bg-danger text-white`;
      case "review":
        return `${baseClass} bg-review text-white`;
      case "current":
        return `${baseClass} border-2 border-primary bg-primary/20 text-primary`;
      default:
        return `${baseClass} bg-gray-200 `;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-border-light dark:border-border-dark px-6 py-3 bg-white dark:bg-background-dark/80 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-2xl">quiz</span>
          <h1 className="text-lg font-bold tracking-tight">UPSC Prelims Mock Test #3</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2 text-center">
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight">{formatTime(hours)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Hours</span>
            </div>
            <span className="text-xl font-bold text-gray-400 dark:text-gray-600">:</span>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight">{formatTime(minutes)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Minutes</span>
            </div>
            <span className="text-xl font-bold text-gray-400 dark:text-gray-600">:</span>
            <div className="flex flex-col">
              <span className="text-xl font-bold leading-tight text-danger">{formatTime(seconds)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Seconds</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePause}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg bg-gray-200/80 /80 px-3 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <span className="material-symbols-outlined text-lg">{isPaused ? "play_circle" : "pause_circle"}</span>
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>
          <Link
            href="/result"
            className="flex h-10 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90"
          >
            <span>Submit Test</span>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Question Navigation */}
        <aside className="w-80 flex-shrink-0 border-r border-solid border-border-light dark:border-border-dark bg-white dark:bg-background-dark/50 p-6 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Question Palette</h2>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {questionStates.map((state, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentQuestion(index + 1)}
                className={getQuestionButtonClass(state, index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="space-y-3 text-sm">
            <h3 className="font-semibold mb-2">Legend</h3>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-success"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-danger"></div>
              <span>Not Answered</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-gray-200 "></div>
              <span>Not Visited</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded bg-review"></div>
              <span>Marked for Review</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 rounded border-2 border-primary"></div>
              <span>Current Question</span>
            </div>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1 flex flex-col justify-between p-6 md:p-10 lg:p-12 overflow-y-auto">
          <div>
            <div className="max-w-4xl mx-auto">
              {/* Question Header */}
              <div className="mb-8">
                <h2 className="text-[32px] font-bold leading-tight tracking-tight">Question {currentQuestion} of 100</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Read the following passage carefully and answer the question that follows.
                </p>
              </div>

              {/* Question Body */}
              <div className="prose dark:prose-invert max-w-none text-base leading-relaxed mb-8">
                <p>
                  The history of modern India is a tapestry woven with threads of colonialism, resistance, and the quest
                  for a national identity. The economic policies of the British Raj, while introducing certain
                  infrastructural developments, fundamentally altered the subcontinent&apos;s economic structure to serve
                  colonial interests. This led to the de-industrialization of traditional sectors and the
                  commercialization of agriculture, often at the expense of the peasantry. In response, various forms
                  of resistance emerged, from localized revolts to the organized, pan-Indian nationalist movement led
                  by figures like Mahatma Gandhi, Jawaharlal Nehru, and Sardar Patel. The movement was not monolithic;
                  it encompassed a wide spectrum of ideologies, from the non-violent civil disobedience of the Indian
                  National Congress to the more radical approaches of revolutionary groups.
                </p>
                <p className="font-semibold mt-4">
                  What was the primary economic consequence of British policies discussed in the passage?
                </p>
              </div>

              {/* Answer Options */}
              <div className="space-y-3 max-w-4xl mx-auto">
                {[
                  "Rapid industrial growth in urban centers",
                  "The alteration of India's economy to serve colonial interests",
                  "A significant increase in peasant land ownership",
                  "The complete preservation of traditional industries",
                ].map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center gap-4 rounded-lg border border-solid border-border-light dark:border-border-dark p-4 cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-all ${
                      selectedAnswer === option ? "border-primary bg-primary/10 ring-2 ring-primary/50" : ""
                    }`}
                  >
                    <input
                      className="h-5 w-5 border-2 border-gray-300 dark:border-gray-600 bg-transparent text-primary focus:ring-primary/50"
                      name="answer-options"
                      type="radio"
                      checked={selectedAnswer === option}
                      onChange={() => setSelectedAnswer(option)}
                    />
                    <span className="text-sm font-medium">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="mt-10 pt-6 border-t border-border-light dark:border-border-dark max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentQuestion((prev) => Math.max(1, prev - 1))}
                  className="flex h-11 items-center justify-center gap-2 overflow-hidden rounded-lg bg-gray-200/80 /80 px-4 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <span className="material-symbols-outlined text-xl">arrow_back</span>
                  <span>Previous</span>
                </button>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleClearSelection}
                  className="flex h-11 items-center justify-center gap-2 overflow-hidden rounded-lg bg-gray-200/80 /80 px-4 text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  <span className="material-symbols-outlined text-xl">backspace</span>
                  <span>Clear Selection</span>
                </button>
                <button
                  onClick={() => {
                    // Mark for review logic
                    setCurrentQuestion((prev) => Math.min(100, prev + 1));
                  }}
                  className="flex h-11 items-center justify-center gap-2 overflow-hidden rounded-lg bg-review/20 px-4 text-sm font-medium text-review hover:bg-review/30"
                >
                  <span className="material-symbols-outlined text-xl">bookmark</span>
                  <span>Mark for Review & Next</span>
                </button>
                <button
                  onClick={() => {
                    // Save answer logic
                    setCurrentQuestion((prev) => Math.min(100, prev + 1));
                    setSelectedAnswer(null);
                  }}
                  className="flex h-11 items-center justify-center gap-2 overflow-hidden rounded-lg bg-success px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-success/90"
                >
                  <span>Save & Next</span>
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
