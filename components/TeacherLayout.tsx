"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getUser, logout } from "@/lib/auth";

// Premium animations for Standard Plan (Teacher)
const FloatingOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float-slow"></div>
    <div className="absolute top-40 right-20 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-float-medium"></div>
    <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-fuchsia-500/10 rounded-full blur-3xl animate-float-fast"></div>
    <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float-slow delay-2000"></div>
  </div>
);

const ParticleField = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-white/20 rounded-full animate-particle"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${10 + Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

interface TeacherLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: "/teacher", label: "Overview", icon: "dashboard", color: "text-sky-500" },
  { href: "/teacher/quizzes", label: "Create Quiz", icon: "edit_square", color: "text-indigo-500" },
  { href: "/teacher/pdf-upload", label: "PDF to Quiz", icon: "picture_as_pdf", color: "text-rose-500" },
  { href: "/teacher/question-bank", label: "Question Bank", icon: "library_books", color: "text-emerald-500" },
  { href: "/teacher/groups", label: "Student Groups", icon: "group", color: "text-amber-500" },
  { href: "/teacher/assignments", label: "Assign Quiz", icon: "send", color: "text-blue-500" },
  { href: "/teacher/live-monitor", label: "Live Monitor", icon: "monitoring", color: "text-fuchsia-500" },
  { href: "/teacher/results", label: "Quiz Results", icon: "insights", color: "text-lime-500" },
  { href: "/teacher/performance", label: "Performance", icon: "query_stats", color: "text-cyan-500" },
  { href: "/teacher/certificates", label: "Certificates", icon: "workspace_premium", color: "text-purple-500" },
  { href: "/teacher/profile", label: "Profile", icon: "badge", color: "text-slate-500" },
  { href: "/teacher/billing", label: "Billing", icon: "credit_card", color: "text-orange-500" },
];

export default function TeacherLayout({ children }: TeacherLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getUser();
        setUser(data);
      } catch (error) {
        console.error("Teacher layout auth error", error);
        router.push("/login");
      }
    }
    loadUser();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 4);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      alert("Unable to logout. Please try again.");
    }
  };

  const isActive = (href: string) => {
    if (href === "/teacher") {
      return pathname === "/teacher";
    }
    return pathname?.startsWith(href);
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/5 px-10 py-12 shadow-2xl shadow-indigo-900/30 backdrop-blur-3xl">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-white/20 border-t-white/80" />
          <p className="text-sm tracking-wide text-white/70">Preparing teacher portal...</p>
        </div>
      </div>
    );
  }

  const plan = user.subscription_plan || "Standard";
  const isPremium = plan?.toLowerCase() !== "standard";

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-hidden">
      {/* Premium Background Effects - Standard Plan Exclusive */}
      <FloatingOrbs />
      <ParticleField />
      
      {/* Animated gradient mesh overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none z-0 animate-pulse-slow"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none z-0 animate-pulse-slow delay-1000"></div>
      
      <header
        className={`sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-2xl transition-all duration-500 ${
          isScrolled 
            ? "shadow-2xl shadow-indigo-900/30 border-white/20" 
            : "shadow-lg shadow-black/20"
        }`}
      >
        <div className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center gap-3 group">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500 shadow-lg shadow-blue-900/40 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl group-hover:shadow-indigo-500/50">
              <span className="material-symbols-outlined text-2xl text-white relative z-10">auto_stories</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-fuchsia-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
            </div>
            <div>
              <p className="text-sm uppercase tracking-widest text-white/50 font-semibold">Teacher Workspace</p>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white via-indigo-100 to-purple-100 bg-clip-text text-transparent animate-gradient-shift">
                QuizPlatform for Teachers
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl px-4 py-2 shadow-lg shadow-indigo-900/20 hover:bg-white/15 transition-all duration-300 md:flex">
              <div className="relative group">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-lg font-bold text-white shadow-lg shadow-blue-900/40 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-xl group-hover:shadow-indigo-500/50">
                  {(user?.name || "Teacher").charAt(0).toUpperCase()}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400 animate-pulse shadow-lg shadow-emerald-400/50" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user?.name || "Teacher"}</p>
                <p className="text-xs text-white/70 font-medium">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              Logout
            </button>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 text-white/80 transition hover:bg-white/10"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label="Toggle sidebar"
            >
              <span className="material-symbols-outlined">{isSidebarOpen ? "menu_open" : "menu"}</span>
            </button>
          </div>
        </div>

      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar Navigation */}
        <aside
          className={`fixed lg:sticky top-0 h-screen lg:h-auto z-50 border-r border-white/10 bg-slate-950/95 backdrop-blur-2xl shadow-2xl shadow-black/30 transition-all duration-300 ${
            isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-20"
          }`}
        >
          <nav className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              {isSidebarOpen && (
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-fuchsia-500">
                    <span className="material-symbols-outlined text-sm text-white">auto_stories</span>
                  </div>
                  <span className="text-sm font-bold text-white">Menu</span>
                </div>
              )}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 text-white/70 transition hover:bg-white/10 lg:ml-0"
                aria-label="Toggle sidebar"
              >
                <span className="material-symbols-outlined text-lg">
                  {isSidebarOpen ? "chevron_left" : "chevron_right"}
                </span>
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto px-3 py-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                    isActive(item.href)
                      ? "bg-gradient-to-r from-white to-indigo-50 text-slate-900 shadow-2xl shadow-indigo-900/40"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Close sidebar on mobile when clicking a link
                    if (window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  title={isSidebarOpen ? "" : item.label}
                >
                  {isActive(item.href) && (
                    <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-indigo-400 to-purple-400"></div>
                  )}
                  <span
                    className={`material-symbols-outlined text-xl transition-transform duration-300 ${
                      isActive(item.href) 
                        ? "text-slate-900 scale-110" 
                        : `${item.color} group-hover:scale-110`
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span
                    className={`transition-all duration-300 ${
                      isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 overflow-hidden"
                    } ${isActive(item.href) ? "text-slate-900 font-bold" : ""}`}
                  >
                    {item.label}
                  </span>
                  {item.href === "/teacher/billing" && !isPremium && isSidebarOpen && (
                    <span className="ml-auto rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-yellow-200 animate-pulse">
                      Upgrade
                    </span>
                  )}
                </Link>
              ))}
            </div>
            
            {/* Sidebar Footer */}
            <div className="border-t border-white/10 px-3 pt-4 pb-4">
              <div className={`rounded-2xl border border-white/5 bg-white/5 p-3 transition-all duration-300 ${!isSidebarOpen ? "flex items-center justify-center" : ""}`}>
                {isSidebarOpen ? (
                  <>
                    <div className="text-xs uppercase tracking-wide text-white/60 mb-1">Subscription</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{plan}</span>
                      {!isPremium && (
                        <span className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-yellow-300">
                          Upgrade
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500">
                    <span className="material-symbols-outlined text-sm text-white">workspace_premium</span>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="relative z-10 flex-1 overflow-y-auto lg:ml-0">
          <div className="mx-auto w-full max-w-[1920px] px-6 py-8 sm:px-8 lg:px-12 xl:px-16">{children}</div>
        </main>
      </div>

      <footer className="border-t border-white/5 bg-slate-950/90 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} QuizPlatform • Teacher Module Beta
      </footer>
    </div>
  );
}

