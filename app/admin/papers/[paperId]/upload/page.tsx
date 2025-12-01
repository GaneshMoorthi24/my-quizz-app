"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { papersApi, uploadApi } from "@/lib/admin";

export default function PaperUploadPage() {
  const params = useParams();
  const paperId = params?.paperId as string;
  const [paper, setPaper] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [language, setLanguage] = useState<'english' | 'tamil'>('english');

  useEffect(() => {
    fetchPaper();
  }, [paperId]);

  const fetchPaper = async () => {
    try {
      const data = await papersApi.getById(paperId);
      setPaper(data);
    } catch (error) {
      console.error("Failed to fetch paper:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadApi.uploadPDF(paperId, file, paper?.year, paper?.title);
      setUploadId(result.upload_id);
      // Automatically start parsing
      handleParse(result.upload_id);
    } catch (error) {
      console.error("Failed to upload PDF:", error);
      alert("Failed to upload PDF. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleParse = async (id?: string) => {
    const parseId = id || uploadId;
    if (!parseId) return;

    setParsing(true);
    try {
      const result = await uploadApi.parsePDF(paperId, parseId, language);
      
      // Extract questions from parsePDF response first
      let questions: any[] = [];
      
      // Check multiple possible response formats
      if (result.parsed_questions && Array.isArray(result.parsed_questions)) {
        questions = result.parsed_questions;
      } else if (result.parsed_data && Array.isArray(result.parsed_data)) {
        questions = result.parsed_data;
      } else if (result.questions && Array.isArray(result.questions)) {
        questions = result.questions;
      } else if (Array.isArray(result)) {
        questions = result;
      }
      
      // If no questions in parsePDF response, try fetching from getParsedQuestions
      if (questions.length === 0) {
        const response = await uploadApi.getParsedQuestions(paperId, parseId);
        
        // Handle different response formats from getParsedQuestions
        if (Array.isArray(response)) {
          questions = response;
        } else if (response && Array.isArray(response.parsed_data)) {
          questions = response.parsed_data;
        } else if (response && Array.isArray(response.questions)) {
          questions = response.questions;
        } else if (response && typeof response === 'object') {
          questions = [];
        }
      }
      
      // Ensure questions is always an array
      if (!Array.isArray(questions)) {
        questions = [];
      }
      
      // If no questions parsed, show message and allow manual entry
      if (questions.length === 0) {
        alert("PDF parsing completed but no questions were extracted. You can manually add questions below.");
        // Initialize with one empty question for manual entry
        setParsedQuestions([{
          question_text: "",
          options: { A: "", B: "", C: "", D: "" },
          correct_answer: "",
          explanation: "",
        }]);
      } else {
        setParsedQuestions(questions);
      }
      setReviewing(true);
    } catch (error: any) {
      console.error("Failed to parse PDF:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "Unknown error";
      console.error("Error details:", errorMessage);
      alert(`Failed to parse PDF: ${errorMessage}. You can still manually add questions.`);
      // Allow manual entry even if parsing fails
      setParsedQuestions([{
        question_text: "",
        options: { A: "", B: "", C: "", D: "" },
        correct_answer: "",
        explanation: "",
      }]);
      setReviewing(true);
    } finally {
      setParsing(false);
    }
  };

  const handleQuestionEdit = (index: number, field: string, value: any) => {
    if (!Array.isArray(parsedQuestions)) return;
    const updated = [...parsedQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setParsedQuestions(updated);
  };

  const handleOptionEdit = (questionIndex: number, optionKey: string, value: string) => {
    if (!Array.isArray(parsedQuestions)) return;
    const updated = [...parsedQuestions];
    updated[questionIndex].options = {
      ...updated[questionIndex].options,
      [optionKey]: value,
    };
    setParsedQuestions(updated);
  };

  const handleSave = async () => {
    if (!uploadId) return;
    
    // Ensure parsedQuestions is an array
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      alert("Please add at least one question before saving.");
      return;
    }

    setSaving(true);
    try {
      await uploadApi.saveParsedQuestions(paperId, uploadId, parsedQuestions);
      alert("Questions saved successfully!");
      window.location.href = `/admin/papers/${paperId}`;
    } catch (error) {
      console.error("Failed to save questions:", error);
      alert("Failed to save questions. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Link href={`/admin/papers/${paperId}`} className="text-primary hover:underline">
            ← Back to Paper
          </Link>
        </div>

        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-light mb-2">
            Upload PDF - {paper?.title}
          </h1>
          <p className="text-base text-text-light/70">
            Upload and parse question paper PDF
          </p>
        </div>

        {!reviewing ? (
          /* Upload Section */
          <div className="bg-card-light p-8 rounded-xl border border-border-light">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-text-light mb-2">
                  Select PDF File
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {file && (
                  <p className="mt-2 text-sm text-text-light/70">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text-light mb-2">
                  Extract Language
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="english"
                      checked={language === 'english'}
                      onChange={(e) => setLanguage(e.target.value as 'english' | 'tamil')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-text-light">English</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="language"
                      value="tamil"
                      checked={language === 'tamil'}
                      onChange={(e) => setLanguage(e.target.value as 'english' | 'tamil')}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <span className="text-text-light">Tamil (தமிழ்)</span>
                  </label>
                </div>
                <p className="mt-2 text-xs text-text-light/70">
                  Select which language to extract from bilingual PDFs
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading || parsing}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? "Uploading..." : parsing ? "Parsing..." : "Upload & Parse"}
                </button>
              </div>

              {uploading && (
                <div className="mt-4 p-4 bg-background-light rounded-lg">
                  <p className="text-sm text-text-light/70">Uploading PDF...</p>
                </div>
              )}

              {parsing && (
                <div className="mt-4 p-4 bg-background-light rounded-lg">
                  <p className="text-sm text-text-light/70">Parsing questions from PDF...</p>
                  <p className="text-xs text-text-light/50 mt-1">This may take a few minutes</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Review Section */
          <div className="space-y-6">
            <div className="bg-card-light p-6 rounded-xl border border-border-light">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-light">
                  Review Parsed Questions ({Array.isArray(parsedQuestions) ? parsedQuestions.length : 0})
                </h2>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save All Questions"}
                </button>
              </div>
              <p className="text-sm text-text-light/70">
                Review and correct the parsed questions before saving. If no questions were parsed, you can add them manually.
              </p>
              <button
                onClick={() => {
                  const current = Array.isArray(parsedQuestions) ? parsedQuestions : [];
                  setParsedQuestions([
                    ...current,
                    {
                      question_text: "",
                      options: { A: "", B: "", C: "", D: "" },
                      correct_answer: "",
                      explanation: "",
                    }
                  ]);
                }}
                className="mt-2 px-3 py-1 text-sm bg-secondary/10 text-secondary rounded hover:bg-secondary/20 transition-colors"
              >
                + Add Another Question
              </button>
            </div>

            {!Array.isArray(parsedQuestions) || parsedQuestions.length === 0 ? (
              <div className="bg-card-light p-6 rounded-xl border border-border-light text-center">
                <p className="text-text-light/70 mb-4">No questions to review. Add questions manually below.</p>
                <button
                  onClick={() => {
                    setParsedQuestions([{
                      question_text: "",
                      options: { A: "", B: "", C: "", D: "" },
                      correct_answer: "",
                      explanation: "",
                    }]);
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Question
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(parsedQuestions) && parsedQuestions.map((question, index) => (
                <div
                  key={index}
                  className="bg-card-light p-6 rounded-xl border border-border-light"
                >
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-light mb-2">
                      Question {index + 1}
                    </label>
                    <textarea
                      value={question.question_text || ""}
                      onChange={(e) => handleQuestionEdit(index, "question_text", e.target.value)}
                      className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-light mb-2">
                      Options
                    </label>
                    <div className="space-y-2">
                      {question.options &&
                        Object.entries(question.options).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex gap-2">
                            <span className="w-8 text-text-light font-medium">{key}.</span>
                            <input
                              type="text"
                              value={value || ""}
                              onChange={(e) => handleOptionEdit(index, key, e.target.value)}
                              className="flex-1 px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-light mb-2">
                      Correct Answer
                    </label>
                    <select
                      value={question.correct_answer || ""}
                      onChange={(e) => handleQuestionEdit(index, "correct_answer", e.target.value)}
                      className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select answer</option>
                      {question.options &&
                        Object.keys(question.options).map((key) => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-light mb-2">
                      Explanation (Optional)
                    </label>
                    <textarea
                      value={question.explanation || ""}
                      onChange={(e) => handleQuestionEdit(index, "explanation", e.target.value)}
                      className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={2}
                      placeholder="Add explanation for the correct answer..."
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!Array.isArray(parsedQuestions)) return;
                      const updated = parsedQuestions.filter((_, i) => i !== index);
                      setParsedQuestions(updated);
                    }}
                    className="text-error hover:text-error/80 text-sm"
                  >
                    Remove Question
                  </button>
                </div>
              ))}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReviewing(false)}
                className="px-4 py-2 border border-border-light rounded-lg hover:bg-background-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save All Questions"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

