"use client";

import DashboardLayout from "../../components/DashboardLayout";
import { getApplications } from "../../lib/applicationStorage";
import type { ApplicationStatus, JobApplication } from "../../types";
import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  PieChart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

const statuses: ApplicationStatus[] = [
  "Applied",
  "Shortlisted",
  "Interview",
  "Offer",
  "Rejected",
];

const statusColors: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-500",
  Shortlisted: "bg-yellow-500",
  Interview: "bg-purple-500",
  Offer: "bg-green-500",
  Rejected: "bg-red-500",
};

export default function AnalyticsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    const savedApplications = getApplications();
    setApplications(savedApplications);
  }, []);

  const totalApplications = applications.length;

  const interviews = applications.filter(
    (app) => app.status === "Interview",
  ).length;

  const offers = applications.filter((app) => app.status === "Offer").length;

  const rejections = applications.filter(
    (app) => app.status === "Rejected",
  ).length;

  const responses = applications.filter(
    (app) => app.status !== "Applied",
  ).length;

  const interviewRate =
    totalApplications === 0
      ? 0
      : Math.round((interviews / totalApplications) * 100);

  const offerRate =
    totalApplications === 0
      ? 0
      : Math.round((offers / totalApplications) * 100);

  const responseRate =
    totalApplications === 0
      ? 0
      : Math.round((responses / totalApplications) * 100);

  const rejectionRate =
    totalApplications === 0
      ? 0
      : Math.round((rejections / totalApplications) * 100);

  const statusData = statuses.map((status) => ({
    label: status,
    count: applications.filter((app) => app.status === status).length,
    color: statusColors[status],
  }));

  const monthlyApplications = getMonthlyApplications(applications);

  const maxMonthlyCount =
    monthlyApplications.length === 0
      ? 1
      : Math.max(...monthlyApplications.map((item) => item.count));

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-indigo-300">
          Performance Analytics
        </p>

        <h1 className="text-2xl font-bold md:text-3xl">Analytics</h1>

        <p className="mt-2 text-sm text-slate-400">
          Understand your application performance, response rate, and progress.
        </p>
      </div>

      <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <AnalyticsStatCard
          title="Total Applications"
          value={totalApplications}
          description="Applications saved"
          icon={<Briefcase size={22} />}
        />

        <AnalyticsStatCard
          title="Response Rate"
          value={`${responseRate}%`}
          description={`${responses} applications got response`}
          icon={<TrendingUp size={22} />}
        />

        <AnalyticsStatCard
          title="Interview Rate"
          value={`${interviewRate}%`}
          description={`${interviews} interview stage`}
          icon={<Users size={22} />}
        />

        <AnalyticsStatCard
          title="Offer Rate"
          value={`${offerRate}%`}
          description={`${offers} successful offers`}
          icon={<CheckCircle2 size={22} />}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <BarChart3 size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Applications Over Time</h2>

              <p className="text-sm text-slate-400">
                Monthly view of your saved applications.
              </p>
            </div>
          </div>

          {monthlyApplications.length === 0 ? (
            <EmptyState message="No application data available yet." />
          ) : (
            <div className="flex h-72 items-end gap-4 rounded-2xl border border-white/10 bg-[#07111f] px-5 pb-5 pt-8">
              {monthlyApplications.map((item) => {
                const height = (item.count / maxMonthlyCount) * 100;

                return (
                  <div
                    key={item.month}
                    className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                  >
                    <span className="text-xs text-slate-400">{item.count}</span>

                    <div className="flex h-48 w-full items-end">
                      <div
                        className="mx-auto w-10 rounded-t-xl bg-indigo-500 transition-all md:w-14"
                        style={{ height: `${height}%` }}
                      />
                    </div>

                    <span className="text-xs text-slate-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <PieChart size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Status Distribution</h2>

              <p className="text-sm text-slate-400">
                Applications by current status.
              </p>
            </div>
          </div>

          {totalApplications === 0 ? (
            <EmptyState message="No applications to analyze yet." />
          ) : (
            <div>
              <div className="mx-auto mb-8 flex h-40 w-40 items-center justify-center rounded-full border-[28px] border-indigo-500 bg-[#07111f]">
                <div className="text-center">
                  <p className="text-3xl font-bold">{totalApplications}</p>
                  <p className="text-xs text-slate-400">Total</p>
                </div>
              </div>

              <div className="space-y-4">
                {statusData.map((status) => {
                  const percentage =
                    totalApplications === 0
                      ? 0
                      : Math.round((status.count / totalApplications) * 100);

                  return (
                    <div key={status.label}>
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={`h-3 w-3 rounded-full ${status.color}`}
                          />

                          <span className="text-sm text-slate-300">
                            {status.label}
                          </span>
                        </div>

                        <span className="text-sm text-slate-400">
                          {percentage}% ({status.count})
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className={`h-2 rounded-full ${status.color}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold">Quick Summary</h2>

          <p className="mt-1 text-sm text-slate-400">
            A simple summary of your job search performance.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <SummaryBox label="Applications" value={totalApplications} />
            <SummaryBox label="Responses" value={responses} />
            <SummaryBox label="Interviews" value={interviews} />
            <SummaryBox label="Offers" value={offers} />
          </div>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6">
          <h2 className="text-lg font-semibold text-indigo-100">Insights</h2>

          <div className="mt-5 space-y-4">
            <InsightItem
              title="Response Rate"
              description={`Your response rate is ${responseRate}%. Try improving your resume and applying to more relevant roles.`}
            />

            <InsightItem
              title="Interview Rate"
              description={`Your interview rate is ${interviewRate}%. Track which skills appear in interview-stage applications.`}
            />

            <InsightItem
              title="Rejection Rate"
              description={`Your rejection rate is ${rejectionRate}%. Use rejected applications to improve future applications.`}
            />
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}

function getMonthlyApplications(applications: JobApplication[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  const monthCounts: Record<string, number> = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
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

function getMonthFromDate(dateString: string) {
  const parts = dateString.split(" ");

  if (parts.length >= 2) {
    return parts[1];
  }

  return "Unknown";
}

function AnalyticsStatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
        {icon}
      </div>

      <p className="text-sm text-slate-400">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function SummaryBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#07111f] p-5">
      <p className="text-sm text-slate-400">{label}</p>

      <h3 className="mt-2 text-2xl font-bold">{value}</h3>
    </div>
  );
}

function InsightItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#07111f] p-4">
      <p className="font-medium">{title}</p>

      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#07111f] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
        <BarChart3 size={24} />
      </div>

      <h3 className="mt-5 text-lg font-semibold">No analytics yet</h3>

      <p className="mt-2 text-sm text-slate-400">{message}</p>
    </div>
  );
}
