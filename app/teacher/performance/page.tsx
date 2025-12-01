"use client";

const students = [
  { name: "Aarav Patel", strength: "Mechanics", weakness: "Optics", trend: [82, 84, 88, 91, 94, 96] },
  { name: "Diya Sharma", strength: "Organic Chemistry", weakness: "Physical Chemistry", trend: [74, 79, 82, 86, 88, 90] },
  { name: "Rohan Singh", strength: "Algebra", weakness: "Geometry", trend: [60, 63, 66, 69, 72, 74] },
];

const topics = [
  { topic: "Electrostatics", accuracy: 54 },
  { topic: "Magnetism", accuracy: 68 },
  { topic: "Optics", accuracy: 72 },
  { topic: "Modern Physics", accuracy: 81 },
];

export default function PerformanceAnalyticsPage() {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Student Performance</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-white">Spot strengths, fix weak areas</h1>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Share insights</button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {students.map((student) => (
          <div key={student.name} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 shadow-lg">
            <p className="text-white font-semibold">{student.name}</p>
            <p className="text-xs uppercase tracking-wide text-white/50">Trend (last 6 quizzes)</p>
            <div className="mt-3 flex items-end gap-2">
              {student.trend.map((value, index) => (
                <div
                  key={`${student.name}-bar-${index}`}
                  className="w-7 rounded-t-full bg-gradient-to-t from-blue-500 to-indigo-500"
                  style={{ height: `${value / 1.2}%` }}
                />
              ))}
            </div>
            <div className="mt-4 grid gap-3 text-sm text-white/80">
              <p>
                <span className="text-white/50">Strength:</span> {student.strength}
              </p>
              <p>
                <span className="text-white/50">Weakness:</span> {student.weakness}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Topic mastery</p>
            <h3 className="text-2xl font-bold text-white">Chapter-wise strengths & gaps</h3>
          </div>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Download plan</button>
        </div>
        <div className="mt-6 space-y-4">
          {topics.map((topic) => (
            <div key={topic.topic} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <div className="flex items-center justify-between">
                <p className="text-white font-semibold">{topic.topic}</p>
                <p className="text-white text-sm">{topic.accuracy}%</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-500" style={{ width: `${topic.accuracy}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

