"use client";

import DashboardLayout from "../../components/DashboardLayout";
import { getProfile, saveProfile } from "../../lib/profileStorage";
import type { UserProfile } from "../../types";
import {
  clearApplications,
  resetDemoApplications,
} from "../../lib/applicationApi";
import {
  Globe,
  Mail,
  MapPin,
  RotateCcw,
  Save,
  Trash2,
  User,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    role: "",
    location: "",
  });

  useEffect(() => {
    const savedProfile = getProfile();
    setProfile(savedProfile);
  }, []);

  function handleChange(field: keyof UserProfile, value: string) {
    setProfile({
      ...profile,
      [field]: value,
    });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!profile.name || !profile.email) {
      alert("Please enter your name and email.");
      return;
    }

    saveProfile(profile);
    alert("Profile saved successfully!");
  }

  async function handleResetDemoData() {
    const confirmReset = window.confirm(
      "This will replace all current database applications with demo applications. Continue?",
    );

    if (!confirmReset) {
      return;
    }

    try {
      await resetDemoApplications();
      alert("Demo applications reset successfully.");
      window.location.reload();
    } catch {
      alert("Failed to reset demo applications.");
    }
  }

  async function handleClearAllData() {
    const confirmClear = window.confirm(
      "This will permanently delete all applications from your database. Continue?",
    );

    if (!confirmClear) {
      return;
    }

    try {
      await clearApplications();
      localStorage.removeItem("interntrack_reminders");
      alert("All applications cleared successfully.");
      window.location.reload();
    } catch {
      alert("Failed to clear applications.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-indigo-300">
          Account Settings
        </p>

        <h1 className="text-2xl font-bold md:text-3xl">Settings</h1>

        <p className="mt-2 text-sm text-slate-400">
          Manage your profile, saved data, and InternTrack preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-indigo-600 text-4xl font-bold shadow-lg shadow-indigo-600/20">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              {profile.name || "Your Name"}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {profile.role || "Your Role"}
            </p>

            <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-[#07111f] px-4 py-2 text-sm text-slate-400">
              <MapPin size={15} />
              {profile.location || "Your Location"}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-5">
            <h3 className="font-semibold text-indigo-100">Profile Preview</h3>

            <div className="mt-4 space-y-3 text-sm">
              <PreviewRow label="Name" value={profile.name || "Not added"} />
              <PreviewRow label="Email" value={profile.email || "Not added"} />
              <PreviewRow label="Role" value={profile.role || "Not added"} />
              <PreviewRow
                label="Location"
                value={profile.location || "Not added"}
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <UserRound size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Profile Details</h2>
              <p className="text-sm text-slate-400">
                This information is saved in your browser for now.
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormInput
                label="Name"
                value={profile.name}
                onChange={(value) => handleChange("name", value)}
                placeholder="Zuha"
                icon={<User size={18} />}
              />

              <FormInput
                label="Email"
                value={profile.email}
                onChange={(value) => handleChange("email", value)}
                placeholder="zuha@example.com"
                icon={<Mail size={18} />}
              />
            </div>

            <FormInput
              label="Role"
              value={profile.role}
              onChange={(value) => handleChange("role", value)}
              placeholder="Frontend Developer Intern"
              icon={<Globe size={18} />}
            />

            <FormInput
              label="Location"
              value={profile.location}
              onChange={(value) => handleChange("location", value)}
              placeholder="India"
              icon={<MapPin size={18} />}
            />

            <div className="flex justify-end pt-3">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
              >
                <Save size={18} />
                Save Profile
              </button>
            </div>
          </form>

          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5">
            <h3 className="text-lg font-semibold text-red-300">Danger Zone</h3>

            <p className="mt-2 text-sm text-slate-400">
              Reset demo data or clear your saved applications and reminders.
            </p>

            <div className="mt-5 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleResetDemoData}
                className="flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-5 py-3 text-sm font-medium text-yellow-300 hover:bg-yellow-500/20"
              >
                <RotateCcw size={18} />
                Reset Demo Data
              </button>

              <button
                type="button"
                onClick={handleClearAllData}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-300 hover:bg-red-500/20"
              >
                <Trash2 size={18} />
                Clear All Data
              </button>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-slate-300">{label}</label>

      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </div>

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-white/10 bg-[#07111f] px-10 py-3 text-sm outline-none placeholder:text-slate-500"
        />
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="text-right text-slate-200">{value}</span>
    </div>
  );
}
