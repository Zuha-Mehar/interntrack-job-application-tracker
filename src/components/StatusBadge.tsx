import type { ApplicationStatus } from "../types";

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Shortlisted: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Interview: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Offer: "bg-green-500/20 text-green-300 border-green-500/30",
  Rejected: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function StatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}