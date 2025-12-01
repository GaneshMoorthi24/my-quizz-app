"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getUser, logout } from '@/lib/auth';
import ThemeToggle from './ThemeToggle';
import { usePlan } from '@/lib/plan-utils';

interface ProLayoutProps {
  children: React.ReactNode;
}

export default function ProLayout({ children }: ProLayoutProps) {
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
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname === path;
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: 'dashboard', color: 'text-blue-500' },
    { href: '/quizzes', label: 'All Quizzes', icon: 'quiz', color: 'text-purple-500' },
    { href: '/analytics', label: 'Analytics', icon: 'analytics', color: 'text-green-500' },
    { href: '/profile', label: 'Profile', icon: 'person', color: 'text-amber-500' },
    { href: '/settings', label: 'Settings', icon: 'settings', color: 'text-slate-500' },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const plan = usePlan(user);

  return (
    <div className="relative flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-white dark:bg-slate-900 transition-colors">

      {/* Top Navigation Bar - Enhanced for Pro */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-b border-blue-200/50 dark:border-slate-700 shadow-lg shadow-blue-500/10'
            : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-blue-100/50 dark:border-slate-700'
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand - Animated */}
            <div className="flex items-center gap-3 group">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 shadow-lg shadow-blue-500/30 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="material-symbols-outlined text-white text-2xl">school</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
                  QuizPlatform
                </h1>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70 hidden sm:block font-medium">Pro Student Portal</p>
              </div>
            </div>

            {/* Desktop Navigation - Enhanced */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 scale-105'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50/80 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105'
                  }`}
                  href={item.href}
                >
                  {isActive(item.href) && (
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

            {/* User Profile and Mobile Menu - Enhanced */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-blue-200/50 dark:border-slate-700">
                <div className="relative group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 via-cyan-400 to-indigo-500 shadow-md ring-2 ring-white dark:ring-slate-800 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <span className="text-white font-bold text-sm">
                      {(user?.name || 'Student').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></div>
                  <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping"></div>
                </div>
                <div className="hidden lg:block">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {user?.name || 'Student'}
                  </h3>
                  <p className="text-xs text-blue-600/70 dark:text-blue-400/70 truncate font-medium">Pro Member</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:scale-110"
                aria-label="Logout"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
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
          <div className="md:hidden border-t border-blue-200/50 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800'
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

      {/* Main Content - Enhanced */}
      <main className="flex-1 overflow-y-auto min-w-0 relative z-10">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

