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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchUser() {
      try {
        // Check if token exists first
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, redirecting to login');
          router.push('/login');
          return;
        }

        console.log('Fetching user data...');
        const data = await getUser();
        console.log('User data:', data);
        console.log('is_admin value:', data?.is_admin, 'Type:', typeof data?.is_admin);
        console.log('role value:', data?.role);
        
        if (!data) {
          console.log('No user data returned, redirecting to login');
          router.push('/login');
          return;
        }

        // Check for admin status - handle both is_admin (1, true, '1') and role === 'admin'
        const isAdmin = data?.is_admin === 1 || 
                       data?.is_admin === true || 
                       data?.is_admin === '1' ||
                       data?.role === 'admin';
        
        console.log('Is admin?', isAdmin);
        
        if (!isAdmin) {
          console.log('User is not admin, redirecting to dashboard. is_admin:', data?.is_admin, 'role:', data?.role);
          router.push('/dashboard');
          return;
        }
        
        console.log('Admin user authenticated');
        setUser(data);
      } catch (error: any) {
        console.error('Admin auth error:', error);
        console.error('Error status:', error.response?.status);
        console.error('Error data:', error.response?.data);
        
        // Check error type
        if (error.response?.status === 401) {
          // Unauthorized - token invalid or expired
          console.log('401 Unauthorized - removing token and redirecting to login');
          localStorage.removeItem('token');
          router.push('/login');
        } else if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
          // API server not running
          console.error('API server not available');
          alert('Cannot connect to the API server. Please make sure the backend is running.');
          // Don't redirect, show error instead
        } else {
          // Other error - redirect to login
          console.log('Other error, redirecting to login');
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
    { href: '/admin', label: 'Dashboard', icon: 'dashboard' },
    { href: '/admin/exams', label: 'Exams', icon: 'school' },
    { href: '/admin/imports', label: 'Import History', icon: 'history' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-text-light">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full max-w-full overflow-x-hidden">
      {/* SideNavBar */}
      <aside className="flex h-screen w-48 sm:w-56 md:w-64 flex-col border-r border-border-light bg-card-light p-3 sm:p-4 sticky top-0 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 px-2 pb-4 sm:pb-6">
          <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl">admin_panel_settings</span>
          <h1 className="text-lg sm:text-xl font-bold text-text-light truncate">Admin Panel</h1>
        </div>
        <div className="flex flex-col justify-between flex-grow overflow-hidden">
          <nav className="flex flex-col gap-2 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={`flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-primary/10 hover:text-primary'
                }`}
                href={item.href}
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">{item.icon}</span>
                <p className="text-xs sm:text-sm font-medium truncate">{item.label}</p>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3 px-2 pt-4 border-t border-border-light flex-shrink-0 min-w-0">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 sm:size-10 flex-shrink-0"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuChcSZqEgdMAsKgrLaSsyN9Sb-8rtQhwZr85sgRL_69W4ufJQJVHruq1bfFhRsP4d58ULIHNZpvuqBrh8ekVIOsuMEwkBuHX5MXdP_g0kQfgnX8QBMp0KDPmCfa4QaK6e_bvBme3OEmdMzFXRDoMGzSDVwnsJz0lKVJLaXUdUigk6FvxBau51Gx51qATPs7uQ6iPZe-AoBpmjJga6SqFa7vG0R2Pt1lmox9M73AM6jtG8BfsAXEutKLnV9urTwTuPEobKTD9CHBc5tZ")',
              }}
            ></div>
            <div className="flex flex-col flex-1 min-w-0">
              <h2 className="text-xs sm:text-sm font-medium text-text-light truncate">
                {user?.name}
              </h2>
              <p className="text-xs text-text-light/70 truncate">{user?.email}</p>
              <p className="text-xs text-primary font-medium">Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto text-text-light/70 hover:text-primary transition-colors cursor-pointer flex-shrink-0"
              aria-label="Logout"
            >
              <span className="material-symbols-outlined text-lg sm:text-xl">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 min-w-0 max-w-full" style={{ backgroundColor: "#f9f9fc" }}>
        <div className="w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

