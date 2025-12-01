"use client";

import { useMemo, useState } from "react";

const categories = [
  { name: "Mathematics", color: "from-emerald-500 to-teal-500", total: 124 },
  { name: "Physics", color: "from-blue-500 to-indigo-500", total: 98 },
  { name: "Chemistry", color: "from-orange-500 to-rose-500", total: 86 },
  { name: "Biology", color: "from-green-500 to-lime-500", total: 76 },
];

const questionBank = Array.from({ length: 16 }).map((_, index) => ({
  id: index + 1,
  prompt: `Sample question ${index + 1} covering key concepts for exams.`,
  type: index % 3 === 0 ? "True/False" : index % 2 === 0 ? "Short Answer" : "MCQ",
  subject: categories[index % categories.length].name,
  chapter: `Chapter ${((index % 5) + 1).toString()}`,
  difficulty: ["Easy", "Medium", "Hard"][index % 3],
  tags: ["PYQ", "NCERT", "Mock"][index % 3],
}));

export default function QuestionBankPage() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const filteredQuestions = useMemo(() => {
    return questionBank.filter((question) => {
      const matchesSearch =
        !search ||
        question.prompt.toLowerCase().includes(search.toLowerCase()) ||
        question.chapter.toLowerCase().includes(search.toLowerCase());
      const matchesSubject = selectedSubject === "All" || question.subject === selectedSubject;
      const matchesDifficulty = selectedDifficulty === "All" || question.difficulty === selectedDifficulty;
      return matchesSearch && matchesSubject && matchesDifficulty;
    });
  }, [search, selectedSubject, selectedDifficulty]);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Question Bank</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-white">Curate, import & convert into quizzes</h1>
          <div className="flex gap-3">
            <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Import CSV</button>
            <button className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-900">Add Question</button>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`rounded-3xl border border-white/10 bg-gradient-to-br ${category.color} p-6 text-white shadow-xl`}
          >
            <p className="text-xs uppercase tracking-wide text-white/70">{category.name}</p>
            <p className="mt-4 text-4xl font-black">{category.total}</p>
            <p className="text-sm text-white/80">Questions curated</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            placeholder="Search by keyword, chapter, tag..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            value={selectedSubject}
            onChange={(event) => setSelectedSubject(event.target.value)}
          >
            <option value="All">All Subjects</option>
            {categories.map((category) => (
              <option key={category.name} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            value={selectedDifficulty}
            onChange={(event) => setSelectedDifficulty(event.target.value)}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="mt-6">
          <div className="hidden grid-cols-12 gap-3 px-4 text-xs uppercase tracking-wide text-white/50 md:grid">
            <span className="col-span-5">Question</span>
            <span className="col-span-2">Subject</span>
            <span className="col-span-2">Chapter</span>
            <span className="col-span-1">Type</span>
            <span className="col-span-1">Diff.</span>
            <span className="col-span-1 text-right">Select</span>
          </div>
          <div className="mt-2 space-y-3">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-white/80 md:grid-cols-12 md:items-center"
              >
                <p className="md:col-span-5">{question.prompt}</p>
                <p className="md:col-span-2">{question.subject}</p>
                <p className="md:col-span-2">{question.chapter}</p>
                <p className="md:col-span-1">{question.type}</p>
                <p className="md:col-span-1">{question.difficulty}</p>
                <div className="md:col-span-1 md:text-right">
                  <button className="rounded-2xl border border-white/20 px-3 py-1 text-xs text-white/80">Convert</button>
                </div>
              </div>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-6 text-center text-sm text-white/60">
                No questions match the filters.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

