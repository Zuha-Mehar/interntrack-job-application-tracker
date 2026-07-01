"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  FileText,
  Loader2,
  Save,
  Upload,
  X,
} from "lucide-react";
import DashboardLayout from "../../../components/DashboardLayout";
import { addApplication } from "../../../lib/applicationApi";
import { uploadResumePdf } from "../../../lib/resumeUploadApi";
import type { ApplicationStatus } from "../../../types";

const statusOptions: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];

const MAX_FILE_SIZE = 4 * 1024 * 1024;

export default function AddApplicationPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied" as ApplicationStatus,
    skills: "",
    resumeUsed: "",
    jobLink: "",
    notes: "",
  });

  const [selectedResumeFile, setSelectedResumeFile] = useState<File | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  function handleResumeFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Only PDF resume files are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("Resume PDF must be less than 4 MB.");
      event.target.value = "";
      return;
    }

    setSelectedResumeFile(file);

    if (!formData.resumeUsed.trim()) {
      setFormData((currentData) => ({
        ...currentData,
        resumeUsed: file.name.replace(/\.pdf$/i, ""),
      }));
    }
  }

  function removeSelectedResumeFile() {
    setSelectedResumeFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formData.company.trim() || !formData.role.trim()) {
      alert("Company and role are required.");
      return;
    }

    try {
      setIsSubmitting(true);

      let uploadedResume:
        | {
            resumeFileName: string;
            resumeUrl: string;
          }
        | undefined;

      if (selectedResumeFile) {
        uploadedResume = await uploadResumePdf(selectedResumeFile);
      }

      await addApplication({
        company: formData.company.trim(),
        role: formData.role.trim(),
        status: formData.status,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        resumeUsed: formData.resumeUsed.trim(),
        resumeFileName: uploadedResume?.resumeFileName,
        resumeUrl: uploadedResume?.resumeUrl,
        jobLink: formData.jobLink.trim(),
        notes: formData.notes.trim(),
      });

      router.push("/applications");
      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to add application."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl">
          <Link
            href="/applications"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to applications
          </Link>

          <div className="mt-6 flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
              <Briefcase size={28} />
            </div>

            <div>
              <p className="text-sm font-medium text-indigo-300">
                New Application
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Add job application
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                Save company details, skills, resume version, resume PDF, job
                link, and notes.
              </p>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Example: Google"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Role *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="Example: Frontend Developer Intern"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
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
                Resume Used
              </label>
              <input
                type="text"
                name="resumeUsed"
                value={formData.resumeUsed}
                onChange={handleChange}
                placeholder="Example: Frontend Resume v1 or AI/ML Resume"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Upload Resume PDF
              </label>

              <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950 p-5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeFileChange}
                  className="hidden"
                />

                {!selectedResumeFile ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 px-5 py-8 text-center transition hover:border-indigo-500/40 hover:bg-indigo-500/10"
                  >
                    <Upload size={28} className="text-indigo-300" />
                    <span className="mt-3 text-sm font-semibold text-white">
                      Choose Resume PDF
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      Only PDF files under 4 MB are allowed
                    </span>
                  </button>
                ) : (
                  <div className="flex flex-col gap-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300">
                        <FileText size={22} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-white">
                          {selectedResumeFile.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(selectedResumeFile.size / 1024 / 1024).toFixed(2)}{" "}
                          MB
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={removeSelectedResumeFile}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
                    >
                      <X size={16} />
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Job Link
              </label>
              <input
                type="url"
                name="jobLink"
                value={formData.jobLink}
                onChange={handleChange}
                placeholder="https://careers.company.com/job"
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={5}
                placeholder="Add interview notes, referral details, follow-up plans, or anything important..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/applications"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}