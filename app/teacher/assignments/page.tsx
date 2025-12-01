"use client";

import { useState } from "react";

const groups = ["All Students", "XI Elite Batch", "10th Grade Section A", "SSC CGL Aspirants"];
const quizzes = ["Physics Weekly Quiz", "Maths Challenge", "Current Affairs Sprint"];

export default function AssignQuizPage() {
  const [selectedQuiz, setSelectedQuiz] = useState(quizzes[0]);
  const [target, setTarget] = useState("All Students");
  const [startTime, setStartTime] = useState("2025-11-28T09:00");
  const [endTime, setEndTime] = useState("2025-11-28T10:00");
  const [attemptLimit, setAttemptLimit] = useState(1);
  const [shuffle, setShuffle] = useState(true);
  const [antiCheat, setAntiCheat] = useState(true);
  const [passingScore, setPassingScore] = useState(60);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Assign Quiz</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-white">Schedule quizzes for students & groups</h1>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">History</button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-lg lg:col-span-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-white/50">Select quiz</label>
            <select
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              value={selectedQuiz}
              onChange={(event) => setSelectedQuiz(event.target.value)}
            >
              {quizzes.map((quiz) => (
                <option key={quiz} value={quiz}>
                  {quiz}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-white/50">Assign to</label>
            <div className="mt-2 grid gap-3 md:grid-cols-2">
              {groups.map((group) => (
                <button
                  key={group}
                  className={`rounded-2xl border px-4 py-3 text-left ${
                    target === group ? "border-white bg-white text-slate-900" : "border-white/10 bg-white/5 text-white/70"
                  }`}
                  onClick={() => setTarget(group)}
                >
                  <p className="text-sm font-semibold">{group}</p>
                  <p className="text-xs text-white/50">Tap to select</p>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50">Start time</label>
              <input
                type="datetime-local"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50">End time</label>
              <input
                type="datetime-local"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50">Attempt limit</label>
              <input
                type="number"
                min={1}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                value={attemptLimit}
                onChange={(event) => setAttemptLimit(Number(event.target.value))}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-white/50">Passing score (%)</label>
              <input
                type="number"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
                value={passingScore}
                onChange={(event) => setPassingScore(Number(event.target.value))}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              Shuffle questions
              <input type="checkbox" checked={shuffle} onChange={(event) => setShuffle(event.target.checked)} />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              Anti-cheat mode
              <input type="checkbox" checked={antiCheat} onChange={(event) => setAntiCheat(event.target.checked)} />
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button className="rounded-2xl border border-white/20 px-5 py-3 text-sm text-white/80">Save Draft</button>
            <button className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900">Schedule Quiz</button>
          </div>
        </div>
        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Timeline preview</p>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <p>✓ Announcement sent immediately</p>
              <p>✓ Reminder 30 minutes before start</p>
              <p>✓ Live monitoring opens at start time</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Delivery channels</p>
            <ul className="mt-3 space-y-2 text-sm text-white/80">
              <li>• In-app notification</li>
              <li>• Email summary to parents</li>
              <li>• WhatsApp broadcast (premium)</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
            <p className="text-xs uppercase tracking-wide text-white/50">Safety</p>
            <p className="mt-2 text-sm text-white/80">
              Anti-cheat monitors tab switches, suspicious shortcuts, and screen exits. Alerts appear inside live monitoring.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

