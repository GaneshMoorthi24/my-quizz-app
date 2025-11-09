"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "./style.css";
import { getUser, logout } from '@/lib/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUser();
        setUser(data);
      } catch {
        router.push('/login'); // if token invalid, redirect
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      alert('Something went wrong during logout.');
    }
  };

  const quizzes = [
    {
      subject: "Mathematics",
      title: "Advanced Algebra",
      questions: 25,
      time: "45 mins",
    },
    {
      subject: "History",
      title: "Indian History - Part 1",
      questions: 30,
      time: "30 mins",
    },
    {
      subject: "Science",
      title: "Fundamentals of Physics",
      questions: 20,
      time: "35 mins",
    },
    {
      subject: "Current Affairs",
      title: "Weekly News Round-up",
      questions: 15,
      time: "15 mins",
    },
  ];

  const recentActivities = [
    {
      title: "Indian History - Part 1",
      date: "Completed 2 days ago",
      score: "85%",
      icon: "history_edu",
      color: "secondary",
    },
    {
      title: "Basic Geometry",
      date: "Completed 4 days ago",
      score: "92%",
      icon: "calculate",
      color: "secondary",
    },
    {
      title: "Chemical Reactions",
      date: "Completed 1 week ago",
      score: "64%",
      icon: "science",
      color: "error",
    },
  ];

  return (
    <div className="relative flex min-h-screen w-full">
      {/* SideNavBar */}
      <aside className="flex h-screen w-64 flex-col border-r border-border-light bg-card-light p-4 sticky top-0">
        <div className="flex items-center gap-3 px-2 pb-6">
          <span className="material-symbols-outlined text-primary text-3xl">school</span>
          <h1 className="text-xl font-bold text-text-light">QuizPlatform</h1>
        </div>
        <div className="flex flex-col justify-between flex-grow">
          <nav className="flex flex-col gap-2">
            <Link
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary"
              href="/dashboard"
            >
              <span className="material-symbols-outlined">dashboard</span>
              <p className="text-sm font-medium">Dashboard</p>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">quiz</span>
              <p className="text-sm font-medium">All Quizzes</p>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">analytics</span>
              <p className="text-sm font-medium">Performance Analytics</p>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">person</span>
              <p className="text-sm font-medium">Profile</p>
            </Link>
            <Link
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">settings</span>
              <p className="text-sm font-medium">Settings</p>
            </Link>
            {user?.role === 'admin' && (
              <Link
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border-t border-border-light mt-2 pt-2"
                href="/admin"
              >
                <span className="material-symbols-outlined">admin_panel_settings</span>
                <p className="text-sm font-medium">Admin Panel</p>
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-3 px-2 pt-4 border-t border-border-light">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              data-alt="User avatar of Alex Johnson"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuChcSZqEgdMAsKgrLaSsyN9Sb-8rtQhwZr85sgRL_69W4ufJQJVHruq1bfFhRsP4d58ULIHNZpvuqBrh8ekVIOsuMEwkBuHX5MXdP_g0kQfgnX8QBMp0KDPmCfa4QaK6e_bvBme3OEmdMzFXRDoMGzSDVwnsJz0lKVJLaXUdUigk6FvxBau51Gx51qATPs7uQ6iPZe-AoBpmjJga6SqFa7vG0R2Pt1lmox9M73AM6jtG8BfsAXEutKLnV9urTwTuPEobKTD9CHBc5tZ")',
              }}
            ></div>
            <div className="flex flex-col">
              <h2 className="text-sm font-medium text-text-light">
                {user?.name}
                </h2>
              <p className="text-xs text-text-light/70 ">{user?.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="logout-button ml-auto text-text-light/70  hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: "#f9f9fc" }}>
        <div className="mx-auto max-w-7xl">
          {/* PageHeading */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <p className="text-3xl font-bold tracking-tight">
                Welcome back, Alex!
              </p>
              <p className="text-base  ">
                Ready to ace your next exam? Let&apos;s get started.
              </p>
            </div>
            <Link
              href="/attempt_questions"
              className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-sm hover:bg-primary/90 transition-colors"
            >
              <span className="material-symbols-outlined text-base">play_arrow</span>
              <span className="truncate">Resume Last Quiz</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: Quizzes */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* SearchBar */}
                <div className="flex-grow">
                  <label className="flex flex-col min-w-40 h-12 w-full">
                    <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-card-light border border-border-light">
                      <div className="text-text-light/70  flex items-center justify-center pl-4">
                        <span className="material-symbols-outlined">search</span>
                      </div>
                      <input
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light focus:outline-0 focus:ring-0 border-none bg-card-light h-full placeholder:text-text-light/70 dark:placeholder: pl-2 text-base"
                        placeholder="Search for a quiz by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </label>
                </div>

                {/* Chips */}
                <div className="flex gap-3 items-center">
                  <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-card-light border border-border-light px-3 hover:border-primary/50 transition-colors">
                    <p className="text-text-light text-sm font-medium">Subject</p>
                    <span className="material-symbols-outlined text-base text-text-light/70 ">
                      expand_more
                    </span>
                  </button>
                  <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-card-light border border-border-light px-3 hover:border-primary/50 transition-colors">
                    <p className="text-text-light text-sm font-medium">Difficulty</p>
                    <span className="material-symbols-outlined text-base text-text-light/70 ">
                      expand_more
                    </span>
                  </button>
                  <button className="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-card-light border border-border-light px-3 hover:border-primary/50 transition-colors">
                    <p className="text-text-light text-sm font-medium">Recency</p>
                    <span className="material-symbols-outlined text-base text-text-light/70 ">
                      expand_more
                    </span>
                  </button>
                </div>
              </div>

              {/* Quiz Grid Section */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-text-light mb-4">
                  Recommended For You
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quizzes.map((quiz, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-6 bg-card-light rounded-xl border border-border-light hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-primary mb-1">{quiz.subject}</p>
                        <h3 className="text-lg font-bold text-text-light mb-3">{quiz.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-text-light/70 ">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">list_alt</span> {quiz.questions}{" "}
                            Questions
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base">timer</span> {quiz.time}
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/attempt_questions"
                        className="mt-6 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
                      >
                        Start Quiz
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: Widgets */}
            <div className="lg:col-span-1 flex flex-col gap-8">
              {/* Performance Summary Widget */}
              <div className="bg-card-light p-6 rounded-xl border border-border-light">
                <h3 className="text-lg font-bold text-text-light mb-4">Performance Summary</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background-light">
                    <div>
                      <p className="text-sm text-text-light/70 ">Overall Accuracy</p>
                      <p className="text-2xl font-bold text-secondary">88%</p>
                    </div>
                    <div className="text-secondary">
                      <span className="material-symbols-outlined text-4xl">verified</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background-light">
                    <div>
                      <p className="text-sm text-text-light/70 ">Quizzes Completed</p>
                      <p className="text-2xl font-bold text-primary">12</p>
                    </div>
                    <div className="text-primary">
                      <span className="material-symbols-outlined text-4xl">fact_check</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background-light">
                    <div>
                      <p className="text-sm text-text-light/70 ">Strongest Subject</p>
                      <p className="text-2xl font-bold text-text-light">History</p>
                    </div>
                    <div className="text-text-light/80/80">
                      <span className="material-symbols-outlined text-4xl">workspace_premium</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="bg-card-light p-6 rounded-xl border border-border-light">
                <h3 className="text-lg font-bold text-text-light mb-4">Recent Activity</h3>
                <ul className="flex flex-col gap-3">
                  {recentActivities.map((activity, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-background-light transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center size-10 rounded-full ${
                            activity.color === "secondary"
                              ? "bg-secondary/20 text-secondary"
                              : activity.color === "error"
                                ? "bg-error/20 text-error"
                                : "bg-primary/20 text-primary"
                          }`}
                        >
                          <span className="material-symbols-outlined">{activity.icon}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{activity.title}</p>
                          <p className="text-xs text-text-light/70 ">{activity.date}</p>
                        </div>
                      </div>
                      <p
                        className={`font-bold text-sm ${
                          activity.color === "secondary"
                            ? "text-secondary"
                            : activity.color === "error"
                              ? "text-error"
                              : "text-primary"
                        }`}
                      >
                        {activity.score}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
