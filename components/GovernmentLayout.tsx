"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getUser, logout } from '@/lib/auth';
import { usePlan } from '@/lib/plan-utils';

interface GovernmentLayoutProps {
  children: React.ReactNode;
}

export default function GovernmentLayout({ children }: GovernmentLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUser();
        setUser(data);
      } catch {
        router.push('/login');
      }
    }
    fetchUser();
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      alert('Something went wrong during logout.');
    }
  };

  const isActive = (path: string) => {
    if (path === '/government') {
      return pathname === '/government';
    }
    return pathname?.startsWith(path);
  };

  const navItems = [
    { href: '/government', label: 'Dashboard', icon: 'dashboard', color: 'text-blue-500' },
    { href: '/government/exams', label: 'Select Exam', icon: 'school', color: 'text-purple-500' },
    { href: '/government/papers', label: 'Previous Papers', icon: 'description', color: 'text-green-500' },
    { href: '/government/model-tests', label: 'Model Tests', icon: 'quiz', color: 'text-amber-500' },
    { href: '/government/current-affairs', label: 'Current Affairs', icon: 'newspaper', color: 'text-red-500' },
    { href: '/government/results', label: 'My Results', icon: 'insights', color: 'text-indigo-500' },
    { href: '/government/leaderboard', label: 'Leaderboard', icon: 'emoji_events', color: 'text-yellow-500' },
    { href: '/government/subscription', label: 'Subscription', icon: 'credit_card', color: 'text-orange-500' },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const plan = usePlan(user);
  const isPro = plan.type === 'pro';

  return (
    <div className="relative flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Animated Background for Pro Users */}
      {isPro && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-2xl border-b border-blue-200/50 shadow-lg shadow-blue-500/10'
            : 'bg-white/70 backdrop-blur-xl border-b border-blue-100/50'
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3 group">
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg ${
                isPro ? 'shadow-blue-500/30 transform transition-transform duration-300 group-hover:scale-110' : ''
              }`}>
                <span className="material-symbols-outlined text-white text-2xl">gavel</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Government Exams
                </h1>
                <p className="text-xs text-blue-600/70 hidden sm:block font-medium">
                  {isPro ? 'Pro Member' : 'Free Plan'}
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-600 hover:scale-105'
                  }`}
                  href={item.href}
                >
                  {isActive(item.href) && isPro && (
                    <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-cyan-400 opacity-20 animate-pulse"></span>
                  )}
                  <span className={`material-symbols-outlined text-lg relative z-10 ${isActive(item.href) ? 'text-white' : item.color}`}>
                    {item.icon}
                  </span>
                  <span className={`font-medium text-sm relative z-10 ${isActive(item.href) ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* User Profile and Mobile Menu */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-blue-200/50">
                <div className="relative group">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md ring-2 ring-white flex items-center justify-center ${
                    isPro ? 'transform transition-transform duration-300 group-hover:scale-110' : ''
                  }`}>
                    <span className="text-white font-bold text-sm">
                      {(user?.name || 'User').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
                  {isPro && (
                    <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping"></div>
                  )}
                </div>
                <div className="hidden lg:block">
                  <h3 className="text-sm font-semibold text-slate-800 truncate">
                    {user?.name || 'User'}
                  </h3>
                  <p className="text-xs text-blue-600/70 truncate font-medium">
                    {isPro ? 'Pro Member' : 'Free Plan'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300 hover:scale-110"
                aria-label="Logout"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-blue-50 transition-colors"
                aria-label="Toggle menu"
              >
                <span className="material-symbols-outlined text-xl">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-blue-200/50 bg-white/95 backdrop-blur-xl">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-blue-50'
                  }`}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={`material-symbols-outlined text-xl ${isActive(item.href) ? 'text-white' : item.color}`}>
                    {item.icon}
                  </span>
                  <span className={`font-medium text-sm ${isActive(item.href) ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-w-0 relative z-10">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

