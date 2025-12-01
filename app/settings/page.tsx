"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { getUser } from '@/lib/auth';
import "../dashboard/style.css";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    quizReminders: true,
    performanceReports: true,
    language: 'en',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchUser();
    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem('user_settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse saved settings');
      }
    }
  }, []);

  async function fetchUser() {
    try {
      setLoading(true);
      const data = await getUser();
      setUser(data);
    } catch (error: any) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      // Save to localStorage (in a real app, this would be saved to backend)
      localStorage.setItem('user_settings', JSON.stringify(settings));
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-text-light">
            Settings
          </h1>
          <p className="text-base text-text-light">
            Manage your preferences and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Notification Settings */}
          <div className="lg:col-span-2 bg-card-light p-6 rounded-xl border border-border-light">
            <h2 className="text-xl font-bold text-text-light mb-6">Notification Preferences</h2>
            
            {message && (
              <div className={`mb-6 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-secondary/20 text-secondary border border-secondary/30' 
                  : 'bg-error/20 text-error border border-error/30'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">
                    {message.type === 'success' ? 'check_circle' : 'error'}
                  </span>
                  <p className="text-sm font-medium">{message.text}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border-light">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">email</span>
                  <div>
                    <p className="text-sm font-medium text-text-light">Email Notifications</p>
                    <p className="text-xs text-text-light/70">Receive email updates about your account</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border-light">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">notifications</span>
                  <div>
                    <p className="text-sm font-medium text-text-light">Quiz Reminders</p>
                    <p className="text-xs text-text-light/70">Get reminders for upcoming quizzes</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.quizReminders}
                    onChange={(e) => setSettings({ ...settings, quizReminders: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border-light">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">analytics</span>
                  <div>
                    <p className="text-sm font-medium text-text-light">Performance Reports</p>
                    <p className="text-xs text-text-light/70">Weekly performance summary emails</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.performanceReports}
                    onChange={(e) => setSettings({ ...settings, performanceReports: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border-light">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">save</span>
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-6">
            <div className="bg-card-light p-6 rounded-xl border border-border-light">
              <h2 className="text-xl font-bold text-text-light mb-6">Account Actions</h2>
              <div className="space-y-4">
                <Link
                  href="/forgot-password"
                  className="flex items-center gap-3 p-4 rounded-lg border border-border-light hover:bg-background-light transition-colors"
                >
                  <span className="material-symbols-outlined text-primary">lock_reset</span>
                  <div>
                    <p className="text-sm font-medium text-text-light">Change Password</p>
                    <p className="text-xs text-text-light/70">Update your account password</p>
                  </div>
                </Link>

                <div className="p-4 rounded-lg border border-border-light">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="material-symbols-outlined text-error">delete</span>
                    <p className="text-sm font-medium text-text-light">Delete Account</p>
                  </div>
                  <p className="text-xs text-text-light/70 mb-3">Permanently delete your account and all data</p>
                  <button className="text-xs text-error hover:text-error/80 font-medium">
                    Request Account Deletion
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-card-light p-6 rounded-xl border border-border-light">
              <h2 className="text-xl font-bold text-text-light mb-6">About</h2>
              <div className="space-y-3 text-sm text-text-light/70">
                <p>QuizPlatform v1.0.0</p>
                <p>AI-powered quiz platform for exam preparation</p>
                <div className="pt-4 border-t border-border-light">
                  <Link href="#" className="text-primary hover:text-primary/80 font-medium">
                    Terms of Service
                  </Link>
                  {' · '}
                  <Link href="#" className="text-primary hover:text-primary/80 font-medium">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

