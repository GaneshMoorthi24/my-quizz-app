"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { questionsApi } from "@/lib/admin";

export default function ManageQuestionsPage() {
  const params = useParams();
  const paperId = params?.paperId as string;
  const [questions, setQuestions] = useState<any[]>([]);
  const [paper, setPaper] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paperId) return;
    fetchQuestions();
  }, [paperId]);

  async function fetchQuestions() {
    setLoading(true);
    try {
      const data = await questionsApi.getByPaper(paperId);
      setPaper(data.paper || null);
      setQuestions(data.questions || []);
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Questions</h1>
        <p className="text-sm text-gray-500 mb-6">
          Paper: {paper?.title ?? `#${paperId}`} — Year: {paper?.year ?? "N/A"}
        </p>

        {loading ? (
          <p className="text-gray-500">Loading questions...</p>
        ) : questions.length === 0 ? (
          <div className="p-6 bg-white rounded shadow">
            <p className="text-gray-600 mb-2">No questions found for this paper.</p>
            <p className="text-sm text-gray-400">You can upload a PDF and parse it or add questions manually.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={q.id} className="bg-white p-4 rounded shadow">
                <div className="text-sm text-gray-500 mb-1">Q#{i + 1} • Type: {q.type}</div>
                <div className="text-base text-gray-800 font-medium mb-2">{q.question_text}</div>

                {/* If options stored as JSON object/array */}
                {q.options && (
                  <ul className="list-disc pl-5 text-sm text-gray-700">
                    {Array.isArray(q.options)
                      ? q.options.map((opt: string, idx: number) => <li key={idx}>{opt}</li>)
                      : Object.entries(q.options).map(([k, v]) => <li key={k}><strong>{k}.</strong> {v}</li>)
                    }
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
