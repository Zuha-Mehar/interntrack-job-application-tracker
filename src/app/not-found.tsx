import Link from "next/link";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#020817] px-6 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/30">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/20 text-indigo-300">
          <SearchX size={36} />
        </div>

        <p className="mt-8 text-sm font-medium uppercase tracking-wider text-indigo-300">
          404 Error
        </p>

        <h1 className="mt-3 text-3xl font-bold md:text-4xl">
          Page not found
        </h1>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          The page you are looking for does not exist or may have been moved.
          Go back to your dashboard and continue tracking your applications.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
          >
            <Home size={18} />
            Go to Dashboard
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-5 py-3 text-sm text-slate-300 hover:bg-white/10"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}