"use client";

import { useState } from "react";

const templates = [
  { id: 1, name: "Classic Laurel", description: "Elegant border with gold accents" },
  { id: 2, name: "Modern Minimal", description: "Clean typography-first template" },
  { id: 3, name: "School Pride", description: "Includes institution branding bar" },
];

export default function CertificatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Certificates</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-white">Auto-issue certificates on success</h1>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Export sample</button>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {templates.map((template) => (
          <button
            key={template.id}
            className={`rounded-3xl border p-6 text-left ${
              selectedTemplate.id === template.id ? "border-white bg-white text-slate-900 shadow-xl" : "border-white/10 bg-slate-950/40 text-white"
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            <p className="text-sm uppercase tracking-wide opacity-60">Template</p>
            <h3 className="mt-2 text-2xl font-bold">{template.name}</h3>
            <p className="text-sm opacity-70">{template.description}</p>
          </button>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Preview</p>
            <h3 className="text-2xl font-bold text-white">{selectedTemplate.name}</h3>
          </div>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Edit fields</button>
        </div>
        <div className="mt-6 rounded-3xl border border-dashed border-white/20 bg-slate-900/60 p-10 text-center text-white/70">
          <p className="text-xs uppercase tracking-[0.4em]">Certificate of Achievement</p>
          <h2 className="mt-4 text-4xl font-black text-white">QuizPlatform Academy</h2>
          <p className="mt-6 text-lg">This certifies that</p>
          <p className="mt-2 text-3xl font-bold text-white">Student Name</p>
          <p className="mt-4 text-sm text-white/60">has successfully cleared</p>
          <p className="mt-1 text-xl font-semibold text-white">Physics • Electromagnetic Induction Quiz</p>
          <div className="mt-10 flex items-center justify-between text-sm text-white/60">
            <div>
              <p>Teacher Signature</p>
              <p className="text-xs">QuizPlatform Educator</p>
            </div>
            <div>
              <p>Date</p>
              <p className="text-xs">26 Nov 2025</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

