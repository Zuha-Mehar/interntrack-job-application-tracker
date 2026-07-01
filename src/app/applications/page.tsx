"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import { deleteApplication, getApplications } from "../../lib/applicationApi";
import { exportApplicationsToCsv } from "../../lib/csvExport";
import type { ApplicationStatus, JobApplication } from "../../types";

const statusOptions: ("All" | ApplicationStatus)[] = [
  "All",
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ApplicationStatus>(
    "All",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadApplications() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getApplications();
      setApplications(data);
    } catch {
      setError("Failed to load applications from database.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const searchText = searchTerm.toLowerCase();

      const matchesSearch =
        application.company.toLowerCase().includes(searchText) ||
        application.role.toLowerCase().includes(searchText) ||
        application.status.toLowerCase().includes(searchText) ||
        application.skills.join(" ").toLowerCase().includes(searchText) ||
        (application.resumeUsed || "").toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, searchTerm, statusFilter]);

  async function handleDelete(applicationId: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteApplication(applicationId);

      setApplications((currentApplications) =>
        currentApplications.filter(
          (application) => application.id !== applicationId,
        ),
      );
    } catch {
      alert("Failed to delete application.");
    }
  }

  function handleExportCsv() {
    exportApplicationsToCsv(filteredApplications);
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-300">
                Application Manager
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Track all job applications
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                View, search, filter, edit, delete, and export your saved
                applications from one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleExportCsv}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5"
              >
                <Download size={18} />
                Export CSV
              </button>

              <Link
                href="/applications/add"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
              >
                <Plus size={18} />
                Add Application
              </Link>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="text"
                placeholder="Search by company, role, skill, status, or resume used..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "All" | ApplicationStatus)
              }
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </section>

        {isLoading && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-center text-slate-400">
            Loading applications from database...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
            {error}
          </div>
        )}

        {!isLoading && !error && filteredApplications.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center">
            <Briefcase className="mx-auto text-slate-500" size={42} />
            <h2 className="mt-4 text-xl font-semibold text-white">
              No applications found
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Add your first job application or change your search/filter.
            </p>
          </div>
        )}

        {!isLoading && !error && filteredApplications.length > 0 && (
          <section className="grid gap-5">
            {filteredApplications.map((application) => (
              <div
                key={application.id}
                className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl transition hover:border-indigo-500/40"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-white">
                          {application.role}
                        </h2>
                        <StatusBadge status={application.status} />
                      </div>

                      <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                        <Briefcase size={16} />
                        {application.company}
                      </p>
                    </div>

                    <p className="flex items-center gap-2 text-sm text-slate-400">
                      <Calendar size={16} />
                      Applied on {application.appliedDate}
                    </p>

                    {application.resumeUsed && (
                      <p className="text-sm text-slate-400">
                        Resume Used:{" "}
                        <span className="font-medium text-indigo-300">
                          {application.resumeUsed}
                        </span>
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {application.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {application.notes && (
                      <p className="max-w-3xl text-sm text-slate-400">
                        {application.notes}
                      </p>
                    )}

                    {application.resumeUrl && (
                      <a
                        href={`/api/applications/${application.id}/resume`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-300 hover:text-emerald-200"
                      >
                        <FileText size={16} />
                        View resume PDF
                      </a>
                    )}

                    {application.jobLink && (
                      <a
                        href={application.jobLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200"
                      >
                        <ExternalLink size={16} />
                        View job link
                      </a>
                    )}
                  </div>

                  <div className="flex gap-3 lg:flex-col">
                    <Link
                      href={`/applications/${application.id}/edit`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-indigo-500/40 hover:bg-indigo-500/10"
                    >
                      <Pencil size={16} />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(application.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}
