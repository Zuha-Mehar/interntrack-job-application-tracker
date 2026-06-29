"use client";

import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import { getApplications } from "../../lib/applicationStorage";
import { getProfile } from "../../lib/profileStorage";
import { getReminders } from "../../lib/reminderStorage";
import type { JobApplication, Reminder } from "../../types";
import {
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Send,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [name, setName] = useState("Ananya");

  useEffect(() => {
    const savedApplications = getApplications();
    const savedProfile = getProfile();
    const savedReminders = getReminders();

    setApplications(savedApplications);
    setName(savedProfile.name);
    setReminders(savedReminders);
  }, []);

  const totalApplications = applications.length;

  const applied = applications.filter((app) => app.status === "Applied").length;

  const shortlisted = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const interviews = applications.filter(
    (app) => app.status === "Interview"
  ).length;

  const offers = applications.filter((app) => app.status === "Offer").length;

  const rejections = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

  const responseCount = applications.filter(
    (app) => app.status !== "Applied"
  ).length;

  const responseRate =
    totalApplications === 0
      ? 0
      : Math.round((responseCount / totalApplications) * 100);

  const upcomingReminders = reminders
    .filter((reminder) => reminder.status === "Upcoming")
    .slice(0, 3);

  const recentApplications = applications.slice(0, 4);

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-300">
            Internship Tracker Dashboard
          </p>

          <h1 className="text-2xl font-bold md:text-3xl">
            Welcome back, {name} 👋
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Track your applications, interviews, reminders, and progress.
          </p>
        </div>

        <Link
          href="/applications/add"
          className="w-fit rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
        >
          + Add Application
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Applications"
          value={totalApplications}
          icon={<Briefcase size={22} />}
          description="All saved applications"
        />

        <StatCard
          title="Interviews"
          value={interviews}
          icon={<CalendarCheck size={22} />}
          description="Applications in interview stage"
        />

        <StatCard
          title="Offers"
          value={offers}
          icon={<CheckCircle2 size={22} />}
          description="Successful outcomes"
        />

        <StatCard
          title="Rejected"
          value={rejections}
          icon={<XCircle size={22} />}
          description="Closed applications"
        />
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Application Status</h2>
              <p className="mt-1 text-sm text-slate-400">
                Current distribution of your saved applications.
              </p>
            </div>

            <div className="rounded-full bg-indigo-500/20 px-4 py-2 text-sm text-indigo-300">
              {responseRate}% response rate
            </div>
          </div>

          <div className="space-y-4">
            <StatusProgress
              label="Applied"
              value={applied}
              total={totalApplications}
              color="bg-blue-500"
            />

            <StatusProgress
              label="Shortlisted"
              value={shortlisted}
              total={totalApplications}
              color="bg-yellow-500"
            />

            <StatusProgress
              label="Interview"
              value={interviews}
              total={totalApplications}
              color="bg-purple-500"
            />

            <StatusProgress
              label="Offer"
              value={offers}
              total={totalApplications}
              color="bg-green-500"
            />

            <StatusProgress
              label="Rejected"
              value={rejections}
              total={totalApplications}
              color="bg-red-500"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Upcoming Reminders</h2>
              <p className="mt-1 text-sm text-slate-400">
                Do not miss important tasks.
              </p>
            </div>

            <Clock size={22} className="text-indigo-300" />
          </div>

          <div className="space-y-4">
            {upcomingReminders.length === 0 ? (
              <EmptyState message="No upcoming reminders." />
            ) : (
              upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="rounded-xl border border-white/10 bg-[#07111f] p-4"
                >
                  <p className="font-medium">{reminder.title}</p>

                  <p className="mt-1 text-sm text-slate-400">
                    {reminder.date}
                  </p>

                  <span className="mt-3 inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">
                    {reminder.type}
                  </span>
                </div>
              ))
            )}
          </div>

          <Link
            href="/reminders"
            className="mt-5 inline-block text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            View all reminders →
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Recent Applications</h2>
            <p className="mt-1 text-sm text-slate-400">
              Latest applications added to InternTrack.
            </p>
          </div>

          <Link
            href="/applications"
            className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
          >
            View all →
          </Link>
        </div>

        <div className="space-y-4">
          {recentApplications.length === 0 ? (
            <EmptyState message="No applications added yet." />
          ) : (
            recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col gap-4 rounded-xl border border-white/10 bg-[#07111f] p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300">
                      <Send size={17} />
                    </div>

                    <div>
                      <p className="font-semibold">{app.company}</p>
                      <p className="text-sm text-slate-400">{app.role}</p>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Applied on {app.appliedDate}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge status={app.status} />

                  <Link
                    href={`/applications/${app.id}/edit`}
                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
          {icon}
        </div>

        <TrendingUp size={18} className="text-green-400" />
      </div>

      <p className="text-sm text-slate-400">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function StatusProgress({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-300">{label}</span>

        <span className="text-sm text-slate-400">
          {value} / {total}
        </span>
      </div>

      <div className="h-2 rounded-full bg-white/10">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#07111f] p-5 text-center">
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}