import Link from "next/link";
import {
  BarChart3,
  Bell,
  Brain,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Kanban,
  Search,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020817] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.25),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.18),_transparent_30%)]" />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-lg shadow-indigo-600/30">
            💼
          </div>

          <div>
            <h1 className="text-lg font-bold">InternTrack</h1>
            <p className="text-xs text-slate-500">Job Application Tracker</p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#workflow" className="hover:text-white">
            Workflow
          </a>
          <a href="#insights" className="hover:text-white">
            Insights
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden rounded-lg border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 md:block"
          >
            View Demo
          </Link>

          <Link
            href="/dashboard"
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
            <Sparkles size={16} />
            Built for internship and fresher job tracking
          </div>

          <h2 className="max-w-2xl text-4xl font-bold leading-tight md:text-6xl">
            Track your job search like a{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              professional.
            </span>
          </h2>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 md:text-lg">
            InternTrack helps you manage applications, interviews, reminders,
            skills, and analytics in one clean dashboard.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
            >
              Start Tracking
            </Link>

            <Link
              href="/applications"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10"
            >
              View Applications
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4">
            <MiniStat value="24+" label="Applications" />
            <MiniStat value="5" label="Interviews" />
            <MiniStat value="1" label="Offer" />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-indigo-600/20 blur-3xl" />

          <div className="relative rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="rounded-2xl border border-white/10 bg-[#07111f] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Dashboard</p>
                  <h3 className="text-xl font-bold">Welcome back, Zuha 👋</h3>
                </div>

                <div className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-300">
                  Live Demo
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <DashboardStat title="Applications" value="24" />
                <DashboardStat title="Interviews" value="5" />
                <DashboardStat title="Offers" value="1" />
                <DashboardStat title="Rejected" value="2" />
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold">Kanban Board</h4>
                    <Kanban size={18} className="text-indigo-300" />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <KanbanMiniColumn title="Applied" count="8" />
                    <KanbanMiniColumn title="Interview" count="5" />
                    <KanbanMiniColumn title="Offer" count="1" />
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-semibold">Reminders</h4>
                    <Bell size={18} className="text-indigo-300" />
                  </div>

                  <div className="space-y-3">
                    <ReminderPreview title="Infosys Interview" />
                    <ReminderPreview title="Follow up with Google" />
                    <ReminderPreview title="Microsoft Deadline" />
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold">Skill Insights</h4>
                  <Brain size={18} className="text-indigo-300" />
                </div>

                <SkillBar skill="React" width="85%" />
                <SkillBar skill="TypeScript" width="70%" />
                <SkillBar skill="Node.js" width="45%" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-8"
      >
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
            Features
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Everything you need to manage your job search.
          </h2>

          <p className="mt-4 text-slate-400">
            Keep your applications organized and understand your progress with
            simple visual tools.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FeatureCard
            icon={<ClipboardList />}
            title="Application Tracker"
            description="Save company, role, status, skills, notes, and job links."
          />

          <FeatureCard
            icon={<Kanban />}
            title="Kanban Board"
            description="Move applications across Applied, Interview, Offer, and Rejected."
          />

          <FeatureCard
            icon={<CalendarCheck />}
            title="Smart Reminders"
            description="Track interviews, follow-ups, and application deadlines."
          />

          <FeatureCard
            icon={<Brain />}
            title="Skill Insights"
            description="See which skills appear most often in your applications."
          />

          <FeatureCard
            icon={<BarChart3 />}
            title="Analytics"
            description="Track interview rate, offer rate, response rate, and progress."
          />

          <FeatureCard
            icon={<Search />}
            title="Global Search"
            description="Search applications quickly from anywhere in the dashboard."
          />
        </div>
      </section>

      <section
        id="workflow"
        className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-8"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">
                Workflow
              </p>

              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                From applying to getting an offer.
              </h2>

              <p className="mt-4 text-slate-400">
                InternTrack gives you a simple process to follow every time you
                apply for a role.
              </p>
            </div>

            <div className="space-y-5">
              <WorkflowStep
                number="01"
                title="Add application"
                description="Save job details, skills, status, notes, and job link."
              />

              <WorkflowStep
                number="02"
                title="Track progress"
                description="Use the Kanban board to update each application status."
              />

              <WorkflowStep
                number="03"
                title="Follow up on time"
                description="Create reminders for interviews, deadlines, and follow-ups."
              />

              <WorkflowStep
                number="04"
                title="Improve with insights"
                description="Use analytics and skills data to make better applications."
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="insights"
        className="relative z-10 mx-auto max-w-7xl px-6 py-16 pb-24 md:px-8"
      >
        <div className="rounded-3xl border border-indigo-500/20 bg-indigo-500/10 p-8 text-center md:p-12">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to organize your internship search?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Start tracking your applications, interviews, reminders, and skills
            in one clean dashboard.
          </p>

          <Link
            href="/dashboard"
            className="mt-8 inline-block rounded-lg bg-indigo-600 px-7 py-3 text-sm font-semibold shadow-lg shadow-indigo-600/30 hover:bg-indigo-500"
          >
            Open Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}

function DashboardStat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#020817] p-3">
      <p className="text-xs text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function KanbanMiniColumn({ title, count }: { title: string; count: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#020817] p-3">
      <p className="text-xs text-slate-400">{title}</p>
      <p className="mt-2 text-lg font-bold">{count}</p>
    </div>
  );
}

function ReminderPreview({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[#020817] p-2">
      <CheckCircle2 size={14} className="text-green-400" />
      <p className="text-xs text-slate-300">{title}</p>
    </div>
  );
}

function SkillBar({ skill, width }: { skill: string; width: string }) {
  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-slate-300">{skill}</span>
        <span className="text-slate-500">{width}</span>
      </div>

      <div className="h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-indigo-500"
          style={{ width }}
        />
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
        {icon}
      </div>

      <h3 className="text-lg font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function WorkflowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold">
        {number}
      </div>

      <div>
        <h3 className="font-semibold">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}