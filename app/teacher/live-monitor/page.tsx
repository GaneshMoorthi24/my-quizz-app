"use client";

import { useEffect, useState } from "react";

interface Participant {
  id: number;
  name: string;
  status: "In Progress" | "Not Started" | "Completed";
  progress: number;
  suspicious: boolean;
}

const initialParticipants: Participant[] = Array.from({ length: 12 }).map((_, index) => ({
  id: index + 1,
  name: `Student ${index + 1}`,
  status: index < 6 ? "In Progress" : index < 9 ? "Not Started" : "Completed",
  progress: index < 6 ? 40 + index * 5 : index >= 9 ? 100 : 0,
  suspicious: index % 5 === 0,
}));

export default function LiveMonitoringPage() {
  const [participants, setParticipants] = useState(initialParticipants);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticipants((prev) =>
        prev.map((participant) => {
          if (participant.status !== "In Progress") return participant;
          const newProgress = Math.min(100, participant.progress + Math.random() * 5);
          return { ...participant, progress: newProgress, status: newProgress >= 100 ? "Completed" : participant.status };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const totals = {
    online: participants.filter((participant) => participant.status === "In Progress").length,
    notStarted: participants.filter((participant) => participant.status === "Not Started").length,
    completed: participants.filter((participant) => participant.status === "Completed").length,
    alerts: participants.filter((participant) => participant.suspicious).length,
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Live Monitoring</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-white">Track attempts in real-time</h1>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Export Report</button>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Students online", value: totals.online, icon: "monitoring" },
          { label: "Not started", value: totals.notStarted, icon: "hourglass" },
          { label: "Completed", value: totals.completed, icon: "check_circle" },
          { label: "Suspicious alerts", value: totals.alerts, icon: "report" },
        ].map((card) => (
          <div key={card.label} className="rounded-3xl border border-white/10 bg-slate-950/40 p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-white/50">{card.label}</p>
              <span className="material-symbols-outlined text-white/70">{card.icon}</span>
            </div>
            <p className="mt-4 text-3xl font-black text-white">{card.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Physics Chapter 5 Quiz</p>
            <h3 className="text-2xl font-bold text-white">Live attempt feed</h3>
          </div>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Refresh data</button>
        </div>
        <div className="mt-6 space-y-3">
          {participants.map((participant) => (
            <div key={participant.id} className="rounded-2xl border border-white/10 bg-slate-950/30 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-white font-semibold">{participant.name}</p>
                  <p className="text-xs uppercase tracking-wide text-white/50">{participant.status}</p>
                </div>
                {participant.suspicious && (
                  <span className="rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-200">Suspicious</span>
                )}
                <p className="text-sm text-white/70">{Math.round(participant.progress)}% complete</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${
                    participant.suspicious ? "bg-gradient-to-r from-rose-500 to-amber-500" : "bg-gradient-to-r from-blue-500 to-indigo-500"
                  }`}
                  style={{ width: `${participant.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

