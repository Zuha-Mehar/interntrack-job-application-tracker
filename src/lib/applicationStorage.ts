import { applications as mockApplications } from "@/data/mockData";
import type { ApplicationStatus, JobApplication } from "@/types";

const STORAGE_KEY = "interntrack_applications";

export function getApplications(): JobApplication[] {
  if (typeof window === "undefined") {
    return mockApplications as JobApplication[];
  }

  const savedApplications = localStorage.getItem(STORAGE_KEY);

  if (!savedApplications) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockApplications));
    return mockApplications as JobApplication[];
  }

  try {
    return JSON.parse(savedApplications);
  } catch {
    return mockApplications as JobApplication[];
  }
}

export function saveApplications(applications: JobApplication[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

export function addApplication(application: {
  company: string;
  role: string;
  status: ApplicationStatus;
  jobLink?: string;
  notes?: string;
  skills: string[];
}) {
  const applications = getApplications();

  const newApplication: JobApplication = {
    id: Date.now(),
    company: application.company,
    role: application.role,
    status: application.status,
    jobLink: application.jobLink,
    notes: application.notes,
    skills: application.skills,
    appliedDate: new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
  };

  const updatedApplications = [newApplication, ...applications];

  saveApplications(updatedApplications);

  return newApplication;
}

export function deleteApplication(applicationId: number) {
  const applications = getApplications();

  const updatedApplications = applications.filter(
    (application) => application.id !== applicationId
  );

  saveApplications(updatedApplications);

  return updatedApplications;
}

export function getApplicationById(applicationId: number) {
  const applications = getApplications();

  return applications.find(
    (application) => application.id === applicationId
  );
}

export function updateApplication(
  applicationId: number,
  updatedData: {
    company: string;
    role: string;
    status: ApplicationStatus;
    jobLink?: string;
    notes?: string;
    skills: string[];
  }
) {
  const applications = getApplications();

  const updatedApplications = applications.map((application) =>
    application.id === applicationId
      ? {
          ...application,
          ...updatedData,
        }
      : application
  );

  saveApplications(updatedApplications);

  return updatedApplications;
}