"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  GripVertical,
  Loader2,
  Pencil,
  Sparkles,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import { getApplications, updateApplication } from "../../lib/applicationApi";
import type { ApplicationStatus, JobApplication } from "../../types";

const statuses: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];

export default function KanbanPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function loadApplications() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getApplications();
      setApplications(data);
    } catch {
      setError("Failed to load Kanban data from database.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const groupedApplications = useMemo(() => {
    return statuses.map((status) => ({
      status,
      applications: applications.filter(
        (application) => application.status === status
      ),
    }));
  }, [applications]);

  async function handleStatusChange(
    applicationId: number,
    newStatus: ApplicationStatus
  ) {
    const previousApplications = applications;

    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === applicationId
          ? { ...application, status: newStatus }
          : application
      )
    );

    try {
      setUpdatingId(applicationId);

      await updateApplication(applicationId, {
        status: newStatus,
      });
    } catch {
      setApplications(previousApplications);
      alert("Failed to update status in database.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-300">
                Kanban Board
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Track application progress
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                Move applications across stages and keep your job search
                pipeline organized. Status changes are saved in PostgreSQL.
              </p>
            </div>

            <Link
              href="/applications/add"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              <Sparkles size={18} />
              Add Application
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
          {groupedApplications.map((column) => (
            <div
              key={column.status}
              className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <StatusBadge status={column.status} />
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-300">
                  {column.applications.length}
                </span>
              </div>
            </div>
          ))}
        </section>

        {isLoading && (
          <div className="flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-slate-400">
            <Loader2 className="animate-spin" size={20} />
            Loading Kanban board from database...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
            {error}
          </div>
        )}

        {!isLoading && !error && applications.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center">
            <Briefcase className="mx-auto text-slate-500" size={42} />
            <h2 className="mt-4 text-xl font-semibold text-white">
              No applications yet
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Add your first application to see it on the Kanban board.
            </p>

            <Link
              href="/applications/add"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Add Application
            </Link>
          </div>
        )}

        {!isLoading && !error && applications.length > 0 && (
          <section className="grid gap-5 xl:grid-cols-5">
            {groupedApplications.map((column) => (
              <div
                key={column.status}
                className="min-h-[420px] rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-xl"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <StatusBadge status={column.status} />
                    <p className="mt-2 text-xs text-slate-500">
                      {column.applications.length} applications
                    </p>
                  </div>
                  <GripVertical size={18} className="text-slate-600" />
                </div>

                <div className="space-y-4">
                  {column.applications.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-5 text-center text-sm text-slate-500">
                      No applications
                    </div>
                  )}

                  {column.applications.map((application) => (
                    <div
                      key={application.id}
                      className="rounded-2xl border border-white/10 bg-slate-950 p-4 transition hover:border-indigo-500/40"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-semibold text-white">
                            {application.role}
                          </h2>
                          <p className="mt-1 text-sm text-slate-400">
                            {application.company}
                          </p>
                        </div>

                        {updatingId === application.id && (
                          <Loader2
                            size={16}
                            className="animate-spin text-indigo-300"
                          />
                        )}
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        Applied on {application.appliedDate}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {application.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4">
                        <label className="mb-2 block text-xs font-medium text-slate-500">
                          Move to
                        </label>
                        <select
                          value={application.status}
                          onChange={(event) =>
                            handleStatusChange(
                              application.id,
                              event.target.value as ApplicationStatus
                            )
                          }
                          disabled={updatingId === application.id}
                          className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <Link
                          href={`/applications/${application.id}/edit`}
                          className="inline-flex items-center gap-2 text-xs font-medium text-indigo-300 hover:text-indigo-200"
                        >
                          <Pencil size={14} />
                          Edit Details
                        </Link>

                        {application.status === "Offer" && (
                          <CheckCircle2 size={16} className="text-green-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </DashboardLayout>
  );
}