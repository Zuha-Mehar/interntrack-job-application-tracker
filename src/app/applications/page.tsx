"use client";

import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import {
  deleteApplication,
  getApplications,
} from "../../lib/applicationStorage";
import type { JobApplication } from "../../types";
import {
  Briefcase,
  Calendar,
  ExternalLink,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  useEffect(() => {
    const savedApplications = getApplications();
    setApplications(savedApplications);
  }, []);

  function handleDelete(applicationId: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedApplications = deleteApplication(applicationId);
    setApplications(updatedApplications);
  }

  const filteredApplications = applications.filter((app) => {
    const search = searchText.toLowerCase();

    const matchesSearch =
      app.company.toLowerCase().includes(search) ||
      app.role.toLowerCase().includes(search) ||
      app.skills.some((skill) => skill.toLowerCase().includes(search));

    const matchesStatus =
      selectedStatus === "All Status" || app.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-300">
            Application Manager
          </p>

          <h1 className="text-2xl font-bold md:text-3xl">
            All Applications
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage, search, edit, and delete your saved job applications.
          </p>
        </div>

        <Link
          href="/applications/add"
          className="w-fit rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
        >
          + Add Application
        </Link>
      </div>

      <section className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by company, role, or skill..."
              className="w-full rounded-lg border border-white/10 bg-[#07111f] px-10 py-3 text-sm outline-none placeholder:text-slate-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-lg border border-white/10 bg-[#07111f] px-4 py-3 text-sm outline-none"
          >
            <option>All Status</option>
            <option>Applied</option>
            <option>Shortlisted</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </div>
      </section>

      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          Showing{" "}
          <span className="font-semibold text-white">
            {filteredApplications.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-white">
            {applications.length}
          </span>{" "}
          applications
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {filteredApplications.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <Briefcase size={24} />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              No applications found
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Try changing your search or add a new application.
            </p>

            <Link
              href="/applications/add"
              className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium hover:bg-indigo-500"
            >
              Add Application
            </Link>
          </div>
        ) : (
          filteredApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </DashboardLayout>
  );
}

function ApplicationCard({
  app,
  onDelete,
}: {
  app: JobApplication;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-indigo-500/30 hover:bg-white/10">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
            <Briefcase size={22} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold">{app.company}</h2>
              <StatusBadge status={app.status} />
            </div>

            <p className="mt-1 text-sm text-slate-400">{app.role}</p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Applied on {app.appliedDate}</span>
              </div>

              {app.jobLink && (
                <a
                  href={app.jobLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                >
                  <ExternalLink size={14} />
                  Job link
                </a>
              )}
            </div>

            {app.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {app.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-[#07111f] px-3 py-1 text-xs text-slate-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {app.notes && (
              <p className="mt-4 max-w-3xl rounded-lg border border-white/10 bg-[#07111f] p-3 text-sm text-slate-400">
                {app.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 lg:justify-end">
          <Link
            href={`/applications/${app.id}/edit`}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
            title="Edit application"
          >
            <Pencil size={16} />
            Edit
          </Link>

          <button
            onClick={() => onDelete(app.id)}
            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20"
            title="Delete application"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}