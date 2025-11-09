"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { papersApi, questionsApi } from "@/lib/admin";  

export default function PaperDetailPage() {
  const params = useParams();
  const paperId = params?.paperId as string;
  const [paper, setPaper] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [paperId]);

  const fetchData = async () => {
    try {
      const [paperData, questionsData] = await Promise.all([
        papersApi.getById(paperId),
        questionsApi.getByPaper(paperId),
      ]);
      setPaper(paperData);
      setQuestions(questionsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      await questionsApi.delete(questionId);
      fetchData();
    } catch (error) {
      console.error("Failed to delete question:", error);
      alert("Failed to delete question. Please try again.");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-text-light/70">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link href={`/admin/exams/${paper?.exam_id}`} className="text-primary hover:underline">
            ← Back to Exam
          </Link>
        </div>

        {/* Page Heading */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-light mb-2">
              {paper?.title} - Questions
            </h1>
            <p className="text-base text-text-light/70">
              Year: {paper?.year} | {questions.length} Questions
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/admin/papers/${paperId}/upload`}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
            >
              <span className="material-symbols-outlined">upload_file</span>
              Upload PDF
            </Link>
            <Link
              href={`/admin/questions/new?paperId=${paperId}`}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              Add Question
            </Link>
          </div>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="bg-card-light p-12 rounded-xl border border-border-light text-center">
            <span className="material-symbols-outlined text-6xl text-text-light/30 mb-4">quiz</span>
            <p className="text-text-light/70 mb-4">No questions yet</p>
            <div className="flex gap-2 justify-center">
              <Link
                href={`/admin/papers/${paperId}/upload`}
                className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Upload PDF
              </Link>
              <Link
                href={`/admin/questions/new?paperId=${paperId}`}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Manually
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-card-light p-6 rounded-xl border border-border-light"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-primary">Q{index + 1}</span>
                      {question.difficulty && (
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                          {question.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-text-light mb-4">{question.question_text}</p>
                    {question.options && (
                      <div className="space-y-2 mb-4">
                        {Object.entries(question.options).map(([key, value]: [string, any]) => (
                          <div
                            key={key}
                            className={`flex items-center gap-2 p-2 rounded ${
                              question.correct_answer === key
                                ? 'bg-secondary/10 border border-secondary'
                                : 'bg-background-light'
                            }`}
                          >
                            <span className="font-medium text-text-light">{key}.</span>
                            <span className="text-text-light">{value}</span>
                            {question.correct_answer === key && (
                              <span className="ml-auto material-symbols-outlined text-secondary text-sm">
                                check_circle
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {question.explanation && (
                      <div className="mt-4 p-3 bg-background-light rounded">
                        <p className="text-sm font-medium text-text-light mb-1">Explanation:</p>
                        <p className="text-sm text-text-light/70">{question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/questions/${question.id}`}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="px-4 py-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

