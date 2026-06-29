"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Loader2,
  TrendingUp,
  XCircle,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import { getApplications } from "../../lib/applicationApi";
import { getProfile } from "../../lib/profileStorage";
import { getReminders } from "../../lib/reminderStorage";
import type {
  ApplicationStatus,
  JobApplication,
  Reminder,
  UserProfile,
} from "../../types";

const statuses: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];

export default function DashboardPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboardData() {
    try {
      setIsLoading(true);
      setError("");

      const applicationData = await getApplications();

      setApplications(applicationData);
      setReminders(getReminders());
      setProfile(getProfile());
    } catch {
      setError("Failed to load dashboard data from database.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalApplications = applications.length;

  const interviews = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const offers = applications.filter(
    (application) => application.status === "Offer"
  ).length;

  const rejected = applications.filter(
    (application) => application.status === "Rejected"
  ).length;

  const responses = applications.filter(
    (application) => application.status !== "Applied"
  ).length;

  const responseRate =
    totalApplications > 0 ? Math.round((responses / totalApplications) * 100) : 0;

  const recentApplications = applications.slice(0, 4);

  const upcomingReminders = reminders
    .filter((reminder) => reminder.status === "Upcoming")
    .slice(0, 3);

  const statusDistribution = useMemo(() => {
    return statuses.map((status) => ({
      status,
      count: applications.filter((application) => application.status === status)
        .length,
    }));
  }, [applications]);

  const maxStatusCount = Math.max(
    ...statusDistribution.map((item) => item.count),
    1
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-300">
                Welcome back, {profile?.name || "User"} 👋
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Your job search dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                Track applications, interviews, reminders, and progress from
                your PostgreSQL database.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Response Rate
              </p>
              <p className="mt-2 text-3xl font-bold text-white">
                {responseRate}%
              </p>
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-slate-400">
            <Loader2 className="animate-spin" size={20} />
            Loading dashboard from database...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Total Applications"
                value={totalApplications}
                icon={<Briefcase size={24} />}
                description="Saved applications"
              />

              <StatCard
                title="Interviews"
                value={interviews}
                icon={<CalendarCheck size={24} />}
                description="Interview stage"
              />

              <StatCard
                title="Offers"
                value={offers}
                icon={<CheckCircle2 size={24} />}
                description="Successful offers"
              />

              <StatCard
                title="Rejected"
                value={rejected}
                icon={<XCircle size={24} />}
                description="Rejected applications"
              />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-300">
                      Application Status
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-white">
                      Pipeline distribution
                    </h2>
                  </div>
                  <BarChart3 className="text-indigo-300" size={26} />
                </div>

                <div className="mt-6 space-y-5">
                  {statusDistribution.map((item) => {
                    const width = (item.count / maxStatusCount) * 100;

                    return (
                      <div key={item.status}>
                        <div className="mb-2 flex items-center justify-between">
                          <StatusBadge status={item.status} />
                          <span className="text-sm font-medium text-slate-300">
                            {item.count}
                          </span>
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-950">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-300">
                      Progress Summary
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-white">
                      Quick insights
                    </h2>
                  </div>
                  <TrendingUp className="text-indigo-300" size={26} />
                </div>

                <div className="mt-6 space-y-4">
                  <InsightItem
                    label="Applications sent"
                    value={totalApplications}
                  />
                  <InsightItem label="Responses received" value={responses} />
                  <InsightItem label="Interview opportunities" value={interviews} />
                  <InsightItem label="Offers received" value={offers} />
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white">
                  Recent Applications
                </h2>

                <div className="mt-5 space-y-4">
                  {recentApplications.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-white/10 bg-slate-950 p-5 text-sm text-slate-500">
                      No applications yet. Add your first application.
                    </p>
                  )}

                  {recentApplications.map((application) => (
                    <div
                      key={application.id}
                      className="rounded-2xl border border-white/10 bg-slate-950 p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-white">
                            {application.role}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {application.company}
                          </p>
                        </div>

                        <StatusBadge status={application.status} />
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        Applied on {application.appliedDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
                <h2 className="text-xl font-semibold text-white">
                  Upcoming Reminders
                </h2>

                <div className="mt-5 space-y-4">
                  {upcomingReminders.length === 0 && (
                    <p className="rounded-2xl border border-dashed border-white/10 bg-slate-950 p-5 text-sm text-slate-500">
                      No upcoming reminders.
                    </p>
                  )}

                  {upcomingReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="rounded-2xl border border-white/10 bg-slate-950 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-white">
                            {reminder.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-400">
                            {reminder.date}
                          </p>
                        </div>

                        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
                          {reminder.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
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
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-300">
          {icon}
        </div>
        <span className="text-xs text-slate-500">{description}</span>
      </div>

      <p className="mt-6 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{title}</p>
    </div>
  );
}

function InsightItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-lg font-semibold text-white">{value}</span>
    </div>
  );
}