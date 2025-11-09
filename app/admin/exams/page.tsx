"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { examsApi } from "@/lib/admin";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('action') === 'create') {
      setShowModal(true);
    }
    fetchExams();
  }, [searchParams]);

  const fetchExams = async () => {
    try {
      const data = await examsApi.getAll();
      setExams(data);
    } catch (error) {
      console.error("Failed to fetch exams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExam) {
        await examsApi.update(editingExam.id, formData);
      } else {
        await examsApi.create(formData);
      }
      setShowModal(false);
      setFormData({ name: "", code: "", description: "" });
      setEditingExam(null);
      fetchExams();
    } catch (error) {
      console.error("Failed to save exam:", error);
      alert("Failed to save exam. Please try again.");
    }
  };

  const handleEdit = (exam: any) => {
    setEditingExam(exam);
    setFormData({
      name: exam.name || "",
      code: exam.code || "",
      description: exam.description || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (examId: number) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    try {
      await examsApi.delete(examId);
      fetchExams();
    } catch (error) {
      console.error("Failed to delete exam:", error);
      alert("Failed to delete exam. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExam(null);
    setFormData({ name: "", code: "", description: "" });
    router.replace('/admin/exams');
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-text-light mb-2">
              Exams Management
            </h1>
            <p className="text-base text-text-light/70">
              Create and manage exams (LDC, UDC, etc.)
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Create Exam
          </button>
        </div>

        {/* Exams List */}
        {loading ? (
          <div className="text-text-light/70">Loading...</div>
        ) : exams.length === 0 ? (
          <div className="bg-card-light p-12 rounded-xl border border-border-light text-center">
            <span className="material-symbols-outlined text-6xl text-text-light/30 mb-4">school</span>
            <p className="text-text-light/70 mb-4">No exams yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create First Exam
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="bg-card-light p-6 rounded-xl border border-border-light hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-text-light mb-1">{exam.name}</h3>
                    <p className="text-sm text-text-light/70">{exam.code}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary text-2xl">school</span>
                </div>
                {exam.description && (
                  <p className="text-sm text-text-light/70 mb-4">{exam.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-text-light/70 mb-4">
                  <span>{exam.papers_count || 0} Papers</span>
                  <span>{exam.questions_count || 0} Questions</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/admin/exams/${exam.id}`}
                    className="flex-1 text-center px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    View Papers
                  </Link>
                  <button
                    onClick={() => handleEdit(exam)}
                    className="px-4 py-2 text-text-light/70 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
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
                  {editingExam ? "Edit Exam" : "Create New Exam"}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-text-light/70 hover:text-text-light"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Exam Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., LDC, UDC"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Exam Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., LDC-2024"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                    placeholder="Optional description"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-border-light rounded-lg hover:bg-background-light transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {editingExam ? "Update" : "Create"}
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

