"use client";

import { useState } from "react";

interface Group {
  id: number;
  name: string;
  students: number;
  recentQuiz: string;
  nextQuiz: string;
}

const initialGroups: Group[] = [
  { id: 1, name: "10th Grade • Section A", students: 42, recentQuiz: "Maths Weekly", nextQuiz: "Science Mock" },
  { id: 2, name: "XI Elite Batch", students: 36, recentQuiz: "Physics Test", nextQuiz: "Chemistry Drills" },
  { id: 3, name: "SSC CGL Aspirants", students: 58, recentQuiz: "Reasoning Sprint", nextQuiz: "GK Marathon" },
];

export default function StudentGroupsPage() {
  const [groups, setGroups] = useState(initialGroups);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", students: 0 });

  const handleCreateGroup = () => {
    if (!formData.name) return;
    setGroups((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: formData.name,
        students: formData.students || 0,
        recentQuiz: "—",
        nextQuiz: "—",
      },
    ]);
    setFormData({ name: "", students: 0 });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Student Groups</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-white">Organize classes, batches & cohorts</h1>
          <div className="flex gap-3">
            <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Upload Excel</button>
            <button className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-900" onClick={() => setIsModalOpen(true)}>
              Add Group
            </button>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {groups.map((group) => (
          <div key={group.id} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">{group.name}</h3>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">{group.students} students</span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-white/70">
              <p>
                <span className="text-white/40">Recent quiz:</span> {group.recentQuiz}
              </p>
              <p>
                <span className="text-white/40">Next quiz:</span> {group.nextQuiz}
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              <button className="flex-1 rounded-2xl border border-white/20 px-3 py-2 text-sm text-white/80">Manage</button>
              <button className="flex-1 rounded-2xl bg-white/10 px-3 py-2 text-sm text-white">Assign Quiz</button>
            </div>
          </div>
        ))}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Create Group</h3>
              <button className="text-white/60" onClick={() => setIsModalOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Group name</label>
                <input
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                  placeholder="10th Grade - Section B"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-white/50">Student count</label>
                <input
                  type="number"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                  value={formData.students}
                  onChange={(event) => setFormData({ ...formData, students: Number(event.target.value) })}
                />
              </div>
              <button className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-900" onClick={handleCreateGroup}>
                Save Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

