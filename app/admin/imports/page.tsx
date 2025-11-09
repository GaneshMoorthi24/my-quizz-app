"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminLayout from "@/components/AdminLayout";
import { importsApi } from "@/lib/admin";

export default function ImportsPage() {
  const [imports, setImports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImport, setSelectedImport] = useState<any>(null);

  useEffect(() => {
    fetchImports();
  }, []);

  const fetchImports = async () => {
    try {
      const data = await importsApi.getAll();
      setImports(data);
    } catch (error) {
      console.error("Failed to fetch imports:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'saved':
        return 'bg-secondary/10 text-secondary border-secondary';
      case 'failed':
      case 'error':
        return 'bg-error/10 text-error border-error';
      case 'parsing':
      case 'processing':
        return 'bg-primary/10 text-primary border-primary';
      default:
        return 'bg-background-light text-text-light/70 border-border-light';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'saved':
        return 'check_circle';
      case 'failed':
      case 'error':
        return 'error';
      case 'parsing':
      case 'processing':
        return 'hourglass_empty';
      default:
        return 'info';
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-light mb-2">
            Import History
          </h1>
          <p className="text-base text-text-light/70">
            View PDF upload and parsing history
          </p>
        </div>

        {/* Imports List */}
        {loading ? (
          <div className="text-text-light/70">Loading...</div>
        ) : imports.length === 0 ? (
          <div className="bg-card-light p-12 rounded-xl border border-border-light text-center">
            <span className="material-symbols-outlined text-6xl text-text-light/30 mb-4">history</span>
            <p className="text-text-light/70">No imports yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {imports.map((importItem) => (
              <div
                key={importItem.id}
                className="bg-card-light p-6 rounded-xl border border-border-light hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-text-light/70">description</span>
                      <h3 className="text-lg font-bold text-text-light">{importItem.file_name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-text-light/70 mb-3">
                      <span>
                        Paper: {importItem.paper?.title || 'N/A'} ({importItem.paper?.year || 'N/A'})
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(importItem.created_at).toLocaleString()}
                      </span>
                    </div>
                    {importItem.questions_count && (
                      <p className="text-sm text-text-light/70 mb-3">
                        {importItem.questions_count} questions parsed
                      </p>
                    )}
                    {importItem.error_message && (
                      <div className="p-3 bg-error/10 border border-error/20 rounded-lg mb-3">
                        <p className="text-sm text-error">{importItem.error_message}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          importItem.status
                        )}`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {getStatusIcon(importItem.status)}
                        </span>
                        {importItem.status}
                      </span>
                      {importItem.paper_id && (
                        <Link
                          href={`/admin/papers/${importItem.paper_id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          View Paper →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

