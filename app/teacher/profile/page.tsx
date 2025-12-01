"use client";

import { useState } from "react";

export default function TeacherProfilePage() {
  const [profile, setProfile] = useState({
    name: "Ananya Rao",
    email: "ananya.rao@school.edu",
    school: "Crescent High",
    theme: "#4f46e5",
  });

  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">Teacher Profile</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black text-white">Brand your classroom experience</h1>
          <button className="rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">View public profile</button>
        </div>
      </header>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <div className="flex flex-wrap items-center gap-6">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-500 text-3xl font-bold text-white flex items-center justify-center">
            {profile.name.charAt(0)}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Profile photo</p>
            <button className="mt-2 rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80">Upload new</button>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-white/50">Name</label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              value={profile.name}
              onChange={(event) => setProfile({ ...profile, name: event.target.value })}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-white/50">Email</label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              value={profile.email}
              onChange={(event) => setProfile({ ...profile, email: event.target.value })}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-white/50">School / Institution</label>
            <input
              className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white"
              value={profile.school}
              onChange={(event) => setProfile({ ...profile, school: event.target.value })}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-white/50">Theme color</label>
            <input
              type="color"
              className="mt-2 h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              value={profile.theme}
              onChange={(event) => setProfile({ ...profile, theme: event.target.value })}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-900">Save Changes</button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg">
        <p className="text-xs uppercase tracking-wide text-white/50">Security</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <button className="rounded-2xl border border-white/20 px-4 py-3 text-left text-sm text-white/80">Change password</button>
          <button className="rounded-2xl border border-white/20 px-4 py-3 text-left text-sm text-white/80">Enable 2FA (Soon)</button>
        </div>
      </section>
    </div>
  );
}

