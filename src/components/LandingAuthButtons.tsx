"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, LogIn } from "lucide-react";

type LandingAuthButtonsProps = {
  variant?: "hero" | "nav";
};

export default function LandingAuthButtons({
  variant = "hero",
}: LandingAuthButtonsProps) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (variant === "nav") {
    return (
      <div className="flex items-center gap-3">
        {isSignedIn ? (
          <Link
            href="/dashboard"
            className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              href="/sign-in"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {isSignedIn ? (
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-indigo-400"
        >
          Go to Dashboard
          <ArrowRight size={18} />
        </Link>
      ) : (
        <>
          <Link
            href="/sign-up"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-4 text-sm font-semibold text-white transition hover:bg-indigo-400"
          >
            Create Free Account
            <ArrowRight size={18} />
          </Link>

          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-6 py-4 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
          >
            <LogIn size={18} />
            Sign In
          </Link>
        </>
      )}
    </div>
  );
}