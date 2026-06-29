import type { Reminder, ReminderType } from "../types";

const STORAGE_KEY = "interntrack_reminders";

const defaultReminders: Reminder[] = [
  {
    id: 1,
    title: "Interview with Infosys",
    date: "27 Jun 2024, 10:00 AM",
    type: "Interview",
    status: "Upcoming",
  },
  {
    id: 2,
    title: "Follow up with Google",
    date: "29 Jun 2024",
    type: "Follow-up",
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Application Deadline - Microsoft",
    date: "30 Jun 2024",
    type: "Deadline",
    status: "Upcoming",
  },
];

export function getReminders(): Reminder[] {
  if (typeof window === "undefined") {
    return defaultReminders;
  }

  const savedReminders = localStorage.getItem(STORAGE_KEY);

  if (!savedReminders) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReminders));
    return defaultReminders;
  }

  try {
    return JSON.parse(savedReminders) as Reminder[];
  } catch {
    return defaultReminders;
  }
}

export function saveReminders(reminders: Reminder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
}

export function addReminder(reminder: {
  title: string;
  date: string;
  type: ReminderType;
}): Reminder[] {
  const reminders = getReminders();

  const newReminder: Reminder = {
    id: Date.now(),
    title: reminder.title,
    date: reminder.date,
    type: reminder.type,
    status: "Upcoming",
  };

  const updatedReminders: Reminder[] = [newReminder, ...reminders];

  saveReminders(updatedReminders);

  return updatedReminders;
}

export function toggleReminderStatus(reminderId: number): Reminder[] {
  const reminders = getReminders();

  const updatedReminders: Reminder[] = reminders.map((reminder): Reminder => {
    if (reminder.id === reminderId) {
      return {
        ...reminder,
        status: reminder.status === "Upcoming" ? "Completed" : "Upcoming",
      };
    }

    return reminder;
  });

  saveReminders(updatedReminders);

  return updatedReminders;
}

export function deleteReminder(reminderId: number): Reminder[] {
  const reminders = getReminders();

  const updatedReminders: Reminder[] = reminders.filter(
    (reminder) => reminder.id !== reminderId
  );

  saveReminders(updatedReminders);

  return updatedReminders;
}