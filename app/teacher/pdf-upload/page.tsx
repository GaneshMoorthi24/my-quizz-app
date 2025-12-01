"use client";

import { useEffect, useMemo, useState } from "react";

type ExtractionStatus = "idle" | "uploading" | "processing" | "review";

interface ParsedQuestion {
  id: number;
  prompt: string;
  answer?: string;
  type: "mcq" | "short";
  confidence: number;
}

export default function PdfToQuizPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ExtractionStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("English");
  const [parsedQuestions, setParsedQuestions] = useState<ParsedQuestion[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (status === "uploading" || status === "processing") {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (status === "uploading") {
              setStatus("processing");
              return 0;
            }
            if (status === "processing") {
              setStatus("review");
              setParsedQuestions(
                Array.from({ length: 8 }).map((_, idx) => ({
                  id: idx + 1,
                  prompt: `Extracted question ${idx + 1} from PDF page ${Math.ceil((idx + 2) / 2)}.`,
                  type: idx % 3 === 0 ? "short" : "mcq",
                  confidence: Math.round(70 + Math.random() * 25),
                }))
              );
            }
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [status]);

  const handleUpload = () => {
    if (!selectedFile) return;
    setStatus("uploading");
    setProgress(0);
  };

  const selectedQuestion = useMemo(
    () => parsedQuestions.find((question) => question.id === selectedQuestionId),
    [parsedQuestions, selectedQuestionId]
  );

  const handleApproveQuestion = (questionId: number) => {
    setParsedQuestions((prev) =>
      prev.map((question) => (question.id === questionId ? { ...question, confidence: 100 } : question))
    );
  };

  const handlePublishQuiz = () => {
    alert("Quiz generated from PDF! Connect backend to persist.");
  };

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Upload PDF → Auto Question</p>
        <h1 className="mt-3 text-3xl font-black text-white">Convert any paper to an editable quiz</h1>
        <p className="mt-2 max-w-3xl text-white/60">
          Drop past papers, notes, or study material. We handle OCR, AI clean-up, and convert everything into structured questions
          you can edit, tag, and publish instantly.
        </p>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-950/50 p-6 shadow-lg">
          <div>
            <label className="text-xs uppercase tracking-wide text-white/60">Upload PDF</label>
            <div className="mt-3 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-12 text-center">
              <span className="material-symbols-outlined text-4xl text-white/60">cloud_upload</span>
              <p className="mt-3 text-lg font-semibold text-white">{selectedFile ? selectedFile.name : "Drag & drop PDF"}</p>
              <p className="text-sm text-white/50">Max 50MB • Multi-language OCR • Auto chapter detection</p>
              <input
                type="file"
                accept="application/pdf"
                className="mt-4 text-sm"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
              />
              <select
                className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white"
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Marathi">Marathi</option>
                <option value="Tamil">Tamil</option>
              </select>
              <button
                className="mt-6 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-900 disabled:cursor-not-allowed disabled:bg-white/30"
                disabled={!selectedFile || status === "uploading" || status === "processing"}
                onClick={handleUpload}
              >
                {status === "uploading" || status === "processing" ? "Processing..." : "Start extraction"}
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-white/50">Status timeline</p>
            <ol className="mt-4 space-y-3 text-sm text-white/70">
              <li className={status !== "idle" ? "text-white" : ""}>Upload & OCR</li>
              <li className={status === "processing" || status === "review" ? "text-white" : ""}>AI Question Extraction</li>
              <li className={status === "review" ? "text-white" : ""}>Teacher Review & Publish</li>
            </ol>
            {(status === "uploading" || status === "processing") && (
              <div className="mt-4">
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-white/60">{progress}%</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">Extracted Questions</p>
              <h3 className="text-2xl font-bold text-white">{parsedQuestions.length || "--"} items detected</h3>
            </div>
            <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Import CSV</button>
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
            {status !== "review" && parsedQuestions.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 text-sm text-white/60">
                Upload a PDF to start seeing extracted questions.
              </div>
            )}
            {parsedQuestions.map((question) => (
              <button
                key={question.id}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-white/80 ${
                  selectedQuestionId === question.id
                    ? "border-white bg-slate-950/80"
                    : "border-white/10 bg-slate-950/40 hover:border-white/40"
                }`}
                onClick={() => setSelectedQuestionId(question.id)}
              >
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-white/40">
                  <span>{question.type === "mcq" ? "MCQ" : "Short Answer"}</span>
                  <span>{question.confidence}% confidence</span>
                </div>
                <p className="mt-2 text-sm text-white">{question.prompt}</p>
              </button>
            ))}
          </div>
          {selectedQuestion && (
            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
              <p className="text-xs uppercase tracking-wide text-white/50">Edit Question</p>
              <textarea
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white"
                value={selectedQuestion.prompt}
                onChange={(event) =>
                  setParsedQuestions((prev) =>
                    prev.map((question) =>
                      question.id === selectedQuestion.id ? { ...question, prompt: event.target.value } : question
                    )
                  )
                }
              />
              <button
                className="mt-3 rounded-2xl border border-white/20 px-4 py-2 text-xs font-semibold text-white/80"
                onClick={() => handleApproveQuestion(selectedQuestion.id)}
              >
                Mark as clean
              </button>
            </div>
          )}
        </div>
      </section>

      {status === "review" && (
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/50">Ready to publish</p>
              <h3 className="text-2xl font-bold text-white">Create quiz from extracted questions</h3>
            </div>
            <div className="flex gap-3">
              <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Export as DOCX</button>
              <button className="rounded-2xl bg-white px-6 py-3 text-sm font-bold text-slate-900" onClick={handlePublishQuiz}>
                Save as quiz
              </button>
            </div>
          </div>
          <p className="mt-3 text-sm text-white/70">
            Assign immediately, edit inside the manual builder, or push to question bank. Anti-duplicate checks enabled.
          </p>
        </section>
      )}
    </div>
  );
}

