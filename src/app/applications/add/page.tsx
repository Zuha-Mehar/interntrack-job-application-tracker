"use client";

import DashboardLayout from "../../../components/DashboardLayout";
import { addApplication } from "../../../lib/applicationStorage";
import type { ApplicationStatus } from "../../../types";
import {
  Briefcase,
  FileText,
  Link2,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddApplicationPage() {
  const router = useRouter();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("Applied");
  const [skills, setSkills] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!company || !role) {
      alert("Please enter company name and role.");
      return;
    }

    addApplication({
      company,
      role,
      jobLink,
      status,
      notes,
      skills: skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0),
    });

    alert("Application saved successfully!");
    router.push("/applications");
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-indigo-300">
          Application Manager
        </p>

        <h1 className="text-2xl font-bold md:text-3xl">
          Add New Application
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Save a new internship or job application with all important details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <Briefcase size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Application Details</h2>
              <p className="text-sm text-slate-400">
                Fill the details carefully so you can track it later.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormInput
                label="Company Name"
                value={company}
                onChange={setCompany}
                placeholder="Amazon"
                icon={<Briefcase size={18} />}
              />

              <FormInput
                label="Role Title"
                value={role}
                onChange={setRole}
                placeholder="Frontend Developer Intern"
                icon={<FileText size={18} />}
              />
            </div>

            <FormInput
              label="Job Link"
              value={jobLink}
              onChange={setJobLink}
              placeholder="https://example.com/job/123456"
              icon={<Link2 size={18} />}
            />

            <FormInput
              label="Skills"
              value={skills}
              onChange={setSkills}
              placeholder="React, TypeScript, Tailwind CSS"
              icon={<Sparkles size={18} />}
            />

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as ApplicationStatus)
                }
                className="w-full rounded-lg border border-white/10 bg-[#07111f] px-4 py-3 text-sm outline-none"
              >
                <option>Applied</option>
                <option>Shortlisted</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="Applied through LinkedIn. Waiting for response."
                className="w-full rounded-lg border border-white/10 bg-[#07111f] px-4 py-3 text-sm outline-none placeholder:text-slate-500"
              />
            </div>

            <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => router.push("/applications")}
                className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-5 py-3 text-sm hover:bg-white/10"
              >
                <X size={18} />
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
              >
                <Save size={18} />
                Save Application
              </button>
            </div>
          </form>
        </section>

        <aside className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6">
          <h2 className="text-lg font-semibold text-indigo-200">
            Quick Tip
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-300">
            Add skills as comma-separated values like:
          </p>

          <div className="mt-4 rounded-xl border border-white/10 bg-[#07111f] p-4 text-sm text-slate-300">
            React, TypeScript, Node.js, SQL
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            These skills will automatically appear in your Skills Insights page.
          </p>
        </aside>
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