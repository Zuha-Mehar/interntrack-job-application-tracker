"use client";

import DashboardLayout from "../../components/DashboardLayout";
import {
  addReminder,
  deleteReminder,
  getReminders,
  toggleReminderStatus,
} from "../../lib/reminderStorage";
import type { Reminder, ReminderType } from "../../types";
import {
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

const tabs = ["Upcoming", "Completed", "All"];

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeTab, setActiveTab] = useState("Upcoming");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<ReminderType>("Interview");

  useEffect(() => {
    const savedReminders = getReminders();
    setReminders(savedReminders);
  }, []);

  function handleAddReminder(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !date) {
      alert("Please enter reminder title and date.");
      return;
    }

    const updatedReminders = addReminder({
      title,
      date,
      type,
    });

    setReminders(updatedReminders);
    setTitle("");
    setDate("");
    setType("Interview");
  }

  function handleToggleReminder(reminderId: number) {
    const updatedReminders = toggleReminderStatus(reminderId);
    setReminders(updatedReminders);
  }

  function handleDeleteReminder(reminderId: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this reminder?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedReminders = deleteReminder(reminderId);
    setReminders(updatedReminders);
  }

  const upcomingCount = reminders.filter(
    (reminder) => reminder.status === "Upcoming"
  ).length;

  const completedCount = reminders.filter(
    (reminder) => reminder.status === "Completed"
  ).length;

  const interviewCount = reminders.filter(
    (reminder) => reminder.type === "Interview"
  ).length;

  const filteredReminders =
    activeTab === "All"
      ? reminders
      : reminders.filter((reminder) => reminder.status === activeTab);

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-300">
            Reminder Center
          </p>

          <h1 className="text-2xl font-bold md:text-3xl">Reminders</h1>

          <p className="mt-2 text-sm text-slate-400">
            Manage interviews, follow-ups, and application deadlines.
          </p>
        </div>
      </div>

      <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <ReminderStatCard
          title="Upcoming"
          value={upcomingCount}
          description="Tasks still pending"
          icon={<Clock size={22} />}
        />

        <ReminderStatCard
          title="Completed"
          value={completedCount}
          description="Tasks already done"
          icon={<CheckCircle size={22} />}
        />

        <ReminderStatCard
          title="Interviews"
          value={interviewCount}
          description="Interview-related reminders"
          icon={<Bell size={22} />}
        />
      </section>

      <section className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
            <Plus size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">Add New Reminder</h2>
            <p className="text-sm text-slate-400">
              Create a reminder for interviews, follow-ups, or deadlines.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleAddReminder}
          className="grid grid-cols-1 gap-4 lg:grid-cols-5"
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Follow up with Amazon"
            className="rounded-lg border border-white/10 bg-[#07111f] px-4 py-3 text-sm outline-none placeholder:text-slate-500 lg:col-span-2"
          />

          <input
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Example: 02 Jul 2026, 10:00 AM"
            className="rounded-lg border border-white/10 bg-[#07111f] px-4 py-3 text-sm outline-none placeholder:text-slate-500 lg:col-span-1"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as ReminderType)}
            className="rounded-lg border border-white/10 bg-[#07111f] px-4 py-3 text-sm outline-none"
          >
            <option>Interview</option>
            <option>Follow-up</option>
            <option>Deadline</option>
          </select>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium shadow-lg shadow-indigo-600/20 hover:bg-indigo-500"
          >
            <Plus size={18} />
            Add
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Reminder List</h2>
            <p className="mt-1 text-sm text-slate-400">
              View, complete, or delete your saved reminders.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm transition ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "bg-[#07111f] text-slate-400 hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredReminders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#07111f] p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <Bell size={24} />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No reminders found
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Add a reminder above to start tracking important tasks.
              </p>
            </div>
          ) : (
            filteredReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                onToggle={handleToggleReminder}
                onDelete={handleDeleteReminder}
              />
            ))
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

function ReminderCard({
  reminder,
  onToggle,
  onDelete,
}: {
  reminder: Reminder;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#07111f] p-5 transition hover:border-indigo-500/30 hover:bg-[#0b1627]">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <button
            onClick={() => onToggle(reminder.id)}
            className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
              reminder.status === "Completed"
                ? "border-green-500/40 bg-green-500/20 text-green-300"
                : "border-white/20 text-slate-500 hover:bg-white/10"
            }`}
            title="Toggle completed"
          >
            {reminder.status === "Completed" && <CheckCircle size={16} />}
          </button>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
            {reminder.status === "Completed" ? (
              <CheckCircle size={22} />
            ) : (
              <Clock size={22} />
            )}
          </div>

          <div>
            <h3
              className={`font-semibold ${
                reminder.status === "Completed"
                  ? "text-slate-500 line-through"
                  : "text-white"
              }`}
            >
              {reminder.title}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
              <Calendar size={15} />
              <span>{reminder.date}</span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <ReminderTypeBadge type={reminder.type} />

              <span
                className={`rounded-full border px-3 py-1 text-xs ${
                  reminder.status === "Completed"
                    ? "border-green-500/30 bg-green-500/20 text-green-300"
                    : "border-blue-500/30 bg-blue-500/20 text-blue-300"
                }`}
              >
                {reminder.status}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(reminder.id)}
          className="flex w-fit items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 hover:bg-red-500/20"
          title="Delete reminder"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}

function ReminderTypeBadge({ type }: { type: ReminderType }) {
  const styles: Record<ReminderType, string> = {
    Interview: "border-purple-500/30 bg-purple-500/20 text-purple-300",
    "Follow-up": "border-blue-500/30 bg-blue-500/20 text-blue-300",
    Deadline: "border-yellow-500/30 bg-yellow-500/20 text-yellow-300",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs ${styles[type]}`}>
      {type}
    </span>
  );
}

function ReminderStatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
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