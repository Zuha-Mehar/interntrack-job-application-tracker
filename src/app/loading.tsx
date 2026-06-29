import { Briefcase } from "lucide-react";

export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020817] px-6 text-white">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/20 text-indigo-300">
          <Briefcase size={36} />
        </div>

        <h1 className="mt-6 text-2xl font-bold">Loading InternTrack...</h1>

        <p className="mt-2 text-sm text-slate-400">
          Preparing your dashboard and application data.
        </p>

        <div className="mx-auto mt-8 h-2 w-64 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-indigo-500" />
        </div>
      </div>
    </main>
  );
}