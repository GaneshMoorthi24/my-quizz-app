"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { getUser, logout } from '@/lib/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
      async function fetchUser() {
      try {
        // Check if token exists first (check both storages)
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const data = await getUser();
        
        if (!data) {
          router.push('/login');
          return;
        }

        // Check for admin status - handle both is_admin (1, true, '1') and role === 'admin'
        const isAdmin = data?.is_admin === 1 || 
                       data?.is_admin === true || 
                       data?.is_admin === '1' ||
                       data?.role === 'admin';
        
        if (!isAdmin) {
          router.push('/dashboard');
          return;
        }
        
        setUser(data);
      } catch (error: any) {
        console.error('Admin auth error:', error);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        
        // Check error type
        if (error.response?.status === 401) {
          // Unauthorized - token invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
          router.push('/login');
        } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
          // API server not running
          console.error('API server not available');
          alert('Cannot connect to the API server. Please make sure the backend is running.');
          // Don't redirect, show error instead
        } else {
          // Other error - redirect to login
          router.push('/login');
        }
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

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: 'dashboard', color: 'text-blue-500' },
    { href: '/admin/exams', label: 'Exams', icon: 'school', color: 'text-purple-500' },
    { href: '/admin/imports', label: 'Import History', icon: 'history', color: 'text-green-500' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-light font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                <span className="material-symbols-outlined text-white text-2xl">admin_panel_settings</span>
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-xs text-slate-500 hidden sm:block">Control Center</p>
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
                      : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
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
            </nav>

            {/* User Profile and Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* User Profile - Desktop */}
              <div className="hidden sm:flex items-center gap-3 pr-3 border-r border-slate-200">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md ring-2 ring-white flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {(user?.name || 'Admin').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden lg:block">
                  <h3 className="text-sm font-semibold text-slate-800 truncate">
                    {user?.name || 'Admin'}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                aria-label="Logout"
                title="Logout"
              >
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
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
          <div className="md:hidden border-t border-slate-200 bg-white">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-slate-100'
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
              {/* Mobile User Info */}
              <div className="pt-3 mt-3 border-t border-slate-200">
                <div className="flex items-center gap-3 px-3 py-2">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md ring-2 ring-white flex items-center justify-center">
                      <span className="text-white font-bold text-base">
                        {(user?.name || 'Admin').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 truncate">
                      {user?.name || 'Admin'}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    <span className="inline-block mt-1 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                      Administrator
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

