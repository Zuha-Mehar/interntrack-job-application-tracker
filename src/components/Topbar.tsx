"use client";

import { Bell, Menu, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getApplications } from "../lib/applicationStorage";
import StatusBadge from "./StatusBadge";
import { getProfile } from "../lib/profileStorage";
import type { JobApplication } from "../types";

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [name, setName] = useState("Ananya");
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const profile = getProfile();
    const savedApplications = getApplications();

    setName(profile.name);
    setApplications(savedApplications);
  }, []);

  const searchResults =
    searchText.trim().length === 0
      ? []
      : applications
          .filter((application) => {
            const search = searchText.toLowerCase();

            return (
              application.company.toLowerCase().includes(search) ||
              application.role.toLowerCase().includes(search) ||
              application.status.toLowerCase().includes(search) ||
              application.skills.some((skill) =>
                skill.toLowerCase().includes(search),
              )
            );
          })
          .slice(0, 5);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-[#07111f]/90 px-4 backdrop-blur md:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 md:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="relative w-56 sm:w-72 md:w-96">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search applications..."
            className="w-full rounded-lg border border-white/10 bg-white/5 px-10 py-2 text-sm text-white outline-none placeholder:text-slate-500"
          />

          {searchResults.length > 0 && (
            <div className="absolute left-0 top-12 w-full rounded-xl border border-white/10 bg-[#07111f] p-2 shadow-xl shadow-black/30">
              {searchResults.map((application) => (
                <Link
                  key={application.id}
                  href={`/applications/${application.id}/edit`}
                  onClick={() => setSearchText("")}
                  className="block rounded-lg p-3 hover:bg-white/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {application.company}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {application.role}
                      </p>
                    </div>

                    <StatusBadge status={application.status} />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {searchText.trim().length > 0 && searchResults.length === 0 && (
            <div className="absolute left-0 top-12 w-full rounded-xl border border-white/10 bg-[#07111f] p-4 shadow-xl shadow-black/30">
              <p className="text-sm text-slate-400">No applications found.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Bell size={20} className="hidden text-slate-300 sm:block" />

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold">
            {name ? name.charAt(0).toUpperCase() : "A"}
          </div>

          <span className="hidden text-sm text-slate-300 sm:block">{name}</span>
        </div>
      </div>
    </header>
  );
}
