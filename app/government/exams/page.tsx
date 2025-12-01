"use client";

import Link from "next/link";
import GovernmentLayout from "@/components/GovernmentLayout";

const examTypes = [
  { 
    id: 'tnpsc', 
    name: 'TNPSC', 
    fullName: 'Tamil Nadu Public Service Commission',
    icon: 'account_balance', 
    gradient: 'from-blue-500 to-cyan-500',
    exams: ['Group 1', 'Group 2', 'Group 4', 'VAO', 'Combined Engineering Services'],
    papers: 45,
    description: 'Prepare for various TNPSC exams with previous year papers and model tests.'
  },
  { 
    id: 'ssc', 
    name: 'SSC', 
    fullName: 'Staff Selection Commission',
    icon: 'work', 
    gradient: 'from-purple-500 to-pink-500',
    exams: ['CGL', 'CHSL', 'MTS', 'CPO', 'JE'],
    papers: 38,
    description: 'SSC exam preparation with comprehensive question banks and practice tests.'
  },
  { 
    id: 'rrb', 
    name: 'RRB', 
    fullName: 'Railway Recruitment Board',
    icon: 'train', 
    gradient: 'from-green-500 to-emerald-500',
    exams: ['NTPC', 'Group D', 'ALP', 'JE', 'Technician'],
    papers: 32,
    description: 'Railway exam preparation with previous year papers and mock tests.'
  },
  { 
    id: 'tnusrb', 
    name: 'TNUSRB', 
    fullName: 'Tamil Nadu Uniformed Services Recruitment Board',
    icon: 'security', 
    gradient: 'from-orange-500 to-red-500',
    exams: ['SI', 'Constable', 'Fireman', 'Jail Warder'],
    papers: 28,
    description: 'Police and uniformed services exam preparation materials.'
  },
  { 
    id: 'banking', 
    name: 'Banking', 
    fullName: 'Banking Exams',
    icon: 'account_balance_wallet', 
    gradient: 'from-indigo-500 to-purple-500',
    exams: ['IBPS PO', 'IBPS Clerk', 'SBI PO', 'SBI Clerk', 'RBI Grade B'],
    papers: 52,
    description: 'Banking exam preparation with previous year papers and sectional tests.'
  },
  { 
    id: 'upsc', 
    name: 'UPSC', 
    fullName: 'Union Public Service Commission',
    icon: 'school', 
    gradient: 'from-amber-500 to-yellow-500',
    exams: ['Civil Services', 'IFS', 'IES', 'CDS', 'NDA'],
    papers: 67,
    description: 'UPSC exam preparation with comprehensive study materials and tests.'
  },
];

export default function GovernmentExamsPage() {
  return (
    <GovernmentLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Select Your Exam</h1>
          <p className="text-lg text-slate-600">Choose from various government competitive exams</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examTypes.map((exam) => (
            <Link
              key={exam.id}
              href={`/government/exams/${exam.id}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${exam.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="material-symbols-outlined text-white text-2xl">{exam.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
                  {exam.name}
                </h3>
                <p className="text-sm text-slate-500 mb-3">{exam.fullName}</p>
                <p className="text-sm text-slate-600 mb-4">{exam.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-slate-500">Previous Papers</p>
                    <p className="text-lg font-bold text-slate-800">{exam.papers}+</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Exam Types</p>
                    <p className="text-lg font-bold text-slate-800">{exam.exams.length}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {exam.exams.slice(0, 3).map((examType) => (
                    <span key={examType} className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      {examType}
                    </span>
                  ))}
                  {exam.exams.length > 3 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                      +{exam.exams.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </GovernmentLayout>
  );
}

