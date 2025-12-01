"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { examsApi, papersApi, questionsApi } from "@/lib/admin";

export default function ExamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params?.examId as string;
  const [exam, setExam] = useState<any>(null);
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPaper, setEditingPaper] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    year: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    fetchData();
  }, [examId]);

  const fetchData = async () => {
    try {
      const [examData, papersData] = await Promise.all([
        examsApi.getById(examId),
        papersApi.getByExam(examId),
      ]);
      
      setExam(examData);
      
      // Fetch question counts for each paper if not included
      const papersWithCounts = await Promise.all(
        papersData.map(async (paper: any) => {
          try {
            // If questions_count is already included, use it
            if (paper.questions_count !== undefined && paper.questions_count !== null) {
              return paper;
            }
            // Otherwise, fetch questions to count them
            const questions = await questionsApi.getByPaper(paper.id);
            const count = questions?.length || 0;
            return {
              ...paper,
              questions_count: count,
            };
          } catch (error) {
            console.error(`Failed to fetch questions for paper ${paper.id}:`, error);
            return {
              ...paper,
              questions_count: 0,
            };
          }
        })
      );
      
      setPapers(papersWithCounts);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      alert("Failed to load exam data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPaper) {
        await papersApi.update(editingPaper.id, formData);
      } else {
        await papersApi.create(examId, formData);
      }
      setShowModal(false);
      setFormData({ title: "", year: new Date().getFullYear().toString() });
      setEditingPaper(null);
      fetchData();
    } catch (error) {
      console.error("Failed to save paper:", error);
      alert("Failed to save paper. Please try again.");
    }
  };

  const handleEdit = (paper: any) => {
    setEditingPaper(paper);
    setFormData({
      title: paper.title || "",
      year: paper.year?.toString() || new Date().getFullYear().toString(),
    });
    setShowModal(true);
  };

  const handleDelete = async (paperId: number) => {
    if (!confirm("Are you sure you want to delete this question paper?")) return;
    try {
      await papersApi.delete(paperId);
      fetchData();
    } catch (error) {
      console.error("Failed to delete paper:", error);
      alert("Failed to delete paper. Please try again.");
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
          <Link href="/admin/exams" className="text-primary hover:underline">
            ← Back to Exams
          </Link>
        </div>

        {/* Page Heading */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-light mb-2">
              {exam?.name} - Question Papers
            </h1>
            <p className="text-base text-text-light/70">
              Manage question papers for this exam
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Add Paper
          </button>
        </div>

        {/* Papers List */}
        {papers.length === 0 ? (
          <div className="bg-card-light p-12 rounded-xl border border-border-light text-center">
            <span className="material-symbols-outlined text-6xl text-text-light/30 mb-4">description</span>
            <p className="text-text-light/70 mb-4">No question papers yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Add First Paper
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <div
                key={paper.id}
                className="bg-card-light p-6 rounded-xl border border-border-light hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-light mb-1">{paper.title}</h3>
                    <p className="text-sm text-text-light/70">Year: {paper.year}</p>
                  </div>
                  <span className="material-symbols-outlined text-secondary text-2xl">description</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className={`font-medium ${
                    (paper.questions_count || 0) > 0 
                      ? 'text-secondary' 
                      : 'text-text-light/70'
                  }`}>
                    {paper.questions_count || 0} {paper.questions_count === 1 ? 'Question' : 'Questions'}
                  </span>
                  {paper.file_path && (
                    <span className="text-xs text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">description</span>
                      PDF Uploaded
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/papers/${paper.id}`}
                    className="flex-1 text-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    Manage Questions
                  </Link>
                  <button
                    onClick={() => handleEdit(paper)}
                    className="px-4 py-2 text-text-light/70 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(paper.id)}
                    className="px-4 py-2 text-text-light/70 hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card-light rounded-xl p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-light">
                  {editingPaper ? "Edit Question Paper" : "Create New Question Paper"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingPaper(null);
                    setFormData({ title: "", year: new Date().getFullYear().toString() });
                  }}
                  className="text-text-light/70 hover:text-text-light"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Paper Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Paper 1, Main Paper"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    min="2000"
                    max="2100"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingPaper(null);
                      setFormData({ title: "", year: new Date().getFullYear().toString() });
                    }}
                    className="flex-1 px-4 py-2 border border-border-light rounded-lg hover:bg-background-light transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {editingPaper ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

