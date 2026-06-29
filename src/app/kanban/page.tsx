"use client";

import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import {
  getApplications,
  saveApplications,
} from "../../lib/applicationStorage";
import type { ApplicationStatus, JobApplication } from "../../types";
import {
  Briefcase,
  GripVertical,
  MoreVertical,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const columns: {
  status: ApplicationStatus;
  title: string;
  description: string;
  bg: string;
  border: string;
  text: string;
}[] = [
  {
    status: "Applied",
    title: "Applied",
    description: "Applications you have submitted.",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-300",
  },
  {
    status: "Shortlisted",
    title: "Shortlisted",
    description: "Applications selected for next step.",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    text: "text-yellow-300",
  },
  {
    status: "Interview",
    title: "Interview",
    description: "Applications with interview rounds.",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-300",
  },
  {
    status: "Offer",
    title: "Offer",
    description: "Applications where you got selected.",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-300",
  },
  {
    status: "Rejected",
    title: "Rejected",
    description: "Applications that are closed.",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    text: "text-red-300",
  },
];

export default function KanbanPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    const savedApplications = getApplications();
    setApplications(savedApplications);
  }, []);

  function updateApplicationStatus(
    applicationId: number,
    newStatus: ApplicationStatus
  ) {
    const updatedApplications = applications.map((application) =>
      application.id === applicationId
        ? { ...application, status: newStatus }
        : application
    );

    setApplications(updatedApplications);
    saveApplications(updatedApplications);
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-300">
            Visual Pipeline
          </p>

          <h1 className="text-2xl font-bold md:text-3xl">Kanban Board</h1>

          <p className="mt-2 text-sm text-slate-400">
            Track your applications by status and update progress quickly.
          </p>
        </div>

        <Link
          href="/applications/add"
          className="flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
        >
          <Plus size={18} />
          Add Application
        </Link>
      </div>

      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
        {columns.map((column) => {
          const count = applications.filter(
            (app) => app.status === column.status
          ).length;

          return (
            <div
              key={column.status}
              className={`rounded-2xl border ${column.border} ${column.bg} p-4`}
            >
              <p className={`text-sm font-semibold ${column.text}`}>
                {column.title}
              </p>

              <h2 className="mt-2 text-3xl font-bold">{count}</h2>

              <p className="mt-1 text-xs text-slate-400">
                {column.description}
              </p>
            </div>
          );
        })}
      </section>

      <div className="flex gap-5 overflow-x-auto pb-4">
        {columns.map((column) => {
          const filteredApplications = applications.filter(
            (app) => app.status === column.status
          );

          return (
            <KanbanColumn
              key={column.status}
              column={column}
              applications={filteredApplications}
              onStatusChange={updateApplicationStatus}
            />
          );
        })}
      </div>
    </DashboardLayout>
  );
}

function KanbanColumn({
  column,
  applications,
  onStatusChange,
}: {
  column: (typeof columns)[number];
  applications: JobApplication[];
  onStatusChange: (id: number, status: ApplicationStatus) => void;
}) {
  return (
    <div
      className={`min-h-[560px] min-w-[300px] flex-1 rounded-2xl border p-4 ${column.bg} ${column.border}`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className={`font-semibold ${column.text}`}>
            {column.title} ({applications.length})
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {column.description}
          </p>
        </div>

        <MoreVertical size={18} className="text-slate-400" />
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-[#07111f]/70 p-5 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-400">
              <Briefcase size={18} />
            </div>

            <p className="mt-3 text-sm text-slate-400">
              No applications here.
            </p>
          </div>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>

      <Link
        href="/applications/add"
        className={`mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#07111f]/70 px-4 py-3 text-sm font-medium ${column.text} hover:bg-white/10`}
      >
        <Plus size={16} />
        Add Application
      </Link>
    </div>
  );
}

function ApplicationCard({
  application,
  onStatusChange,
}: {
  application: JobApplication;
  onStatusChange: (id: number, status: ApplicationStatus) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#07111f] p-4 shadow-lg shadow-black/20 transition hover:border-indigo-500/30 hover:bg-[#0b1627]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
            <Briefcase size={18} />
          </div>

          <div>
            <h3 className="font-semibold">{application.company}</h3>

            <p className="mt-1 text-sm text-slate-400">
              {application.role}
            </p>

            <p className="mt-2 text-xs text-slate-500">
              Applied on {application.appliedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <GripVertical size={18} />
        </div>
      </div>

      <StatusBadge status={application.status} />

      {application.skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {application.skills.map((skill) => (
            <span
              key={skill}
              className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-300"
            >
              <Sparkles size={12} />
              {skill}
            </span>
          ))}
        </div>
      )}

      {application.notes && (
        <p className="mt-4 rounded-lg border border-white/10 bg-[#020817] p-3 text-xs leading-5 text-slate-400">
          {application.notes}
        </p>
      )}

      <div className="mt-4">
        <label className="mb-2 block text-xs text-slate-500">
          Update status
        </label>

        <select
          value={application.status}
          onChange={(e) =>
            onStatusChange(
              application.id,
              e.target.value as ApplicationStatus
            )
          }
          className="w-full rounded-lg border border-white/10 bg-[#020817] px-3 py-2 text-sm text-white outline-none"
        >
          <option>Applied</option>
          <option>Shortlisted</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      <Link
        href={`/applications/${application.id}/edit`}
        className="mt-3 block rounded-lg border border-white/10 px-3 py-2 text-center text-sm text-slate-300 hover:bg-white/10"
      >
        Edit Details
      </Link>
    </div>
  );
}