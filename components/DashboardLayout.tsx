"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getUser, logout } from '@/lib/auth';
import { usePlan, detectPlan } from '@/lib/plan-utils';
import ProLayout from './ProLayout';
import ThemeToggle from './ThemeToggle';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      alert('Something went wrong during logout.');
    }
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
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

  // Detect plan and use appropriate layout
  const plan = detectPlan(user);
  const planConfig = usePlan(user);

  // Pro Plan uses enhanced ProLayout
  if (plan === 'pro') {
    return <ProLayout>{children}</ProLayout>;
  }

  // Free Plan uses standard layout (current design)
  return (
    <div className="relative flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-white dark:bg-slate-900 transition-colors">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <span className="material-symbols-outlined text-white text-2xl">school</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  QuizPlatform
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Student Portal</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  href={item.href}
                >
                  <span className={`material-symbols-outlined text-lg ${isActive(item.href) ? 'text-white' : item.color}`}>
                    {item.icon}
                  </span>
                  <span className={`font-medium text-sm ${isActive(item.href) ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link
                  className={`group flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    pathname === '/admin'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                  href="/admin"
                >
                  <span className={`material-symbols-outlined text-lg ${pathname === '/admin' ? 'text-white' : 'text-purple-500'}`}>
                    admin_panel_settings
                  </span>
                  <span className={`font-medium text-sm ${pathname === '/admin' ? 'text-white' : ''}`}>
                    Admin
                  </span>
                </Link>
              )}
            </nav>

            {/* User Profile and Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* User Profile - Desktop */}
              <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md ring-2 ring-white dark:ring-slate-800 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {(user?.name || 'Student').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                </div>
                <div className="hidden lg:block">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {user?.name || 'Student'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                aria-label="Logout"
                title="Logout"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
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
              {user?.role === 'admin' && (
                <Link
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    pathname === '/admin'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className={`material-symbols-outlined text-xl ${pathname === '/admin' ? 'text-white' : 'text-purple-500'}`}>
                    admin_panel_settings
                  </span>
                  <span className={`font-medium text-sm ${pathname === '/admin' ? 'text-white' : ''}`}>
                    Admin Panel
                  </span>
                </Link>
              )}
              {/* Mobile User Info */}
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md ring-2 ring-white dark:ring-slate-800 flex items-center justify-center">
                      <span className="text-white font-bold text-base">
                        {(user?.name || 'Student').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {user?.name || 'Student'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
                      Student
                    </span>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

