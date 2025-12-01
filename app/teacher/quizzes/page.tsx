"use client";

import { useMemo, useState } from "react";

type QuestionType = "mcq" | "true_false" | "short";

interface Question {
  id: number;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  tags: string[];
  difficulty: "Easy" | "Medium" | "Hard";
}

const stepLabels = ["Quiz Info", "Add Questions", "Preview & Publish"];

const aiTemplates = [
  {
    id: 1,
    title: "NCERT Chapter Breakdown",
    description: "“Generate 15 MCQs covering NCERT Class 10 Science Chapter 4 with Bloom level tags.”",
  },
  {
    id: 2,
    title: "Competitive Exam Mode",
    description: "“Create 20 advanced SSC CGL quantitative aptitude MCQs with detailed explanations.”",
  },
  {
    id: 3,
    title: "True/False Booster",
    description: "“Generate 10 True/False statements for Physics optics unit focusing on misconceptions.”",
  },
];

export default function TeacherCreateQuizPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [quizInfo, setQuizInfo] = useState({
    name: "",
    subject: "",
    grade: "",
    duration: 45,
    instructions: "Read every question carefully. Anti-cheat enabled.",
    tags: ["Chapter 5", "Weekly Test"],
  });
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionForm, setQuestionForm] = useState<Partial<Question>>({
    type: "mcq",
    options: ["", "", "", ""],
    difficulty: "Medium",
    tags: [],
  });
  const [aiSuggestions, setAiSuggestions] = useState<Question[]>([]);

  const canProceed = useMemo(() => {
    if (activeStep === 0) {
      return quizInfo.name && quizInfo.subject && quizInfo.grade;
    }
    if (activeStep === 1) {
      return questions.length > 0;
    }
    return true;
  }, [activeStep, quizInfo, questions]);

  const handleAddQuestion = () => {
    if (!questionForm.prompt || !questionForm.type) return;
    const newQuestion: Question = {
      id: Date.now(),
      type: questionForm.type as QuestionType,
      prompt: questionForm.prompt,
      options: questionForm.type === "mcq" ? (questionForm.options as string[]).map((opt) => opt || "") : ["True", "False"],
      correctAnswer: questionForm.correctAnswer || "",
      explanation: questionForm.explanation || "",
      tags: questionForm.tags?.length ? questionForm.tags : ["Untagged"],
      difficulty: (questionForm.difficulty as Question["difficulty"]) || "Medium",
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setQuestionForm({
      type: questionForm.type,
      options: ["", "", "", ""],
      difficulty: "Medium",
      tags: [],
    });
  };

  const handleGenerateAI = () => {
    const mockQuestions: Question[] = Array.from({ length: 3 }).map((_, idx) => ({
      id: Date.now() + idx,
      type: "mcq",
      prompt: `AI generated question ${idx + 1} for ${quizInfo.subject || "selected subject"}`,
      options: ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: "Option A",
      explanation: "Generated explanation based on topic keywords.",
      tags: ["AI Generated", quizInfo.tags?.[0] || "Topic"],
      difficulty: "Medium",
    }));
    setAiSuggestions(mockQuestions);
  };

  const handlePublish = () => {
    alert("Quiz saved! Connect API to persist data.");
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Manual Quiz Builder</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-white">Create Quiz • Manual + AI-assisted</h1>
          <div className="flex gap-2 text-xs uppercase tracking-wide text-white/50">
            <span className="rounded-full border border-white/10 px-3 py-1">MCQ + T/F + Short</span>
            <span className="rounded-full border border-white/10 px-3 py-1">AI Assistance</span>
            <span className="rounded-full border border-white/10 px-3 py-1">Publishing Ready</span>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-6 shadow-lg">
        <div className="grid gap-4 md:grid-cols-3">
          {stepLabels.map((label, index) => (
            <button
              key={label}
              onClick={() => canProceed && setActiveStep(index)}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                activeStep === index
                  ? "border-white/90 bg-white text-slate-900 shadow-xl"
                  : "border-white/10 bg-white/5 text-white/70 hover:border-white/30"
              }`}
            >
              <p className="text-xs uppercase tracking-wide">{`Step ${index + 1}`}</p>
              <p className="text-lg font-semibold">{label}</p>
            </button>
          ))}
        </div>
        {activeStep === 0 && (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Quiz Name</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                  value={quizInfo.name}
                  onChange={(e) => setQuizInfo({ ...quizInfo, name: e.target.value })}
                  placeholder="Electromagnetic Induction - Weekly Test"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Subject</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                  value={quizInfo.subject}
                  onChange={(e) => setQuizInfo({ ...quizInfo, subject: e.target.value })}
                  placeholder="Physics"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Class / Grade level</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                  value={quizInfo.grade}
                  onChange={(e) => setQuizInfo({ ...quizInfo, grade: e.target.value })}
                  placeholder="XI - Science"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Duration (minutes)</label>
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                  value={quizInfo.duration}
                  onChange={(e) => setQuizInfo({ ...quizInfo, duration: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Instructions</label>
                <textarea
                  className="mt-2 h-32 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white/40 focus:outline-none"
                  value={quizInfo.instructions}
                  onChange={(e) => setQuizInfo({ ...quizInfo, instructions: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Tags</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                  value={quizInfo.tags.join(", ")}
                  onChange={(e) => setQuizInfo({ ...quizInfo, tags: e.target.value.split(",").map((tag) => tag.trim()) })}
                  placeholder="Chapter, Topic, Difficulty"
                />
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                <p className="font-semibold text-white">Need Inspiration?</p>
                <p className="mt-2">Use AI templates to pre-fill quiz details based on exam type and blueprint.</p>
              </div>
            </div>
          </div>
        )}

        {activeStep === 1 && (
          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center gap-3">
                {(["mcq", "true_false", "short"] as QuestionType[]).map((type) => (
                  <button
                    key={type}
                    className={`rounded-2xl px-4 py-2 text-sm font-semibold uppercase tracking-wide ${
                      questionForm.type === type ? "bg-white text-slate-900" : "bg-white/10 text-white/70"
                    }`}
                    onClick={() => setQuestionForm((prev) => ({ ...prev, type }))}
                  >
                    {type === "mcq" ? "MCQ" : type === "true_false" ? "True / False" : "Short Answer"}
                  </button>
                ))}
              </div>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs uppercase tracking-wide text-white/50">Question</label>
                  <textarea
                    className="mt-2 h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                    value={questionForm.prompt || ""}
                    onChange={(e) => setQuestionForm({ ...questionForm, prompt: e.target.value })}
                    placeholder="What law explains the direction of induced current?"
                  />
                </div>
                {questionForm.type === "mcq" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {(questionForm.options || []).map((option, index) => (
                      <input
                        key={index}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                        value={option}
                        onChange={(e) => {
                          const updated = [...(questionForm.options || [])];
                          updated[index] = e.target.value;
                          setQuestionForm({ ...questionForm, options: updated });
                        }}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      />
                    ))}
                  </div>
                )}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-wide text-white/50">Correct Answer</label>
                    <input
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                      value={questionForm.correctAnswer || ""}
                      onChange={(e) => setQuestionForm({ ...questionForm, correctAnswer: e.target.value })}
                      placeholder="Option A / True / Sample answer"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wide text-white/50">Difficulty</label>
                    <select
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                      value={questionForm.difficulty}
                      onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value as Question["difficulty"] })}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-white/50">Explanation (optional)</label>
                  <textarea
                    className="mt-2 h-20 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-white/40 focus:outline-none"
                    value={questionForm.explanation || ""}
                    onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-900 shadow-lg"
                    onClick={handleAddQuestion}
                  >
                    Add Question
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-2xl font-bold text-white">AI Assistance (Premium)</h3>
                <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80" onClick={handleGenerateAI}>
                  Generate Suggestions
                </button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {aiTemplates.map((template) => (
                  <div key={template.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-white/70">
                    <p className="text-white">{template.title}</p>
                    <p className="mt-2">{template.description}</p>
                  </div>
                ))}
              </div>
              {aiSuggestions.length > 0 && (
                <div className="mt-6 space-y-3">
                  {aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                      <p className="font-semibold text-white">{suggestion.prompt}</p>
                      <p className="text-xs uppercase tracking-wide text-white/50">{suggestion.tags.join(", ")}</p>
                      <button
                        className="mt-3 rounded-2xl border border-white/20 px-3 py-1 text-xs font-semibold text-white/80"
                        onClick={() => setQuestions((prev) => [...prev, suggestion])}
                      >
                        Add to quiz
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Questions Added ({questions.length})</h3>
                <p className="text-xs uppercase tracking-wide text-white/50">Click to edit</p>
              </div>
              <div className="mt-4 space-y-3">
                {questions.map((question) => (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm text-white/80 hover:border-white/40"
                  >
                    <p className="font-semibold text-white">{question.prompt}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full border border-white/10 px-3 py-1">{question.type.toUpperCase()}</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">{question.difficulty}</span>
                      {question.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {questions.length === 0 && <p className="text-sm text-white/60">No questions yet. Add or import to continue.</p>}
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs uppercase tracking-wide text-white/50">Quiz Overview</p>
              <h3 className="mt-2 text-2xl font-bold text-white">{quizInfo.name || "Untitled quiz"}</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-4">
                {[
                  { label: "Subject", value: quizInfo.subject || "—" },
                  { label: "Grade", value: quizInfo.grade || "—" },
                  { label: "Duration", value: `${quizInfo.duration} mins` },
                  { label: "Questions", value: questions.length },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                    <p className="text-xs uppercase tracking-wide text-white/50">{item.label}</p>
                    <p className="text-lg font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-sm text-white/70">{quizInfo.instructions}</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-white/50">Assign Immediately</p>
                  <h3 className="text-xl font-semibold text-white">Select target students or groups</h3>
                </div>
                <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Open assignments</button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {["All Students", "Group: XI Elite Batch", "Individual picks"].map((target) => (
                  <div key={target} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4 text-sm text-white/80">
                    {target}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-6">
              <div>
                <p className="text-xs uppercase tracking-wide text-white/50">Ready to Publish</p>
                <h3 className="text-2xl font-bold text-white">Save & activate this quiz</h3>
                <p className="text-sm text-white/70">Assignments, notifications, and live monitoring will kick in immediately.</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/80">Save Draft</button>
                <button className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900" onClick={handlePublish}>
                  Publish & Assign
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="flex justify-between">
        <button
          className="rounded-2xl border border-white/20 px-6 py-3 text-sm font-semibold text-white/70 disabled:cursor-not-allowed disabled:border-white/5 disabled:text-white/30"
          disabled={activeStep === 0}
          onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
        >
          Back
        </button>
        <button
          className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-900 disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40"
          disabled={!canProceed}
          onClick={() => setActiveStep((step) => Math.min(step + 1, 2))}
        >
          {activeStep === stepLabels.length - 1 ? "Finish" : "Continue"}
        </button>
      </div>
    </div>
  );
}

