"use client";

const overviewCards = [
  { label: "Average Score", value: "78%", detail: "↑ 6% vs last quiz" },
  { label: "Top Performer", value: "Aarav Patel", detail: "96% score" },
  { label: "Weak Topic", value: "Electrostatics", detail: "54% accuracy" },
  { label: "Attempts", value: "42 / 48", detail: "87% participation" },
];

const studentResults = [
  { name: "Aarav Patel", score: 96, accuracy: 94, time: "32m", status: "Excellent" },
  { name: "Diya Sharma", score: 88, accuracy: 86, time: "38m", status: "Great" },
  { name: "Rohan Singh", score: 72, accuracy: 70, time: "41m", status: "Average" },
  { name: "Sarah Khan", score: 64, accuracy: 60, time: "45m", status: "Needs Support" },
];

const questionAnalysis = [
  { id: 1, topic: "Lenz Law", accuracy: 92, time: "48s", difficulty: "Medium" },
  { id: 2, topic: "Faraday Law", accuracy: 81, time: "54s", difficulty: "Hard" },
  { id: 3, topic: "Transformers", accuracy: 65, time: "61s", difficulty: "Medium" },
  { id: 4, topic: "Generators", accuracy: 52, time: "75s", difficulty: "Hard" },
];

export default function QuizResultsPage() {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Quiz Results & Analytics</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-white">Physics • Electromagnetic Induction</h1>
          <div className="flex gap-3">
            <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Download PDF</button>
            <button className="rounded-2xl bg-white px-4 py-2 text-sm font-bold text-slate-900">Export Excel</button>
          </div>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card) => (
          <div key={card.label} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 shadow-lg">
            <p className="text-xs uppercase tracking-wide text-white/60">{card.label}</p>
            <p className="mt-4 text-3xl font-black text-white">{card.value}</p>
            <p className="text-xs text-emerald-300/80">{card.detail}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Student-wise results</p>
            <h3 className="text-2xl font-bold text-white">Top performers & improvement areas</h3>
          </div>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Send summaries</button>
        </div>
        <div className="mt-6 space-y-4">
          {studentResults.map((student) => (
            <div key={student.name} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/80">
                <p className="text-white font-semibold">{student.name}</p>
                <p>Score: <span className="font-bold">{student.score}%</span></p>
                <p>Accuracy: {student.accuracy}%</p>
                <p>Time: {student.time}</p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">{student.status}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Question-wise analysis</p>
            <h3 className="text-2xl font-bold text-white">Identify weak topics instantly</h3>
          </div>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Drill-down view</button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {questionAnalysis.map((question) => (
            <div key={question.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">Q{question.id}: {question.topic}</p>
                <span className="text-xs uppercase tracking-wide text-white/50">{question.difficulty}</span>
              </div>
              <div className="mt-3 text-sm text-white/70">
                <p>Accuracy: {question.accuracy}%</p>
                <p>Avg time: {question.time}</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style={{ width: `${question.accuracy}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

