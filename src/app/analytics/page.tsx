"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  Loader2,
  PieChart,
  TrendingUp,
  Users,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import { getApplications } from "../../lib/applicationApi";
import type { ApplicationStatus, JobApplication } from "../../types";

const statuses: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getMonthFromDate(dateValue: string) {
  const date = new Date(dateValue);

  if (!Number.isNaN(date.getTime())) {
    return months[date.getMonth()];
  }

  const parts = dateValue.split(" ");
  const possibleMonth = parts[1];

  if (months.includes(possibleMonth)) {
    return possibleMonth;
  }

  return "Unknown";
}

function getMonthlyApplications(applications: JobApplication[]) {
  const monthCounts: Record<string, number> = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  applications.forEach((application) => {
    const month = getMonthFromDate(application.appliedDate);

    if (monthCounts[month] !== undefined) {
      monthCounts[month] += 1;
    }
  });

  return months.map((month) => ({
    month,
    count: monthCounts[month],
  }));
}

export default function AnalyticsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadApplications() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getApplications();
      setApplications(data);
    } catch {
      setError("Failed to load analytics data from database.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const totalApplications = applications.length;

  const responses = applications.filter(
    (application) => application.status !== "Applied"
  ).length;

  const interviews = applications.filter(
    (application) => application.status === "Interview"
  ).length;

  const offers = applications.filter(
    (application) => application.status === "Offer"
  ).length;

  const responseRate =
    totalApplications > 0 ? Math.round((responses / totalApplications) * 100) : 0;

  const interviewRate =
    totalApplications > 0
      ? Math.round((interviews / totalApplications) * 100)
      : 0;

  const offerRate =
    totalApplications > 0 ? Math.round((offers / totalApplications) * 100) : 0;

  const statusDistribution = useMemo(() => {
    return statuses.map((status) => ({
      status,
      count: applications.filter((application) => application.status === status)
        .length,
    }));
  }, [applications]);

  const monthlyApplications = useMemo(() => {
    return getMonthlyApplications(applications);
  }, [applications]);

  const maxMonthlyCount = Math.max(
    ...monthlyApplications.map((item) => item.count),
    1
  );

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
                Analytics
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Job search performance
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                View response rates, application trends, and status breakdowns
                from your PostgreSQL database.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <BarChart3 className="text-indigo-300" size={30} />
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-slate-400">
            <Loader2 className="animate-spin" size={20} />
            Loading analytics from database...
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
              <AnalyticsCard
                title="Total Applications"
                value={`${totalApplications}`}
                description="Applications saved"
                icon={<Briefcase size={24} />}
              />

              <AnalyticsCard
                title="Response Rate"
                value={`${responseRate}%`}
                description="Not still applied"
                icon={<TrendingUp size={24} />}
              />

              <AnalyticsCard
                title="Interview Rate"
                value={`${interviewRate}%`}
                description="Reached interview"
                icon={<Users size={24} />}
              />

              <AnalyticsCard
                title="Offer Rate"
                value={`${offerRate}%`}
                description="Reached offer"
                icon={<CheckCircle2 size={24} />}
              />
            </section>

            {applications.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center">
                <BarChart3 className="mx-auto text-slate-500" size={44} />
                <h2 className="mt-4 text-xl font-semibold text-white">
                  No analytics data yet
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Add applications first to generate analytics.
                </p>
              </div>
            )}

            {applications.length > 0 && (
              <>
                <section className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-300">
                        Monthly Applications
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-white">
                        Applications added by month
                      </h2>
                    </div>
                    <BarChart3 className="text-indigo-300" size={26} />
                  </div>

                  <div className="mt-8 flex h-72 items-end gap-3 overflow-x-auto rounded-2xl border border-white/10 bg-slate-950 p-5">
                    {monthlyApplications.map((item) => {
                      const height =
                        item.count > 0
                          ? Math.max((item.count / maxMonthlyCount) * 100, 12)
                          : 4;

                      return (
                        <div
                          key={item.month}
                          className="flex min-w-[54px] flex-1 flex-col items-center justify-end gap-3"
                        >
                          <div className="flex h-52 w-full items-end">
                            <div
                              className="mx-auto w-10 rounded-t-xl bg-indigo-500 transition-all md:w-12"
                              style={{ height: `${height}%` }}
                            />
                          </div>

                          <p className="text-xs font-medium text-slate-400">
                            {item.month}
                          </p>

                          <p className="text-xs text-slate-500">
                            {item.count}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </section>

                <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-indigo-300">
                          Status Breakdown
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-white">
                          Applications by status
                        </h2>
                      </div>
                      <PieChart className="text-indigo-300" size={26} />
                    </div>

                    <div className="mt-6 space-y-5">
                      {statusDistribution.map((item) => {
                        const width =
                          item.count > 0
                            ? (item.count / maxStatusCount) * 100
                            : 0;

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
                          Quick Summary
                        </p>
                        <h2 className="mt-2 text-xl font-semibold text-white">
                          What your data says
                        </h2>
                      </div>
                      <TrendingUp className="text-indigo-300" size={26} />
                    </div>

                    <div className="mt-6 space-y-4">
                      <SummaryItem
                        label="Applications submitted"
                        value={totalApplications}
                      />

                      <SummaryItem
                        label="Applications with response"
                        value={responses}
                      />

                      <SummaryItem
                        label="Interview opportunities"
                        value={interviews}
                      />

                      <SummaryItem label="Offers received" value={offers} />
                    </div>

                    <div className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4">
                      <p className="text-sm leading-6 text-indigo-100">
                        Keep updating your application statuses regularly. Your
                        analytics becomes more useful when the status data is
                        accurate.
                      </p>
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function AnalyticsCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
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

function SummaryItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-lg font-semibold text-white">{value}</span>
    </div>
  );
}