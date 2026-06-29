export type ApplicationStatus =
  | "Applied"
  | "Shortlisted"
  | "Interview"
  | "Offer"
  | "Rejected";

export type JobApplication = {
  id: number;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  skills: string[];
  jobLink?: string;
  notes?: string;
};

export type ReminderStatus = "Upcoming" | "Completed";

export type ReminderType = "Interview" | "Follow-up" | "Deadline";

export type Reminder = {
  id: number;
  title: string;
  date: string;
  type: ReminderType;
  status: ReminderStatus;
};

export type UserProfile={
  name:string;
  email:string;
  role:string;
  location:string;
};