import type { JobApplication } from "../types";

function escapeCsvValue(value: string | number | undefined) {
  if (value === undefined || value === null) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

function getResumeViewLink(application: JobApplication) {
  if (!application.resumeUrl) {
    return "";
  }

  return `${window.location.origin}/api/applications/${application.id}/resume`;
}

export function exportApplicationsToCsv(
  applications: JobApplication[],
  filename = "interntrack-applications.csv"
) {
  if (applications.length === 0) {
    alert("No applications available to export.");
    return;
  }

  const headers = [
    "Company",
    "Role",
    "Status",
    "Applied Date",
    "Skills",
    "Resume Used",
    "Resume File Name",
    "Resume View Link",
    "Job Link",
    "Notes",
  ];

  const rows = applications.map((application) => [
    application.company,
    application.role,
    application.status,
    application.appliedDate,
    application.skills.join(", "),
    application.resumeUsed || "",
    application.resumeFileName || "",
    getResumeViewLink(application),
    application.jobLink || "",
    application.notes || "",
  ]);

  const csvContent = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}