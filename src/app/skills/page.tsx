"use client";

import DashboardLayout from "../../components/DashboardLayout";
import { getApplications } from "../../lib/applicationStorage";
import type { JobApplication } from "../../types";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

const highDemandSkills = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "Docker",
  "AWS",
];

export default function SkillsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  useEffect(() => {
    const savedApplications = getApplications();
    setApplications(savedApplications);
  }, []);

  const skillCounts = getSkillCounts(applications);

  const totalSkills = skillCounts.length;

  const topSkill = skillCounts.length > 0 ? skillCounts[0].name : "None";

  const maxSkillCount =
    skillCounts.length === 0
      ? 1
      : Math.max(...skillCounts.map((skill) => skill.count));

  const existingSkills = new Set(
    skillCounts.map((skill) => skill.name.toLowerCase())
  );

  const missingSkills = highDemandSkills.filter(
    (skill) => !existingSkills.has(skill.toLowerCase())
  );

  const learnedHighDemandSkills = highDemandSkills.filter((skill) =>
    existingSkills.has(skill.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-indigo-300">
          Skill Insights
        </p>

        <h1 className="text-2xl font-bold md:text-3xl">Skills Dashboard</h1>

        <p className="mt-2 text-sm text-slate-400">
          Analyze skills from your saved job applications and find what to learn
          next.
        </p>
      </div>

      <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <SkillStatCard
          title="Unique Skills"
          value={totalSkills}
          description="Skills found in your applications"
          icon={<Brain size={22} />}
        />

        <SkillStatCard
          title="Top Skill"
          value={topSkill}
          description="Most repeated skill"
          icon={<TrendingUp size={22} />}
        />

        <SkillStatCard
          title="High-Demand Covered"
          value={`${learnedHighDemandSkills.length}/${highDemandSkills.length}`}
          description="Skills already present"
          icon={<CheckCircle2 size={22} />}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
              <Sparkles size={22} />
            </div>

            <div>
              <h2 className="text-lg font-semibold">Skills Required</h2>
              <p className="text-sm text-slate-400">
                Skills extracted from all your saved applications.
              </p>
            </div>
          </div>

          {skillCounts.length === 0 ? (
            <EmptyState message="No skills found yet. Add applications with skills to see insights." />
          ) : (
            <div className="space-y-5">
              {skillCounts.map((skill) => {
                const percentage = (skill.count / maxSkillCount) * 100;

                return (
                  <div
                    key={skill.name}
                    className="rounded-xl border border-white/10 bg-[#07111f] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{skill.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Appears in {skill.count} application
                          {skill.count > 1 ? "s" : ""}
                        </p>
                      </div>

                      <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">
                        {Math.round(percentage)}%
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-indigo-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/20 text-yellow-300">
                <AlertCircle size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-yellow-100">
                  Missing Skills
                </h2>

                <p className="text-sm text-slate-400">
                  Useful skills to learn next.
                </p>
              </div>
            </div>

            {missingSkills.length === 0 ? (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4">
                <p className="text-sm text-green-300">
                  Great! You already have many high-demand skills.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {missingSkills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-[#07111f] p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Lightbulb size={18} className="text-yellow-300" />
                      <span className="text-sm font-medium">{skill}</span>
                    </div>

                    <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300">
                      Learn
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-6">
            <h2 className="text-lg font-semibold text-indigo-100">
              Learning Suggestion
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              Focus on skills that appear often in job posts and also match
              your target role.
            </p>

            <div className="mt-5 rounded-xl border border-white/10 bg-[#07111f] p-4">
              <p className="text-sm font-medium text-white">
                Suggested order:
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                React → TypeScript → Next.js → Node.js → PostgreSQL → Docker
              </p>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function getSkillCounts(applications: JobApplication[]) {
  const skillMap: Record<string, number> = {};

  applications.forEach((application) => {
    application.skills.forEach((skill) => {
      const cleanSkill = skill.trim();

      if (!cleanSkill) {
        return;
      }

      const normalizedSkill = normalizeSkillName(cleanSkill);

      if (!skillMap[normalizedSkill]) {
        skillMap[normalizedSkill] = 0;
      }

      skillMap[normalizedSkill] += 1;
    });
  });

  return Object.entries(skillMap)
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

function normalizeSkillName(skill: string) {
  const lowerSkill = skill.toLowerCase();

  if (lowerSkill === "js") return "JavaScript";
  if (lowerSkill === "ts") return "TypeScript";
  if (lowerSkill === "react.js") return "React";
  if (lowerSkill === "nextjs") return "Next.js";
  if (lowerSkill === "nodejs") return "Node.js";
  if (lowerSkill === "tailwind") return "Tailwind CSS";
  if (lowerSkill === "postgres") return "PostgreSQL";
  if (lowerSkill === "postgresql") return "PostgreSQL";

  return skill
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function SkillStatCard({
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

      <h2 className="mt-2 text-2xl font-bold">{value}</h2>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#07111f] p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
        <Brain size={24} />
      </div>

      <h3 className="mt-5 text-lg font-semibold">No skill data yet</h3>

      <p className="mt-2 text-sm text-slate-400">{message}</p>
    </div>
  );
}