import type { ReactNode } from "react";
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
  ShieldCheck,
} from "lucide-react";
import LandingAuthButtons from "../components/LandingAuthButtons";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500">
                <ClipboardList size={24} />
              </div>

              <div>
                <h1 className="text-lg font-bold">InternTrack</h1>
                <p className="text-xs text-slate-500">Smart Job Tracker</p>
              </div>
            </div>

            <div className="hidden items-center gap-8 text-sm text-slate-400 lg:flex">
              <a href="#features" className="transition hover:text-white">
                Features
              </a>
              <a href="#workflow" className="transition hover:text-white">
                Workflow
              </a>
              <a href="#analytics" className="transition hover:text-white">
                Analytics
              </a>
            </div>

            <div className="hidden md:block">
              <LandingAuthButtons variant="nav" />
            </div>
          </nav>
        </header>

        {/* Hero */}
        <section className="mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              <Sparkles size={16} />
              Built for internship and job search tracking
            </div>

            <h2 className="mt-7 max-w-4xl text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              Track every job application in one smart dashboard.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              InternTrack helps you manage applications, interviews, reminders,
              skills, analytics, and job search progress from one clean and
              organized platform.
            </p>

            <div className="mt-8">
              <LandingAuthButtons />
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              <MiniStat label="Applications" value="CRUD" />
              <MiniStat label="Tracking" value="Kanban" />
              <MiniStat label="Insights" value="Analytics" />
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-4 shadow-2xl">
            <div className="rounded-[1.5rem] border border-white/10 bg-slate-950 p-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-sm text-slate-500">Dashboard Preview</p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    Job Search Overview
                  </h3>
                </div>

                <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-300">
                  <BarChart3 size={24} />
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <DashboardStat
                  title="Total Applications"
                  value="24"
                  icon={<ClipboardList size={20} />}
                />
                <DashboardStat
                  title="Interviews"
                  value="6"
                  icon={<CalendarCheck size={20} />}
                />
                <DashboardStat
                  title="Offers"
                  value="2"
                  icon={<CheckCircle2 size={20} />}
                />
                <DashboardStat
                  title="Response Rate"
                  value="42%"
                  icon={<BarChart3 size={20} />}
                />
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">Kanban Pipeline</h4>
                  <Kanban size={20} className="text-indigo-300" />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <KanbanMiniColumn title="Applied" count={10} />
                  <KanbanMiniColumn title="Interview" count={6} />
                  <KanbanMiniColumn title="Offer" count={2} />
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-slate-900/80 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-semibold text-white">
                    Upcoming Reminders
                  </h4>
                  <Bell size={20} className="text-indigo-300" />
                </div>

                <div className="space-y-3">
                  <ReminderPreview title="Google interview" date="Tomorrow" />
                  <ReminderPreview title="Follow up with Infosys" date="Friday" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium text-indigo-300">Features</p>
            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Everything you need to organize your job search
            </h2>
            <p className="mt-4 text-slate-400">
              InternTrack combines tracking, reminders, analytics, and skill
              insights into one beginner-friendly productivity dashboard.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<ClipboardList size={26} />}
              title="Application CRUD"
              description="Add, edit, delete, and manage all job applications with company, role, skills, notes, and job links."
            />

            <FeatureCard
              icon={<Kanban size={26} />}
              title="Kanban Tracking"
              description="Track applications across Applied, Shortlisted, Interview, Offer, and Rejected stages."
            />

            <FeatureCard
              icon={<Bell size={26} />}
              title="Reminders"
              description="Create reminders for interviews, follow-ups, deadlines, and important job search tasks."
            />

            <FeatureCard
              icon={<Brain size={26} />}
              title="Skill Insights"
              description="Analyze the skills appearing in your applications and identify high-demand missing skills."
            />

            <FeatureCard
              icon={<BarChart3 size={26} />}
              title="Analytics"
              description="View response rate, interview rate, offer rate, monthly applications, and status distribution."
            />

            <FeatureCard
              icon={<Search size={26} />}
              title="Global Search"
              description="Search applications quickly by company, role, status, or skills directly from the dashboard topbar."
            />
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" className="mx-auto max-w-7xl px-6 py-24">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl md:p-10">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm font-medium text-indigo-300">
                  Simple Workflow
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">
                  From applying to getting offers
                </h2>
                <p className="mt-4 text-slate-400">
                  InternTrack keeps your application journey organized from the
                  first application to interview preparation and offer tracking.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <WorkflowStep
                  step="01"
                  title="Add application"
                  description="Save company, role, skills, status, job link, and notes."
                />
                <WorkflowStep
                  step="02"
                  title="Track progress"
                  description="Move applications through your Kanban pipeline."
                />
                <WorkflowStep
                  step="03"
                  title="Set reminders"
                  description="Never miss interviews, deadlines, or follow-ups."
                />
                <WorkflowStep
                  step="04"
                  title="Analyze results"
                  description="Review analytics and improve your job search strategy."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Section */}
        <section id="analytics" className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
              <p className="text-sm font-medium text-indigo-300">
                Skill Intelligence
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white">
                Discover your strongest job skills
              </h2>
              <p className="mt-4 text-slate-400">
                InternTrack reads skills from your applications and shows which
                technologies appear most often.
              </p>

              <div className="mt-8 space-y-5">
                <SkillBar skill="React" percent={90} />
                <SkillBar skill="TypeScript" percent={80} />
                <SkillBar skill="Next.js" percent={70} />
                <SkillBar skill="PostgreSQL" percent={60} />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-8 shadow-2xl">
              <div className="rounded-2xl bg-indigo-500/10 p-4 text-indigo-300">
                <ShieldCheck size={32} />
              </div>

              <h2 className="mt-6 text-3xl font-bold text-white">
                Built like a real full-stack project
              </h2>

              <p className="mt-4 text-slate-400">
                InternTrack uses authentication, PostgreSQL database storage,
                Prisma ORM, API routes, reusable components, and a responsive UI
                to demonstrate practical full-stack development skills.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <TechBadge label="Next.js" />
                <TechBadge label="TypeScript" />
                <TechBadge label="Tailwind CSS" />
                <TechBadge label="PostgreSQL" />
                <TechBadge label="Prisma" />
                <TechBadge label="Clerk Auth" />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-10 text-center shadow-2xl">
            <p className="text-sm font-medium text-indigo-300">
              Start organizing your applications
            </p>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold text-white md:text-4xl">
              Keep your job search clear, consistent, and recruiter-ready.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Manage applications, reminders, skills, analytics, and progress
              with a clean dashboard built for students and freshers.
            </p>

            <div className="mt-8 flex justify-center">
              <LandingAuthButtons />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 px-6 py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>© 2026 InternTrack. Built by Zuha Mehar.</p>
            <p>Next.js • TypeScript • Tailwind CSS • PostgreSQL • Prisma</p>
          </div>
        </footer>
      </div>
    </main>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
}

function DashboardStat({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-indigo-500/10 p-2 text-indigo-300">
          {icon}
        </div>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <p className="mt-3 text-sm text-slate-400">{title}</p>
    </div>
  );
}

function KanbanMiniColumn({ title, count }: { title: string; count: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-300">{title}</p>
        <span className="rounded-full bg-indigo-500/10 px-2 py-1 text-xs text-indigo-300">
          {count}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="h-2 rounded-full bg-indigo-500/40" />
        <div className="h-2 w-2/3 rounded-full bg-slate-700" />
      </div>
    </div>
  );
}

function ReminderPreview({ title, date }: { title: string; date: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950 px-4 py-3">
      <p className="text-sm text-slate-300">{title}</p>
      <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300">
        {date}
      </span>
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
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl transition hover:border-indigo-500/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-300">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-semibold text-white">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function WorkflowStep({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950 p-5">
      <span className="text-sm font-bold text-indigo-300">{step}</span>
      <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function SkillBar({ skill, percent }: { skill: string; percent: number }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-300">{skill}</p>
        <p className="text-sm text-slate-500">{percent}%</p>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-950">
        <div
          className="h-full rounded-full bg-indigo-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function TechBadge({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/10 px-4 py-3 text-center text-sm font-medium text-indigo-200">
      {label}
    </div>
  );
}