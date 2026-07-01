import type { ApplicationStatus, JobApplication } from "../types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  error?: string;
};

type ApplicationInput = {
  company: string;
  role: string;
  status: ApplicationStatus;
  skills: string[] | string;
  resumeUsed?: string;
  resumeFileName?: string;
  resumeUrl?: string;
  jobLink?: string;
  notes?: string;
};

function formatAppliedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function normalizeApplication(application: JobApplication): JobApplication {
  return {
    ...application,
    appliedDate: formatAppliedDate(application.appliedDate),
  };
}

async function readResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}

export async function getApplications(): Promise<JobApplication[]> {
  const response = await fetch("/api/applications", { cache: "no-store" });
  const result = await readResponse<JobApplication[]>(response);
  return result.data.map(normalizeApplication);
}

export async function getApplicationById(
  applicationId: number
): Promise<JobApplication | null> {
  const response = await fetch(`/api/applications/${applicationId}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    return null;
  }

  const result = await readResponse<JobApplication>(response);
  return normalizeApplication(result.data);
}

export async function addApplication(
  application: ApplicationInput
): Promise<JobApplication> {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(application),
  });

  const result = await readResponse<JobApplication>(response);
  return normalizeApplication(result.data);
}

export async function updateApplication(
  applicationId: number,
  updatedData: Partial<ApplicationInput>
): Promise<JobApplication> {
  const response = await fetch(`/api/applications/${applicationId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });

  const result = await readResponse<JobApplication>(response);
  return normalizeApplication(result.data);
}

export async function deleteApplication(applicationId: number): Promise<void> {
  const response = await fetch(`/api/applications/${applicationId}`, {
    method: "DELETE",
  });

  await readResponse<unknown>(response);
}

export async function clearApplications(): Promise<void> {
  const response = await fetch("/api/applications", {
    method: "DELETE",
  });

  await readResponse<unknown>(response);
}
