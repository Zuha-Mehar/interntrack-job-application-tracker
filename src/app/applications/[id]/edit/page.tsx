"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Briefcase,
  FileText,
  Link2,
  Save,
  Sparkles,
  X,
} from "lucide-react";
import DashboardLayout from "../../../../components/DashboardLayout";
import {
  getApplicationById,
  updateApplication,
} from "../../../../lib/applicationApi";
import type { ApplicationStatus, JobApplication } from "../../../../types";

const statusOptions: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];

export default function EditApplicationPage() {
  const router = useRouter();
  const params = useParams();

  const applicationId = Number(params.id);

  const [application, setApplication] = useState<JobApplication | null>(null);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied" as ApplicationStatus,
    skills: "",
    jobLink: "",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadApplication() {
      try {
        setIsLoading(true);
        setError("");

        if (Number.isNaN(applicationId)) {
          setError("Invalid application ID.");
          return;
        }

        const data = await getApplicationById(applicationId);

        if (!data) {
          setApplication(null);
          return;
        }

        setApplication(data);

        setFormData({
          company: data.company,
          role: data.role,
          status: data.status,
          skills: data.skills.join(", "),
          jobLink: data.jobLink || "",
          notes: data.notes || "",
        });
      } catch {
        setError("Failed to load application from database.");
      } finally {
        setIsLoading(false);
      }
    }

    loadApplication();
  }, [applicationId]);

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.company.trim() || !formData.role.trim()) {
      setError("Company name and role are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await updateApplication(applicationId, {
        company: formData.company.trim(),
        role: formData.role.trim(),
        status: formData.status,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        jobLink: formData.jobLink.trim(),
        notes: formData.notes.trim(),
      });

      router.push("/applications");
    } catch {
      setError("Failed to update application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">
          Loading application from database...
        </div>
      </DashboardLayout>
    );
  }

  if (!application && !error) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center">
          <Briefcase className="mx-auto text-slate-500" size={42} />
          <h1 className="mt-4 text-2xl font-bold text-white">
            Application not found
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            This application may have been deleted or does not exist.
          </p>

          <button
            onClick={() => router.push("/applications")}
            className="mt-6 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Back to Applications
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl">
          <p className="text-sm font-medium text-indigo-300">
            Edit Application
          </p>
          <h1 className="mt-2 text-3xl font-bold text-white">
            Update application details
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-400">
            Edit company, role, status, skills, job link, and notes. Changes
            will be saved in your PostgreSQL database.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl"
          >
            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Company Name
                </label>
                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Example: Google"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Role
                </label>
                <div className="relative">
                  <Sparkles
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Example: Frontend Developer Intern"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Skills
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="React, TypeScript, Tailwind CSS"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Job Link
                </label>
                <div className="relative">
                  <Link2
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="url"
                    name="jobLink"
                    value={formData.jobLink}
                    onChange={handleChange}
                    placeholder="https://careers.company.com/job"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Notes
                </label>
                <div className="relative">
                  <FileText
                    size={18}
                    className="absolute left-4 top-4 text-slate-500"
                  />
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Add notes about referral, deadline, interview details, or follow-up..."
                    className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {isSubmitting ? "Updating..." : "Update Application"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/applications")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>

          <aside className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
            <div className="rounded-2xl bg-indigo-500/10 p-4">
              <Sparkles className="text-indigo-300" size={28} />
            </div>

            <h2 className="mt-5 text-xl font-semibold text-white">
              Editing Tip
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Keep the status updated whenever your application moves forward.
              This helps your dashboard and analytics stay accurate.
            </p>

            <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Current Status
              </p>
              <p className="mt-2 text-sm text-slate-300">{formData.status}</p>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}