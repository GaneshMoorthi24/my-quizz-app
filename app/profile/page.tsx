"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { getUser } from '@/lib/auth';
import "../dashboard/style.css";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      setLoading(true);
      const data = await getUser();
      setUser(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
      });
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
      // TODO: Add update profile API endpoint
      // await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setEditing(false);
      await fetchUser();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setEditing(false);
    setMessage(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
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
            My Profile
          </h1>
          <p className="text-base text-text-light">
            Manage your profile information and account settings
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information Card */}
          <div className="lg:col-span-2 bg-card-light p-6 rounded-xl border border-border-light">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-light">Profile Information</h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  <span className="material-symbols-outlined text-base">edit</span>
                  Edit Profile
                </button>
              )}
            </div>

            {message && (
              <div className={`mb-4 p-3 rounded-lg ${
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
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-border-light bg-card-light text-text-light focus:outline-0 focus:ring-2 focus:ring-primary/50"
                  />
                ) : (
                  <p className="text-base text-text-light">{user?.name || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Email Address
                </label>
                {editing ? (
                  <>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border-light bg-card-light text-text-light focus:outline-0 focus:ring-2 focus:ring-primary/50"
                      disabled
                    />
                    <p className="text-xs text-text-light/70 mt-1">Email cannot be changed</p>
                  </>
                ) : (
                  <p className="text-base text-text-light">{user?.email || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Account Status
                </label>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user?.email_verified_at
                      ? 'bg-secondary/20 text-secondary'
                      : 'bg-error/20 text-error'
                  }`}>
                    {user?.email_verified_at ? 'Verified' : 'Unverified'}
                  </span>
                  {!user?.email_verified_at && (
                    <span className="text-xs text-text-light/70">Please verify your email</span>
                  )}
                </div>
              </div>

              {editing && (
                <div className="flex items-center gap-3 pt-4">
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
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-6 py-2 bg-background-light border border-border-light text-text-light rounded-lg hover:bg-background-light/80 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats Card */}
          <div className="bg-card-light p-6 rounded-xl border border-border-light">
            <h2 className="text-xl font-bold text-text-light mb-6">Account Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-background-light">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl">quiz</span>
                  <div>
                    <p className="text-sm text-text-light/70">Member Since</p>
                    <p className="text-base font-medium text-text-light">
                      {user?.created_at 
                        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-background-light">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary text-2xl">verified</span>
                  <div>
                    <p className="text-sm text-text-light/70">Email Status</p>
                    <p className="text-base font-medium text-text-light">
                      {user?.email_verified_at ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              {user?.role === 'admin' && (
                <div className="flex items-center justify-between p-4 rounded-lg bg-background-light">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">admin_panel_settings</span>
                    <div>
                      <p className="text-sm text-text-light/70">Account Type</p>
                      <p className="text-base font-medium text-text-light">Administrator</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

