"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Menu, Search, UserCircle, X } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { getApplications } from "../lib/applicationApi";
import { getProfile } from "../lib/profileStorage";
import type { JobApplication, UserProfile } from "../types";

type TopbarProps = {
  onMenuClick: () => void;
};

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function loadApplications() {
    try {
      setIsLoading(true);

      const data = await getApplications();
      setApplications(data);
    } catch {
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setProfile(getProfile());
    loadApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    const searchText = searchTerm.trim().toLowerCase();

    if (!searchText) {
      return [];
    }

    return applications
      .filter((application) => {
        const skillsText = application.skills.join(" ").toLowerCase();

        return (
          application.company.toLowerCase().includes(searchText) ||
          application.role.toLowerCase().includes(searchText) ||
          application.status.toLowerCase().includes(searchText) ||
          skillsText.includes(searchText)
        );
      })
      .slice(0, 6);
  }, [applications, searchTerm]);

  const shouldShowDropdown =
    isSearchFocused && searchTerm.trim().length > 0;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between gap-4 px-4 md:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-xl border border-white/10 p-2 text-slate-300 transition hover:bg-white/5 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="text-sm text-slate-500">InternTrack</p>
            <h1 className="text-lg font-semibold text-white">
              Smart Job Tracker
            </h1>
          </div>
        </div>

        <div className="relative hidden w-full max-w-md md:block">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            placeholder="Search applications..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900 py-3 pl-11 pr-11 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500"
          />

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}

          {shouldShowDropdown && (
            <div
              onMouseDown={(event) => event.preventDefault()}
              className="absolute left-0 right-0 top-14 z-50 overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl"
            >
              {isLoading && (
                <div className="flex items-center gap-3 p-4 text-sm text-slate-400">
                  <Loader2 className="animate-spin" size={16} />
                  Searching database...
                </div>
              )}

              {!isLoading && filteredApplications.length === 0 && (
                <div className="p-4 text-sm text-slate-500">
                  No matching applications found.
                </div>
              )}

              {!isLoading &&
                filteredApplications.map((application) => (
                  <Link
                    key={application.id}
                    href={`/applications/${application.id}/edit`}
                    onClick={() => {
                      setSearchTerm("");
                      setIsSearchFocused(false);
                    }}
                    className="block border-b border-white/5 p-4 transition last:border-b-0 hover:bg-white/5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-sm font-semibold text-white">
                          {application.role}
                        </h2>
                        <p className="mt-1 text-xs text-slate-400">
                          {application.company}
                        </p>
                      </div>

                      <StatusBadge status={application.status} />
                    </div>

                    <p className="mt-2 text-xs text-slate-500">
                      Skills: {application.skills.join(", ") || "No skills"}
                    </p>
                  </Link>
                ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">
              {profile?.name || "User"}
            </p>
            <p className="text-xs text-slate-500">
              {profile?.role || "Job Seeker"}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-900 text-indigo-300">
            <UserCircle size={24} />
          </div>
        </div>
      </div>
    </header>
  );
}