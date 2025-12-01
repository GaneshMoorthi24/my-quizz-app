"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { questionsApi, papersApi } from "@/lib/admin";
import { generateQuestionAnswer } from "@/lib/api";

export default function QuestionEditPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const questionId = params?.questionId as string;
  const rawPaperId = searchParams?.get('paperId');
  // Clean paperId - convert "null" string to null, and filter out invalid values
  const paperId = rawPaperId && rawPaperId !== 'null' && rawPaperId !== 'undefined' ? rawPaperId : null;
  const isNew = questionId === 'new';
  
  const [paper, setPaper] = useState<any>(null);
  const [formData, setFormData] = useState({
    question_text: "",
    options: { A: "", B: "", C: "", D: "" },
    correct_answer: "",
    explanation: "",
    difficulty: "medium",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  useEffect(() => {
    if (paperId) {
      fetchPaper();
    }
    if (!isNew) {
      fetchQuestion();
    } else {
      setLoading(false);
    }
  }, [questionId, paperId]);

  const fetchPaper = async () => {
    if (!paperId || paperId === 'null' || paperId === 'undefined') return;
    try {
      const data = await papersApi.getById(paperId);
      setPaper(data);
    } catch (error) {
      console.error("Failed to fetch paper:", error);
      // Don't set paper if fetch fails
    }
  };

  const fetchQuestion = async () => {
    try {
      const data = await questionsApi.getById(questionId);
      setFormData({
        question_text: data.question_text || "",
        options: data.options || { A: "", B: "", C: "", D: "" },
        correct_answer: data.correct_answer || "",
        explanation: data.explanation || "",
        difficulty: data.difficulty || "medium",
      });
      if (data.paper_id) {
        const paperData = await papersApi.getById(data.paper_id);
        setPaper(paperData);
      }
    } catch (error) {
      console.error("Failed to fetch question:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      options: {
        ...formData.options,
        [key]: value,
      },
    });
  };

  const handleAnswerChange = async (value: string) => {
    // If "Not sure - Let AI determine" is selected (empty value) and it's an existing question
    if (value === "" && !isNew && questionId !== 'new') {
      // Check if we have question text and at least one option
      if (!formData.question_text || !Object.values(formData.options).some(opt => opt.trim() !== "")) {
        alert("Please enter the question text and at least one option before generating the answer.");
        return;
      }
      
      setGeneratingAnswer(true);
      try {
        // Generate answer using AI for existing question
        const result = await generateQuestionAnswer(questionId);
        
        // Update form with generated answer
        setFormData(prev => ({
          ...prev,
          correct_answer: result.correct_answer
        }));
      } catch (error) {
        console.error("Failed to generate answer:", error);
        alert("Failed to generate answer. The answer will be generated automatically when you save.");
      } finally {
        setGeneratingAnswer(false);
      }
    } else {
      // Normal selection or new question - just update the value
      // For new questions, backend will generate answer on save if empty
      setFormData({ ...formData, correct_answer: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question_text) {
      alert("Please enter the question text");
      return;
    }

    // Validate paperId for new questions
    if (isNew) {
      // Clean paperId - remove 'null' or 'undefined' strings
      let validPaperId = paperId;
      if (!validPaperId || validPaperId === 'null' || validPaperId === 'undefined') {
        validPaperId = paper?.id;
      }
      
      if (!validPaperId) {
        alert("Error: Paper ID is missing. Please go back to the paper page and try creating the question again.");
        return;
      }

      setSaving(true);
      try {
        // Ensure paperId is a valid number/string
        const paperIdToSend = String(validPaperId);
        if (!paperIdToSend || paperIdToSend === 'null' || paperIdToSend === 'undefined' || isNaN(Number(paperIdToSend))) {
          throw new Error('Invalid paper ID. Please go back to the paper page and try again.');
        }
        await questionsApi.create(paperIdToSend, formData);
        router.push(`/admin/papers/${validPaperId}`);
      } catch (error: any) {
        console.error("Failed to save question:", error);
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to save question. Please try again.";
        alert(errorMessage);
      } finally {
        setSaving(false);
      }
    } else {
      // Update existing question
      setSaving(true);
      try {
        await questionsApi.update(questionId, formData);
        router.push(`/admin/papers/${paper?.id || paperId}`);
      } catch (error: any) {
        console.error("Failed to save question:", error);
        const errorMessage = error?.response?.data?.message || error?.message || "Failed to save question. Please try again.";
        alert(errorMessage);
      } finally {
        setSaving(false);
      }
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
      <div className="mx-auto max-w-4xl">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link
            href={paper ? `/admin/papers/${paper.id}` : '/admin/exams'}
            className="text-primary hover:underline"
          >
            ← Back to {paper ? 'Paper' : 'Exams'}
          </Link>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-light mb-2">
            {isNew ? "Create New Question" : "Edit Question"}
          </h1>
          {paper && (
            <p className="text-base text-text-light/70">
              Paper: {paper.title} ({paper.year})
            </p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-card-light p-6 rounded-xl border border-border-light">
          <div className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">
                Question Text *
              </label>
              <textarea
                required
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={4}
                placeholder="Enter the question..."
              />
            </div>

            {/* Options */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">
                Options *
              </label>
              <div className="space-y-2">
                {Object.entries(formData.options).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="w-8 text-text-light font-medium">{key}.</span>
                    <input
                      type="text"
                      required
                      value={value}
                      onChange={(e) => handleOptionChange(key, e.target.value)}
                      className="flex-1 px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={`Option ${key}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Correct Answer */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">
                Correct Answer (Optional - AI can generate if left blank)
              </label>
              <select
                value={formData.correct_answer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                disabled={generatingAnswer}
                className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Not sure - Let AI determine</option>
                {Object.keys(formData.options).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
              {generatingAnswer && (
                <p className="mt-1 text-xs text-primary flex items-center gap-1">
                  <span className="animate-spin">⏳</span>
                  AI is determining the correct answer...
                </p>
              )}
              {!generatingAnswer && formData.correct_answer && (
                <p className="mt-1 text-xs text-success">
                  ✓ Answer set: {formData.correct_answer}
                </p>
              )}
              {!generatingAnswer && !formData.correct_answer && (
                <p className="mt-1 text-xs text-text-light/70">
                  {isNew 
                    ? "Leave blank and AI will generate the answer automatically when you save."
                    : "Select \"Not sure - Let AI determine\" to generate the answer, or choose an option manually."}
                </p>
              )}
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">
                Difficulty
              </label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Explanation */}
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">
                Explanation (Optional)
              </label>
              <textarea
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
                placeholder="Explain why this is the correct answer..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Link
                href={paper ? `/admin/papers/${paper.id}` : '/admin/exams'}
                className="flex-1 text-center px-4 py-2 border border-border-light rounded-lg hover:bg-background-light transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : isNew ? "Create Question" : "Update Question"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

