"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Lightbulb,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import { getApplications } from "../../lib/applicationApi";
import type { JobApplication } from "../../types";

const highDemandSkills = [
  "React",
  "TypeScript",
  "Next.js",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "REST API",
  "Git",
  "Python",
  "Docker",
];

type SkillStat = {
  name: string;
  count: number;
};

function normalizeSkillName(skill: string) {
  const value = skill.trim().toLowerCase();

  const skillMap: Record<string, string> = {
    js: "javascript",
    javascript: "javascript",
    ts: "typescript",
    typescript: "typescript",
    reactjs: "react",
    "react.js": "react",
    react: "react",
    nextjs: "next.js",
    "next.js": "next.js",
    tailwind: "tailwind css",
    "tailwind css": "tailwind css",
    postgres: "postgresql",
    postgresql: "postgresql",
    node: "node.js",
    nodejs: "node.js",
    "node.js": "node.js",
    prisma: "prisma",
    git: "git",
    python: "python",
    docker: "docker",
    api: "rest api",
    "rest api": "rest api",
  };

  return skillMap[value] || value;
}

function formatSkillName(skill: string) {
  const formattedNames: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    react: "React",
    "next.js": "Next.js",
    "tailwind css": "Tailwind CSS",
    postgresql: "PostgreSQL",
    "node.js": "Node.js",
    prisma: "Prisma",
    git: "Git",
    python: "Python",
    docker: "Docker",
    "rest api": "REST API",
  };

  return formattedNames[skill] || skill;
}

function getSkillStats(applications: JobApplication[]) {
  const skillCounts: Record<string, number> = {};

  applications.forEach((application) => {
    application.skills.forEach((skill) => {
      const normalizedSkill = normalizeSkillName(skill);

      if (!normalizedSkill) {
        return;
      }

      if (!skillCounts[normalizedSkill]) {
        skillCounts[normalizedSkill] = 0;
      }

      skillCounts[normalizedSkill] += 1;
    });
  });

  return Object.entries(skillCounts)
    .map(([name, count]) => ({
      name: formatSkillName(name),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export default function SkillsPage() {
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
      setError("Failed to load skills data from database.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const skillStats = useMemo(() => {
    return getSkillStats(applications);
  }, [applications]);

  const topSkill = skillStats[0]?.name || "No skills yet";

  const coveredHighDemandSkills = highDemandSkills.filter((skill) =>
    skillStats.some(
      (skillStat) =>
        normalizeSkillName(skillStat.name) === normalizeSkillName(skill)
    )
  );

  const missingSkills = highDemandSkills.filter(
    (skill) =>
      !skillStats.some(
        (skillStat) =>
          normalizeSkillName(skillStat.name) === normalizeSkillName(skill)
      )
  );

  const maxSkillCount = Math.max(...skillStats.map((skill) => skill.count), 1);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-300">
                Skills Insights
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Understand your job skill patterns
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-400">
                InternTrack analyzes skills from your PostgreSQL applications
                and shows your strongest and missing skills.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <Brain className="text-indigo-300" size={30} />
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="flex items-center justify-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 p-8 text-slate-400">
            <Loader2 className="animate-spin" size={20} />
            Loading skills from database...
          </div>
        )}

        {error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
            {error}
          </div>
        )}

        {!isLoading && !error && (
          <>
            <section className="grid gap-5 md:grid-cols-3">
              <SkillSummaryCard
                title="Unique Skills"
                value={skillStats.length.toString()}
                description="Skills found in applications"
                icon={<Sparkles size={24} />}
              />

              <SkillSummaryCard
                title="Top Skill"
                value={topSkill}
                description="Most repeated skill"
                icon={<TrendingUp size={24} />}
              />

              <SkillSummaryCard
                title="High-Demand Covered"
                value={`${coveredHighDemandSkills.length}/${highDemandSkills.length}`}
                description="Recruiter-friendly skills"
                icon={<CheckCircle2 size={24} />}
              />
            </section>

            {applications.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-10 text-center">
                <Brain className="mx-auto text-slate-500" size={44} />
                <h2 className="mt-4 text-xl font-semibold text-white">
                  No skills data yet
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Add applications with skills to generate skill insights.
                </p>
              </div>
            )}

            {applications.length > 0 && (
              <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-300">
                        Skill Frequency
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-white">
                        Skills used across applications
                      </h2>
                    </div>
                    <Brain className="text-indigo-300" size={26} />
                  </div>

                  <div className="mt-6 space-y-5">
                    {skillStats.length === 0 && (
                      <p className="rounded-2xl border border-dashed border-white/10 bg-slate-950 p-5 text-sm text-slate-500">
                        No skills found. Edit applications and add skills.
                      </p>
                    )}

                    {skillStats.map((skill) => {
                      const width = (skill.count / maxSkillCount) * 100;

                      return (
                        <div key={skill.name}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-300">
                              {skill.name}
                            </span>
                            <span className="text-sm text-slate-400">
                              {skill.count}
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

                <div className="space-y-6">
                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-green-400" size={24} />
                      <h2 className="text-xl font-semibold text-white">
                        Skills You Already Cover
                      </h2>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {coveredHighDemandSkills.length === 0 && (
                        <p className="text-sm text-slate-500">
                          No high-demand skills found yet.
                        </p>
                      )}

                      {coveredHighDemandSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="text-yellow-400" size={24} />
                      <h2 className="text-xl font-semibold text-white">
                        Missing High-Demand Skills
                      </h2>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {missingSkills.length === 0 && (
                        <p className="text-sm text-slate-500">
                          Great! You cover all suggested skills.
                        </p>
                      )}

                      {missingSkills.slice(0, 8).map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl">
                    <div className="flex items-center gap-3">
                      <Lightbulb className="text-indigo-300" size={24} />
                      <h2 className="text-xl font-semibold text-white">
                        Learning Suggestion
                      </h2>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-slate-400">
                      Focus on skills that appear often in your target job
                      posts. For frontend and full-stack roles, prioritize
                      TypeScript, Next.js, PostgreSQL, Prisma, APIs, and
                      deployment.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function SkillSummaryCard({
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

      <p className="mt-6 text-2xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-400">{title}</p>
    </div>
  );
}